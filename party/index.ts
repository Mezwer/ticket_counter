import type * as Party from "partykit/server";
import { InfoMessage, UpdateMessage } from "~/env/party";

export default class Server implements Party.Server {
  currTicket = 0;
  readonly storageIdPrefix = "user-";

  constructor(readonly party: Party.Party) {}

  async getTicketNumer(userId: string): Promise<number> {
    let ticketNum: number | undefined = await this.party.storage.get(this.storageIdPrefix + userId);
    if (ticketNum == undefined) {
      ticketNum = ++this.currTicket;
      await this.party.storage.put("currTicket", this.currTicket);
      await this.party.storage.put(this.storageIdPrefix + userId, ticketNum);
    }
    return ticketNum;
  }

  async onStart() {
    this.currTicket = (await this.party.storage.get("currTicket")) ?? 0;
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );

    const userId = new URL(ctx.request.url).searchParams.get("user_token") ?? "";
    // if userId is not in the ticketMap, add it
    const ticketNum = await this.getTicketNumer(userId);
    // send the ticket to the client
    const infoMessage = InfoMessage.parse({
      type: "info",
      ticket: ticketNum,
      total: this.currTicket,
    });

    conn.send(JSON.stringify(infoMessage));

    const updateMessage = UpdateMessage.parse({
      type: "update",
      total: this.currTicket,
    });

    this.party.broadcast(JSON.stringify(updateMessage), [conn.id]);
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id],
    );
  }
}

Server satisfies Party.Worker;

import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import PartySocket from "partysocket";
import { Show, createEffect, createSignal } from "solid-js";
import { FastSpinner } from "~/components/Spinner";
import { clientEnv } from "~/env/client";
import { Message } from "~/env/party";
import { getUserToken as getUserToken$ } from "~/util/auth";
import { showToast } from "~/util/toaster";
import TicketIcon from "~icons/heroicons/ticket";

type PageParams = {
  event_id: string;
};

export const route = {
  load: () => getUserToken$(),
} satisfies RouteDefinition;

export default function TicketPage() {
  const params = useParams<PageParams>();
  const getUserToken = createAsync(() => getUserToken$());

  const [ticketNum, setTicketNum] = createSignal<number>(-1);
  const [total, setTotal] = createSignal<number>(-1);

  createEffect(() => {
    const partySocket = new PartySocket({
      host: import.meta.env.DEV ? "localhost:1999" : clientEnv.VITE_PARTY_SOCKET,
      room: params.event_id,
      query: {
        user_token: getUserToken(),
      },
    });
    partySocket.addEventListener("message", (msg: { data: string }) => {
      const result = Message.safeParse(JSON.parse(msg.data));
      if (!result.success) return;
      switch (result.data.type) {
        case "info":
          setTicketNum(result.data.ticket);
          setTotal(result.data.total);
          break;
        case "update":
          setTotal(result.data.total);
          break;
      }
    });

    partySocket.addEventListener("close", () => {
      showToast({
        title: "Connection interrupted",
        description: "",
      });
    });

    return () => {
      partySocket.close();
    };
  });

  return (
    <main class="h-full w-full flex items-center justify-center text-neutral-900 dark:text-neutral-100">
      <div class="flex flex-row items-center space-x-6">
        <TicketIcon class="inline-block h-20 w-20 text-primary-600 dark:text-primary-500" />
        <Show
          when={ticketNum() != -1 && total() != -1}
          fallback={<FastSpinner show class="h-15 w-15 text-neutral-600 dark:text-neutral-400" />}
        >
          <h1 class="text-9xl font-bold">
            {ticketNum()}
            <span class="text-2xl text-neutral-600 dark:text-neutral-400">/ {total()}</span>
          </h1>
        </Show>
      </div>
    </main>
  );
}

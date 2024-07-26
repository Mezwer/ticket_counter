import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { createMiddleware } from "@solidjs/start/middleware";
import { verifyRequestOrigin } from "lucia";
import { appendHeader, getCookie, getHeader } from "vinxi/http";
import { createLuciaClient } from "./lib/auth";
import { env } from "./util/cf";

export default createMiddleware({
  onRequest: async (event) => {
    const ev = event.nativeEvent;

    // add Prisma client to locals
    const adapter = new PrismaD1(env(event).DB);
    const prisma = (event.locals.db = new PrismaClient({ adapter }));

    // Lucia auth
    if (ev.node.req.method !== "GET") {
      const originHeader = getHeader(ev, "Origin") ?? null;
      const hostHeader = getHeader(ev, "Host") ?? null;
      if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
        ev.node.res.writeHead(403).end();
        return;
      }
    }

    const lucia = (event.locals.lucia = createLuciaClient(prisma));

    const sessionId = getCookie(ev, lucia.sessionCookieName) ?? null;
    if (!sessionId) {
      ev.context.session = null;
      ev.context.user = null;
      return;
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      appendHeader(ev, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    }
    if (!session) {
      appendHeader(ev, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
    }
    ev.context.session = session;
  },
});

// Extend locals type
declare module "@solidjs/start/server" {
  interface RequestEventLocals {
    db: PrismaClient;
    lucia: ReturnType<typeof createLuciaClient>;
  }
}

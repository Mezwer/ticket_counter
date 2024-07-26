import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import type { PrismaClient } from "@prisma/client";
import { redirect } from "@solidjs/router";
import { generateCodeVerifier, generateState, Google } from "arctic";
import { Lucia } from "lucia";
import { getRequestEvent } from "solid-js/web";
import { type HTTPEvent, setCookie } from "vinxi/http";
import { env } from "~/util/cf";

export const createLuciaClient = (client: PrismaClient) => {
  const adapter = new PrismaAdapter(client.session, client.user);

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: import.meta.env.PROD,
      },
    },
  });
};

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createLuciaClient>;
  }
}

export const google = () => {
  // todo: move into helper
  const urlInfo = new URL(getRequestEvent()!.request.url);
  const redirectUrl = `${urlInfo.protocol}//${urlInfo.host}/login/google/callback`;
  console.log(redirectUrl);

  return new Google(env().GOOGLE_CLIENT_ID, env().GOOGLE_CLIENT_SECRET, redirectUrl);
};

export async function googleRedirectUrl(ev: HTTPEvent) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google().createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  setCookie(ev, "google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  setCookie(ev, "google_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return redirect(url.toString());
}

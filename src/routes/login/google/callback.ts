import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { appendHeader, createError, getCookie, getQuery, sendRedirect } from "vinxi/server";

import type { APIEvent } from "@solidjs/start/server";
import { google } from "~/lib/auth";

export async function GET(event: APIEvent) {
  const ev = event.nativeEvent;
  const lucia = event.locals.lucia;
  const db = event.locals.db;

  const query = getQuery(ev);
  const code = query.code?.toString();
  const state = query.state?.toString();

  const storedState = getCookie(ev, "google_oauth_state");
  const storedCodeVerifier = getCookie(ev, "google_oauth_code_verifier");
  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    throw createError({
      status: 400,
    });
  }

  const googleAuth = google();

  try {
    const tokens = await googleAuth.validateAuthorizationCode(code, storedCodeVerifier);
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const user = (await response.json()) as GoogleUser;
    console.log(user);
    // const existingUser = db.prepare("SELECT * FROM user WHERE github_id = ?").get(githubUser.id);
    const existingUser = await db.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      appendHeader(ev, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
      return sendRedirect(ev, "/");
    }

    const userId = generateId(15);
    // db.prepare("INSERT INTO user (id, github_id, username) VALUES (?, ?, ?)").run(
    //   userId,
    //   githubUser.id,
    //   githubUser.login,
    // );
    await db.user.create({
      data: {
        id: userId,
        email: user.email,
        name: user.name,
      },
    });

    const session = await lucia.createSession(userId, {});
    appendHeader(ev, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    return sendRedirect(ev, "/");
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      throw createError({
        status: 400,
      });
    }
    console.log(e);
    throw createError({
      status: 500,
    });
  }
}
interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  hd: string;
}

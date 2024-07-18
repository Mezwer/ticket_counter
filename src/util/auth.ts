import { cache } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "vinxi/http";
import { nanoid } from "./nanoid";

// eslint-disable-next-line @typescript-eslint/require-await
export const getUserToken = cache(async () => {
  "use server";
  const req = getRequestEvent();

  if (!req || !req.request) return;

  const userToken = getCookie("user_token");
  if (!userToken) {
    const newToken = nanoid(10);
    req.response.headers.append("Set-Cookie", `user_token=${newToken}`);
    return newToken;
  }

  return userToken;
}, "userToken");

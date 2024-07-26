import { cache, type RouteDefinition } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { googleRedirectUrl } from "~/lib/auth";

export async function GET(event: APIEvent) {
  return googleRedirectUrl(event.nativeEvent);
}

const cachedAuthRedirect = cache(() => {
  "use server";
  return googleRedirectUrl(getRequestEvent()!.nativeEvent);
}, "google-auth-redirect");

export const route = {
  preload: () => cachedAuthRedirect(),
} satisfies RouteDefinition;

export default () => {
  return <div class="text-neutral-900 dark:text-neutral-100">Logging in with google...</div>;
};

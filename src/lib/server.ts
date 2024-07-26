import { getRequestEvent } from "solid-js/web";

export function getSession() {
  const event = getRequestEvent()!;
  return event.nativeEvent.context.session;
}

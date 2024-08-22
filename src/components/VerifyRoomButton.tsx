import { Show, createSignal } from "solid-js";
import XMark from "~icons/heroicons/x-mark";
import CheckMark from "~icons/heroicons/check";

export const VerifyRoomButton = () => {
  const [verified, setVerified] = createSignal<boolean>(false);
  const styles = [
    "m-0 w-10 bg-red-600/85 p-0 text-black outline-none dark:bg-neutral-700/50 hover:bg-red-600/45 dark:bg-red-600 hover:text-neutral-700 btn dark:hover:(bg-red-500/85 text-black)",
    "m-0 w-10 bg-green-600/85 p-0 text-black outline-none dark:bg-green-600/85 hover:bg-green-600/50 dark:bg-green-600 hover:text-neutral-700 btn dark:hover:(bg-green-500/85 text-black)",
  ];
  
  return (
    <>
      <button class={verified() ? styles[1] : styles[0]} onClick={() => setVerified(!verified())}>
        <Show when={verified()} fallback={<XMark class="text-lg" />}>
          <CheckMark />
        </Show>
      </button>
    </>
  );
};

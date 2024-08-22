import Plus from "~icons/heroicons/plus";
import Minus from "~icons/heroicons/minus";
import type { VoidComponent } from "solid-js";

interface Actions {
  [key: string]: () => void;
}

export const ActionButtons: VoidComponent<Actions> = (props) => {
  return (
    <>
      <div onClick={() => props.pAction()} class="inline-block align-middle">
        <Plus class="cursor-pointer rounded-md transition delay-10 ease hover:bg-zinc-400 dark:text-white" />
      </div>
      <div onClick={() => props.mAction()} class="inline-block align-middle">
        <Minus class="cursor-pointer rounded-md transition delay-10 ease hover:bg-zinc-400 dark:text-white" />
      </div>
    </>
  );
};

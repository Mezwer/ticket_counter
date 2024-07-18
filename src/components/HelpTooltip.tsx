import clsx from "clsx";
import type { JSX } from "solid-js";
import { splitProps, type ComponentProps, type ParentComponent } from "solid-js";
import HelpIcon from "~icons/heroicons/question-mark-circle";
import { Tooltip } from "./Tooltip";

export const HelpTooltip: ParentComponent<ComponentProps<"svg"> & { tooltipText: JSX.Element }> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <Tooltip
      as={HelpIcon}
      placement="top"
      openDelay={75}
      class={clsx("inline-block w-5 h-5 dark:text-zinc-400 text-zinc-600", local.class)}
      {...others}
    ></Tooltip>
  );
};

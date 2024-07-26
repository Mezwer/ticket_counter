import { createSignal, type VoidComponent } from "solid-js";
import { QRCodeCanvas } from "solid-qr-code";
import QRCodeIcon from "~icons/heroicons/qr-code";
import { Dialog } from "./Dialog";
import { useTheme } from "./ThemeController";

interface QRCodeButtonProps {
  link: string;
}

export const QRCodeButton: VoidComponent<QRCodeButtonProps> = (props) => {
  const [dialogOpen, setDialogOpen] = createSignal(false);

  return (
    <>
      <button
        onClick={[setDialogOpen, true]}
        class="m-0 w-10 bg-neutral-200/50 p-0 text-neutral-500 outline-none dark:bg-neutral-700/50 hover:bg-neutral-300/60 dark:text-neutral-400 hover:text-neutral-800 btn dark:hover:bg-neutral-600/60 dark:hover:text-neutral-100"
      >
        <QRCodeIcon class="h-6 w-6" />
      </button>
      <Dialog open={dialogOpen()} onOpenChange={setDialogOpen} title="QR Code">
        <div class="p-2">
          <QRCodeCanvas
            size={300}
            level="medium"
            bgColor="transparent"
            fgColor={useTheme().theme() == "dark" ? "#fff" : "#000"}
            value={props.link}
            title={"Share link"}
          ></QRCodeCanvas>
        </div>
      </Dialog>
    </>
  );
};

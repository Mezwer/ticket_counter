import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";

import { Toast } from "@kobalte/core";
import type { RouteSectionProps } from "@solidjs/router";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { QRCodeButton } from "./components/QRCodeButton";
import { ThemeControllerButton, ThemeProvider } from "./components/ThemeController";

const Root = (prop: RouteSectionProps) => {
  return (
    <Suspense>
      <ThemeProvider>
        <div class="absolute right-0 top-0 flex items-center gap-2 p-4">
          <QRCodeButton link={location.href}></QRCodeButton>
          <ThemeControllerButton />
        </div>
        {prop.children}
        <Toast.Region>
          <Toast.List class="fixed bottom-0 right-0 z-9999 max-w-full w-100 flex flex-col gap-2 p-4 outline-none" />
        </Toast.Region>
      </ThemeProvider>
    </Suspense>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Router root={Root}>
        <FileRoutes />
      </Router>
    </ThemeProvider>
  );
}

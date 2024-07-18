import { Navigate } from "@solidjs/router";
import { nanoid } from "~/util/nanoid";

export default function NewPage() {
  return <Navigate href={`/${nanoid(9)}`} />;
}

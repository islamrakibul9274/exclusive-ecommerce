import { Suspense } from "react";
import Contact from "../../../src/screens/Contact";
export const metadata = { title: "Get in touch" };
export default function Page() {
  return (
    <Suspense
      fallback={<div className="page-loading">Getting things ready…</div>}
    >
      <Contact />
    </Suspense>
  );
}

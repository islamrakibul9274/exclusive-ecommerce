import { Suspense } from "react";
import SignUp from "../../../src/screens/SignUp";
export const metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <Suspense
      fallback={<div className="page-loading">Getting things ready…</div>}
    >
      <SignUp />
    </Suspense>
  );
}

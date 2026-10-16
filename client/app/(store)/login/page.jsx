import { Suspense } from "react";
import Login from "../../../src/screens/Login";
export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <Suspense
      fallback={<div className="page-loading">Getting things ready…</div>}
    >
      <Login />
    </Suspense>
  );
}

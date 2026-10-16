import { Suspense } from "react";
import Account from "../../../src/screens/Account";
export const metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <Suspense
      fallback={<div className="page-loading">Getting things ready…</div>}
    >
      <Account />
    </Suspense>
  );
}

import { Suspense } from "react";
import Shop from "../../../src/screens/Shop";
export const metadata = { title: "Shop the collection" };
export default async function Page({ searchParams }) {
  const { q = "" } = await searchParams;
  return (
    <Suspense
      fallback={<div className="page-loading">Getting things ready…</div>}
    >
      <Shop key={q} />
    </Suspense>
  );
}

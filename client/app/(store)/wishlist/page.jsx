import Wishlist from "../../../src/screens/Wishlist";
export const metadata = {
  title: "Your wishlist",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Wishlist />;
}

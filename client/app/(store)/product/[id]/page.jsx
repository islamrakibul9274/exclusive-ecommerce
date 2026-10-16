import ProductDetails from "../../../../src/screens/ProductDetails";
export default async function Page({ params }) {
  const { id } = await params;
  return <ProductDetails key={id} />;
}

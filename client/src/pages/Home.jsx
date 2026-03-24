import BestSelling from '../components/BestSelling';
import Categories from '../components/Categories';
import ExploreProducts from '../components/ExploreProducts';
import Features from '../components/Features';
import FlashSales from '../components/FlashSales';
import Hero from '../components/Hero';
import NewArrival from '../components/NewArrival';
import PromoBanner from '../components/PromoBanner';

const Home = () => {
  return (
    <main className="max-w-[1140px] mx-auto px-4 pb-20">
      <Hero />
      <FlashSales />
      <Categories />
      <BestSelling />
      <PromoBanner />
      <ExploreProducts />
      <NewArrival />
      <Features />
    </main>
  );
};

export default Home;
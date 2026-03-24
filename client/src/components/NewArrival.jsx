import React from 'react';
import { Link } from 'react-router-dom';

const NewArrival = () => {
  return (
    <section className="mt-20 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
        <h3 className="text-red-500 font-bold text-base">Featured</h3>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-wider text-black">
          New Arrival
        </h2>
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[600px]">
        
        {/* Left Block: PS5 */}
        <div className="bg-black rounded-sm relative flex items-end justify-center pt-8 overflow-hidden h-[300px] lg:h-auto group">
          <img src="/ps5.png" alt="PlayStation 5" className="h-[90%] object-contain group-hover:scale-105 transition-transform duration-500 z-10" />
          <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-2xl font-semibold mb-3 tracking-wide">PlayStation 5</h3>
            <p className="text-gray-300 text-sm mb-4 max-w-xs">Black and White version of the PS5 coming out on sale.</p>
            <Link to="/" className="text-white font-medium underline underline-offset-8 hover:text-gray-300">Shop Now</Link>
          </div>
        </div>

        {/* Right Blocks Container */}
        <div className="flex flex-col gap-8">
          
          {/* Top Right: Women's Collection */}
          <div className="bg-[#0D0D0D] rounded-sm relative flex items-end justify-end overflow-hidden h-[284px] group">
            <img src="/woman-collection.png" alt="Women's Collections" className="h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-2xl font-semibold mb-3 tracking-wide">Women's Collections</h3>
              <p className="text-gray-300 text-sm mb-4 max-w-[250px]">Featured woman collections that give you another vibe.</p>
              <Link to="/" className="text-white font-medium underline underline-offset-8 hover:text-gray-300">Shop Now</Link>
            </div>
          </div>

          {/* Bottom Right: Speakers & Perfume Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-[284px]">
            {/* Speakers */}
            <div className="bg-[#2D2D2D] rounded-sm relative flex items-center justify-center overflow-hidden group p-6">
              {/* Fake glowing background */}
              <div className="absolute w-[150px] h-[150px] bg-white/20 blur-[50px] rounded-full"></div>
              <img src="/speakers.png" alt="Speakers" className="h-[80%] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-lg font-semibold mb-1 tracking-wide">Speakers</h3>
                <p className="text-gray-300 text-xs mb-2">Amazon wireless speakers</p>
                <Link to="/" className="text-white text-sm font-medium underline underline-offset-4 hover:text-gray-300">Shop Now</Link>
              </div>
            </div>

            {/* Perfume */}
            <div className="bg-[#2D2D2D] rounded-sm relative flex items-center justify-center overflow-hidden group p-6">
              <div className="absolute w-[150px] h-[150px] bg-white/20 blur-[50px] rounded-full"></div>
              <img src="/perfume.png" alt="Perfume" className="h-[80%] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-lg font-semibold mb-1 tracking-wide">Perfume</h3>
                <p className="text-gray-300 text-xs mb-2">GUCCI INTENSE OUD EDP</p>
                <Link to="/" className="text-white text-sm font-medium underline underline-offset-4 hover:text-gray-300">Shop Now</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewArrival;
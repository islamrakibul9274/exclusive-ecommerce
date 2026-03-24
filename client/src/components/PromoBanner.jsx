import React from 'react';

const PromoBanner = () => {
  return (
    <section className="mt-24 mb-20 bg-black rounded-sm flex flex-col md:flex-row items-center justify-between p-8 md:p-14 font-sans overflow-hidden relative">
      
      {/* Left Text & Timer */}
      <div className="text-white flex-1 z-10">
        <span className="text-[#00FF66] font-semibold text-sm">Categories</span>
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-wide my-8">
          Enhance Your <br /> Music Experience
        </h2>
        
        {/* Circular Timers */}
        <div className="flex gap-4 mb-10">
          <div className="w-16 h-16 bg-white text-black rounded-full flex flex-col items-center justify-center">
            <span className="font-bold text-sm leading-none">23</span>
            <span className="text-[10px]">Hours</span>
          </div>
          <div className="w-16 h-16 bg-white text-black rounded-full flex flex-col items-center justify-center">
            <span className="font-bold text-sm leading-none">05</span>
            <span className="text-[10px]">Days</span>
          </div>
          <div className="w-16 h-16 bg-white text-black rounded-full flex flex-col items-center justify-center">
            <span className="font-bold text-sm leading-none">59</span>
            <span className="text-[10px]">Minutes</span>
          </div>
          <div className="w-16 h-16 bg-white text-black rounded-full flex flex-col items-center justify-center">
            <span className="font-bold text-sm leading-none">35</span>
            <span className="text-[10px]">Seconds</span>
          </div>
        </div>

        <button className="cursor-pointer bg-[#00FF66] text-white px-10 py-3.5 rounded text-sm font-medium hover:bg-green-500 transition-colors">
          Buy Now!
        </button>
      </div>

      {/* Right Image with glowing drop shadow */}
      <div className="flex-1 relative mt-10 md:mt-0 z-10 flex justify-center">
        {/* The glowing effect behind the speaker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-white/20 blur-[100px] rounded-full z-0"></div>
        <img 
          src="/speaker.png" 
          alt="JBL Boombox" 
          className="w-[80%] md:w-full object-contain relative z-10" 
        />
      </div>
    </section>
  );
};

export default PromoBanner;
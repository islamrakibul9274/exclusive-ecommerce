import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { AiOutlineShop } from 'react-icons/ai';
import { BiDollarCircle, BiShoppingBag } from 'react-icons/bi';
import { FaSackDollar } from 'react-icons/fa6';
import Features from '../components/Features'; // Reusing our component!

const About = () => {
  const stats = [
    { icon: <AiOutlineShop size={32} />, value: "10.5k", label: "Sallers active our site", active: false },
    { icon: <BiDollarCircle size={32} />, value: "33k", label: "Mopnthly Produduct Sale", active: true },
    { icon: <BiShoppingBag size={32} />, value: "45.5k", label: "Customer active in our site", active: false },
    { icon: <FaSackDollar size={32} />, value: "25k", label: "Anual grass sale in our site", active: false },
  ];

  const team = [
    { name: "Tom Cruise", role: "Founder & Chairman", img: "/tom.png" },
    { name: "Emma Watson", role: "Managing Director", img: "/emma.png" },
    { name: "Will Smith", role: "Product Designer", img: "/will.png" },
  ];

  return (
    <div className="font-sans">
      <div className="max-w-[1170px] mx-auto px-4 py-12">
        <div className="text-sm text-gray-500 mb-10">
          <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">About</span>
        </div>

        {/* Story Section */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 mb-24">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-wider text-black mb-10">Our Story</h1>
            <p className="text-black leading-relaxed mb-6">
              Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.
            </p>
            <p className="text-black leading-relaxed">
              Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.
            </p>
          </div>
          <div className="w-full lg:w-1/2 bg-[#EB7EA8] rounded-l-md overflow-hidden flex justify-end min-h-[400px]">
            <img src="/about-girls.png" alt="Our Story" className="object-cover  " />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, idx) => (
            <div key={idx} className={`border rounded flex flex-col items-center justify-center py-8 px-4 transition-colors cursor-pointer ${stat.active ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-black border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${stat.active ? 'bg-white/30' : 'bg-gray-300 group-hover:bg-white/30'}`}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${stat.active ? 'bg-white text-black' : 'bg-black text-white'}`}>
                  {stat.icon}
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">{stat.value}</h2>
              <p className="text-sm text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {team.map((member, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="bg-[#F5F5F5] rounded-t-md h-[400px] flex items-end justify-center overflow-hidden mb-6 pt-8 px-8">
                <img src={member.img} alt={member.name} className="h-[90%] object-cover" />
              </div>
              <h3 className="text-2xl font-medium tracking-wide text-black mb-2">{member.name}</h3>
              <p className="text-black mb-4">{member.role}</p>
              <div className="flex gap-4 text-black text-xl">
                <FiTwitter className="cursor-pointer hover:text-red-500" />
                <FiInstagram className="cursor-pointer hover:text-red-500" />
                <FiLinkedin className="cursor-pointer hover:text-red-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Strip reused from Home Page! */}
      <div className="max-w-[1170px] mx-auto pb-20">
         <Features />
      </div>
    </div>
  );
};

export default About;
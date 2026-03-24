import React from 'react';
import { TbTruckDelivery, TbShieldCheck } from 'react-icons/tb';
import { FiHeadphones } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <TbTruckDelivery className="text-3xl text-white" />,
      title: "FREE AND FAST DELIVERY",
      desc: "Free delivery for all orders over $140"
    },
    {
      icon: <FiHeadphones className="text-3xl text-white" />,
      title: "24/7 CUSTOMER SERVICE",
      desc: "Friendly 24/7 customer support"
    },
    {
      icon: <TbShieldCheck className="text-3xl text-white" />,
      title: "MONEY BACK GUARANTEE",
      desc: "We return money within 30 days"
    }
  ];

  return (
    <section className="my-24 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 font-sans">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          {/* Outer gray circle, inner black circle */}
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
              {feature.icon}
            </div>
          </div>
          <h4 className="font-bold text-lg text-black tracking-wide mb-2">{feature.title}</h4>
          <p className="text-sm text-gray-500 font-medium">{feature.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default Features;
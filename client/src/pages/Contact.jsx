import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="max-w-[1170px] mx-auto px-4 py-12 font-sans">
      <div className="text-sm text-gray-500 mb-12">
        <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">Contact</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Info Card */}
        <div className="w-full lg:w-1/3 bg-white shadow-[0px_1px_13px_rgba(0,0,0,0.05)] rounded p-8 flex flex-col gap-8">
          <div className="border-b border-gray-300 pb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-500 text-white p-3 rounded-full"><FiPhone size={20} /></div>
              <h3 className="font-medium text-black">Call To Us</h3>
            </div>
            <p className="text-sm text-black mb-4">We are available 24/7, 7 days a week.</p>
            <p className="text-sm text-black">Phone: +8801611112222</p>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-500 text-white p-3 rounded-full"><FiMail size={20} /></div>
              <h3 className="font-medium text-black">Write To US</h3>
            </div>
            <p className="text-sm text-black mb-4">Fill out our form and we will contact you within 24 hours.</p>
            <p className="text-sm text-black mb-4">Emails: customer@exclusive.com</p>
            <p className="text-sm text-black">Emails: support@exclusive.com</p>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full lg:w-2/3 bg-white shadow-[0px_1px_13px_rgba(0,0,0,0.05)] rounded p-8">
          <form className="flex flex-col gap-8 h-full">
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" placeholder="Your Name *" required className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 outline-none focus:ring-1 focus:ring-red-500" />
              <input type="email" placeholder="Your Email *" required className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 outline-none focus:ring-1 focus:ring-red-500" />
              <input type="tel" placeholder="Your Phone *" required className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 outline-none focus:ring-1 focus:ring-red-500" />
            </div>
            <textarea placeholder="Your Massage" required className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 outline-none focus:ring-1 focus:ring-red-500 flex-1 min-h-[200px] resize-none"></textarea>
            <div className="flex justify-end">
              {/* Corrected the spelling of Massage to Message based on standard English, though your PDF says Massage */}
              <button type="submit" className="bg-red-500 text-white px-10 py-4 rounded text-sm font-medium hover:bg-red-600 transition-colors">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
import Layout from './Layout';
import { Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <Layout>
      
      {/* Page Hero Header */}
      <section className="relative dark-gradient-bg py-20 text-center border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-condensed tracking-wider text-white">
            CONTACT <span className="yellow-gradient-text">SUPPORT</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto font-medium">
            Reach out to our dispatch desk or customer service team 24/7.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-24 bg-gradient-to-b from-[#0d2847] to-[#071b30]">
        <div className="container mx-auto px-4 max-w-3xl">
          
          <div className="glass-panel p-10 md:p-16 rounded-3xl border border-white/5 border-t-2 border-t-yellow-400/30 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-400/5 rounded-full blur-[60px]" />
            
            <div className="space-y-6 max-w-xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-4xl font-condensed text-white uppercase tracking-wider">
                OPERATIONAL DESK
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Have a specific itinerary or need a custom multi-destination quotation? Our dispatch agents are ready to assist you via email 24/7.
              </p>
              
              <div className="h-px bg-white/10 my-8" />
              
              <div className="space-y-6 text-left max-w-xl mx-auto">
                {/* Email */}
                <div className="flex items-center space-x-6 bg-white/[0.01] border border-white/5 p-6 rounded-2xl hover:border-yellow-400/20 transition-all duration-300 shadow-lg hover:scale-[1.01]">
                  <div className="bg-yellow-400/10 p-4 rounded-xl text-yellow-400 border border-yellow-400/20 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Email Support</h4>
                    <a href="mailto:Contact@ehta.net" className="text-lg md:text-xl font-bold text-white mt-0.5 hover:text-yellow-400 transition-colors block truncate">
                      Contact@ehta.net
                    </a>
                    <p className="text-[10px] text-yellow-400/60 font-semibold uppercase tracking-wider mt-0.5">Response within 1-2 hours</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center space-x-6 bg-white/[0.01] border border-white/5 p-6 rounded-2xl hover:border-yellow-400/20 transition-all duration-300 shadow-lg hover:scale-[1.01]">
                  <div className="bg-yellow-400/10 p-4 rounded-xl text-yellow-400 border border-yellow-400/20 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Operating Hours</h4>
                    <p className="text-lg md:text-xl font-bold text-white mt-0.5">24/7/365 ACTIVE</p>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">Open Holidays & Weekends</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </Layout>
  );
};

export default Contact;

import Layout from './Layout';
import { ShieldCheck, FileText, AlertCircle, Phone } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <Layout>
      
      {/* Page Hero Header */}
      <section className="relative dark-gradient-bg py-20 text-center border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-condensed tracking-wider text-white">
            TERMS & <span className="yellow-gradient-text">CONDITIONS</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-24 bg-gradient-to-b from-[#0d2847] to-[#071b30]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            
            {/* Inner Header Icon */}
            <div className="bg-gray-950/60 p-8 border-b border-white/5 text-center flex items-center justify-center gap-3">
              <FileText size={24} className="text-yellow-400" />
              <h2 className="text-white font-condensed tracking-widest font-black uppercase text-base mt-1">EHTA OPERATOR COMPLIANCE</h2>
            </div>

            {/* Clauses */}
            <div className="p-8 md:p-12 space-y-10 text-left">
              
              <section className="space-y-3">
                <h3 className="text-lg font-condensed text-white uppercase tracking-wider flex items-center">
                  <ShieldCheck className="text-yellow-400 mr-2.5 shrink-0" size={18} /> 
                  <span>1. Booking & Instant Quotes</span>
                </h3>
                <div className="text-gray-400 space-y-2.5 text-xs leading-relaxed">
                  <p>1.1. All bookings registered on the Ehta online platform are subject to operator dispatch availability. You must be at least 18 years of age to submit a binding booking request.</p>
                  <p>1.2. The prices quoted on our platform are fixed and calculated based on direct routing distance. Intermediate route swaps, extra pickups, or deviations may update final fare rates.</p>
                  <p>1.3. For corporate corporate accounts, invoices are issued on a 30-day payment schedule unless distinct credit terms have been authorized in writing.</p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-condensed text-white uppercase tracking-wider flex items-center">
                  <AlertCircle className="text-yellow-400 mr-2.5 shrink-0" size={18} /> 
                  <span>2. Cancellation Policy & Failures</span>
                </h3>
                <div className="text-gray-400 space-y-2.5 text-xs leading-relaxed">
                  <p>2.1. Cancellations processed more than 24 hours prior to the scheduled pickup time incur no cancellation charges.</p>
                  <p>2.2. Cancellations finalized within 24 hours of the pickup time may be subject to a nominal vehicle dispatch handling fee.</p>
                  <p>2.3. If a vehicle arrives at the requested pickup address and the passenger fails to emerge ("No Show") after 15 minutes of free waiting, the full quote fare remains chargeable.</p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-condensed text-white uppercase tracking-wider flex items-center">
                  <FileText className="text-yellow-400 mr-2.5 shrink-0" size={18} /> 
                  <span>3. Passenger Behavior & Cleaning fees</span>
                </h3>
                <div className="text-gray-400 space-y-2.5 text-xs leading-relaxed">
                  <p>3.1. Passengers are responsible for choosing the appropriate vehicle class (Saloon, Estate, Executive, Minibus) corresponding to their exact luggage weight and count.</p>
                  <p>3.2. Child baby seats must be declared at the booking stage. Securing child safety harnesses is the primary responsibility of the parent or guardian under UK traffic codes.</p>
                  <p>3.3. Any mechanical damage, soiling, or interior seat spills caused by passenger negligence will lead to a valeting charge of up to £150.</p>
                </div>
              </section>

              {/* Support panel */}
              <div className="mt-12 p-8 bg-yellow-400/[0.02] rounded-2xl border border-yellow-400/10 text-center space-y-4">
                <h3 className="text-base font-condensed text-white uppercase tracking-wider">QUESTIONS REGARDING COMPLIANCE?</h3>
                <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">Our administration office is available during business hours to answer questions regarding licensing and passenger rights.</p>
                <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
                  For customer complaints, please email <a href="mailto:Contact@ehta.net" className="text-yellow-400 font-bold hover:underline">Contact@ehta.net</a>.
                </p>
                <div className="pt-2">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-condensed tracking-widest font-black py-3 px-8 rounded-xl transition-all hover:scale-[1.01] text-xs"
                  >
                    <Phone size={14} className="mr-2" /> CONTACT COMPLIANCE OFFICE
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default TermsAndConditions;

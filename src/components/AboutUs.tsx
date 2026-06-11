import Layout from './Layout';
import { ShieldCheck, Clock, Star, CheckCircle } from 'lucide-react';

const AboutUs = () => {
  return (
    <Layout>
      
      {/* Page Hero Header */}
      <section className="relative dark-gradient-bg py-20 text-center border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-condensed tracking-wider text-white">
            ABOUT <span className="yellow-gradient-text">EHTA</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto font-medium">
            Your premium private hire transportation network delivering safety and fixed rates 24/7.
          </p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-24 bg-gradient-to-b from-[#0d2847] to-[#071b30]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="text-left space-y-6">
              <h2 className="text-3xl font-condensed text-white uppercase tracking-wider border-l-4 border-yellow-400 pl-4">
                Our Fleet Mission
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                At Ehta, we are committed to elevating standard private transport. Our goal is to provide a seamless, premium ride flow by marrying modern step-by-step booking technology with reliable regional dispatch coordinates.
              </p>
              <p className="text-gray-400 leading-relaxed text-xs">
                Since our launch, we have grown into one of the country's reliable transit operators, managing thousands of airport runs and local journeys monthly. Whether you need a corporate saloon or an 8-seater minibus, our vetting standards remain outstanding.
              </p>
              
              {/* Checkmarks Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold uppercase tracking-wider text-gray-300">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle className="text-yellow-400" size={16} />
                  <span>Licensed Operators</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle className="text-yellow-400" size={16} />
                  <span>DBS Vetted Drivers</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle className="text-yellow-400" size={16} />
                  <span>Meticulous Vehicles</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle className="text-yellow-400" size={16} />
                  <span>Fixed-Quote Fares</span>
                </div>
              </div>
            </div>

            {/* Illustration image with shadow overlays */}
            <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
              <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-300" />
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800" 
                alt="Ehta Chauffeur Driver" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Corporate Statistics Metrics */}
      <section className="py-16 bg-gray-950 border-y border-white/5 relative">
        <div className="absolute inset-0 blueprint-grid opacity-5" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div>
              <div className="text-3xl md:text-5xl font-condensed font-black yellow-gradient-text mb-2">10K+</div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Completed Journeys</div>
            </div>
            
            <div>
              <div className="text-3xl md:text-5xl font-condensed font-black yellow-gradient-text mb-2">50+</div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Vetted Chauffeurs</div>
            </div>
            
            <div>
              <div className="text-3xl md:text-5xl font-condensed font-black yellow-gradient-text mb-2">15+</div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Years Experience</div>
            </div>
            
            <div>
              <div className="text-3xl md:text-5xl font-condensed font-black yellow-gradient-text mb-2">4.9</div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Customer Star Rating</div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-[#0d2847]">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-20">
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-condensed uppercase tracking-wider">OUR OPERATIONAL VALUES</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Value 1 */}
            <div className="p-8 rounded-3xl glass-panel text-left border border-white/5 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.01] group">
              <div className="bg-yellow-400/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-yellow-400/20 text-yellow-400 group-hover:scale-105 transition-all">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-lg font-condensed text-white tracking-wider uppercase mb-3">INTEGRITY & SAFETY</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Passenger safety coordinates all dispatch policies. Every driver is verified by local licensing councils and possesses valid private hire insurance cover.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 rounded-3xl glass-panel text-left border border-white/5 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.01] group">
              <div className="bg-yellow-400/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-yellow-400/20 text-yellow-400 group-hover:scale-105 transition-all">
                <Clock size={28} />
              </div>
              <h3 className="text-lg font-condensed text-white tracking-wider uppercase mb-3">REAL-TIME PUNCTUALITY</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Punctual logistics are our standard. Advanced dispatch route maps optimize travel paths, bypass high density traffic zones, and guarantee on-time drop-offs.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 rounded-3xl glass-panel text-left border border-white/5 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.01] group">
              <div className="bg-yellow-400/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-yellow-400/20 text-yellow-400 group-hover:scale-105 transition-all">
                <Star size={28} />
              </div>
              <h3 className="text-lg font-condensed text-white tracking-wider uppercase mb-3">HIGH-CLASS COMFORT</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We maintain high vehicle standards. Cars are valeted and detailed daily. No smoke smells, clean floorboards, and comfortable climate control options.
              </p>
            </div>

          </div>
        </div>
      </section>

    </Layout>
  );
};

export default AboutUs;

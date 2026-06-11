import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Contact from './components/Contact';
import TermsAndConditions from './components/TermsAndConditions';
import { ShieldCheck, Clock, MapPin, Award, Mail, BadgeCheck, Sparkles, Star, Users } from 'lucide-react';

const HomePage = () => (
  <Layout>
    
    {/* Ultra-Premium Hero Section */}
    <section className="relative dark-gradient-bg py-24 md:py-32 overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      
      {/* Ambient Spotlight Glows */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 border border-yellow-400/25 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-2">
                          <Sparkles size={12} className="animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-condensed tracking-wider text-white leading-none">
            RELIABLE PRIVATE HIRE <span className="yellow-gradient-text">CAR SERVICE</span> FOR YOUR JOURNEY
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Flat-rate airport transfers, VIP corporate travels, and prompt local journeys. Book online with instant fixed price calculations.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400 pt-4">
            <div className="flex items-center bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl">
              <ShieldCheck className="text-yellow-400 mr-2 shrink-0" size={16} /> 
              <span>VETTED DRIVERS</span>
            </div>
            <div className="flex items-center bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl">
              <Clock className="text-yellow-400 mr-2 shrink-0" size={16} /> 
              <span>24/7 ON-TIME SERVICE</span>
            </div>
            <div className="flex items-center bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl">
              <Award className="text-yellow-400 mr-2 shrink-0" size={16} /> 
              <span>FIXED RATES ONLY</span>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Booking Widget Form Section */}
    <section id="book" className="py-20 px-4 relative z-20 bg-gradient-to-b from-[#0d2847] to-[#071b30]">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-yellow-400">
            <Sparkles size={10} /> INSTANT ONLINE ESTIMATE
          </div>
          <h2 className="text-3xl md:text-5xl font-condensed text-white uppercase tracking-wider">SECURE YOUR FARE IN SECONDS</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Enter route details below, select your vehicle class, and lock in your price. No hidden fees or unexpected surge charges.
          </p>
          
          {/* Trust Factors Row */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3">
              <BadgeCheck className="text-yellow-400 shrink-0" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Guaranteed Prices</span>
            </div>
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3">
              <Clock className="text-yellow-400 shrink-0" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Instant Confirm</span>
            </div>
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3">
              <BadgeCheck className="text-yellow-400 shrink-0" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">No Cancellation</span>
            </div>
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3">
              <ShieldCheck className="text-yellow-400 shrink-0" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Fully Insured Fleet</span>
            </div>
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3">
              <BadgeCheck className="text-yellow-400 shrink-0" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Reliable Drivers</span>
            </div>
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3">
              <Clock className="text-yellow-400 shrink-0" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">No Surge Prices</span>
            </div>
          </div>
        </div>

        {/* The Core Form */}
        <BookingForm />

        {/* Explanatory Cards */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl glass-panel p-6 shadow-xl border border-white/5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/[0.02] rounded-full blur-2xl" />
            <div className="text-yellow-400 font-condensed tracking-wider text-sm font-bold uppercase mb-3">WHY BOOK EHTA?</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Unlike ridesharing networks, we do not hike fares based on weather or demand. Once you book a private vehicle with Ehta, the quote is fixed and secure.
            </p>
          </div>
          <div className="rounded-3xl glass-panel p-6 shadow-xl border border-white/5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/[0.02] rounded-full blur-2xl" />
            <div className="text-yellow-400 font-condensed tracking-wider text-sm font-bold uppercase mb-3">POPULAR SERVICES</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Serving airports including London Heathrow (LHR), Gatwick (LGW), Birmingham (BHX), and Manchester (MAN). Executive vehicles and family baby-seats available.
            </p>
          </div>
          <div className="rounded-3xl bg-yellow-400/5 p-6 shadow-xl border border-yellow-400/20 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/[0.04] rounded-full blur-2xl" />
            <div className="text-yellow-400 font-condensed tracking-wider text-sm font-bold uppercase mb-3">BOOKING ASSURANCE</div>
            <p className="text-xs text-gray-300 leading-relaxed">
              All bookings are monitored by our dispatch desk. Flights are tracked in real-time so that drivers are positioned correctly for your exact landing time.
            </p>
          </div>
        </div>

      </div>
    </section>

    {/* Elegant Benefits Section */}
    <section className="py-24 bg-gray-950 border-t border-b border-white/5 relative">
      <div className="absolute inset-0 blueprint-grid opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center mb-20 max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-condensed text-white uppercase tracking-wider">THE EHTA STANDARD</h2>
          <p className="text-gray-400 text-sm leading-relaxed">We combine premium modern vehicle classes with highly professional, licensed drivers.</p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="text-left p-8 glass-panel rounded-3xl hover:border-yellow-400/35 transition-all duration-300 hover:scale-[1.01] group">
            <div className="bg-yellow-400/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-yellow-400/20 text-yellow-400 group-hover:scale-105 transition-all">
              <Clock size={28} />
            </div>
            <h3 className="text-lg font-condensed text-white tracking-wider uppercase mb-3">PUNCTUALITY GUARANTEED</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We track our fleet live. Our dispatch coordinators guarantee prompt arrivals at pickup points so you are never late for flight departures.
            </p>
          </div>

          {/* Card 2 */}
          <div className="text-left p-8 glass-panel rounded-3xl hover:border-yellow-400/35 transition-all duration-300 hover:scale-[1.01] group">
            <div className="bg-yellow-400/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-yellow-400/20 text-yellow-400 group-hover:scale-105 transition-all">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-condensed text-white tracking-wider uppercase mb-3">LOCAL & AIRPORT SPECIALISTS</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Experienced, licensed private-hire chauffeurs with complete regional navigation familiarity. Ensuring safe and quiet travel.
            </p>
          </div>

          {/* Card 3 */}
          <div className="text-left p-8 glass-panel rounded-3xl hover:border-yellow-400/35 transition-all duration-300 hover:scale-[1.01] group">
            <div className="bg-yellow-400/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-yellow-400/20 text-yellow-400 group-hover:scale-105 transition-all">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-lg font-condensed text-white tracking-wider uppercase mb-3">EXECUTIVE fleet SAFETY</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All vehicles undergo regular local authority safety screening. They are meticulously valeted, spacious, and mechanically vetted.
            </p>
          </div>

        </div>
      </div>
    </section>

    {/* Premium Feedback / Reviews Section */}
    <section className="py-24 bg-[#0d2847] text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-condensed uppercase tracking-wider">TRUSTED BY PASSENGERS</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Hear from clients who travel with Ehta regularly.</p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative">
            <div className="flex space-x-1 text-yellow-400 mb-4">
              {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="#facc15" />)}
            </div>
            <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">
              "Booking my business travel with Ehta was effortless. Flat rate, clean VIP car, and the driver helped with bags at Heathrow. Excellent service!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-400/10 p-2 rounded-full border border-yellow-400/20 text-yellow-400">
                <Users size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Sarah Jenkins</h4>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Corporate Account Client</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative">
            <div className="flex space-x-1 text-yellow-400 mb-4">
              {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="#facc15" />)}
            </div>
            <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">
              "I always use Ehta for airport journeys. The fixed-pricing system means I never get surprised by surge fees. Strongly recommended!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-400/10 p-2 rounded-full border border-yellow-400/20 text-yellow-400">
                <Users size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">David Miller</h4>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Birmingham Regular Flyer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Pulsating Glowing Call-to-Action Section */}
    <section className="py-20 bg-yellow-400 text-gray-950 text-center relative overflow-hidden border-t border-yellow-500">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
      <div className="container mx-auto px-4 relative z-10 max-w-3xl space-y-6">
        <h2 className="text-4xl md:text-6xl font-condensed tracking-wider uppercase font-bold text-gray-950">HAVE QUESTIONS OR NEED SUPPORT?</h2>
        <p className="text-sm md:text-base text-gray-900 max-w-xl mx-auto font-semibold leading-relaxed">
          Our dispatch team is standing by to assist you. Contact us via email for booking support, corporate arrangements, or custom vehicle queries.
        </p>
        <div className="pt-4">
          <a 
            href="mailto:Contact@ehta.net" 
            className="inline-flex items-center bg-gray-950 text-white font-condensed tracking-widest font-black py-4.5 px-10 rounded-2xl text-lg hover:bg-gray-900 transition-all shadow-2xl hover:scale-[1.02] border border-white/5 active:scale-95"
          >
            <Mail className="mr-3 text-yellow-400 animate-pulse" size={20} /> 
            <span>Contact@ehta.net</span>
          </a>
        </div>
      </div>
    </section>

  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

import Layout from './Layout';
import { Plane, Briefcase, Car, Clock, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'Airport Transfers',
      icon: <Plane size={32} className="text-yellow-400" />,
      description: 'Stress-free airport pickups and drop-offs to Heathrow, Gatwick, Birmingham, Manchester, Luton, and Stansted. We monitor your flight to ensure we are there when you land.',
      image: '/airport-transfer.png'
    },
    {
      title: 'Corporate Travel',
      icon: <Briefcase size={32} className="text-yellow-400" />,
      description: 'Professional, reliable chauffeur solutions for corporate executives, teams, and visitors. Premium cars, monthly invoicing, and PO tracking features.',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'City Transfers',
      icon: <Car size={32} className="text-yellow-400" />,
      description: 'Quick, efficient travel within the city limits. Reliable local routing for retail trips, train connections, social events, or clinical appointments.',
      image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Special Events & VIPs',
      icon: <Heart size={32} className="text-yellow-400" />,
      description: 'Premium transport solutions for wedding events, social galas, and VIP clients. Coordinated schedules and customized vehicle options.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <Layout>
      
      {/* Page Hero Header */}
      <section className="relative dark-gradient-bg py-20 text-center border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-condensed tracking-wider text-white">
            OUR TRANSIT <span className="yellow-gradient-text">SERVICES</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto font-medium">
            Custom-built transportation categories designed for maximum comfort and speed.
          </p>
        </div>
      </section>

      {/* Services Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-[#0d2847] to-[#071b30]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="flex flex-col bg-gray-900/40 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:border-yellow-400/30 transition-all duration-300 group text-left">
                
                {/* Visual Thumbnail */}
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10" />
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                </div>

                {/* Content info */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="bg-yellow-400/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-yellow-400/20">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-condensed text-white uppercase tracking-wider mb-3">{service.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">{service.description}</p>
                  </div>

                  <a 
                    href="/#book" 
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-yellow-400 hover:text-yellow-500 transition-colors"
                  >
                    <span>BOOK THIS SERVICE</span> 
                    <ArrowRight size={14} className="ml-2" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* standard benefits banner details */}
      <section className="py-24 bg-gray-950 border-t border-white/5 relative">
        <div className="absolute inset-0 blueprint-grid opacity-5" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          
          <div className="text-center mb-16 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-condensed uppercase tracking-wider">ALL JOURNEYS INCLUDE</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex items-start space-x-4 p-6 glass-panel rounded-2xl text-left border border-white/5 hover:border-yellow-400/20 transition-all duration-300">
              <Clock className="text-yellow-400 shrink-0" size={24} />
              <div>
                <h4 className="font-condensed text-white tracking-wide uppercase text-sm mb-1.5">Free Waiting Time</h4>
                <p className="text-gray-400 text-xs leading-normal">Enjoy complimentary wait times for all scheduled airport pickups.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 glass-panel rounded-2xl text-left border border-white/5 hover:border-yellow-400/20 transition-all duration-300">
              <ShieldCheck className="text-yellow-400 shrink-0" size={24} />
              <div>
                <h4 className="font-condensed text-white tracking-wide uppercase text-sm mb-1.5">GPS Dispatch Tracking</h4>
                <p className="text-gray-400 text-xs leading-normal">Live GPS coordinates shared with clients upon dispatch for maximum security.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 glass-panel rounded-2xl text-left border border-white/5 hover:border-yellow-400/20 transition-all duration-300">
              <Car className="text-yellow-400 shrink-0" size={24} />
              <div>
                <h4 className="font-condensed text-white tracking-wide uppercase text-sm mb-1.5">Baby / Child Seats</h4>
                <p className="text-gray-400 text-xs leading-normal">Child safety seats prepared and mounted upon booking requests.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Services;

import { User, Briefcase, Award } from 'lucide-react';

export interface Vehicle {
  id: string;
  name: string;
  image: string;
  passengers: number;
  luggage: number;
  description: string;
  priceEstimate: string;
}

const vehicles: Vehicle[] = [
  {
    id: 'saloon',
    name: 'Standard Saloon',
    image: '/vehicle-saloon.png',
    passengers: 4,
    luggage: 2,
    description: 'Standard saloon suitable for day-to-day rides and quick trips.',
    priceEstimate: '£25.00'
  },
  {
    id: 'estate',
    name: 'Premium Estate',
    image: '/vehicle-estate.png',
    passengers: 4,
    luggage: 4,
    description: 'Extended space for long-distance journeys and luggage capacity.',
    priceEstimate: '£30.00'
  },
  {
    id: 'executive',
    name: 'VIP Executive',
    image: '/vehicle-executive.png',
    passengers: 3,
    luggage: 2,
    description: 'Luxury travel featuring premium leather upholstery and extra comfort.',
    priceEstimate: '£45.00'
  },
  {
    id: 'minibus',
    name: '8-Seater Minibus',
    image: '/vehicle-minibus.png',
    passengers: 8,
    luggage: 8,
    description: 'Spacious transport for large family outings, groups, and events.',
    priceEstimate: '£60.00'
  }
];

interface VehicleSelectionProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const VehicleSelection = ({ selectedId, onSelect }: VehicleSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {vehicles.map((v) => {
        const isSelected = selectedId === v.id;
        return (
          <button
            type="button"
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`text-left cursor-pointer border rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none flex flex-col justify-between ${
              isSelected
                ? 'border-yellow-400 bg-yellow-400/[0.04] shadow-xl shadow-yellow-400/5 ring-1 ring-yellow-400 scale-[1.01]'
                : 'border-white/5 bg-gray-900/40 hover:border-white/10 hover:bg-gray-900/60 hover:shadow-md'
            }`}
          >
            {/* Vehicle Image Container */}
            <div className="relative h-32 bg-gray-950 overflow-hidden">
              <img 
                src={v.image} 
                alt={v.name} 
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500" 
              />
              
              {/* Recommended Badge */}
              {v.id === 'saloon' && (
                <div className="absolute top-3 left-3 bg-yellow-400 text-gray-950 text-[9px] font-black tracking-widest px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow">
                  <Award size={10} /> RECOMMENDED
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-condensed text-lg text-white leading-tight tracking-wide">{v.name}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{v.description}</p>
              </div>

              <div>
                {/* Capacities (optimized to prevent wrapping) */}
                <div className="flex items-center space-x-4 border-t border-white/5 pt-3 mb-3 text-xs text-gray-300">
                  <span className="flex items-center whitespace-nowrap">
                    <User size={13} className="mr-1.5 text-yellow-400 shrink-0" /> 
                    <span>{v.passengers} Passengers</span>
                  </span>
                  <span className="flex items-center whitespace-nowrap">
                    <Briefcase size={13} className="mr-1.5 text-yellow-400 shrink-0" /> 
                    <span>{v.luggage} Bags</span>
                  </span>
                </div>

                {/* Pricing / Selection Status */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">From</span>
                  <span className="text-yellow-400 font-condensed text-xl font-bold">{v.priceEstimate}</span>
                </div>

                {isSelected ? (
                  <div className="mt-3 w-full bg-yellow-400 text-gray-950 text-[10px] font-black text-center uppercase tracking-widest py-2 rounded-lg shadow-sm">
                    SELECTED VEHICLE
                  </div>
                ) : (
                  <div className="mt-3 w-full border border-white/10 text-gray-300 hover:text-white hover:border-yellow-400/50 text-[10px] font-bold text-center uppercase tracking-widest py-2 rounded-lg transition-colors">
                    SELECT
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default VehicleSelection;

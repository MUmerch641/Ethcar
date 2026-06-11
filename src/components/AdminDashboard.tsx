import { useState, useEffect } from 'react';
import Layout from './Layout';
import { Calendar, User, Phone, Mail, Clock, Briefcase, Car, Lock, LogOut, Trash2, Plane, CreditCard, Building2, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface Booking {
  id: number;
  pickup: string;
  dropoff: string;
  trip_type?: string;
  via_stop?: string | null;
  journey_date: string;
  journey_time: string;
  return_date?: string | null;
  return_time?: string | null;
  passengers: number;
  luggage: number;
  taxi_count?: number;
  vehicle_id: string;
  estimated_price?: string | null;
  distance?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
  created_at: string;
  booking_category?: string;
  flight_number?: string | null;
  child_seats?: number;
  wheelchair_accessible?: number;
  payment_method?: string;
  company_name?: string | null;
  account_reference?: string | null;
}

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const formatTripType = (tripType?: string) => {
    return (tripType || 'one-way').replace('-', ' ');
  };

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'Saranghae9?2') {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_auth');
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ehtacars.com/api/get_bookings.php');
      const result = await response.json();
      if (result.status === 'success') {
        setBookings(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
    }
  }, [isLoggedIn]);

  const openDeleteModal = (id: number) => {
    setDeleteError('');
    setPendingDeleteId(id);
  };

  const closeDeleteModal = () => {
    if (deletingId !== null) {
      return;
    }
    setPendingDeleteId(null);
  };

  const handleDelete = async () => {
    if (pendingDeleteId === null) {
      return;
    }

    const id = pendingDeleteId;
    setDeleteError('');
    setDeletingId(id);
    try {
      const response = await fetch('https://ehtacars.com/api/delete_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        setBookings(prev => prev.filter(b => b.id !== id));
        setPendingDeleteId(null);
      } else {
        setDeleteError(result.message || 'Unable to delete booking');
      }
    } catch (err) {
      setDeleteError('Failed to delete booking');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="min-h-[75vh] flex items-center justify-center px-4 bg-gradient-to-b from-[#0d2847] to-[#071b30] relative">
          <div className="absolute inset-0 blueprint-grid opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px]" />
          
          <div className="max-w-md w-full glass-panel rounded-3xl shadow-2xl border border-white/5 overflow-hidden z-10 relative">
            <div className="bg-gray-950/60 py-8 px-8 text-center border-b border-white/5">
              <div className="bg-yellow-400/10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-400/20 text-yellow-400">
                <Lock size={26} />
              </div>
              <h2 className="text-2xl font-condensed tracking-wider text-white">EHTA ADMIN</h2>
              <p className="text-gray-400 text-xs mt-1 uppercase font-bold tracking-wider">Restricted Dashboard Access</p>
            </div>
            
            <form onSubmit={handleLogin} className="p-8 space-y-5 text-left">
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs text-center font-semibold">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-gray-400 uppercase">Username</label>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/8 rounded-xl focus:border-yellow-400 focus:bg-gray-950/40 outline-none text-white text-sm" 
                  placeholder="admin" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[9px] font-black tracking-widest text-gray-400 uppercase">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-4 pr-12 py-3.5 bg-white/[0.02] border border-white/8 rounded-xl focus:border-yellow-400 focus:bg-gray-950/40 outline-none text-white text-sm" 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-condensed tracking-widest font-black py-4 rounded-xl transition-all shadow-lg hover:scale-[1.01] text-sm"
              >
                ACCESS CONTROL DESK
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-[#0d2847] to-[#071b30] min-h-screen">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/5 pb-6">
          <div className="text-left">
            <h1 className="text-3xl font-condensed tracking-wider text-white">ADMIN DISPATCH DESK</h1>
            <p className="text-gray-400 text-xs mt-1 uppercase font-bold tracking-wider">Active Reservation Logs</p>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase">
              RESERVATIONS: {bookings.length}
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors font-condensed tracking-widest font-bold bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-xs"
            >
              <LogOut size={14} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Bookings Lists */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-semibold max-w-md mx-auto">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl border border-white/5 text-center max-w-lg mx-auto space-y-4">
            <ShieldAlert size={48} className="text-yellow-400/50 mx-auto" />
            <h3 className="text-lg font-condensed text-white tracking-wider">NO BOOKINGS FOUND</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">There are currently no passenger reservation logs registered in the database repository.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="glass-panel rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors text-left"
              >
                {/* Log Card Header */}
                <div className="bg-gray-950/40 px-6 py-4 border-b border-white/5 flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 font-condensed font-bold px-3.5 py-1.5 rounded-lg text-sm tracking-wider">
                      #{booking.id}
                    </div>
                    <div className="flex items-center text-gray-400 text-xs font-semibold">
                      <Clock size={14} className="mr-1.5 text-yellow-400" /> 
                      <span>Logged: {new Date(booking.created_at).toLocaleString('en-GB')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => openDeleteModal(booking.id)} 
                      disabled={deletingId === booking.id} 
                      className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-red-400/20" 
                      title="Remove Entry"
                    >
                      {deletingId === booking.id ? (
                        <div className="animate-spin h-4 w-4 border-b-2 border-red-500 rounded-full" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Log Card Grid Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Journey Routes */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Journey Route</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {formatTripType(booking.trip_type)}
                      </span>
                      {booking.booking_category === 'airport' && (
                        <span className="bg-blue-400/10 text-blue-400 border border-blue-400/20 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Plane size={10} /> Airport Transfer
                        </span>
                      )}
                      {booking.booking_category === 'business' && (
                        <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Building2 size={10} /> Corporate Account
                        </span>
                      )}
                    </div>

                    {booking.company_name && (
                      <div className="bg-yellow-400/[0.02] border border-yellow-400/10 p-3 rounded-xl space-y-1 mb-2 text-xs">
                        <div className="font-bold text-white flex items-center">
                          <Building2 size={12} className="mr-1.5 text-yellow-400" /> {booking.company_name}
                        </div>
                        {booking.account_reference && (
                          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Ref: {booking.account_reference}</div>
                        )}
                      </div>
                    )}

                    <div className="space-y-3 relative pl-4 border-l border-white/10 ml-1.5">
                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1.5 bg-green-500 w-2 h-2 rounded-full" />
                        <span className="text-[9px] text-gray-500 block font-semibold uppercase">Pickup Address</span>
                        <p className="text-xs font-bold text-white leading-normal">{booking.pickup}</p>
                      </div>
                      
                      {booking.via_stop && (
                        <div className="relative">
                          <div className="absolute -left-[20.5px] top-1.5 bg-yellow-500 w-2 h-2 rounded-full" />
                          <span className="text-[9px] text-yellow-400 block font-semibold uppercase">Via Stop</span>
                          <p className="text-xs font-bold text-white leading-normal">{booking.via_stop}</p>
                        </div>
                      )}

                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1.5 bg-red-500 w-2 h-2 rounded-full" />
                        <span className="text-[9px] text-gray-500 block font-semibold uppercase">Destination</span>
                        <p className="text-xs font-bold text-white leading-normal">{booking.dropoff}</p>
                      </div>
                    </div>

                    {booking.flight_number && (
                      <div className="flex items-center text-xs font-bold text-blue-400 bg-blue-400/5 border border-blue-400/10 p-2.5 rounded-xl">
                        <Plane size={14} className="mr-2" />
                        <span>FLIGHT NUMBER: {booking.flight_number}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-gray-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center"><Calendar size={13} className="mr-1.5 text-yellow-400" />{booking.journey_date}</span>
                      <span className="flex items-center"><Clock size={13} className="mr-1.5 text-yellow-400" />{booking.journey_time}</span>
                    </div>

                    {booking.return_date && (
                      <div className="border-t border-white/5 pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-yellow-400/80 font-bold uppercase tracking-wider">
                        <span className="flex items-center"><Calendar size={13} className="mr-1.5" />Return {booking.return_date}</span>
                        <span className="flex items-center"><Clock size={13} className="mr-1.5" />{booking.return_time}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Customer Profile</h3>
                    
                    <div className="space-y-3.5 text-xs text-gray-300">
                      <div className="flex items-center space-x-3">
                        <User size={15} className="text-yellow-400 shrink-0" />
                        <span className="font-bold text-white">{booking.customer_name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone size={15} className="text-yellow-400 shrink-0" />
                        <a href={`tel:${booking.customer_phone}`} className="hover:text-yellow-400 transition-colors font-semibold text-white">{booking.customer_phone}</a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail size={15} className="text-yellow-400 shrink-0" />
                        <a href={`mailto:${booking.customer_email}`} className="hover:text-yellow-400 transition-colors font-semibold text-white truncate max-w-[200px]" title={booking.customer_email}>{booking.customer_email}</a>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Requirements</h3>
                    
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-300">
                      <span className="bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg flex items-center capitalize"><Car size={13} className="mr-1.5 text-yellow-400" />{booking.vehicle_id}</span>
                      <span className="bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg flex items-center"><User size={13} className="mr-1.5 text-yellow-400" />{booking.passengers} Pass</span>
                      <span className="bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg flex items-center"><Briefcase size={13} className="mr-1.5 text-yellow-400" />{booking.luggage} Bags</span>
                      {booking.child_seats ? (
                        <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-2.5 py-1 rounded-lg">{booking.child_seats} Child Seat{booking.child_seats > 1 ? 's' : ''}</span>
                      ) : null}
                      {booking.wheelchair_accessible == 1 ? (
                        <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-2.5 py-1 rounded-lg">Wheelchair Access</span>
                      ) : null}
                      {booking.payment_method && (
                        <span className="bg-white/5 border border-white/8 text-gray-300 px-2.5 py-1 rounded-lg flex items-center capitalize"><CreditCard size={13} className="mr-1.5 text-yellow-400" />{booking.payment_method}</span>
                      )}
                    </div>

                    {(booking.estimated_price || booking.distance) && (
                      <div className="rounded-2xl border border-white/5 bg-gray-950/40 p-4 text-xs space-y-2.5 text-gray-300">
                        {booking.estimated_price && (
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Estimated Price</span>
                            <span className="font-condensed text-lg font-bold text-yellow-400">£{booking.estimated_price}</span>
                          </div>
                        )}
                        {booking.distance && (
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Route Distance</span>
                            <span className="font-bold text-white">{booking.distance}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {booking.notes && (
                      <div className="bg-yellow-400/[0.01] p-3 rounded-2xl border border-yellow-400/10 italic text-[11px] text-gray-400 mt-2 leading-relaxed">
                        "{booking.notes}"
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal Overlay */}
        {pendingDeleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm animate-fade-in" onClick={closeDeleteModal} />
            <div className="relative w-full max-w-md rounded-3xl bg-gray-900 border border-white/5 p-6 shadow-2xl z-10 text-left space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <Trash2 size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-condensed tracking-wider text-white">DELETE BOOKING?</h2>
                  <p className="mt-1 text-xs text-gray-400 leading-normal">
                    This action will permanently delete booking record #{pendingDeleteId} from the database.
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400 font-semibold">
                  {deleteError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 text-xs uppercase tracking-wider font-bold">
                <button
                  onClick={closeDeleteModal}
                  disabled={deletingId !== null}
                  className="rounded-xl border border-white/5 bg-white/5 px-5 py-3 text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deletingId !== null}
                  className="rounded-xl bg-red-500 hover:bg-red-600 px-5 py-3 text-white transition-all hover:scale-[1.01]"
                >
                  {deletingId !== null ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;

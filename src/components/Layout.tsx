import { useState, type ReactNode } from 'react';
import { Mail, Menu, X, Shield, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-yellow-400 border-b-2 border-yellow-400 font-bold"
      : "text-gray-300 hover:text-yellow-400 transition-colors font-medium";
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-[#0d2847] text-gray-100 selection:bg-yellow-400 selection:text-gray-900">
      
      {/* Top Info Bar */}
      <div className="bg-gray-950/80 border-b border-white/5 text-gray-400 py-2.5 px-4 text-xs hidden md:block backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="mailto:Contact@ehta.net" className="flex items-center hover:text-yellow-400 transition-colors">
              <Mail size={13} className="mr-2 text-yellow-400" /> 
              <span>Contact@ehta.net</span>
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-400/20 font-bold">24/7 ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#0d2847]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          <Link to="/" className="flex items-center group">
            <img 
              src={logoImg} 
              alt="Ehta Logo" 
              className="h-14 md:h-16 w-auto rounded-lg object-contain group-hover:scale-105 transition-transform duration-300 shadow-md border border-white/10"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link to="/" className={`${isActive("/")} py-1`}>Home</Link>
            <Link to="/services" className={`${isActive("/services")} py-1`}>Services</Link>
            <Link to="/about" className={`${isActive("/about")} py-1`}>About</Link>
            <Link to="/contact" className={`${isActive("/contact")} py-1`}>Contact</Link>
            
            <Link 
              to="/#book" 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-yellow-400/10 text-xs tracking-wider"
            >
              BOOK ONLINE
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-gray-950/90 backdrop-blur-lg flex flex-col justify-center">
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2 text-gray-400 hover:text-white"
            >
              <X size={28} />
            </button>
          </div>
          <nav className="flex flex-col items-center space-y-8 text-xl font-bold">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={location.pathname === "/" ? "text-yellow-400" : "text-gray-300"}>Home</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className={location.pathname === "/services" ? "text-yellow-400" : "text-gray-300"}>Services</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={location.pathname === "/about" ? "text-yellow-400" : "text-gray-300"}>About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={location.pathname === "/contact" ? "text-yellow-400" : "text-gray-300"}>Contact</Link>
            <Link 
              to="/#book" 
              onClick={() => setMobileMenuOpen(false)} 
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-yellow-400/10 text-sm tracking-wider"
            >
              BOOK NOW
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-6">
              <img 
                src={logoImg} 
                alt="Ehta Logo" 
                className="h-12 w-auto rounded-md object-contain border border-white/5"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Providing premium, licensed private hire car services 24/7 across the UK. We focus on comfort, promptness, and flat-rate pricing.
            </p>
            <div className="flex space-x-4 text-gray-400 text-xs">
              <span className="flex items-center"><Shield size={14} className="text-yellow-400 mr-1.5" /> Licensed Operator</span>
              <span className="flex items-center"><Globe size={14} className="text-yellow-400 mr-1.5" /> UK Nationwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-condensed text-lg mb-6 tracking-wider border-l-4 border-yellow-400 pl-3">QUICK LINKS</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Ehta</Link></li>
              <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Special Services</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-condensed text-lg mb-6 tracking-wider border-l-4 border-yellow-400 pl-3">OUR SERVICES</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Airport Transfers</Link></li>
              <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Corporate Travel</Link></li>
              <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Local Transfers</Link></li>
              <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Minibus Hire (8 seats)</Link></li>
              <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Executive Vehicles</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-condensed text-lg mb-6 tracking-wider border-l-4 border-yellow-400 pl-3">TALK TO US</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="mailto:Contact@ehta.net" className="flex items-center hover:text-yellow-400 transition-colors text-white font-semibold">
                  <Mail size={16} className="mr-3 text-yellow-400 shrink-0" />
                  <span>Contact@ehta.net</span>
                </a>
              </li>
              <li className="text-xs text-gray-500 leading-relaxed">
                For booking inquiries, support, corporate account registration, or feedback, please email our support team directly. We are active 24/7.
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <div>
            &copy; {new Date().getFullYear()} Ehta. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-yellow-400">Terms & Conditions</Link>
            <span className="text-white/10">|</span>
            <span className="text-gray-600">Licensed under UK Private Hire Regulations</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Layout;

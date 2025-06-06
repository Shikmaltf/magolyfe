// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { performLogout, isTokenStillValid } from '../utils/auth';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(isTokenStillValid());
    };

    checkAdminStatus();
    setIsMobileMenuOpen(false); // Close mobile menu on location change

    const handleStorageChange = () => {
      checkAdminStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  const handleLogoutClick = () => {
    performLogout('/login');
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinkClasses = "hover:text-green-200 transition duration-200 font-medium block py-2 md:py-0 md:inline-block";
  const adminButtonContainerClasses = "flex items-center space-x-4 mt-4 md:mt-0";
  const loginButtonClasses = "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 font-medium block w-full text-center md:w-auto md:inline-block mt-4 md:mt-0";


  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Branding or Logo can go here if needed */}
          <Link to="/" className="text-xl font-bold hover:text-green-200" onClick={() => setIsMobileMenuOpen(false)}>
            Magolyfe
          </Link>

          {/* Hamburger Button for Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                // X icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className={navLinkClasses.replace('block', 'inline-block').replace('py-2', '')}>Beranda</Link>
            <Link to="/education" className={navLinkClasses.replace('block', 'inline-block').replace('py-2', '')}>Edukasi</Link>
            <Link to="/gallery" className={navLinkClasses.replace('block', 'inline-block').replace('py-2', '')}>Galeri</Link>
            <Link to="/product" className={navLinkClasses.replace('block', 'inline-block').replace('py-2', '')}>Produk</Link>
            <Link to="/about" className={navLinkClasses.replace('block', 'inline-block').replace('py-2', '')}>Tentang</Link>
            <Link to="/contact" className={navLinkClasses.replace('block', 'inline-block').replace('py-2', '')}>Kontak</Link>
            {isAdmin ? (
              <div className={adminButtonContainerClasses.replace('mt-4', '').replace('md:mt-0', '')}>
                <Link to="/admin" className={navLinkClasses.replace('block', 'inline-block').replace('py-2', '')}>Admin</Link>
                <button
                  onClick={handleLogoutClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={loginButtonClasses.replace('block', 'inline-block').replace('w-full', 'w-auto').replace('text-center', '').replace('mt-4', '').replace('md:mt-0', '')}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-green-700 mt-3">
            <Link to="/" className={navLinkClasses} onClick={toggleMobileMenu}>Beranda</Link>
            <Link to="/education" className={navLinkClasses} onClick={toggleMobileMenu}>Edukasi</Link>
            <Link to="/gallery" className={navLinkClasses} onClick={toggleMobileMenu}>Galeri</Link>
            <Link to="/product" className={navLinkClasses} onClick={toggleMobileMenu}>Produk</Link>
            <Link to="/about" className={navLinkClasses} onClick={toggleMobileMenu}>Tentang</Link>
            <Link to="/contact" className={navLinkClasses} onClick={toggleMobileMenu}>Kontak</Link>
            {isAdmin ? (
              <div className={`${adminButtonContainerClasses} flex-col space-y-2 space-x-0 items-start`}>
                <Link to="/admin" className={navLinkClasses} onClick={toggleMobileMenu}>Admin</Link>
                <button
                  onClick={handleLogoutClick} // handleLogoutClick already calls setIsMobileMenuOpen(false) via location change
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={loginButtonClasses}
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// Navigation.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import { useLogOutMutation } from '../../redux/api/usersApiSlice.js';
import { logout } from '../../redux/features/auth/authSlice.js';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';

const BREAKPOINT = 850;

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userDropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [logoutApiCall] = useLogOutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Enhanced scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowServicesDropdown(false);
    setShowUserDropdown(false);
  }, [location]);

  // Enhanced click outside handler
  const handleClickOutside = useCallback((e) => {
    if (window.innerWidth >= BREAKPOINT) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setShowUserDropdown(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(e.target)
      ) {
        setShowServicesDropdown(false);
      }
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      if (!mobileMenuButton?.contains(e.target)) {
        setShowMobileMenu(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (window.innerWidth < BREAKPOINT && showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileMenu]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowMobileMenu(false);
        setShowServicesDropdown(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      toast.success('Logout successful');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Logout failed');
    }
  };

  // Style classes with improved animations
  const getNavLinkClass = ({ isActive }) =>
    `relative transition-all duration-300 font-semibold px-3 py-2 rounded-lg hover:bg-white/10 ${
      isActive
        ? 'text-blue-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-400 after:rounded-full'
        : 'hover:text-blue-300'
    }`;

  const getMobileNavLinkClass = ({ isActive }) =>
    `block py-3 px-4 rounded-lg transition-all duration-300 ${
      isActive
        ? 'text-blue-400 bg-blue-400/10 border-l-2 border-blue-400'
        : 'hover:text-blue-300 hover:bg-white/5 hover:translate-x-1'
    }`;

  const getDropdownNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${
      isActive
        ? 'text-blue-400 bg-blue-400/10'
        : 'hover:bg-white/10 hover:text-white hover:translate-x-1'
    }`;

  const getAuthNavLinkClass = ({ isActive }) =>
    `hidden custom-md:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? 'text-blue-400 bg-blue-400/10'
        : 'text-white hover:text-blue-300 hover:bg-white/10'
    }`;

  return (
    <>
      <div
        className={`w-full h-[70px] text-white fixed top-0 left-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isScrolled ? 'bg-black/60 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <nav
          className={`flex justify-between items-center px-6 h-16 w-[95%] max-w-7xl rounded-2xl transition-all duration-300 ${
            isScrolled
              ? 'bg-black/90 backdrop-blur-xl shadow-2xl border border-white/10'
              : 'bg-black/70 backdrop-blur-md shadow-lg'
          }`}
        >
          {/* Logo */}
          <div className='flex items-center justify-center text-2xl font-bold h-[40px] px-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'>
            <h1 className='tracking-wide'>AIM</h1>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden custom-md:flex items-center gap-2 lg:gap-4 h-[40px] px-6 rounded-full justify-center font-medium'>
            <NavLink to='/' className={getNavLinkClass}>
              Home
            </NavLink>
            <NavLink to='/jobs' className={getNavLinkClass}>
              Jobs
            </NavLink>

            {/* Services Dropdown */}
            <div
              className='relative'
              ref={servicesDropdownRef}
              onMouseEnter={() => {
                if (window.innerWidth >= BREAKPOINT)
                  setShowServicesDropdown(true);
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= BREAKPOINT)
                  setShowServicesDropdown(false);
              }}
            >
              <button
                className={`transition-all duration-300 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 ${
                  showServicesDropdown
                    ? 'text-blue-400 bg-white/10'
                    : 'hover:text-blue-300'
                }`}
                onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                aria-expanded={showServicesDropdown}
                aria-haspopup='true'
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showServicesDropdown ? 'rotate-180' : ''
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>

              <div
                className={`absolute top-full left-0 mt-1 w-56 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 border border-white/10 transition-all duration-300 origin-top ${
                  showServicesDropdown
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <NavLink
                  to='/services/student-visa'
                  className={getDropdownNavLinkClass}
                >
                  🎓 Student Visa
                </NavLink>
                <NavLink
                  to='/services/countrys'
                  className={getDropdownNavLinkClass}
                >
                  🌍 About Countries
                </NavLink>
                <NavLink
                  to='/services/schengen'
                  className={getDropdownNavLinkClass}
                >
                  🇪🇺 Schengen Work Permits
                </NavLink>
                <NavLink
                  to='/services/non-schengen'
                  className={getDropdownNavLinkClass}
                >
                  🌐 Non-Schengen Jobs
                </NavLink>
                <NavLink
                  to='/services/asian'
                  className={getDropdownNavLinkClass}
                >
                  🏯 Asian Countries
                </NavLink>
              </div>
            </div>

            <NavLink to='/about' className={getNavLinkClass}>
              About us
            </NavLink>
            <NavLink to='/blogs' className={getNavLinkClass}>
              Blogs
            </NavLink>
            <NavLink to='/contact' className={getNavLinkClass}>
              Contact
            </NavLink>
          </div>

          {/* Right Side - User/Auth Controls */}
          <div className='relative flex items-center gap-3 h-[40px] px-4 rounded-full'>
            {/* Mobile Menu Button */}
            <button
              id='mobile-menu-button'
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className='custom-md:hidden text-white hover:text-blue-300 p-2 rounded-lg hover:bg-white/10 transition-all duration-200'
              aria-label='Toggle mobile menu'
              aria-expanded={showMobileMenu}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  showMobileMenu ? 'rotate-90' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {showMobileMenu ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>

            {/* User Dropdown */}
            {userInfo?.isVarify && (
              <div className='relative' ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className='hidden custom-md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white hover:text-blue-300'
                  aria-expanded={showUserDropdown}
                  aria-haspopup='true'
                >
                  <AiOutlineUser size={20} />
                  <span className='text-sm font-medium'>
                    {userInfo.name || 'User'}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showUserDropdown ? 'rotate-180' : ''
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                <div
                  className={`absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 border border-white/10 transition-all duration-300 origin-top-right ${
                    showUserDropdown
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <NavLink to='/profile' className={getDropdownNavLinkClass}>
                    👤 Profile
                  </NavLink>
                  {userInfo?.isAdmin && (
                    <NavLink
                      to='/admin/dashboard'
                      className={getDropdownNavLinkClass}
                    >
                      🔧 Dashboard
                    </NavLink>
                  )}
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowLogoutDialog(true);
                    }}
                    className='w-full text-left px-4 py-3 rounded-lg mx-2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 flex items-center gap-2'
                  >
                    <AiOutlineLogout size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Auth Links for non-authenticated users */}
            {!userInfo?.isVarify && (
              <>
                <NavLink to='/login' className={getAuthNavLinkClass}>
                  <AiOutlineLogin size={20} />
                  <span>Login</span>
                </NavLink>
                <NavLink to='/register' className={getAuthNavLinkClass}>
                  <AiOutlineUserAdd size={20} />
                  <span>Register</span>
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`custom-md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          showMobileMenu
            ? 'bg-black/50 backdrop-blur-sm opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileMenu(false)}
      />

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`custom-md:hidden fixed indent-1 z-50 top-[70px] left-4 right-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-black/95 backdrop-blur-xl text-white shadow-2xl rounded-2xl border border-white/10 transition-all duration-300 ${
          showMobileMenu
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className='p-6 space-y-2'>
          <NavLink to='/' className={getMobileNavLinkClass}>
            🏠 Home
          </NavLink>
          <NavLink to='/jobs' className={getMobileNavLinkClass}>
            💼 Jobs
          </NavLink>

          {/* Mobile Services Dropdown */}
          <div className='space-y-2'>
            <button
              className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-300 ${
                showServicesDropdown
                  ? 'text-blue-400 bg-blue-400/10'
                  : 'hover:text-blue-300 hover:bg-white/5'
              }`}
              onClick={() => setShowServicesDropdown(!showServicesDropdown)}
            >
              <span>🔧 Services</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300  ${
                  showServicesDropdown ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                showServicesDropdown
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className='pl-4 space-y-1 border-l-2 border-blue-400/20 '>
                <NavLink
                  to='/services/student-visa'
                  className={getMobileNavLinkClass}
                >
                  🎓 Student Visa
                </NavLink>
                <NavLink
                  to='/services/countrys'
                  className={getMobileNavLinkClass}
                >
                  🌍 About Countries
                </NavLink>
                <NavLink
                  to='/services/schengen'
                  className={getMobileNavLinkClass}
                >
                  🇪🇺 Schengen Work Permits
                </NavLink>
                <NavLink
                  to='/services/non-schengen'
                  className={getMobileNavLinkClass}
                >
                  🌐 Non-Schengen Jobs
                </NavLink>
                <NavLink to='/services/asian' className={getMobileNavLinkClass}>
                  🏯 Asian Countries
                </NavLink>
              </div>
            </div>
          </div>

          <NavLink to='/about' className={getMobileNavLinkClass}>
            ℹ️ About us
          </NavLink>
          <NavLink to='/blogs' className={getMobileNavLinkClass}>
            📝 Blogs
          </NavLink>
          <NavLink to='/contact' className={getMobileNavLinkClass}>
            📞 Contact
          </NavLink>

          {/* Mobile User Section */}
          {userInfo?.isVarify ? (
            <div className='border-t border-white/10 mt-4 pt-4 space-y-2'>
              <NavLink to='/profile' className={getMobileNavLinkClass}>
                👤 Profile
              </NavLink>
              {userInfo?.isAdmin && (
                <NavLink
                  to='/admin/dashboard'
                  className={getMobileNavLinkClass}
                >
                  🔧 Dashboard
                </NavLink>
              )}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowLogoutDialog(true);
                }}
                className='block w-full text-left py-3 px-4 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-all duration-300'
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className='border-t border-white/10 mt-4 pt-4 space-y-2'>
              <NavLink to='/login' className={getMobileNavLinkClass}>
                🔑 Login
              </NavLink>
              <NavLink to='/register' className={getMobileNavLinkClass}>
                📝 Register
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        message='Are you sure you want to logout?'
        Yes='Yes, logout'
        No='Cancel'
      />
    </>
  );
};

export default Navigation;

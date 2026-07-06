import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, changePassword } from '../../redux/slices/authSlice';
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingCart, FiHome, FiLock, FiChevronDown, FiSearch, FiMapPin, FiTarget } from 'react-icons/fi';
import { FaPills, FaStethoscope, FaRobot } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { getCurrentLocation as getLocation } from '../../utils/location';
// import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [searchLocation, setSearchLocation] = useState({
    latitude: '',
    longitude: '',
    radius: 5,
    locationName: 'Select Location'
  });
  const [medicineName, setMedicineName] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileProfileRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(changePassword({
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }));

    if (!result.error) {
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideDesktopProfile = !profileRef.current || !profileRef.current.contains(event.target);
      const clickedOutsideMobileProfile = !mobileProfileRef.current || !mobileProfileRef.current.contains(event.target);
      if (clickedOutsideDesktopProfile && clickedOutsideMobileProfile) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-fetch location for Customer users on mount
  useEffect(() => {
    if (user?.accountType === 'Customer' && !searchLocation.latitude) {
      getCurrentLocation();
    }
  }, [user]);

  const getCurrentLocation = async () => {
    try {
      const location = await getLocation();
      setSearchLocation({
        ...searchLocation,
        latitude: location.latitude.toFixed(6),
        longitude: location.longitude.toFixed(6),
        locationName: 'Current Location'
      });
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      setShowManualInput(false);
    } catch (error) {
      console.error('Error getting location:', error);
      // Silently fail on auto-fetch, user can manually trigger later
    }
  };

  const handleSearchSubmit = () => {
    if (!searchLocation.latitude || !searchLocation.longitude) {
      alert('Please set your location first');
      return;
    }
    navigate('/customer/search', { 
      state: { 
        latitude: searchLocation.latitude, 
        longitude: searchLocation.longitude, 
        radius: searchLocation.radius,
        medicineName: medicineName 
      } 
    });
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  const getRoleLinks = () => {
    switch (user?.accountType) {
      case 'Customer':
        return [
          { to: '/customer/home', label: 'Home', icon: <FiHome /> },
          { to: '/customer/search', label: 'Search Medicine', icon: <FiShoppingCart /> },
          { to: '/customer/medicine-info', label: 'Medicine Info', icon: <FaPills /> },
          { to: '/customer/symptom-checker', label: 'Symptom Checker', icon: <FaStethoscope /> },
          { to: '/customer/orders', label: 'My Orders', icon: <FiShoppingCart /> },
        ];
      case 'Vendor':
        return [
          { to: '/vendor/dashboard', label: 'Dashboard', icon: <FiHome /> },
          { to: '/vendor/inventory', label: 'Inventory', icon: <FiShoppingCart /> },
          { to: '/vendor/orders', label: 'Orders', icon: <FiShoppingCart /> },
          { to: '/vendor/sales', label: 'Sales', icon: <FiShoppingCart /> },
        ];
      case 'Volunteer':
        return [
          { to: '/volunteer/home', label: 'Home', icon: <FiHome /> },
          { to: '/volunteer/available-orders', label: 'Available Orders', icon: <FiShoppingCart /> },
          { to: '/volunteer/deliveries', label: 'My Deliveries', icon: <FiShoppingCart /> },
        ];
      case 'Admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
          { to: '/admin/approvals', label: 'Approvals', icon: <FiUser /> },
          { to: '/admin/pharmacies', label: 'Pharmacies', icon: <FiShoppingCart /> },
          { to: '/admin/volunteers', label: 'Volunteers', icon: <FiUser /> },
        ];
      default:
        return [];
    }
  };

  const links = getRoleLinks();

  // Helper to render location dropdown content
  const renderLocationDropdown = (isOpen, setIsOpen) => {
    if (!isOpen) return null;
    return (
      <div className="absolute top-full left-0 right-0 md:right-auto md:w-80 mt-2 bg-white rounded-2xl shadow-banner border border-gray-100 p-4 z-50">
        {!showManualInput ? (
          <>
            <h3 className="font-semibold text-textc-dark mb-3 text-sm">Update Location</h3>
            
            {/* Update Location Button */}
            <button
              onClick={getCurrentLocation}
              className="w-full mb-2 px-4 py-3 bg-primary-light text-primary rounded-xl hover:bg-primary hover:text-gray-500 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
            >
              <FiTarget className="text-lg" />
              Use Current Location
            </button>

            {/* Update Manually Button */}
            <button
              onClick={() => setShowManualInput(true)}
              className="w-full px-4 py-3 bg-gray-50 text-textc-base rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
            >
              <FiMapPin className="text-lg" />
              Update Manually
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-textc-dark text-sm">Enter Coordinates</h3>
              <button
                onClick={() => setShowManualInput(false)}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                Back
              </button>
            </div>

            {/* Manual Location Input */}
            <div className="space-y-3 mb-3">
              <div>
                <label className="text-xs font-medium text-textc-base mb-1 block">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={searchLocation.latitude}
                  onChange={(e) => setSearchLocation({ ...searchLocation, latitude: e.target.value })}
                  placeholder="21.1458"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-textc-base mb-1 block">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={searchLocation.longitude}
                  onChange={(e) => setSearchLocation({ ...searchLocation, longitude: e.target.value })}
                  placeholder="79.0882"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={() => {
                if (searchLocation.latitude && searchLocation.longitude) {
                  setSearchLocation({
                    ...searchLocation,
                    locationName: `${searchLocation.latitude.substring(0, 7)}, ${searchLocation.longitude.substring(0, 7)}`
                  });
                  setIsOpen(false);
                  setShowManualInput(false);
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-500 text-black font-medium rounded-lg hover:bg-primary-dark transition-all duration-200 text-sm"
            >
              Confirm Location
            </button>
          </>
        )}
      </div>
    );
  };

  // Customer-specific navbar render
  const renderCustomerNavbar = () => (
    <>
      {/* Search Bar Component (Zomato Style) */}
      <div className="flex-1 max-w-3xl mx-6 relative">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
          {/* Location Selector */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center gap-2 px-4 py-3 border-r border-gray-200 hover:bg-gray-50 rounded-l-full transition-all duration-200 min-w-[200px]"
            >
              <FiMapPin className="text-lg text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-textc-dark truncate">{searchLocation.locationName}</span>
              <FiChevronDown className={`text-gray-400 transition-transform duration-200 ml-auto flex-shrink-0 ${isSearchOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Location Dropdown */}
            {renderLocationDropdown(isSearchOpen, setIsSearchOpen)}
          </div>

          {/* Medicine Search Input */}
          <div className="flex-1 flex items-center px-4">
            
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="Search for medicines..."
              className="flex-1 py-3 text-sm focus:outline-none bg-transparent"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearchSubmit}
            className="px-6 py-3 bg-primary text-gray-500 font-medium rounded-r-full hover:bg-primary-dark transition-all duration-200 flex items-center gap-2"
          >
            <FiSearch className="text-xl text-gray-600 mr-3" />
          </button>
        </div>
      </div>

      {/* AI Button */}
      <button
        onClick={() => navigate('/customer/ai-assistant')}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
      >
        <FaRobot className="text-lg" />
        <span className="hidden lg:inline">AI Assistant</span>
      </button>

      {/* My Orders Button */}
      <button
        onClick={() => navigate('/customer/orders')}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-textc-base hover:text-primary hover:bg-primary-light transition-all duration-200 font-medium"
      >
        <FiShoppingCart className="text-lg" />
        <span className="hidden lg:inline">My Orders</span>
      </button>
    </>
  );

  return (
    <nav className="bg-[#d7f0e675] shadow-sm sticky top-0 z-40 backdrop-blur-xl border-b border-gray-100 rounded-b-[40px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo1.png" 
              alt="Swasthya Sarathi Logo" 
              className="h-28 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Mobile Search Bar */}
          {user?.accountType === 'Customer' && (
            <div className="flex-1 max-w-[200px] sm:max-w-xs mx-4 md:hidden">
              <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm pl-3 pr-1 py-1">
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="Search..."
                  className="w-full text-xs focus:outline-none bg-transparent py-1"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="p-1.5 bg-primary text-gray-500 rounded-full hover:bg-primary-dark transition-all duration-200 flex items-center justify-center aspect-square flex-shrink-0"
                >
                  <FiSearch className="text-xs text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 flex-1 justify-end">
            {user ? (
              <>
                {user.accountType === 'Customer' ? (
                  renderCustomerNavbar()
                ) : (
                  <>
                    {links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-textc-base hover:text-primary hover:bg-primary-light transition-all duration-200 font-medium group relative"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                        <span>{link.label}</span>
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300"></span>
                      </Link>
                    ))}
                  </>
                )}

                {/* User Menu */}
                <div className="relative pl-4 ml-2 border-l border-gray-200" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 text-textc-base hover:bg-primary-light px-4 py-2.5 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-[#155335] shadow-md group-hover:shadow-lg transition-all">
                      <FiUser className="text-base" />
                    </div>
                    <span className="font-semibold text-sm">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}</span>
                    <FiChevronDown className={`transition-transform duration-300 text-textc-light ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-[340px] bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                      {/* User Info Header */}
                      <div className="relative px-6 py-6 bg-gradient-to-br from-[#A4E685]/20 to-[#1B9C85]/10">
                        <div className="flex items-start gap-4">
                          {/* Profile Icon */}
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#1B9C85] to-[#0F5132] rounded-2xl flex items-center justify-center shadow-lg">
                              <FiUser className="text-3xl text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#A4E685] rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-[10px] text-[#0F5132] font-bold">✓</span>
                            </div>
                          </div>
                          
                          {/* User Details */}
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="font-bold text-[#0F2B10] truncate text-[17px] mb-1">
                              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                            </p>
                            <p className="text-[14px] text-gray-600 truncate mb-2">{user?.email}</p>
                            <span className="inline-flex items-center px-3 py-1 bg-white text-[#1B9C85] text-[12px] font-semibold rounded-full shadow-sm border border-[#1B9C85]/20">
                              {user?.accountType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3">
                        <button
                          onClick={() => {
                            setShowPasswordModal(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 transition-all duration-200 group rounded-2xl"
                        >
                          <div className="w-11 h-11 bg-[#A4E685]/20 rounded-xl flex items-center justify-center group-hover:bg-[#A4E685]/30 group-hover:scale-105 transition-all">
                            <FiLock className="text-[19px] text-[#0F5132]" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="font-semibold text-[15px] text-gray-900">Change Password</span>
                            <p className="text-[13px] text-gray-500 mt-0.5">Update your security credentials</p>
                          </div>
                        </button>
                        
                        <div className="h-px bg-gray-200 my-2 mx-3"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-4 px-4 py-3.5 text-red-600 hover:bg-red-50 transition-all duration-200 group rounded-2xl"
                        >
                          <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 group-hover:scale-105 transition-all">
                            <FiLogOut className="text-[19px]" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="font-semibold text-[15px]">Logout</span>
                            <p className="text-[13px] text-red-400 mt-0.5">Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login Button for unauthenticated users */
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-[#0F2B10] border font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <FiUser className="text-lg" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="md:hidden flex items-center gap-3">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl hover:bg-primary-light transition-all duration-200"
              aria-label="Menu"
            >
              {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {user ? (
              <div className="flex flex-col space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

                {user.accountType === 'Customer' && (
                  <div className="relative px-4 py-1" ref={mobileSearchRef}>
                    <button
                      onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left font-medium border border-gray-200 bg-white"
                    >
                      <FiMapPin className="text-lg text-primary flex-shrink-0" />
                      <span className="truncate flex-1 text-sm">{searchLocation.locationName}</span>
                      <FiChevronDown className={`text-gray-400 transition-transform duration-200 ml-auto flex-shrink-0 ${isMobileSearchOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Location Dropdown */}
                    {renderLocationDropdown(isMobileSearchOpen, setIsMobileSearchOpen)}
                  </div>
                )}

                {/* Profile menu item in mobile menu */}
                <div className="relative px-4 py-1" ref={mobileProfileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[#0F2B10] hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left font-semibold border border-gray-200 bg-white"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-[#155335]">
                      <FiUser className="text-xs" />
                    </div>
                    <span className="truncate flex-1 text-sm">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}</span>
                    <FiChevronDown className={`text-gray-400 transition-transform duration-200 ml-auto flex-shrink-0 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown for mobile menu item */}
                  {isProfileOpen && (
                    <div className="absolute left-4 right-4 mt-2 bg-white rounded-2xl shadow-banner border border-gray-100 p-2 z-50 animate-fadeIn">
                      <button
                        onClick={() => {
                          setShowPasswordModal(true);
                          setIsProfileOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl text-left"
                      >
                        <div className="w-8 h-8 bg-[#A4E685]/20 rounded-lg flex items-center justify-center">
                          <FiLock className="text-sm text-[#0F5132]" />
                        </div>
                        <span className="font-semibold text-xs text-gray-900">Change Password</span>
                      </button>
                      
                      <div className="h-px bg-gray-200 my-1 mx-2"></div>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-xl text-left"
                      >
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                          <FiLogOut className="text-sm" />
                        </div>
                        <span className="font-semibold text-xs">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Login Button for mobile unauthenticated users */
              <div className="px-4">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-[#0F2B10] 
                  border
                  font-semibold rounded-full hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiUser className="text-lg" />
                  Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

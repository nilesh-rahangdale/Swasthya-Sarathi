import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, changePassword } from '../../redux/slices/authSlice';
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingCart, FiHome, FiLock, FiChevronDown } from 'react-icons/fi';
import { FaPills, FaStethoscope } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
// import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo1.png" 
              alt="Swasthya Sarathi Logo" 
              className="h-20 w-auto"
            />
            {/* <div className="text-2xl font-bold text-primary-600">
              Swasthya Sarathi
            </div> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* User Menu */}
            <div className="relative pl-4 border-l border-gray-200" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <FiUser className="text-lg" />
                <span className="font-medium">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}</span>
                <FiChevronDown className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-2xl text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <p className="text-xs text-primary-600 font-medium mt-1">{user?.accountType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowPasswordModal(true);
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <FiLock className="text-lg" />
                      <span>Change Password</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-danger-600 hover:bg-danger-50 transition-colors duration-200"
                    >
                      <FiLogOut className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
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
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-4 py-3 bg-gray-50 rounded-lg mx-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-xl text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm">
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <p className="text-xs text-primary-600 font-medium">{user?.accountType}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiLock />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>
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

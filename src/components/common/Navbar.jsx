import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Home, Users, Calendar, User, LogOut,
  Image, FileText, Newspaper, CalendarClock, Clock4,
  ChevronDown, Menu, X, Network, Settings, ShieldCheck, CreditCard,
} from 'lucide-react';
import { isAdmin } from '../../utils/permissions';
import FamilyContextSwitcher from './FamilyContextSwitcher';

const NAV_GROUPS = [
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    items: [
      { label: 'Members', to: '/family/members', icon: Users },
      { label: 'Tree', to: '/family/tree', icon: Network },
      { label: 'Birthdays', to: '/family/birthdays', icon: Calendar },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    icon: Image,
    items: [
      { label: 'Photos', to: '/media/photos', icon: Image },
      { label: 'Documents', to: '/media/documents', icon: FileText },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    icon: Newspaper,
    items: [
      { label: 'News', to: '/news', icon: Newspaper },
      { label: 'Events', to: '/events', icon: CalendarClock },
      { label: 'Timeline', to: '/timeline', icon: Clock4 },
    ],
  },
];

export default function Navbar() {
  const { isAuthenticated, user, logout, activeFamilyName, globalModeEnabled, isGlobalAdmin, globalAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns and mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenGroup(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleGroup = (id) => setOpenGroup((prev) => (prev === id ? null : id));

  const isGroupActive = (group) =>
    group.items.some((item) => location.pathname.startsWith(item.to));

  const isAdminUser = isAdmin(user);

  if (!isAuthenticated) return null;

  if (location?.pathname === '/') {
    return null;
  }


  return (
    <nav className="bg-white shadow-md relative z-50" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo + desktop nav */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center pr-6 text-xl font-bold text-gray-900 shrink-0"
            >
              <span className="text-blue-600">Ahman Patigi</span>
              <span className="ml-2">Family Tree</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {/* Home — direct link */}
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                <Home className="w-4 h-4 mr-1.5" />
                Home
              </Link>

              <Link
                to="/billing"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith('/billing')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                <CreditCard className="w-4 h-4 mr-1.5" />
                Billing
              </Link>

              {/* Dropdown groups */}
              {NAV_GROUPS.map((group) => {
                const Icon = group.icon;
                const active = isGroupActive(group);
                const isOpen = openGroup === group.id;
                return (
                  <div key={group.id} className="relative">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${active || isOpen
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {group.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {/* Dropdown panel */}
                    {isOpen && (
                      <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-1">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;
                          const itemActive = location.pathname.startsWith(item.to);
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className={`flex items-center px-4 py-2 text-sm transition-colors ${itemActive
                                  ? 'text-blue-600 bg-blue-50 font-medium'
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                            >
                              <ItemIcon className="w-4 h-4 mr-2 shrink-0" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Admin dropdown (admin users only) */}
            {isAdminUser && (
              <div className="relative">
                <button
                  onClick={() => toggleGroup('admin')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith('/admin') || openGroup === 'admin'
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Admin
                  <ChevronDown
                    className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${openGroup === 'admin' ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openGroup === 'admin' && (
                  <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-1">
                    {[
                      { label: 'Signup Requests', to: '/admin/signup-requests' },
                      { label: 'Users', to: '/admin/users' },
                      { label: 'Roles', to: '/admin/roles' },
                      { label: 'Billing Plans', to: '/admin/billing/plans' },
                      { label: 'Billing Subscriptions', to: '/admin/billing/subscriptions' },
                      { label: 'Family Billing Summary', to: '/admin/billing/families' },
                      { label: 'Billing Actions', to: '/admin/billing/actions' },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${location.pathname.startsWith(item.to)
                            ? 'text-purple-600 bg-purple-50 font-medium'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                          }`}
                      >
                        <ShieldCheck className="w-4 h-4 mr-2 shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side: user info + icons */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center gap-2">
              {globalModeEnabled && isGlobalAdmin && globalAccess ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  Global mode
                </span>
              ) : activeFamilyName ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 max-w-40 truncate">
                  {activeFamilyName}
                </span>
              ) : null}
              <FamilyContextSwitcher />
            </div>
            <span className="hidden sm:block text-sm text-gray-600">
              {user?.firstname} {user?.lastname}
            </span>
            <Link
              to="/settings"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
            <Link
              to="/profile"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5 text-gray-600" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-md">
          <div className="px-4 py-3 space-y-1">
            <div className="pb-2">
              <FamilyContextSwitcher variant="panel" forceVisible />
            </div>
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              to="/billing"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith('/billing')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </Link>
            {NAV_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith(item.to)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                    >
                      <ItemIcon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100">
              <Link
                to="/settings"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/settings'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </div>

            {/* Admin section in mobile menu */}
            {isAdminUser && (
              <div className="pt-3 mt-2 border-t border-gray-100">
                <p className="px-3 pb-1 text-xs font-semibold text-purple-400 uppercase tracking-wider">Admin</p>
                {[
                  { label: 'Signup Requests', to: '/admin/signup-requests' },
                  { label: 'Users', to: '/admin/users' },
                  { label: 'Roles', to: '/admin/roles' },
                  { label: 'Billing Plans', to: '/admin/billing/plans' },
                  { label: 'Billing Subscriptions', to: '/admin/billing/subscriptions' },
                  { label: 'Family Billing Summary', to: '/admin/billing/families' },
                  { label: 'Billing Actions', to: '/admin/billing/actions' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith(item.to)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

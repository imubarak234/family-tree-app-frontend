import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Home, Users, Calendar, User, LogOut,
  Image, FileText, Newspaper, CalendarClock, Clock4,
  ChevronDown, Menu, X, Network,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    items: [
      { label: 'Members',   to: '/family/members',   icon: Users },
      { label: 'Tree',      to: '/family/tree',      icon: Network },
      { label: 'Birthdays', to: '/family/birthdays', icon: Calendar },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    icon: Image,
    items: [
      { label: 'Photos',    to: '/media/photos',    icon: Image },
      { label: 'Documents', to: '/media/documents', icon: FileText },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    icon: Newspaper,
    items: [
      { label: 'News',     to: '/news',     icon: Newspaper },
      { label: 'Events',   to: '/events',   icon: CalendarClock },
      { label: 'Timeline', to: '/timeline', icon: Clock4 },
    ],
  },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
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

  if (!isAuthenticated) return null;

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
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4 mr-1.5" />
                Home
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
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        active || isOpen
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {group.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
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
                              className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                itemActive
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
          </div>

          {/* Right side: user info + icons */}
          <div className="flex items-center space-x-2">
            <span className="hidden sm:block text-sm text-gray-600">
              {user?.firstname} {user?.lastname}
            </span>
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
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
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
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname.startsWith(item.to)
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
          </div>
        </div>
      )}
    </nav>
  );
}

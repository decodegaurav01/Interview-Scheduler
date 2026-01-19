import { useLocation } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin/Navbar.css'


export function Navbar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathname = location.pathname
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/whitelist-candidate', label: 'whitelist Cadidate' },
    { href: '/admin/slots', label: 'Manage Slots' },
  ];

  const candidateLinks = [
    { href: '/candidate/slots', label: 'Available Slots' },
  ];

  const links = role === 'admin' ? adminLinks : candidateLinks;

  return (
    <nav className="nav-container">
      <div className="nav-wrapper">
        <div className="nav-content">
          <div className="nav-left">
            <h1 className="nav-brand">Interview Scheduler</h1>
            <div className="nav-links-desktop ">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${currentPathname === link.href ? 'nav-link-active' : 'nav-link-inactive'
                    }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="nav-right">
            <button onClick={handleLogout} className="btn-nav-logout">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn-mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="nav-menu-mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link-mobile ${currentPathname === link.href
                  ? 'nav-link-mobile-active'
                  : 'nav-link-mobile-inactive'
                  }`}
              >
                {link.label}
              </a>
            ))}
            <button onClick={handleLogout} className="nav-link-mobile nav-link-mobile-inactive w-full text-left">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

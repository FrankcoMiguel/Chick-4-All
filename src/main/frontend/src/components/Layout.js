import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Layout({ children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className={`sidebar bg-dark text-white ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '70px' : '250px', minHeight: '100vh', transition: 'width 0.3s ease' }}>
        <div className="p-2">
          <div className="text-center mb-3" style={{ display: isCollapsed ? 'none' : 'block' }}>
            <img 
              src="/chick4all-project.svg" 
              alt="Chick4All Logo" 
              style={{ height: '100px', maxWidth: '100%' }}
              className="mb-2"
            />
            {/* <h5 className="text-white mb-0">Chick4All</h5> */}
          </div>
          
          {isCollapsed && (
            <div className="text-center mb-3">
              <img 
                src="/chick4all-project.svg" 
                alt="Chick4All Logo" 
                style={{ height: '64px', width: '64px' }}
              />
            </div>
          )}
          
          <ul className="nav flex-column">
            <li className="nav-item mb-1">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `nav-link text-white d-flex align-items-center ${isActive ? 'bg-primary' : ''}`
                }
                title={isCollapsed ? 'Dashboard' : ''}
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                {!isCollapsed && 'Dashboard'}
              </NavLink>
            </li>
            
            <li className="nav-item mb-1">
              <NavLink 
                to="/customers" 
                className={({ isActive }) => 
                  `nav-link text-white d-flex align-items-center ${isActive ? 'bg-primary' : ''}`
                }
                title={isCollapsed ? 'Customers' : ''}
              >
                <i className="fas fa-users me-2"></i>
                {!isCollapsed && 'Customers'}
              </NavLink>
            </li>
            
            <li className="nav-item mb-1">
              <NavLink 
                to="/orders" 
                className={({ isActive }) => 
                  `nav-link text-white d-flex align-items-center ${isActive ? 'bg-primary' : ''}`
                }
                title={isCollapsed ? 'Orders' : ''}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                {!isCollapsed && 'Orders'}
              </NavLink>
            </li>
            
            <li className="nav-item mb-1">
              <NavLink 
                to="/items" 
                className={({ isActive }) => 
                  `nav-link text-white d-flex align-items-center ${isActive ? 'bg-primary' : ''}`
                }
                title={isCollapsed ? 'Items' : ''}
              >
                <i className="fas fa-box me-2"></i>
                {!isCollapsed && 'Items'}
              </NavLink>
            </li>
          </ul>
        </div>
        
        {/* User section at bottom */}
        <div className="mt-auto p-2 border-top">
          {!isCollapsed ? (
            <>
              <div className="d-flex align-items-center mb-1">
                <i className="fas fa-user-circle fa-2x me-2"></i>
                <div>
                  <div className="fw-bold">{username}</div>
                  <small className="text-muted">Administrator</small>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm w-100"
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-1">
                <i className="fas fa-user-circle fa-2x"></i>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-fill" style={{ marginLeft: isCollapsed ? '20px' : '20px', transition: 'margin-left 0.3s ease' }}>
        {/* Top navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div className="container-fluid">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={toggleSidebar}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <i className="fas fa-bars"></i>
            </button>
            <span className="navbar-brand mb-0 h1">Chick 4 All</span>
            
            <div className="ms-auto d-flex align-items-center">
              <span className="text-muted me-3">
                <i className="fas fa-clock me-1"></i>
                {new Date().toLocaleDateString()}
              </span>
              
              <div className="dropdown">
                <button 
                  className="btn btn-link text-dark" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-bell"></i>
                  <span className="badge bg-danger rounded-pill">3</span>
                </button>
                <ul className="dropdown-menu">
                  <li><span className="dropdown-item-text">No new notifications</span></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="p-2" style={{ minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
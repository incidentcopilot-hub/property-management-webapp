import { Link, Route, Routes, useLocation } from 'react-router-dom';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import PropertiesPage from './features/properties/pages/PropertiesPage';
import PropertyDetailsPage from './features/properties/pages/PropertyDetailsPage';
import UnitDetailsPage from './features/units/pages/UnitDetailsPage';
import TenantsPage from './features/tenants/pages/TenantsPage';
import TenantDetailsPage from './features/tenants/pages/TenantDetailsPage';
import AuthPage from './features/auth/pages/AuthPage';
import './styles.css';

function App() {
  const location = useLocation();
  const activePath = location.pathname;
  const isAuthPage = activePath === '/' || activePath.startsWith('/auth');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">MVP</p>
          <h1 className="title">Property Management</h1>
          <p className="subtitle">Tools for private landlords to organize rentals.</p>
        </div>
        {!isAuthPage && (
          <nav className="nav">
            <Link className={activePath.startsWith('/dashboard') ? 'nav-active' : ''} to="/dashboard">
              Dashboard
            </Link>
            <Link
              className={activePath.startsWith('/properties') ? 'nav-active' : ''}
              to="/properties"
            >
              Properties
            </Link>
            <Link className={activePath.startsWith('/tenants') ? 'nav-active' : ''} to="/tenants">
              Tenants
            </Link>
            <Link className="ghost-btn" to="/auth" style={{ marginLeft: 8 }}>
              Sign out
            </Link>
          </nav>
        )}
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/tenants/:id" element={<TenantDetailsPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/units/:id" element={<UnitDetailsPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div>
            <p className="label">Property Management</p>
            <p className="footer-title">Operate with confidence.</p>
            <p className="muted">
              Track units, houses, leases, and payments from one streamlined workspace.
            </p>
          </div>
          <div className="footer-links">
            <a href="#">Support</a>
            <a href="#">Status</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

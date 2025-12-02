import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import UnitDetails from './pages/UnitDetails';
import Tenants from './pages/Tenants';
import './styles.css';

function App() {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">MVP</p>
          <h1 className="title">Property Management</h1>
          <p className="subtitle">Tools for private landlords to organize rentals.</p>
        </div>
        <nav className="nav">
          <Link className={activePath === '/' ? 'nav-active' : ''} to="/">
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
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/units/:id" element={<UnitDetails />} />
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

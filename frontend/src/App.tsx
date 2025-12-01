import { Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import UnitDetails from './pages/UnitDetails';
import Tenants from './pages/Tenants';
import './styles.css';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">MVP</p>
          <h1 className="title">Property Management</h1>
          <p className="subtitle">Tools for private landlords to organize rentals.</p>
        </div>
        <nav className="nav">
          <Link to="/">Dashboard</Link>
          <Link to="/properties">Properties</Link>
          <Link to="/tenants">Tenants</Link>
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
        <p>Start capturing units, leases, payments, and tenant communication.</p>
      </footer>
    </div>
  );
}

export default App;

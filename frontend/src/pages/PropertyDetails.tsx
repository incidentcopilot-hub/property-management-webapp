import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJSON } from '../lib/api';

type Property = {
  id: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
};

type Unit = {
  id: string;
  unitNumber: string;
  rentAmount: number;
  status: string;
};

function PropertyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalUnits = units.length;
    const vacantUnits = units.filter((u) => u.status?.toUpperCase() === 'VACANT').length;
    const occupiedUnits = totalUnits - vacantUnits;
    const monthlyPotential = units.reduce((sum, unit) => sum + (unit.rentAmount || 0), 0);

    return { totalUnits, vacantUnits, occupiedUnits, monthlyPotential };
  }, [units]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const propertyData: Property = await fetchJSON(`/properties/${id}`);
        setProperty(propertyData);
        const unitsData: Unit[] = await fetchJSON(`/units/by-property/${id}`);
        setUnits(unitsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p>Loading property...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!property) return <p>Property not found.</p>;
  const location = [property.city, property.country].filter(Boolean).join(', ');

  return (
    <div className="property-page">
      <button className="link" onClick={() => navigate('/properties')}>
        ← Back to properties
      </button>

      <section className="property-hero">
        <div className="property-hero__main">
          <p className="property-hero__eyebrow">Property overview</p>
          <h1>{property.name}</h1>
          <p className="property-hero__address">{property.address}</p>
          {location && <p className="property-hero__location">📍 {location}</p>}
        </div>
        <div className="property-hero__badge">Active portfolio</div>
      </section>

      <section className="property-stats">
        <div className="stat-card">
          <p className="stat-card__label">Total units</p>
          <p className="stat-card__value">{stats.totalUnits}</p>
          <p className="stat-card__helper">Units added for this property</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Occupied</p>
          <p className="stat-card__value">{stats.occupiedUnits}</p>
          <p className="stat-card__helper">Steady income</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Vacant</p>
          <p className="stat-card__value accent">{stats.vacantUnits}</p>
          <p className="stat-card__helper">Ready to lease</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Monthly potential</p>
          <p className="stat-card__value">${stats.monthlyPotential.toLocaleString()}</p>
          <p className="stat-card__helper">Projected rent</p>
        </div>
      </section>

      <section className="unit-section">
        <div className="section-heading">
          <div>
            <p className="label">Units</p>
            <h2 className="section-title">Inventory</h2>
          </div>
          <span className="pill">Total {units.length}</span>
        </div>

        {units.length === 0 && <p className="muted">No units for this property yet.</p>}
        <div className="unit-grid">
          {units.map((unit) => (
            <button
              key={unit.id}
              className="unit-card"
              onClick={() => navigate(`/units/${unit.id}`)}
              aria-label={`Unit ${unit.unitNumber}`}
            >
              <div className="unit-card__header">
                <span className="unit-chip">Unit {unit.unitNumber}</span>
                <span className={`status-pill ${unit.status?.toLowerCase()}`}>{unit.status}</span>
              </div>
              <p className="unit-card__rent">${unit.rentAmount} / month</p>
              <p className="unit-card__meta">Tap to view lease + tenant</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PropertyDetails;

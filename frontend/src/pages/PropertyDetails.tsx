import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJSON } from '../lib/api';

type Property = {
  id: string;
  name: string;
  address: string;
  propertyType: 'APARTMENT' | 'HOUSE';
  monthlyRent?: number;
  occupancy?: 'VACANT' | 'OCCUPIED';
  bedrooms?: number;
  bathrooms?: number;
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
  const [unitError, setUnitError] = useState<string | null>(null);
  const [unitSubmitting, setUnitSubmitting] = useState(false);
  const [unitPanelOpen, setUnitPanelOpen] = useState(false);
  const [unitForm, setUnitForm] = useState({
    unitNumber: '',
    rentAmount: '',
    status: 'VACANT',
  });
  const [rentForm, setRentForm] = useState('');
  const [rentSubmitting, setRentSubmitting] = useState(false);
  const [rentError, setRentError] = useState<string | null>(null);
  const [occupancy, setOccupancy] = useState<'VACANT' | 'OCCUPIED'>('VACANT');

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
        if (propertyData.propertyType === 'HOUSE' && propertyData.monthlyRent) {
          setRentForm(String(propertyData.monthlyRent));
        }
        if (propertyData.occupancy) {
          setOccupancy(propertyData.occupancy as 'VACANT' | 'OCCUPIED');
        }
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

  const handleUnitSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    if (property?.propertyType === 'HOUSE') return;

    const rent = Number(unitForm.rentAmount);
    if (Number.isNaN(rent)) {
      setUnitError('Enter a valid rent amount');
      return;
    }

    setUnitError(null);
    setUnitSubmitting(true);

    try {
      const created = await fetchJSON<Unit>('/units', {
        method: 'POST',
        body: JSON.stringify({
          propertyId: id,
          unitNumber: unitForm.unitNumber.trim(),
          rentAmount: rent,
          status: unitForm.status,
        }),
      });

      setUnits((prev) => [created, ...prev]);
      setUnitForm({ unitNumber: '', rentAmount: '', status: 'VACANT' });
      setUnitPanelOpen(false);
    } catch (err) {
      setUnitError(err instanceof Error ? err.message : 'Failed to add unit');
    } finally {
      setUnitSubmitting(false);
    }
  };

  const handleRentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const rent = rentForm ? Number(rentForm) : undefined;
    if (rentForm && Number.isNaN(rent)) {
      setRentError('Enter a valid rent amount');
      return;
    }

    setRentError(null);
    setRentSubmitting(true);

    try {
      const updated = await fetchJSON<Property>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ monthlyRent: rent, occupancy }),
      });
      setProperty(updated);
      setRentForm(updated.monthlyRent ? String(updated.monthlyRent) : '');
      if (updated.occupancy) setOccupancy(updated.occupancy as 'VACANT' | 'OCCUPIED');
    } catch (err) {
      setRentError(err instanceof Error ? err.message : 'Failed to update rent');
    } finally {
      setRentSubmitting(false);
    }
  };

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
          <p className="property-hero__meta">
            Type: {property.propertyType === 'HOUSE' ? 'House' : 'Apartment / Multi-unit'}
            {property.propertyType === 'HOUSE' && (property.bedrooms || property.bathrooms) && (
              <>
                {' • '}
                {[property.bedrooms ? `${property.bedrooms} bd` : null, property.bathrooms ? `${property.bathrooms} ba` : null]
                  .filter(Boolean)
                  .join(' / ')}
              </>
            )}
            {property.propertyType === 'HOUSE' && property.occupancy && (
              <> • {property.occupancy === 'OCCUPIED' ? 'Occupied' : 'Vacant'}</>
            )}
          </p>
          {location && <p className="property-hero__location">📍 {location}</p>}
        </div>
        <div className="property-hero__badge">Active portfolio</div>
      </section>

      <section className="property-stats">
        {property.propertyType === 'HOUSE' ? (
          <>
            <div className="stat-card">
              <p className="stat-card__label">Monthly rent</p>
              <p className="stat-card__value">
                {property.monthlyRent ? `$${property.monthlyRent.toLocaleString()}` : 'Not set'}
              </p>
              <p className="stat-card__helper">Set the rent for this house</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Bedrooms</p>
              <p className="stat-card__value">{property.bedrooms ?? '—'}</p>
              <p className="stat-card__helper">Configured on creation</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Bathrooms</p>
              <p className="stat-card__value">{property.bathrooms ?? '—'}</p>
              <p className="stat-card__helper">Configured on creation</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Occupancy</p>
              <p className="stat-card__value">{(property.occupancy || 'VACANT').toLowerCase()}</p>
              <p className="stat-card__helper">Set status for this house</p>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </section>
      {property.propertyType === 'APARTMENT' ? (
        <>
          <section className="unit-section">
            <div className="section-heading">
              <div>
                <p className="label">Units</p>
                <h2 className="section-title">Inventory</h2>
              </div>
              <div className="section-actions">
                <span className="pill">Total {units.length}</span>
                <button className="primary-btn" type="button" onClick={() => setUnitPanelOpen(true)}>
                  Add unit
                </button>
              </div>
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

          {unitPanelOpen && (
            <div className="overlay" onClick={() => setUnitPanelOpen(false)}>
              <div className="panel panel-content" onClick={(e) => e.stopPropagation()}>
                <div className="panel-header">
                  <div>
                    <p className="label">Add a unit</p>
                    <h3 style={{ margin: 0 }}>Capture inventory for this property</h3>
                  </div>
                  <button className="ghost-btn" type="button" onClick={() => setUnitPanelOpen(false)}>
                    ×
                  </button>
                </div>
                <form className="form-grid" onSubmit={handleUnitSubmit} style={{ marginTop: 12 }}>
                  <label className="form-field">
                    <span>Unit number</span>
                    <input
                      required
                      value={unitForm.unitNumber}
                      onChange={(e) => setUnitForm({ ...unitForm, unitNumber: e.target.value })}
                      placeholder="1A"
                    />
                  </label>
                  <label className="form-field">
                    <span>Rent amount</span>
                    <input
                      required
                      type="number"
                      min="0"
                      value={unitForm.rentAmount}
                      onChange={(e) => setUnitForm({ ...unitForm, rentAmount: e.target.value })}
                      placeholder="1200"
                    />
                  </label>
                  <label className="form-field">
                    <span>Status</span>
                    <select
                      value={unitForm.status}
                      onChange={(e) => setUnitForm({ ...unitForm, status: e.target.value })}
                    >
                      <option value="VACANT">Vacant</option>
                      <option value="OCCUPIED">Occupied</option>
                    </select>
                  </label>
                  <div
                    className="form-actions"
                    style={{ flexDirection: 'column', alignItems: 'flex-end', marginTop: 'auto' }}
                  >
                    <button type="submit" className="primary-btn" disabled={unitSubmitting}>
                      {unitSubmitting ? 'Saving...' : 'Add unit'}
                    </button>
                    <button className="ghost-btn" type="button" onClick={() => setUnitPanelOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
                {unitError && <p className="text-danger">Failed to add unit: {unitError}</p>}
              </div>
            </div>
          )}
        </>
      ) : (
        <section className="unit-section">
          <div className="section-heading">
            <div>
              <p className="label">House settings</p>
              <h2 className="section-title">Rent & occupancy</h2>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleRentSubmit}>
            <label className="form-field">
              <span>Monthly rent</span>
              <input
                type="number"
                min="0"
                value={rentForm}
                onChange={(e) => setRentForm(e.target.value)}
                placeholder="2000"
              />
            </label>
            <label className="form-field">
              <span>Status</span>
              <select value={occupancy} onChange={(e) => setOccupancy(e.target.value as 'VACANT' | 'OCCUPIED')}>
                <option value="VACANT">Vacant</option>
                <option value="OCCUPIED">Occupied</option>
              </select>
            </label>
            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={rentSubmitting}>
                {rentSubmitting ? 'Saving...' : 'Save rent'}
              </button>
            </div>
          </form>
          {rentError && <p className="text-danger">Failed to save rent: {rentError}</p>}
        </section>
      )}
    </div>
  );
}

export default PropertyDetails;

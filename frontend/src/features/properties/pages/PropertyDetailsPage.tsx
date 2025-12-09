import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/Loader';
import SlideOver from '../../../components/SlideOver';
import { createTenant } from '../../tenants/api';
import { createUnit, getUnit } from '../../units/api';
import { Unit } from '../../units/types';
import { getProperty, getUnitsForProperty, updateHouse } from '../api';
import { Property, OccupancyStatus } from '../types';

function PropertyDetailsPage() {
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
  const [tenantPanelOpen, setTenantPanelOpen] = useState(false);
  const [tenantSubmitting, setTenantSubmitting] = useState(false);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [tenantForm, setTenantForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [tenantCount, setTenantCount] = useState(0);
  const [rentForm, setRentForm] = useState('');
  const [rentSubmitting, setRentSubmitting] = useState(false);
  const [rentError, setRentError] = useState<string | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyStatus>('VACANT');

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
        const propertyData = await getProperty(id);
        setProperty(propertyData);
        if (propertyData.propertyType === 'HOUSE' && propertyData.monthlyRent) {
          setRentForm(String(propertyData.monthlyRent));
        }
        if (propertyData.occupancy) {
          setOccupancy(propertyData.occupancy);
        }
        const unitsData = await getUnitsForProperty(id);
        setUnits(unitsData);
        if (propertyData.propertyType === 'HOUSE' && unitsData[0]) {
          const unitWithTenants = await getUnit(unitsData[0].id);
          setTenantCount(unitWithTenants.tenants?.length || 0);
        }
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
      const created = await createUnit({
        propertyId: id,
        unitNumber: unitForm.unitNumber.trim(),
        rentAmount: rent,
        status: unitForm.status,
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

    if (property?.propertyType === 'HOUSE' && occupancy === 'OCCUPIED' && tenantCount === 0) {
      setRentError('Assign a tenant before marking this house occupied');
      return;
    }

    setRentError(null);
    setRentSubmitting(true);

    try {
      const updated = await updateHouse(id, { monthlyRent: rent, occupancy });
      setProperty(updated);
      setRentForm(updated.monthlyRent ? String(updated.monthlyRent) : '');
      if (updated.occupancy) setOccupancy(updated.occupancy as 'VACANT' | 'OCCUPIED');
    } catch (err) {
      setRentError(err instanceof Error ? err.message : 'Failed to update rent');
    } finally {
      setRentSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading property..." />;
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

          <SlideOver
            isOpen={unitPanelOpen}
            onClose={() => setUnitPanelOpen(false)}
            title="Capture inventory for this property"
            subtitle="Add a unit"
            footer={
              <div className="form-actions">
                <button type="submit" form="unit-form" className="primary-btn" disabled={unitSubmitting}>
                  {unitSubmitting ? 'Saving...' : 'Add unit'}
                </button>
                <button className="ghost-btn" type="button" onClick={() => setUnitPanelOpen(false)}>
                  Cancel
                </button>
              </div>
            }
          >
            <form id="unit-form" className="form-grid" onSubmit={handleUnitSubmit}>
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
              {unitError && <p className="text-danger">Failed to add unit: {unitError}</p>}
            </form>
          </SlideOver>
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
              <select value={occupancy} onChange={(e) => setOccupancy(e.target.value as OccupancyStatus)}>
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

          <div className="card" style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p className="label">Tenants</p>
              <h3 className="section-title">Assign to this house</h3>
              <p className="muted" style={{ margin: 0 }}>
                {tenantCount > 0
                  ? `${tenantCount} tenant${tenantCount === 1 ? '' : 's'} linked`
                  : 'No tenant assigned yet.'}
              </p>
            </div>
            <button className="primary-btn" type="button" onClick={() => setTenantPanelOpen(true)}>
              Add tenant
            </button>
          </div>
        </section>
      )}

      <SlideOver
        isOpen={tenantPanelOpen}
        onClose={() => setTenantPanelOpen(false)}
        title="Assign tenant"
        subtitle="Link a renter to this house"
        footer={
          <div className="form-actions">
            <button className="primary-btn" type="submit" form="house-tenant-form" disabled={tenantSubmitting}>
              {tenantSubmitting ? 'Assigning...' : 'Assign tenant'}
            </button>
            <button className="ghost-btn" type="button" onClick={() => setTenantPanelOpen(false)}>
              Cancel
            </button>
            {tenantError && <p className="text-danger">Failed to assign tenant: {tenantError}</p>}
          </div>
        }
      >
        <form
          id="house-tenant-form"
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!id) return;
            setTenantError(null);
            setTenantSubmitting(true);
            try {
              let targetUnitId = units[0]?.id;
              if (!targetUnitId) {
                const createdUnit = await createUnit({
                  propertyId: id,
                  unitNumber: 'HOUSE',
                  rentAmount: property?.monthlyRent || 0,
                  status: 'OCCUPIED',
                });
                targetUnitId = createdUnit.id;
                setUnits((prev) => [createdUnit, ...prev]);
              }

              await createTenant({
                firstName: tenantForm.firstName.trim(),
                lastName: tenantForm.lastName.trim(),
                phone: tenantForm.phone.trim(),
                email: tenantForm.email.trim() || undefined,
                unitId: targetUnitId,
              });

              setTenantForm({ firstName: '', lastName: '', phone: '', email: '' });
              setTenantCount((c) => c + 1);
              setOccupancy('OCCUPIED');
              const updatedHouse = await updateHouse(id, {
                occupancy: 'OCCUPIED',
                monthlyRent: rentForm ? Number(rentForm) : property?.monthlyRent,
              });
              setProperty(updatedHouse);
              setTenantPanelOpen(false);
            } catch (err) {
              setTenantError(err instanceof Error ? err.message : 'Failed to assign tenant');
            } finally {
              setTenantSubmitting(false);
            }
          }}
        >
          <label className="form-field">
            <span>First name</span>
            <input
              required
              value={tenantForm.firstName}
              onChange={(e) => setTenantForm({ ...tenantForm, firstName: e.target.value })}
              placeholder="Lessee first name"
            />
          </label>
          <label className="form-field">
            <span>Last name</span>
            <input
              required
              value={tenantForm.lastName}
              onChange={(e) => setTenantForm({ ...tenantForm, lastName: e.target.value })}
              placeholder="Lessee last name"
            />
          </label>
          <label className="form-field">
            <span>Phone</span>
            <input
              required
              value={tenantForm.phone}
              onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
              placeholder="+1 555 123 4567"
            />
          </label>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={tenantForm.email}
              onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
              placeholder="tenant@example.com"
            />
          </label>
        </form>
      </SlideOver>
    </div>
  );
}

export default PropertyDetailsPage;

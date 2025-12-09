import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/Loader';
import SlideOver from '../../../components/SlideOver';
import { getProperty } from '../../properties/api';
import { createTenant } from '../../tenants/api';
import { getUnit, updateUnit } from '../api';
import { Unit } from '../types';

function UnitDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyLabel, setPropertyLabel] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [assignPanelOpen, setAssignPanelOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await getUnit(id);
        setUnit(data);
        if (data?.propertyId) {
          const property = await getProperty(data.propertyId);
          setPropertyLabel(property.name);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load unit');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <Loader label="Loading unit..." />;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!unit) return <p>Unit not found.</p>;

  const statusClass = unit.status?.toLowerCase();
  const isVacant = statusClass === 'vacant';
  const quickActions = [
    isVacant ? 'Create a listing for this unit' : 'Schedule next renewal conversation',
    isVacant ? 'Arrange a turnover cleaning and photos' : 'Check payment status for this month',
    'Attach lease and documents',
  ];

  return (
    <div className="stack-md">
      <button className="link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section className="card unit-hero">
        <div className="unit-hero__header">
          <div>
            <p className="label">Unit overview</p>
            <h1 className="unit-hero__title">Unit {unit.unitNumber}</h1>
            <p className="unit-hero__meta">
              Property:{' '}
              {propertyLabel ? (
                <Link to={`/properties/${unit.propertyId}`} className="table-link">
                  {propertyLabel}
                </Link>
              ) : (
                <span>{unit.propertyId}</span>
              )}
            </p>
          </div>
          <div className="unit-hero__chips">
            <span className={`status-pill ${statusClass}`}>{unit.status || 'Unknown'}</span>
          </div>
        </div>
        <div className="unit-hero__body">
          <div className="unit-hero__rent">
            <p className="label">Monthly rent</p>
            <p className="unit-hero__rent-value">${unit.rentAmount.toLocaleString()}</p>
            <p className="helper">Set by the property manager</p>
          </div>
          <div className="unit-hero__actions">
            <p className="label">Quick actions</p>
            <ul className="unit-hero__tasks">
              {quickActions.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="unit-grid">
        <article className="stat-card">
          <p className="stat-card__label">Status</p>
          <p className="stat-card__value">{unit.status || 'Unknown'}</p>
          <p className="stat-card__helper">
            {isVacant ? 'Mark occupied when leased' : 'Tenant is marked as in place'}
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Property</p>
          <p className="stat-card__value">{propertyLabel || 'Not linked'}</p>
          <p className="stat-card__helper">Relationship to the parent property</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Tenants</p>
          <p className="stat-card__value">{unit.tenants?.length ?? 0}</p>
          <p className="stat-card__helper">Assigned to this unit</p>
        </article>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="label">Occupants</p>
            <h3 className="section-title">Assigned tenants</h3>
          </div>
          {isVacant && (
            <button className="primary-btn" type="button" onClick={() => setAssignPanelOpen(true)}>
              Assign tenant
            </button>
          )}
        </div>
        {unit.tenants?.length ? (
          <div className="tenant-list">
            {unit.tenants.map((tenant) => (
              <div key={tenant.id} className="lease-item">
                <div>
                  <p className="lease-date">
                    <Link to={`/tenants/${tenant.id}`} className="table-link">
                      {tenant.name}
                    </Link>
                  </p>
                  <p className="muted">
                    Email: {tenant.email || '—'}
                  </p>
                  <p className="muted">
                    Phone: {tenant.phone || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            No tenant assigned yet.
          </p>
        )}
      </section>

      <SlideOver
        isOpen={isVacant && assignPanelOpen}
        onClose={() => setAssignPanelOpen(false)}
        title="Assign tenant"
        subtitle="Link a renter to this unit"
        footer={
          <div className="form-actions">
            <button className="primary-btn" type="submit" form="assign-tenant-form" disabled={assigning}>
              {assigning ? 'Assigning...' : 'Assign tenant'}
            </button>
            <button className="ghost-btn" type="button" onClick={() => setAssignPanelOpen(false)}>
              Cancel
            </button>
          </div>
        }
      >
        <form
          id="assign-tenant-form"
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!id) return;
            setAssignError(null);
            setAssigning(true);
            try {
              const created = await createTenant({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phone: form.phone.trim(),
                email: form.email.trim() || undefined,
                unitId: id,
              });
              setForm({ firstName: '', lastName: '', phone: '', email: '' });
              setUnit((prev) =>
                prev
                  ? { ...prev, tenants: [created, ...(prev.tenants || [])], status: 'OCCUPIED' }
                  : prev
              );
              await updateUnit(id, { status: 'OCCUPIED' });
              setAssignPanelOpen(false);
            } catch (err) {
              setAssignError(err instanceof Error ? err.message : 'Failed to assign tenant');
            } finally {
              setAssigning(false);
            }
          }}
        >
          <label className="form-field">
            <span>First name</span>
            <input
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Lessee first name"
            />
          </label>
          <label className="form-field">
            <span>Last name</span>
            <input
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Lessee last name"
            />
          </label>
          <label className="form-field">
            <span>Phone</span>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 555 123 4567"
            />
          </label>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tenant@example.com"
            />
          </label>
          {assignError && <p className="text-danger">Failed to assign tenant: {assignError}</p>}
        </form>
      </SlideOver>
    </div>
  );
}

export default UnitDetailsPage;

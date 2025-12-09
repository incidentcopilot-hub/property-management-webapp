import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/Loader';
import SlideOver from '../../../components/SlideOver';
import { createLease, getLeasesByTenant } from '../../leases/api';
import { Lease } from '../../leases/types';
import { getTenant } from '../api';
import { Tenant } from '../types';

function TenantDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leasePanelOpen, setLeasePanelOpen] = useState(false);
  const [leaseSubmitting, setLeaseSubmitting] = useState(false);
  const [leaseError, setLeaseError] = useState<string | null>(null);
  const [leaseForm, setLeaseForm] = useState({
    startDate: '',
    endDate: '',
    documentUrl: '',
  });

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const [tenantData, leaseData] = await Promise.all([getTenant(id), getLeasesByTenant(id)]);
        setTenant(tenantData);
        setLeases(leaseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tenant');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const activeLease = useMemo(
    () => leases.find((lease) => !lease.endDate),
    [leases]
  );

  const handleLeaseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !tenant?.unit) return;
    setLeaseError(null);
    setLeaseSubmitting(true);
    try {
      const created = await createLease({
        tenantId: id,
        unitId: tenant.unit.id,
        startDate: leaseForm.startDate || new Date().toISOString(),
        endDate: leaseForm.endDate || undefined,
        documentUrl: leaseForm.documentUrl || undefined,
      });
      setLeases((prev) => [created, ...prev]);
      setLeaseForm({ startDate: '', endDate: '', documentUrl: '' });
      setLeasePanelOpen(false);
    } catch (err) {
      setLeaseError(err instanceof Error ? err.message : 'Failed to create lease');
    } finally {
      setLeaseSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading tenant..." />;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!tenant) return <p>Tenant not found.</p>;

  return (
    <div className="stack-md">
      <button className="link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section className="card tenant-hero">
        <div>
          <p className="label">Tenant</p>
          <h1 className="tenant-hero__title">{tenant.name}</h1>
          <p className="tenant-hero__contact">{tenant.email || tenant.phone}</p>
          <p className="tenant-hero__meta">Unit: {tenant.unit?.unitNumber ?? 'Unassigned'}</p>
        </div>
        <div className="tenant-hero__cta">
          <span className="pill">ID: {tenant.id}</span>
          <span className="pill pill--soft">
            {activeLease ? 'Active lease' : leases.length ? 'Past lease' : 'No lease on file'}
          </span>
        </div>
      </section>

      <section className="grid">
        <article className="stat-card">
          <p className="stat-card__label">Primary phone</p>
          <p className="stat-card__value">{tenant.phone}</p>
          <p className="stat-card__helper">Use for outreach and reminders</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Email</p>
          <p className="stat-card__value">{tenant.email || 'Not provided'}</p>
          <p className="stat-card__helper">Send statements and receipts</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Unit</p>
          <p className="stat-card__value">{tenant.unit?.unitNumber ?? 'Pending'}</p>
          <p className="stat-card__helper">Syncs with rent and maintenance</p>
        </article>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="label">Leases</p>
            <h3 className="section-title">History</h3>
          </div>
          {tenant.unit && (
            <button className="primary-btn" type="button" onClick={() => setLeasePanelOpen(true)}>
              Add lease
            </button>
          )}
        </div>

        {leases.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No leases recorded for this tenant yet.
          </p>
        ) : (
          <div className="lease-list">
            {leases.map((lease) => (
              <div key={lease.id} className="lease-item">
                <div>
                  <p className="lease-date">
                    {new Date(lease.startDate).toLocaleDateString()} →{' '}
                    {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : 'Present'}
                  </p>
                  <p className="muted">
                    Unit: {lease.unit?.unitNumber ? `Unit ${lease.unit.unitNumber}` : 'Not linked'}
                  </p>
                  {lease.documentUrl && (
                    <p className="muted">
                      <a href={lease.documentUrl} target="_blank" rel="noreferrer">
                        View document
                      </a>
                    </p>
                  )}
                </div>
                <span className="pill">{lease.id.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <SlideOver
        isOpen={leasePanelOpen}
        onClose={() => setLeasePanelOpen(false)}
        title="Add lease"
        subtitle="Attach lease details and link to tenant"
        footer={
          <div className="form-actions">
            <button className="primary-btn" type="submit" form="lease-form" disabled={leaseSubmitting}>
              {leaseSubmitting ? 'Saving...' : 'Save lease'}
            </button>
            <button className="ghost-btn" type="button" onClick={() => setLeasePanelOpen(false)}>
              Cancel
            </button>
            {leaseError && <p className="text-danger">Failed to save lease: {leaseError}</p>}
          </div>
        }
      >
        <form id="lease-form" className="form-grid" onSubmit={handleLeaseSubmit}>
          <label className="form-field">
            <span>Start date</span>
            <input
              type="date"
              value={leaseForm.startDate}
              onChange={(e) => setLeaseForm({ ...leaseForm, startDate: e.target.value })}
            />
          </label>
          <label className="form-field">
            <span>End date</span>
            <input
              type="date"
              value={leaseForm.endDate}
              onChange={(e) => setLeaseForm({ ...leaseForm, endDate: e.target.value })}
            />
          </label>
          <label className="form-field">
            <span>Lease document URL</span>
            <input
              type="url"
              value={leaseForm.documentUrl}
              onChange={(e) => setLeaseForm({ ...leaseForm, documentUrl: e.target.value })}
              placeholder="https://..."
            />
          </label>
        </form>
      </SlideOver>
    </div>
  );
}

export default TenantDetailsPage;

import { useEffect, useMemo, useState } from 'react';
import Loader from '../../../components/Loader';
import { useNavigate } from 'react-router-dom';
import TenantRow from '../components/TenantRow';
import { getTenants } from '../api';
import { Tenant } from '../types';

function TenantsPage() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTenants()
      .then((data) => setTenants(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const formatted = tenants.map((tenant) => {
      const parts = tenant.name?.trim().split(/\s+/) || [];
      const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0] || '';
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : '';
      const displayName = [lastName, firstName].filter(Boolean).join(' ');

      return {
        id: tenant.id,
        name: displayName || tenant.name,
        sortKey: lastName.toLowerCase(),
        unitLabel: tenant.unit?.unitNumber ? `Unit ${tenant.unit.unitNumber}` : '—',
        unitId: tenant.unit?.id,
        status: tenant.unit ? 'Current' : '—',
        balance: '—',
        contact: tenant.email || tenant.phone,
      };
    });

    return formatted.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [tenants]);

  return (
    <div className="stack-md">
      <div className="section-heading section-heading--stack">
        <div className="section-title-group">
          <p className="label">Portfolio</p>
          <h2>Tenants</h2>
        </div>
        <span className="pill">Total {tenants.length}</span>
      </div>

      {loading && <Loader label="Loading tenants..." />}
      {error && <p className="text-danger">Failed to load tenants: {error}</p>}

      {!loading && !error && (
        <div className="card table">
          <div className="table-head table-grid">
            <span>Name</span>
            <span>Unit</span>
            <span>Status</span>
            <span>Balance</span>
            <span>Contact</span>
            <span aria-hidden />
          </div>
          {rows.length === 0 ? (
            <p style={{ margin: 16 }} className="muted">
              No tenants yet.
            </p>
          ) : (
            rows.map((tenant) => (
              <TenantRow key={tenant.id} {...tenant} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TenantsPage;

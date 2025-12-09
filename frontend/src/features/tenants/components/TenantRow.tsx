import { useState } from 'react';
import { Link } from 'react-router-dom';

type TenantRowProps = {
  id: string;
  name: string;
  unitLabel: string;
  unitId?: string;
  status: string;
  balance: string;
  contact: string;
};

function TenantRow({ id, name, unitLabel, unitId, status, balance, contact }: TenantRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusClass = status.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="tenant-row table-grid">
      <Link to={`/tenants/${id}`} className="table-link">
        {name}
      </Link>
      {unitId ? (
        <Link to={`/units/${unitId}`} className="table-link">
          {unitLabel}
        </Link>
      ) : (
        <span>{unitLabel}</span>
      )}
      <span className={`status ${statusClass}`}>{status}</span>
      <span>{balance}</span>
      <span>{contact}</span>
      <div className="table-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          ⋮
        </button>
        {menuOpen && (
          <div className="table-menu">
            <Link
              to={`/tenants/${id}`}
              className="table-menu__item"
              onClick={() => setMenuOpen(false)}
            >
              View details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantRow;

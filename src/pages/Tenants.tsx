import TenantRow from '../components/TenantRow';

const tenants = [
  {
    name: 'Jordan Matthews',
    unit: 'Maple Apts — 2B',
    status: 'Current',
    balance: '$0.00',
    contact: 'jordan@example.com'
  },
  {
    name: 'Priya Singh',
    unit: 'Riverside — 3A',
    status: 'Late',
    balance: '$1,200',
    contact: 'priya@example.com'
  },
  {
    name: 'Diego Alvarez',
    unit: 'Oakwood — Unit 1',
    status: 'Renewal pending',
    balance: '$0.00',
    contact: 'diego@example.com'
  }
];

function Tenants() {
  return (
    <div className="stack-md">
      <h2>Tenants</h2>
      <div className="card">
        <div className="table-head">
          <span>Name</span>
          <span>Unit</span>
          <span>Status</span>
          <span>Balance</span>
          <span>Contact</span>
        </div>
        {tenants.map((tenant) => (
          <TenantRow key={tenant.name} {...tenant} />
        ))}
      </div>
    </div>
  );
}

export default Tenants;

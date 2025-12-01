type TenantRowProps = {
  name: string;
  unit: string;
  status: string;
  balance: string;
  contact: string;
};

function TenantRow({ name, unit, status, balance, contact }: TenantRowProps) {
  return (
    <div className="tenant-row">
      <span>{name}</span>
      <span>{unit}</span>
      <span className={`status ${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
      <span>{balance}</span>
      <span>{contact}</span>
    </div>
  );
}

export default TenantRow;

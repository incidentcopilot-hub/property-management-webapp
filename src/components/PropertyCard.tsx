type PropertyCardProps = {
  name: string;
  address: string;
  units: number;
  occupancy: string;
  nextAction: string;
};

function PropertyCard({ name, address, units, occupancy, nextAction }: PropertyCardProps) {
  return (
    <article className="card property-card">
      <header className="section-heading">
        <div>
          <p className="label">{address}</p>
          <h3>{name}</h3>
        </div>
        <span className="pill">{units} units</span>
      </header>
      <p className="value">{occupancy}</p>
      <p className="helper">{nextAction}</p>
    </article>
  );
}

export default PropertyCard;

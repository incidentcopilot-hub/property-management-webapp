type Property = {
  id: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
};

type Props = {
  property: Property;
  onClick: () => void;
};

function PropertyCard({ property, onClick }: Props) {
  const location = [property.city, property.country].filter(Boolean).join(', ');

  return (
    <button className="property-card" onClick={onClick}>
      <div className="property-card__header">
        <div>
          <p className="property-card__eyebrow">Property</p>
          <h3>{property.name}</h3>
        </div>
        <span className="property-card__badge">Manage</span>
      </div>

      <p className="property-card__address">{property.address}</p>
      {location && <p className="property-card__location">📍 {location}</p>}

      <div className="property-card__footer">
        <span className="property-card__chip">Units & tenants</span>
      </div>
    </button>
  );
}

export default PropertyCard;

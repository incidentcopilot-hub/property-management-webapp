import { Property } from '../types';

type Props = {
  property: Property;
  onClick: () => void;
};

function PropertyCard({ property, onClick }: Props) {
  const location = [property.city, property.country].filter(Boolean).join(', ');
  const typeLabel =
    property.propertyType === 'HOUSE' ? 'House' : 'Apartment / Multi-unit';
  const rentLabel =
    property.propertyType === 'HOUSE' && property.monthlyRent
      ? `$${property.monthlyRent.toLocaleString()}/mo`
      : null;
  const unitCount = property.units?.length ?? 0;
  const occupancyLabel =
    property.occupancy === 'OCCUPIED' ? 'Occupied' : property.occupancy === 'VACANT' ? 'Vacant' : '';
  const chipText =
    property.propertyType === 'HOUSE'
      ? [
          property.bedrooms ? `${property.bedrooms} bd` : null,
          property.bathrooms ? `${property.bathrooms} ba` : null,
          occupancyLabel,
        ]
          .filter(Boolean)
          .join(' • ')
      : `${unitCount} unit${unitCount === 1 ? '' : 's'}`;

  return (
    <button className="property-card" onClick={onClick}>
      <div className="property-card__header">
        <div>
          <p className="property-card__eyebrow">Property</p>
          <h3>{property.name}</h3>
        </div>
        <span className="property-card__badge">{typeLabel}</span>
      </div>

      <p className="property-card__address">{property.address}</p>
      {location && <p className="property-card__location">📍 {location}</p>}

      <div className="property-card__footer">
        <span className="property-card__chip">
          {rentLabel ? `Rent ${rentLabel}` : chipText}
        </span>
      </div>
    </button>
  );
}

export default PropertyCard;

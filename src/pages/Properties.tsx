import PropertyCard from '../components/PropertyCard';

const properties = [
  {
    name: 'Maple Apartments',
    address: '123 Maple St, Springfield',
    units: 6,
    occupancy: '5/6 occupied',
    nextAction: 'Renewal: Unit 3A by Jan 12'
  },
  {
    name: 'Riverside Flats',
    address: '98 River Rd, Springfield',
    units: 4,
    occupancy: '2/4 occupied',
    nextAction: 'Fill vacancies 2B and 4A'
  },
  {
    name: 'Oakwood Duplex',
    address: '12 Oak Ave, Springfield',
    units: 2,
    occupancy: '2/2 occupied',
    nextAction: 'Schedule annual inspections'
  }
];

function Properties() {
  return (
    <div className="stack-md">
      <h2>Properties</h2>
      <div className="grid">
        {properties.map((property) => (
          <PropertyCard key={property.name} {...property} />
        ))}
      </div>
    </div>
  );
}

export default Properties;

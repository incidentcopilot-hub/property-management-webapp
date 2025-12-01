import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import { fetchJSON } from '../lib/api';

type Property = {
  id: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
};

type Unit = {
  id: string;
  unitNumber: string;
  rentAmount: number;
  status: string;
};

function PropertyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const propertyData: Property = await fetchJSON(`/properties/${id}`);
        setProperty(propertyData);
        const unitsData: Unit[] = await fetchJSON(`/units/by-property/${id}`);
        setUnits(unitsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p>Loading property...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div className="stack-md">
      <button className="link" onClick={() => navigate('/properties')}>
        ← Back to properties
      </button>
      <h1>{property.name}</h1>
      <p>{property.address}</p>
      {(property.city || property.country) && (
        <p className="muted">{[property.city, property.country].filter(Boolean).join(', ')}</p>
      )}

      <div className="stack-sm">
        <h2>Units</h2>
        {units.length === 0 && <p className="muted">No units for this property yet.</p>}
        <div className="grid">
          {units.map((unit) => (
            <Card key={unit.id} title={`Unit ${unit.unitNumber}`} onClick={() => navigate(`/units/${unit.id}`)}>
              <p>Rent: ${unit.rentAmount}</p>
              <p className="muted">Status: {unit.status}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;

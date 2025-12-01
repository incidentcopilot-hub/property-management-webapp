import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { fetchJSON } from '../lib/api';

type Property = {
  id: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
};

function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJSON('/properties')
      .then((data: Property[]) => setProperties(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="stack-md">
      <h2>Properties</h2>
      {loading && <p>Loading properties...</p>}
      {error && <p className="text-danger">Failed to load properties: {error}</p>}
      {!loading && !error && properties.length === 0 && <p>No properties found.</p>}

      <div className="grid">
        {properties.map((property) => (
          <Card
            key={property.id}
            title={property.name}
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <p>{property.address}</p>
            {(property.city || property.country) && (
              <p className="muted">{[property.city, property.country].filter(Boolean).join(', ')}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Properties;

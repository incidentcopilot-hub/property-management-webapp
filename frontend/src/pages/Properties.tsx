import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
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
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => navigate(`/properties/${property.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Properties;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJSON } from '../lib/api';

type Unit = {
  id: string;
  propertyId: string;
  unitNumber: string;
  rentAmount: number;
  status: string;
};

function UnitDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetchJSON(`/units/${id}`)
      .then((data: Unit) => setUnit(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading unit...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!unit) return <p>Unit not found.</p>;

  return (
    <div className="stack-md">
      <button className="link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>Unit {unit.unitNumber}</h1>
      <p>Rent: ${unit.rentAmount}</p>
      <p>Status: {unit.status}</p>
      <p className="muted">Property ID: {unit.propertyId}</p>
    </div>
  );
}

export default UnitDetails;

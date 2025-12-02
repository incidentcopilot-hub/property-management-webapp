import { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard';
import TaskList from '../components/TaskList';
import { fetchJSON } from '../lib/api';

type Property = {
  id: string;
  propertyType: 'APARTMENT' | 'HOUSE';
  monthlyRent?: number;
  occupancy?: 'VACANT' | 'OCCUPIED';
};

type Unit = {
  id: string;
  rentAmount: number;
  status: string;
};

const tasks = [
  'Send lease renewal paperwork to Unit 4B',
  'Schedule HVAC vendor for building A',
  'Follow up on late payment for Tenant #104',
];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [propertyData, unitData] = await Promise.all([
          fetchJSON<Property[]>('/properties'),
          fetchJSON<Unit[]>('/units'),
        ]);
        setProperties(propertyData);
        setUnits(unitData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const occupiedUnits = units.filter((u) => u.status?.toUpperCase() === 'OCCUPIED');
  const vacantUnits = units.filter((u) => u.status?.toUpperCase() === 'VACANT');
  const houseRent = properties
    .filter((p) => p.propertyType === 'HOUSE' && p.monthlyRent)
    .reduce((sum, p) => sum + (p.monthlyRent || 0), 0);
  const rentCollected =
    occupiedUnits.reduce((sum, unit) => sum + (unit.rentAmount || 0), 0) + houseRent;

  const summary = [
    {
      label: 'Units',
      value: (units.length || 0).toString(),
      helper: `${occupiedUnits.length} occupied / ${vacantUnits.length} vacant`,
    },
    {
      label: 'Rent collected',
      value: `$${rentCollected.toLocaleString()}`,
      helper: 'Occupied units + house rents',
    },
    {
      label: 'Open tickets',
      value: '—',
      helper: 'No maintenance data yet',
    },
  ];

  return (
    <div className="stack-md">
      {loading && <p>Loading portfolio...</p>}
      {error && <p className="text-danger">Failed to load dashboard: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid">
            {summary.map((item) => (
              <SummaryCard
                key={item.label}
                label={item.label}
                value={item.value}
                helper={item.helper}
              />
            ))}
          </div>

          <TaskList title="Next actions" tasks={tasks} />
        </>
      )}
    </div>
  );
}

export default Dashboard;

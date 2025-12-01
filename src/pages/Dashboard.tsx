import SummaryCard from '../components/SummaryCard';
import TaskList from '../components/TaskList';

const summary = [
  { label: 'Units', value: '12', helper: '8 occupied / 4 vacant' },
  { label: 'Rent collected', value: '$14,250', helper: 'Current month to-date' },
  { label: 'Open tickets', value: '3', helper: '2 urgent, 1 routine' }
];

const tasks = [
  'Send lease renewal paperwork to Unit 4B',
  'Schedule HVAC vendor for building A',
  'Follow up on late payment for Tenant #104'
];

function Dashboard() {
  return (
    <div className="stack-md">
      <div className="grid">
        {summary.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} helper={item.helper} />
        ))}
      </div>

      <TaskList title="Next actions" tasks={tasks} />
    </div>
  );
}

export default Dashboard;

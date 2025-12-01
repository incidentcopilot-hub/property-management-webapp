type SummaryCardProps = {
  label: string;
  value: string;
  helper?: string;
};

function SummaryCard({ label, value, helper }: SummaryCardProps) {
  return (
    <article className="card">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
      {helper && <p className="helper">{helper}</p>}
    </article>
  );
}

export default SummaryCard;

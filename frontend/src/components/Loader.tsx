type LoaderProps = {
  label?: string;
  inline?: boolean;
};

function Loader({ label = 'Loading...', inline = false }: LoaderProps) {
  return (
    <div className={`loader ${inline ? 'loader--inline' : ''}`}>
      <span className="loader__spinner" aria-hidden />
      <span className="loader__text">{label}</span>
    </div>
  );
}

export default Loader;

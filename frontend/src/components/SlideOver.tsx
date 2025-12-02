import { ReactNode } from 'react';

type SlideOverProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

function SlideOver({ isOpen, title, subtitle, onClose, children, footer }: SlideOverProps) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="panel panel-content" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <div>
            <p className="label">{subtitle}</p>
            <h3 style={{ margin: 0 }}>{title}</h3>
          </div>
          <button className="ghost-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1 }}>{children}</div>
          {footer && <div style={{ marginTop: 'auto' }}>{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export default SlideOver;

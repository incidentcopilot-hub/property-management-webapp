import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

type Mode = 'signin' | 'signup';

function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up to real auth backend
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <p className="label">Property Management</p>
            <h1>{mode === 'signin' ? 'Welcome back' : 'Get started'}</h1>
            <p className="muted">
              Modern portal for owners and managers — payments, leases, maintenance, and reporting.
            </p>
          </div>
          <div className="auth-switch">
            <button
              className={`chip ${mode === 'signin' ? 'chip--active' : ''}`}
              onClick={() => setMode('signin')}
              type="button"
            >
              Sign in
            </button>
            <button
              className={`chip ${mode === 'signup' ? 'chip--active' : ''}`}
              onClick={() => setMode('signup')}
              type="button"
            >
              Create account
            </button>
          </div>
        </div>

        <div className="auth-body">
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="auth-row">
                <label className="form-field">
                  <span>First name</span>
                  <input required placeholder="Alex" />
                </label>
                <label className="form-field">
                  <span>Last name</span>
                  <input required placeholder="Rivera" />
                </label>
              </div>
            )}
            <label className="form-field">
              <span>Email</span>
              <input required type="email" placeholder="you@company.com" />
            </label>
            <label className="form-field">
              <span>Password</span>
              <input required type="password" placeholder="••••••••" />
            </label>
            {mode === 'signup' && (
              <>
                <label className="form-field">
                  <span>Company / portfolio name</span>
                  <input placeholder="Harbor Lane Properties" />
                </label>
                <label className="form-field">
                  <span>Units under management</span>
                  <select defaultValue="1-10">
                    <option value="1-10">1-10 units</option>
                    <option value="11-50">11-50 units</option>
                    <option value="51-200">51-200 units</option>
                    <option value="200+">200+ units</option>
                  </select>
                </label>
              </>
            )}
            <div className="form-actions">
              <button className="primary-btn" type="submit">
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
              {mode === 'signin' && (
                <button className="ghost-btn" type="button">
                  Forgot password
                </button>
              )}
            </div>
          </form>

          <div className="auth-aside">
            <div className="card auth-highlight">
              <p className="label">Why teams choose us</p>
              <ul>
                <li>Automated rent collection & payouts</li>
                <li>Digital leases with e-signatures</li>
                <li>Maintenance inbox with vendor routing</li>
                <li>Owner-ready reporting & exports</li>
              </ul>
            </div>
            <div className="auth-metrics">
              <div>
                <p className="value">98%</p>
                <p className="muted">On-time payment rate</p>
              </div>
              <div>
                <p className="value">24/7</p>
                <p className="muted">Tenant portal access</p>
              </div>
              <div>
                <p className="value">2 days</p>
                <p className="muted">Average onboarding</p>
              </div>
            </div>
            <p className="muted">
              Need help? <Link to="/support" className="table-link">Book a demo</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

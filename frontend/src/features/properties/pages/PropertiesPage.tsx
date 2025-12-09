import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader';
import SlideOver from '../../../components/SlideOver';
import { createProperty, getProperties } from '../api';
import PropertyCard from '../components/PropertyCard';
import { Property, PropertyType, OccupancyStatus } from '../types';

type FormValues = {
  name: string;
  address: string;
  propertyType: PropertyType;
  occupancy: OccupancyStatus;
  monthlyRent: string;
  bedrooms: string;
  bathrooms: string;
  city: string;
  country: string;
};

function PropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'APARTMENT' | 'HOUSE'>('ALL');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    address: '',
    propertyType: 'APARTMENT',
    occupancy: 'VACANT',
    monthlyRent: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    country: '',
  });

  const loadProperties = () =>
    getProperties()
      .then((data) => setProperties(data))
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    loadProperties().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError(null);
    setSubmitting(true);

    try {
      const created = await createProperty({
        name: formValues.name.trim(),
        address: formValues.address.trim(),
        propertyType: formValues.propertyType,
        occupancy: formValues.propertyType === 'HOUSE' ? formValues.occupancy : undefined,
        monthlyRent:
          formValues.propertyType === 'HOUSE' && formValues.monthlyRent
            ? Number(formValues.monthlyRent)
            : undefined,
        bedrooms:
          formValues.propertyType === 'HOUSE' && formValues.bedrooms
            ? Number(formValues.bedrooms)
            : undefined,
        bathrooms:
          formValues.propertyType === 'HOUSE' && formValues.bathrooms
            ? Number(formValues.bathrooms)
            : undefined,
        city: formValues.city.trim() || undefined,
        country: formValues.country.trim() || undefined,
      });

      setProperties((prev) => [created, ...prev]);
      setFormValues({
        name: '',
        address: '',
        propertyType: 'APARTMENT',
        occupancy: 'VACANT',
        monthlyRent: '',
        bedrooms: '',
        bathrooms: '',
        city: '',
        country: '',
      });
      setPanelOpen(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  const apartments = useMemo(
    () => properties.filter((p) => p.propertyType === 'APARTMENT'),
    [properties]
  );
  const houses = useMemo(() => properties.filter((p) => p.propertyType === 'HOUSE'), [properties]);
  const tabbedList =
    activeTab === 'APARTMENT' ? apartments : activeTab === 'HOUSE' ? houses : properties;

  const renderSection = (title: string, items: Property[]) => (
    <section className="stack-md">
      <div className="section-heading">
        <div>
          <p className="label">{title}</p>
          <h3 className="section-title">{items.length ? `${items.length} listed` : 'No entries'}</h3>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="muted">No {title.toLowerCase()} yet.</p>
      ) : (
        <div className="grid">
          {items.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => navigate(`/properties/${property.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="stack-md">
      <div className="section-heading section-heading--stack">
        <div className="section-title-group">
          <h2>Properties</h2>
        </div>
        <div className="section-actions">
          <div className="filter-row">
            <span className="filter-label">Filter</span>
            <select
              className="filter-select"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
            >
              <option value="ALL">All</option>
              <option value="APARTMENT">Apartments</option>
              <option value="HOUSE">Houses</option>
            </select>
          </div>
          <button className="primary-btn" type="button" onClick={() => setPanelOpen(true)}>
            Add property
          </button>
        </div>
      </div>

      <SlideOver
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Capture a new asset"
        subtitle="New property"
        footer={
          <div className="form-actions" style={{ marginTop: 'auto' }}>
            <button type="submit" form="property-form" className="primary-btn" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add property'}
            </button>
            <button className="ghost-btn" type="button" onClick={() => setPanelOpen(false)}>
              Cancel
            </button>
          </div>
        }
      >
        <form id="property-form" className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Property name</span>
            <input
              required
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              placeholder="Sunrise Apartments"
            />
          </label>
          <label className="form-field">
            <span>Address</span>
            <input
              required
              value={formValues.address}
              onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
              placeholder="123 Main St"
            />
          </label>
          <label className="form-field">
            <span>Asset type</span>
            <select
              value={formValues.propertyType}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  propertyType: e.target.value as PropertyType,
                })
              }
            >
              <option value="APARTMENT">Apartment / Multi-unit</option>
              <option value="HOUSE">Single-family house</option>
            </select>
          </label>
          {formValues.propertyType === 'HOUSE' && (
            <>
              <label className="form-field">
                <span>Occupancy</span>
                <select
                  value={formValues.occupancy}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      occupancy: e.target.value as OccupancyStatus,
                    })
                  }
                >
                  <option value="VACANT">Vacant</option>
                  <option value="OCCUPIED">Occupied</option>
                </select>
              </label>
              <label className="form-field">
                <span>Monthly rent</span>
                <input
                  type="number"
                  min="0"
                  value={formValues.monthlyRent}
                  onChange={(e) => setFormValues({ ...formValues, monthlyRent: e.target.value })}
                  placeholder="2000"
                />
              </label>
              <label className="form-field">
                <span>Bedrooms</span>
                <input
                  type="number"
                  min="0"
                  value={formValues.bedrooms}
                  onChange={(e) => setFormValues({ ...formValues, bedrooms: e.target.value })}
                  placeholder="3"
                />
              </label>
              <label className="form-field">
                <span>Bathrooms</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formValues.bathrooms}
                  onChange={(e) => setFormValues({ ...formValues, bathrooms: e.target.value })}
                  placeholder="2"
                />
              </label>
            </>
          )}
          <label className="form-field">
            <span>City</span>
            <input
              value={formValues.city}
              onChange={(e) => setFormValues({ ...formValues, city: e.target.value })}
              placeholder="City"
            />
          </label>
          <label className="form-field">
            <span>Country</span>
            <input
              value={formValues.country}
              onChange={(e) => setFormValues({ ...formValues, country: e.target.value })}
              placeholder="Country"
            />
          </label>
        </form>
        {createError && <p className="text-danger">Failed to add property: {createError}</p>}
      </SlideOver>

      {loading && <Loader label="Fetching properties..." />}
      {error && <p className="text-danger">Failed to load properties: {error}</p>}
      {!loading && !error && properties.length === 0 && <p>No properties found.</p>}

      {!loading && !error && (
        <>
          {activeTab === 'ALL' ? (
            <>
              {renderSection('Apartments', apartments)}
              {renderSection('Houses', houses)}
            </>
          ) : (
            renderSection(activeTab === 'APARTMENT' ? 'Apartments' : 'Houses', tabbedList)
          )}
        </>
      )}
    </div>
  );
}

export default PropertiesPage;

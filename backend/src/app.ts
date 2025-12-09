import express from 'express';
import cors from 'cors';
import propertyRoutes from './modules/properties/property.routes';
import unitRoutes from './modules/units/unit.routes';
import tenantRoutes from './modules/tenants/tenant.routes';
import leaseRoutes from './modules/leases/lease.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/leases', leaseRoutes);

// Central error handler to avoid leaking raw errors
app.use(errorHandler);

export default app;

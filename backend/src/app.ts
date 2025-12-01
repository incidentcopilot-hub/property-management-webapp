import express from 'express';
import cors from 'cors';
import propertyRoutes from './modules/properties/property.routes';
import unitRoutes from './modules/units/unit.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);

export default app;

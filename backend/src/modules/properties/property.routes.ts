import { Router, Request, Response } from 'express';
import { PropertyService } from './property.service';

const router = Router();
const propertyService = new PropertyService();

router.get('/', async (_req: Request, res: Response) => {
  const properties = await propertyService.getAll();
  res.json(properties);
});

router.get('/:id', async (req: Request, res: Response) => {
  const property = await propertyService.getById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
});

router.post('/', async (req: Request, res: Response) => {
  const { name, address, city, country } = req.body;
  const created = await propertyService.create({ name, address, city, country });
  res.status(201).json(created);
});

router.put('/:id', async (req: Request, res: Response) => {
  const updated = await propertyService.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Property not found' });
  res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await propertyService.delete(req.params.id);
  res.status(204).send();
});

export default router;

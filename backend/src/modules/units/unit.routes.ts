import { Router, Request, Response } from 'express';
import { UnitService } from './unit.service';

const router = Router();
const unitService = new UnitService();

router.get('/', async (_req: Request, res: Response) => {
  const units = await unitService.getAll();
  res.json(units);
});

router.get('/by-property/:propertyId', async (req: Request, res: Response) => {
  const units = await unitService.getByPropertyId(req.params.propertyId);
  res.json(units);
});

router.get('/:id', async (req: Request, res: Response) => {
  const unit = await unitService.getById(req.params.id);
  if (!unit) return res.status(404).json({ message: 'Unit not found' });
  res.json(unit);
});

router.post('/', async (req: Request, res: Response) => {
  const { propertyId, unitNumber, rentAmount, status } = req.body;
  const created = await unitService.create({
    propertyId,
    unitNumber,
    rentAmount,
    status,
  });
  res.status(201).json(created);
});

router.put('/:id', async (req: Request, res: Response) => {
  const updated = await unitService.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Unit not found' });
  res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await unitService.delete(req.params.id);
  res.status(204).send();
});

export default router;

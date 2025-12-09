import { Request, Response, Router } from 'express';
import { TenantService } from './tenant.service';

const router = Router();
const tenantService = new TenantService();

router.get('/', async (_req: Request, res: Response) => {
  const tenants = await tenantService.getAll();
  res.json(tenants);
});

router.get('/:id', async (req: Request, res: Response) => {
  const tenant = await tenantService.getById(req.params.id);
  if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
  res.json(tenant);
});

router.post('/', async (req: Request, res: Response) => {
  const { firstName, lastName, phone, email, unitId } = req.body;
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  const created = await tenantService.create({
    name,
    phone,
    email,
    unitId,
  });
  res.status(201).json(created);
});

router.put('/:id', async (req: Request, res: Response) => {
  const updated = await tenantService.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Tenant not found' });
  res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await tenantService.delete(req.params.id);
  res.status(204).send();
});

export default router;

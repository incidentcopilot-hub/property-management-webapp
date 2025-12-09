import { Request, Response, Router } from 'express';
import { LeaseService } from './lease.service';
import { prisma } from '../../prisma';

const router = Router();
const leaseService = new LeaseService();

router.get('/', async (_req: Request, res: Response) => {
  const leases = await leaseService.getAll();
  res.json(leases);
});

router.get('/by-tenant/:tenantId', async (req: Request, res: Response) => {
  const leases = await leaseService.getByTenantId(req.params.tenantId);
  res.json(leases);
});

router.get('/by-unit/:unitId', async (req: Request, res: Response) => {
  const leases = await leaseService.getByUnitId(req.params.unitId);
  res.json(leases);
});

router.get('/:id', async (req: Request, res: Response) => {
  const lease = await leaseService.getById(req.params.id);
  if (!lease) return res.status(404).json({ message: 'Lease not found' });
  res.json(lease);
});

router.post('/', async (req: Request, res: Response) => {
  const { unitId, tenantId, startDate, endDate, documentUrl } = req.body;
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

  const unit = await prisma.unit.findUnique({ where: { id: unitId } });
  if (!unit) return res.status(404).json({ message: 'Unit not found' });

  const [lease] = await prisma.$transaction([
    prisma.lease.create({
      data: {
        unitId,
        tenantId,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : undefined,
        documentUrl,
      },
    }),
    prisma.unit.update({
      where: { id: unitId },
      data: { status: 'OCCUPIED' },
    }),
    tenant.unitId !== unitId
      ? prisma.tenant.update({ where: { id: tenantId }, data: { unitId } })
      : null,
  ]);

  res.status(201).json(lease);
});

router.put('/:id', async (req: Request, res: Response) => {
  const updated = await leaseService.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Lease not found' });
  res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await leaseService.delete(req.params.id);
  res.status(204).send();
});

export default router;

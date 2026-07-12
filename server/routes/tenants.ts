import { Router, Response } from 'express';
import { Tenant } from '../models/Tenant.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/tenants
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.auth!.role !== 'admin') {
      res.status(403).json({ error: 'Only admins can list tenants.' });
      return;
    }
    const tenants = await Tenant.find({}, 'tenantId name ownerUsername staffUsername');
    res.json(tenants);
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ error: 'Failed to fetch tenants.' });
  }
});

// GET /api/tenants/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.params.id }, '-ownerPassword -staffPassword');
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found.' });
      return;
    }
    res.json(tenant);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Failed to fetch tenant.' });
  }
});

export default router;

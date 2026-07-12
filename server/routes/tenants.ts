import { Router, Response } from 'express';
import { getContainer } from '../config/cosmos.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/tenants — List all tenants (admin only)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.auth!.role !== 'admin') {
      res.status(403).json({ error: 'Only admins can list tenants.' });
      return;
    }

    const container = getContainer('tenants');
    const { resources } = await container.items
      .query('SELECT c.id, c.name, c.ownerUsername, c.staffUsername FROM c')
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ error: 'Failed to fetch tenants.' });
  }
});

// GET /api/tenants/:id — Get a specific tenant (sanitized, no passwords)
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const container = getContainer('tenants');

    const { resource } = await container.item(id, id).read();
    if (!resource) {
      res.status(404).json({ error: 'Tenant not found.' });
      return;
    }

    // Strip passwords from response
    const { ownerPassword, staffPassword, ...sanitized } = resource;
    res.json(sanitized);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Failed to fetch tenant.' });
  }
});

export default router;

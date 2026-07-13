import { Router, Response } from 'express';
import { Tenant } from '../models/Tenant.js';
import { TeamMember } from '../models/TeamMember.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/tenants
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.auth!.tenantId !== 'TENANT-DEFAULT' || req.auth!.role !== 'admin') {
      res.status(403).json({ error: 'Only system admins can list tenants.' });
      return;
    }
    const tenants = await Tenant.find({});
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

// POST /api/tenants/:id/activate
router.post('/:id/activate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.auth!.tenantId !== 'TENANT-DEFAULT' || req.auth!.role !== 'admin') {
      res.status(403).json({ error: 'Only the System Administrator can activate workspaces.' });
      return;
    }
    const tenant = await Tenant.findOneAndUpdate(
      { tenantId: req.params.id },
      { active: true },
      { new: true }
    );
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found.' });
      return;
    }
    res.json({ message: `Banquet workspace "${tenant.name}" has been activated.`, tenant });
  } catch (error) {
    console.error('Activate tenant error:', error);
    res.status(500).json({ error: 'Failed to activate tenant.' });
  }
});

// POST /api/tenants/:id/deactivate
router.post('/:id/deactivate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.auth!.tenantId !== 'TENANT-DEFAULT' || req.auth!.role !== 'admin') {
      res.status(403).json({ error: 'Only the System Administrator can deactivate workspaces.' });
      return;
    }
    
    if (req.params.id === 'TENANT-DEFAULT') {
      res.status(400).json({ error: 'Cannot deactivate the default system administration tenant.' });
      return;
    }

    const tenant = await Tenant.findOneAndUpdate(
      { tenantId: req.params.id },
      { active: false },
      { new: true }
    );
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found.' });
      return;
    }
    res.json({ message: `Banquet workspace "${tenant.name}" has been deactivated.`, tenant });
  } catch (error) {
    console.error('Deactivate tenant error:', error);
    res.status(500).json({ error: 'Failed to deactivate tenant.' });
  }
});

// PUT /api/tenants/:id/owner
router.put('/:id/owner', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.auth!.tenantId !== 'TENANT-DEFAULT' || req.auth!.role !== 'admin') {
      res.status(403).json({ error: 'Only the System Administrator can edit banquet owner details.' });
      return;
    }

    const { phone, password } = req.body;
    if (!phone || !password) {
      res.status(400).json({ error: 'Owner phone and password are required.' });
      return;
    }

    const tenant = await Tenant.findOneAndUpdate(
      { tenantId: req.params.id },
      { ownerUsername: phone.trim(), ownerPassword: password.trim() },
      { new: true }
    );

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found.' });
      return;
    }

    const ownerMember = await TeamMember.findOneAndUpdate(
      { tenantId: req.params.id, role: 'Admin' },
      { phone: phone.trim(), password: password.trim() },
      { new: true }
    );

    res.json({ message: 'Banquet owner credentials updated successfully.', tenant, ownerMember });
  } catch (error) {
    console.error('Update banquet owner error:', error);
    res.status(500).json({ error: 'Failed to update banquet owner credentials.' });
  }
});

export default router;

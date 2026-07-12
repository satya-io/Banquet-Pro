import { Router, Response } from 'express';
import { getContainer } from '../config/cosmos.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/settings — Get venue settings for the authenticated tenant
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('settings');

    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.tenantId = @tenantId',
        parameters: [{ name: '@tenantId', value: tenantId }],
      })
      .fetchAll();

    if (resources.length === 0) {
      res.json(null);
      return;
    }

    res.json(resources[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// PUT /api/settings — Update venue settings
router.put('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('settings');

    // Check if settings document exists
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.tenantId = @tenantId',
        parameters: [{ name: '@tenantId', value: tenantId }],
      })
      .fetchAll();

    let result;
    if (resources.length > 0) {
      // Update existing
      const updatedSettings = {
        ...resources[0],
        ...req.body,
        tenantId,
        updatedAt: new Date().toISOString(),
      };
      const { resource } = await container.item(resources[0].id, tenantId).replace(updatedSettings);
      result = resource;
    } else {
      // Create new settings doc
      const newSettings = {
        ...req.body,
        id: `settings-${tenantId}`,
        tenantId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const { resource } = await container.items.create(newSettings);
      result = resource;
    }

    res.json(result);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

// GET /api/team — List team members for the authenticated tenant
router.get('/team', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('teamMembers');

    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.tenantId = @tenantId',
        parameters: [{ name: '@tenantId', value: tenantId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

export default router;

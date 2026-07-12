import { Router, Response } from 'express';
import { getContainer } from '../config/cosmos.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/venues — List all venue spaces for the authenticated tenant
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('venueSpaces');

    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.tenantId = @tenantId',
        parameters: [{ name: '@tenantId', value: tenantId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ error: 'Failed to fetch venue spaces.' });
  }
});

// POST /api/venues — Create a new venue space
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('venueSpaces');

    const venue = {
      ...req.body,
      tenantId,
      createdAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(venue);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ error: 'Failed to create venue space.' });
  }
});

// DELETE /api/venues/:id — Delete a venue space
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const { id } = req.params;
    const container = getContainer('venueSpaces');

    await container.item(id, tenantId).delete();
    res.json({ message: 'Venue space deleted successfully.' });
  } catch (error) {
    console.error('Delete venue error:', error);
    res.status(500).json({ error: 'Failed to delete venue space.' });
  }
});

export default router;

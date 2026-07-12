import { Router, Response } from 'express';
import { getContainer } from '../config/cosmos.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/menu — List all catering items for the authenticated tenant
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('cateringItems');

    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.tenantId = @tenantId ORDER BY c.category ASC, c.name ASC',
        parameters: [{ name: '@tenantId', value: tenantId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// POST /api/menu — Create a new catering item
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('cateringItems');

    const item = {
      ...req.body,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(item);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// PUT /api/menu/:id — Update a catering item
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const { id } = req.params;
    const container = getContainer('cateringItems');

    const updatedItem = {
      ...req.body,
      id,
      tenantId,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(id, tenantId).replace(updatedItem);
    res.json(resource);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// DELETE /api/menu/:id — Delete a catering item
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const { id } = req.params;
    const container = getContainer('cateringItems');

    await container.item(id, tenantId).delete();
    res.json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

export default router;

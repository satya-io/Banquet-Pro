import { Router, Response } from 'express';
import { CateringItem } from '../models/CateringItem.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/menu
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await CateringItem.find({ tenantId: req.auth!.tenantId }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// POST /api/menu
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = new CateringItem({ ...req.body, tenantId: req.auth!.tenantId });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// PUT /api/menu/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await CateringItem.findOneAndUpdate(
      { id: req.params.id, tenantId: req.auth!.tenantId },
      { ...req.body, tenantId: req.auth!.tenantId },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// DELETE /api/menu/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await CateringItem.findOneAndDelete({ id: req.params.id, tenantId: req.auth!.tenantId });
    res.json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

export default router;

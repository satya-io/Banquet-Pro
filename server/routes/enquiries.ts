import { Router, Response } from 'express';
import { getContainer } from '../config/cosmos.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/enquiries — List all enquiries for the authenticated tenant
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('enquiries');

    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.tenantId = @tenantId ORDER BY c._ts DESC',
        parameters: [{ name: '@tenantId', value: tenantId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
});

// POST /api/enquiries — Create a new enquiry
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('enquiries');

    const enquiry = {
      ...req.body,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(enquiry);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ error: 'Failed to create enquiry.' });
  }
});

// PUT /api/enquiries/:id — Update an enquiry
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const { id } = req.params;
    const container = getContainer('enquiries');

    const updatedEnquiry = {
      ...req.body,
      id,
      tenantId,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(id, tenantId).replace(updatedEnquiry);
    res.json(resource);
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({ error: 'Failed to update enquiry.' });
  }
});

// DELETE /api/enquiries/:id — Delete an enquiry
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const { id } = req.params;
    const container = getContainer('enquiries');

    await container.item(id, tenantId).delete();
    res.json({ message: 'Enquiry deleted successfully.' });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
});

export default router;

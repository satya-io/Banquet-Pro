import { Router, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/enquiries
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enquiries = await Enquiry.find({ tenantId: req.auth!.tenantId }).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
});

// POST /api/enquiries
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enquiry = new Enquiry({ ...req.body, tenantId: req.auth!.tenantId });
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ error: 'Failed to create enquiry.' });
  }
});

// PUT /api/enquiries/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await Enquiry.findOneAndUpdate(
      { id: req.params.id, tenantId: req.auth!.tenantId },
      { ...req.body, tenantId: req.auth!.tenantId },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({ error: 'Failed to update enquiry.' });
  }
});

// DELETE /api/enquiries/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Enquiry.findOneAndDelete({ id: req.params.id, tenantId: req.auth!.tenantId });
    res.json({ message: 'Enquiry deleted successfully.' });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
});

export default router;

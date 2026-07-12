import { Router, Response } from 'express';
import { VenueSpace } from '../models/VenueSpace.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/venues
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const venues = await VenueSpace.find({ tenantId: req.auth!.tenantId });
    res.json(venues);
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ error: 'Failed to fetch venue spaces.' });
  }
});

// POST /api/venues
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const venue = new VenueSpace({ ...req.body, tenantId: req.auth!.tenantId });
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ error: 'Failed to create venue space.' });
  }
});

// PUT /api/venues/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const venue = await VenueSpace.findOneAndUpdate(
      { id: req.params.id, tenantId: req.auth!.tenantId },
      { $set: req.body },
      { new: true }
    );
    if (!venue) {
      res.status(404).json({ error: 'Venue space not found.' });
      return;
    }
    res.json(venue);
  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({ error: 'Failed to update venue space.' });
  }
});

// DELETE /api/venues/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await VenueSpace.findOneAndDelete({ id: req.params.id, tenantId: req.auth!.tenantId });
    res.json({ message: 'Venue space deleted successfully.' });
  } catch (error) {
    console.error('Delete venue error:', error);
    res.status(500).json({ error: 'Failed to delete venue space.' });
  }
});

export default router;

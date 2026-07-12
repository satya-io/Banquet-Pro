import { Router, Response } from 'express';
import { Booking } from '../models/Booking.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/bookings
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ tenantId: req.auth!.tenantId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// POST /api/bookings
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = new Booking({ ...req.body, tenantId: req.auth!.tenantId });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// PUT /api/bookings/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await Booking.findOneAndUpdate(
      { id: req.params.id, tenantId: req.auth!.tenantId },
      { ...req.body, tenantId: req.auth!.tenantId },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking.' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Booking.findOneAndDelete({ id: req.params.id, tenantId: req.auth!.tenantId });
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
});

export default router;

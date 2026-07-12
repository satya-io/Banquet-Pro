import { Router, Response } from 'express';
import { getContainer } from '../config/cosmos.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/bookings — List all bookings for the authenticated tenant
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('bookings');

    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.tenantId = @tenantId ORDER BY c._ts DESC',
        parameters: [{ name: '@tenantId', value: tenantId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// POST /api/bookings — Create a new booking
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const container = getContainer('bookings');

    const booking = {
      ...req.body,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(booking);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// PUT /api/bookings/:id — Update a booking
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const { id } = req.params;
    const container = getContainer('bookings');

    const updatedBooking = {
      ...req.body,
      id,
      tenantId,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(id, tenantId).replace(updatedBooking);
    res.json(resource);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking.' });
  }
});

// DELETE /api/bookings/:id — Delete a booking
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.auth!.tenantId;
    const { id } = req.params;
    const container = getContainer('bookings');

    await container.item(id, tenantId).delete();
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
});

export default router;

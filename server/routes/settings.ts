import { Router, Response } from 'express';
import { Settings } from '../models/Settings.js';
import { TeamMember } from '../models/TeamMember.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/settings
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await Settings.findOne({ tenantId: req.auth!.tenantId });
    res.json(settings || null);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// PUT /api/settings
router.put('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await Settings.findOneAndUpdate(
      { tenantId: req.auth!.tenantId },
      { ...req.body, tenantId: req.auth!.tenantId },
      { new: true, upsert: true }
    );
    res.json(result);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

// GET /api/settings/team
router.get('/team', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const members = await TeamMember.find({ tenantId: req.auth!.tenantId });
    res.json(members);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

export default router;

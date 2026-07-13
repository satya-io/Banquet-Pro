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

// POST /api/settings/team
router.post('/team', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = new TeamMember({ ...req.body, tenantId: req.auth!.tenantId });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Failed to create team member.' });
  }
});

// PUT /api/settings/team/:id
router.put('/team/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedMember = await TeamMember.findOneAndUpdate(
      { id, tenantId: req.auth!.tenantId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedMember) {
      res.status(404).json({ error: 'Team member not found.' });
      return;
    }
    res.json(updatedMember);
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Failed to update team member.' });
  }
});

// DELETE /api/settings/team/:id
router.delete('/team/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await TeamMember.findOneAndDelete({ id, tenantId: req.auth!.tenantId });
    if (!deleted) {
      res.status(404).json({ error: 'Team member not found.' });
      return;
    }
    res.json({ message: 'Team member deleted successfully.' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete team member.' });
  }
});

export default router;

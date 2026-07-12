import { Router, Response } from 'express';
import { Tenant } from '../models/Tenant.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, password, tenantId } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    let tenant: any = null;

    if (tenantId) {
      tenant = await Tenant.findOne({ tenantId });
    } else {
      tenant = await Tenant.findOne({
        $or: [
          { ownerUsername: username, ownerPassword: password },
          { staffUsername: username, staffPassword: password },
        ],
      });
    }

    if (!tenant) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    let role: 'admin' | 'sales_agent';
    if (tenant.ownerUsername === username && tenant.ownerPassword === password) {
      role = 'admin';
    } else if (tenant.staffUsername === username && tenant.staffPassword === password) {
      role = 'sales_agent';
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    const token = generateToken({ tenantId: tenant.tenantId, role, tenantName: tenant.name });
    res.json({ token, tenantId: tenant.tenantId, tenantName: tenant.name, role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

router.post('/logout', (req: AuthRequest, res: Response): void => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;

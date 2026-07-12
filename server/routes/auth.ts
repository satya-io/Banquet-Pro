import { Router, Response } from 'express';
import { getContainer } from '../config/cosmos.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, password, tenantId } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const container = getContainer('tenants');

    // If tenantId provided, look up specific tenant; otherwise search all
    let tenant: any = null;

    if (tenantId) {
      try {
        const { resource } = await container.item(tenantId, tenantId).read();
        tenant = resource;
      } catch {
        res.status(401).json({ error: 'Invalid tenant or credentials.' });
        return;
      }
    } else {
      // Search across all tenants for matching credentials
      const { resources } = await container.items
        .query('SELECT * FROM c')
        .fetchAll();

      tenant = resources.find((t: any) =>
        (t.ownerUsername === username && t.ownerPassword === password) ||
        (t.staffUsername === username && t.staffPassword === password)
      );
    }

    if (!tenant) {
      res.status(401).json({ error: 'Invalid credentials. No matching tenant found.' });
      return;
    }

    // Determine role
    let role: 'admin' | 'sales_agent';
    if (tenant.ownerUsername === username && tenant.ownerPassword === password) {
      role = 'admin';
    } else if (tenant.staffUsername === username && tenant.staffPassword === password) {
      role = 'sales_agent';
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    const token = generateToken({
      tenantId: tenant.id,
      role,
      tenantName: tenant.name,
    });

    res.json({
      token,
      tenantId: tenant.id,
      tenantName: tenant.name,
      role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

router.post('/logout', (req: AuthRequest, res: Response): void => {
  // JWT is stateless — client simply discards the token
  res.json({ message: 'Logged out successfully.' });
});

export default router;

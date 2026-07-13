import { Router, Response } from 'express';
import { Tenant } from '../models/Tenant.js';
import { Settings } from '../models/Settings.js';
import { VenueSpace } from '../models/VenueSpace.js';
import { CateringItem } from '../models/CateringItem.js';
import { TeamMember } from '../models/TeamMember.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';
import { initialCateringItems } from '../../src/data.js';


const router = Router();

// GET /api/auth/tenants (Public)
router.get('/tenants', async (req, res): Promise<void> => {
  try {
    const tenants = await Tenant.find({ tenantId: { $ne: 'TENANT-DEFAULT' } }, 'tenantId name ownerUsername staffUsername active');
    res.json(tenants);
  } catch (error) {
    console.error('Failed to list tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants.' });
  }
});

// POST /api/auth/register (Public)
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    const isDuplicate = await Tenant.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (isDuplicate) {
      res.status(400).json({ error: 'A Banquet Venue with this name already exists.' });
      return;
    }

    const isPhoneDuplicate = await TeamMember.findOne({ phone: phone.trim() });
    if (isPhoneDuplicate) {
      res.status(400).json({ error: 'This phone number is already registered.' });
      return;
    }

    const tenantId = `TENANT-${Date.now()}`;
    const newTenant = await Tenant.create({
      tenantId,
      name: name.trim(),
      ownerUsername: phone.trim(),
      ownerPassword: password.trim(),
      staffUsername: '',
      staffPassword: '',
      active: false, // Must be activated by app admin
    });

    // Seed Venue Settings
    await Settings.create({
      tenantId,
      name: name.trim(),
      email: `ops@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      address: 'Default Venue Address',
      logo: '',
      weekendSurge: false,
      peakSeason: false,
      baseDeposit: 5000,
    });

    // Seed Venue Spaces
    await VenueSpace.create([
      { tenantId, id: `SPACE-${Date.now()}-1`, name: 'Crystal Lounge', capacityMin: 100, capacityMax: 300, image: '', status: 'Active', features: ['Premium AC', 'Lighting control'] },
      { tenantId, id: `SPACE-${Date.now()}-2`, name: 'Emerald Lawns', capacityMin: 200, capacityMax: 1000, image: '', status: 'Active', features: ['Manicured grass', 'Open sky'] },
      { tenantId, id: `SPACE-${Date.now()}-3`, name: 'Grand Ballroom', capacityMin: 500, capacityMax: 1500, image: '', status: 'Active', features: ['Double height ceiling', 'Stage setups'] },
    ]);

    // Seed Catering Items
    await CateringItem.create(initialCateringItems.map(m => ({ ...m, tenantId })));

    // Seed Team Members
    await TeamMember.create([
      { tenantId, id: `TEAM-${Date.now()}-1`, name: `Owner`, email: `owner@banquetpro.com`, role: 'Admin', status: 'Online', lastActive: 'Just now', avatar: '', phone: phone.trim(), password: password.trim(), active: true }
    ]);

    res.json({ message: 'Tenant registered successfully. Pending approval.', tenant: { tenantId, name: newTenant.name } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register banquet venue.' });
  }
});

// POST /api/auth/login (Public phone-based unified login)
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ error: 'Phone number and password are required.' });
      return;
    }

    const member = await TeamMember.findOne({ phone: phone.trim() });
    if (!member) {
      res.status(401).json({ error: 'Invalid phone number or password.' });
      return;
    }

    if (member.password !== password) {
      res.status(401).json({ error: 'Invalid phone number or password.' });
      return;
    }

    if (!member.active) {
      res.status(403).json({ error: 'Your user account is deactivated. Please contact your venue administrator.' });
      return;
    }

    const tenant = await Tenant.findOne({ tenantId: member.tenantId });
    if (!tenant) {
      res.status(404).json({ error: 'Banquet Venue workspace not found.' });
      return;
    }

    if (!tenant.active) {
      res.status(403).json({ error: 'This Banquet Workspace is pending activation by the system administrator.' });
      return;
    }

    const role: 'admin' | 'sales_agent' = member.role === 'Admin' ? 'admin' : 'sales_agent';

    const token = generateToken({ tenantId: tenant.tenantId, role, tenantName: tenant.name });
    res.json({ token, tenantId: tenant.tenantId, tenantName: tenant.name, role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// POST /api/auth/login/appadmin (Public app admin login path)
router.post('/login/appadmin', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const systemTenant = await Tenant.findOne({ tenantId: 'TENANT-DEFAULT' });
    if (!systemTenant) {
      res.status(500).json({ error: 'System tenant not initialized.' });
      return;
    }

    if (username === systemTenant.ownerUsername && password === systemTenant.ownerPassword) {
      const token = generateToken({ tenantId: 'TENANT-DEFAULT', role: 'admin', tenantName: systemTenant.name });
      res.json({ token, tenantId: 'TENANT-DEFAULT', tenantName: systemTenant.name, role: 'admin' });
      return;
    }

    res.status(401).json({ error: 'Invalid app admin credentials.' });
  } catch (error) {
    console.error('App admin login error:', error);
    res.status(500).json({ error: 'Internal server error during app admin authentication.' });
  }
});

router.post('/logout', (req: AuthRequest, res: Response): void => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;

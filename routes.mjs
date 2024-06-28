import db from './db.mjs';

export const getSites = async (req, res) => {
    try {
        await db.read();
        const sites = db.data.sites || [];
        res.render('index', { sites });
    } catch (err) {
        console.error('Error fetching sites:', err);
        res.status(500).send('Internal Server Error');
    }
};

export const getSiteManagement = async (req, res) => {
    try {
        await db.read();
        const sites = db.data.sites || [];
        res.render('manage-sites', { sites });
    } catch (err) {
        console.error('Error fetching sites:', err);
        res.status(500).send('Internal Server Error');
    }
};

export const getSiteDetails = async (req, res) => {
    const { siteId } = req.params;
    try {
        await db.read();
        const site = db.data.sites.find(site => site.id === siteId);
        if (site) {
            res.render('site-details', { site });
        } else {
            res.status(404).send('Site not found');
        }
    } catch (err) {
        console.error('Error fetching site details:', err);
        res.status(500).send('Internal Server Error');
    }
};

export const addSite = async (req, res) => {
    const { name } = req.body;
    const newSite = {
        id: Date.now().toString(),
        name,
        maintenances: [
            { id: 'A', type: 'A', startDate: new Date('2024-01-01'), dueDate: new Date('2024-07-01'), status: 'todo', completed: false, lastCompleted: null, nextDueDate: new Date('2024-07-01') },
            { id: 'B', type: 'B', startDate: new Date('2024-01-01'), dueDate: new Date('2024-08-01'), status: 'todo', completed: false, lastCompleted: null, nextDueDate: new Date('2024-08-01') },
            { id: 'C', type: 'C', startDate: new Date('2024-01-01'), dueDate: new Date('2024-09-01'), status: 'todo', completed: false, lastCompleted: null, nextDueDate: new Date('2024-09-01') },
            { id: 'D', type: 'D', startDate: new Date('2024-01-01'), dueDate: new Date('2025-01-01'), status: 'todo', completed: false, lastCompleted: null, nextDueDate: new Date('2025-01-01') }
        ],
        monthly: false,
        quarterly: false,
        yearly: false
    };
    try {
        await db.read();
        db.data.sites.push(newSite);
        await db.write();
        res.redirect('/');
    } catch (err) {
        console.error('Error adding site:', err);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteSite = async (req, res) => {
    const { siteId } = req.body;
    try {
        await db.read();
        db.data.sites = db.data.sites.filter(site => site.id !== siteId);
        await db.write();
        res.redirect('/manage-sites');
    } catch (err) {
        console.error('Error deleting site:', err);
        res.status(500).send('Internal Server Error');
    }
};

export const updateSite = async (req, res) => {
    const { siteId, aDueDate, bDueDate, cDueDate, dDueDate, aLastCompleted, bLastCompleted, cLastCompleted, dLastCompleted, aNextDueDate, bNextDueDate, cNextDueDate, dNextDueDate } = req.body;
    try {
        await db.read();
        const site = db.data.sites.find(site => site.id === siteId);
        if (site) {
            const updateMaintenance = (maintenance, dueDate, lastCompleted, nextDueDate) => {
                maintenance.dueDate = dueDate ? new Date(dueDate) : maintenance.dueDate;
                maintenance.lastCompleted = lastCompleted ? new Date(lastCompleted) : maintenance.lastCompleted;
                maintenance.nextDueDate = nextDueDate ? new Date(nextDueDate) : maintenance.nextDueDate;
            };

            updateMaintenance(site.maintenances.find(m => m.id === 'A'), aDueDate, aLastCompleted, aNextDueDate);
            updateMaintenance(site.maintenances.find(m => m.id === 'B'), bDueDate, bLastCompleted, bNextDueDate);
            updateMaintenance(site.maintenances.find(m => m.id === 'C'), cDueDate, cLastCompleted, cNextDueDate);
            updateMaintenance(site.maintenances.find(m => m.id === 'D'), dDueDate, dLastCompleted, dNextDueDate);

            await db.write();
        }
        res.redirect('/manage-sites');
    } catch (err) {
        console.error('Error updating site:', err);
        res.status(500).send('Internal Server Error');
    }
};

export const updateMaintenanceStatus = async (req, res) => {
    const { siteId, maintenanceId, status } = req.body;
    try {
        await db.read();
        const site = db.data.sites.find(site => site.id === siteId);
        if (site) {
            const maintenance = site.maintenances.find(m => m.id === maintenanceId);
            if (maintenance) {
                maintenance.status = status;
                if (status === 'complete') {
                    maintenance.lastCompleted = new Date().toISOString();
                }
                await db.write();
                res.json({ success: true });
                return;
            }
        }
        res.json({ success: false });
    } catch (err) {
        console.error('Error updating maintenance status:', err);
        res.status(500).json({ success: false });
    }
};

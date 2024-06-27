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

export const addSite = async (req, res) => {
    const { name } = req.body;
    const newSite = {
        id: Date.now().toString(),
        name,
        maintenances: [
            { id: 'A', type: 'A', startDate: "2024-01-01T00:00:00.000Z", dueDate: "2024-07-01T00:00:00.000Z", status: 'todo', completed: false, lastCompleted: null },
            { id: 'B', type: 'B', startDate: "2024-01-01T00:00:00.000Z", dueDate: "2024-08-01T00:00:00.000Z", status: 'todo', completed: false, lastCompleted: null },
            { id: 'C', type: 'C', startDate: "2024-01-01T00:00:00.000Z", dueDate: "2024-09-01T00:00:00.000Z", status: 'todo', completed: false, lastCompleted: null },
            { id: 'D', type: 'D', startDate: "2024-01-01T00:00:00.000Z", dueDate: "2025-01-01T00:00:00.000Z", status: 'todo', completed: false, lastCompleted: null }
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
    const { siteId, aDueDate, bDueDate, cDueDate, dDueDate, aLastCompleted, bLastCompleted, cLastCompleted, dLastCompleted } = req.body;
    try {
        await db.read();
        const site = db.data.sites.find(site => site.id === siteId);
        if (site) {
            const updateMaintenance = (maintenance, dueDate, lastCompleted) => {
                maintenance.dueDate = new Date(dueDate).toISOString();
                maintenance.lastCompleted = lastCompleted ? new Date(lastCompleted).toISOString() : maintenance.lastCompleted;
            };

            updateMaintenance(site.maintenances.find(m => m.id === 'A'), aDueDate, aLastCompleted);
            updateMaintenance(site.maintenances.find(m => m.id === 'B'), bDueDate, bLastCompleted);
            updateMaintenance(site.maintenances.find(m => m.id === 'C'), cDueDate, cLastCompleted);
            updateMaintenance(site.maintenances.find(m => m.id === 'D'), dDueDate, dLastCompleted);

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
                await db.write();
            }
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error updating maintenance status:', err);
        res.status(500).send('Internal Server Error');
    }
};

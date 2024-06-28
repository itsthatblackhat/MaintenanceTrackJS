import { Low, JSONFile } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initializeDB() {
    if (!fs.existsSync(file)) {
        db.data = { sites: [] };
        await db.write();
    } else {
        await db.read();
        db.data ||= { sites: [] };

        db.data.sites.forEach(site => {
            site.monthly ||= false;
            site.quarterly ||= false;
            site.yearly ||= false;
            site.maintenances.forEach(maintenance => {
                maintenance.startDate ||= "2024-01-01T00:00:00.000Z";
                maintenance.dueDate ||= "2024-12-01T00:00:00.000Z";
                maintenance.completed ||= false;
                maintenance.lastCompleted ||= null;
                maintenance.nextDueDate ||= null; // Ensure nextDueDate is initialized
            });
        });

        await db.write();
    }
}

await initializeDB();

export default db;

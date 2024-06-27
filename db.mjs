import { Low, JSONFile } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Check if the file exists before reading
if (fs.existsSync(file)) {
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
        });
    });

    await db.write();
} else {
    db.data = { sites: [] };
}

export default db;

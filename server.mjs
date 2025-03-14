import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSites, addSite, deleteSite, updateSite, updateMaintenanceStatus, getSiteManagement, getSiteDetails } from './routes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.get('/', getSites);
app.get('/manage-sites', getSiteManagement);
app.get('/manage-sites/:siteId', getSiteDetails);
app.post('/add-site', addSite);
app.post('/delete-site', deleteSite);
app.post('/update-site', updateSite);
app.post('/update-maintenance-status', updateMaintenanceStatus); // Ensure this line matches the endpoint in script.js

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

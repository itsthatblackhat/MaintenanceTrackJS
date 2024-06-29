document.addEventListener('DOMContentLoaded', () => {
    const jsonData = document.getElementById('siteData').textContent;
    let sites;
    try {
        sites = JSON.parse(jsonData);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return;
    }

    // Prepare data for the timeline chart
    const rangeData = [];
    const momentData = [];
    const now = new Date();
    const notifications = [];

    sites.forEach(site => {
        site.maintenances.forEach(maintenance => {
            const dueDate = new Date(maintenance.dueDate);
            const lastCompleted = maintenance.lastCompleted ? new Date(maintenance.lastCompleted) : null;

            // Create range series for each maintenance task
            let color;
            if (maintenance.status === 'complete') {
                color = 'green';
                momentData.push({
                    x: Date.UTC(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()),
                    y: `${site.name} - Maintenance ${maintenance.id} Completed`,
                    marker: { fill: 'green', size: 10, type: 'circle', stroke: { color: 'green', thickness: 2 } }
                });
            } else if (dueDate < now) {
                color = 'red';
                notifications.push({ site, maintenance, message: `${site.name} - Maintenance ${maintenance.id} is overdue!` });
                momentData.push({
                    x: Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
                    y: `${site.name} - Maintenance ${maintenance.id} Overdue`,
                    marker: { fill: 'red', size: 10, type: 'circle', stroke: { color: 'red', thickness: 2 } }
                });
            } else if (dueDate > now && (dueDate - now) <= 30 * 24 * 60 * 60 * 1000) { // Upcoming maintenance within 30 days
                color = 'yellow';
                momentData.push({
                    x: Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
                    y: `${site.name} - Maintenance ${maintenance.id} Upcoming`,
                    marker: { fill: 'yellow', size: 10, type: 'circle', stroke: { color: 'yellow', thickness: 2 } }
                });
            } else {
                color = 'blue';
            }

            rangeData.push({
                name: `${site.name} - Maintenance ${maintenance.id}`,
                start: Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
                end: Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
                normal: { fill: color, stroke: color, 'stroke-width': 2 },
                hovered: { fill: color, stroke: color, 'stroke-width': 2 },
                selected: { fill: color, stroke: color, 'stroke-width': 2 }
            });

            // Add a moment series for the completion date
            if (lastCompleted) {
                momentData.push({
                    x: Date.UTC(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()),
                    y: `${site.name} - Maintenance ${maintenance.id} Completed`
                });
            }
        });
    });

    // Create the chart
    const chart = anychart.timeline();
    const rangeSeries = chart.range(rangeData);
    const momentSeries = chart.moment(momentData);

    // Configure the chart
    chart.container('container');
    chart.draw();

    // Zoom to the current year
    const startOfYear = Date.UTC(now.getFullYear(), 0, 1);
    const endOfYear = Date.UTC(now.getFullYear(), 11, 31);
    chart.zoomTo(startOfYear, endOfYear);

    // Enable zooming in and out
    chart.interactivity().zoomOnMouseWheel(true);

    // Display overdue notifications
    const notificationContainer = document.getElementById('notifications');
    if (notifications.length > 0) {
        notifications.forEach(notification => {
            const div = document.createElement('div');
            div.className = 'notification';
            div.innerHTML = `${notification.message} &#10060;`; // Red X emoji

            const button = document.createElement('button');
            button.textContent = 'Job Completed';
            button.addEventListener('click', () => {
                completeJob(notification.site, notification.maintenance);
            });
            div.appendChild(button);

            notificationContainer.appendChild(div);
        });
    }

    function completeJob(site, maintenance) {
        // Update the maintenance status to complete
        maintenance.status = 'complete';
        maintenance.lastCompleted = new Date().toISOString();

        // Update the site data in the database
        fetch('/update-maintenance-status', { // Ensure this line matches the endpoint in server.mjs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ siteId: site.id, maintenanceId: maintenance.id, status: 'complete' })
        }).then(response => response.json()).then(data => {
            if (data.success) {
                // Reload the page to reflect the changes
                location.reload();
            } else {
                console.error('Failed to update the site');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }
});

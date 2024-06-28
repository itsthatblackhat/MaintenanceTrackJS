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
                rangeData.push({
                    name: `${site.name} - Maintenance ${maintenance.id} Completed`,
                    start: Date.UTC(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()),
                    end: Date.UTC(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()),
                    normal: { fill: color, stroke: color, 'stroke-width': 2 },
                    hovered: { fill: color, stroke: color, 'stroke-width': 2 },
                    selected: { fill: color, stroke: color, 'stroke-width': 2 }
                });
            } else if (dueDate < now) {
                color = 'red';
                rangeData.push({
                    name: `${site.name} - Maintenance ${maintenance.id} Overdue`,
                    start: Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
                    end: Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
                    normal: { fill: color, stroke: color, 'stroke-width': 2 },
                    hovered: { fill: color, stroke: color, 'stroke-width': 2 },
                    selected: { fill: color, stroke: color, 'stroke-width': 2 }
                });
                notifications.push(`${site.name} - Maintenance ${maintenance.id} is overdue!`);
            } else if (dueDate > now && (dueDate - now) <= 30 * 24 * 60 * 60 * 1000) { // Upcoming maintenance within 30 days
                color = 'yellow';
            } else {
                color = 'blue';
            }

            // Create range data for each maintenance task
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
            div.textContent = notification;
            notificationContainer.appendChild(div);
        });
    }
});

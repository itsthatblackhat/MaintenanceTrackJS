document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('maintenanceChart').getContext('2d');
    const sites = JSON.parse(document.getElementById('siteData').textContent);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Create a dataset for each site
    const datasets = sites.map((site, siteIndex) => {
        const siteColor = `hsl(${siteIndex * 40}, 70%, 50%)`;

        return site.maintenances.map(maintenance => {
            const month = new Date(maintenance.dueDate).getMonth();
            return {
                label: `${maintenance.type}`,
                data: [{ x: months[month], y: site.name }],
                backgroundColor: maintenance.status === 'complete' ? 'green' : siteColor,
                borderColor: siteColor,
                borderWidth: 1
            };
        });
    }).flat();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: { beginAtZero: true },
                y: {
                    type: 'category',
                    labels: sites.map(site => site.name),
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const siteIndex = context.datasetIndex;
                            const maintenance = datasets[siteIndex];
                            return `${context.label} - ${maintenance.label}: ${maintenance.status}`;
                        }
                    }
                }
            }
        }
    });

    // Display overdue maintenance notifications
    const now = new Date();
    const notifications = sites.flatMap(site =>
        site.maintenances.filter(m => new Date(m.dueDate) < now && m.status !== 'complete')
            .map(m => `${site.name} - Maintenance ${m.type} is overdue!`)
    );

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

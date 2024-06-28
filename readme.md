
# Maintenance Tracker Application Documentation

## Overview

The Maintenance Tracker application is designed to help theater technicians manage and track maintenance tasks across multiple sites. The application provides a visual timeline of maintenance activities, highlights overdue tasks, and allows users to add, update, and delete maintenance records. The application leverages modern web technologies to ensure scalability, reliability, and ease of use.

## Table of Contents

1. [Introduction](#introduction)
2. [Application Architecture](#application-architecture)
3. [Code Structure](#code-structure)
4. [Libraries and Tools](#libraries-and-tools)
5. [Database Management](#database-management)
6. [Hosting and Deployment](#hosting-and-deployment)
7. [Usage and Functionality](#usage-and-functionality)
8. [Conclusion](#conclusion)

## Introduction

The Maintenance Tracker application provides a centralized platform for theater technicians to monitor maintenance tasks, ensuring timely completion and preventing operational disruptions. The application is designed with user-friendly interfaces and robust backend support to handle multiple sites and maintenance schedules.

## Application Architecture

The application follows a typical Model-View-Controller (MVC) architecture, which separates the application logic into three interconnected components:
- **Model**: Manages the data and business logic (LowDB for data persistence).
- **View**: Displays the data (EJS templates for rendering views).
- **Controller**: Handles the user input and interacts with the model to render the final output (Express.js routes).

## Code Structure

- `server.mjs`: The main server file that sets up the Express.js application and routes.
- `routes.mjs`: Contains route handlers for various endpoints.
- `db.mjs`: Manages the LowDB database, including reading and writing data.
- `views/`: Contains EJS templates for rendering the frontend views.
  - `index.ejs`: The main view for displaying the maintenance timeline.
  - `manage-sites.ejs`: The view for managing sites and their maintenance tasks.
- `public/`: Contains static assets such as JavaScript files.
  - `script.js`: Contains client-side JavaScript for handling chart rendering and interactivity.

## Libraries and Tools

- **Express.js**: A web application framework for Node.js, used to build the backend server.
- **LowDB**: A small local JSON database for storing application data.
- **AnyChart**: A JavaScript charting library used for creating the maintenance timeline.
- **EJS**: A templating engine for generating HTML markup with embedded JavaScript.

## Database Management

The application uses LowDB, a lightweight JSON database, to store and manage maintenance data. The `db.mjs` file handles the database initialization, reading, and writing operations. The database schema includes sites and their respective maintenance tasks, each with properties such as `id`, `type`, `dueDate`, `status`, and `lastCompleted`.

## Hosting and Deployment

The application can be hosted on any server that supports Node.js. Deployment steps include:
1. Installing dependencies using `npm install`.
2. Running the application with `node server.mjs`.
3. Ensuring the server has access to the required ports and has the necessary environment configurations.

## Usage and Functionality

### Adding a Site
Users can add a new site by entering the site name in the provided form on the main page.

### Managing Sites
Users can manage existing sites by navigating to the "Manage Sites" page. This includes updating due dates, marking maintenance tasks as completed, and deleting sites.

### Visualizing Maintenance Tasks
The main page displays a timeline chart with all maintenance tasks for the current year. Overdue tasks are highlighted in red, and completed tasks are shown in green.

### Notifications
The application displays notifications for overdue maintenance tasks to ensure timely completion.

## Conclusion

I hope at the end of the day this shit makes your life easier

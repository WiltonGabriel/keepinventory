# **App Name**: AssetWise Inventory

## Core Features:

- Hierarchical Data Management: Manage Blocks, Sectors, Rooms, and Assets in a hierarchical structure stored locally using localStorage.
- Dynamic CRUD Interface: Provide Create, Read, Update, and Delete operations for each entity (Blocks, Sectors, Rooms, Assets) with dynamically rendered tables, lists, and forms.
- Dependent Dropdowns in Asset Creation: Implement dependent dropdowns for asset creation where Sector options depend on selected Block and Room options depend on selected Sector.
- Simulated Login: Implement a basic login screen that, upon submission, simply hides the login form and displays the main application interface.
- SPA-like Navigation: Implement a sidebar-based navigation system that uses JavaScript to toggle the visibility of different sections, simulating a single-page application experience.
- Asset ID Generation: Generate alphanumeric asset IDs programmatically to reflect their location within the Block-Sector-Room hierarchy.
- Dark Mode Toggle: Implement a toggle in the header to switch between light and dark modes, persisting the user's preference in localStorage.

## Style Guidelines:

- Primary color: Navy blue (#00447C) for a professional and calming feel, referencing the existing specification.
- Background color: Light gray (#F4F7FC) to provide a clean, neutral backdrop for content, referencing the existing specification.
- Accent color: Sky blue (#38B6FF) for interactive elements and highlights, complementing the primary color.
- Body and headline font: 'Inter' sans-serif for a clean, modern user interface.
- Use simple, consistent icons from a library like Font Awesome for navigation and actions.
- Maintain a clean and organized layout with consistent spacing and alignment throughout the application.
- Use subtle transitions and animations for a smooth and engaging user experience.
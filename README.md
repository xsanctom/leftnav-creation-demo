# Left Navigation Creation Demo

An interactive tool for customizing and prototyping left navigation structures. This tool allows stakeholders to experiment with navigation layouts through a functional card sorting exercise.

## Features

- **Drag & Drop**: Reorder sections, groups, and items with intuitive drag-and-drop
- **Real-time Preview**: See changes immediately in the sidebar
- **Icon Selection**: Choose from a library of SVG icons
- **Export/Import**: Save and share navigation configurations as JSON
- **Accordion Groups**: Only one group expanded at a time for cleaner navigation
- **Temporary Changes**: All modifications reset on page refresh (perfect for testing different configurations)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3002`

### Build

```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured for GitHub Pages deployment.

### Automatic Deployment (Recommended)

The project uses GitHub Actions for automatic deployment. Simply push to the `main` branch and the site will be automatically deployed.

1. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```

2. Go to your repository Settings > Pages
3. Under "Source", select "GitHub Actions"
4. The site will be available at: `https://xsanctom.github.io/leftnav-creation-demo/`

### Manual Deployment

Alternatively, you can use the provided `deploy.sh` script:

```bash
chmod +x deploy.sh
./deploy.sh
```

This will:
1. Build the project
2. Create a `gh-pages` branch with the built files
3. Push to GitHub Pages

## Project Structure

- `src/components/` - React components
  - `NavigationEditor.jsx` - Main editor interface
  - `Sidebar.jsx` - Live preview sidebar
  - `SectionCard.jsx`, `GroupCard.jsx`, `MainItemCard.jsx` - Draggable navigation items
  - `IconPicker.jsx` - Icon selection component
  - `EditPanel.jsx` - Side panel for editing item properties
- `src/context/NavigationContext.jsx` - State management for navigation structure
- `src/utils/iconUtils.js` - Icon utilities and auto-discovery
- `src/assets/images/` - SVG icon library (automatically discovered)

## Usage

1. **Add Items**: Use the "+" buttons to add sections, groups, or main items
2. **Edit**: Click "Edit" on any item to modify its properties (name, icon, link, badge)
3. **Reorder**: Drag items to reorder them within their container
4. **Expand Groups**: Click on a group to expand/collapse it (only one group expanded at a time)
5. **Export**: Click "Export JSON" to save your navigation structure
6. **Import**: Click "Import JSON" to load a previously saved structure

## Restrictions

- Groups cannot be moved into other groups
- Group items must stay within their group
- Section-level main items cannot be moved into groups
- Only one group can be expanded at a time

## Technologies

- React 18
- Vite
- @dnd-kit (drag and drop)
- CSS Custom Properties (design tokens)


# Navigation Structure - Naming Conventions & Restrictions

## Naming Conventions

### 1. **Sections**
- **Type**: `sections` (array in navigationData)
- **Properties**: `id`, `name`, `items[]`
- **Level**: Top-level containers
- **Contains**: Groups and Main items (at section level)

### 2. **Groups**
- **Type**: `type: 'group'`
- **Properties**: `id`, `type: 'group'`, `label`, `icon`, `expanded`, `badge` (optional), `children[]`
- **Level**: Section-level items (direct children of sections)
- **Contains**: Main items (in `children` array)

### 3. **Main Items**
- **Type**: `type: 'main'`
- **Properties**: `id`, `type: 'main'`, `label`, `icon`, `link`, `active` (optional)
- **Level**: Can be at two levels:
  - **Section-level**: Direct children of sections
  - **Group-level**: Children of groups (in group's `children` array)

## Drag & Drop Restrictions

All items must stay at their own level. The following restrictions are enforced:

### ✅ Allowed Operations

1. **Sections**: Can be reordered (via add/delete, not drag - sections are not draggable)
2. **Groups**: Can be reordered within sections (moved between positions in the same section or different sections)
3. **Main Items (Section-level)**: Can be reordered within sections and moved between sections
4. **Main Items (Group-level)**: Can be reordered within their parent group

### ❌ Restricted Operations

1. **Groups CANNOT be moved into other groups**
   - Groups must remain at section level
   - Cannot be nested inside other groups

2. **Group items CANNOT be moved to different groups**
   - Items within a group must stay within that same group
   - Cannot move group items to section level
   - Cannot move group items to other groups

3. **Section-level main items CANNOT be moved into groups**
   - Main items at section level must stay at section level
   - Cannot be dragged into groups (use "+ Item" button in group to add items)

## Data Structure Example

```javascript
{
  home: { id: 'home', label: 'Home', icon: '...', fixed: true },
  sections: [
    {
      id: 'section-1',
      name: 'Current Venue',
      items: [
        // Section-level main item
        { id: 'item-1', type: 'main', label: 'Menu', icon: '...', link: '#' },
        
        // Group (section-level)
        {
          id: 'group-1',
          type: 'group',
          label: 'Messaging',
          icon: '...',
          expanded: false,
          children: [
            // Group-level main items
            { id: 'item-2', type: 'main', label: 'SMS Notifications', link: '#' },
            { id: 'item-3', type: 'main', label: 'Email Notifications', link: '#' }
          ]
        }
      ]
    }
  ]
}
```

## Implementation Notes

- Restrictions are enforced in `NavigationEditor.jsx` in the `handleDragEnd` function
- The drag handler validates source and target locations before allowing moves
- Invalid moves are silently rejected (no error message, just no action)
- Users can still add items to groups using the "+ Item" button within groups


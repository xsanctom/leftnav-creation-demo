import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNavigation } from '../context/NavigationContext';
import SectionCard from './SectionCard';
import AddControls from './AddControls';
import EditPanel from './EditPanel';

function NavigationEditor() {
  const { navigationData, reorderItems, reorderGroupChildren, moveItem } = useNavigation();
  const [editingItem, setEditingItem] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    // Find source location (section and index, or group and index)
    let sourceSectionId = null;
    let sourceIndex = null;
    let sourceGroupId = null;
    let draggedItem = null;

    // Search in sections first
    for (const section of navigationData.sections) {
      const index = section.items.findIndex(item => item.id === activeId);
      if (index !== -1) {
        sourceSectionId = section.id;
        sourceIndex = index;
        draggedItem = section.items[index];
        break;
      }
      
      // Search in group children
      for (const item of section.items) {
        if (item.type === 'group' && item.children) {
          const childIndex = item.children.findIndex(child => child.id === activeId);
          if (childIndex !== -1) {
            sourceSectionId = section.id;
            sourceGroupId = item.id;
            sourceIndex = childIndex;
            draggedItem = item.children[childIndex];
            break;
          }
        }
      }
      if (draggedItem) break;
    }

    if (!draggedItem) return;

    // Determine what type of item is being dragged
    const isDraggedGroup = draggedItem.type === 'group';
    const isDraggedMainItem = draggedItem.type === 'main';

    // Find target location
    let targetSectionId = null;
    let targetIndex = null;
    let targetGroupId = null;
    let targetItem = null;

    // Check if dropping on a section-level item or group
    for (const section of navigationData.sections) {
      const index = section.items.findIndex(item => item.id === overId);
      if (index !== -1) {
        targetSectionId = section.id;
        targetItem = section.items[index];
        
        // RESTRICTION: Groups cannot be moved into other groups
        if (isDraggedGroup && targetItem.type === 'group') {
          // Group trying to move into another group - not allowed
          return;
        }
        
        // Dropping on a section-level item - insert at this position
        // (Main items cannot be moved into groups - they must stay at section level)
        targetIndex = index;
        break;
      }
      
      // Check if dropping on a group child
      for (const item of section.items) {
        if (item.type === 'group' && item.children) {
          const childIndex = item.children.findIndex(child => child.id === overId);
          if (childIndex !== -1) {
            targetSectionId = section.id;
            targetGroupId = item.id;
            targetIndex = childIndex;
            targetItem = item.children[childIndex];
            break;
          }
        }
      }
      if (targetSectionId) break;
    }

    if (!targetSectionId) return;

    // RESTRICTION: Groups can only be moved within sections (not into groups)
    if (isDraggedGroup && targetGroupId !== null) {
      return; // Group cannot be moved into a group
    }

    // RESTRICTION: Group children can only be moved within the same group
    if (sourceGroupId !== null && targetGroupId !== null && sourceGroupId !== targetGroupId) {
      return; // Group items cannot be moved to different groups
    }

    // RESTRICTION: Group children cannot be moved to section level
    if (sourceGroupId !== null && targetGroupId === null) {
      return; // Group items must stay within groups
    }

    // RESTRICTION: Section-level main items cannot be moved into groups
    if (sourceGroupId === null && isDraggedMainItem && targetGroupId !== null) {
      return; // Main items at section level must stay at section level
    }

    // Handle reordering within same context
    if (sourceSectionId === targetSectionId && sourceGroupId === targetGroupId) {
      // Same section and same group (or both null for section-level)
      if (sourceGroupId && sourceGroupId === targetGroupId) {
        // Reordering within group children
        if (sourceIndex === targetIndex) return; // No change needed
        reorderGroupChildren(sourceSectionId, sourceGroupId, sourceIndex, targetIndex);
      } else {
        // Reordering within section items
        reorderItems(sourceSectionId, sourceIndex, targetIndex);
      }
    } else {
      // Moving between different contexts
      moveItem(activeId, targetSectionId, targetIndex, targetGroupId);
    }
  };

  return (
    <div className="navigation-editor" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-subtle)' }}>
          Customize your navigation by adding, editing, and reordering sections, groups, and items. 
          Drag items to reorder them. <strong>Note: All changes are temporary and will reset on page refresh.</strong> 
          Restrictions: Groups cannot be moved into other groups. Group items must stay within their group. 
          Main items at section level must stay at section level.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {navigationData.sections.map((section, sectionIndex) => (
            <SectionCard
              key={section.id}
              section={section}
              sectionIndex={sectionIndex}
              onEditSection={(section) => setEditingSection(section)}
              onEditItem={(item, isChild, groupId) => setEditingItem({ item, isChild, groupId, sectionId: section.id })}
            />
          ))}
        </div>
      </DndContext>

      <AddControls />

      {editingSection && (
        <EditPanel
          type="section"
          item={editingSection}
          onClose={() => setEditingSection(null)}
        />
      )}

      {editingItem && (
        <EditPanel
          type={editingItem.item.type}
          item={editingItem.item}
          sectionId={editingItem.sectionId}
          groupId={editingItem.groupId}
          isChild={editingItem.isChild}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

export default NavigationEditor;


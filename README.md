This module provides table implementation with advanced sorting and filtering features. 

# Class Names

SearchFilterTable

## Functionality

The component will display a paginated table with per column sorting and complex filtering tools.

It allows outcomes to be attached at table and row level

## Datasource

Set the datasource to a list of objects


## State

Create a State LIST object of the type of the model data items.


## Outcomes

Any outcome attached to the component is dealt with in this way: -

* If the outcome is set as "Appears At Top" then it will become a button in the top title bar or its context menu otherwise it becomes a button on the tree node or its context menu.

* If the outcome has its "When this outcome is selected" option set to either "Save Changes" or "Partially Save Changes" and is attached 
to a tree node then the current node is set as the state value when triggered.

* If the outcome has an "icon" attribute then this value is used to specify the icon, otherwise a default "+" icon is used.  Note: Icons are 
bootstrap glyphicons without the "glyphicon-" prefix e.g. "trash","edit" etc.

* If the outcome has a "Label" set then this is used as the tooltip otherwise the outcome's name is used.

* "OnSelect" is a special case and is attached to the action of clicking a tree node.

* If the outcome's developer name begins with "CM" (case insensitive) then the outcome is added to either the main tree or the current node's context menu rather than as a button.

* All outcomes including "OnSelect" are optional.

* Outcome order is respected.  

* The expand and contract default buttons in the title bar are given order 10 & 20 respectively to allow for controlling button display order and injecting your outcome around them.

## Outcome Attributes

### icon

Sets the glyphicon to show for the outcome.


## Settings

### Columns

Sets the display columns for the table.

### Label

The Label of the component is used as the title bar

### Width & Height

If specified then these are applied as pixel values.

## Component Attributes

### PaginationSize

Sets the max number of rows to show per pagination page

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base component's class value


## Styling

All elements of the tree can be styled by adding the specific style names to your player.


## Page Conditions

The component respects the show / hide rules applied by the containing page.



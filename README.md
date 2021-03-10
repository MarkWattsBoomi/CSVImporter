![CSV Image](https://github.com/MarkWattsBoomi/CSVImporter/blob/main/csv.png)

This module provides a configurable CSV file importer which will push the contents into a List value in Flow. 


# Class Names

CSVImporter

## Functionality

The component will display a clickable file picker.

Once a file is chosen, the contents are inserted into a list value in flow.

No specific Type is required, just a list of any type

The type name of the objects is defined in attributes.

The column mapping<->attribue name is defined in the display columns.

The OnSelect outcome is triggered if defined.

## Datasource

Set the datasource to a list of objects


## State

Set it to the same list as the model the model data items.


## Outcomes

### OnSelect

Only the OnSelect outcome is used, it is optional and triggered if existing once a file is chosen and the state data is set.


## Outcomes Attributes

Not applicable


## Settings

### Columns

Sets the csv field mappings to object fields in the order specified.

### Label

The Label of the component is used as the title bar

### Width & Height

If specified then these are applied as pixel values.

## Component Attributes

### FirstRowHeaders

If defined and set to "true" then the first row of the file is considered headers and ignored

### FlowTypeName

Sets the type name of the objects to be created and inserted into the list.  The long type name.


## classes

Like all components, adding a "classes" attribute will cause that string to be added to the base component's class value


## Styling

All elements of the tree can be styled by adding the specific style names to your player.


## Page Conditions

The component respects the show / hide rules applied by the containing page.



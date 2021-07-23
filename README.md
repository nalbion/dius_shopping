# DiUS Shopping Challenge

## Notes: 
- Generally I prefer to work in TypeScript, but for this exercise
it was easier to get started with standard Javascript.
  
- The Catalogue information was provided in tabular form, 
  I have assumed that the store will be using a relational RDBMS to store the catalogue and specials. 
  It would have been easier to parse a function with each special, but the brief said that 
  the sales manager wanted to change the specials with little notice, I've assumed that means no app deployments.
  A document-based DBMS would allow for the `Special` data structure to be more 
  customised for each special, I've tried to make it more easy for the sales manager
  to edit using a spreadsheet.

- Complicated scenarios may arise if specials exist that involve the same sku.
  Eg: free VGA adapter with MacBook Pro, and 2 for the price of 3 VGA adapters.
  The order in which the specials are applied may yield in a different price, so
  the `Specials` records may need to have a `precedence` field.
  
- Please let me know how I can get a MacBook Pro for $1399.99

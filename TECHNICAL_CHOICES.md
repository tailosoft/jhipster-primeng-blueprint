# Table Filters
## User story
Our goal is to be able to:
1. share links to specific pages in the table with specific filters
2. be able to filter the table using the menu for example or button/dropdown not in the same file as the table (Organisation in the topbar, menu link...)

## Requirements
We would like to have:
1. The state of filters in the table (and outside the table/page) should be consistent with the url
2. urls as short as possible (easy to understand, share, and modify manually) without constant values (# of rows, match mode...)
3. Easy to understand by new developers

## Nice to have
The code should work for lazy and non lazy tables

## Implementation details
There many approaches all involving the same events:
    URL Change         Input filter Change          Order/Page Change           Lazy Load event
    
by default for lazy tables Order/Page change also triggers lazy load event.

What we need to decide the Single source of truth (SSOT) for each data (page size might not be stored in the same place as the filters value or there match mode) used in:
1. the query sent to the server
2. shown in the filter values
3. displayed (when needed) in the URL

The obvious choice would be to store everything in the table where there is a field for each of these things (page size filters...)

If the table doesn't have these field we could create our own table or have some form where we store all of these

Here is how the data could be retrieved and used on each event

So changes are mandatory to respect the requirement (or are automatically done by primeng) we will mark then in **bold** as we can't change them

1. 
    - on Input Filter change:
        - trigger Lazy Load event
    - on Order/Page change:
        - **trigger Lazy Load event**
    - on Lazy event:
        - Change URL
    - on URL change:
        - **Update the filters** (without triggering lazy load event)
        - Send request to the server using filter values
        
This approach is implemented but it's not very easy to understand for new devs, we will try to send request on lazy load event without loosing the SSOT
2. 
    - on Input Filter change:
        - Change URL
    - on Order/Page change:
        - **trigger Lazy Load event** (skipped due to debounce time)
        - Change URL (we should subscribe to first change instead of pageChange)
    - on Lazy event:
        - Send request to the server using filter values
        - ~~Change URL~~ (lazy Load event only triggered by filter/page/order change and we already change URL in those)
    - on URL change:
        - **Update the filters** (without triggering on Input Filter change)
        - Update page (first/rows) (without triggering on Order/Page change event)
        - trigger lazy load event (by reading filter from table)

3. 
    - on Input Filter change:
        - trigger Lazy Load event (calls table.filter)
        - Change URL (without navigation and on URL change)
    - on Order/Page change:
        - **trigger Lazy Load event**
        - Change URL (without navigation and on URL change)
    - on Lazy event:
        - Send request to the server using filter values
    - on URL change:
        - **Update the filters** (without triggering on Input Filter change)
        - Update page (first/rows) (without triggering on Order/Page change event)
        - trigger lazy load event (by reading filter from table) (only called with outside link/filter)

We prefer this approach as the SSOT is the table and we only keep on the URL what we need there (smaller URL).
Also it is much easier to understand for new developers as lazyLoadEvent in almost all cases is triggered directly by table filter and navigation
(without the logic of going through the URL serialize and deserialize).
Also, the same code works for lazy and non lazy tables.

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

## Implementation details
There are many approaches all involving the same events:
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
        
This can be summarized as follows:
    When the URL changes the table state (filters/order/page) must change
    When the table state (filters/order/page) changes the URL must change
    And in both cases we should send a request
    
The easiest way to understand for a new developer would have been to make the URL trigger the table change, and the table change send the request,
but this is not feasible as this will trigger URL change back... (since we can't change the router's state without triggering routerChange which will trigger change again).
On the other hand we can update the the table's state without triggering the onLazyLoadEvent.

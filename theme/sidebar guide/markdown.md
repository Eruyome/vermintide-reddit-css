##### [ Special sidebar formatting guide (CSS related) ]

This subreddit uses some fancy CSS, which requires a specific sidebar structure.
Important element/content order:
- The flair filter selection has to be the first unordered list.
    - Every entry can have a nested unordered list that gets converted into a tooltip.
- The sticky box list has to be the first ordered list.
- **`h3`**'s can only be used in the "Subreddit Rules" section.

Sticky box formatting:
- Every list item should be a link to avoid unexcepted formatting issues.
- Every list item can have any string prepended as kind of a ~~`type description`~~.
- The syntax **`**String**`** styles any part of the link title in the color ~~`red`~~.
- The syntax **`_String_`** styles any part of the link title in the color ~~`white`~~.

Subreddit rules formatting:   
- Every "list entry" must be a **`### header`** (can contains links).
- Every "list entry" must be followed by a blockquote to have a tooltip.
- Blockquotes can have any content, preferrably a list.
- Example: 
- ```
	### No ["naming and shaming"](url-here) players.
	> * Explanation
	> * Explanation
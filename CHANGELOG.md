## 29 May 2026
- [pt-br] Zone names now translated and UI tweaked for passages/side missions to auto resize for longer zone names
- [pt-br] Passage names are now translate-able; only a handful translated for now
- [fix] Lang selector icon now changes as expected
- Doggy / renown vote boxes revamped:
	- Locations now sorted by zone (by unlock order)
	- Zone icon now displayed next to vote box
	- Zone icon displayed below "quest" name as subtext instead of on same line - this is now also translated as per above
	- Database updated to remove zone name from the "quest" name, since it's now displayed separately
- [fix] Downvoting a secret passage or friendship quest will no longer disable all upvotes, just the one for that passage/quest

## 27 May 2026
- Added background image to the rows for secret passages / side missions that correspond to each individual zone (images are the in-game illustrations shown during loading, cropped and scaled to show specific parts of interested in the limited space)

## 25 May 2026
- Added optional browser notification option to passages, which shows up when auto refresh is enabled
- Fixed issue causing dropdowns not to work on FF-ESR 115

## 19 May 2026
- Initial version of new UI

### Highlights:
- Various visual improvements / polish
- Boss reset time fixed, and boss reset will now auto clear the bosses marked as done on the passages page
- Login now uses access token instead of cookies for verification which should help solve some problems people had - note that Auth0 does still use some cookies (as well as Cbox), though not until you login
- Since new UI isn't server-rendered, settings are now stored in browser's local storage instead of cookies

### Changes:
- Frontend logic ported over from old php system to new Node one (details in Technical section)
	- New system should be quicker to load since initial page load doesn't need to wait for database calls
- Header:
	- Site title now uses a web font to make it not look as boring (uses a free one called Foul Fiend Font by Chad Savage)
	- Tweaked padding on various header elements to look nicer, including removing a bunch of extra padding on the right side
	- Styled the "Log in" button to fit the theme / be the same height/passing as other navigation elements (was using default browser button look before)
	- Moved boss reset countdown to passages page (more info below)
	- "Time Until Zone Reset" changed to "Zone Loot Reset" for clarity and to add distinction from secret passage/side mission resets
	- Re-added share link where boss reset countdown was (since it was empty)
- Countdowns now have a timer icon in front - the knob of the timer will rotate as the time gets closer to finishing, once a timer has <= 20% left then it will slowly change color from yellow->red and shake with increasing intensity as it approaches 0%
- Chat:
	- Tabs now have a purple style to better match the color of the chat's background image
	- Unicode flags swapped out with images since chromium browsers don't support them (because Microsoft is afraid of offending someone by making an indirect stance on what counts as countries)
		- I choose to use images instead of a custom font since I already had the images, and these are the same images used in game so it's more thematic
	- Chat scrollbar update to be thin & a darker color (was appearing as standard light color version on chromium browsers)
	- Chat Rules / Text Filters buttons restyled (used default browser button look before)
	- Tweaked chat height a bit on right side so that it no longer extends on top of the border line of the footer
	- Filters list modal now actually shows the images next to spam/boss instead of indicating there will be one with text
- Extended pt-br translation a tiny bit so that page names and some chat tabs are now translated
- Table/List headers updated to be a bit more stylish
- Refresh button designs polish, left side icon area made a little smaller, and icon updated and made a bit smaller
	- Also updated the auto refresh checkbox + input into a button toggle widget that makes it look a bit nicer (same functionality though)
	- As before the text in the refresh button is replaced with loading dots to indicate when a refresh is happening (be it from auto refresh, manual refresh, or from changing pages / clicking back onto site)
- Flags are changed from red when marked to a blue-ish purple color, with marked items also having a much lowered opacity - this change was done as flagged items should draw LESS attention, not more, as you're done with them
- Links and info tooltip (i) icons updated to look nicer
- Bosses:
	- On the SPs page Bosses now have a dedicated column on the right side of the description area for clarity
	- Moved boss reset timer into the passages page since everything else boss related was already there
	- Fixed a bug causing boss reset timer to be off by a day
	- Bosses marked as complete on the passages table now auto reset instead of having to clear them manually
- Secret Passages:
	- Change "Time Until Reset" to "Passages Rotate" for clarity in relation to the zone reset and the boss reset
	- Page description condensed a bit for simplicity and to make room for bosses column
	- Table converted into a list (purely to make it look nicer)
	- Grayed out passages has their designed tweaked slightly to be a little less in-your-face since they do sometimes end up being correct (especially if someone trolled and an incorrect one was votes last round)
		- If a grayed out option has a positive vote total the grayed out effect is now removed instead of combining the two
- Side missions:
	- Renamed to "Side missions" from "quests" / "side quests", as side missions is the official name for them
	- Condensed description area a bit for simplicity
	- Table converted into a list (purely to make it look nicer)
	- Updated some NPC icons so they don't have extra spacing on the side, and so they have a more consistent scale
	- Hovering over a vote box will cause the NPC image to zoom in a bit - totally for functional purposes, and not just because I thought it would look cool... \*cough\*
- Doggy (Renown friendship missions):
	- Renamed "Renown / Dog" page to "Doggy" since no one refers to it as renown and just wasted room, and "Doggy" was chosen as I liked it and it's what the game refers to it as in one of the menus
	- Condensed description area a bit for simplicity
	- Since flags are per group instead of per vote box, selecting the flag turns the whole section very opaque similar to the voter box mechanic
	- Table converted to sections (purely to make it look nicer) - I choose sections instead of the rows like the other pages due to the large amounts of locations each option has which benefits from having the whole width to play with
- Antonio:
	- Icons are now rendered in their default size instead of scaled to the same size, so some icons should look a little crisper
	- Tweaked the design slightly of the antonio button when it's in the header (when  the setting is on) to be a little more stylized (green border) and is aligned bettered with the other header navigation items
Misc:
	- Added a new background image for the site content (some faint lightly colored dots and round-capped lines); it should be more subtle and and much less predictable pattern
	- I made sure to port over nyan cat mode and MLP mode since those are totes super duper important, no cap, for-realz, 67
		- Decreased scale of nyancat font so it's less disruptive to layout

### Technical:
- Summary
	- Frontend rewritten from server-rendered php pages / snippets to a Svelte Node.js project using typescript built with Vite
	- Api layer updated from accepting auth based cookies and returning HTML to accepting & returning json
	- Backend (stored in a private repo) migrated to new location / cleaned up a bit, but logic mostly left as-is for now

- Frontend:
	- Frontend split into it's own public repo
	- Frontend remains a SPA webpage with largely same design / structure, but the frontend is now rewritten / fully rendered with Svelte (I use React at work, so enjoyable to use something else for personal projects)
		- Svelte is also very lightweight, and while this isn't a very big site the smaller the better
	- Codebase uses Typescript with node.js and use Vite for the build process
	- Moved public keys from a json file to a more modern `.env` file system for easier local development and sharing
	- Auth0 still used for user logins, but now uses access tokens (both for frontend verification and to pass back to the api server)
	- Api calls now stored in helpers functions for to separate them from main logic, and have Typescript types (no proto files or anything to ensure they remain consistent with backend however)
		- SSWR library uses to enable easier auto refreshing and caching data between fetches
	- Rewrote countdown and frontend-reset logic fairly heavily to feel less hacky and use a more unified system. Countdown logic is good, though I choose to keep reset logic a little hacky (just since I know it works)
	- Vote boxes and vote buttons now uses a shared component/style to ensure consistency across the different trackers (each used copy-pasted logic before)
- Backend & Api server (not stored in repo to make it a little harder for trolls)
	- PHP updated from v7.4 to v8.3 (latest web host allows)
	- Moved some secrets and such from being hardcoded in a php call to being stored in an .env file (just for better practice and easier local development)
	- Auth checks now decode access tokens passed in via the header using the Auth0 php library
	- POST calls now expect a JSON object as the request instead of form fields; this not only make it easier to deal with on the frontend in general, but also preservers types instead of having to manually convert booleans and numbers on each end of the api
	- All APIs return json responses now (some server errors may still return a string)
	- List / summary calls largely return the same data though in json format as mentioned above; a couple slight tweaks
	- Vote calls mostly left as-is other then returning a json success message instead of an empty string, and a bug fix someone pointed out
	- Reset scripts and logs left untouched
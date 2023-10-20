# Changelog

##### [2.27.0] - 17 August 23

- Clipboard on the Receive page is now available on internal Minima browser

##### [2.33.1] - 12 September 23

- update mds.js

##### [2.33.2] - 18 September 23

- Fix send page going stale sometimes when token still undefined

##### [2.34.0] - 10 October 23

- Consolidate added to SendForm
- Logs added to the confirmation page of Split & Consolidate
- Coin Split by 10
- adding names to your default addresses in the receive page
- added Message field to Send form
- updated MDSFAIL message
- hide/show vault password
- UI/UX design cleaned up and improved
- Brand icon updated
- closer look & feel to other dApps
- bug & other fixes

- dev changes
  - CRA -> vite for quicker development
  
##### [2.34.0] - 10 October 23
  - Fix layout with Inputs, Outputs in txn history details
  - Fix the state of buttons on forms when haven't touched the req fields

##### [2.34.6] - 14 October 23
- fix mds fail error on page refresh
- truncate address in middle on smaller screen (Receive page)
- fix Camera prompt issues
- add Web Validation helpful info
- change 'Cancel' to 'Close' where appropriate on modals
- clean up logs


##### [2.34.7] - 12 October 23
- Menu backdrop click to close
- Add Burn as optional & info dialog

##### [2.34.8] - 13 October 23
- Update consolidate, coin split link
- Success message on consolidate : remove Check coins property of your token
- Burn info keep only Last 10 and last 50 
- Stop propagation when tapping hamburger menu
- Untitled address (from N/A)
- Add scrollbar to address list
- Receive page tweak design, copy tap anywhere in white box (better mobile ux)
- Update Select component in TokenCreaton & SendPage
- Hide QrScanner in internal Minima browser
- Update Burn Copy

##### [2.34.9] - 13 October 23
- Fix .length error in NFTs 
- Clean up logs


##### [2.34.10] - 18 October 23
- Fixed nfts uniqueness
- Backward compatible images for NFTs if they use artimage

##### [2.34.11] - 20 October 23
- Set a fixed height of content on NFT Collection page
- Fixed downloading transaction CSV
- Added a download all transactions on History page
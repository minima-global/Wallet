# Changelog

##### [3.0.17] - 06 March 2025

- Minor text change

##### [3.0.16] - 05 March 2025

- Fixed truncated token name on the token details page

##### [3.0.15] - 05 March 2025

- Altered truncated token names on the balance page, send page and history page
- Added copy button to the balance page for token confirmed, sendable and unconfirmed amounts
- Added copy button to the history page for amount, 0x and Mx address 

##### [3.0.14] - 27 February 2025

- "Pending MiniDapp" is no longer translated pending_transaction_message and denied_transaction_message ui labels.
- Fixed history bug where it was inserting duplicate txpows into the database
- Fixed issue with viewing Maximize transactions on the history page

##### [3.0.13] - 26 February 2025

- Tapping the QR code on the receive page now copies the address to the clipboard

##### [3.0.12] - 24 February 2025

- Fixed amount formatting on token details page

##### [3.0.11] - 24 February 2025

- The mobile menu is now hidden on large devices
- Fixed the incorrect validating address being shown when submitting an address via the validate address form

##### [3.0.10] - 24 February 2025

- Metadata for tokens are now displayed if the value is an object or an array

##### [3.0.9] - 21 February 2025

- Added a max button to the send page
- Adjustments have been made to the UI for 1024 x 720 devices
- Added Minima to the filter list, the selected filter will last for the duration of the session (until browser is closed)
- Minor UI tweaks

##### [3.0.8] - 20 February 2025

- Added 0x address to the receive address page
- Fixed the send button being disabled when the address was in lowercase on the send page

##### [3.0.7] - 19 February 2025

- Added the ability to open the token URL in the external browser on the device for Android

##### [3.0.6] - 19 February 2025

- Minor UI tweaks
- Extra NFT details are now shown on the nft details page
- You can now open the token URL in a new window to view the token image bigger

##### [3.0.5] - 18 February 2025

- Tweaked arrow direction on dropdowns

##### [3.0.4] - 18 February 2025

- Added minor UI rollover fixes

##### [3.0.3] - 18 February 2025

- Fixed a bug when the burnt token balance was not being reflected immediately in history

##### [3.0.2] - 17 February 2025

- Added spinner loader on buttons that perform Minima commands

##### [3.0.1] - 17 February 2025

- Added ability to burn tokens by a specific amount
- Added a send token button on token details page
- Mobile menu now fades in
- Mobile menu, active page is now shown correctly
- Searching for an address by name now works
- Ticker is now shown on balance page
- Various UI bug fixes

##### [3.0.0] - 17 February 2025

- The wallet has been reskin
- Languages support for: English, Spanish, French, Japanese, Korean, Chinese, Russian, Ukrainian
- Updated history page design

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

##### [2.34.13] - 20 October 23

- Set fixed height to all NFTs + favorites

##### [2.34.14] - 03 November 23

- Added category to dapp.conf

##### [2.35.0] - 21 November 23

- Pick up URL parameter address for the Send page
- Added a copy button for the Receive page on mobile view

##### [2.36.0] - 24 November 23

- Added Settings & currency formatter
- Re-worked the way tokens are displayed with their different states (confirmed, unconfirmed, sendable)
- Added token information about the sendable, confirmed  & unconfirmed state
- Tap QR Code to copy on Receive page
- Design tweaks

##### [2.36.3] - 27 November 23

- No transactions recorded yet for history state fixed
- Keys ongoing creation dialog when just starting node added
- Updated copy for token information
- Bug fixes

##### [2.37.3] - 28 November 23

- Updated validation on Receive page
- Important truncated info is now scroll-able and can be copied throughout the app
- Clicking outside overlaying not-so-important dialogs are now closed

##### [2.37.4] - 29 November 23

- Cut off overlaying content in Locked section
- Validation UI fixed
- Removed copying in the address box, QR Code is now main copy button
- TotalLockedCoins is now absolute
- Send page NFT images weren't rendered, now fixed
- Make radix point default for decimals
- Address Validation report UI made simpler
- NFT Page now supports Masonry CSS Grid
- NFT Detail updated

##### [2.37.6] - 30 November 23

- Tweak NFT page design
- Update NFT default images
- Fix unvalidated NFT icon
- Copy data path in Status page fixed
- Clicking token amount info on Send page now shows token info
- Make token info backdrop click close dialog

##### [2.38.0] - 30 November 23

- Added IPFS Uri Support for tokens
- Added Maxima name as default name for Creator's name on NFT Creation form

##### [2.45.0] - 16 August 24

- Burn hotfix on NFT/token creation

##### [2.45.0] - 19 September 24

- Tweak design

##### [2.45.1] - 20 September 24

- Token balance info updated
- Additional design tweaks

##### [2.45.5] - 23 September 24

- additional design tweaks

##### [2.45.6] - 24 September 24

- decode urls

##### [2.47.0] - 21 October 24

- Fix decimal places for balances
- Set Max amount on send form

##### [2.47.2] - 23 October 24

- Fix type error for NFTs
- Design tweaks
- other bug fixes
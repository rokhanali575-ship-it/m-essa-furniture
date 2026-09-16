# M ESSA Furniture — Professional Website

## Pages
- `index.html` — premium home
- `collections.html` — separate furniture collection page
- `products.html` — live product catalog
- `about.html` — professional About Us
- `contact.html` — phone, WhatsApp, email and location
- `admin.html` — private owner dashboard

## Owner product manager
Products are stored in Firebase Firestore. The owner logs into `admin.html` with Firebase Email/Password Authentication and can:
- add product
- upload photo
- set category
- set price
- write description
- edit product
- delete product

## Firebase setup
1. Create a Firebase project.
2. Add a Web App.
3. Copy its config into `firebase-config.js`.
4. Authentication -> Sign-in method -> Email/Password -> Enable.
5. Create the owner account.
6. Create Firestore Database.
7. Start with the rules in `firestore.rules`.
8. For a single-owner store, replace the authenticated-user rule with a rule restricted to the owner's UID, as explained in the previous version/console comments.

## Run in VS Code
Use VS Code Live Server (or another local HTTP server). Do not open module pages with `file://`.

## Publish free
GitHub + Netlify is a simple free workflow:
1. Create a GitHub repository.
2. Upload this folder.
3. In Netlify, import the GitHub repository and deploy.
4. Netlify provides a free `*.netlify.app` address.
5. Update `robots.txt` and `sitemap.xml` with your real deployed address.
6. Add the deployed site to Google Search Console and submit the sitemap.

## Google business visibility
A website appearing in Google Search is separate from a Google Business Profile. For local discovery, create/claim your business profile with the exact business name and real shop details, and keep the same NAP (name, address, phone) across the website and business listing.

## Important
- Replace placeholder Firebase values before expecting the owner panel to work.
- Use your real shop photos and logo for the final brand look.
- The demo catalog images are only placeholders until you add your own products.

# IMPERIUM — Website Starter

This is a static ecommerce frontend for the IMPERIUM clothing brand.

## Files
- index.html — storefront
- styles.css — luxury minimalist styling
- app.js — products, filters, product modal, local cart and WhatsApp checkout
- config.js — business settings you must edit
- assets/ — hero image and placeholder product artwork
- shipping.html / returns.html / privacy.html / terms.html — policy placeholders

## 1. Run it locally
The simplest option:
- Open index.html in a browser.

For a better local test, use VS Code + Live Server, or run:
python3 -m http.server 8080
Then visit http://localhost:8080

## 2. Before launch
Edit config.js:
- whatsappNumber
- email
- shippingFlatRate
- freeShippingThreshold
- optional yocoPaymentLink

Replace the SVG product placeholders with your real product photos. Keep the same filenames or update app.js.

Replace the placeholder legal/policy pages with your final policies.

## 3. Recommended launch route for a small SA brand
A low-cost first launch can use:
- this frontend
- a custom domain
- static hosting such as Netlify/Vercel/GitHub Pages
- WhatsApp checkout for manual order confirmation
- Yoco Payment Links or Yoco Gateway for payments

Yoco says its Gateway supports custom-built websites and provides test/live keys through the Yoco Portal. Never put a Yoco secret key in app.js or any browser-side JavaScript. A secret key must stay on a secure server.

## 4. Moving to automated checkout
For a production checkout:
1. Create/verify your Yoco merchant account.
2. Use Yoco's current developer documentation for the Checkout API.
3. Add a small server/backend.
4. Keep the Yoco secret key in an environment variable on the server.
5. Create a checkout session on the server.
6. Redirect the customer to the payment flow.
7. Verify payment status server-side before treating an order as paid.
8. Store orders in a database or ecommerce platform.

Do not accept card details directly in this static site.

## 5. Publishing
### Netlify
1. Create a Netlify account.
2. Drag the `imperium-store` folder into Netlify's deploy area, or connect a Git repository.
3. Netlify will give you a temporary URL.
4. Add your custom domain in Netlify Domain settings.
5. Update DNS at your domain registrar.
6. Turn on HTTPS.

### GitHub Pages
1. Create a GitHub repository.
2. Upload all files.
3. Enable Pages in repository settings.
4. Choose the main branch and root folder.
5. Connect your custom domain if desired.

## 6. Business launch checklist
- Confirm the IMPERIUM name is available for your intended company/trademark classes.
- Decide ownership/share percentages with your partner in writing.
- Register the company if appropriate.
- Open a business bank account.
- Get your payment provider verified.
- Confirm courier pricing and delivery times.
- Finalise returns/refunds, privacy and terms.
- Photograph real products.
- Test mobile, desktop, checkout, WhatsApp links and every policy link.
- Place a real test order before public launch.
- Keep accounting/tax records.

## 7. Important
The products, prices, shipping terms and policy text in this starter are placeholders. Replace them before launch.

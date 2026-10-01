# AK Crafts Tenali

A public-facing branding site for AK Crafts Tenali, built with React, Vite, TypeScript, React Router, and Three.js. There is no account or login flow.

The site has dedicated Home, Our Story, Possibilities, Sizes & Prices, and Contact pages. The story process, frame style studio, size guide, and contact message builder are interactive. The size guide includes a Three.js room preview with wall and shelf placement, plus drag and button controls for a full 360° frame view. Layouts adapt to phone, tablet, and desktop widths.

The header language control switches the site between English, Telugu, and Hindi. It shares the custom dropdown behavior used in the contact form, remembers the choice locally, and prepares contact messages in the selected language.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build, run `npm run build` and deploy the `dist` directory to a static host with SPA route rewrites. Netlify (`public/_redirects`) and Vercel (`vercel.json`) rewrites are included. On other hosts, route requests such as `/story` should serve `index.html`.

## Content and imagery

- The contact numbers, Instagram handle, original brand reference, and collage sample come from the supplied website ZIP in `reference/`.
- The displayed prices now follow the latest customer-supplied price poster, `public/images/ak-price-list.png`, replacing the older ZIP price sheet.
- Eight distinct customer-supplied frame previews appear in the home collection and the filterable Possibilities gallery. Exact duplicate attachments are shown once. The viewer supports keyboard navigation, enlarged originals, and enquiries by size. Optimized JPEG previews keep the grid lighter while the original PNG files remain available in the viewer.
- Lifestyle photos are illustrative Unsplash photographs. The collage is labeled as an AK Crafts sample; other imagery is not presented as completed customer work.
- Three.js creates the animated frame arrangement in the hero. A static arrangement is shown on small screens, reduced-motion devices, or when WebGL is unavailable.
- `src/components/AppLogo.tsx` provides the site logo. The matching web icon is `public/favicon.svg`.

The WhatsApp links start a conversation; they do not place an order or collect data on this site.

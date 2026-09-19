# Tanaraga Product Brief

## Company objective

Tanaraga is an umbrella company that builds and operates products, services, and investment programs that make physical activity more accessible, sustainable, and commercially successful.

## Portfolio

| Pillar | Purpose |
| --- | --- |
| **Sync** | Strength and conditioning program classes. |
| **Nexa** | Sports assets and facilities operator management. |
| **Ventures** | Investment programs in physical-activity businesses with profit sharing. |
| **Gelora** | Sports-facility management software for online booking and revenue optimisation. |

## Website goals

The website introduces Tanaraga and directs prospective class participants to Sync. Sync is the primary focus of the initial launch; the rest of the portfolio is introduced on the About page.

## Current implementation

The initial site is a responsive static HTML, CSS, and JavaScript implementation with no build step or external application dependencies. It uses **Manrope** for primary typography and **DM Mono** for labels and supporting information.

- `index.html` is the Sync-led homepage.
- `about.html` introduces Tanaraga, its ecosystem, and its team.
- `app.js` reads the live class list from the Tanaraga Google Sheet, filters it, formats dates, and creates WhatsApp and location links.
- `styles.css` holds the shared responsive visual system.
- `assets/sync-hero.png` is used as the editorial training image on both pages.
- `assets/sync-logo.png` is the supplied SYNC logo. The brand palette uses orange `#E22E00`, sage `#A3BBA5`, off-white `#F2EFE9`, sand `#D6C7B5`, and charcoal `#2D2D2D`.

## Sitemap

### Home (`/`)

**Primary goal:** convert visitors into Sync class enquiries through WhatsApp.

Content:

1. A hero that presents Sync as Tanaraga's featured strength and conditioning program.
2. A concise explanation of the training approach and intended audience.
3. A class list, with each class showing its name, short description, schedule/location or a clear availability note, and a WhatsApp call to action.
4. A closing WhatsApp call to action for visitors who need help choosing a class.
5. A Coaches section beneath the classes, with three editable coach profiles and short descriptions.
6. A program overview for SYNC Rise, Apex, Grind, and Pulse.

**Visual direction:** clean, minimal, warm-neutral, and editorial. The homepage hero uses a two-column layout with Sync copy on the left and a training image of a man and woman on the right. On mobile, the image follows the copy.

**Primary CTA:** `Chat on WhatsApp` / `Join a Class`.

The CTA should open WhatsApp with a prefilled message that identifies the class where relevant, for example: `Hi Sync, I'd like to ask about [Class Name].`

### Sync class cards

Each class card should contain:

| Field | Initial content / format |
| --- | --- |
| Class name | `Strength & Conditioning` |
| Customer type | `Kids`, `Adults`, or `Older Adults` |
| Availability | `[X] slots remaining` |
| Price | `From Rp100.000` to `Rp200.000` |
| Place | `Padel Cafe` |
| Schedule | Weekend morning, between 08:00–10:00 |
| Duration | `1 hour` |
| CTA | WhatsApp enquiry or booking CTA with the selected customer type included in the prefilled message. |

The class list is read from the Tanaraga Google Sheet. The site displays only rows where `active` is `TRUE` and removes sessions once they are more than one day in the past. Dates are displayed in the format `Saturday, 26 Sep`.

The homepage shows the six nearest eligible classes and links to `/classes.html` for the full upcoming schedule. The schedule page offers class-audience filters. Class cards show the coach from the sheet's `coach` column.

The Padel Cafe location label should link to the exact Google Maps venue URL: `https://maps.app.goo.gl/BtrWfgkHJYknd6fh6`.

### Coaches

The homepage currently includes three placeholder profiles. Each contains a placeholder image area, a coach name, and a short editable summary. Replace these with confirmed coach names, biographies, and photography before launch.

### About (`/about`)

**Primary goal:** explain the Tanaraga ecosystem and how its four pillars work together.

Content:

1. Tanaraga's purpose and point of view on physical activity.
2. A four-pillar overview for Sync, Nexa, Ventures, and Gelora.
3. A short description of the relationship between the pillars:
   - Sync creates high-quality participation and coaching experiences.
   - Nexa operates the physical sports infrastructure.
   - Ventures supports the growth of activity-led businesses.
   - Gelora provides the software layer for facility booking and revenue optimisation.
4. Links or contact paths for each pillar when available.
5. A team section, “The team behind Tanaraga,” following the pillar overview.

The About hero follows the same two-column structure as the homepage, with its introduction on the left and an editorial image on the right.

### Team

| Person | Responsibility | Summary |
| --- | --- | --- |
| Dibyanta Satari | Business | Shapes commercial strategy, partnerships, and sustainable growth. |
| Abidzar Basaib | Operations | Builds systems that make programs and facilities run smoothly. |
| Ahmad Faig | Technology | Develops the digital products and technical foundations of the ecosystem. |
| Ezo Reynaldo | Branding & Marketing | Defines the brand, tells its story, and connects it to its community. |
| Haikal Rabbani | Program Manager | Turns ideas into reliable programs and participant experiences. |

## Launch requirements

- Mobile-first, fast, and easy to scan.
- Make WhatsApp the main conversion path for Sync.
- Use a configurable WhatsApp number and class data, rather than hard-coding them throughout the interface.
- Keep portfolio descriptions concise; Sync receives the most visual prominence.
- Confirm class names, schedules, locations, WhatsApp number, and brand assets before production launch.

## Open inputs

- Sync class list, details, schedules, and locations.
- WhatsApp number and preferred prefilled message tone.
- Brand direction: logo, colour palette, typography, imagery, and language (English, Bahasa Indonesia, or bilingual).
- Whether Nexa, Ventures, and Gelora should link to separate destinations at launch.
- Real coach profiles, biographies, and photography.
- Whether the About page should use a separate Tanaraga-specific editorial image rather than the shared Sync image.

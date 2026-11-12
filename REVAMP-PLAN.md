# XTGlobal revamp: plan and scorecard

Prepared 12 Nov 2026 against "XTGlobal Website Revamp Project.docx". Every requirement in the brief is listed below with a score for the current build (the site on xtglobal.vercel.app). Where the brief contradicts itself or the client's feedback, the argument is written out so it can go into the submission notes.

Scores: **Done** · **Partial** · **Missing** · **Violates** (the build does the opposite of what the brief asks) · **Risk** (could eliminate the entry).

---

## 1. The two things that decide the contest

**a. The colour feels like the old brand.** The client is right. The current build uses the logo's own cyan and a navy that the existing site already uses. The brief asks for "a new colour palette that gives it a fresh feel while complementing the logo", yet also says "deep navy as the dominant surface colour with sky blue reserved for action" is mandatory. The way through both: keep navy as the structural dark but shift its temperature toward violet, make the one permitted "documented supporting accent" a true violet that carries large surfaces, keep sky blue strictly for buttons and links, and warm the light surfaces. The logo is untouched; violet sits next to the chevron's blue end on the colour wheel, so it complements rather than fights it. Two candidate directions are in section 3.

**b. Three explicit prohibitions are currently broken.** The brief says no glassmorphism, no neon glow, no gradient meshes. The current build has a frosted-glass navigation and buttons, glowing halos on the ring floor and pod selection, and a cyan-to-indigo gradient card in the hero. A judge who reads the brief will mark these. They are removed in the colour pass (section 4).

**c. One mandatory view is missing.** "One interior template, either GCC-as-a-Service or a service detail page." Entries are eliminated for missing mandatory views. The GCC interior page is the first build item after colour.

---

## 2. Line-by-line scorecard

### Contest listing (lines 4–12)
| Requirement | Score | Note |
|---|---|---|
| Advanced, modern, interactive enterprise design with new branding and colour theme | Partial | Design and interaction are there. Colour theme is the client's objection. |
| Multi-page website | Partial | Homepage plus brand page only. |
| Clickable prototype (Figma / XD / Sketch) plus one interactive module | Partial | We have a live coded prototype, which goes further than a click-through. **Argue:** a working build is a stronger proof than a Figma prototype; the Figma file is a winner's deliverable and follows on shortlist. |
| Design system plus page templates, desktop and mobile | Partial | System exists (brand-system.html). Templates: homepage only. |
| Authority, scannable dense content, ~50 pages | Partial | Homepage handles density well; no interior pages to prove it at scale. |
| GDPR, licensed images, accessibility | Risk | No cookie consent pattern. **The tower, bridge and campus photos have no recorded source or licence.** Unlicensed assets eliminate an entry. Accessibility: skip link, focus rings, ARIA, reduced motion are in; contrast was fixed once, re-check after recolour. |
| End-to-end build, SEO friendly, AI plugins, interactive | Partial | Static HTML; AI layer is a designed simulation. Fine for a contest, must be said plainly in notes. |
| Easy to maintain in-house by non-technical staff | Missing | Needs a CMS recommendation in the notes (headless CMS with the component system mapped to blocks). |
| Site behaves like a knowledgeable guide: AI layer, brand avatar, dynamic modules | Done | Vector avatar, assistant panel, configurator, estimator, delivery band. |

### About XTGlobal, real content (lines 14–22)
| Requirement | Score | Note |
|---|---|---|
| 25+ years, 200+ programs, 700+ professionals, $50M revenue | Done | Hero ring cards and About bento. |
| ISO 27001, SSAE 18, HIPAA, CMMI DEV/ML3, NMSDC MBE | Done | Client-wall chips and certifications section. |
| Microsoft **Silver** Partner, Oracle **Gold** Partner | Partial | Our partner strip (the client's own image) says Microsoft **Gold** and plain "Oracle Partner". Use the brief's wording in the design and raise the mismatch in notes. |
| Six services | Done | |
| Four industries | Done | |
| Circulus and Network Objects, present without overwhelming the parent brand | Done | Circulus spotlight plus Network Objects strip. |
| Plano / Hyderabad / Visakhapatnam, phone, email | Done | |
| Public listed in India; highlight the Investors section | Partial | Section and nav item exist. Make it visibly a highlight: give it a tinted surface, a live-feed placeholder and a results calendar; move it one slot higher. |

### Audience and the five goals (lines 24–32)
| Requirement | Score | Note |
|---|---|---|
| CIO skims scale, tenure, certifications in the first two screens | Done | Stats in hero ring, certifications in the client wall. |
| Evaluator reads deeply: service detail, delivery models, security, proof | Partial | Needs the interior template. |
| Desktop dominant | Done | |
| Credibility inside eight seconds | Done | |
| GCC flagship one click from homepage | Done | Highlighted nav item and hero button. |
| Convert to discovery calls, downloads, RFP inquiries | Done | Form with RFP option, one-page summary download, conversational alternative. |
| Absorb growing content depth without fatigue | Partial | No insights hub with filtering yet. |
| Visibly runs on AI thinking | Partial | Assistant and avatar yes; no generated summaries or recommended-next module yet. |

### Scope (lines 36–39)
| Requirement | Score | Note |
|---|---|---|
| One interior template, GCC or service detail | **Missing, Risk** | Build the GCC-as-a-Service page with the scroll-linked diagram and campus hotspots. |
| One interactive module with a one-line note | Done / note missing | The pod configurator. Note to write: "Chosen because it turns the hardest service to picture into a thing a buyer can shape in ten seconds." |
| Logo redesign and copywriting out of scope | Done | Logo untouched; copy used verbatim. |

### AI-assisted content and navigation (lines 44–49)
| Requirement | Score | Note |
|---|---|---|
| Conversational search replacing the magnifier, answers with linked sources | Done | Vector, with citation chips. |
| Generated summary on long case studies, labelled, with reading time | Missing | Design the pattern on the interior template and a case-study card. |
| Role or industry selector that reshapes the homepage | Done | "I am here for" band. |
| Recommended next content as a designed module | Missing | Add a "Because you read" module after results. |
| Designed AI-output pattern: streaming, citations, escalate, disclosure | Done | |
| Progressive profiling on gated assets | Missing | Design the one-field returning-visitor state on the one-page summary download. |

### Dynamic modules (lines 52–57)
| Requirement | Score | Note |
|---|---|---|
| GCC pod configurator | Done | |
| Visakhapatnam campus diagram with hotspots | Missing | Belongs on the GCC interior page; a static summary card on the homepage. **Argue:** two anchors in one homepage block is too much; configurator stays on the homepage, diagram goes interior. |
| Circulus value estimator | Done | Maths are placeholders; label stays until XTGlobal supplies benchmarks. |
| Live delivery band across three offices | Done | |
| Engagement builder with downloadable one-page summary | Partial | Download exists; add the lead capture (name, email) in front of it, with progressive profiling. |
| Instant filtering on the insights hub | Missing | Design as a template if shortlisted; show the filter component on the component sheet now. |

### Modern experience features (lines 60–63)
| Requirement | Score | Note |
|---|---|---|
| Light and dark theme, navy holding in both | Missing | Cheap once colour is tokenised. Add a toggle and show both in the PDF. |
| Scroll-linked storytelling on the GCC page | Missing | Part of the interior template. |
| Micro-interactions under 300ms | Done | Hover, press and validation are 140–260ms. **Argue:** section entrances at 500–900ms are reveals, not micro-interactions; reduced-motion disables them. |
| Multilingual readiness | Partial | Language pill in footer; add a language switch in the header and show one RTL-safe layout note. |

### What we have not listed (line 65)
| Requirement | Score | Note |
|---|---|---|
| "What I would add" section, scored | Missing | Draft in section 6. |

### Homepage structure (lines 67–77)
| Requirement | Score | Note |
|---|---|---|
| Hero, then a credibility strip with the four stats | Partial | Stats sit in the hero ring; the client wall follows the hero. **Argue (merge with rationale):** fold the four figures into the top of the client wall so proof and scale sit in one band. The brief allows merging two sections with a written rationale. |
| Avatar's first appearance and invitation | Done | Nav button, hero card, guide card. |
| "I am here for" band | Done | |
| 3–4 differentiators, six lanes, four industry cards | Done | |
| Distinct GCC block, three pods, 6–8 weeks, configurator anchored | Done | |
| Circulus spotlight | Done | |
| Client result cards | Done | |
| Investors highlighted | Partial | See above. |
| Certifications and delivery approach with the live band | Done | |
| Contact with three offices and a conversational alternative | Done | |

### Brand constraints (lines 79–83)
| Requirement | Score | Note |
|---|---|---|
| New palette, fresh feel, complements the logo | **Partial, the client's objection** | Section 3. |
| Mandatory palette and motif rules; tints, shades and one documented accent allowed | Partial | The accent will be documented with contrast values on navy and off-white. |
| Title Case headlines | Done | |
| Ampersands in headlines only | Partial | Footer links carry "&". Spell out "and" in links and body. |
| Phone numbers with periods | Done | |
| No exclamation points | Done | |
| No line break inside XTGlobal | Done | |
| Imagery: desaturated architecture, bridges, towers; no clip art or stock gestures | Done / Risk | Right kind of imagery, unknown licences. |
| Interaction accent clears contrast on navy and off-white | Partial | Copper does; re-verify after recolour. |

### Visual direction (lines 85–88)
| Requirement | Score | Note |
|---|---|---|
| Institutional before fashionable, current in 2030 | Partial | The light shafts and glows lean fashionable. Keep the photographic light, drop the glow. |
| Generous whitespace, visible grid, disciplined type scale | Done | |
| Deep navy dominant, sky blue for action | Partial | Dark surfaces are near-black, not navy. Fixed by the new palette. |
| No gradient meshes, glassmorphism, neon glow, handshake stock, icon walls, full-screen video | **Violates** | Glass nav and buttons, glow halos, gradient card. All removed in the colour pass. |
| Interactivity reads as intelligence; static state makes sense | Done | |

### References (lines 90–91)
| Requirement | Score | Note |
|---|---|---|
| Name references, principle taken, what was done differently | Missing | Written in the notes. Visual: two enterprise technology sites. Interaction: one AI-first product site, named separately. Nothing copied. |

### Mandatories and judging (line 93)
| Requirement | Score | Note |
|---|---|---|
| No marketplace templates | Done | All original code. |
| No missing mandatory views | Risk | Interior template. |
| No logo modification | Done | Only a white-wordmark variant for dark surfaces, chevron untouched. State this in notes. |
| No unlicensed assets; stock sources stated | Risk | Replace or license the five photographs; list sources. |
| AI imagery disclosed, never final | Done | None used. |
| Original avatar | Done | Vector is two chevrons, no face. |

### Winner deliverables (lines 96–102), for after shortlist
Figma file with variants and auto layout; 10–15 page style guide PDF covering grid, spacing, type, components; PNG previews of every template; SVG icons and licence list; clickable prototype of avatar, assistant and one module; avatar SVG and Lottie set; one-page motion spec; AI rationale and build sequence. Of these, the style guide, motion spec and rationale can be produced now and go into the PDF.

### Copy and submission (lines 105–109)
| Requirement | Score | Note |
|---|---|---|
| Verbatim homepage copy | Done | |
| Single PDF or PNG set, prototype link in notes, notes under one page | Partial | Poster and PDF to produce; notes to write. |

---

## 3. Colour: two directions, logo unchanged

Both keep the chevron exactly as supplied, keep sky blue for action only, and document one supporting accent.

**Direction A, Ink Violet (recommended).** Closest to the references the client attached.
- Dominant surface: Ink Violet `#120F33`, a navy with a violet undertone. Reads as deep navy in a room, reads as new next to the old site.
- Secondary dark: Deep Indigo `#1E1A5C`.
- Supporting accent (documented): Violet `#6E4BFF`, carries the GCC block, investor surface, brochure covers, pattern fills.
- Action: Sky `#3CCBFF` from the chevron, buttons and links only.
- Light surfaces: Lilac Paper `#F4F2FA` and white.
- Text: Ink `#0F0D26`; secondary `#5B5A7A`.
- Signal (avatar and interaction accent): Copper `#FF7A3D`, unchanged.

**Direction B, Slate and Periwinkle.** More institutional, further from the references.
- Dominant: Slate Navy `#0F1B3D`. Secondary: `#1B2B5E`.
- Accent: Periwinkle `#7F8CFF`.
- Action: Sky `#3CCBFF`. Light: Warm Paper `#F6F4EF`.

What changes with either: glass nav becomes solid paper with a hairline; buttons become flat with a 1px edge; glow halos go; the hero gradient card becomes a flat violet card; light shafts stay but lose the bloom; the eight brand patterns and three brochures are recoloured to the same tokens.

---

## 4. Build order

**Phase 1, colour (first, for sign-off).** Tokenise the palette, apply across the homepage, brand-system page, patterns and brochures. Remove the three prohibited effects. Re-run the contrast check. Push to Vercel for review.

**Phase 2, the mandatory view.** GCC-as-a-Service interior page: sticky diagram that builds on scroll, campus diagram with hotspots (rooms, networks, support layers), three pod models, configurator reused, FAQ, CTA. Desktop and mobile.

**Phase 3, the missing patterns.** Credibility figures merged into the client wall; generated-summary pattern on a case-study card; "Because you read" module; progressive-profiling state on the summary download; light/dark toggle; header language switch; investors block made a highlight.

**Phase 4, housekeeping that can eliminate us.** Photo licences (replace with licensed or client-supplied photography, list sources); cookie consent pattern; Microsoft Silver wording; "&" only in headlines.

**Phase 5, the package.**
- Poster, up to 5000 × 5000, in the style of a theme-marketplace feature sheet: hero, each homepage section called out with what it does, the GCC interior, mobile frames, AI layer, modules, light and dark, and the prototype link.
- PDF: brand system (logo use, palette with contrast values, type, grid and spacing, patterns, avatar states), applications (brochures, folder, cards, social), templates at desktop and mobile, component states sheet, motion and interaction spec, AI rationale with phase one and phase two, image licence list.
- Notes under one page: reference rationale, interactive proposals with buyer benefit and build cost, "What I would add".

---

## 5. Arguments to put in the notes

1. **Navy versus fresh.** The brief mandates navy dominance and asks for a fresh palette in the same breath. We keep navy as the dark but move its hue toward violet and let the one permitted accent carry surfaces. This is within "tints, shades and one documented supporting accent".
2. **Credibility strip merged into the client wall.** Proof from clients beats self-reported figures for a CIO; the figures sit in the same band so nothing is lost.
3. **Campus diagram on the interior page, not the homepage.** One anchor per block; the homepage shows the configurator, the GCC page shows the campus.
4. **Live prototype over Figma click-through.** Developers get working code and real motion timings.
5. **Reveals are not micro-interactions.** Interactions stay under 300ms; entrances are longer and disabled for reduced motion.
6. **Ideas we drop:** full dark theme as a launch feature (ship the token system now, the toggle in phase two), and the engagement builder as a separate module (the configurator already is one; adding the lead capture makes it the builder).

## 6. "What I would add" (one line each, draft)

- Trust center page with downloadable certificate PDFs and a security questionnaire request, so the evaluator's security review starts without a call.
- Investor results calendar with a live share-price feed and an alerts sign-up, giving the listed-company audience a reason to return.
- Meeting-window finder on the contact page that shows overlapping hours across the three offices and the visitor's time zone.
- Evaluator pack: a one-click download bundling certifications, delivery model, and two case studies as one PDF for RFP shortlists.
- Campus walk-through on the GCC page using licensed photography of Visakhapatnam, since the brief's own imagery rule favours real architecture.
- Accessibility statement page and a visible contrast-check badge, matching the compliance requirement with a visible commitment.

## 7. Open questions for the client

- Microsoft partner tier: the brief says Silver, the supplied badge says Gold.
- Oracle: brief says Gold Partner, supplied badge says Partner.
- CMMI appraisal shows an expiry date already passed on the live site. Renewed?
- Who supplies photography, or should licensed stock be budgeted?
- Circulus benchmark figures for the estimator.

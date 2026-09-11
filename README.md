# Ethan M.C. Smith portfolio

Open `index.html` directly in a modern browser. No installation or build is needed to use the page.

The portfolio header follows [Halo Media](https://halomedia.com/): an open uppercase text row with skewed upward flips, hover descriptions, softened inactive links, and a 90px page drop at 0.97 horizontal scale. The text flip lasts 0.6 seconds and the page motion lasts 1.2 seconds. Below 901px, Menu opens full-screen navigation with Close/Escape dismissal. Keyboard focus reveals descriptions; reduced-motion preferences disable the animation. Section links point to the Software and Film showcases and the base sections reserved for Recognition and Contact. The hero now reads “Creating Meaningful Experiences” / “In Film, Software & Design”, set in Accanthis ADF Std No2 Regular with No3 Italic on “Creating” and “In Film,”. It uses a 1.9-second masked upward entrance and stronger opposing scroll motion (10% desktop and 3% mobile over the first 80% of a viewport). All 13 new Accanthis/Euphorigenic fonts are embedded alongside the existing font families. The space exposed by the header drop is white, matching the light sections, with dark navigation text.

Keep `assets/Ethan Reel Compressed.mp4` and `assets/EthanMCSmith Resume.pdf` beside the HTML: Reel opens the full-quality film in a dismissible player, Résumé opens the PDF, and Contact reveals email and telephone links beneath its header label. The reel loads only when opened. All header styles, scripts, and the reel poster are embedded in the HTML.

The document embeds all layout, styles, animation libraries, custom JavaScript, the original font, still images, and the WebGL ASCII hero's source video (`assets/EthanBTSRed.MP4`). Software screenshots and Film media are linked from local assets. The lower base sections retain their original external links until their content is replaced.

Hero footage supplied by the project owner. The full EthanBTSRed clip is embedded as a 720p, 60 fps H.264 copy, optimized for the muted ASCII hero. The original ASCII shaders and pointer/scroll animation logic are unchanged.

Original design, content, brand assets, and custom effects: [Revelatio Studio](https://revelatio.studio/). This is a reference recreation, assembled from the public landing page and assets. Original library notices are preserved. Analytics and their cookie-consent service were removed from this copy.

## Verification

- Zoom regression checked at 1280 × 720 and 390 × 844 in both scroll directions. Rendered canvas dimensions track the requested dimensions throughout expansion (desktop reaches exactly 1280 × 720 at x=0, rather than shrinking to 666.7px high). The white hover reveal and updated identity description still work. No browser errors or warnings captured.

- Accanthis hero checked at 1440 × 900, 1280 × 720, 390 × 844, and 320 × 740. Both lines fit without horizontal clipping. At desktop size the full headline stays within the viewport during the 90px drop. White reveal, dark descriptions, compact Contact links, opposing text drift, and the existing ASCII zoom were visually verified; no browser errors or warnings were captured.

- Updated header checked at 1440 × 900, 1280 × 720, 390 × 844, and 320 × 740. Verified the hover flip and exact 90px/0.97 page transform, contact reveal and pointer access, section scrolling, mobile menu/Escape dismissal, and reel playback readiness. No horizontal overflow or captured browser errors/warnings. The existing fonts, hero footage, and 19 bundled effect scripts are retained.

- Browser review at 1440 × 900, 694 × 837, and 390 × 844.
- Original recreation baseline: all 11 main section heights matched the reference at 694 × 837 before the portfolio Film replacement.
- All 94 page images decoded successfully; no external stylesheets or scripts remain.
- ASCII hero playback, scroll transitions, mobile navigation and Escape dismissal, project filtering and reset, testimonial navigation, news navigation, and ASCII footer checked.
- No captured browser errors or warnings during verification.
- The final build validates every executable inline script before copying the one-file deliverable to the hosting directory.

Development helpers (`serve.mjs`, `build.mjs`, and `package.json`) are optional and are not required by the HTML file. `pnpm dev` serves the local preview and linked resources, including byte-range video requests; `pnpm build` prepares the document, reel, résumé, all 43 Film showcase assets, and eight Software screenshots (including their nested folders) in `dist`.

The ASCII zoom container has no padding or internal overflow clipping, and its canvas wrapper cannot shrink in the flex layout. This keeps its rendered dimensions equal to the smoothly interpolated dimensions through full viewport expansion. The identity hover detail reads “New York, NY · Film, Software Development & Design”.


## Film showcase

`#film` presents Steel Hearts, The Civilizing Effect, and The Talking Stage in one sticky, continuous horizontal sequence. Every scroll increment drives video expansion or horizontal travel: each film expands immediately over 1.8 viewport heights, then advances to the next over 0.85 viewport heights. There are no composition or viewing holds. The overall timeline is 7.1 viewport heights, followed immediately by the sticky stage’s exit. One berry (`#b20746`) progress bar spans the viewport at its very top. The Film header link lands at the stage start; a keyboard-accessible skip link bypasses the sequence.

Each composition pairs its real thumbnail with one large still window and the same expandable video frame. Stills are drawn from a shuffled pool without repeats until the pool is exhausted, crossfading every 3.8 seconds while the composition is visible. The still window stays above the title area and fades/translates away during expansion. WATCH FILM has a white play triangle; the video frame has no border or hard outline, only a subtle shadow.

Keep the complete `assets/film showcase assets/` folder beside `index.html`: three original MP4 files, three thumbnails, and 37 PNG stills. These files remain linked and are never recompressed. Only the active film starts muted; inactive films pause and mute. Native controls appear on expansion, and sound can also be enabled in the smaller frame. Reduced motion removes the sticky scroll sequence, stacks the projects, freezes each still window, and leaves video playback to the visitor. Reel and Résumé retain their existing behavior.

Film polish verification: desktop 1440 × 900 and mobile 390 × 844. Checked immediate expansion from small scroll inputs, full expansion, both horizontal handoffs, final exit, reverse scrolling, title clearance, the top-edge berry progress bar, one cycling still window, borderless frames, and isolated playback. Sampled the actual render function at 7,100 intervals per viewport: all intervals changed geometry, phase boundaries were continuous, and repeated scroll positions returned identical geometry. A temporary reduced-motion fixture confirmed the normal stack, fixed stills, and visitor-initiated playback. No captured browser errors or warnings. All HTML outside the Film section and its scoped CSS/JS is unchanged by this polish pass.

## Software showcase

`#software` presents Ethan M.C. Smith Portfolio → 496 Gym → Flatline Pest Technology directly on the section’s black page background, with white copy and berry/gold accents. The contained white panel and frosted panes are removed. A soft charcoal radial gradient behind the cards follows [Kusal’s creative library](https://www.kusaludhara.com/), feathering into the black page at the top and bottom; it fades away for the light Limer theme. The webpage cards are borderless and larger, with responsive width caps of 620px on desktop, 570px on tablet, and 320px on mobile. The original screenshots stay uncropped in their 2940 × 1845 proportions, with 8px corners, 5000px perspective, and −45° Y rotation. They enter with a staggered spring and settle into low ascending peeks. “Creative library” uses italic Accanthis and is visible immediately, without an entrance animation or clipping mask. There are no file-name tabs.

All file positions measure upward from the same pocket lip, marked by a 2px charcoal (#303030) edge with a soft recessed shadow. Resting cards sit 24px higher on desktop and 12px higher on mobile (base peeks of 112px and 52px), retaining their ascending steps. Selecting a file raises it vertically, while both inactive files tuck to a shared lower level. The original front-to-back stacking order and perspective tilt stay fixed: the selected file rises behind any files already in front of it, without a z-index promotion. Hover, click/tap, keyboard arrows, Home/End, and Escape retain their controls; leaving or dismissing selection restores “Browse my creative library.” The panel uses `overflow: clip` to prevent keyboard focus from scrolling its contents internally. Reduced motion keeps the file positions and tilt static.

The full page ground, including `html`, `body`, `.page-wrapper`, and `.main-wrapper`, changes from black through the library to white at Limer, then back to black for Film and the lower sections. The section crossing the viewport midpoint controls the theme in either scroll direction. The library inherits the shared page ground. The black ASCII hero and white header-drop reveal keep their fixed colors. The Film stage, panels, and “Selected films” masthead now share the page theme, including the white approach from Limer and the black return at Film. Film thumbnails/key art stay visible in either theme, including while Limer is active; their existing fade during video expansion is retained. The vignette follows the dark theme. There is no divider before Limer.

Limer pairs a scroll-revealed CSS iPhone frame with project information. Five local screenshots cycle every 3.2 seconds: Bonfire / Home → Explore → Events → Chat → Profile. Visitors can swipe, use the arrows or screen selectors, or pause automatic cycling. Hovering the phone screen, keyboard focus, leaving the viewport, and backgrounding the page pause cycling. Visibility detection uses the stationary stage and an IntersectionObserver. Reduced motion disables the phone entrance and automatic swiping, retaining manual screen controls.

Keep `assets/software showcase assets/` beside the HTML, including all nested project folders. The eight original PNGs remain linked and are copied without recompression. The server and build support their encoded spaces and original filenames.

Earlier Software validation covered Limer autoplay, manual controls, hover pause, and a reduced-motion fixture. The cabinet/theme correction below supersedes that pass’s layout and theme behavior.

Cabinet/theme correction verification: at 1440 × 900 and 390 × 844, checked the white panel on black, low resting peeks, all project selections, shared inactive heights, keyboard switching, dismissal, and zero horizontal overflow. Desktop inactive peeks measure about 91px above the lip; mobile peeks measure about 42px. Selected screenshots remain fully inside the pocket, and keyboard navigation leaves panel scrollTop at zero. Verified page-wide white at Limer and black at Film in forward/reverse scroll. The build validates all 27 inline scripts; all 96 embedded data assets and existing Film, navigation, and hero scripts are unchanged by this pass.

Selection correction: cards now retain their original stacking order and perspective tilt; selection changes only their vertical position. The production build validates all inline scripts.

September 9 library refinement: the default library heading and subtext sit lower while selected project information retains its position. The italic title now renders without a clipping mask or an intro animation. The contact heading uses smaller responsive type to fit one line; “meaningful.” remains italic and is now white. Build and source checks confirm the existing embedded assets and all linked Film assets are preserved. Earlier white-panel validation describes the previous design.

## Production publishing

The live portfolio at https://ethanmcsmith.com/ is published from the `main` branch of `ethanmcsmith/ethan-portfolio` using the existing GitHub Pages custom domain. Run `pnpm build:github-pages` to validate the embedded scripts and prepare `dist-github-pages/`, then publish its contents at the repository root. Preserve `CNAME` and `.nojekyll`.

The single HTML file keeps its embedded fonts and ASCII hero video. Film stills, thumbnails, Software screenshots, and the résumé remain linked local assets. On public hosts, the three original films and reel stream from the portfolio’s existing public Cloudflare R2 bucket; localhost and file previews retain the original local MP4 paths. Full file checksums of all four hosted videos were verified against the local originals before publishing. No film was recompressed. The MP4 files exceed normal GitHub file limits and are not committed to the public repository. Local full-media previews require those original files beside the HTML; the GitHub Pages build omits them intentionally.

September 10 update: website card ratios match the newly cropped 2940 × 1845 screenshots. The smaller height allows slightly wider cards while preserving the pocket peeks and stacking. Film stills preload before the showcase, limit simultaneous downloads to two, prepare the next active-film still, and only crossfade fully decoded image elements. The original PNGs and films remain unchanged. The testimonials now contain the full Keon Mollineau and Michael Yeeloy quotations and their linked portraits, with manual navigation and a content-sized layout. Both preview and production builds include the portraits.

Latest refinements: the production build fingerprints website screenshot filenames by SHA-256 content so new crops receive new cache URLs. Local previews retain original filenames. The pocket brim follows the global theme with a #111214 dark edge and #e9e8e5 light edge, each with a recessed shadow. Header hover details are berry. Testimonials advance after their individual reading time (200 words/minute plus three seconds), pause on hover/focus or when hidden, and remain manual for reduced motion. The contact heading now uses clamp(16px,3.7vw,56px).

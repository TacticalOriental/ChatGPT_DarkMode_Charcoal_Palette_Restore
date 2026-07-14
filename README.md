# ChatGPT Dark Mode Charcoal Palette Restore

Restores ChatGPT’s original charcoal dark palette with a matched composer, canvas, sidebar, message bubbles, code blocks, and bottom dock.

This userscript is for people who prefer the original, more visually separated ChatGPT interface instead of the flatter, lighter dark theme.

## What it fixes

- Restores the original charcoal main canvas
- Matches the composer/input bar to the original official-style surface
- Keeps the sidebar properly separated
- Restores readable lifted message bubbles
- Restores contrast for code and copy blocks
- Removes the pure-black header capsules introduced by newer UI changes
- Cleans up the bottom dock and disclaimer halo
- Preserves light mode
- Avoids broad DOM repainting that causes blocky UI artifacts

## Preview

### Before — Home Page

![Default dark mode home page](screenshots/Default_Dark_Mode-Home.png)

### After — Home Page

![Restored charcoal dark mode home page](screenshots/Fixed_Dark_Mode-Home.png)

### Before — Chat Page

![Default dark mode chat page](screenshots/Default_Dark_Mode-In_Session.png)

### After — Chat Page

![Restored charcoal dark mode chat page](screenshots/Fixed_Dark_Mode-In_Session.png)

### Light Mode Unaffected

![Light mode unaffected](screenshots/Light_Mode_Unaffected.png)

## Install

### Option 1: Install from Greasy Fork

[Install ChatGPT Dark Mode Charcoal Palette Restore](https://greasyfork.org/en/scripts/583978-chatgpt-dark-mode-charcoal-palette-restore)

### Option 2: Install manually from GitHub

1. Install a userscript manager:

   - Tampermonkey
   - Violentmonkey

2. Open the script file in this repository:

   ```text
   ChatGPT_DarkMode_Charcoal_Palette_Restore.user.js
   ```

3. Click **Raw**.

4. Your userscript manager should detect the script and offer to install it.

5. Open ChatGPT and enable dark mode.

## Supported sites

```text
https://chatgpt.com/*
https://chat.openai.com/*
```

## Browser support

Tested with:

```text
Chrome + Tampermonkey
```

It should also work with other Chromium-based browsers and Violentmonkey, but Chrome with Tampermonkey is the primary tested configuration.

## Privacy

This script does not collect data.

It does not:

- read or store your conversations
- send network requests
- access external servers
- modify ChatGPT functionality
- track usage
- use analytics

It only applies local visual styling to ChatGPT pages.

## How it works

Version 2.1 uses ChatGPT’s current semantic UI hooks and internal design tokens instead of repeatedly scanning or repainting the page.

1. **Theme variable overrides**  
   Restores the charcoal canvas, darker sidebar, lifted message surfaces, and composer colors through ChatGPT’s own design tokens.

2. **Semantic UI targeting**  
   Uses current elements such as the composer surface, page header, conversation actions, thread footer, and disclaimer rather than fragile geometry detection.

3. **Independent code-block contrast**  
   Overrides the local code-block surface token so code and copy cards remain visually raised without changing the darker composer.

4. **Dark-mode-only CSS**  
   Every visual rule is scoped under `html.dark`, so light mode remains untouched.

The script uses one persistent stylesheet. It does not use MutationObservers, recurring DOM scans, or repaint intervals.

## Why this exists

Recent ChatGPT UI changes made dark mode feel flatter and less visually separated. This script restores the original charcoal palette while keeping the interface clean and usable.

## Troubleshooting

### The script does nothing

Check that:

- your userscript manager is enabled
- the script itself is enabled
- ChatGPT is set to dark mode
- the site match includes `chatgpt.com`
- your browser allows the userscript manager to run on ChatGPT

### Light mode looks wrong

Version 2.1 applies all visual rules only under `html.dark` and should not affect light mode.

Disable older copies or beta versions of the script, make sure only the current release is enabled, and hard-refresh the page.

### ChatGPT updates broke the style

ChatGPT’s interface changes frequently. If the layout changes and the script breaks, open an issue and include:

- browser
- userscript manager
- screenshot
- what changed
- whether it happens on the home page, chat page, or both

## Development notes

```text
Do:
- prefer ChatGPT design tokens
- use semantic IDs, attributes, and test hooks
- keep code-block and composer surfaces independent
- scope every visual override to html.dark

Avoid:
- geometry-based DOM scanning
- recurring repaint intervals
- broad main, form, or textarea overrides
- manual code-block wrapper traversal
- MutationObserver repaint loops
```

## License

MIT License.

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by OpenAI.

ChatGPT is a product of OpenAI. This is an independent visual userscript.

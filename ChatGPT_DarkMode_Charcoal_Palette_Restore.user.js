// ==UserScript==
// @name         ChatGPT Dark Mode Charcoal Palette Restore
// @namespace    https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore
// @version      2.1.0
// @description  Restores ChatGPT's charcoal dark mode palette using current semantic UI hooks, without DOM scanning or repaint loops.
// @author       TacticalOriental
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        none
// @supportURL   https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore/issues
// @homepageURL  https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'chatgpt-charcoal-palette-restore-v2-1';

  const css = `
    /* ---------------------------------------------------------
       Core charcoal palette
       --------------------------------------------------------- */
    html.dark {
      --bg-primary: #212121 !important;
      --main-surface-primary: #212121 !important;
      --main-surface-secondary: #303030 !important;
      --main-surface-tertiary: #383838 !important;

      --bg-secondary-surface: #212121 !important;
      --bg-elevated-secondary: #303030 !important;

      --sidebar-surface-primary: #181818 !important;
      --sidebar-surface-secondary: #212121 !important;
      --sidebar-surface-tertiary: #303030 !important;

      --message-surface: #303030 !important;

      /* Old and current composer token names. */
      --composer-surface: #181818 !important;
      --composer-surface-primary: #181818 !important;

      --border-light: #303030 !important;
      --border-medium: #424242 !important;
    }

    /* Main conversation canvas. */
    html.dark,
    html.dark body,
    html.dark body > div:first-child,
    html.dark #main,
    html.dark #thread {
      background: #212121 !important;
      background-color: #212121 !important;
    }

    /* Sidebar stays darker than the canvas. */
    html.dark #stage-slideover-sidebar,
    html.dark #stage-slideover-sidebar > div {
      background-color: #181818 !important;
    }

    /* ---------------------------------------------------------
       Current composer: exact semantic hook, no geometry scan
       --------------------------------------------------------- */
    html.dark [data-composer-surface="true"] {
      --composer-surface-primary: #181818 !important;
      background: #181818 !important;
      background-color: #181818 !important;
    }

    /* ---------------------------------------------------------
       Code/copy cards: raised contrast independent of composer
       --------------------------------------------------------- */
    html.dark pre
      [class*="bg-(--code-block-surface)"][class*="overflow-clip"] {
      --code-block-surface: #303030 !important;
      background-color: #303030 !important;
    }

    /* ---------------------------------------------------------
       Header: remove new pure-black translucent capsules
       --------------------------------------------------------- */
    html.dark #page-header .translucent-surface,
    html.dark #page-header .translucent-surface::before,
    html.dark #page-header .translucent-surface::after {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }

    /* Project title blends into the canvas until hovered/focused. */
    html.dark #page-header
      a[aria-label^="Open "][aria-label$=" project"] {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    html.dark #page-header
      a[aria-label^="Open "][aria-label$=" project"]:hover,
    html.dark #page-header
      a[aria-label^="Open "][aria-label$=" project"]:focus-visible {
      background: #303030 !important;
      background-color: #303030 !important;
    }

    /* Share and overflow actions also blend in at rest. */
    html.dark #conversation-header-actions
      [data-testid="share-chat-button"],
    html.dark #conversation-header-actions
      [data-testid="conversation-options-button"] {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    html.dark #conversation-header-actions
      [data-testid="share-chat-button"]:hover,
    html.dark #conversation-header-actions
      [data-testid="share-chat-button"]:focus-visible,
    html.dark #conversation-header-actions
      [data-testid="conversation-options-button"]:hover,
    html.dark #conversation-header-actions
      [data-testid="conversation-options-button"]:focus-visible {
      background: #303030 !important;
      background-color: #303030 !important;
    }

    /* ---------------------------------------------------------
       Bottom dock and warning: exact current containers
       --------------------------------------------------------- */
    html.dark #thread-bottom-container,
    html.dark #thread-bottom-container::before,
    html.dark #thread-bottom-container::after {
      background: #212121 !important;
      background-color: #212121 !important;
      background-image: none !important;
      box-shadow: none !important;

      --tw-gradient-from: #212121 !important;
      --tw-gradient-via: #212121 !important;
      --tw-gradient-to: #212121 !important;
      --tw-gradient-stops: #212121, #212121 !important;
    }

    /* Keep the warning text; remove only its new pill and halo. */
    html.dark [data-testid="thread-disclaimer"] .rounded-full {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
    }
  `;

  function installStyle() {
    const previous = document.getElementById(STYLE_ID);
    if (previous) previous.remove();

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;

    const target = document.head || document.documentElement;

    if (target) {
      target.appendChild(style);
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          (document.head || document.documentElement).appendChild(style);
        },
        { once: true }
      );
    }
  }

  installStyle();
})();

// ==UserScript==
// @name         ChatGPT Dark Mode Charcoal Palette Restore
// @namespace    https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore
// @version      3.1.0
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

  const STYLE_ID = 'chatgpt-charcoal-palette-restore-v3-1-0';
  const css = String.raw;

  const stylesheet = css`
    /* ---------------------------------------------------------
       Script-owned charcoal palette
       --------------------------------------------------------- */
    html.dark {
      --charcoal-sidebar: #181818;

      --charcoal-canvas-rgb: 33, 33, 33;
      --charcoal-canvas: rgb(var(--charcoal-canvas-rgb));
      --charcoal-canvas-transparent: rgba(
        var(--charcoal-canvas-rgb),
        0
      );

      --charcoal-raised: #303030;
      --charcoal-hover: #383838;
      --charcoal-border: #424242;

      /* ChatGPT semantic token mapping. */
      --bg-primary: var(--charcoal-canvas) !important;

      --main-surface-primary: var(--charcoal-canvas) !important;
      --main-surface-secondary: var(--charcoal-raised) !important;
      --main-surface-tertiary: var(--charcoal-hover) !important;

      --bg-secondary-surface: var(--charcoal-canvas) !important;
      --bg-elevated-secondary: var(--charcoal-raised) !important;

      --sidebar-surface-primary: var(--charcoal-sidebar) !important;
      --sidebar-surface-secondary: var(--charcoal-canvas) !important;
      --sidebar-surface-tertiary: var(--charcoal-raised) !important;

      --message-surface: var(--charcoal-raised) !important;

      /* Old and current composer token names. */
      --composer-surface: var(--charcoal-sidebar) !important;
      --composer-surface-primary: var(--charcoal-sidebar) !important;

      --border-light: var(--charcoal-raised) !important;
      --border-medium: var(--charcoal-border) !important;
    }

    /* Main conversation canvas. */
    html.dark,
    html.dark body,
    html.dark body > div:first-child,
    html.dark #main,
    html.dark #thread {
      background: var(--charcoal-canvas) !important;
      background-color: var(--charcoal-canvas) !important;
    }

    /* Sidebar stays darker than the canvas. */
    html.dark #stage-slideover-sidebar,
    html.dark #stage-slideover-sidebar > div {
      background-color: var(--charcoal-sidebar) !important;
    }

    /* ---------------------------------------------------------
       Current composer: exact semantic hook, no geometry scan
       --------------------------------------------------------- */
    html.dark [data-composer-surface='true'] {
      --composer-surface-primary: var(--charcoal-sidebar) !important;

      background: var(--charcoal-sidebar) !important;
      background-color: var(--charcoal-sidebar) !important;
    }

    /* ---------------------------------------------------------
       Code/copy cards: raised contrast independent of composer
       --------------------------------------------------------- */
    html.dark
      pre
      [class*='bg-(--code-block-surface)'][class*='overflow-clip'] {
      --code-block-surface: var(--charcoal-raised) !important;

      background-color: var(--charcoal-raised) !important;
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
    html.dark
      #page-header
      a[aria-label^='Open '][aria-label$=' project'] {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    html.dark
      #page-header
      a[aria-label^='Open '][aria-label$=' project']:hover,
    html.dark
      #page-header
      a[aria-label^='Open '][aria-label$=' project']:focus-visible {
      background: var(--charcoal-raised) !important;
      background-color: var(--charcoal-raised) !important;
    }

    /* Share and overflow actions also blend in at rest. */
    html.dark
      #conversation-header-actions
      [data-testid='share-chat-button'],
    html.dark
      #conversation-header-actions
      [data-testid='conversation-options-button'] {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    html.dark
      #conversation-header-actions
      [data-testid='share-chat-button']:hover,
    html.dark
      #conversation-header-actions
      [data-testid='share-chat-button']:focus-visible,
    html.dark
      #conversation-header-actions
      [data-testid='conversation-options-button']:hover,
    html.dark
      #conversation-header-actions
      [data-testid='conversation-options-button']:focus-visible {
      background: var(--charcoal-raised) !important;
      background-color: var(--charcoal-raised) !important;
    }

    /* ---------------------------------------------------------
       Bottom dock and warning: exact current containers
       --------------------------------------------------------- */
    html.dark #thread-bottom-container,
    html.dark #thread-bottom-container::before,
    html.dark #thread-bottom-container::after {
      background: var(--charcoal-canvas) !important;
      background-color: var(--charcoal-canvas) !important;
      background-image: none !important;
      box-shadow: none !important;

      --tw-gradient-from: var(--charcoal-canvas) !important;
      --tw-gradient-via: var(--charcoal-canvas) !important;
      --tw-gradient-to: var(--charcoal-canvas) !important;
      --tw-gradient-stops:
        var(--charcoal-canvas),
        var(--charcoal-canvas) !important;
    }

    /* Keep the warning text; remove only its new pill and halo. */
    html.dark [data-testid='thread-disclaimer'] .rounded-full {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
    }

    /* ---------------------------------------------------------
       Project-home sticky header fade
       --------------------------------------------------------- */
    html.dark
      [class~='group/page-table-scroll']
      [class~='content-fade-top']::after {
      background-color: transparent !important;
      background-image:
        linear-gradient(
          to top,
          var(--charcoal-canvas-transparent),
          var(--charcoal-canvas)
        ),
        linear-gradient(
          to top,
          var(--charcoal-canvas-transparent) 25px,
          var(--charcoal-canvas) 25px
        ) !important;
    }
  `;

  function installStyle() {
    const previous = document.getElementById(STYLE_ID);

    if (previous) {
      previous.remove();
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = stylesheet;

    const target = document.head || document.documentElement;

    if (target) {
      target.appendChild(style);
      return;
    }

    document.addEventListener(
      'DOMContentLoaded',
      () => {
        (document.head || document.documentElement).appendChild(style);
      },
      { once: true }
    );
  }

  installStyle();
})();

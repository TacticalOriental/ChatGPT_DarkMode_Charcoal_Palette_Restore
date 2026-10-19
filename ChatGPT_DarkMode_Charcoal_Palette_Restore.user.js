// ==UserScript==
// @name         ChatGPT Dark Mode Charcoal Palette Restore
// @namespace    https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore
// @version      4.0.4
// @description  Restores ChatGPT's charcoal dark mode palette using current semantic UI tokens and hooks, without DOM scanning or repaint loops.
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

  const STYLE_ID = 'chatgpt-charcoal-palette-restore';
  const css = String.raw;

  const stylesheet = css`
    /* ---------------------------------------------------------
       Script-owned charcoal palette
       --------------------------------------------------------- */
    :root {
      --charcoal-sidebar: #181818;
      --charcoal-canvas: #212121;
      --charcoal-raised: #303030;
    }

    /* Honor the native explicit-dark seed until its bootstrap resolves. */
    html[data-theme='dark'],
    html[data-appearance-theme='dark']:not([data-theme]) {
      color-scheme: dark;

      /* -------------------------------------------------------
         Current ChatGPT semantic surface mapping
         ------------------------------------------------------- */

      /* Main application / conversation canvas. */
      --chat-background-color: var(--charcoal-canvas) !important;

      --app-color-background-surface: var(--charcoal-canvas) !important;
      --app-color-background-surface-under:
        var(--charcoal-canvas) !important;

      --color-surface: var(--charcoal-canvas) !important;
      --color-surface-secondary: var(--charcoal-canvas) !important;
      --color-surface-recovery: var(--charcoal-canvas) !important;

      --color-token-bg-primary: var(--charcoal-canvas) !important;
      --color-token-main-surface-primary:
        var(--charcoal-canvas) !important;

      /* Sidebar. */
      --color-token-side-bar-background:
        var(--charcoal-sidebar) !important;

      /* Composer. */
      --composer-background-color:
        var(--charcoal-sidebar) !important;

      /* User messages. */
      --user-message-background-color:
        var(--charcoal-raised) !important;
      --color-background-user-message:
        var(--charcoal-raised) !important;
      --color-background-user-message-compact:
        var(--charcoal-raised) !important;

      /* Code blocks. */
      --codeblock-background-color:
        var(--charcoal-raised) !important;
      --color-token-text-code-block-background:
        var(--charcoal-raised) !important;
    }

    /* ---------------------------------------------------------
       Base application surfaces
       --------------------------------------------------------- */
    html[data-appearance-theme='dark']:not([data-theme]),
    html[data-theme='dark'],
    html[data-theme='dark'] body,
    html[data-theme='dark'] #root {
      background: var(--charcoal-canvas) !important;
    }

    /* Native system mode follows the OS only while unresolved.
       An explicit light preference or resolved theme always wins. */
    @media (prefers-color-scheme: dark) {
      html:not([data-theme]):not([data-appearance-theme='light']) {
        color-scheme: dark;
        background: var(--charcoal-canvas) !important;
      }
    }

    /* ---------------------------------------------------------
       Sidebar
       --------------------------------------------------------- */
    html[data-theme='dark'] #app-shell-sidebar {
      --color-surface: var(--charcoal-sidebar) !important;
      --color-surface-secondary: var(--charcoal-sidebar) !important;

      background-color: var(--charcoal-sidebar) !important;
    }

    /* ---------------------------------------------------------
       Composer

       Standard conversation:
       root owns the rounded surface.

       Project home:
       root is layout-only; body owns the rounded surface.
       --------------------------------------------------------- */
    html[data-theme='dark']
      [data-composer-dark][data-composer-utility-bar-variant='default'] {
      background-color: var(--charcoal-sidebar) !important;
    }

    html[data-theme='dark']
      [data-composer-dark][data-composer-utility-bar-variant='home'] {
      background-color: transparent !important;
    }

    html[data-theme='dark']
      [data-composer-dark][data-composer-utility-bar-variant='home']
      [data-composer-body] {
      background-color: var(--charcoal-sidebar) !important;
    }

    /* ---------------------------------------------------------
       Rich-response surfaces

       The response renderer resets its own theme tokens. Restore
       secondary cards below that boundary. Leave individual
       backgrounds and the other native surface tokens alone.
       --------------------------------------------------------- */
    html[data-theme='dark'] [data-dil-message-id] {
      --color-surface-secondary: var(--charcoal-raised);
    }

    /* ---------------------------------------------------------
       Settings panels

       The named settings group owns the shared panel surface.
       Keep its token local so controls, previews, and other pages
       retain their own backgrounds.
       --------------------------------------------------------- */
    html[data-theme='dark'] [class~='group/settings'] {
      --color-background-panel: var(--charcoal-raised);
    }

    /* ---------------------------------------------------------
       User-message surface
       --------------------------------------------------------- */
    html[data-theme='dark'] [data-user-message-bubble='true'] {
      background-color: var(--charcoal-raised) !important;
    }

    /* ---------------------------------------------------------
       Code blocks
       --------------------------------------------------------- */
    html[data-theme='dark']
      [data-markdown-copy='code-block'][data-theme='dark'] {
      background-color: var(--charcoal-raised) !important;
    }
  `;

  function installStyle() {
    const target = document.head || document.documentElement;

    if (!target) {
      // Wait only for the root, not for network-dependent DOMContentLoaded.
      // Disconnect before inserting the stylesheet; no repaint observer remains.
      const observer = new MutationObserver(() => {
        if (document.documentElement) {
          observer.disconnect();
          installStyle();
        }
      });
      observer.observe(document, { childList: true });
      return;
    }

    // Keep one owner across reinjection; migrate the published v4.0.0 ID.
    for (const id of [STYLE_ID, 'chatgpt-charcoal-palette-restore-v4-0-0']) {
      const previous = document.getElementById(id);
      if (previous) {
        previous.remove();
      }
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = stylesheet;
    target.appendChild(style);
  }

  installStyle();
})();

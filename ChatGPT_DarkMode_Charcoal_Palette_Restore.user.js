// ==UserScript==
// @name         ChatGPT DarkMode Charcoal Palette Restore
// @namespace    https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore
// @version      2.0.0
// @description  Restores ChatGPT’s DarkMode Charcoal Palette with a Matched Composer, Canvas, Sidebar, Message Bubbles, and Bottom Dock Cleanup.
// @author       TacticalOriental
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-end
// @grant        none
// @supportURL   https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore/issues
// @homepageURL  https://github.com/TacticalOriental/ChatGPT_DarkMode_Charcoal_Palette_Restore
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'chatgpt-official-dark-final-style';

  const C = {
    canvas: '#212121',
    sidebar: '#181818',
    composer: '#181818',
    raised: '#303030',
    raised2: '#383838',
    border: '#424242'
  };

  /*
    Track inline styles we modify so light mode can be restored cleanly.
  */
  const touched = new Map();

  function isDarkMode() {
    return document.documentElement.classList.contains('dark');
  }

  function remember(el, prop) {
    if (!el) return;

    if (!touched.has(el)) {
      touched.set(el, new Map());
    }

    const props = touched.get(el);

    if (!props.has(prop)) {
      props.set(prop, {
        value: el.style.getPropertyValue(prop),
        priority: el.style.getPropertyPriority(prop)
      });
    }
  }

  function setImportant(el, prop, value) {
    if (!el) return;

    remember(el, prop);
    el.style.setProperty(prop, value, 'important');
  }

  function restoreTouchedStyles() {
    for (const [el, props] of touched.entries()) {
      if (!el || !el.style) continue;

      for (const [prop, old] of props.entries()) {
        if (old.value) {
          el.style.setProperty(prop, old.value, old.priority || '');
        } else {
          el.style.removeProperty(prop);
        }
      }
    }

    touched.clear();
  }

  const css = `
    html.dark,
    .dark.dark {
      --bg-primary: ${C.canvas} !important;
      --main-surface-primary: ${C.canvas} !important;

      /* User message bubbles / lifted surfaces */
      --message-surface: ${C.raised} !important;

      /* Lifted blocks, cards, code wrappers when ChatGPT uses its own tokens */
      --main-surface-secondary: ${C.raised} !important;
      --main-surface-tertiary: ${C.raised2} !important;

      --bg-secondary-surface: ${C.canvas} !important;
      --bg-elevated-secondary: ${C.raised} !important;

      --sidebar-surface-primary: ${C.sidebar} !important;
      --sidebar-surface-secondary: ${C.canvas} !important;
      --sidebar-surface-tertiary: ${C.raised} !important;

      --composer-surface: ${C.composer} !important;

      --border-light: ${C.raised} !important;
      --border-medium: ${C.border} !important;
    }

    /* Main canvas only */
    html.dark,
    html.dark body,
    html.dark body > div:first-child,
    html.dark main,
    html.dark [role="main"],
    html.dark main > div:first-child {
      background-color: ${C.canvas} !important;
    }
  `;

  function injectBaseStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;

    document.head.appendChild(style);
  }

  function paint(el, color) {
    if (!el || !isDarkMode()) return;

    setImportant(el, 'background-color', color);
    setImportant(el, 'background', color);
  }

  function killGradient(el, color) {
    if (!el || !isDarkMode()) return;

    paint(el, color);

    setImportant(el, 'background-image', 'none');
    setImportant(el, 'box-shadow', 'none');

    setImportant(el, '--tw-gradient-from', color);
    setImportant(el, '--tw-gradient-via', color);
    setImportant(el, '--tw-gradient-to', color);
    setImportant(el, '--tw-gradient-stops', `${color}, ${color}`);
  }

  function findPromptBox() {
    return (
      document.querySelector('#prompt-textarea') ||
      document.querySelector('[contenteditable="true"][data-lexical-editor="true"]') ||
      document.querySelector('[contenteditable="true"]')
    );
  }

  function findComposerPill() {
    const textarea = findPromptBox();
    if (!textarea) return null;

    let el = textarea;

    for (let i = 0; i < 12 && el; i++, el = el.parentElement) {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);

      const widthOK = rect.width > 400;
      const heightOK = rect.height >= 40 && rect.height <= 130;
      const radius = parseFloat(style.borderRadius) || 0;
      const roundedOK = radius >= 16;

      if (widthOK && heightOK && roundedOK) {
        return el;
      }
    }

    return null;
  }

  function fixComposerAndFooter() {
    if (!isDarkMode()) return;

    const pill = findComposerPill();
    if (!pill) return;

    // Keep the actual input pill correct.
    paint(pill, C.composer);

    const pillRect = pill.getBoundingClientRect();
    const seen = new Set();

    function neutralizeBottomLayer(el) {
      if (!el || seen.has(el)) return;
      seen.add(el);

      if (el === pill || pill.contains(el)) return;
      if (el === document.body || el === document.documentElement) return;

      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;

      const verticallyNearComposer =
        r.top <= pillRect.bottom + 100 &&
        r.bottom >= pillRect.top - 140;

      const footerSized =
        r.height >= pillRect.height &&
        r.height <= Math.max(300, pillRect.height + 220);

      const wideEnough =
        r.width >= pillRect.width + 80 ||
        (r.left <= pillRect.left - 40 && r.right >= pillRect.right + 40);

      const notWholePage =
        r.height <= window.innerHeight * 0.45;

      if (!(verticallyNearComposer && footerSized && wideEnough && notWholePage)) {
        return;
      }

      const style = getComputedStyle(el);
      const bg = style.backgroundColor || '';
      const bgImage = style.backgroundImage || '';
      const shadow = style.boxShadow || '';

      const looksLikeBlackFooter =
        bg.includes('0, 0, 0') ||
        bgImage.includes('0, 0, 0') ||
        bgImage.includes('black') ||
        bgImage.includes('gradient') ||
        shadow.includes('0, 0, 0');

      if (!looksLikeBlackFooter) return;

      killGradient(el, C.canvas);
    }

    let el = pill.parentElement;

    for (let i = 0; i < 22 && el && el !== document.body; i++, el = el.parentElement) {
      neutralizeBottomLayer(el);

      const parent = el.parentElement;

      if (parent) {
        Array.from(parent.children).forEach((sib) => {
          neutralizeBottomLayer(sib);
        });
      }
    }

    // Re-assert composer after touching footer wrappers.
    paint(pill, C.composer);
  }

  function fixStaticBottomStrip() {
    if (!isDarkMode()) return;

    const pill = findComposerPill();
    if (!pill) return;

    const pillRect = pill.getBoundingClientRect();

    const samplePoints = [
      [Math.max(260, pillRect.left - 120), window.innerHeight - 18],
      [pillRect.left + pillRect.width / 2, window.innerHeight - 18],
      [Math.min(window.innerWidth - 30, pillRect.right + 120), window.innerHeight - 18],

      [Math.max(260, pillRect.left - 120), window.innerHeight - 42],
      [pillRect.left + pillRect.width / 2, window.innerHeight - 42],
      [Math.min(window.innerWidth - 30, pillRect.right + 120), window.innerHeight - 42]
    ];

    const seen = new Set();

    function patch(el) {
      if (!el || seen.has(el)) return;
      seen.add(el);

      if (el === document.documentElement || el === document.body) return;
      if (el === pill || pill.contains(el)) return;

      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;

      const style = getComputedStyle(el);

      const touchesViewportBottom =
        r.bottom >= window.innerHeight - 2;

      const bottomDockSized =
        r.height >= 20 &&
        r.height <= 180;

      const wideDock =
        r.width >= pillRect.width * 0.9;

      const bg = style.backgroundColor || '';
      const bgImage = style.backgroundImage || '';
      const shadow = style.boxShadow || '';

      const blackish =
        bg.includes('0, 0, 0') ||
        bgImage.includes('0, 0, 0') ||
        bgImage.includes('black') ||
        bgImage.includes('gradient') ||
        shadow.includes('0, 0, 0');

      if (
        touchesViewportBottom &&
        bottomDockSized &&
        wideDock &&
        blackish
      ) {
        setImportant(el, 'background-color', C.canvas);
        setImportant(el, 'background-image', 'none');
        setImportant(el, 'box-shadow', 'none');

        setImportant(el, '--tw-gradient-from', C.canvas);
        setImportant(el, '--tw-gradient-via', C.canvas);
        setImportant(el, '--tw-gradient-to', C.canvas);
        setImportant(el, '--tw-gradient-stops', `${C.canvas}, ${C.canvas}`);
      }
    }

    for (const [x, y] of samplePoints) {
      const safeX = Math.max(1, Math.min(window.innerWidth - 2, x));
      const safeY = Math.max(1, Math.min(window.innerHeight - 2, y));

      document.elementsFromPoint(safeX, safeY).forEach((el) => {
        patch(el);

        // One parent level only. Narrow enough to avoid broad DOM damage.
        if (el.parentElement) patch(el.parentElement);
      });
    }

    // Re-assert actual composer after bottom-strip cleanup.
    paint(pill, C.composer);
  }

  function run() {
    injectBaseStyle();

    if (!isDarkMode()) {
      restoreTouchedStyles();
      return;
    }

    fixComposerAndFooter();
    fixStaticBottomStrip();
  }

  run();

  setTimeout(run, 300);
  setTimeout(run, 1000);
  setTimeout(run, 2500);

  setInterval(run, 1200);
})();
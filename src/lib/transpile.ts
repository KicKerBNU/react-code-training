import { transform } from 'sucrase'

const PRELUDE = `
const { useState, useEffect, useMemo, useCallback, useRef, useContext, useReducer, useId, useLayoutEffect, createContext, Fragment, Component, StrictMode } = React;
const { createRoot } = ReactDOM;

function create(initializer) {
  let state;
  const listeners = new Set();
  const setState = (partial) => {
    const next = typeof partial === 'function' ? partial(state) : partial;
    state = Object.assign({}, state, next);
    listeners.forEach((listener) => listener());
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  state = initializer(setState, getState);
  function useStore(selector) {
    const pick = typeof selector === 'function' ? selector : (current) => current;
    const [, force] = React.useState(0);
    React.useEffect(() => subscribe(() => force((n) => n + 1)), []);
    return pick(state);
  }
  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = subscribe;
  return useStore;
}
`

export function transpileReactSource(source: string): { code: string; error?: string } {
  try {
    const stripped = source
      .replace(/import(?:\s+type)?\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?/g, '')
      .replace(/import\s+['"][^'"]+['"]\s*;?/g, '')
      .replace(/\bexport\s+default\s+/g, '')
      .replace(/\bexport\s+/g, '')

    const { code } = transform(stripped, {
      transforms: ['typescript', 'jsx'],
      jsxRuntime: 'classic',
      production: false,
    })

    return { code: `${PRELUDE}\n${code}` }
  } catch (error) {
    return {
      code: '',
      error: error instanceof Error ? error.message : 'Could not transpile this file',
    }
  }
}

export function transpileAlgoSource(source: string): { code: string; error?: string } {
  try {
    const cleaned = source
      .replace(/console\.log\s*\(\s*\w+\s*\(\s*readline\s*\(\s*\)\s*\)\s*\)\s*;?/g, '')
      .replace(/import(?:\s+type)?\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?/g, '')
      .replace(/\bexport\s+/g, '')

    const { code } = transform(cleaned, {
      transforms: ['typescript'],
      production: false,
    })

    return { code }
  } catch (error) {
    return {
      code: '',
      error: error instanceof Error ? error.message : 'Could not transpile this file',
    }
  }
}

export function buildPreviewDocument(transpiled: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; padding: 0; background: #fff; color: #111; }
      body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; padding: 16px; }
      button, input, select, textarea { font: inherit; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="/vendor/react.development.js"><\/script>
    <script src="/vendor/react-dom.development.js"><\/script>
    <script>
      window.onerror = function (message) {
        window.parent.postMessage({ type: 'preview-error', message: String(message) }, '*');
      };
      try {
        ${transpiled}
        window.parent.postMessage({ type: 'preview-ready' }, '*');
      } catch (error) {
        window.parent.postMessage({ type: 'preview-error', message: String(error && error.message ? error.message : error) }, '*');
      }
    <\/script>
  </body>
</html>`
}

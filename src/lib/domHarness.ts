import type { DomHarness } from '../types'

export function wait(ms = 40): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createHarness(win: Window & typeof globalThis, doc: Document): DomHarness {
  return {
    document: doc,
    window: win,
    wait,
    async click(el, label) {
      if (!el) throw new Error(`Could not find ${label}`)
      el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }))
      const form =
        'form' in el && (el as HTMLButtonElement).form
          ? (el as HTMLButtonElement).form
          : el.closest('form')
      const type = 'type' in el ? String((el as HTMLButtonElement).type) : ''
      const submitsTheForm =
        !!form &&
        (type === 'submit' ||
          el.id === 'submit' ||
          (el.tagName === 'BUTTON' && type !== 'button' && type !== 'reset'))
      if (submitsTheForm && form) {
        form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }))
      }
      await wait()
    },
    async setValue(el, value, label) {
      if (!el) throw new Error(`Could not find ${label}`)
      const proto =
        el instanceof win.HTMLSelectElement
          ? win.HTMLSelectElement.prototype
          : el instanceof win.HTMLTextAreaElement
            ? win.HTMLTextAreaElement.prototype
            : win.HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
      setter?.call(el, value)
      el.dispatchEvent(new win.Event('input', { bubbles: true }))
      el.dispatchEvent(new win.Event('change', { bubbles: true }))
      await wait()
    },
    async submitForm(form, label) {
      if (!form) throw new Error(`Could not find ${label}`)
      form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }))
      const submitBtn = form.querySelector('[type="submit"], button:not([type]), #submit')
      if (submitBtn) {
        submitBtn.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }))
      }
      await wait()
    },
    text(el) {
      return (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
    },
    must(value, message) {
      if (value === null || value === undefined) throw new Error(message)
      return value
    },
  }
}

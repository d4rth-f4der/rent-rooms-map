import type { Directive } from 'vue'

export type StaggerOptions = {
  selector?: string
  step?: number
  duration?: number
  easing?: string
}

function runOnce(el: HTMLElement, opts: Required<StaggerOptions>) {
  const items = el.querySelectorAll<HTMLElement>(opts.selector)
  if (items.length === 0) return false
  items.forEach((node, i) => {
    const delay = i * opts.step

    node.animate(
      [
        { transform: 'translateY(10px) scale(0.985)', filter: 'brightness(0.985)' },
        { transform: 'none', filter: 'none' },
      ],
      { duration: opts.duration, delay, easing: opts.easing, fill: 'both' },
    )

    node.animate(
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      { duration: opts.duration + 180, delay, easing: opts.easing, fill: 'both' },
    )

    const postDelay = delay + (opts.duration + 0) + 1
    node.animate(
      [
        { transform: 'none' },
        { transform: 'scale(1.007)' },
        { transform: 'none' },
      ],
      { duration: 200, delay: postDelay, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'none' },
    )
  })
  ;(el as unknown as { __stagger_done?: boolean }).__stagger_done = true
  return true
}

const staggerAppear: Directive<HTMLElement, StaggerOptions | undefined> = {
  mounted(el, binding) {
    if ((el as unknown as { __stagger_done?: boolean }).__stagger_done) return

    const raw = binding.value ?? {}
    const opts: Required<StaggerOptions> = {
      selector: raw.selector ?? ':scope > *',
      step: Math.max(0, raw.step ?? 45),
      duration: Math.max(0, raw.duration ?? 220),
      easing: raw.easing ?? 'cubic-bezier(.16,.84,.44,1)',
    }

    if (!runOnce(el, opts)) {
      const mo = new MutationObserver(() => {
        if ((el as unknown as { __stagger_done?: boolean }).__stagger_done) return
        if (runOnce(el, opts)) {
          mo.disconnect()
          ;(el as unknown as { __stagger_observer?: MutationObserver }).__stagger_observer = undefined
        }
      })
      mo.observe(el, { childList: true })
      ;(el as unknown as { __stagger_observer?: MutationObserver }).__stagger_observer = mo
    }
  },
  updated() {

  },
  beforeUnmount(el) {
    const mo: MutationObserver | undefined = (el as unknown as { __stagger_observer?: MutationObserver }).__stagger_observer
    if (mo) mo.disconnect()
  },
}

export default staggerAppear

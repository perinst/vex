import { createEffect, For, on, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"

const target = ["v", "e", "x"] as const

const choices = ["v", "e", "x"] as const

export function AnimatedWordmark(props: { active: boolean }) {
  const [state, setState] = createStore({ letters: [...target] })
  const timers = new Set<ReturnType<typeof setTimeout>>()

  createEffect(
    on(
      () => props.active,
      (active) => {
        timers.forEach(clearTimeout)
        timers.clear()

        if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setState("letters", [...target])

          return
        }

        const starts = target.map(() => choices[Math.floor(Math.random() * choices.length)])
        const settles = target.map(() => 6 + Math.floor(Math.random() * 8))
        const last = Math.max(...settles)
        setState("letters", starts)

        Array.from({ length: last }, (_, index) => index + 1).forEach((tick) => {
          const timer = setTimeout(() => {
            setState(
              "letters",
              target.map((letter, index) =>
                tick >= settles[index] ? letter : choices[Math.floor(Math.random() * choices.length)],
              ),
            )
            timers.delete(timer)
          }, tick * 75)

          timers.add(timer)
        })
      },
    ),
  )

  onCleanup(() => timers.forEach(clearTimeout))

  return (
    <svg class="settings-about-wordmark" viewBox="0 0 234 42" aria-hidden="true">
      <defs>
        <symbol id="settings-about-letter-v" viewBox="0 0 60 42">
          <path class="settings-about-letter-shadow" d="M2 8H18L30 30L42 8H58L36 38H24L2 8Z" />
          <path d="M0 6H16L30 28L44 6H60L38 36H22L0 6Z" />
        </symbol>
        <symbol id="settings-about-letter-e" viewBox="0 0 60 42">
          <path class="settings-about-letter-shadow" d="M60 26V32H2V26H60Z" />
          <path d="M60 24H0V6H60V14H15V18H52V26H15V30H60V38H0V24Z" />
        </symbol>
        <symbol id="settings-about-letter-x" viewBox="0 0 60 42">
          <path class="settings-about-letter-shadow" d="M2 8H18L30 17L42 8H58L38 22L58 38H42L30 28L18 38H2L22 22L2 8Z" />
          <path d="M0 6H16L30 16L44 6H60L38 22L60 36H44L30 28L16 36H0L22 22L0 6Z" />
        </symbol>
      </defs>
      <For each={state.letters}>
        {(letter, index) => (
          <use href={`#settings-about-letter-${letter}`} x={9 + index() * 78} width="60" height="42" />
        )}
      </For>
    </svg>
  )
}

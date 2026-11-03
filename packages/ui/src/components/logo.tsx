import { type ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        data-slot="logo-logo-mark-shadow"
        d="M2 2H6L8 11L10 2H14L10 18H6L2 2Z"
        fill="var(--icon-weak-base)"
      />
      <path
        data-slot="logo-logo-mark-v"
        d="M0 0H4L8 12L12 0H16L10 20H6L0 0Z"
        fill="var(--icon-strong-base)"
      />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 10H30L40 58L50 10H70L50 90H30L10 10Z" fill="var(--icon-base)" />
      <path d="M0 0H20L40 60L60 0H80L50 100H30L0 0Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 234 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g>
        <path d="M0 6H14L27 29L40 6H54L34 38H20L0 6Z" fill="var(--icon-strong-base)" />
        <path d="M90 6H144V14H105V18H136V26H105V30H144V38H90V6Z" fill="var(--icon-strong-base)" />
        <path
          d="M180 6H194L207 17L220 6H234L215 22L234 38H220L207 27L194 38H180L199 22L180 6Z"
          fill="var(--icon-strong-base)"
        />
      </g>
    </svg>
  )
}

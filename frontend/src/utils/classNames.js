// Tiny className joiner so we don't need an extra dependency like clsx.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

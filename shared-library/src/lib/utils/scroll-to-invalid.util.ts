import { ElementRef, NgZone, inject } from "@angular/core";

export interface ScrollInvalidOptions {
  offset?: number;
  smooth?: boolean;
  focus?: boolean;
}

export function scrollToInvalidControl(
  root: HTMLElement | ElementRef<HTMLElement> | null,
  opts: ScrollInvalidOptions = {}
): boolean {
  if (typeof window === 'undefined' || !root) return false;

  const element =
    root instanceof ElementRef ? root.nativeElement : root;

  if (!element) return false;

  const target = element.querySelector<HTMLElement>('.ng-invalid');

  if (!target) return false;

  const {
    offset = 0,
    smooth = true,
    focus = true,
  } = opts;

  const zone = tryInjectNgZone();
  const executor = (fn: () => void) =>
    zone ? zone.runOutsideAngular(fn) : fn();

  executor(() => {
    const top =
      target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: smooth ? 'smooth' : 'auto',
    });

    if (focus) {
      setTimeout(() => target.focus({ preventScroll: true }), 100);
    }
  });

  return true;
}

/* Helper: optional NgZone injection without throwing */
function tryInjectNgZone(): NgZone | null {
  try {
    return inject(NgZone);
  } catch {
    return null;
  }
}
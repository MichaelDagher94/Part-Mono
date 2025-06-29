import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

export const RESPONSIVE_BREAKPOINTS = {
  mobile: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
} as const;

export type ViewportSize = keyof typeof RESPONSIVE_BREAKPOINTS;

export function observeViewportSize(
  breakpointObserver: BreakpointObserver,
  size: ViewportSize,
): Observable<boolean> {
  return breakpointObserver
    .observe(RESPONSIVE_BREAKPOINTS[size])
    .pipe(map(state => state.matches));
}

export function isMobile$(
  breakpointObserver: BreakpointObserver,
): Observable<boolean> {
  return observeViewportSize(breakpointObserver, 'mobile');
}
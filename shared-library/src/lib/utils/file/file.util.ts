import { Observable, Observer } from 'rxjs';

export function fileToBase64(file: File): Observable<string> {
  if (typeof window === 'undefined' || typeof FileReader === 'undefined') {
    return new Observable<string>(subscriber => {
      subscriber.error(new Error('FileReader not available on this platform'));
    });
  }

  return new Observable((observer: Observer<string>) => {
    const reader = new FileReader();

    reader.onload = () => {
      // strip "data:*/*;base64," prefix if present
      const result = (reader.result as string) ?? '';
      observer.next(result.includes(',') ? result.split(',')[1] : result);
      observer.complete();
    };

    reader.onerror = err => observer.error(err);
    reader.readAsDataURL(file);

    return () => reader.abort();
  });
}

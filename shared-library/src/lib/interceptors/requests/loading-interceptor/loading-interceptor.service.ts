import { inject, Injectable } from "@angular/core";
import { LoaderFacadeService } from "../../../presentation/ui-elements/loader/loader.facade.service";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingInterceptor implements HttpInterceptor {
  private loaderService = inject(LoaderFacadeService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.shouldExcludeUrl(request.url)) {
      return next.handle(request);
    }

    this.loaderService.show();

    return next.handle(request).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            this.loaderService.hide();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loaderService.hide();
        },
        finalize: () => {
          this.loaderService.hide();
        },
      })
    );
  }

  private shouldExcludeUrl(url: string): boolean {
    const excludedUrls = ["/api/status", "/api/notifications", "/auth/refresh"];
    return excludedUrls.some(excluded => url.includes(excluded));
  }
}

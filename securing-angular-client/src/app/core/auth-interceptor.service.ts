import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { CoreModule } from './core.module';
import { AuthService } from './auth-service.component';
import { Constants } from '../constants';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private _authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.url.startsWith(Constants.apiRoot)) {
            return from(
                this._authService.getAccessToken().then(
                    token => {
                        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                        const authReq = req.clone({ headers });
                        return next.handle(authReq).toPromise();
                 })
            );
        }
        else {
            return next.handle(req);
        }

        // const headers = req.headers
        //     .set('Content-Type', 'application/json');
        // const authReq = req.clone({ headers });
        // return next.handle(authReq);

    }
}
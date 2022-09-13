/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { finalize, share, takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
/**
 * Handles listening for all change and input events that occur on the document.
 *
 * This service exposes a single method #listen to allow users to subscribe to change and input
 * events that occur on the document. Since listening for these events can be expensive, we use
 * #fromEvent which will lazily attach a listener when the first subscription is made and remove the
 * listener once the last observer unsubscribes.
 */
export class GlobalChangeAndInputListener {
    constructor(document, _ngZone) {
        this._ngZone = _ngZone;
        /** Stores the subjects that emit the events that occur on the global document. */
        this._observables = new Map();
        /** The notifier that triggers the global event observables to stop emitting and complete. */
        this._destroyed = new Subject();
        this._document = document;
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this._observables.clear();
    }
    /** Returns a subscription to global change or input events. */
    listen(type, callback) {
        // If this is the first time we are listening to this event, create the observable for it.
        if (!this._observables.has(type)) {
            this._observables.set(type, this._createGlobalEventObservable(type));
        }
        return this._ngZone.runOutsideAngular(() => this._observables
            .get(type)
            .subscribe((event) => this._ngZone.run(() => callback(event))));
    }
    /** Creates an observable that emits all events of the given type. */
    _createGlobalEventObservable(type) {
        return fromEvent(this._document, type, { capture: true, passive: true }).pipe(takeUntil(this._destroyed), finalize(() => this._observables.delete(type)), share());
    }
}
GlobalChangeAndInputListener.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: GlobalChangeAndInputListener, deps: [{ token: DOCUMENT }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
GlobalChangeAndInputListener.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: GlobalChangeAndInputListener, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: GlobalChangeAndInputListener, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWNoYW5nZS1hbmQtaW5wdXQtbGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL2dsb2JhbC1jaGFuZ2UtYW5kLWlucHV0LWxpc3RlbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQVksTUFBTSxlQUFlLENBQUM7QUFFcEUsT0FBTyxFQUFDLFNBQVMsRUFBYyxPQUFPLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDbEUsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTFEOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sNEJBQTRCO0lBVXZDLFlBQThCLFFBQWEsRUFBVSxPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQU5wRSxrRkFBa0Y7UUFDMUUsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQztRQUV2RCw2RkFBNkY7UUFDckYsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFHakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsK0RBQStEO0lBQy9ELE1BQU0sQ0FBQyxJQUFPLEVBQUUsUUFBa0M7UUFDaEQsMEZBQTBGO1FBQzFGLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDdEU7UUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQ3pDLElBQUksQ0FBQyxZQUFZO2FBQ2QsR0FBRyxDQUFDLElBQUksQ0FBRTthQUNWLFNBQVMsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FDeEUsQ0FBQztJQUNKLENBQUM7SUFFRCxxRUFBcUU7SUFDN0QsNEJBQTRCLENBQUMsSUFBTztRQUMxQyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsSUFBSSxDQUN6RSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUMxQixRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDOUMsS0FBSyxFQUFFLENBQ1IsQ0FBQztJQUNKLENBQUM7O2dJQXpDVSw0QkFBNEIsa0JBVW5CLFFBQVE7b0lBVmpCLDRCQUE0QixjQURoQixNQUFNO2tHQUNsQiw0QkFBNEI7a0JBRHhDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFXakIsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTcGVjaWZpY0V2ZW50TGlzdGVuZXJ9IGZyb20gJ0BtYXRlcmlhbC9iYXNlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaW5hbGl6ZSwgc2hhcmUsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIEhhbmRsZXMgbGlzdGVuaW5nIGZvciBhbGwgY2hhbmdlIGFuZCBpbnB1dCBldmVudHMgdGhhdCBvY2N1ciBvbiB0aGUgZG9jdW1lbnQuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGV4cG9zZXMgYSBzaW5nbGUgbWV0aG9kICNsaXN0ZW4gdG8gYWxsb3cgdXNlcnMgdG8gc3Vic2NyaWJlIHRvIGNoYW5nZSBhbmQgaW5wdXRcbiAqIGV2ZW50cyB0aGF0IG9jY3VyIG9uIHRoZSBkb2N1bWVudC4gU2luY2UgbGlzdGVuaW5nIGZvciB0aGVzZSBldmVudHMgY2FuIGJlIGV4cGVuc2l2ZSwgd2UgdXNlXG4gKiAjZnJvbUV2ZW50IHdoaWNoIHdpbGwgbGF6aWx5IGF0dGFjaCBhIGxpc3RlbmVyIHdoZW4gdGhlIGZpcnN0IHN1YnNjcmlwdGlvbiBpcyBtYWRlIGFuZCByZW1vdmUgdGhlXG4gKiBsaXN0ZW5lciBvbmNlIHRoZSBsYXN0IG9ic2VydmVyIHVuc3Vic2NyaWJlcy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgR2xvYmFsQ2hhbmdlQW5kSW5wdXRMaXN0ZW5lcjxLIGV4dGVuZHMgJ2NoYW5nZScgfCAnaW5wdXQnPiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBUaGUgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIHRoZSBnbG9iYWwgZG9jdW1lbnQgcmVmZXJlbmNlLiAqL1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFN0b3JlcyB0aGUgc3ViamVjdHMgdGhhdCBlbWl0IHRoZSBldmVudHMgdGhhdCBvY2N1ciBvbiB0aGUgZ2xvYmFsIGRvY3VtZW50LiAqL1xuICBwcml2YXRlIF9vYnNlcnZhYmxlcyA9IG5ldyBNYXA8SywgT2JzZXJ2YWJsZTxFdmVudD4+KCk7XG5cbiAgLyoqIFRoZSBub3RpZmllciB0aGF0IHRyaWdnZXJzIHRoZSBnbG9iYWwgZXZlbnQgb2JzZXJ2YWJsZXMgdG8gc3RvcCBlbWl0dGluZyBhbmQgY29tcGxldGUuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9vYnNlcnZhYmxlcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBzdWJzY3JpcHRpb24gdG8gZ2xvYmFsIGNoYW5nZSBvciBpbnB1dCBldmVudHMuICovXG4gIGxpc3Rlbih0eXBlOiBLLCBjYWxsYmFjazogU3BlY2lmaWNFdmVudExpc3RlbmVyPEs+KTogU3Vic2NyaXB0aW9uIHtcbiAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHdlIGFyZSBsaXN0ZW5pbmcgdG8gdGhpcyBldmVudCwgY3JlYXRlIHRoZSBvYnNlcnZhYmxlIGZvciBpdC5cbiAgICBpZiAoIXRoaXMuX29ic2VydmFibGVzLmhhcyh0eXBlKSkge1xuICAgICAgdGhpcy5fb2JzZXJ2YWJsZXMuc2V0KHR5cGUsIHRoaXMuX2NyZWF0ZUdsb2JhbEV2ZW50T2JzZXJ2YWJsZSh0eXBlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PlxuICAgICAgdGhpcy5fb2JzZXJ2YWJsZXNcbiAgICAgICAgLmdldCh0eXBlKSFcbiAgICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IEV2ZW50KSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IGNhbGxiYWNrKGV2ZW50KSkpLFxuICAgICk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYWxsIGV2ZW50cyBvZiB0aGUgZ2l2ZW4gdHlwZS4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlR2xvYmFsRXZlbnRPYnNlcnZhYmxlKHR5cGU6IEspIHtcbiAgICByZXR1cm4gZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCB0eXBlLCB7Y2FwdHVyZTogdHJ1ZSwgcGFzc2l2ZTogdHJ1ZX0pLnBpcGUoXG4gICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSxcbiAgICAgIGZpbmFsaXplKCgpID0+IHRoaXMuX29ic2VydmFibGVzLmRlbGV0ZSh0eXBlKSksXG4gICAgICBzaGFyZSgpLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==
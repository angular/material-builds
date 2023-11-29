/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, Inject, InjectionToken, Injector, TemplateRef, ViewContainerRef, } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MatMenuContent`. It serves
 * as alternative token to the actual `MatMenuContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_MENU_CONTENT = new InjectionToken('MatMenuContent');
/** Menu content that will be rendered lazily once the menu is opened. */
export class MatMenuContent {
    constructor(_template, _componentFactoryResolver, _appRef, _injector, _viewContainerRef, _document, _changeDetectorRef) {
        this._template = _template;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._appRef = _appRef;
        this._injector = _injector;
        this._viewContainerRef = _viewContainerRef;
        this._document = _document;
        this._changeDetectorRef = _changeDetectorRef;
        /** Emits when the menu content has been attached. */
        this._attached = new Subject();
    }
    /**
     * Attaches the content with a particular context.
     * @docs-private
     */
    attach(context = {}) {
        if (!this._portal) {
            this._portal = new TemplatePortal(this._template, this._viewContainerRef);
        }
        this.detach();
        if (!this._outlet) {
            this._outlet = new DomPortalOutlet(this._document.createElement('div'), this._componentFactoryResolver, this._appRef, this._injector);
        }
        const element = this._template.elementRef.nativeElement;
        // Because we support opening the same menu from different triggers (which in turn have their
        // own `OverlayRef` panel), we have to re-insert the host element every time, otherwise we
        // risk it staying attached to a pane that's no longer in the DOM.
        element.parentNode.insertBefore(this._outlet.outletElement, element);
        // When `MatMenuContent` is used in an `OnPush` component, the insertion of the menu
        // content via `createEmbeddedView` does not cause the content to be seen as "dirty"
        // by Angular. This causes the `@ContentChildren` for menu items within the menu to
        // not be updated by Angular. By explicitly marking for check here, we tell Angular that
        // it needs to check for new menu items and update the `@ContentChild` in `MatMenu`.
        // @breaking-change 9.0.0 Make change detector ref required
        this._changeDetectorRef?.markForCheck();
        this._portal.attach(this._outlet, context);
        this._attached.next();
    }
    /**
     * Detaches the content.
     * @docs-private
     */
    detach() {
        if (this._portal.isAttached) {
            this._portal.detach();
        }
    }
    ngOnDestroy() {
        if (this._outlet) {
            this._outlet.dispose();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatMenuContent, deps: [{ token: i0.TemplateRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatMenuContent, selector: "ng-template[matMenuContent]", providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatMenuContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matMenuContent]',
                    providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }],
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsTUFBTSxFQUNOLGNBQWMsRUFDZCxRQUFRLEVBRVIsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxjQUFjLENBQWlCLGdCQUFnQixDQUFDLENBQUM7QUFFckYseUVBQXlFO0FBS3pFLE1BQU0sT0FBTyxjQUFjO0lBK0J6QixZQUNVLFNBQTJCLEVBQzNCLHlCQUFtRCxFQUNuRCxPQUF1QixFQUN2QixTQUFtQixFQUNuQixpQkFBbUMsRUFDakIsU0FBYyxFQUNoQyxrQkFBc0M7UUFOdEMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBbENoRCxxREFBcUQ7UUFDNUMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFrQ3RDLENBQUM7SUFFSjs7O09BR0c7SUFDSCxNQUFNLENBQUMsVUFBZSxFQUFFO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUMzRTtRQUVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUNuQyxJQUFJLENBQUMseUJBQXlCLEVBQzlCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFNBQVMsQ0FDZixDQUFDO1NBQ0g7UUFFRCxNQUFNLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBRXJFLDZGQUE2RjtRQUM3RiwwRkFBMEY7UUFDMUYsa0VBQWtFO1FBQ2xFLE9BQU8sQ0FBQyxVQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRFLG9GQUFvRjtRQUNwRixvRkFBb0Y7UUFDcEYsbUZBQW1GO1FBQ25GLHdGQUF3RjtRQUN4RixvRkFBb0Y7UUFDcEYsMkRBQTJEO1FBQzNELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQzs4R0E3RlUsY0FBYywyS0FxQ2YsUUFBUTtrR0FyQ1AsY0FBYyxzREFGZCxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUMsQ0FBQzs7MkZBRTFELGNBQWM7a0JBSjFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxnQkFBZ0IsRUFBQyxDQUFDO2lCQUN0RTs7MEJBc0NJLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RvbVBvcnRhbE91dGxldCwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFwcGxpY2F0aW9uUmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgTWF0TWVudUNvbnRlbnRgLiBJdCBzZXJ2ZXNcbiAqIGFzIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdE1lbnVDb250ZW50YCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX0NPTlRFTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudUNvbnRlbnQ+KCdNYXRNZW51Q29udGVudCcpO1xuXG4vKiogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkgb25jZSB0aGUgbWVudSBpcyBvcGVuZWQuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVttYXRNZW51Q29udGVudF0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX01FTlVfQ09OVEVOVCwgdXNlRXhpc3Rpbmc6IE1hdE1lbnVDb250ZW50fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVDb250ZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxhbnk+O1xuICBwcml2YXRlIF9vdXRsZXQ6IERvbVBvcnRhbE91dGxldDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgbWVudSBjb250ZW50IGhhcyBiZWVuIGF0dGFjaGVkLiAqL1xuICByZWFkb25seSBfYXR0YWNoZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgZG9jdW1lbnQ6IGFueSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBjaGFuZ2VEZXRlY3RvclJlZmAgaXMgbm93IGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGRvY3VtZW50OiBhbnksXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF90ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIF9hcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgY29udGVudCB3aXRoIGEgcGFydGljdWxhciBjb250ZXh0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhdHRhY2goY29udGV4dDogYW55ID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX3BvcnRhbCkge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB9XG5cbiAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgaWYgKCF0aGlzLl9vdXRsZXQpIHtcbiAgICAgIHRoaXMuX291dGxldCA9IG5ldyBEb21Qb3J0YWxPdXRsZXQoXG4gICAgICAgIHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgIHRoaXMuX2FwcFJlZixcbiAgICAgICAgdGhpcy5faW5qZWN0b3IsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fdGVtcGxhdGUuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gQmVjYXVzZSB3ZSBzdXBwb3J0IG9wZW5pbmcgdGhlIHNhbWUgbWVudSBmcm9tIGRpZmZlcmVudCB0cmlnZ2VycyAod2hpY2ggaW4gdHVybiBoYXZlIHRoZWlyXG4gICAgLy8gb3duIGBPdmVybGF5UmVmYCBwYW5lbCksIHdlIGhhdmUgdG8gcmUtaW5zZXJ0IHRoZSBob3N0IGVsZW1lbnQgZXZlcnkgdGltZSwgb3RoZXJ3aXNlIHdlXG4gICAgLy8gcmlzayBpdCBzdGF5aW5nIGF0dGFjaGVkIHRvIGEgcGFuZSB0aGF0J3Mgbm8gbG9uZ2VyIGluIHRoZSBET00uXG4gICAgZWxlbWVudC5wYXJlbnROb2RlIS5pbnNlcnRCZWZvcmUodGhpcy5fb3V0bGV0Lm91dGxldEVsZW1lbnQsIGVsZW1lbnQpO1xuXG4gICAgLy8gV2hlbiBgTWF0TWVudUNvbnRlbnRgIGlzIHVzZWQgaW4gYW4gYE9uUHVzaGAgY29tcG9uZW50LCB0aGUgaW5zZXJ0aW9uIG9mIHRoZSBtZW51XG4gICAgLy8gY29udGVudCB2aWEgYGNyZWF0ZUVtYmVkZGVkVmlld2AgZG9lcyBub3QgY2F1c2UgdGhlIGNvbnRlbnQgdG8gYmUgc2VlbiBhcyBcImRpcnR5XCJcbiAgICAvLyBieSBBbmd1bGFyLiBUaGlzIGNhdXNlcyB0aGUgYEBDb250ZW50Q2hpbGRyZW5gIGZvciBtZW51IGl0ZW1zIHdpdGhpbiB0aGUgbWVudSB0b1xuICAgIC8vIG5vdCBiZSB1cGRhdGVkIGJ5IEFuZ3VsYXIuIEJ5IGV4cGxpY2l0bHkgbWFya2luZyBmb3IgY2hlY2sgaGVyZSwgd2UgdGVsbCBBbmd1bGFyIHRoYXRcbiAgICAvLyBpdCBuZWVkcyB0byBjaGVjayBmb3IgbmV3IG1lbnUgaXRlbXMgYW5kIHVwZGF0ZSB0aGUgYEBDb250ZW50Q2hpbGRgIGluIGBNYXRNZW51YC5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIE1ha2UgY2hhbmdlIGRldGVjdG9yIHJlZiByZXF1aXJlZFxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLl9wb3J0YWwuYXR0YWNoKHRoaXMuX291dGxldCwgY29udGV4dCk7XG4gICAgdGhpcy5fYXR0YWNoZWQubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGFjaGVzIHRoZSBjb250ZW50LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBkZXRhY2goKSB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbC5pc0F0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9wb3J0YWwuZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX291dGxldCkge1xuICAgICAgdGhpcy5fb3V0bGV0LmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
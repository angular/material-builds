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
export class _MatMenuContentBase {
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
}
_MatMenuContentBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatMenuContentBase, deps: [{ token: i0.TemplateRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
_MatMenuContentBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatMenuContentBase, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatMenuContentBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }]; } });
/**
 * Menu content that will be rendered lazily once the menu is opened.
 */
export class MatMenuContent extends _MatMenuContentBase {
}
MatMenuContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatMenuContent, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatMenuContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatMenuContent, selector: "ng-template[matMenuContent]", providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatMenuContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matMenuContent]',
                    providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsTUFBTSxFQUNOLGNBQWMsRUFDZCxRQUFRLEVBRVIsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxjQUFjLENBQWlCLGdCQUFnQixDQUFDLENBQUM7QUFHckYsTUFBTSxPQUFnQixtQkFBbUI7SUFxQnZDLFlBQ1UsU0FBMkIsRUFDM0IseUJBQW1ELEVBQ25ELE9BQXVCLEVBQ3ZCLFNBQW1CLEVBQ25CLGlCQUFtQyxFQUNqQixTQUFjLEVBQ2hDLGtCQUFzQztRQU50QyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTBCO1FBQ25ELFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ3ZCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDbkIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFLO1FBQ2hDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUF4QmhELHFEQUFxRDtRQUM1QyxjQUFTLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQXdCdEMsQ0FBQztJQUVKOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxVQUFlLEVBQUU7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQzNFO1FBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQ25DLElBQUksQ0FBQyx5QkFBeUIsRUFDOUIsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsU0FBUyxDQUNmLENBQUM7U0FDSDtRQUVELE1BQU0sT0FBTyxHQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFFckUsNkZBQTZGO1FBQzdGLDBGQUEwRjtRQUMxRixrRUFBa0U7UUFDbEUsT0FBTyxDQUFDLFVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdEUsb0ZBQW9GO1FBQ3BGLG9GQUFvRjtRQUNwRixtRkFBbUY7UUFDbkYsd0ZBQXdGO1FBQ3hGLG9GQUFvRjtRQUNwRiwyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOztnSEFuRm1CLG1CQUFtQiwyS0EyQjdCLFFBQVE7b0dBM0JFLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUR4QyxTQUFTOzswQkE0QkwsTUFBTTsyQkFBQyxRQUFROztBQTJEcEI7O0dBRUc7QUFLSCxNQUFNLE9BQU8sY0FBZSxTQUFRLG1CQUFtQjs7MkdBQTFDLGNBQWM7K0ZBQWQsY0FBYyxzREFGZCxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUMsQ0FBQzsyRkFFMUQsY0FBYztrQkFKMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLGdCQUFnQixFQUFDLENBQUM7aUJBQ3RFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RG9tUG9ydGFsT3V0bGV0LCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIERpcmVjdGl2ZSxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRNZW51Q29udGVudGAuIEl0IHNlcnZlc1xuICogYXMgYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0TWVudUNvbnRlbnRgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfQ09OVEVOVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRNZW51Q29udGVudD4oJ01hdE1lbnVDb250ZW50Jyk7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRNZW51Q29udGVudEJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9wb3J0YWw6IFRlbXBsYXRlUG9ydGFsPGFueT47XG4gIHByaXZhdGUgX291dGxldDogRG9tUG9ydGFsT3V0bGV0O1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBtZW51IGNvbnRlbnQgaGFzIGJlZW4gYXR0YWNoZWQuICovXG4gIHJlYWRvbmx5IF9hdHRhY2hlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBjaGFuZ2VEZXRlY3RvclJlZmAgaXMgbm93IGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGRvY3VtZW50OiBhbnksXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF90ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIF9hcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgY29udGVudCB3aXRoIGEgcGFydGljdWxhciBjb250ZXh0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhdHRhY2goY29udGV4dDogYW55ID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX3BvcnRhbCkge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB9XG5cbiAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgaWYgKCF0aGlzLl9vdXRsZXQpIHtcbiAgICAgIHRoaXMuX291dGxldCA9IG5ldyBEb21Qb3J0YWxPdXRsZXQoXG4gICAgICAgIHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgIHRoaXMuX2FwcFJlZixcbiAgICAgICAgdGhpcy5faW5qZWN0b3IsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fdGVtcGxhdGUuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gQmVjYXVzZSB3ZSBzdXBwb3J0IG9wZW5pbmcgdGhlIHNhbWUgbWVudSBmcm9tIGRpZmZlcmVudCB0cmlnZ2VycyAod2hpY2ggaW4gdHVybiBoYXZlIHRoZWlyXG4gICAgLy8gb3duIGBPdmVybGF5UmVmYCBwYW5lbCksIHdlIGhhdmUgdG8gcmUtaW5zZXJ0IHRoZSBob3N0IGVsZW1lbnQgZXZlcnkgdGltZSwgb3RoZXJ3aXNlIHdlXG4gICAgLy8gcmlzayBpdCBzdGF5aW5nIGF0dGFjaGVkIHRvIGEgcGFuZSB0aGF0J3Mgbm8gbG9uZ2VyIGluIHRoZSBET00uXG4gICAgZWxlbWVudC5wYXJlbnROb2RlIS5pbnNlcnRCZWZvcmUodGhpcy5fb3V0bGV0Lm91dGxldEVsZW1lbnQsIGVsZW1lbnQpO1xuXG4gICAgLy8gV2hlbiBgTWF0TWVudUNvbnRlbnRgIGlzIHVzZWQgaW4gYW4gYE9uUHVzaGAgY29tcG9uZW50LCB0aGUgaW5zZXJ0aW9uIG9mIHRoZSBtZW51XG4gICAgLy8gY29udGVudCB2aWEgYGNyZWF0ZUVtYmVkZGVkVmlld2AgZG9lcyBub3QgY2F1c2UgdGhlIGNvbnRlbnQgdG8gYmUgc2VlbiBhcyBcImRpcnR5XCJcbiAgICAvLyBieSBBbmd1bGFyLiBUaGlzIGNhdXNlcyB0aGUgYEBDb250ZW50Q2hpbGRyZW5gIGZvciBtZW51IGl0ZW1zIHdpdGhpbiB0aGUgbWVudSB0b1xuICAgIC8vIG5vdCBiZSB1cGRhdGVkIGJ5IEFuZ3VsYXIuIEJ5IGV4cGxpY2l0bHkgbWFya2luZyBmb3IgY2hlY2sgaGVyZSwgd2UgdGVsbCBBbmd1bGFyIHRoYXRcbiAgICAvLyBpdCBuZWVkcyB0byBjaGVjayBmb3IgbmV3IG1lbnUgaXRlbXMgYW5kIHVwZGF0ZSB0aGUgYEBDb250ZW50Q2hpbGRgIGluIGBNYXRNZW51YC5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIE1ha2UgY2hhbmdlIGRldGVjdG9yIHJlZiByZXF1aXJlZFxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLl9wb3J0YWwuYXR0YWNoKHRoaXMuX291dGxldCwgY29udGV4dCk7XG4gICAgdGhpcy5fYXR0YWNoZWQubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGFjaGVzIHRoZSBjb250ZW50LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBkZXRhY2goKSB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbC5pc0F0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9wb3J0YWwuZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX291dGxldCkge1xuICAgICAgdGhpcy5fb3V0bGV0LmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZW51IGNvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseSBvbmNlIHRoZSBtZW51IGlzIG9wZW5lZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbbWF0TWVudUNvbnRlbnRdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9NRU5VX0NPTlRFTlQsIHVzZUV4aXN0aW5nOiBNYXRNZW51Q29udGVudH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51Q29udGVudCBleHRlbmRzIF9NYXRNZW51Q29udGVudEJhc2Uge31cbiJdfQ==
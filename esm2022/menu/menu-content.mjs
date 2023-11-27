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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatMenuContent, deps: [{ token: i0.TemplateRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatMenuContent, isStandalone: true, selector: "ng-template[matMenuContent]", providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatMenuContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matMenuContent]',
                    providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsTUFBTSxFQUNOLGNBQWMsRUFDZCxRQUFRLEVBRVIsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxjQUFjLENBQWlCLGdCQUFnQixDQUFDLENBQUM7QUFFckYseUVBQXlFO0FBTXpFLE1BQU0sT0FBTyxjQUFjO0lBK0J6QixZQUNVLFNBQTJCLEVBQzNCLHlCQUFtRCxFQUNuRCxPQUF1QixFQUN2QixTQUFtQixFQUNuQixpQkFBbUMsRUFDakIsU0FBYyxFQUNoQyxrQkFBc0M7UUFOdEMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBbENoRCxxREFBcUQ7UUFDNUMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFrQ3RDLENBQUM7SUFFSjs7O09BR0c7SUFDSCxNQUFNLENBQUMsVUFBZSxFQUFFO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUMzRTtRQUVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUNuQyxJQUFJLENBQUMseUJBQXlCLEVBQzlCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFNBQVMsQ0FDZixDQUFDO1NBQ0g7UUFFRCxNQUFNLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBRXJFLDZGQUE2RjtRQUM3RiwwRkFBMEY7UUFDMUYsa0VBQWtFO1FBQ2xFLE9BQU8sQ0FBQyxVQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRFLG9GQUFvRjtRQUNwRixvRkFBb0Y7UUFDcEYsbUZBQW1GO1FBQ25GLHdGQUF3RjtRQUN4RixvRkFBb0Y7UUFDcEYsMkRBQTJEO1FBQzNELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQzs4R0E3RlUsY0FBYywyS0FxQ2YsUUFBUTtrR0FyQ1AsY0FBYywwRUFIZCxDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUMsQ0FBQzs7MkZBRzFELGNBQWM7a0JBTDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxnQkFBZ0IsRUFBQyxDQUFDO29CQUNyRSxVQUFVLEVBQUUsSUFBSTtpQkFDakI7OzBCQXNDSSxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEb21Qb3J0YWxPdXRsZXQsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBcHBsaWNhdGlvblJlZixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRGlyZWN0aXZlLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdE1lbnVDb250ZW50YC4gSXQgc2VydmVzXG4gKiBhcyBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRNZW51Q29udGVudGAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTUVOVV9DT05URU5UID0gbmV3IEluamVjdGlvblRva2VuPE1hdE1lbnVDb250ZW50PignTWF0TWVudUNvbnRlbnQnKTtcblxuLyoqIE1lbnUgY29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5IG9uY2UgdGhlIG1lbnUgaXMgb3BlbmVkLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbbWF0TWVudUNvbnRlbnRdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9NRU5VX0NPTlRFTlQsIHVzZUV4aXN0aW5nOiBNYXRNZW51Q29udGVudH1dLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51Q29udGVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw8YW55PjtcbiAgcHJpdmF0ZSBfb3V0bGV0OiBEb21Qb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIG1lbnUgY29udGVudCBoYXMgYmVlbiBhdHRhY2hlZC4gKi9cbiAgcmVhZG9ubHkgX2F0dGFjaGVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGRvY3VtZW50OiBhbnksXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICApO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBgY2hhbmdlRGV0ZWN0b3JSZWZgIGlzIG5vdyBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBkb2N1bWVudDogYW55LFxuICAgIGNoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgcHJpdmF0ZSBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBfYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge31cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIGNvbnRlbnQgd2l0aCBhIHBhcnRpY3VsYXIgY29udGV4dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYXR0YWNoKGNvbnRleHQ6IGFueSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLl9wb3J0YWwpIHtcbiAgICAgIHRoaXMuX3BvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLl90ZW1wbGF0ZSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgfVxuXG4gICAgdGhpcy5kZXRhY2goKTtcblxuICAgIGlmICghdGhpcy5fb3V0bGV0KSB7XG4gICAgICB0aGlzLl9vdXRsZXQgPSBuZXcgRG9tUG9ydGFsT3V0bGV0KFxuICAgICAgICB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICB0aGlzLl9hcHBSZWYsXG4gICAgICAgIHRoaXMuX2luamVjdG9yLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX3RlbXBsYXRlLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIEJlY2F1c2Ugd2Ugc3VwcG9ydCBvcGVuaW5nIHRoZSBzYW1lIG1lbnUgZnJvbSBkaWZmZXJlbnQgdHJpZ2dlcnMgKHdoaWNoIGluIHR1cm4gaGF2ZSB0aGVpclxuICAgIC8vIG93biBgT3ZlcmxheVJlZmAgcGFuZWwpLCB3ZSBoYXZlIHRvIHJlLWluc2VydCB0aGUgaG9zdCBlbGVtZW50IGV2ZXJ5IHRpbWUsIG90aGVyd2lzZSB3ZVxuICAgIC8vIHJpc2sgaXQgc3RheWluZyBhdHRhY2hlZCB0byBhIHBhbmUgdGhhdCdzIG5vIGxvbmdlciBpbiB0aGUgRE9NLlxuICAgIGVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKHRoaXMuX291dGxldC5vdXRsZXRFbGVtZW50LCBlbGVtZW50KTtcblxuICAgIC8vIFdoZW4gYE1hdE1lbnVDb250ZW50YCBpcyB1c2VkIGluIGFuIGBPblB1c2hgIGNvbXBvbmVudCwgdGhlIGluc2VydGlvbiBvZiB0aGUgbWVudVxuICAgIC8vIGNvbnRlbnQgdmlhIGBjcmVhdGVFbWJlZGRlZFZpZXdgIGRvZXMgbm90IGNhdXNlIHRoZSBjb250ZW50IHRvIGJlIHNlZW4gYXMgXCJkaXJ0eVwiXG4gICAgLy8gYnkgQW5ndWxhci4gVGhpcyBjYXVzZXMgdGhlIGBAQ29udGVudENoaWxkcmVuYCBmb3IgbWVudSBpdGVtcyB3aXRoaW4gdGhlIG1lbnUgdG9cbiAgICAvLyBub3QgYmUgdXBkYXRlZCBieSBBbmd1bGFyLiBCeSBleHBsaWNpdGx5IG1hcmtpbmcgZm9yIGNoZWNrIGhlcmUsIHdlIHRlbGwgQW5ndWxhciB0aGF0XG4gICAgLy8gaXQgbmVlZHMgdG8gY2hlY2sgZm9yIG5ldyBtZW51IGl0ZW1zIGFuZCB1cGRhdGUgdGhlIGBAQ29udGVudENoaWxkYCBpbiBgTWF0TWVudWAuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBNYWtlIGNoYW5nZSBkZXRlY3RvciByZWYgcmVxdWlyZWRcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZj8ubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5fcG9ydGFsLmF0dGFjaCh0aGlzLl9vdXRsZXQsIGNvbnRleHQpO1xuICAgIHRoaXMuX2F0dGFjaGVkLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRhY2hlcyB0aGUgY29udGVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZGV0YWNoKCkge1xuICAgIGlmICh0aGlzLl9wb3J0YWwuaXNBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fcG9ydGFsLmRldGFjaCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9vdXRsZXQpIHtcbiAgICAgIHRoaXMuX291dGxldC5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=
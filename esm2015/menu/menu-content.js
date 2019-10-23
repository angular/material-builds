/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, Inject, Injector, TemplateRef, ViewContainerRef, } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * Menu content that will be rendered lazily once the menu is opened.
 */
export class MatMenuContent {
    /**
     * @param {?} _template
     * @param {?} _componentFactoryResolver
     * @param {?} _appRef
     * @param {?} _injector
     * @param {?} _viewContainerRef
     * @param {?} _document
     * @param {?=} _changeDetectorRef
     */
    constructor(_template, _componentFactoryResolver, _appRef, _injector, _viewContainerRef, _document, _changeDetectorRef) {
        this._template = _template;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._appRef = _appRef;
        this._injector = _injector;
        this._viewContainerRef = _viewContainerRef;
        this._document = _document;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Emits when the menu content has been attached.
         */
        this._attached = new Subject();
    }
    /**
     * Attaches the content with a particular context.
     * \@docs-private
     * @param {?=} context
     * @return {?}
     */
    attach(context = {}) {
        if (!this._portal) {
            this._portal = new TemplatePortal(this._template, this._viewContainerRef);
        }
        this.detach();
        if (!this._outlet) {
            this._outlet = new DomPortalOutlet(this._document.createElement('div'), this._componentFactoryResolver, this._appRef, this._injector);
        }
        /** @type {?} */
        const element = this._template.elementRef.nativeElement;
        // Because we support opening the same menu from different triggers (which in turn have their
        // own `OverlayRef` panel), we have to re-insert the host element every time, otherwise we
        // risk it staying attached to a pane that's no longer in the DOM.
        (/** @type {?} */ (element.parentNode)).insertBefore(this._outlet.outletElement, element);
        // When `MatMenuContent` is used in an `OnPush` component, the insertion of the menu
        // content via `createEmbeddedView` does not cause the content to be seen as "dirty"
        // by Angular. This causes the `@ContentChildren` for menu items within the menu to
        // not be updated by Angular. By explicitly marking for check here, we tell Angular that
        // it needs to check for new menu items and update the `@ContentChild` in `MatMenu`.
        // @breaking-change 9.0.0 Make change detector ref required
        if (this._changeDetectorRef) {
            this._changeDetectorRef.markForCheck();
        }
        this._portal.attach(this._outlet, context);
        this._attached.next();
    }
    /**
     * Detaches the content.
     * \@docs-private
     * @return {?}
     */
    detach() {
        if (this._portal.isAttached) {
            this._portal.detach();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._outlet) {
            this._outlet.dispose();
        }
    }
}
MatMenuContent.decorators = [
    { type: Directive, args: [{
                selector: 'ng-template[matMenuContent]'
            },] }
];
/** @nocollapse */
MatMenuContent.ctorParameters = () => [
    { type: TemplateRef },
    { type: ComponentFactoryResolver },
    { type: ApplicationRef },
    { type: Injector },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ChangeDetectorRef }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._portal;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._outlet;
    /**
     * Emits when the menu content has been attached.
     * @type {?}
     */
    MatMenuContent.prototype._attached;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._template;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._componentFactoryResolver;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._appRef;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._injector;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._viewContainerRef;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._document;
    /**
     * @type {?}
     * @private
     */
    MatMenuContent.prototype._changeDetectorRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxNQUFNLEVBQ04sUUFBUSxFQUVSLFdBQVcsRUFDWCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7OztBQVE3QixNQUFNLE9BQU8sY0FBYzs7Ozs7Ozs7OztJQU96QixZQUNVLFNBQTJCLEVBQzNCLHlCQUFtRCxFQUNuRCxPQUF1QixFQUN2QixTQUFtQixFQUNuQixpQkFBbUMsRUFDakIsU0FBYyxFQUNoQyxrQkFBc0M7UUFOdEMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9COzs7O1FBVGhELGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0lBU21CLENBQUM7Ozs7Ozs7SUFNcEQsTUFBTSxDQUFDLFVBQWUsRUFBRTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDM0U7UUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUNsRSxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbkU7O2NBRUssT0FBTyxHQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhO1FBRXBFLDZGQUE2RjtRQUM3RiwwRkFBMEY7UUFDMUYsa0VBQWtFO1FBQ2xFLG1CQUFBLE9BQU8sQ0FBQyxVQUFVLEVBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdEUsb0ZBQW9GO1FBQ3BGLG9GQUFvRjtRQUNwRixtRkFBbUY7UUFDbkYsd0ZBQXdGO1FBQ3hGLG9GQUFvRjtRQUNwRiwyREFBMkQ7UUFDM0QsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hCLENBQUM7Ozs7OztJQU1ELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQzs7O1lBdEVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNkJBQTZCO2FBQ3hDOzs7O1lBVkMsV0FBVztZQUxYLHdCQUF3QjtZQUZ4QixjQUFjO1lBS2QsUUFBUTtZQUdSLGdCQUFnQjs0Q0F1QmIsTUFBTSxTQUFDLFFBQVE7WUE5QmxCLGlCQUFpQjs7Ozs7OztJQWtCakIsaUNBQXFDOzs7OztJQUNyQyxpQ0FBaUM7Ozs7O0lBR2pDLG1DQUFnQzs7Ozs7SUFHOUIsbUNBQW1DOzs7OztJQUNuQyxtREFBMkQ7Ozs7O0lBQzNELGlDQUErQjs7Ozs7SUFDL0IsbUNBQTJCOzs7OztJQUMzQiwyQ0FBMkM7Ozs7O0lBQzNDLG1DQUF3Qzs7Ozs7SUFDeEMsNENBQThDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RG9tUG9ydGFsT3V0bGV0LCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIERpcmVjdGl2ZSxcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIE1lbnUgY29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5IG9uY2UgdGhlIG1lbnUgaXMgb3BlbmVkLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVttYXRNZW51Q29udGVudF0nXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVDb250ZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxhbnk+O1xuICBwcml2YXRlIF9vdXRsZXQ6IERvbVBvcnRhbE91dGxldDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgbWVudSBjb250ZW50IGhhcyBiZWVuIGF0dGFjaGVkLiAqL1xuICBfYXR0YWNoZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgX2FwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgY29udGVudCB3aXRoIGEgcGFydGljdWxhciBjb250ZXh0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhdHRhY2goY29udGV4dDogYW55ID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX3BvcnRhbCkge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB9XG5cbiAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgaWYgKCF0aGlzLl9vdXRsZXQpIHtcbiAgICAgIHRoaXMuX291dGxldCA9IG5ldyBEb21Qb3J0YWxPdXRsZXQodGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCB0aGlzLl9hcHBSZWYsIHRoaXMuX2luamVjdG9yKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX3RlbXBsYXRlLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIEJlY2F1c2Ugd2Ugc3VwcG9ydCBvcGVuaW5nIHRoZSBzYW1lIG1lbnUgZnJvbSBkaWZmZXJlbnQgdHJpZ2dlcnMgKHdoaWNoIGluIHR1cm4gaGF2ZSB0aGVpclxuICAgIC8vIG93biBgT3ZlcmxheVJlZmAgcGFuZWwpLCB3ZSBoYXZlIHRvIHJlLWluc2VydCB0aGUgaG9zdCBlbGVtZW50IGV2ZXJ5IHRpbWUsIG90aGVyd2lzZSB3ZVxuICAgIC8vIHJpc2sgaXQgc3RheWluZyBhdHRhY2hlZCB0byBhIHBhbmUgdGhhdCdzIG5vIGxvbmdlciBpbiB0aGUgRE9NLlxuICAgIGVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKHRoaXMuX291dGxldC5vdXRsZXRFbGVtZW50LCBlbGVtZW50KTtcblxuICAgIC8vIFdoZW4gYE1hdE1lbnVDb250ZW50YCBpcyB1c2VkIGluIGFuIGBPblB1c2hgIGNvbXBvbmVudCwgdGhlIGluc2VydGlvbiBvZiB0aGUgbWVudVxuICAgIC8vIGNvbnRlbnQgdmlhIGBjcmVhdGVFbWJlZGRlZFZpZXdgIGRvZXMgbm90IGNhdXNlIHRoZSBjb250ZW50IHRvIGJlIHNlZW4gYXMgXCJkaXJ0eVwiXG4gICAgLy8gYnkgQW5ndWxhci4gVGhpcyBjYXVzZXMgdGhlIGBAQ29udGVudENoaWxkcmVuYCBmb3IgbWVudSBpdGVtcyB3aXRoaW4gdGhlIG1lbnUgdG9cbiAgICAvLyBub3QgYmUgdXBkYXRlZCBieSBBbmd1bGFyLiBCeSBleHBsaWNpdGx5IG1hcmtpbmcgZm9yIGNoZWNrIGhlcmUsIHdlIHRlbGwgQW5ndWxhciB0aGF0XG4gICAgLy8gaXQgbmVlZHMgdG8gY2hlY2sgZm9yIG5ldyBtZW51IGl0ZW1zIGFuZCB1cGRhdGUgdGhlIGBAQ29udGVudENoaWxkYCBpbiBgTWF0TWVudWAuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBNYWtlIGNoYW5nZSBkZXRlY3RvciByZWYgcmVxdWlyZWRcbiAgICBpZiAodGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHRoaXMuX3BvcnRhbC5hdHRhY2godGhpcy5fb3V0bGV0LCBjb250ZXh0KTtcbiAgICB0aGlzLl9hdHRhY2hlZC5uZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoZXMgdGhlIGNvbnRlbnQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGRldGFjaCgpIHtcbiAgICBpZiAodGhpcy5fcG9ydGFsLmlzQXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX3BvcnRhbC5kZXRhY2goKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fb3V0bGV0KSB7XG4gICAgICB0aGlzLl9vdXRsZXQuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxufVxuIl19
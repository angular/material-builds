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
class _MatMenuContentBase {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: _MatMenuContentBase, deps: [{ token: i0.TemplateRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: _MatMenuContentBase, ngImport: i0 }); }
}
export { _MatMenuContentBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: _MatMenuContentBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }]; } });
/** Menu content that will be rendered lazily once the menu is opened. */
class MatMenuContent extends _MatMenuContentBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatMenuContent, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatMenuContent, selector: "ng-template[matMenuContent]", providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }], usesInheritance: true, ngImport: i0 }); }
}
export { MatMenuContent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatMenuContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matMenuContent]',
                    providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsTUFBTSxFQUNOLGNBQWMsRUFDZCxRQUFRLEVBRVIsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxjQUFjLENBQWlCLGdCQUFnQixDQUFDLENBQUM7QUFFckYsTUFDc0IsbUJBQW1CO0lBK0J2QyxZQUNVLFNBQTJCLEVBQzNCLHlCQUFtRCxFQUNuRCxPQUF1QixFQUN2QixTQUFtQixFQUNuQixpQkFBbUMsRUFDakIsU0FBYyxFQUNoQyxrQkFBc0M7UUFOdEMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBbENoRCxxREFBcUQ7UUFDNUMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFrQ3RDLENBQUM7SUFFSjs7O09BR0c7SUFDSCxNQUFNLENBQUMsVUFBZSxFQUFFO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUMzRTtRQUVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUNuQyxJQUFJLENBQUMseUJBQXlCLEVBQzlCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFNBQVMsQ0FDZixDQUFDO1NBQ0g7UUFFRCxNQUFNLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBRXJFLDZGQUE2RjtRQUM3RiwwRkFBMEY7UUFDMUYsa0VBQWtFO1FBQ2xFLE9BQU8sQ0FBQyxVQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRFLG9GQUFvRjtRQUNwRixvRkFBb0Y7UUFDcEYsbUZBQW1GO1FBQ25GLHdGQUF3RjtRQUN4RixvRkFBb0Y7UUFDcEYsMkRBQTJEO1FBQzNELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQzs4R0E3Rm1CLG1CQUFtQiwyS0FxQzdCLFFBQVE7a0dBckNFLG1CQUFtQjs7U0FBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRHhDLFNBQVM7OzBCQXNDTCxNQUFNOzJCQUFDLFFBQVE7O0FBMkRwQix5RUFBeUU7QUFDekUsTUFJYSxjQUFlLFNBQVEsbUJBQW1COzhHQUExQyxjQUFjO2tHQUFkLGNBQWMsc0RBRmQsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLENBQUM7O1NBRTFELGNBQWM7MkZBQWQsY0FBYztrQkFKMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLGdCQUFnQixFQUFDLENBQUM7aUJBQ3RFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RG9tUG9ydGFsT3V0bGV0LCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIERpcmVjdGl2ZSxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRNZW51Q29udGVudGAuIEl0IHNlcnZlc1xuICogYXMgYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0TWVudUNvbnRlbnRgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfQ09OVEVOVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRNZW51Q29udGVudD4oJ01hdE1lbnVDb250ZW50Jyk7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRNZW51Q29udGVudEJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9wb3J0YWw6IFRlbXBsYXRlUG9ydGFsPGFueT47XG4gIHByaXZhdGUgX291dGxldDogRG9tUG9ydGFsT3V0bGV0O1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBtZW51IGNvbnRlbnQgaGFzIGJlZW4gYXR0YWNoZWQuICovXG4gIHJlYWRvbmx5IF9hdHRhY2hlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBkb2N1bWVudDogYW55LFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgYGNoYW5nZURldGVjdG9yUmVmYCBpcyBub3cgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgZG9jdW1lbnQ6IGFueSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmLFxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgX2FwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmLFxuICApIHt9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBjb250ZW50IHdpdGggYSBwYXJ0aWN1bGFyIGNvbnRleHQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGF0dGFjaChjb250ZXh0OiBhbnkgPSB7fSkge1xuICAgIGlmICghdGhpcy5fcG9ydGFsKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5fdGVtcGxhdGUsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIH1cblxuICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICBpZiAoIXRoaXMuX291dGxldCkge1xuICAgICAgdGhpcy5fb3V0bGV0ID0gbmV3IERvbVBvcnRhbE91dGxldChcbiAgICAgICAgdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgdGhpcy5fYXBwUmVmLFxuICAgICAgICB0aGlzLl9pbmplY3RvcixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl90ZW1wbGF0ZS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBCZWNhdXNlIHdlIHN1cHBvcnQgb3BlbmluZyB0aGUgc2FtZSBtZW51IGZyb20gZGlmZmVyZW50IHRyaWdnZXJzICh3aGljaCBpbiB0dXJuIGhhdmUgdGhlaXJcbiAgICAvLyBvd24gYE92ZXJsYXlSZWZgIHBhbmVsKSwgd2UgaGF2ZSB0byByZS1pbnNlcnQgdGhlIGhvc3QgZWxlbWVudCBldmVyeSB0aW1lLCBvdGhlcndpc2Ugd2VcbiAgICAvLyByaXNrIGl0IHN0YXlpbmcgYXR0YWNoZWQgdG8gYSBwYW5lIHRoYXQncyBubyBsb25nZXIgaW4gdGhlIERPTS5cbiAgICBlbGVtZW50LnBhcmVudE5vZGUhLmluc2VydEJlZm9yZSh0aGlzLl9vdXRsZXQub3V0bGV0RWxlbWVudCwgZWxlbWVudCk7XG5cbiAgICAvLyBXaGVuIGBNYXRNZW51Q29udGVudGAgaXMgdXNlZCBpbiBhbiBgT25QdXNoYCBjb21wb25lbnQsIHRoZSBpbnNlcnRpb24gb2YgdGhlIG1lbnVcbiAgICAvLyBjb250ZW50IHZpYSBgY3JlYXRlRW1iZWRkZWRWaWV3YCBkb2VzIG5vdCBjYXVzZSB0aGUgY29udGVudCB0byBiZSBzZWVuIGFzIFwiZGlydHlcIlxuICAgIC8vIGJ5IEFuZ3VsYXIuIFRoaXMgY2F1c2VzIHRoZSBgQENvbnRlbnRDaGlsZHJlbmAgZm9yIG1lbnUgaXRlbXMgd2l0aGluIHRoZSBtZW51IHRvXG4gICAgLy8gbm90IGJlIHVwZGF0ZWQgYnkgQW5ndWxhci4gQnkgZXhwbGljaXRseSBtYXJraW5nIGZvciBjaGVjayBoZXJlLCB3ZSB0ZWxsIEFuZ3VsYXIgdGhhdFxuICAgIC8vIGl0IG5lZWRzIHRvIGNoZWNrIGZvciBuZXcgbWVudSBpdGVtcyBhbmQgdXBkYXRlIHRoZSBgQENvbnRlbnRDaGlsZGAgaW4gYE1hdE1lbnVgLlxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgTWFrZSBjaGFuZ2UgZGV0ZWN0b3IgcmVmIHJlcXVpcmVkXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWY/Lm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMuX3BvcnRhbC5hdHRhY2godGhpcy5fb3V0bGV0LCBjb250ZXh0KTtcbiAgICB0aGlzLl9hdHRhY2hlZC5uZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoZXMgdGhlIGNvbnRlbnQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGRldGFjaCgpIHtcbiAgICBpZiAodGhpcy5fcG9ydGFsLmlzQXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX3BvcnRhbC5kZXRhY2goKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fb3V0bGV0KSB7XG4gICAgICB0aGlzLl9vdXRsZXQuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkgb25jZSB0aGUgbWVudSBpcyBvcGVuZWQuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVttYXRNZW51Q29udGVudF0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX01FTlVfQ09OVEVOVCwgdXNlRXhpc3Rpbmc6IE1hdE1lbnVDb250ZW50fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVDb250ZW50IGV4dGVuZHMgX01hdE1lbnVDb250ZW50QmFzZSB7fVxuIl19
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, Inject, Injector, TemplateRef, ViewContainerRef, } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * Menu content that will be rendered lazily once the menu is opened.
 */
let MatMenuContent = /** @class */ (() => {
    let MatMenuContent = class MatMenuContent {
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
            if (this._changeDetectorRef) {
                this._changeDetectorRef.markForCheck();
            }
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
    };
    MatMenuContent = __decorate([
        Directive({
            selector: 'ng-template[matMenuContent]'
        }),
        __param(5, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [TemplateRef,
            ComponentFactoryResolver,
            ApplicationRef,
            Injector,
            ViewContainerRef, Object, ChangeDetectorRef])
    ], MatMenuContent);
    return MatMenuContent;
})();
export { MatMenuContent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLGlCQUFpQixFQUNqQix3QkFBd0IsRUFDeEIsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBRVIsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTdCOztHQUVHO0FBSUg7SUFBQSxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO1FBT3pCLFlBQ1UsU0FBMkIsRUFDM0IseUJBQW1ELEVBQ25ELE9BQXVCLEVBQ3ZCLFNBQW1CLEVBQ25CLGlCQUFtQyxFQUNqQixTQUFjLEVBQ2hDLGtCQUFzQztZQU50QyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtZQUMzQiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTBCO1lBQ25ELFlBQU8sR0FBUCxPQUFPLENBQWdCO1lBQ3ZCLGNBQVMsR0FBVCxTQUFTLENBQVU7WUFDbkIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtZQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFLO1lBQ2hDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7WUFWaEQscURBQXFEO1lBQ3JELGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBU21CLENBQUM7UUFFcEQ7OztXQUdHO1FBQ0gsTUFBTSxDQUFDLFVBQWUsRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzNFO1lBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRWQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQ2xFLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNuRTtZQUVELE1BQU0sT0FBTyxHQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7WUFFckUsNkZBQTZGO1lBQzdGLDBGQUEwRjtZQUMxRixrRUFBa0U7WUFDbEUsT0FBTyxDQUFDLFVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFdEUsb0ZBQW9GO1lBQ3BGLG9GQUFvRjtZQUNwRixtRkFBbUY7WUFDbkYsd0ZBQXdGO1lBQ3hGLG9GQUFvRjtZQUNwRiwyREFBMkQ7WUFDM0QsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUN4QztZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsTUFBTTtZQUNKLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDdkI7UUFDSCxDQUFDO1FBRUQsV0FBVztZQUNULElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUN4QjtRQUNILENBQUM7S0FDRixDQUFBO0lBcEVZLGNBQWM7UUFIMUIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDZCQUE2QjtTQUN4QyxDQUFDO1FBY0csV0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7eUNBTEUsV0FBVztZQUNLLHdCQUF3QjtZQUMxQyxjQUFjO1lBQ1osUUFBUTtZQUNBLGdCQUFnQixVQUVkLGlCQUFpQjtPQWRyQyxjQUFjLENBb0UxQjtJQUFELHFCQUFDO0tBQUE7U0FwRVksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RvbVBvcnRhbE91dGxldCwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFwcGxpY2F0aW9uUmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBNZW51IGNvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseSBvbmNlIHRoZSBtZW51IGlzIG9wZW5lZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbbWF0TWVudUNvbnRlbnRdJ1xufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51Q29udGVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw8YW55PjtcbiAgcHJpdmF0ZSBfb3V0bGV0OiBEb21Qb3J0YWxPdXRsZXQ7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIG1lbnUgY29udGVudCBoYXMgYmVlbiBhdHRhY2hlZC4gKi9cbiAgX2F0dGFjaGVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF90ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIF9hcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIGNvbnRlbnQgd2l0aCBhIHBhcnRpY3VsYXIgY29udGV4dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgYXR0YWNoKGNvbnRleHQ6IGFueSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLl9wb3J0YWwpIHtcbiAgICAgIHRoaXMuX3BvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLl90ZW1wbGF0ZSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgfVxuXG4gICAgdGhpcy5kZXRhY2goKTtcblxuICAgIGlmICghdGhpcy5fb3V0bGV0KSB7XG4gICAgICB0aGlzLl9vdXRsZXQgPSBuZXcgRG9tUG9ydGFsT3V0bGV0KHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgdGhpcy5fYXBwUmVmLCB0aGlzLl9pbmplY3Rvcik7XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl90ZW1wbGF0ZS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBCZWNhdXNlIHdlIHN1cHBvcnQgb3BlbmluZyB0aGUgc2FtZSBtZW51IGZyb20gZGlmZmVyZW50IHRyaWdnZXJzICh3aGljaCBpbiB0dXJuIGhhdmUgdGhlaXJcbiAgICAvLyBvd24gYE92ZXJsYXlSZWZgIHBhbmVsKSwgd2UgaGF2ZSB0byByZS1pbnNlcnQgdGhlIGhvc3QgZWxlbWVudCBldmVyeSB0aW1lLCBvdGhlcndpc2Ugd2VcbiAgICAvLyByaXNrIGl0IHN0YXlpbmcgYXR0YWNoZWQgdG8gYSBwYW5lIHRoYXQncyBubyBsb25nZXIgaW4gdGhlIERPTS5cbiAgICBlbGVtZW50LnBhcmVudE5vZGUhLmluc2VydEJlZm9yZSh0aGlzLl9vdXRsZXQub3V0bGV0RWxlbWVudCwgZWxlbWVudCk7XG5cbiAgICAvLyBXaGVuIGBNYXRNZW51Q29udGVudGAgaXMgdXNlZCBpbiBhbiBgT25QdXNoYCBjb21wb25lbnQsIHRoZSBpbnNlcnRpb24gb2YgdGhlIG1lbnVcbiAgICAvLyBjb250ZW50IHZpYSBgY3JlYXRlRW1iZWRkZWRWaWV3YCBkb2VzIG5vdCBjYXVzZSB0aGUgY29udGVudCB0byBiZSBzZWVuIGFzIFwiZGlydHlcIlxuICAgIC8vIGJ5IEFuZ3VsYXIuIFRoaXMgY2F1c2VzIHRoZSBgQENvbnRlbnRDaGlsZHJlbmAgZm9yIG1lbnUgaXRlbXMgd2l0aGluIHRoZSBtZW51IHRvXG4gICAgLy8gbm90IGJlIHVwZGF0ZWQgYnkgQW5ndWxhci4gQnkgZXhwbGljaXRseSBtYXJraW5nIGZvciBjaGVjayBoZXJlLCB3ZSB0ZWxsIEFuZ3VsYXIgdGhhdFxuICAgIC8vIGl0IG5lZWRzIHRvIGNoZWNrIGZvciBuZXcgbWVudSBpdGVtcyBhbmQgdXBkYXRlIHRoZSBgQENvbnRlbnRDaGlsZGAgaW4gYE1hdE1lbnVgLlxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgTWFrZSBjaGFuZ2UgZGV0ZWN0b3IgcmVmIHJlcXVpcmVkXG4gICAgaWYgKHRoaXMuX2NoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wb3J0YWwuYXR0YWNoKHRoaXMuX291dGxldCwgY29udGV4dCk7XG4gICAgdGhpcy5fYXR0YWNoZWQubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGFjaGVzIHRoZSBjb250ZW50LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBkZXRhY2goKSB7XG4gICAgaWYgKHRoaXMuX3BvcnRhbC5pc0F0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9wb3J0YWwuZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX291dGxldCkge1xuICAgICAgdGhpcy5fb3V0bGV0LmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
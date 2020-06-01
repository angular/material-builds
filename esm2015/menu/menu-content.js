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
let MatMenuContent = /** @class */ (() => {
    class MatMenuContent {
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
    return MatMenuContent;
})();
export { MatMenuContent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsTUFBTSxFQUNOLFFBQVEsRUFFUixXQUFXLEVBQ1gsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0I7O0dBRUc7QUFDSDtJQUFBLE1BR2EsY0FBYztRQU96QixZQUNVLFNBQTJCLEVBQzNCLHlCQUFtRCxFQUNuRCxPQUF1QixFQUN2QixTQUFtQixFQUNuQixpQkFBbUMsRUFDakIsU0FBYyxFQUNoQyxrQkFBc0M7WUFOdEMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7WUFDM0IsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtZQUNuRCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtZQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFVO1lBQ25CLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7WUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBSztZQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1lBVmhELHFEQUFxRDtZQUNyRCxjQUFTLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQVNtQixDQUFDO1FBRXBEOzs7V0FHRztRQUNILE1BQU0sQ0FBQyxVQUFlLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUMzRTtZQUVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUNsRSxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDbkU7WUFFRCxNQUFNLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1lBRXJFLDZGQUE2RjtZQUM3RiwwRkFBMEY7WUFDMUYsa0VBQWtFO1lBQ2xFLE9BQU8sQ0FBQyxVQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXRFLG9GQUFvRjtZQUNwRixvRkFBb0Y7WUFDcEYsbUZBQW1GO1lBQ25GLHdGQUF3RjtZQUN4RixvRkFBb0Y7WUFDcEYsMkRBQTJEO1lBQzNELElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDeEM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEIsQ0FBQztRQUVEOzs7V0FHRztRQUNILE1BQU07WUFDSixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQztRQUVELFdBQVc7WUFDVCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDeEI7UUFDSCxDQUFDOzs7Z0JBdEVGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO2lCQUN4Qzs7OztnQkFWQyxXQUFXO2dCQUxYLHdCQUF3QjtnQkFGeEIsY0FBYztnQkFLZCxRQUFRO2dCQUdSLGdCQUFnQjtnREF1QmIsTUFBTSxTQUFDLFFBQVE7Z0JBOUJsQixpQkFBaUI7O0lBcUZuQixxQkFBQztLQUFBO1NBcEVZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEb21Qb3J0YWxPdXRsZXQsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBcHBsaWNhdGlvblJlZixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRGlyZWN0aXZlLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkgb25jZSB0aGUgbWVudSBpcyBvcGVuZWQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW21hdE1lbnVDb250ZW50XSdcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudUNvbnRlbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9wb3J0YWw6IFRlbXBsYXRlUG9ydGFsPGFueT47XG4gIHByaXZhdGUgX291dGxldDogRG9tUG9ydGFsT3V0bGV0O1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBtZW51IGNvbnRlbnQgaGFzIGJlZW4gYXR0YWNoZWQuICovXG4gIF9hdHRhY2hlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgcHJpdmF0ZSBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBfYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBjb250ZW50IHdpdGggYSBwYXJ0aWN1bGFyIGNvbnRleHQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGF0dGFjaChjb250ZXh0OiBhbnkgPSB7fSkge1xuICAgIGlmICghdGhpcy5fcG9ydGFsKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5fdGVtcGxhdGUsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIH1cblxuICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICBpZiAoIXRoaXMuX291dGxldCkge1xuICAgICAgdGhpcy5fb3V0bGV0ID0gbmV3IERvbVBvcnRhbE91dGxldCh0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHRoaXMuX2FwcFJlZiwgdGhpcy5faW5qZWN0b3IpO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fdGVtcGxhdGUuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gQmVjYXVzZSB3ZSBzdXBwb3J0IG9wZW5pbmcgdGhlIHNhbWUgbWVudSBmcm9tIGRpZmZlcmVudCB0cmlnZ2VycyAod2hpY2ggaW4gdHVybiBoYXZlIHRoZWlyXG4gICAgLy8gb3duIGBPdmVybGF5UmVmYCBwYW5lbCksIHdlIGhhdmUgdG8gcmUtaW5zZXJ0IHRoZSBob3N0IGVsZW1lbnQgZXZlcnkgdGltZSwgb3RoZXJ3aXNlIHdlXG4gICAgLy8gcmlzayBpdCBzdGF5aW5nIGF0dGFjaGVkIHRvIGEgcGFuZSB0aGF0J3Mgbm8gbG9uZ2VyIGluIHRoZSBET00uXG4gICAgZWxlbWVudC5wYXJlbnROb2RlIS5pbnNlcnRCZWZvcmUodGhpcy5fb3V0bGV0Lm91dGxldEVsZW1lbnQsIGVsZW1lbnQpO1xuXG4gICAgLy8gV2hlbiBgTWF0TWVudUNvbnRlbnRgIGlzIHVzZWQgaW4gYW4gYE9uUHVzaGAgY29tcG9uZW50LCB0aGUgaW5zZXJ0aW9uIG9mIHRoZSBtZW51XG4gICAgLy8gY29udGVudCB2aWEgYGNyZWF0ZUVtYmVkZGVkVmlld2AgZG9lcyBub3QgY2F1c2UgdGhlIGNvbnRlbnQgdG8gYmUgc2VlbiBhcyBcImRpcnR5XCJcbiAgICAvLyBieSBBbmd1bGFyLiBUaGlzIGNhdXNlcyB0aGUgYEBDb250ZW50Q2hpbGRyZW5gIGZvciBtZW51IGl0ZW1zIHdpdGhpbiB0aGUgbWVudSB0b1xuICAgIC8vIG5vdCBiZSB1cGRhdGVkIGJ5IEFuZ3VsYXIuIEJ5IGV4cGxpY2l0bHkgbWFya2luZyBmb3IgY2hlY2sgaGVyZSwgd2UgdGVsbCBBbmd1bGFyIHRoYXRcbiAgICAvLyBpdCBuZWVkcyB0byBjaGVjayBmb3IgbmV3IG1lbnUgaXRlbXMgYW5kIHVwZGF0ZSB0aGUgYEBDb250ZW50Q2hpbGRgIGluIGBNYXRNZW51YC5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIE1ha2UgY2hhbmdlIGRldGVjdG9yIHJlZiByZXF1aXJlZFxuICAgIGlmICh0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fcG9ydGFsLmF0dGFjaCh0aGlzLl9vdXRsZXQsIGNvbnRleHQpO1xuICAgIHRoaXMuX2F0dGFjaGVkLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRhY2hlcyB0aGUgY29udGVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZGV0YWNoKCkge1xuICAgIGlmICh0aGlzLl9wb3J0YWwuaXNBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fcG9ydGFsLmRldGFjaCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9vdXRsZXQpIHtcbiAgICAgIHRoaXMuX291dGxldC5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=
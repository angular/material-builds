import { __decorate, __metadata, __param } from "tslib";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, Injector, Optional, SkipSelf, TemplateRef, InjectionToken, Inject, } from '@angular/core';
import { Location } from '@angular/common';
import { of as observableOf } from 'rxjs';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetConfig } from './bottom-sheet-config';
import { MatBottomSheetContainer } from './bottom-sheet-container';
import { MatBottomSheetModule } from './bottom-sheet-module';
import { MatBottomSheetRef } from './bottom-sheet-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/common";
import * as i3 from "./bottom-sheet-module";
/** Injection token that can be used to specify default bottom sheet options. */
export const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken('mat-bottom-sheet-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
let MatBottomSheet = /** @class */ (() => {
    let MatBottomSheet = class MatBottomSheet {
        constructor(_overlay, _injector, _parentBottomSheet, _location, _defaultOptions) {
            this._overlay = _overlay;
            this._injector = _injector;
            this._parentBottomSheet = _parentBottomSheet;
            this._location = _location;
            this._defaultOptions = _defaultOptions;
            this._bottomSheetRefAtThisLevel = null;
        }
        /** Reference to the currently opened bottom sheet. */
        get _openedBottomSheetRef() {
            const parent = this._parentBottomSheet;
            return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
        }
        set _openedBottomSheetRef(value) {
            if (this._parentBottomSheet) {
                this._parentBottomSheet._openedBottomSheetRef = value;
            }
            else {
                this._bottomSheetRefAtThisLevel = value;
            }
        }
        open(componentOrTemplateRef, config) {
            const _config = _applyConfigDefaults(this._defaultOptions || new MatBottomSheetConfig(), config);
            const overlayRef = this._createOverlay(_config);
            const container = this._attachContainer(overlayRef, _config);
            const ref = new MatBottomSheetRef(container, overlayRef, this._location);
            if (componentOrTemplateRef instanceof TemplateRef) {
                container.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, {
                    $implicit: _config.data,
                    bottomSheetRef: ref
                }));
            }
            else {
                const portal = new ComponentPortal(componentOrTemplateRef, undefined, this._createInjector(_config, ref));
                const contentRef = container.attachComponentPortal(portal);
                ref.instance = contentRef.instance;
            }
            // When the bottom sheet is dismissed, clear the reference to it.
            ref.afterDismissed().subscribe(() => {
                // Clear the bottom sheet ref if it hasn't already been replaced by a newer one.
                if (this._openedBottomSheetRef == ref) {
                    this._openedBottomSheetRef = null;
                }
            });
            if (this._openedBottomSheetRef) {
                // If a bottom sheet is already in view, dismiss it and enter the
                // new bottom sheet after exit animation is complete.
                this._openedBottomSheetRef.afterDismissed().subscribe(() => ref.containerInstance.enter());
                this._openedBottomSheetRef.dismiss();
            }
            else {
                // If no bottom sheet is in view, enter the new bottom sheet.
                ref.containerInstance.enter();
            }
            this._openedBottomSheetRef = ref;
            return ref;
        }
        /**
         * Dismisses the currently-visible bottom sheet.
         * @param result Data to pass to the bottom sheet instance.
         */
        dismiss(result) {
            if (this._openedBottomSheetRef) {
                this._openedBottomSheetRef.dismiss(result);
            }
        }
        ngOnDestroy() {
            if (this._bottomSheetRefAtThisLevel) {
                this._bottomSheetRefAtThisLevel.dismiss();
            }
        }
        /**
         * Attaches the bottom sheet container component to the overlay.
         */
        _attachContainer(overlayRef, config) {
            const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            const injector = new PortalInjector(userInjector || this._injector, new WeakMap([
                [MatBottomSheetConfig, config]
            ]));
            const containerPortal = new ComponentPortal(MatBottomSheetContainer, config.viewContainerRef, injector);
            const containerRef = overlayRef.attach(containerPortal);
            return containerRef.instance;
        }
        /**
         * Creates a new overlay and places it in the correct location.
         * @param config The user-specified bottom sheet config.
         */
        _createOverlay(config) {
            const overlayConfig = new OverlayConfig({
                direction: config.direction,
                hasBackdrop: config.hasBackdrop,
                disposeOnNavigation: config.closeOnNavigation,
                maxWidth: '100%',
                scrollStrategy: config.scrollStrategy || this._overlay.scrollStrategies.block(),
                positionStrategy: this._overlay.position().global().centerHorizontally().bottom('0')
            });
            if (config.backdropClass) {
                overlayConfig.backdropClass = config.backdropClass;
            }
            return this._overlay.create(overlayConfig);
        }
        /**
         * Creates an injector to be used inside of a bottom sheet component.
         * @param config Config that was used to create the bottom sheet.
         * @param bottomSheetRef Reference to the bottom sheet.
         */
        _createInjector(config, bottomSheetRef) {
            const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
            const injectionTokens = new WeakMap([
                [MatBottomSheetRef, bottomSheetRef],
                [MAT_BOTTOM_SHEET_DATA, config.data]
            ]);
            if (config.direction &&
                (!userInjector || !userInjector.get(Directionality, null))) {
                injectionTokens.set(Directionality, {
                    value: config.direction,
                    change: observableOf()
                });
            }
            return new PortalInjector(userInjector || this._injector, injectionTokens);
        }
    };
    MatBottomSheet.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatBottomSheet_Factory() { return new MatBottomSheet(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(MatBottomSheet, 12), i0.ɵɵinject(i2.Location, 8), i0.ɵɵinject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, 8)); }, token: MatBottomSheet, providedIn: i3.MatBottomSheetModule });
    MatBottomSheet = __decorate([
        Injectable({ providedIn: MatBottomSheetModule }),
        __param(2, Optional()), __param(2, SkipSelf()),
        __param(3, Optional()),
        __param(4, Optional()), __param(4, Inject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS)),
        __metadata("design:paramtypes", [Overlay,
            Injector,
            MatBottomSheet,
            Location,
            MatBottomSheetConfig])
    ], MatBottomSheet);
    return MatBottomSheet;
})();
export { MatBottomSheet };
/**
 * Applies default options to the bottom sheet config.
 * @param defaults Object containing the default values to which to fall back.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(defaults, config) {
    return Object.assign(Object.assign({}, defaults), config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBRSxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRyxPQUFPLEVBRUwsVUFBVSxFQUNWLFFBQVEsRUFDUixRQUFRLEVBQ1IsUUFBUSxFQUNSLFdBQVcsRUFDWCxjQUFjLEVBQ2QsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsRUFBRSxJQUFJLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN4QyxPQUFPLEVBQUMscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRixPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7QUFHckQsZ0ZBQWdGO0FBQ2hGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUN6QyxJQUFJLGNBQWMsQ0FBdUIsa0NBQWtDLENBQUMsQ0FBQztBQUVqRjs7R0FFRztBQUVIO0lBQUEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBYztRQWlCekIsWUFDWSxRQUFpQixFQUNqQixTQUFtQixFQUNLLGtCQUFrQyxFQUM5QyxTQUFvQixF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QUMsQ0FBQztRQUM3RSxDQUFDO0tBQ0YsQ0FBQTs7SUF4SlksY0FBYztRQUQxQixVQUFVLENBQUMsRUFBQyxVQUFVLEVBQUUsb0JBQW9CLEVBQUMsQ0FBQztRQXFCeEMsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsUUFBUSxFQUFFLENBQUE7UUFDdEIsV0FBQSxRQUFRLEVBQUUsQ0FBQTtRQUNWLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO3lDQUpuQyxPQUFPO1lBQ04sUUFBUTtZQUN5QixjQUFjO1lBQ2xDLFFBQVE7WUFFVixvQkFBb0I7T0F2QjNDLGNBQWMsQ0F3SjFCO3lCQTlMRDtLQThMQztTQXhKWSxjQUFjO0FBMEozQjs7Ozs7R0FLRztBQUNILFNBQVMsb0JBQW9CLENBQUMsUUFBOEIsRUFDOUIsTUFBNkI7SUFDekQsdUNBQVcsUUFBUSxHQUFLLE1BQU0sRUFBRTtBQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFBvcnRhbEluamVjdG9yLCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRSZWYsXG4gIEluamVjdGFibGUsXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7b2YgYXMgb2JzZXJ2YWJsZU9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7TUFUX0JPVFRPTV9TSEVFVF9EQVRBLCBNYXRCb3R0b21TaGVldENvbmZpZ30gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29uZmlnJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRDb250YWluZXJ9IGZyb20gJy4vYm90dG9tLXNoZWV0LWNvbnRhaW5lcic7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0TW9kdWxlfSBmcm9tICcuL2JvdHRvbS1zaGVldC1tb2R1bGUnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldFJlZn0gZnJvbSAnLi9ib3R0b20tc2hlZXQtcmVmJztcblxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IGJvdHRvbSBzaGVldCBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CT1RUT01fU0hFRVRfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Qm90dG9tU2hlZXRDb25maWc+KCdtYXQtYm90dG9tLXNoZWV0LWRlZmF1bHQtb3B0aW9ucycpO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gdHJpZ2dlciBNYXRlcmlhbCBEZXNpZ24gYm90dG9tIHNoZWV0cy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IE1hdEJvdHRvbVNoZWV0TW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWw6IE1hdEJvdHRvbVNoZWV0UmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgb3BlbmVkIGJvdHRvbSBzaGVldC4gKi9cbiAgZ2V0IF9vcGVuZWRCb3R0b21TaGVldFJlZigpOiBNYXRCb3R0b21TaGVldFJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50Qm90dG9tU2hlZXQ7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkQm90dG9tU2hlZXRSZWYgOiB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRCb3R0b21TaGVldFJlZih2YWx1ZTogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50Qm90dG9tU2hlZXQpIHtcbiAgICAgIHRoaXMuX3BhcmVudEJvdHRvbVNoZWV0Ll9vcGVuZWRCb3R0b21TaGVldFJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50Qm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0LFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfbG9jYXRpb24/OiBMb2NhdGlvbixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0JPVFRPTV9TSEVFVF9ERUZBVUxUX09QVElPTlMpXG4gICAgICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRCb3R0b21TaGVldENvbmZpZykge31cblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPixcbiAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPik6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+O1xuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxUPixcbiAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPik6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQ+KTogTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4ge1xuXG4gICAgY29uc3QgX2NvbmZpZyA9XG4gICAgICAgIF9hcHBseUNvbmZpZ0RlZmF1bHRzKHRoaXMuX2RlZmF1bHRPcHRpb25zIHx8IG5ldyBNYXRCb3R0b21TaGVldENvbmZpZygpLCBjb25maWcpO1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KF9jb25maWcpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2F0dGFjaENvbnRhaW5lcihvdmVybGF5UmVmLCBfY29uZmlnKTtcbiAgICBjb25zdCByZWYgPSBuZXcgTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4oY29udGFpbmVyLCBvdmVybGF5UmVmLCB0aGlzLl9sb2NhdGlvbik7XG5cbiAgICBpZiAoY29tcG9uZW50T3JUZW1wbGF0ZVJlZiBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb250YWluZXIuYXR0YWNoVGVtcGxhdGVQb3J0YWwobmV3IFRlbXBsYXRlUG9ydGFsPFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIG51bGwhLCB7XG4gICAgICAgICRpbXBsaWNpdDogX2NvbmZpZy5kYXRhLFxuICAgICAgICBib3R0b21TaGVldFJlZjogcmVmXG4gICAgICB9IGFzIGFueSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUluamVjdG9yKF9jb25maWcsIHJlZikpO1xuICAgICAgY29uc3QgY29udGVudFJlZiA9IGNvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgICAgIHJlZi5pbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgYm90dG9tIHNoZWV0IGlzIGRpc21pc3NlZCwgY2xlYXIgdGhlIHJlZmVyZW5jZSB0byBpdC5cbiAgICByZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQ2xlYXIgdGhlIGJvdHRvbSBzaGVldCByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIG9uZS5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZiA9PSByZWYpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmKSB7XG4gICAgICAvLyBJZiBhIGJvdHRvbSBzaGVldCBpcyBhbHJlYWR5IGluIHZpZXcsIGRpc21pc3MgaXQgYW5kIGVudGVyIHRoZVxuICAgICAgLy8gbmV3IGJvdHRvbSBzaGVldCBhZnRlciBleGl0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpKTtcbiAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmLmRpc21pc3MoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gYm90dG9tIHNoZWV0IGlzIGluIHZpZXcsIGVudGVyIHRoZSBuZXcgYm90dG9tIHNoZWV0LlxuICAgICAgcmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPSByZWY7XG5cbiAgICByZXR1cm4gcmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgY3VycmVudGx5LXZpc2libGUgYm90dG9tIHNoZWV0LlxuICAgKiBAcGFyYW0gcmVzdWx0IERhdGEgdG8gcGFzcyB0byB0aGUgYm90dG9tIHNoZWV0IGluc3RhbmNlLlxuICAgKi9cbiAgZGlzbWlzczxSID0gYW55PihyZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmKSB7XG4gICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZi5kaXNtaXNzKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWwpIHtcbiAgICAgIHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWwuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgYm90dG9tIHNoZWV0IGNvbnRhaW5lciBjb21wb25lbnQgdG8gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hDb250YWluZXIob3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogTWF0Qm90dG9tU2hlZXRDb25maWcpOiBNYXRCb3R0b21TaGVldENvbnRhaW5lciB7XG5cbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgaW5qZWN0b3IgPSBuZXcgUG9ydGFsSW5qZWN0b3IodXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLCBuZXcgV2Vha01hcChbXG4gICAgICBbTWF0Qm90dG9tU2hlZXRDb25maWcsIGNvbmZpZ11cbiAgICBdKSk7XG5cbiAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPVxuICAgICAgICBuZXcgQ29tcG9uZW50UG9ydGFsKE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyLCBjb25maWcudmlld0NvbnRhaW5lclJlZiwgaW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyPiA9IG92ZXJsYXlSZWYuYXR0YWNoKGNvbnRhaW5lclBvcnRhbCk7XG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgdXNlci1zcGVjaWZpZWQgYm90dG9tIHNoZWV0IGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBkaXJlY3Rpb246IGNvbmZpZy5kaXJlY3Rpb24sXG4gICAgICBoYXNCYWNrZHJvcDogY29uZmlnLmhhc0JhY2tkcm9wLFxuICAgICAgZGlzcG9zZU9uTmF2aWdhdGlvbjogY29uZmlnLmNsb3NlT25OYXZpZ2F0aW9uLFxuICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiBjb25maWcuc2Nyb2xsU3RyYXRlZ3kgfHwgdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCksXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuYm90dG9tKCcwJylcbiAgICB9KTtcblxuICAgIGlmIChjb25maWcuYmFja2Ryb3BDbGFzcykge1xuICAgICAgb3ZlcmxheUNvbmZpZy5iYWNrZHJvcENsYXNzID0gY29uZmlnLmJhY2tkcm9wQ2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgb2YgYSBib3R0b20gc2hlZXQgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGUgYm90dG9tIHNoZWV0LlxuICAgKiBAcGFyYW0gYm90dG9tU2hlZXRSZWYgUmVmZXJlbmNlIHRvIHRoZSBib3R0b20gc2hlZXQuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihjb25maWc6IE1hdEJvdHRvbVNoZWV0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b21TaGVldFJlZjogTWF0Qm90dG9tU2hlZXRSZWY8VD4pOiBQb3J0YWxJbmplY3RvciB7XG5cbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgaW5qZWN0aW9uVG9rZW5zID0gbmV3IFdlYWtNYXA8YW55LCBhbnk+KFtcbiAgICAgIFtNYXRCb3R0b21TaGVldFJlZiwgYm90dG9tU2hlZXRSZWZdLFxuICAgICAgW01BVF9CT1RUT01fU0hFRVRfREFUQSwgY29uZmlnLmRhdGFdXG4gICAgXSk7XG5cbiAgICBpZiAoY29uZmlnLmRpcmVjdGlvbiAmJlxuICAgICAgICAoIXVzZXJJbmplY3RvciB8fCAhdXNlckluamVjdG9yLmdldDxEaXJlY3Rpb25hbGl0eSB8IG51bGw+KERpcmVjdGlvbmFsaXR5LCBudWxsKSkpIHtcbiAgICAgIGluamVjdGlvblRva2Vucy5zZXQoRGlyZWN0aW9uYWxpdHksIHtcbiAgICAgICAgdmFsdWU6IGNvbmZpZy5kaXJlY3Rpb24sXG4gICAgICAgIGNoYW5nZTogb2JzZXJ2YWJsZU9mKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUG9ydGFsSW5qZWN0b3IodXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLCBpbmplY3Rpb25Ub2tlbnMpO1xuICB9XG59XG5cbi8qKlxuICogQXBwbGllcyBkZWZhdWx0IG9wdGlvbnMgdG8gdGhlIGJvdHRvbSBzaGVldCBjb25maWcuXG4gKiBAcGFyYW0gZGVmYXVsdHMgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGRlZmF1bHQgdmFsdWVzIHRvIHdoaWNoIHRvIGZhbGwgYmFjay5cbiAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gdG8gd2hpY2ggdGhlIGRlZmF1bHRzIHdpbGwgYmUgYXBwbGllZC5cbiAqIEByZXR1cm5zIFRoZSBuZXcgY29uZmlndXJhdGlvbiBvYmplY3Qgd2l0aCBkZWZhdWx0cyBhcHBsaWVkLlxuICovXG5mdW5jdGlvbiBfYXBwbHlDb25maWdEZWZhdWx0cyhkZWZhdWx0czogTWF0Qm90dG9tU2hlZXRDb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZyk6IE1hdEJvdHRvbVNoZWV0Q29uZmlnIHtcbiAgcmV0dXJuIHsuLi5kZWZhdWx0cywgLi4uY29uZmlnfTtcbn1cbiJdfQ==
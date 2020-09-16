/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
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
export class MatBottomSheet {
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
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MatBottomSheetConfig, useValue: config }]
        });
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
        const providers = [
            { provide: MatBottomSheetRef, useValue: bottomSheetRef },
            { provide: MAT_BOTTOM_SHEET_DATA, useValue: config.data }
        ];
        if (config.direction &&
            (!userInjector || !userInjector.get(Directionality, null))) {
            providers.push({
                provide: Directionality,
                useValue: { value: config.direction, change: observableOf() }
            });
        }
        return Injector.create({ parent: userInjector || this._injector, providers });
    }
}
MatBottomSheet.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatBottomSheet_Factory() { return new MatBottomSheet(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(MatBottomSheet, 12), i0.ɵɵinject(i2.Location, 8), i0.ɵɵinject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, 8)); }, token: MatBottomSheet, providedIn: i3.MatBottomSheetModule });
MatBottomSheet.decorators = [
    { type: Injectable, args: [{ providedIn: MatBottomSheetModule },] }
];
MatBottomSheet.ctorParameters = () => [
    { type: Overlay },
    { type: Injector },
    { type: MatBottomSheet, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: Location, decorators: [{ type: Optional }] },
    { type: MatBottomSheetConfig, decorators: [{ type: Optional }, { type: Inject, args: [MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,] }] }
];
/**
 * Applies default options to the bottom sheet config.
 * @param defaults Object containing the default values to which to fall back.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(defaults, config) {
    return Object.assign(Object.assign({}, defaults), config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFhLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGVBQWUsRUFBaUIsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkYsT0FBTyxFQUVMLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLEVBQUUsSUFBSSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxFQUFDLHFCQUFxQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEYsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDakUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7O0FBR3JELGdGQUFnRjtBQUNoRixNQUFNLENBQUMsTUFBTSxnQ0FBZ0MsR0FDekMsSUFBSSxjQUFjLENBQXVCLGtDQUFrQyxDQUFDLENBQUM7QUFFakY7O0dBRUc7QUFFSCxNQUFNLE9BQU8sY0FBYztJQWlCekIsWUFDWSxRQUFpQixFQUNqQixTQUFtQixFQUNLLGtCQUFrQyxFQUM5QyxTQUFvQixFQUU1QixlQUFzQztRQUwxQyxhQUFRLEdBQVIs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QU0sRUFBRSxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7Ozs7WUF6SkYsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLG9CQUFvQixFQUFDOzs7WUE3QnRDLE9BQU87WUFLYixRQUFRO1lBNkNnRCxjQUFjLHVCQUFqRSxRQUFRLFlBQUksUUFBUTtZQXBDbkIsUUFBUSx1QkFxQ1QsUUFBUTtZQW5DZ0Isb0JBQW9CLHVCQW9DNUMsUUFBUSxZQUFJLE1BQU0sU0FBQyxnQ0FBZ0M7O0FBcUkxRDs7Ozs7R0FLRztBQUNILFNBQVMsb0JBQW9CLENBQUMsUUFBOEIsRUFDOUIsTUFBNkI7SUFDekQsdUNBQVcsUUFBUSxHQUFLLE1BQU0sRUFBRTtBQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9uRGVzdHJveSxcbiAgU3RhdGljUHJvdmlkZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7b2YgYXMgb2JzZXJ2YWJsZU9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7TUFUX0JPVFRPTV9TSEVFVF9EQVRBLCBNYXRCb3R0b21TaGVldENvbmZpZ30gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29uZmlnJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRDb250YWluZXJ9IGZyb20gJy4vYm90dG9tLXNoZWV0LWNvbnRhaW5lcic7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0TW9kdWxlfSBmcm9tICcuL2JvdHRvbS1zaGVldC1tb2R1bGUnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldFJlZn0gZnJvbSAnLi9ib3R0b20tc2hlZXQtcmVmJztcblxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IGJvdHRvbSBzaGVldCBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CT1RUT01fU0hFRVRfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Qm90dG9tU2hlZXRDb25maWc+KCdtYXQtYm90dG9tLXNoZWV0LWRlZmF1bHQtb3B0aW9ucycpO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gdHJpZ2dlciBNYXRlcmlhbCBEZXNpZ24gYm90dG9tIHNoZWV0cy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IE1hdEJvdHRvbVNoZWV0TW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWw6IE1hdEJvdHRvbVNoZWV0UmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgb3BlbmVkIGJvdHRvbSBzaGVldC4gKi9cbiAgZ2V0IF9vcGVuZWRCb3R0b21TaGVldFJlZigpOiBNYXRCb3R0b21TaGVldFJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50Qm90dG9tU2hlZXQ7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkQm90dG9tU2hlZXRSZWYgOiB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRCb3R0b21TaGVldFJlZih2YWx1ZTogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50Qm90dG9tU2hlZXQpIHtcbiAgICAgIHRoaXMuX3BhcmVudEJvdHRvbVNoZWV0Ll9vcGVuZWRCb3R0b21TaGVldFJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50Qm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0LFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfbG9jYXRpb24/OiBMb2NhdGlvbixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0JPVFRPTV9TSEVFVF9ERUZBVUxUX09QVElPTlMpXG4gICAgICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRCb3R0b21TaGVldENvbmZpZykge31cblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPixcbiAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPik6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+O1xuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxUPixcbiAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPik6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQ+KTogTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4ge1xuXG4gICAgY29uc3QgX2NvbmZpZyA9XG4gICAgICAgIF9hcHBseUNvbmZpZ0RlZmF1bHRzKHRoaXMuX2RlZmF1bHRPcHRpb25zIHx8IG5ldyBNYXRCb3R0b21TaGVldENvbmZpZygpLCBjb25maWcpO1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KF9jb25maWcpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2F0dGFjaENvbnRhaW5lcihvdmVybGF5UmVmLCBfY29uZmlnKTtcbiAgICBjb25zdCByZWYgPSBuZXcgTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4oY29udGFpbmVyLCBvdmVybGF5UmVmLCB0aGlzLl9sb2NhdGlvbik7XG5cbiAgICBpZiAoY29tcG9uZW50T3JUZW1wbGF0ZVJlZiBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb250YWluZXIuYXR0YWNoVGVtcGxhdGVQb3J0YWwobmV3IFRlbXBsYXRlUG9ydGFsPFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIG51bGwhLCB7XG4gICAgICAgICRpbXBsaWNpdDogX2NvbmZpZy5kYXRhLFxuICAgICAgICBib3R0b21TaGVldFJlZjogcmVmXG4gICAgICB9IGFzIGFueSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUluamVjdG9yKF9jb25maWcsIHJlZikpO1xuICAgICAgY29uc3QgY29udGVudFJlZiA9IGNvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgICAgIHJlZi5pbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgYm90dG9tIHNoZWV0IGlzIGRpc21pc3NlZCwgY2xlYXIgdGhlIHJlZmVyZW5jZSB0byBpdC5cbiAgICByZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQ2xlYXIgdGhlIGJvdHRvbSBzaGVldCByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIG9uZS5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZiA9PSByZWYpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmKSB7XG4gICAgICAvLyBJZiBhIGJvdHRvbSBzaGVldCBpcyBhbHJlYWR5IGluIHZpZXcsIGRpc21pc3MgaXQgYW5kIGVudGVyIHRoZVxuICAgICAgLy8gbmV3IGJvdHRvbSBzaGVldCBhZnRlciBleGl0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpKTtcbiAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmLmRpc21pc3MoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gYm90dG9tIHNoZWV0IGlzIGluIHZpZXcsIGVudGVyIHRoZSBuZXcgYm90dG9tIHNoZWV0LlxuICAgICAgcmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPSByZWY7XG5cbiAgICByZXR1cm4gcmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0aGUgY3VycmVudGx5LXZpc2libGUgYm90dG9tIHNoZWV0LlxuICAgKiBAcGFyYW0gcmVzdWx0IERhdGEgdG8gcGFzcyB0byB0aGUgYm90dG9tIHNoZWV0IGluc3RhbmNlLlxuICAgKi9cbiAgZGlzbWlzczxSID0gYW55PihyZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmKSB7XG4gICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZi5kaXNtaXNzKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWwpIHtcbiAgICAgIHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWwuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgYm90dG9tIHNoZWV0IGNvbnRhaW5lciBjb21wb25lbnQgdG8gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hDb250YWluZXIob3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogTWF0Qm90dG9tU2hlZXRDb25maWcpOiBNYXRCb3R0b21TaGVldENvbnRhaW5lciB7XG5cbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgaW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTWF0Qm90dG9tU2hlZXRDb25maWcsIHVzZVZhbHVlOiBjb25maWd9XVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID1cbiAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChNYXRCb3R0b21TaGVldENvbnRhaW5lciwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRCb3R0b21TaGVldENvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBvdmVybGF5IGFuZCBwbGFjZXMgaXQgaW4gdGhlIGNvcnJlY3QgbG9jYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIHVzZXItc3BlY2lmaWVkIGJvdHRvbSBzaGVldCBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KGNvbmZpZzogTWF0Qm90dG9tU2hlZXRDb25maWcpOiBPdmVybGF5UmVmIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgZGlyZWN0aW9uOiBjb25maWcuZGlyZWN0aW9uLFxuICAgICAgaGFzQmFja2Ryb3A6IGNvbmZpZy5oYXNCYWNrZHJvcCxcbiAgICAgIGRpc3Bvc2VPbk5hdmlnYXRpb246IGNvbmZpZy5jbG9zZU9uTmF2aWdhdGlvbixcbiAgICAgIG1heFdpZHRoOiAnMTAwJScsXG4gICAgICBzY3JvbGxTdHJhdGVneTogY29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpLFxuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLmNlbnRlckhvcml6b250YWxseSgpLmJvdHRvbSgnMCcpXG4gICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmJhY2tkcm9wQ2xhc3MpIHtcbiAgICAgIG92ZXJsYXlDb25maWcuYmFja2Ryb3BDbGFzcyA9IGNvbmZpZy5iYWNrZHJvcENsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgYm90dG9tIHNoZWV0IGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIGJvdHRvbVNoZWV0UmVmIFJlZmVyZW5jZSB0byB0aGUgYm90dG9tIHNoZWV0LlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tU2hlZXRSZWY6IE1hdEJvdHRvbVNoZWV0UmVmPFQ+KTogSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IHByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtcbiAgICAgIHtwcm92aWRlOiBNYXRCb3R0b21TaGVldFJlZiwgdXNlVmFsdWU6IGJvdHRvbVNoZWV0UmVmfSxcbiAgICAgIHtwcm92aWRlOiBNQVRfQk9UVE9NX1NIRUVUX0RBVEEsIHVzZVZhbHVlOiBjb25maWcuZGF0YX1cbiAgICBdO1xuXG4gICAgaWYgKGNvbmZpZy5kaXJlY3Rpb24gJiZcbiAgICAgICAgKCF1c2VySW5qZWN0b3IgfHwgIXVzZXJJbmplY3Rvci5nZXQ8RGlyZWN0aW9uYWxpdHkgfCBudWxsPihEaXJlY3Rpb25hbGl0eSwgbnVsbCkpKSB7XG4gICAgICBwcm92aWRlcnMucHVzaCh7XG4gICAgICAgIHByb3ZpZGU6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICB1c2VWYWx1ZToge3ZhbHVlOiBjb25maWcuZGlyZWN0aW9uLCBjaGFuZ2U6IG9ic2VydmFibGVPZigpfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7cGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIHByb3ZpZGVyc30pO1xuICB9XG59XG5cbi8qKlxuICogQXBwbGllcyBkZWZhdWx0IG9wdGlvbnMgdG8gdGhlIGJvdHRvbSBzaGVldCBjb25maWcuXG4gKiBAcGFyYW0gZGVmYXVsdHMgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGRlZmF1bHQgdmFsdWVzIHRvIHdoaWNoIHRvIGZhbGwgYmFjay5cbiAqIEBwYXJhbSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gdG8gd2hpY2ggdGhlIGRlZmF1bHRzIHdpbGwgYmUgYXBwbGllZC5cbiAqIEByZXR1cm5zIFRoZSBuZXcgY29uZmlndXJhdGlvbiBvYmplY3Qgd2l0aCBkZWZhdWx0cyBhcHBsaWVkLlxuICovXG5mdW5jdGlvbiBfYXBwbHlDb25maWdEZWZhdWx0cyhkZWZhdWx0czogTWF0Qm90dG9tU2hlZXRDb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZyk6IE1hdEJvdHRvbVNoZWV0Q29uZmlnIHtcbiAgcmV0dXJuIHsuLi5kZWZhdWx0cywgLi4uY29uZmlnfTtcbn1cbiJdfQ==
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
import * as i1 from "@angular/cdk/overlay/overlay";
import * as i2 from "@angular/common";
import * as i3 from "angular_material/src/material/bottom-sheet/bottom-sheet-module";
/**
 * Injection token that can be used to specify default bottom sheet options.
 * @type {?}
 */
export const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken('mat-bottom-sheet-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
export class MatBottomSheet {
    /**
     * @param {?} _overlay
     * @param {?} _injector
     * @param {?} _parentBottomSheet
     * @param {?=} _location
     * @param {?=} _defaultOptions
     */
    constructor(_overlay, _injector, _parentBottomSheet, _location, _defaultOptions) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._parentBottomSheet = _parentBottomSheet;
        this._location = _location;
        this._defaultOptions = _defaultOptions;
        this._bottomSheetRefAtThisLevel = null;
    }
    /**
     * Reference to the currently opened bottom sheet.
     * @return {?}
     */
    get _openedBottomSheetRef() {
        /** @type {?} */
        const parent = this._parentBottomSheet;
        return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set _openedBottomSheetRef(value) {
        if (this._parentBottomSheet) {
            this._parentBottomSheet._openedBottomSheetRef = value;
        }
        else {
            this._bottomSheetRefAtThisLevel = value;
        }
    }
    /**
     * @template T, D, R
     * @param {?} componentOrTemplateRef
     * @param {?=} config
     * @return {?}
     */
    open(componentOrTemplateRef, config) {
        /** @type {?} */
        const _config = _applyConfigDefaults(this._defaultOptions || new MatBottomSheetConfig(), config);
        /** @type {?} */
        const overlayRef = this._createOverlay(_config);
        /** @type {?} */
        const container = this._attachContainer(overlayRef, _config);
        /** @type {?} */
        const ref = new MatBottomSheetRef(container, overlayRef, this._location);
        if (componentOrTemplateRef instanceof TemplateRef) {
            container.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, (/** @type {?} */ (null)), (/** @type {?} */ ({
                $implicit: _config.data,
                bottomSheetRef: ref
            }))));
        }
        else {
            /** @type {?} */
            const portal = new ComponentPortal(componentOrTemplateRef, undefined, this._createInjector(_config, ref));
            /** @type {?} */
            const contentRef = container.attachComponentPortal(portal);
            ref.instance = contentRef.instance;
        }
        // When the bottom sheet is dismissed, clear the reference to it.
        ref.afterDismissed().subscribe((/**
         * @return {?}
         */
        () => {
            // Clear the bottom sheet ref if it hasn't already been replaced by a newer one.
            if (this._openedBottomSheetRef == ref) {
                this._openedBottomSheetRef = null;
            }
        }));
        if (this._openedBottomSheetRef) {
            // If a bottom sheet is already in view, dismiss it and enter the
            // new bottom sheet after exit animation is complete.
            this._openedBottomSheetRef.afterDismissed().subscribe((/**
             * @return {?}
             */
            () => ref.containerInstance.enter()));
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
     * @return {?}
     */
    dismiss() {
        if (this._openedBottomSheetRef) {
            this._openedBottomSheetRef.dismiss();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._bottomSheetRefAtThisLevel) {
            this._bottomSheetRefAtThisLevel.dismiss();
        }
    }
    /**
     * Attaches the bottom sheet container component to the overlay.
     * @private
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    _attachContainer(overlayRef, config) {
        /** @type {?} */
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        /** @type {?} */
        const injector = new PortalInjector(userInjector || this._injector, new WeakMap([
            [MatBottomSheetConfig, config]
        ]));
        /** @type {?} */
        const containerPortal = new ComponentPortal(MatBottomSheetContainer, config.viewContainerRef, injector);
        /** @type {?} */
        const containerRef = overlayRef.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @private
     * @param {?} config The user-specified bottom sheet config.
     * @return {?}
     */
    _createOverlay(config) {
        /** @type {?} */
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
     * @private
     * @template T
     * @param {?} config Config that was used to create the bottom sheet.
     * @param {?} bottomSheetRef Reference to the bottom sheet.
     * @return {?}
     */
    _createInjector(config, bottomSheetRef) {
        /** @type {?} */
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        /** @type {?} */
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
}
MatBottomSheet.decorators = [
    { type: Injectable, args: [{ providedIn: MatBottomSheetModule },] }
];
/** @nocollapse */
MatBottomSheet.ctorParameters = () => [
    { type: Overlay },
    { type: Injector },
    { type: MatBottomSheet, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: Location, decorators: [{ type: Optional }] },
    { type: MatBottomSheetConfig, decorators: [{ type: Optional }, { type: Inject, args: [MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,] }] }
];
/** @nocollapse */ MatBottomSheet.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatBottomSheet_Factory() { return new MatBottomSheet(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(MatBottomSheet, 12), i0.ɵɵinject(i2.Location, 8), i0.ɵɵinject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, 8)); }, token: MatBottomSheet, providedIn: i3.MatBottomSheetModule });
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatBottomSheet.prototype._bottomSheetRefAtThisLevel;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheet.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheet.prototype._injector;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheet.prototype._parentBottomSheet;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheet.prototype._location;
    /**
     * @type {?}
     * @private
     */
    MatBottomSheet.prototype._defaultOptions;
}
/**
 * Applies default options to the bottom sheet config.
 * @param {?} defaults Object containing the default values to which to fall back.
 * @param {?=} config The configuration to which the defaults will be applied.
 * @return {?} The new configuration object with defaults applied.
 */
function _applyConfigDefaults(defaults, config) {
    return Object.assign(Object.assign({}, defaults), config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQWEsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsZUFBZSxFQUFpQixjQUFjLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkcsT0FBTyxFQUVMLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLEVBQUUsSUFBSSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxFQUFDLHFCQUFxQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEYsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDakUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7Ozs7OztBQUlyRCxNQUFNLE9BQU8sZ0NBQWdDLEdBQ3pDLElBQUksY0FBYyxDQUF1QixrQ0FBa0MsQ0FBQzs7OztBQU1oRixNQUFNLE9BQU8sY0FBYzs7Ozs7Ozs7SUFpQnpCLFlBQ1ksUUFBaUIsRUFDakIsU0FBbUIsRUFDSyxrQkFBa0MsRUFDOUMsU0FBb0IsRUFFNUIsZUFBc0M7UUFMMUMsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNq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QUF5RTs7Ozs7SUFpQnJFLGtDQUF5Qjs7Ozs7SUFDekIsbUNBQTJCOzs7OztJQUMzQiw0Q0FBa0U7Ozs7O0lBQ2xFLG1DQUF3Qzs7Ozs7SUFDeEMseUNBQ2tEOzs7Ozs7OztBQXdJeEQsU0FBUyxvQkFBb0IsQ0FBQyxRQUE4QixFQUM5QixNQUE2QjtJQUN6RCx1Q0FBVyxRQUFRLEdBQUssTUFBTSxFQUFFO0FBQ2xDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtPdmVybGF5LCBPdmVybGF5Q29uZmlnLCBPdmVybGF5UmVmfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgUG9ydGFsSW5qZWN0b3IsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0xvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNQVRfQk9UVE9NX1NIRUVUX0RBVEEsIE1hdEJvdHRvbVNoZWV0Q29uZmlnfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb25maWcnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldENvbnRhaW5lcn0gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29udGFpbmVyJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRNb2R1bGV9IGZyb20gJy4vYm90dG9tLXNoZWV0LW1vZHVsZSc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0UmVmfSBmcm9tICcuL2JvdHRvbS1zaGVldC1yZWYnO1xuXG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGRlZmF1bHQgYm90dG9tIHNoZWV0IG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTUFUX0JPVFRPTV9TSEVFVF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRCb3R0b21TaGVldENvbmZpZz4oJ21hdC1ib3R0b20tc2hlZXQtZGVmYXVsdC1vcHRpb25zJyk7XG5cbi8qKlxuICogU2VydmljZSB0byB0cmlnZ2VyIE1hdGVyaWFsIERlc2lnbiBib3R0b20gc2hlZXRzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0Qm90dG9tU2hlZXRNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdEJvdHRvbVNoZWV0IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbDogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgYm90dG9tIHNoZWV0LiAqL1xuICBnZXQgX29wZW5lZEJvdHRvbVNoZWV0UmVmKCk6IE1hdEJvdHRvbVNoZWV0UmVmPGFueT4gfCBudWxsIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnRCb3R0b21TaGVldDtcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9vcGVuZWRCb3R0b21TaGVldFJlZiA6IHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWw7XG4gIH1cblxuICBzZXQgX29wZW5lZEJvdHRvbVNoZWV0UmVmKHZhbHVlOiBNYXRCb3R0b21TaGVldFJlZjxhbnk+IHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9wYXJlbnRCb3R0b21TaGVldCkge1xuICAgICAgdGhpcy5fcGFyZW50Qm90dG9tU2hlZXQuX29wZW5lZEJvdHRvbVNoZWV0UmVmID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWwgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRCb3R0b21TaGVldDogTWF0Qm90dG9tU2hlZXQsXG4gICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9sb2NhdGlvbj86IExvY2F0aW9uLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfQk9UVE9NX1NIRUVUX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9ucz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnKSB7fVxuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+LFxuICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQ+KTogTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj47XG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4odGVtcGxhdGU6IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQ+KTogTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj47XG5cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55Pihjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgICAgICAgICAgICAgICAgY29uZmlnPzogTWF0Qm90dG9tU2hlZXRDb25maWc8RD4pOiBNYXRCb3R0b21TaGVldFJlZjxULCBSPiB7XG5cbiAgICBjb25zdCBfY29uZmlnID1cbiAgICAgICAgX2FwcGx5Q29uZmlnRGVmYXVsdHModGhpcy5fZGVmYXVsdE9wdGlvbnMgfHwgbmV3IE1hdEJvdHRvbVNoZWV0Q29uZmlnKCksIGNvbmZpZyk7XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoX2NvbmZpZyk7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fYXR0YWNoQ29udGFpbmVyKG92ZXJsYXlSZWYsIF9jb25maWcpO1xuICAgIGNvbnN0IHJlZiA9IG5ldyBNYXRCb3R0b21TaGVldFJlZjxULCBSPihjb250YWluZXIsIG92ZXJsYXlSZWYsIHRoaXMuX2xvY2F0aW9uKTtcblxuICAgIGlmIChjb21wb25lbnRPclRlbXBsYXRlUmVmIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGNvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChuZXcgVGVtcGxhdGVQb3J0YWw8VD4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgbnVsbCEsIHtcbiAgICAgICAgJGltcGxpY2l0OiBfY29uZmlnLmRhdGEsXG4gICAgICAgIGJvdHRvbVNoZWV0UmVmOiByZWZcbiAgICAgIH0gYXMgYW55KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdGhpcy5fY3JlYXRlSW5qZWN0b3IoX2NvbmZpZywgcmVmKSk7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICAgICAgcmVmLmluc3RhbmNlID0gY29udGVudFJlZi5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSBib3R0b20gc2hlZXQgaXMgZGlzbWlzc2VkLCBjbGVhciB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBDbGVhciB0aGUgYm90dG9tIHNoZWV0IHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIgb25lLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmID09IHJlZikge1xuICAgICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZiA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYpIHtcbiAgICAgIC8vIElmIGEgYm90dG9tIHNoZWV0IGlzIGFscmVhZHkgaW4gdmlldywgZGlzbWlzcyBpdCBhbmQgZW50ZXIgdGhlXG4gICAgICAvLyBuZXcgYm90dG9tIHNoZWV0IGFmdGVyIGV4aXQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4gcmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCkpO1xuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuZGlzbWlzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBubyBib3R0b20gc2hlZXQgaXMgaW4gdmlldywgZW50ZXIgdGhlIG5ldyBib3R0b20gc2hlZXQuXG4gICAgICByZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZiA9IHJlZjtcblxuICAgIHJldHVybiByZWY7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBib3R0b20gc2hlZXQuXG4gICAqL1xuICBkaXNtaXNzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsKSB7XG4gICAgICB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsLmRpc21pc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIGJvdHRvbSBzaGVldCBjb250YWluZXIgY29tcG9uZW50IHRvIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoQ29udGFpbmVyKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IE1hdEJvdHRvbVNoZWV0Q29uZmlnKTogTWF0Qm90dG9tU2hlZXRDb250YWluZXIge1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdG9yID0gbmV3IFBvcnRhbEluamVjdG9yKHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgbmV3IFdlYWtNYXAoW1xuICAgICAgW01hdEJvdHRvbVNoZWV0Q29uZmlnLCBjb25maWddXG4gICAgXSkpO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID1cbiAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChNYXRCb3R0b21TaGVldENvbnRhaW5lciwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRCb3R0b21TaGVldENvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBvdmVybGF5IGFuZCBwbGFjZXMgaXQgaW4gdGhlIGNvcnJlY3QgbG9jYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIHVzZXItc3BlY2lmaWVkIGJvdHRvbSBzaGVldCBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KGNvbmZpZzogTWF0Qm90dG9tU2hlZXRDb25maWcpOiBPdmVybGF5UmVmIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgZGlyZWN0aW9uOiBjb25maWcuZGlyZWN0aW9uLFxuICAgICAgaGFzQmFja2Ryb3A6IGNvbmZpZy5oYXNCYWNrZHJvcCxcbiAgICAgIGRpc3Bvc2VPbk5hdmlnYXRpb246IGNvbmZpZy5jbG9zZU9uTmF2aWdhdGlvbixcbiAgICAgIG1heFdpZHRoOiAnMTAwJScsXG4gICAgICBzY3JvbGxTdHJhdGVneTogY29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpLFxuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLmNlbnRlckhvcml6b250YWxseSgpLmJvdHRvbSgnMCcpXG4gICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmJhY2tkcm9wQ2xhc3MpIHtcbiAgICAgIG92ZXJsYXlDb25maWcuYmFja2Ryb3BDbGFzcyA9IGNvbmZpZy5iYWNrZHJvcENsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgYm90dG9tIHNoZWV0IGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIGJvdHRvbVNoZWV0UmVmIFJlZmVyZW5jZSB0byB0aGUgYm90dG9tIHNoZWV0LlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tU2hlZXRSZWY6IE1hdEJvdHRvbVNoZWV0UmVmPFQ+KTogUG9ydGFsSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdGlvblRva2VucyA9IG5ldyBXZWFrTWFwPGFueSwgYW55PihbXG4gICAgICBbTWF0Qm90dG9tU2hlZXRSZWYsIGJvdHRvbVNoZWV0UmVmXSxcbiAgICAgIFtNQVRfQk9UVE9NX1NIRUVUX0RBVEEsIGNvbmZpZy5kYXRhXVxuICAgIF0pO1xuXG4gICAgaWYgKGNvbmZpZy5kaXJlY3Rpb24gJiZcbiAgICAgICAgKCF1c2VySW5qZWN0b3IgfHwgIXVzZXJJbmplY3Rvci5nZXQ8RGlyZWN0aW9uYWxpdHkgfCBudWxsPihEaXJlY3Rpb25hbGl0eSwgbnVsbCkpKSB7XG4gICAgICBpbmplY3Rpb25Ub2tlbnMuc2V0KERpcmVjdGlvbmFsaXR5LCB7XG4gICAgICAgIHZhbHVlOiBjb25maWcuZGlyZWN0aW9uLFxuICAgICAgICBjaGFuZ2U6IG9ic2VydmFibGVPZigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBvcnRhbEluamVjdG9yKHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgaW5qZWN0aW9uVG9rZW5zKTtcbiAgfVxufVxuXG4vKipcbiAqIEFwcGxpZXMgZGVmYXVsdCBvcHRpb25zIHRvIHRoZSBib3R0b20gc2hlZXQgY29uZmlnLlxuICogQHBhcmFtIGRlZmF1bHRzIE9iamVjdCBjb250YWluaW5nIHRoZSBkZWZhdWx0IHZhbHVlcyB0byB3aGljaCB0byBmYWxsIGJhY2suXG4gKiBAcGFyYW0gY29uZmlnIFRoZSBjb25maWd1cmF0aW9uIHRvIHdoaWNoIHRoZSBkZWZhdWx0cyB3aWxsIGJlIGFwcGxpZWQuXG4gKiBAcmV0dXJucyBUaGUgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdpdGggZGVmYXVsdHMgYXBwbGllZC5cbiAqL1xuZnVuY3Rpb24gX2FwcGx5Q29uZmlnRGVmYXVsdHMoZGVmYXVsdHM6IE1hdEJvdHRvbVNoZWV0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnPzogTWF0Qm90dG9tU2hlZXRDb25maWcpOiBNYXRCb3R0b21TaGVldENvbmZpZyB7XG4gIHJldHVybiB7Li4uZGVmYXVsdHMsIC4uLmNvbmZpZ307XG59XG4iXX0=
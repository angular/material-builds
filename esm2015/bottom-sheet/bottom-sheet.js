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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFhLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGVBQWUsRUFBaUIsY0FBYyxFQUFFLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25HLE9BQU8sRUFFTCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxFQUNYLGNBQWMsRUFDZCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxFQUFFLElBQUksWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2xGLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7OztBQUdyRCxnRkFBZ0Y7QUFDaEYsTUFBTSxDQUFDLE1BQU0sZ0NBQWdDLEdBQ3pDLElBQUksY0FBYyxDQUF1QixrQ0FBa0MsQ0FBQyxDQUFDO0FBRWpGOztHQUVHO0FBRUgsTUFBTSxPQUFPLGNBQWM7SUFpQnpCLFlBQ1ksUUFBaUIsRUFDakIsU0FBbUIsRUFDSyxrQkFBa0MsRUFDOUMsU0FBb0IsRUFFNUIsZUFBc0M7UUFMMUMs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RSxvQkFBb0IsRUFBQzs7O1lBNUJ0QyxPQUFPO1lBS2IsUUFBUTtZQTRDZ0QsY0FBYyx1QkFBakUsUUFBUSxZQUFJLFFBQVE7WUFwQ25CLFFBQVEsdUJBcUNULFFBQVE7WUFuQ2dCLG9CQUFvQix1QkFvQzVDLFFBQVEsWUFBSSxNQUFNLFNBQUMsZ0NBQWdDOztBQW9JMUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLG9CQUFvQixDQUFDLFFBQThCLEVBQzlCLE1BQTZCO0lBQ3pELHVDQUFXLFFBQVEsR0FBSyxNQUFNLEVBQUU7QUFDbEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge092ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlLCBQb3J0YWxJbmplY3RvciwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBJbmplY3RhYmxlLFxuICBJbmplY3RvcixcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge29mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01BVF9CT1RUT01fU0hFRVRfREFUQSwgTWF0Qm90dG9tU2hlZXRDb25maWd9IGZyb20gJy4vYm90dG9tLXNoZWV0LWNvbmZpZyc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0Q29udGFpbmVyfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb250YWluZXInO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldE1vZHVsZX0gZnJvbSAnLi9ib3R0b20tc2hlZXQtbW9kdWxlJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRSZWZ9IGZyb20gJy4vYm90dG9tLXNoZWV0LXJlZic7XG5cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBib3R0b20gc2hlZXQgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQk9UVE9NX1NIRUVUX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEJvdHRvbVNoZWV0Q29uZmlnPignbWF0LWJvdHRvbS1zaGVldC1kZWZhdWx0LW9wdGlvbnMnKTtcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIHRyaWdnZXIgTWF0ZXJpYWwgRGVzaWduIGJvdHRvbSBzaGVldHMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBNYXRCb3R0b21TaGVldE1vZHVsZX0pXG5leHBvcnQgY2xhc3MgTWF0Qm90dG9tU2hlZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsOiBNYXRCb3R0b21TaGVldFJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBib3R0b20gc2hlZXQuICovXG4gIGdldCBfb3BlbmVkQm90dG9tU2hlZXRSZWYoKTogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudEJvdHRvbVNoZWV0O1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX29wZW5lZEJvdHRvbVNoZWV0UmVmIDogdGhpcy5fYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIHNldCBfb3BlbmVkQm90dG9tU2hlZXRSZWYodmFsdWU6IE1hdEJvdHRvbVNoZWV0UmVmPGFueT4gfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudEJvdHRvbVNoZWV0KSB7XG4gICAgICB0aGlzLl9wYXJlbnRCb3R0b21TaGVldC5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHByaXZhdGUgX3BhcmVudEJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCxcbiAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2xvY2F0aW9uPzogTG9jYXRpb24sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9CT1RUT01fU0hFRVRfREVGQVVMVF9PUFRJT05TKVxuICAgICAgICAgIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zPzogTWF0Qm90dG9tU2hlZXRDb25maWcpIHt9XG5cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55Pihjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgICAgICAgICAgICAgICAgY29uZmlnPzogTWF0Qm90dG9tU2hlZXRDb25maWc8RD4pOiBNYXRCb3R0b21TaGVldFJlZjxULCBSPjtcbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55Pih0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8VD4sXG4gICAgICAgICAgICAgICAgICAgY29uZmlnPzogTWF0Qm90dG9tU2hlZXRDb25maWc8RD4pOiBNYXRCb3R0b21TaGVldFJlZjxULCBSPjtcblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPik6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+IHtcblxuICAgIGNvbnN0IF9jb25maWcgPVxuICAgICAgICBfYXBwbHlDb25maWdEZWZhdWx0cyh0aGlzLl9kZWZhdWx0T3B0aW9ucyB8fCBuZXcgTWF0Qm90dG9tU2hlZXRDb25maWcoKSwgY29uZmlnKTtcbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShfY29uZmlnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9hdHRhY2hDb250YWluZXIob3ZlcmxheVJlZiwgX2NvbmZpZyk7XG4gICAgY29uc3QgcmVmID0gbmV3IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+KGNvbnRhaW5lciwgb3ZlcmxheVJlZiwgdGhpcy5fbG9jYXRpb24pO1xuXG4gICAgaWYgKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgY29udGFpbmVyLmF0dGFjaFRlbXBsYXRlUG9ydGFsKG5ldyBUZW1wbGF0ZVBvcnRhbDxUPihjb21wb25lbnRPclRlbXBsYXRlUmVmLCBudWxsISwge1xuICAgICAgICAkaW1wbGljaXQ6IF9jb25maWcuZGF0YSxcbiAgICAgICAgYm90dG9tU2hlZXRSZWY6IHJlZlxuICAgICAgfSBhcyBhbnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChjb21wb25lbnRPclRlbXBsYXRlUmVmLCB1bmRlZmluZWQsXG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVJbmplY3RvcihfY29uZmlnLCByZWYpKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRSZWYgPSBjb250YWluZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gICAgICByZWYuaW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIGJvdHRvbSBzaGVldCBpcyBkaXNtaXNzZWQsIGNsZWFyIHRoZSByZWZlcmVuY2UgdG8gaXQuXG4gICAgcmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENsZWFyIHRoZSBib3R0b20gc2hlZXQgcmVmIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gcmVwbGFjZWQgYnkgYSBuZXdlciBvbmUuXG4gICAgICBpZiAodGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPT0gcmVmKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZikge1xuICAgICAgLy8gSWYgYSBib3R0b20gc2hlZXQgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcbiAgICAgIC8vIG5ldyBib3R0b20gc2hlZXQgYWZ0ZXIgZXhpdCBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiByZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKSk7XG4gICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZi5kaXNtaXNzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIG5vIGJvdHRvbSBzaGVldCBpcyBpbiB2aWV3LCBlbnRlciB0aGUgbmV3IGJvdHRvbSBzaGVldC5cbiAgICAgIHJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgIH1cblxuICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmID0gcmVmO1xuXG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIHJlc3VsdCBEYXRhIHRvIHBhc3MgdG8gdGhlIGJvdHRvbSBzaGVldCBpbnN0YW5jZS5cbiAgICovXG4gIGRpc21pc3M8UiA9IGFueT4ocmVzdWx0PzogUik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuZGlzbWlzcyhyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsKSB7XG4gICAgICB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsLmRpc21pc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIGJvdHRvbSBzaGVldCBjb250YWluZXIgY29tcG9uZW50IHRvIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoQ29udGFpbmVyKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IE1hdEJvdHRvbVNoZWV0Q29uZmlnKTogTWF0Qm90dG9tU2hlZXRDb250YWluZXIge1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdG9yID0gbmV3IFBvcnRhbEluamVjdG9yKHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgbmV3IFdlYWtNYXAoW1xuICAgICAgW01hdEJvdHRvbVNoZWV0Q29uZmlnLCBjb25maWddXG4gICAgXSkpO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID1cbiAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChNYXRCb3R0b21TaGVldENvbnRhaW5lciwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRCb3R0b21TaGVldENvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBvdmVybGF5IGFuZCBwbGFjZXMgaXQgaW4gdGhlIGNvcnJlY3QgbG9jYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIHVzZXItc3BlY2lmaWVkIGJvdHRvbSBzaGVldCBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KGNvbmZpZzogTWF0Qm90dG9tU2hlZXRDb25maWcpOiBPdmVybGF5UmVmIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgZGlyZWN0aW9uOiBjb25maWcuZGlyZWN0aW9uLFxuICAgICAgaGFzQmFja2Ryb3A6IGNvbmZpZy5oYXNCYWNrZHJvcCxcbiAgICAgIGRpc3Bvc2VPbk5hdmlnYXRpb246IGNvbmZpZy5jbG9zZU9uTmF2aWdhdGlvbixcbiAgICAgIG1heFdpZHRoOiAnMTAwJScsXG4gICAgICBzY3JvbGxTdHJhdGVneTogY29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpLFxuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLmNlbnRlckhvcml6b250YWxseSgpLmJvdHRvbSgnMCcpXG4gICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmJhY2tkcm9wQ2xhc3MpIHtcbiAgICAgIG92ZXJsYXlDb25maWcuYmFja2Ryb3BDbGFzcyA9IGNvbmZpZy5iYWNrZHJvcENsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgYm90dG9tIHNoZWV0IGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIGJvdHRvbVNoZWV0UmVmIFJlZmVyZW5jZSB0byB0aGUgYm90dG9tIHNoZWV0LlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tU2hlZXRSZWY6IE1hdEJvdHRvbVNoZWV0UmVmPFQ+KTogUG9ydGFsSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdGlvblRva2VucyA9IG5ldyBXZWFrTWFwPGFueSwgYW55PihbXG4gICAgICBbTWF0Qm90dG9tU2hlZXRSZWYsIGJvdHRvbVNoZWV0UmVmXSxcbiAgICAgIFtNQVRfQk9UVE9NX1NIRUVUX0RBVEEsIGNvbmZpZy5kYXRhXVxuICAgIF0pO1xuXG4gICAgaWYgKGNvbmZpZy5kaXJlY3Rpb24gJiZcbiAgICAgICAgKCF1c2VySW5qZWN0b3IgfHwgIXVzZXJJbmplY3Rvci5nZXQ8RGlyZWN0aW9uYWxpdHkgfCBudWxsPihEaXJlY3Rpb25hbGl0eSwgbnVsbCkpKSB7XG4gICAgICBpbmplY3Rpb25Ub2tlbnMuc2V0KERpcmVjdGlvbmFsaXR5LCB7XG4gICAgICAgIHZhbHVlOiBjb25maWcuZGlyZWN0aW9uLFxuICAgICAgICBjaGFuZ2U6IG9ic2VydmFibGVPZigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBvcnRhbEluamVjdG9yKHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgaW5qZWN0aW9uVG9rZW5zKTtcbiAgfVxufVxuXG4vKipcbiAqIEFwcGxpZXMgZGVmYXVsdCBvcHRpb25zIHRvIHRoZSBib3R0b20gc2hlZXQgY29uZmlnLlxuICogQHBhcmFtIGRlZmF1bHRzIE9iamVjdCBjb250YWluaW5nIHRoZSBkZWZhdWx0IHZhbHVlcyB0byB3aGljaCB0byBmYWxsIGJhY2suXG4gKiBAcGFyYW0gY29uZmlnIFRoZSBjb25maWd1cmF0aW9uIHRvIHdoaWNoIHRoZSBkZWZhdWx0cyB3aWxsIGJlIGFwcGxpZWQuXG4gKiBAcmV0dXJucyBUaGUgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdpdGggZGVmYXVsdHMgYXBwbGllZC5cbiAqL1xuZnVuY3Rpb24gX2FwcGx5Q29uZmlnRGVmYXVsdHMoZGVmYXVsdHM6IE1hdEJvdHRvbVNoZWV0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnPzogTWF0Qm90dG9tU2hlZXRDb25maWcpOiBNYXRCb3R0b21TaGVldENvbmZpZyB7XG4gIHJldHVybiB7Li4uZGVmYXVsdHMsIC4uLmNvbmZpZ307XG59XG4iXX0=
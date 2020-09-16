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
import { of as observableOf } from 'rxjs';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetConfig } from './bottom-sheet-config';
import { MatBottomSheetContainer } from './bottom-sheet-container';
import { MatBottomSheetModule } from './bottom-sheet-module';
import { MatBottomSheetRef } from './bottom-sheet-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "./bottom-sheet-module";
/** Injection token that can be used to specify default bottom sheet options. */
export const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken('mat-bottom-sheet-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
export class MatBottomSheet {
    constructor(_overlay, _injector, _parentBottomSheet, _defaultOptions) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._parentBottomSheet = _parentBottomSheet;
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
        const ref = new MatBottomSheetRef(container, overlayRef);
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
MatBottomSheet.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatBottomSheet_Factory() { return new MatBottomSheet(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(MatBottomSheet, 12), i0.ɵɵinject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, 8)); }, token: MatBottomSheet, providedIn: i2.MatBottomSheetModule });
MatBottomSheet.decorators = [
    { type: Injectable, args: [{ providedIn: MatBottomSheetModule },] }
];
MatBottomSheet.ctorParameters = () => [
    { type: Overlay },
    { type: Injector },
    { type: MatBottomSheet, decorators: [{ type: Optional }, { type: SkipSelf }] },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFhLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGVBQWUsRUFBaUIsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkYsT0FBTyxFQUVMLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsRUFBRSxJQUFJLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN4QyxPQUFPLEVBQUMscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRixPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQUdyRCxnRkFBZ0Y7QUFDaEYsTUFBTSxDQUFDLE1BQU0sZ0NBQWdDLEdBQ3pDLElBQUksY0FBYyxDQUF1QixrQ0FBa0MsQ0FBQyxDQUFDO0FBRWpGOztHQUVHO0FBRUgsTUFBTSxPQUFPLGNBQWM7SUFpQnpCLFlBQ1ksUUFBaUIsRUFDakIsU0FBbUIsRUFDSyxrQkFBa0MsRUFFdEQsZUFBc0M7UUFKMUMsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ0ssdUJBQWtCLEdBQWxCLGtC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LG9CQUFvQixFQUFDOzs7WUE1QnRDLE9BQU87WUFLYixRQUFRO1lBNENnRCxjQUFjLHVCQUFqRSxRQUFRLFlBQUksUUFBUTtZQWxDSSxvQkFBb0IsdUJBbUM1QyxRQUFRLFlBQUksTUFBTSxTQUFDLGdDQUFnQzs7QUFxSTFEOzs7OztHQUtHO0FBQ0gsU0FBUyxvQkFBb0IsQ0FBQyxRQUE4QixFQUM5QixNQUE2QjtJQUN6RCx1Q0FBVyxRQUFRLEdBQUssTUFBTSxFQUFFO0FBQ2xDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtPdmVybGF5LCBPdmVybGF5Q29uZmlnLCBPdmVybGF5UmVmfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBJbmplY3RhYmxlLFxuICBJbmplY3RvcixcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT25EZXN0cm95LFxuICBTdGF0aWNQcm92aWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge29mIGFzIG9ic2VydmFibGVPZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01BVF9CT1RUT01fU0hFRVRfREFUQSwgTWF0Qm90dG9tU2hlZXRDb25maWd9IGZyb20gJy4vYm90dG9tLXNoZWV0LWNvbmZpZyc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0Q29udGFpbmVyfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb250YWluZXInO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldE1vZHVsZX0gZnJvbSAnLi9ib3R0b20tc2hlZXQtbW9kdWxlJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRSZWZ9IGZyb20gJy4vYm90dG9tLXNoZWV0LXJlZic7XG5cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBib3R0b20gc2hlZXQgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQk9UVE9NX1NIRUVUX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEJvdHRvbVNoZWV0Q29uZmlnPignbWF0LWJvdHRvbS1zaGVldC1kZWZhdWx0LW9wdGlvbnMnKTtcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIHRyaWdnZXIgTWF0ZXJpYWwgRGVzaWduIGJvdHRvbSBzaGVldHMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBNYXRCb3R0b21TaGVldE1vZHVsZX0pXG5leHBvcnQgY2xhc3MgTWF0Qm90dG9tU2hlZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsOiBNYXRCb3R0b21TaGVldFJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBib3R0b20gc2hlZXQuICovXG4gIGdldCBfb3BlbmVkQm90dG9tU2hlZXRSZWYoKTogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudEJvdHRvbVNoZWV0O1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX29wZW5lZEJvdHRvbVNoZWV0UmVmIDogdGhpcy5fYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIHNldCBfb3BlbmVkQm90dG9tU2hlZXRSZWYodmFsdWU6IE1hdEJvdHRvbVNoZWV0UmVmPGFueT4gfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudEJvdHRvbVNoZWV0KSB7XG4gICAgICB0aGlzLl9wYXJlbnRCb3R0b21TaGVldC5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHByaXZhdGUgX3BhcmVudEJvdHRvbVNoZWV0OiBNYXRCb3R0b21TaGVldCxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0JPVFRPTV9TSEVFVF9ERUZBVUxUX09QVElPTlMpXG4gICAgICAgICAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRCb3R0b21TaGVldENvbmZpZykge31cblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPixcbiAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPik6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+O1xuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxUPixcbiAgICAgICAgICAgICAgICAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPik6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQ+KTogTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4ge1xuXG4gICAgY29uc3QgX2NvbmZpZyA9XG4gICAgICAgIF9hcHBseUNvbmZpZ0RlZmF1bHRzKHRoaXMuX2RlZmF1bHRPcHRpb25zIHx8IG5ldyBNYXRCb3R0b21TaGVldENvbmZpZygpLCBjb25maWcpO1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KF9jb25maWcpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2F0dGFjaENvbnRhaW5lcihvdmVybGF5UmVmLCBfY29uZmlnKTtcbiAgICBjb25zdCByZWYgPSBuZXcgTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4oY29udGFpbmVyLCBvdmVybGF5UmVmKTtcblxuICAgIGlmIChjb21wb25lbnRPclRlbXBsYXRlUmVmIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGNvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChuZXcgVGVtcGxhdGVQb3J0YWw8VD4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgbnVsbCEsIHtcbiAgICAgICAgJGltcGxpY2l0OiBfY29uZmlnLmRhdGEsXG4gICAgICAgIGJvdHRvbVNoZWV0UmVmOiByZWZcbiAgICAgIH0gYXMgYW55KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdGhpcy5fY3JlYXRlSW5qZWN0b3IoX2NvbmZpZywgcmVmKSk7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICAgICAgcmVmLmluc3RhbmNlID0gY29udGVudFJlZi5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSBib3R0b20gc2hlZXQgaXMgZGlzbWlzc2VkLCBjbGVhciB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBDbGVhciB0aGUgYm90dG9tIHNoZWV0IHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIgb25lLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmID09IHJlZikge1xuICAgICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZiA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYpIHtcbiAgICAgIC8vIElmIGEgYm90dG9tIHNoZWV0IGlzIGFscmVhZHkgaW4gdmlldywgZGlzbWlzcyBpdCBhbmQgZW50ZXIgdGhlXG4gICAgICAvLyBuZXcgYm90dG9tIHNoZWV0IGFmdGVyIGV4aXQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4gcmVmLmNvbnRhaW5lckluc3RhbmNlLmVudGVyKCkpO1xuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuZGlzbWlzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBubyBib3R0b20gc2hlZXQgaXMgaW4gdmlldywgZW50ZXIgdGhlIG5ldyBib3R0b20gc2hlZXQuXG4gICAgICByZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZiA9IHJlZjtcblxuICAgIHJldHVybiByZWY7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBib3R0b20gc2hlZXQuXG4gICAqIEBwYXJhbSByZXN1bHQgRGF0YSB0byBwYXNzIHRvIHRoZSBib3R0b20gc2hlZXQgaW5zdGFuY2UuXG4gICAqL1xuICBkaXNtaXNzPFIgPSBhbnk+KHJlc3VsdD86IFIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYpIHtcbiAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmLmRpc21pc3MocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbCkge1xuICAgICAgdGhpcy5fYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbC5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBib3R0b20gc2hlZXQgY29udGFpbmVyIGNvbXBvbmVudCB0byB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaENvbnRhaW5lcihvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyk6IE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyIHtcblxuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRCb3R0b21TaGVldENvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ31dXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPVxuICAgICAgICBuZXcgQ29tcG9uZW50UG9ydGFsKE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyLCBjb25maWcudmlld0NvbnRhaW5lclJlZiwgaW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyPiA9IG92ZXJsYXlSZWYuYXR0YWNoKGNvbnRhaW5lclBvcnRhbCk7XG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgdXNlci1zcGVjaWZpZWQgYm90dG9tIHNoZWV0IGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBkaXJlY3Rpb246IGNvbmZpZy5kaXJlY3Rpb24sXG4gICAgICBoYXNCYWNrZHJvcDogY29uZmlnLmhhc0JhY2tkcm9wLFxuICAgICAgZGlzcG9zZU9uTmF2aWdhdGlvbjogY29uZmlnLmNsb3NlT25OYXZpZ2F0aW9uLFxuICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiBjb25maWcuc2Nyb2xsU3RyYXRlZ3kgfHwgdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCksXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuYm90dG9tKCcwJylcbiAgICB9KTtcblxuICAgIGlmIChjb25maWcuYmFja2Ryb3BDbGFzcykge1xuICAgICAgb3ZlcmxheUNvbmZpZy5iYWNrZHJvcENsYXNzID0gY29uZmlnLmJhY2tkcm9wQ2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgb2YgYSBib3R0b20gc2hlZXQgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSB0aGUgYm90dG9tIHNoZWV0LlxuICAgKiBAcGFyYW0gYm90dG9tU2hlZXRSZWYgUmVmZXJlbmNlIHRvIHRoZSBib3R0b20gc2hlZXQuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihjb25maWc6IE1hdEJvdHRvbVNoZWV0Q29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b21TaGVldFJlZjogTWF0Qm90dG9tU2hlZXRSZWY8VD4pOiBJbmplY3RvciB7XG5cbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgcHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdID0gW1xuICAgICAge3Byb3ZpZGU6IE1hdEJvdHRvbVNoZWV0UmVmLCB1c2VWYWx1ZTogYm90dG9tU2hlZXRSZWZ9LFxuICAgICAge3Byb3ZpZGU6IE1BVF9CT1RUT01fU0hFRVRfREFUQSwgdXNlVmFsdWU6IGNvbmZpZy5kYXRhfVxuICAgIF07XG5cbiAgICBpZiAoY29uZmlnLmRpcmVjdGlvbiAmJlxuICAgICAgICAoIXVzZXJJbmplY3RvciB8fCAhdXNlckluamVjdG9yLmdldDxEaXJlY3Rpb25hbGl0eSB8IG51bGw+KERpcmVjdGlvbmFsaXR5LCBudWxsKSkpIHtcbiAgICAgIHByb3ZpZGVycy5wdXNoKHtcbiAgICAgICAgcHJvdmlkZTogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgIHVzZVZhbHVlOiB7dmFsdWU6IGNvbmZpZy5kaXJlY3Rpb24sIGNoYW5nZTogb2JzZXJ2YWJsZU9mKCl9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW5qZWN0b3IuY3JlYXRlKHtwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgcHJvdmlkZXJzfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBsaWVzIGRlZmF1bHQgb3B0aW9ucyB0byB0aGUgYm90dG9tIHNoZWV0IGNvbmZpZy5cbiAqIEBwYXJhbSBkZWZhdWx0cyBPYmplY3QgY29udGFpbmluZyB0aGUgZGVmYXVsdCB2YWx1ZXMgdG8gd2hpY2ggdG8gZmFsbCBiYWNrLlxuICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiB0byB3aGljaCB0aGUgZGVmYXVsdHMgd2lsbCBiZSBhcHBsaWVkLlxuICogQHJldHVybnMgVGhlIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdCB3aXRoIGRlZmF1bHRzIGFwcGxpZWQuXG4gKi9cbmZ1bmN0aW9uIF9hcHBseUNvbmZpZ0RlZmF1bHRzKGRlZmF1bHRzOiBNYXRCb3R0b21TaGVldENvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnKTogTWF0Qm90dG9tU2hlZXRDb25maWcge1xuICByZXR1cm4gey4uLmRlZmF1bHRzLCAuLi5jb25maWd9O1xufVxuIl19
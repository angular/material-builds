/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Dialog } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Injectable, Optional, SkipSelf, InjectionToken, Inject, Injector, } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetConfig } from './bottom-sheet-config';
import { MatBottomSheetContainer } from './bottom-sheet-container';
import { MatBottomSheetModule } from './bottom-sheet-module';
import { MatBottomSheetRef } from './bottom-sheet-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "./bottom-sheet-config";
/** Injection token that can be used to specify default bottom sheet options. */
export const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken('mat-bottom-sheet-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
export class MatBottomSheet {
    constructor(_overlay, injector, _parentBottomSheet, _defaultOptions) {
        this._overlay = _overlay;
        this._parentBottomSheet = _parentBottomSheet;
        this._defaultOptions = _defaultOptions;
        this._bottomSheetRefAtThisLevel = null;
        this._dialog = injector.get(Dialog);
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
        const _config = { ...(this._defaultOptions || new MatBottomSheetConfig()), ...config };
        let ref;
        this._dialog.open(componentOrTemplateRef, {
            ..._config,
            // Disable closing since we need to sync it up to the animation ourselves.
            disableClose: true,
            maxWidth: '100%',
            container: MatBottomSheetContainer,
            scrollStrategy: _config.scrollStrategy || this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position().global().centerHorizontally().bottom('0'),
            templateContext: () => ({ bottomSheetRef: ref }),
            providers: (cdkRef, _cdkConfig, container) => {
                ref = new MatBottomSheetRef(cdkRef, _config, container);
                return [
                    { provide: MatBottomSheetRef, useValue: ref },
                    { provide: MAT_BOTTOM_SHEET_DATA, useValue: _config.data },
                ];
            },
        });
        // When the bottom sheet is dismissed, clear the reference to it.
        ref.afterDismissed().subscribe(() => {
            // Clear the bottom sheet ref if it hasn't already been replaced by a newer one.
            if (this._openedBottomSheetRef === ref) {
                this._openedBottomSheetRef = null;
            }
        });
        if (this._openedBottomSheetRef) {
            // If a bottom sheet is already in view, dismiss it and enter the
            // new bottom sheet after exit animation is complete.
            this._openedBottomSheetRef.afterDismissed().subscribe(() => ref.containerInstance?.enter());
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
}
MatBottomSheet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatBottomSheet, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: MatBottomSheet, optional: true, skipSelf: true }, { token: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
MatBottomSheet.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatBottomSheet, providedIn: MatBottomSheetModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatBottomSheet, decorators: [{
            type: Injectable,
            args: [{ providedIn: MatBottomSheetModule }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: MatBottomSheet, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i2.MatBottomSheetConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BOTTOM_SHEET_DEFAULT_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3QyxPQUFPLEVBQ0wsVUFBVSxFQUNWLFFBQVEsRUFDUixRQUFRLEVBRVIsY0FBYyxFQUNkLE1BQU0sRUFFTixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEYsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDakUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFFckQsZ0ZBQWdGO0FBQ2hGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHLElBQUksY0FBYyxDQUNoRSxrQ0FBa0MsQ0FDbkMsQ0FBQztBQUVGOztHQUVHO0FBRUgsTUFBTSxPQUFPLGNBQWM7SUFrQnpCLFlBQ1UsUUFBaUIsRUFDekIsUUFBa0IsRUFDYyxrQkFBa0MsRUFHMUQsZUFBc0M7UUFMdEMsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUVPLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBZ0I7UUFHMUQsb0JBQWUsR0FBZixlQUFlLENBQXVCO1FBdkJ4QywrQkFBMEIsR0FBa0MsSUFBSSxDQUFDO1FBeUJ2RSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQXZCRCxzREFB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Q0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQ25DLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQztJQUNILENBQUM7OzJHQWhIVSxjQUFjLGlFQXFCNkIsY0FBYyw2Q0FFMUQsZ0NBQWdDOytHQXZCL0IsY0FBYyxjQURGLG9CQUFvQjsyRkFDaEMsY0FBYztrQkFEMUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxvQkFBb0IsRUFBQzt1R0FzQlUsY0FBYzswQkFBakUsUUFBUTs7MEJBQUksUUFBUTs7MEJBQ3BCLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsZ0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlhbG9nfSBmcm9tICdAYW5ndWxhci9jZGsvZGlhbG9nJztcbmltcG9ydCB7T3ZlcmxheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRUeXBlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEluamVjdGFibGUsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0b3IsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNQVRfQk9UVE9NX1NIRUVUX0RBVEEsIE1hdEJvdHRvbVNoZWV0Q29uZmlnfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb25maWcnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldENvbnRhaW5lcn0gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29udGFpbmVyJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRNb2R1bGV9IGZyb20gJy4vYm90dG9tLXNoZWV0LW1vZHVsZSc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0UmVmfSBmcm9tICcuL2JvdHRvbS1zaGVldC1yZWYnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IGJvdHRvbSBzaGVldCBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CT1RUT01fU0hFRVRfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdEJvdHRvbVNoZWV0Q29uZmlnPihcbiAgJ21hdC1ib3R0b20tc2hlZXQtZGVmYXVsdC1vcHRpb25zJyxcbik7XG5cbi8qKlxuICogU2VydmljZSB0byB0cmlnZ2VyIE1hdGVyaWFsIERlc2lnbiBib3R0b20gc2hlZXRzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0Qm90dG9tU2hlZXRNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdEJvdHRvbVNoZWV0IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbDogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9kaWFsb2c6IERpYWxvZztcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgb3BlbmVkIGJvdHRvbSBzaGVldC4gKi9cbiAgZ2V0IF9vcGVuZWRCb3R0b21TaGVldFJlZigpOiBNYXRCb3R0b21TaGVldFJlZjxhbnk+IHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50Qm90dG9tU2hlZXQ7XG4gICAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5fb3BlbmVkQm90dG9tU2hlZXRSZWYgOiB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsO1xuICB9XG5cbiAgc2V0IF9vcGVuZWRCb3R0b21TaGVldFJlZih2YWx1ZTogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50Qm90dG9tU2hlZXQpIHtcbiAgICAgIHRoaXMuX3BhcmVudEJvdHRvbVNoZWV0Ll9vcGVuZWRCb3R0b21TaGVldFJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50Qm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfQk9UVE9NX1NIRUVUX0RFRkFVTFRfT1BUSU9OUylcbiAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9ucz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnLFxuICApIHtcbiAgICB0aGlzLl9kaWFsb2cgPSBpbmplY3Rvci5nZXQoRGlhbG9nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIGJvdHRvbSBzaGVldCBjb250YWluaW5nIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgVHlwZSBvZiB0aGUgY29tcG9uZW50IHRvIGxvYWQgaW50byB0aGUgYm90dG9tIHNoZWV0LlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseS1vcGVuZWQgYm90dG9tIHNoZWV0LlxuICAgKi9cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55PihcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgY29uZmlnPzogTWF0Qm90dG9tU2hlZXRDb25maWc8RD4sXG4gICk6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+O1xuXG4gIC8qKlxuICAgKiBPcGVucyBhIGJvdHRvbSBzaGVldCBjb250YWluaW5nIHRoZSBnaXZlbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBib3R0b20gc2hlZXQgY29udGVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGJvdHRvbSBzaGVldC5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQ+LFxuICApOiBNYXRCb3R0b21TaGVldFJlZjxULCBSPjtcblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KFxuICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPixcbiAgKTogTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4ge1xuICAgIGNvbnN0IF9jb25maWcgPSB7Li4uKHRoaXMuX2RlZmF1bHRPcHRpb25zIHx8IG5ldyBNYXRCb3R0b21TaGVldENvbmZpZygpKSwgLi4uY29uZmlnfTtcbiAgICBsZXQgcmVmOiBNYXRCb3R0b21TaGVldFJlZjxULCBSPjtcblxuICAgIHRoaXMuX2RpYWxvZy5vcGVuPFIsIEQsIFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIHtcbiAgICAgIC4uLl9jb25maWcsXG4gICAgICAvLyBEaXNhYmxlIGNsb3Npbmcgc2luY2Ugd2UgbmVlZCB0byBzeW5jIGl0IHVwIHRvIHRoZSBhbmltYXRpb24gb3Vyc2VsdmVzLlxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcbiAgICAgIGNvbnRhaW5lcjogTWF0Qm90dG9tU2hlZXRDb250YWluZXIsXG4gICAgICBzY3JvbGxTdHJhdGVneTogX2NvbmZpZy5zY3JvbGxTdHJhdGVneSB8fCB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKSxcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKS5jZW50ZXJIb3Jpem9udGFsbHkoKS5ib3R0b20oJzAnKSxcbiAgICAgIHRlbXBsYXRlQ29udGV4dDogKCkgPT4gKHtib3R0b21TaGVldFJlZjogcmVmfSksXG4gICAgICBwcm92aWRlcnM6IChjZGtSZWYsIF9jZGtDb25maWcsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgICByZWYgPSBuZXcgTWF0Qm90dG9tU2hlZXRSZWYoY2RrUmVmLCBfY29uZmlnLCBjb250YWluZXIgYXMgTWF0Qm90dG9tU2hlZXRDb250YWluZXIpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtwcm92aWRlOiBNYXRCb3R0b21TaGVldFJlZiwgdXNlVmFsdWU6IHJlZn0sXG4gICAgICAgICAge3Byb3ZpZGU6IE1BVF9CT1RUT01fU0hFRVRfREFUQSwgdXNlVmFsdWU6IF9jb25maWcuZGF0YX0sXG4gICAgICAgIF07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV2hlbiB0aGUgYm90dG9tIHNoZWV0IGlzIGRpc21pc3NlZCwgY2xlYXIgdGhlIHJlZmVyZW5jZSB0byBpdC5cbiAgICByZWYhLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENsZWFyIHRoZSBib3R0b20gc2hlZXQgcmVmIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gcmVwbGFjZWQgYnkgYSBuZXdlciBvbmUuXG4gICAgICBpZiAodGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPT09IHJlZikge1xuICAgICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZiA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYpIHtcbiAgICAgIC8vIElmIGEgYm90dG9tIHNoZWV0IGlzIGFscmVhZHkgaW4gdmlldywgZGlzbWlzcyBpdCBhbmQgZW50ZXIgdGhlXG4gICAgICAvLyBuZXcgYm90dG9tIHNoZWV0IGFmdGVyIGV4aXQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4gcmVmLmNvbnRhaW5lckluc3RhbmNlPy5lbnRlcigpKTtcbiAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmLmRpc21pc3MoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gYm90dG9tIHNoZWV0IGlzIGluIHZpZXcsIGVudGVyIHRoZSBuZXcgYm90dG9tIHNoZWV0LlxuICAgICAgcmVmIS5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgIH1cblxuICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmID0gcmVmITtcbiAgICByZXR1cm4gcmVmITtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIHJlc3VsdCBEYXRhIHRvIHBhc3MgdG8gdGhlIGJvdHRvbSBzaGVldCBpbnN0YW5jZS5cbiAgICovXG4gIGRpc21pc3M8UiA9IGFueT4ocmVzdWx0PzogUik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuZGlzbWlzcyhyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsKSB7XG4gICAgICB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsLmRpc21pc3MoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
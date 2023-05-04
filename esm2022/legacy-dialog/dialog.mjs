/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf } from '@angular/core';
import { MatLegacyDialogContainer } from './dialog-container';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { _MatDialogBase } from '@angular/material/dialog';
import { MatLegacyDialogRef } from './dialog-ref';
import { MatLegacyDialogConfig } from './dialog-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/common";
import * as i3 from "./dialog-config";
/**
 * Injection token that can be used to access the data that was passed in to a dialog.
 * @deprecated Use `MAT_DIALOG_DATA` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const MAT_LEGACY_DIALOG_DATA = new InjectionToken('MatDialogData');
/**
 * Injection token that can be used to specify default dialog options.
 * @deprecated Use `MAT_DIALOG_DEFAULT_OPTIONS` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const MAT_LEGACY_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-dialog-default-options');
/**
 * Injection token that determines the scroll handling while the dialog is open.
 * @deprecated Use `MAT_DIALOG_SCROLL_STRATEGY` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const MAT_LEGACY_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-dialog-scroll-strategy');
/**
 * @docs-private
 * @deprecated Use `MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export function MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
/**
 * @docs-private
 * @deprecated Use `MAT_DIALOG_SCROLL_STRATEGY_PROVIDER` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_LEGACY_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Service to open Material Design modal dialogs.
 * @deprecated Use `MatDialog` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyDialog extends _MatDialogBase {
    constructor(overlay, injector, 
    /**
     * @deprecated `_location` parameter to be removed.
     * @breaking-change 10.0.0
     */
    _location, defaultOptions, scrollStrategy, parentDialog, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 15.0.0
     */
    overlayContainer, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 14.0.0
     */
    animationMode) {
        super(overlay, injector, defaultOptions, parentDialog, overlayContainer, scrollStrategy, MatLegacyDialogRef, MatLegacyDialogContainer, MAT_LEGACY_DIALOG_DATA, animationMode);
        this.dialogConfigClass = MatLegacyDialogConfig;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyDialog, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: MAT_LEGACY_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: MAT_LEGACY_DIALOG_SCROLL_STRATEGY }, { token: MatLegacyDialog, optional: true, skipSelf: true }, { token: i1.OverlayContainer }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyDialog }); }
}
export { MatLegacyDialog };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyDialog, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: i2.Location, decorators: [{
                    type: Optional
                }] }, { type: i3.MatLegacyDialogConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_LEGACY_DIALOG_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_LEGACY_DIALOG_SCROLL_STRATEGY]
                }] }, { type: MatLegacyDialog, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.OverlayContainer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1kaWFsb2cvZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sc0JBQXNCLENBQUM7QUFDL0UsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2hELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQUV0RDs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFFL0U7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHLElBQUksY0FBYyxDQUNqRSw0QkFBNEIsQ0FDN0IsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxpQ0FBaUMsR0FBRyxJQUFJLGNBQWMsQ0FDakUsNEJBQTRCLENBQzdCLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGtEQUFrRCxDQUNoRSxPQUFnQjtJQUVoQixPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoRCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLDBDQUEwQyxHQUFHO0lBQ3hELE9BQU8sRUFBRSxpQ0FBaUM7SUFDMUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2YsVUFBVSxFQUFFLGtEQUFrRDtDQUMvRCxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILE1BQ2EsZUFBZ0IsU0FBUSxjQUF3QztJQUczRSxZQUNFLE9BQWdCLEVBQ2hCLFFBQWtCO0lBQ2xCOzs7T0FHRztJQUNTLFNBQW1CLEVBQ3dCLGNBQXFDLEVBQ2pELGNBQW1CLEVBQ3RDLFlBQTZCO0lBQ3JEOzs7T0FHRztJQUNILGdCQUFrQztJQUNsQzs7O09BR0c7SUFHSCxhQUFzRDtRQUV0RCxLQUFLLENBQ0gsT0FBTyxFQUNQLFFBQVEsRUFDUixjQUFjLEVBQ2QsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixjQUFjLEVBQ2Qsa0JBQWtCLEVBQ2xCLHdCQUF3QixFQUN4QixzQkFBc0IsRUFDdEIsYUFBYSxDQUNkLENBQUM7UUFyQ2Usc0JBQWlCLEdBQUcscUJBQXFCLENBQUM7SUFzQzdELENBQUM7OEdBdkNVLGVBQWUseUdBV0osaUNBQWlDLDZCQUM3QyxpQ0FBaUMseUdBWWpDLHFCQUFxQjtrSEF4QnBCLGVBQWU7O1NBQWYsZUFBZTsyRkFBZixlQUFlO2tCQUQzQixVQUFVOzswQkFXTixRQUFROzswQkFDUixRQUFROzswQkFBSSxNQUFNOzJCQUFDLGlDQUFpQzs7MEJBQ3BELE1BQU07MkJBQUMsaUNBQWlDOzswQkFDeEMsUUFBUTs7MEJBQUksUUFBUTs7MEJBVXBCLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbnRhaW5lciwgU2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lEaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7X01hdERpYWxvZ0Jhc2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQge01hdExlZ2FjeURpYWxvZ1JlZn0gZnJvbSAnLi9kaWFsb2ctcmVmJztcbmltcG9ydCB7TWF0TGVnYWN5RGlhbG9nQ29uZmlnfSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkaWFsb2cuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1BVF9ESUFMT0dfREFUQWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTEVHQUNZX0RJQUxPR19EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdERpYWxvZ0RhdGEnKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGRlZmF1bHQgZGlhbG9nIG9wdGlvbnMuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1BVF9ESUFMT0dfREVGQVVMVF9PUFRJT05TYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2dgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9MRUdBQ1lfRElBTE9HX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRMZWdhY3lEaWFsb2dDb25maWc+KFxuICAnbWF0LWRpYWxvZy1kZWZhdWx0LW9wdGlvbnMnLFxuKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGRpYWxvZyBpcyBvcGVuLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTEVHQUNZX0RJQUxPR19TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LWRpYWxvZy1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUllgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2RpYWxvZ2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0xFR0FDWV9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlkoXG4gIG92ZXJsYXk6IE92ZXJsYXksXG4pOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2dgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9MRUdBQ1lfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0xFR0FDWV9ESUFMT0dfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9MRUdBQ1lfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIG9wZW4gTWF0ZXJpYWwgRGVzaWduIG1vZGFsIGRpYWxvZ3MuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdERpYWxvZ2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lEaWFsb2cgZXh0ZW5kcyBfTWF0RGlhbG9nQmFzZTxNYXRMZWdhY3lEaWFsb2dDb250YWluZXI+IHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGRpYWxvZ0NvbmZpZ0NsYXNzID0gTWF0TGVnYWN5RGlhbG9nQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBfbG9jYXRpb25gIHBhcmFtZXRlciB0byBiZSByZW1vdmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAgICovXG4gICAgQE9wdGlvbmFsKCkgX2xvY2F0aW9uOiBMb2NhdGlvbixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9MRUdBQ1lfRElBTE9HX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdExlZ2FjeURpYWxvZ0NvbmZpZyxcbiAgICBASW5qZWN0KE1BVF9MRUdBQ1lfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwYXJlbnREaWFsb2c6IE1hdExlZ2FjeURpYWxvZyxcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMFxuICAgICAqL1xuICAgIG92ZXJsYXlDb250YWluZXI6IE92ZXJsYXlDb250YWluZXIsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjBcbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKVxuICAgIGFuaW1hdGlvbk1vZGU/OiAnTm9vcEFuaW1hdGlvbnMnIHwgJ0Jyb3dzZXJBbmltYXRpb25zJyxcbiAgKSB7XG4gICAgc3VwZXIoXG4gICAgICBvdmVybGF5LFxuICAgICAgaW5qZWN0b3IsXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcbiAgICAgIHBhcmVudERpYWxvZyxcbiAgICAgIG92ZXJsYXlDb250YWluZXIsXG4gICAgICBzY3JvbGxTdHJhdGVneSxcbiAgICAgIE1hdExlZ2FjeURpYWxvZ1JlZixcbiAgICAgIE1hdExlZ2FjeURpYWxvZ0NvbnRhaW5lcixcbiAgICAgIE1BVF9MRUdBQ1lfRElBTE9HX0RBVEEsXG4gICAgICBhbmltYXRpb25Nb2RlLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==
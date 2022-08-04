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
import { _MatDialogBase, MatDialogConfig } from '@angular/material/dialog';
import { MatLegacyDialogRef } from './dialog-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/dialog";
/** Injection token that can be used to access the data that was passed in to a dialog. */
export const MAT_LEGACY_DIALOG_DATA = new InjectionToken('MatDialogData');
/** Injection token that can be used to specify default dialog options. */
export const MAT_LEGACY_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-dialog-default-options');
/** Injection token that determines the scroll handling while the dialog is open. */
export const MAT_LEGACY_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-dialog-scroll-strategy');
/** @docs-private */
export function MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
/** @docs-private */
export const MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_LEGACY_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_LEGACY_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Service to open Material Design modal dialogs.
 */
export class MatLegacyDialog extends _MatDialogBase {
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
    }
}
MatLegacyDialog.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatLegacyDialog, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: MAT_LEGACY_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: MAT_LEGACY_DIALOG_SCROLL_STRATEGY }, { token: MatLegacyDialog, optional: true, skipSelf: true }, { token: i1.OverlayContainer }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
MatLegacyDialog.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatLegacyDialog });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatLegacyDialog, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: i2.Location, decorators: [{
                    type: Optional
                }] }, { type: i3.MatDialogConfig, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1kaWFsb2cvZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sc0JBQXNCLENBQUM7QUFDL0UsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsY0FBYyxFQUFFLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7Ozs7QUFFaEQsMEZBQTBGO0FBQzFGLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLElBQUksY0FBYyxDQUFNLGVBQWUsQ0FBQyxDQUFDO0FBRS9FLDBFQUEwRTtBQUMxRSxNQUFNLENBQUMsTUFBTSxpQ0FBaUMsR0FBRyxJQUFJLGNBQWMsQ0FDakUsNEJBQTRCLENBQzdCLENBQUM7QUFFRixvRkFBb0Y7QUFDcEYsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQUcsSUFBSSxjQUFjLENBQ2pFLDRCQUE0QixDQUM3QixDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxrREFBa0QsQ0FDaEUsT0FBZ0I7SUFFaEIsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSwwQ0FBMEMsR0FBRztJQUN4RCxPQUFPLEVBQUUsaUNBQWlDO0lBQzFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNmLFVBQVUsRUFBRSxrREFBa0Q7Q0FDL0QsQ0FBQztBQUVGOztHQUVHO0FBRUgsTUFBTSxPQUFPLGVBQWdCLFNBQVEsY0FBd0M7SUFDM0UsWUFDRSxPQUFnQixFQUNoQixRQUFrQjtJQUNsQjs7O09BR0c7SUFDUyxTQUFtQixFQUN3QixjQUErQixFQUMzQyxjQUFtQixFQUN0QyxZQUE2QjtJQUNyRDs7O09BR0c7SUFDSCxnQkFBa0M7SUFDbEM7OztPQUdHO0lBR0gsYUFBc0Q7UUFFdEQsS0FBSyxDQUNILE9BQU8sRUFDUCxRQUFRLEVBQ1IsY0FBYyxFQUNkLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsY0FBYyxFQUNkLGtCQUFrQixFQUNsQix3QkFBd0IsRUFDeEIsc0JBQXNCLEVBQ3RCLGFBQWEsQ0FDZCxDQUFDO0lBQ0osQ0FBQzs7NEdBckNVLGVBQWUseUdBU0osaUNBQWlDLDZCQUM3QyxpQ0FBaUMsYUFDSCxlQUFlLDZFQVc3QyxxQkFBcUI7Z0hBdEJwQixlQUFlOzJGQUFmLGVBQWU7a0JBRDNCLFVBQVU7OzBCQVNOLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsaUNBQWlDOzswQkFDcEQsTUFBTTsyQkFBQyxpQ0FBaUM7OEJBQ0gsZUFBZTswQkFBcEQsUUFBUTs7MEJBQUksUUFBUTs7MEJBVXBCLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbnRhaW5lciwgU2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRMZWdhY3lEaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7X01hdERpYWxvZ0Jhc2UsIE1hdERpYWxvZ0NvbmZpZ30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7TWF0TGVnYWN5RGlhbG9nUmVmfSBmcm9tICcuL2RpYWxvZy1yZWYnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSBkYXRhIHRoYXQgd2FzIHBhc3NlZCBpbiB0byBhIGRpYWxvZy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTEVHQUNZX0RJQUxPR19EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdERpYWxvZ0RhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkaWFsb2cgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTEVHQUNZX0RJQUxPR19ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RGlhbG9nQ29uZmlnPihcbiAgJ21hdC1kaWFsb2ctZGVmYXVsdC1vcHRpb25zJyxcbik7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGRpYWxvZyBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9MRUdBQ1lfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtYXQtZGlhbG9nLXNjcm9sbC1zdHJhdGVneScsXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9MRUdBQ1lfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKFxuICBvdmVybGF5OiBPdmVybGF5LFxuKTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0xFR0FDWV9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfTEVHQUNZX0RJQUxPR19TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0xFR0FDWV9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlksXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gb3BlbiBNYXRlcmlhbCBEZXNpZ24gbW9kYWwgZGlhbG9ncy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeURpYWxvZyBleHRlbmRzIF9NYXREaWFsb2dCYXNlPE1hdExlZ2FjeURpYWxvZ0NvbnRhaW5lcj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBvdmVybGF5OiBPdmVybGF5LFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgX2xvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpIF9sb2NhdGlvbjogTG9jYXRpb24sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfTEVHQUNZX0RJQUxPR19ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXREaWFsb2dDb25maWcsXG4gICAgQEluamVjdChNQVRfTEVHQUNZX0RJQUxPR19TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcGFyZW50RGlhbG9nOiBNYXRMZWdhY3lEaWFsb2csXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICAgKi9cbiAgICBvdmVybGF5Q29udGFpbmVyOiBPdmVybGF5Q29udGFpbmVyLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSlcbiAgICBhbmltYXRpb25Nb2RlPzogJ05vb3BBbmltYXRpb25zJyB8ICdCcm93c2VyQW5pbWF0aW9ucycsXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgb3ZlcmxheSxcbiAgICAgIGluamVjdG9yLFxuICAgICAgZGVmYXVsdE9wdGlvbnMsXG4gICAgICBwYXJlbnREaWFsb2csXG4gICAgICBvdmVybGF5Q29udGFpbmVyLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3ksXG4gICAgICBNYXRMZWdhY3lEaWFsb2dSZWYsXG4gICAgICBNYXRMZWdhY3lEaWFsb2dDb250YWluZXIsXG4gICAgICBNQVRfTEVHQUNZX0RJQUxPR19EQVRBLFxuICAgICAgYW5pbWF0aW9uTW9kZSxcbiAgICApO1xuICB9XG59XG4iXX0=
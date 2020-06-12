/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { Inject, InjectionToken, isDevMode, NgModule, Optional, Version } from '@angular/core';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import { DOCUMENT } from '@angular/common';
// Private version constant to circumvent test/build issues,
// i.e. avoid core to depend on the @angular/material primary entry-point
// Can be removed once the Material primary entry-point no longer
// re-exports all secondary entry-points
const VERSION = new Version('10.0.0-rc.1-sha-277aeb041');
/** @docs-private */
export function MATERIAL_SANITY_CHECKS_FACTORY() {
    return true;
}
/** Injection token that configures whether the Material sanity checks are enabled. */
export const MATERIAL_SANITY_CHECKS = new InjectionToken('mat-sanity-checks', {
    providedIn: 'root',
    factory: MATERIAL_SANITY_CHECKS_FACTORY,
});
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, etc.
 *
 * This module should be imported to each top-level component module (e.g., MatTabsModule).
 */
let MatCommonModule = /** @class */ (() => {
    class MatCommonModule {
        constructor(highContrastModeDetector, sanityChecks, 
        /** @breaking-change 11.0.0 make document required */
        document) {
            /** Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype). */
            this._hasDoneGlobalChecks = false;
            this._document = document;
            // While A11yModule also does this, we repeat it here to avoid importing A11yModule
            // in MatCommonModule.
            highContrastModeDetector._applyBodyHighContrastModeCssClasses();
            // Note that `_sanityChecks` is typed to `any`, because AoT
            // throws an error if we use the `SanityChecks` type directly.
            this._sanityChecks = sanityChecks;
            if (!this._hasDoneGlobalChecks) {
                this._checkDoctypeIsDefined();
                this._checkThemeIsPresent();
                this._checkCdkVersionMatch();
                this._hasDoneGlobalChecks = true;
            }
        }
        /** Access injected document if available or fallback to global document reference */
        _getDocument() {
            const doc = this._document || document;
            return typeof doc === 'object' && doc ? doc : null;
        }
        /** Use defaultView of injected document if available or fallback to global window reference */
        _getWindow() {
            const doc = this._getDocument();
            const win = (doc === null || doc === void 0 ? void 0 : doc.defaultView) || window;
            return typeof win === 'object' && win ? win : null;
        }
        /** Whether any sanity checks are enabled. */
        _checksAreEnabled() {
            return isDevMode() && !this._isTestEnv();
        }
        /** Whether the code is running in tests. */
        _isTestEnv() {
            const window = this._getWindow();
            return window && (window.__karma__ || window.jasmine);
        }
        _checkDoctypeIsDefined() {
            const isEnabled = this._checksAreEnabled() &&
                (this._sanityChecks === true || this._sanityChecks.doctype);
            const document = this._getDocument();
            if (isEnabled && document && !document.doctype) {
                console.warn('Current document does not have a doctype. This may cause ' +
                    'some Angular Material components not to behave as expected.');
            }
        }
        _checkThemeIsPresent() {
            // We need to assert that the `body` is defined, because these checks run very early
            // and the `body` won't be defined if the consumer put their scripts in the `head`.
            const isDisabled = !this._checksAreEnabled() ||
                (this._sanityChecks === false || !this._sanityChecks.theme);
            const document = this._getDocument();
            if (isDisabled || !document || !document.body ||
                typeof getComputedStyle !== 'function') {
                return;
            }
            const testElement = document.createElement('div');
            testElement.classList.add('mat-theme-loaded-marker');
            document.body.appendChild(testElement);
            const computedStyle = getComputedStyle(testElement);
            // In some situations the computed style of the test element can be null. For example in
            // Firefox, the computed style is null if an application is running inside of a hidden iframe.
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
            if (computedStyle && computedStyle.display !== 'none') {
                console.warn('Could not find Angular Material core theme. Most Material ' +
                    'components may not work as expected. For more info refer ' +
                    'to the theming guide: https://material.angular.io/guide/theming');
            }
            document.body.removeChild(testElement);
        }
        /** Checks whether the material version matches the cdk version */
        _checkCdkVersionMatch() {
            const isEnabled = this._checksAreEnabled() &&
                (this._sanityChecks === true || this._sanityChecks.version);
            if (isEnabled && VERSION.full !== CDK_VERSION.full) {
                console.warn('The Angular Material version (' + VERSION.full + ') does not match ' +
                    'the Angular CDK version (' + CDK_VERSION.full + ').\n' +
                    'Please ensure the versions of these two packages exactly match.');
            }
        }
    }
    MatCommonModule.decorators = [
        { type: NgModule, args: [{
                    imports: [BidiModule],
                    exports: [BidiModule],
                },] }
    ];
    /** @nocollapse */
    MatCommonModule.ctorParameters = () => [
        { type: HighContrastModeDetector },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_SANITY_CHECKS,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
    ];
    return MatCommonModule;
})();
export { MatCommonModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxPQUFPLElBQUksV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6Qyw0REFBNEQ7QUFDNUQseUVBQXlFO0FBQ3pFLGlFQUFpRTtBQUNqRSx3Q0FBd0M7QUFDeEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUVqRCxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLDhCQUE4QjtJQUM1QyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxzRkFBc0Y7QUFDdEYsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxjQUFjLENBQWUsbUJBQW1CLEVBQUU7SUFDMUYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLDhCQUE4QjtDQUN4QyxDQUFDLENBQUM7QUFxQkg7Ozs7O0dBS0c7QUFDSDtJQUFBLE1BSWEsZUFBZTtRQVUxQixZQUNJLHdCQUFrRCxFQUNOLFlBQWlCO1FBQzdELHFEQUFxRDtRQUN2QixRQUFjO1lBYmhELGdHQUFnRztZQUN4Rix5QkFBb0IsR0FBRyxLQUFLLENBQUM7WUFhbkMsSUFBSSxDQUFD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YSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXBELHdGQUF3RjtZQUN4Riw4RkFBOEY7WUFDOUYsMkRBQTJEO1lBQzNELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO2dCQUNyRCxPQUFPLENBQUMsSUFBSSxDQUNWLDREQUE0RDtvQkFDNUQsMkRBQTJEO29CQUMzRCxpRUFBaUUsQ0FDbEUsQ0FBQzthQUNIO1lBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELGtFQUFrRTtRQUMxRCxxQkFBcUI7WUFDM0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUN4QyxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxJQUFLLElBQUksQ0FBQyxhQUFzQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXhGLElBQUksU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLElBQUksRUFBRTtnQkFDbEQsT0FBTyxDQUFDLElBQUksQ0FDUixnQ0FBZ0MsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLG1CQUFtQjtvQkFDckUsMkJBQTJCLEdBQUcsV0FBVyxDQUFDLElBQUksR0FBRyxNQUFNO29CQUN2RCxpRUFBaUUsQ0FDcEUsQ0FBQzthQUNIO1FBQ0gsQ0FBQzs7O2dCQXZIRixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO29CQUNyQixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7aUJBQ3RCOzs7O2dCQW5ETyx3QkFBd0I7Z0RBZ0V6QixRQUFRLFlBQUksTUFBTSxTQUFDLHNCQUFzQjtnREFFekMsUUFBUSxZQUFJLE1BQU0sU0FBQyxRQUFROztJQXNHbEMsc0JBQUM7S0FBQTtTQXBIWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGlnaENvbnRyYXN0TW9kZURldGVjdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0JpZGlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgaXNEZXZNb2RlLCBOZ01vZHVsZSwgT3B0aW9uYWwsIFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtWRVJTSU9OIGFzIENES19WRVJTSU9OfSBmcm9tICdAYW5ndWxhci9jZGsnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLy8gUHJpdmF0ZSB2ZXJzaW9uIGNvbnN0YW50IHRvIGNpcmN1bXZlbnQgdGVzdC9idWlsZCBpc3N1ZXMsXG4vLyBpLmUuIGF2b2lkIGNvcmUgdG8gZGVwZW5kIG9uIHRoZSBAYW5ndWxhci9tYXRlcmlhbCBwcmltYXJ5IGVudHJ5LXBvaW50XG4vLyBDYW4gYmUgcmVtb3ZlZCBvbmNlIHRoZSBNYXRlcmlhbCBwcmltYXJ5IGVudHJ5LXBvaW50IG5vIGxvbmdlclxuLy8gcmUtZXhwb3J0cyBhbGwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50c1xuY29uc3QgVkVSU0lPTiA9IG5ldyBWZXJzaW9uKCcwLjAuMC1QTEFDRUhPTERFUicpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVEVSSUFMX1NBTklUWV9DSEVDS1NfRkFDVE9SWSgpOiBTYW5pdHlDaGVja3Mge1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNvbmZpZ3VyZXMgd2hldGhlciB0aGUgTWF0ZXJpYWwgc2FuaXR5IGNoZWNrcyBhcmUgZW5hYmxlZC4gKi9cbmV4cG9ydCBjb25zdCBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTID0gbmV3IEluamVjdGlvblRva2VuPFNhbml0eUNoZWNrcz4oJ21hdC1zYW5pdHktY2hlY2tzJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6IE1BVEVSSUFMX1NBTklUWV9DSEVDS1NfRkFDVE9SWSxcbn0pO1xuXG4vKipcbiAqIFBvc3NpYmxlIHNhbml0eSBjaGVja3MgdGhhdCBjYW4gYmUgZW5hYmxlZC4gSWYgc2V0IHRvXG4gKiB0cnVlL2ZhbHNlLCBhbGwgY2hlY2tzIHdpbGwgYmUgZW5hYmxlZC9kaXNhYmxlZC5cbiAqL1xuZXhwb3J0IHR5cGUgU2FuaXR5Q2hlY2tzID0gYm9vbGVhbiB8IEdyYW51bGFyU2FuaXR5Q2hlY2tzO1xuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBzYW5pdHkgY2hlY2tzIGdyYW51bGFybHkuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyYW51bGFyU2FuaXR5Q2hlY2tzIHtcbiAgZG9jdHlwZTogYm9vbGVhbjtcbiAgdGhlbWU6IGJvb2xlYW47XG4gIHZlcnNpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgaGFtbWVyOiBib29sZWFuO1xufVxuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGNhcHR1cmVzIGFueXRoaW5nIHRoYXQgc2hvdWxkIGJlIGxvYWRlZCBhbmQvb3IgcnVuIGZvciAqYWxsKiBBbmd1bGFyIE1hdGVyaWFsXG4gKiBjb21wb25lbnRzLiBUaGlzIGluY2x1ZGVzIEJpZGksIGV0Yy5cbiAqXG4gKiBUaGlzIG1vZHVsZSBzaG91bGQgYmUgaW1wb3J0ZWQgdG8gZWFjaCB0b3AtbGV2ZWwgY29tcG9uZW50IG1vZHVsZSAoZS5nLiwgTWF0VGFic01vZHVsZSkuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtCaWRpTW9kdWxlXSxcbiAgZXhwb3J0czogW0JpZGlNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDb21tb25Nb2R1bGUge1xuICAvKiogV2hldGhlciB3ZSd2ZSBkb25lIHRoZSBnbG9iYWwgc2FuaXR5IGNoZWNrcyAoZS5nLiBhIHRoZW1lIGlzIGxvYWRlZCwgdGhlcmUgaXMgYSBkb2N0eXBlKS4gKi9cbiAgcHJpdmF0ZSBfaGFzRG9uZUdsb2JhbENoZWNrcyA9IGZhbHNlO1xuXG4gIC8qKiBDb25maWd1cmVkIHNhbml0eSBjaGVja3MuICovXG4gIHByaXZhdGUgX3Nhbml0eUNoZWNrczogU2FuaXR5Q2hlY2tzO1xuXG4gIC8qKiBVc2VkIHRvIHJlZmVyZW5jZSBjb3JyZWN0IGRvY3VtZW50L3dpbmRvdyAqL1xuICBwcm90ZWN0ZWQgX2RvY3VtZW50PzogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBoaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3I6IEhpZ2hDb250cmFzdE1vZGVEZXRlY3RvcixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFURVJJQUxfU0FOSVRZX0NIRUNLUykgc2FuaXR5Q2hlY2tzOiBhbnksXG4gICAgICAvKiogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgbWFrZSBkb2N1bWVudCByZXF1aXJlZCAqL1xuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ/OiBhbnkpIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuXG4gICAgLy8gV2hpbGUgQTExeU1vZHVsZSBhbHNvIGRvZXMgdGhpcywgd2UgcmVwZWF0IGl0IGhlcmUgdG8gYXZvaWQgaW1wb3J0aW5nIEExMXlNb2R1bGVcbiAgICAvLyBpbiBNYXRDb21tb25Nb2R1bGUuXG4gICAgaGlnaENvbnRyYXN0TW9kZURldGVjdG9yLl9hcHBseUJvZHlIaWdoQ29udHJhc3RNb2RlQ3NzQ2xhc3NlcygpO1xuXG4gICAgLy8gTm90ZSB0aGF0IGBfc2FuaXR5Q2hlY2tzYCBpcyB0eXBlZCB0byBgYW55YCwgYmVjYXVzZSBBb1RcbiAgICAvLyB0aHJvd3MgYW4gZXJyb3IgaWYgd2UgdXNlIHRoZSBgU2FuaXR5Q2hlY2tzYCB0eXBlIGRpcmVjdGx5LlxuICAgIHRoaXMuX3Nhbml0eUNoZWNrcyA9IHNhbml0eUNoZWNrcztcblxuICAgIGlmICghdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcykge1xuICAgICAgdGhpcy5fY2hlY2tEb2N0eXBlSXNEZWZpbmVkKCk7XG4gICAgICB0aGlzLl9jaGVja1RoZW1lSXNQcmVzZW50KCk7XG4gICAgICB0aGlzLl9jaGVja0Nka1ZlcnNpb25NYXRjaCgpO1xuICAgICAgdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgICAvKiogQWNjZXNzIGluamVjdGVkIGRvY3VtZW50IGlmIGF2YWlsYWJsZSBvciBmYWxsYmFjayB0byBnbG9iYWwgZG9jdW1lbnQgcmVmZXJlbmNlICovXG4gICAgcHJpdmF0ZSBfZ2V0RG9jdW1lbnQoKTogRG9jdW1lbnQgfCBudWxsIHtcbiAgICAgIGNvbnN0IGRvYyA9IHRoaXMuX2RvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgcmV0dXJuIHR5cGVvZiBkb2MgPT09ICdvYmplY3QnICYmIGRvYyA/IGRvYyA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgICBwcml2YXRlIF9nZXRXaW5kb3coKTogV2luZG93IHwgbnVsbCB7XG4gICAgICBjb25zdCBkb2MgPSB0aGlzLl9nZXREb2N1bWVudCgpO1xuICAgICAgY29uc3Qgd2luID0gZG9jPy5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gICAgICByZXR1cm4gdHlwZW9mIHdpbiA9PT0gJ29iamVjdCcgJiYgd2luID8gd2luIDogbnVsbDtcbiAgICB9XG5cbiAgLyoqIFdoZXRoZXIgYW55IHNhbml0eSBjaGVja3MgYXJlIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX2NoZWNrc0FyZUVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzRGV2TW9kZSgpICYmICF0aGlzLl9pc1Rlc3RFbnYoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gdGVzdHMuICovXG4gIHByaXZhdGUgX2lzVGVzdEVudigpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKSBhcyBhbnk7XG4gICAgcmV0dXJuIHdpbmRvdyAmJiAod2luZG93Ll9fa2FybWFfXyB8fCB3aW5kb3cuamFzbWluZSk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja0RvY3R5cGVJc0RlZmluZWQoKTogdm9pZCB7XG4gICAgY29uc3QgaXNFbmFibGVkID0gdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpICYmXG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSB0cnVlIHx8ICh0aGlzLl9zYW5pdHlDaGVja3MgYXMgR3JhbnVsYXJTYW5pdHlDaGVja3MpLmRvY3R5cGUpO1xuICAgIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5fZ2V0RG9jdW1lbnQoKTtcblxuICAgIGlmIChpc0VuYWJsZWQgJiYgZG9jdW1lbnQgJiYgIWRvY3VtZW50LmRvY3R5cGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0N1cnJlbnQgZG9jdW1lbnQgZG9lcyBub3QgaGF2ZSBhIGRvY3R5cGUuIFRoaXMgbWF5IGNhdXNlICcgK1xuICAgICAgICAnc29tZSBBbmd1bGFyIE1hdGVyaWFsIGNvbXBvbmVudHMgbm90IHRvIGJlaGF2ZSBhcyBleHBlY3RlZC4nXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrVGhlbWVJc1ByZXNlbnQoKTogdm9pZCB7XG4gICAgLy8gV2UgbmVlZCB0byBhc3NlcnQgdGhhdCB0aGUgYGJvZHlgIGlzIGRlZmluZWQsIGJlY2F1c2UgdGhlc2UgY2hlY2tzIHJ1biB2ZXJ5IGVhcmx5XG4gICAgLy8gYW5kIHRoZSBgYm9keWAgd29uJ3QgYmUgZGVmaW5lZCBpZiB0aGUgY29uc3VtZXIgcHV0IHRoZWlyIHNjcmlwdHMgaW4gdGhlIGBoZWFkYC5cbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIXRoaXMuX2NoZWNrc0FyZUVuYWJsZWQoKSB8fFxuICAgICAgKHRoaXMuX3Nhbml0eUNoZWNrcyA9PT0gZmFsc2UgfHwgISh0aGlzLl9zYW5pdHlDaGVja3MgYXMgR3JhbnVsYXJTYW5pdHlDaGVja3MpLnRoZW1lKTtcbiAgICBjb25zdCBkb2N1bWVudCA9IHRoaXMuX2dldERvY3VtZW50KCk7XG5cbiAgICBpZiAoaXNEaXNhYmxlZCB8fCAhZG9jdW1lbnQgfHwgIWRvY3VtZW50LmJvZHkgfHxcbiAgICAgICAgdHlwZW9mIGdldENvbXB1dGVkU3R5bGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LXRoZW1lLWxvYWRlZC1tYXJrZXInKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRlc3RFbGVtZW50KTtcblxuICAgIGNvbnN0IGNvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRlc3RFbGVtZW50KTtcblxuICAgIC8vIEluIHNvbWUgc2l0dWF0aW9ucyB0aGUgY29tcHV0ZWQgc3R5bGUgb2YgdGhlIHRlc3QgZWxlbWVudCBjYW4gYmUgbnVsbC4gRm9yIGV4YW1wbGUgaW5cbiAgICAvLyBGaXJlZm94LCB0aGUgY29tcHV0ZWQgc3R5bGUgaXMgbnVsbCBpZiBhbiBhcHBsaWNhdGlvbiBpcyBydW5uaW5nIGluc2lkZSBvZiBhIGhpZGRlbiBpZnJhbWUuXG4gICAgLy8gU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD01NDgzOTdcbiAgICBpZiAoY29tcHV0ZWRTdHlsZSAmJiBjb21wdXRlZFN0eWxlLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnQ291bGQgbm90IGZpbmQgQW5ndWxhciBNYXRlcmlhbCBjb3JlIHRoZW1lLiBNb3N0IE1hdGVyaWFsICcgK1xuICAgICAgICAnY29tcG9uZW50cyBtYXkgbm90IHdvcmsgYXMgZXhwZWN0ZWQuIEZvciBtb3JlIGluZm8gcmVmZXIgJyArXG4gICAgICAgICd0byB0aGUgdGhlbWluZyBndWlkZTogaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL3RoZW1pbmcnXG4gICAgICApO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGVzdEVsZW1lbnQpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBtYXRlcmlhbCB2ZXJzaW9uIG1hdGNoZXMgdGhlIGNkayB2ZXJzaW9uICovXG4gIHByaXZhdGUgX2NoZWNrQ2RrVmVyc2lvbk1hdGNoKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzRW5hYmxlZCA9IHRoaXMuX2NoZWNrc0FyZUVuYWJsZWQoKSAmJlxuICAgICAgKHRoaXMuX3Nhbml0eUNoZWNrcyA9PT0gdHJ1ZSB8fCAodGhpcy5fc2FuaXR5Q2hlY2tzIGFzIEdyYW51bGFyU2FuaXR5Q2hlY2tzKS52ZXJzaW9uKTtcblxuICAgIGlmIChpc0VuYWJsZWQgJiYgVkVSU0lPTi5mdWxsICE9PSBDREtfVkVSU0lPTi5mdWxsKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ1RoZSBBbmd1bGFyIE1hdGVyaWFsIHZlcnNpb24gKCcgKyBWRVJTSU9OLmZ1bGwgKyAnKSBkb2VzIG5vdCBtYXRjaCAnICtcbiAgICAgICAgICAndGhlIEFuZ3VsYXIgQ0RLIHZlcnNpb24gKCcgKyBDREtfVkVSU0lPTi5mdWxsICsgJykuXFxuJyArXG4gICAgICAgICAgJ1BsZWFzZSBlbnN1cmUgdGhlIHZlcnNpb25zIG9mIHRoZXNlIHR3byBwYWNrYWdlcyBleGFjdGx5IG1hdGNoLidcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=
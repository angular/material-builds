/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/common-behaviors/common-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
// Private version constant to circumvent test/build issues,
// i.e. avoid core to depend on the @angular/material primary entry-point
// Can be removed once the Material primary entry-point no longer
// re-exports all secondary entry-points
/** @type {?} */
const VERSION = new Version('9.1.1-sha-9a63a5659');
/**
 * \@docs-private
 * @return {?}
 */
export function MATERIAL_SANITY_CHECKS_FACTORY() {
    return true;
}
/**
 * Injection token that configures whether the Material sanity checks are enabled.
 * @type {?}
 */
export const MATERIAL_SANITY_CHECKS = new InjectionToken('mat-sanity-checks', {
    providedIn: 'root',
    factory: MATERIAL_SANITY_CHECKS_FACTORY,
});
/**
 * Object that can be used to configure the sanity checks granularly.
 * @record
 */
export function GranularSanityChecks() { }
if (false) {
    /** @type {?} */
    GranularSanityChecks.prototype.doctype;
    /** @type {?} */
    GranularSanityChecks.prototype.theme;
    /** @type {?} */
    GranularSanityChecks.prototype.version;
    /**
     * @deprecated No longer being used.
     * \@breaking-change 10.0.0
     * @type {?}
     */
    GranularSanityChecks.prototype.hammer;
}
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, etc.
 *
 * This module should be imported to each top-level component module (e.g., MatTabsModule).
 */
export class MatCommonModule {
    /**
     * @param {?} highContrastModeDetector
     * @param {?} sanityChecks
     */
    constructor(highContrastModeDetector, sanityChecks) {
        /**
         * Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype).
         */
        this._hasDoneGlobalChecks = false;
        /**
         * Reference to the global `document` object.
         */
        this._document = typeof document === 'object' && document ? document : null;
        /**
         * Reference to the global 'window' object.
         */
        this._window = typeof window === 'object' && window ? window : null;
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
    /**
     * Whether any sanity checks are enabled.
     * @private
     * @return {?}
     */
    _checksAreEnabled() {
        return isDevMode() && !this._isTestEnv();
    }
    /**
     * Whether the code is running in tests.
     * @private
     * @return {?}
     */
    _isTestEnv() {
        /** @type {?} */
        const window = (/** @type {?} */ (this._window));
        return window && (window.__karma__ || window.jasmine);
    }
    /**
     * @private
     * @return {?}
     */
    _checkDoctypeIsDefined() {
        /** @type {?} */
        const isEnabled = this._checksAreEnabled() &&
            (this._sanityChecks === true || ((/** @type {?} */ (this._sanityChecks))).doctype);
        if (isEnabled && this._document && !this._document.doctype) {
            console.warn('Current document does not have a doctype. This may cause ' +
                'some Angular Material components not to behave as expected.');
        }
    }
    /**
     * @private
     * @return {?}
     */
    _checkThemeIsPresent() {
        // We need to assert that the `body` is defined, because these checks run very early
        // and the `body` won't be defined if the consumer put their scripts in the `head`.
        /** @type {?} */
        const isDisabled = !this._checksAreEnabled() ||
            (this._sanityChecks === false || !((/** @type {?} */ (this._sanityChecks))).theme);
        if (isDisabled || !this._document || !this._document.body ||
            typeof getComputedStyle !== 'function') {
            return;
        }
        /** @type {?} */
        const testElement = this._document.createElement('div');
        testElement.classList.add('mat-theme-loaded-marker');
        this._document.body.appendChild(testElement);
        /** @type {?} */
        const computedStyle = getComputedStyle(testElement);
        // In some situations the computed style of the test element can be null. For example in
        // Firefox, the computed style is null if an application is running inside of a hidden iframe.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
        if (computedStyle && computedStyle.display !== 'none') {
            console.warn('Could not find Angular Material core theme. Most Material ' +
                'components may not work as expected. For more info refer ' +
                'to the theming guide: https://material.angular.io/guide/theming');
        }
        this._document.body.removeChild(testElement);
    }
    /**
     * Checks whether the material version matches the cdk version
     * @private
     * @return {?}
     */
    _checkCdkVersionMatch() {
        /** @type {?} */
        const isEnabled = this._checksAreEnabled() &&
            (this._sanityChecks === true || ((/** @type {?} */ (this._sanityChecks))).version);
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
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_SANITY_CHECKS,] }] }
];
if (false) {
    /**
     * Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype).
     * @type {?}
     * @private
     */
    MatCommonModule.prototype._hasDoneGlobalChecks;
    /**
     * Reference to the global `document` object.
     * @type {?}
     * @private
     */
    MatCommonModule.prototype._document;
    /**
     * Reference to the global 'window' object.
     * @type {?}
     * @private
     */
    MatCommonModule.prototype._window;
    /**
     * Configured sanity checks.
     * @type {?}
     * @private
     */
    MatCommonModule.prototype._sanityChecks;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxPQUFPLElBQUksV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7Ozs7TUFPOUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLG1CQUFtQixDQUFDOzs7OztBQUdoRCxNQUFNLFVBQVUsOEJBQThCO0lBQzVDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQzs7Ozs7QUFHRCxNQUFNLE9BQU8sc0JBQXNCLEdBQUcsSUFBSSxjQUFjLENBQWUsbUJBQW1CLEVBQUU7SUFDMUYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLDhCQUE4QjtDQUN4QyxDQUFDOzs7OztBQVNGLDBDQVVDOzs7SUFUQyx1Q0FBaUI7O0lBQ2pCLHFDQUFlOztJQUNmLHVDQUFpQjs7Ozs7O0lBTWpCLHNDQUFnQjs7Ozs7Ozs7QUFhbEIsTUFBTSxPQUFPLGVBQWU7Ozs7O0lBYTFCLFlBQ0ksd0JBQWtELEVBQ04sWUFBaUI7Ozs7UUFiekQseUJBQW9CLEdBQUcsS0FBSyxDQUFDOzs7O1FBRzdCLGNBQVMsR0FBRyxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzs7OztRQUd2RSxZQUFPLEdB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QUFJLFNBQVMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDbEQsT0FBTyxDQUFDLElBQUksQ0FDUixnQ0FBZ0MsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLG1CQUFtQjtnQkFDckUsMkJBQTJCLEdBQUcsV0FBVyxDQUFDLElBQUksR0FBRyxNQUFNO2dCQUN2RCxpRUFBaUUsQ0FDcEUsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7O1lBdkdGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQzthQUN0Qjs7OztZQW5ETyx3QkFBd0I7NENBbUV6QixRQUFRLFlBQUksTUFBTSxTQUFDLHNCQUFzQjs7Ozs7Ozs7SUFiOUMsK0NBQXFDOzs7Ozs7SUFHckMsb0NBQStFOzs7Ozs7SUFHL0Usa0NBQXVFOzs7Ozs7SUFHdkUsd0NBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGlnaENvbnRyYXN0TW9kZURldGVjdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0JpZGlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgaXNEZXZNb2RlLCBOZ01vZHVsZSwgT3B0aW9uYWwsIFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtWRVJTSU9OIGFzIENES19WRVJTSU9OfSBmcm9tICdAYW5ndWxhci9jZGsnO1xuXG5cbi8vIFByaXZhdGUgdmVyc2lvbiBjb25zdGFudCB0byBjaXJjdW12ZW50IHRlc3QvYnVpbGQgaXNzdWVzLFxuLy8gaS5lLiBhdm9pZCBjb3JlIHRvIGRlcGVuZCBvbiB0aGUgQGFuZ3VsYXIvbWF0ZXJpYWwgcHJpbWFyeSBlbnRyeS1wb2ludFxuLy8gQ2FuIGJlIHJlbW92ZWQgb25jZSB0aGUgTWF0ZXJpYWwgcHJpbWFyeSBlbnRyeS1wb2ludCBubyBsb25nZXJcbi8vIHJlLWV4cG9ydHMgYWxsIHNlY29uZGFyeSBlbnRyeS1wb2ludHNcbmNvbnN0IFZFUlNJT04gPSBuZXcgVmVyc2lvbignMC4wLjAtUExBQ0VIT0xERVInKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTX0ZBQ1RPUlkoKTogU2FuaXR5Q2hlY2tzIHtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjb25maWd1cmVzIHdoZXRoZXIgdGhlIE1hdGVyaWFsIHNhbml0eSBjaGVja3MgYXJlIGVuYWJsZWQuICovXG5leHBvcnQgY29uc3QgTUFURVJJQUxfU0FOSVRZX0NIRUNLUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTYW5pdHlDaGVja3M+KCdtYXQtc2FuaXR5LWNoZWNrcycsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTX0ZBQ1RPUlksXG59KTtcblxuLyoqXG4gKiBQb3NzaWJsZSBzYW5pdHkgY2hlY2tzIHRoYXQgY2FuIGJlIGVuYWJsZWQuIElmIHNldCB0b1xuICogdHJ1ZS9mYWxzZSwgYWxsIGNoZWNrcyB3aWxsIGJlIGVuYWJsZWQvZGlzYWJsZWQuXG4gKi9cbmV4cG9ydCB0eXBlIFNhbml0eUNoZWNrcyA9IGJvb2xlYW4gfCBHcmFudWxhclNhbml0eUNoZWNrcztcblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgc2FuaXR5IGNoZWNrcyBncmFudWxhcmx5LiAqL1xuZXhwb3J0IGludGVyZmFjZSBHcmFudWxhclNhbml0eUNoZWNrcyB7XG4gIGRvY3R5cGU6IGJvb2xlYW47XG4gIHRoZW1lOiBib29sZWFuO1xuICB2ZXJzaW9uOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIGhhbW1lcjogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNb2R1bGUgdGhhdCBjYXB0dXJlcyBhbnl0aGluZyB0aGF0IHNob3VsZCBiZSBsb2FkZWQgYW5kL29yIHJ1biBmb3IgKmFsbCogQW5ndWxhciBNYXRlcmlhbFxuICogY29tcG9uZW50cy4gVGhpcyBpbmNsdWRlcyBCaWRpLCBldGMuXG4gKlxuICogVGhpcyBtb2R1bGUgc2hvdWxkIGJlIGltcG9ydGVkIHRvIGVhY2ggdG9wLWxldmVsIGNvbXBvbmVudCBtb2R1bGUgKGUuZy4sIE1hdFRhYnNNb2R1bGUpLlxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQmlkaU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtCaWRpTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29tbW9uTW9kdWxlIHtcbiAgLyoqIFdoZXRoZXIgd2UndmUgZG9uZSB0aGUgZ2xvYmFsIHNhbml0eSBjaGVja3MgKGUuZy4gYSB0aGVtZSBpcyBsb2FkZWQsIHRoZXJlIGlzIGEgZG9jdHlwZSkuICovXG4gIHByaXZhdGUgX2hhc0RvbmVHbG9iYWxDaGVja3MgPSBmYWxzZTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgYGRvY3VtZW50YCBvYmplY3QuICovXG4gIHByaXZhdGUgX2RvY3VtZW50ID0gdHlwZW9mIGRvY3VtZW50ID09PSAnb2JqZWN0JyAmJiBkb2N1bWVudCA/IGRvY3VtZW50IDogbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgJ3dpbmRvdycgb2JqZWN0LiAqL1xuICBwcml2YXRlIF93aW5kb3cgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJiB3aW5kb3cgPyB3aW5kb3cgOiBudWxsO1xuXG4gIC8qKiBDb25maWd1cmVkIHNhbml0eSBjaGVja3MuICovXG4gIHByaXZhdGUgX3Nhbml0eUNoZWNrczogU2FuaXR5Q2hlY2tzO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgaGlnaENvbnRyYXN0TW9kZURldGVjdG9yOiBIaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3IsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVEVSSUFMX1NBTklUWV9DSEVDS1MpIHNhbml0eUNoZWNrczogYW55KSB7XG4gICAgLy8gV2hpbGUgQTExeU1vZHVsZSBhbHNvIGRvZXMgdGhpcywgd2UgcmVwZWF0IGl0IGhlcmUgdG8gYXZvaWQgaW1wb3J0aW5nIEExMXlNb2R1bGVcbiAgICAvLyBpbiBNYXRDb21tb25Nb2R1bGUuXG4gICAgaGlnaENvbnRyYXN0TW9kZURldGVjdG9yLl9hcHBseUJvZHlIaWdoQ29udHJhc3RNb2RlQ3NzQ2xhc3NlcygpO1xuXG4gICAgLy8gTm90ZSB0aGF0IGBfc2FuaXR5Q2hlY2tzYCBpcyB0eXBlZCB0byBgYW55YCwgYmVjYXVzZSBBb1RcbiAgICAvLyB0aHJvd3MgYW4gZXJyb3IgaWYgd2UgdXNlIHRoZSBgU2FuaXR5Q2hlY2tzYCB0eXBlIGRpcmVjdGx5LlxuICAgIHRoaXMuX3Nhbml0eUNoZWNrcyA9IHNhbml0eUNoZWNrcztcblxuICAgIGlmICghdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcykge1xuICAgICAgdGhpcy5fY2hlY2tEb2N0eXBlSXNEZWZpbmVkKCk7XG4gICAgICB0aGlzLl9jaGVja1RoZW1lSXNQcmVzZW50KCk7XG4gICAgICB0aGlzLl9jaGVja0Nka1ZlcnNpb25NYXRjaCgpO1xuICAgICAgdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgYW55IHNhbml0eSBjaGVja3MgYXJlIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX2NoZWNrc0FyZUVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzRGV2TW9kZSgpICYmICF0aGlzLl9pc1Rlc3RFbnYoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gdGVzdHMuICovXG4gIHByaXZhdGUgX2lzVGVzdEVudigpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl93aW5kb3cgYXMgYW55O1xuICAgIHJldHVybiB3aW5kb3cgJiYgKHdpbmRvdy5fX2thcm1hX18gfHwgd2luZG93Lmphc21pbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tEb2N0eXBlSXNEZWZpbmVkKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzRW5hYmxlZCA9IHRoaXMuX2NoZWNrc0FyZUVuYWJsZWQoKSAmJlxuICAgICAgKHRoaXMuX3Nhbml0eUNoZWNrcyA9PT0gdHJ1ZSB8fCAodGhpcy5fc2FuaXR5Q2hlY2tzIGFzIEdyYW51bGFyU2FuaXR5Q2hlY2tzKS5kb2N0eXBlKTtcblxuICAgIGlmIChpc0VuYWJsZWQgJiYgdGhpcy5fZG9jdW1lbnQgJiYgIXRoaXMuX2RvY3VtZW50LmRvY3R5cGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0N1cnJlbnQgZG9jdW1lbnQgZG9lcyBub3QgaGF2ZSBhIGRvY3R5cGUuIFRoaXMgbWF5IGNhdXNlICcgK1xuICAgICAgICAnc29tZSBBbmd1bGFyIE1hdGVyaWFsIGNvbXBvbmVudHMgbm90IHRvIGJlaGF2ZSBhcyBleHBlY3RlZC4nXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrVGhlbWVJc1ByZXNlbnQoKTogdm9pZCB7XG4gICAgLy8gV2UgbmVlZCB0byBhc3NlcnQgdGhhdCB0aGUgYGJvZHlgIGlzIGRlZmluZWQsIGJlY2F1c2UgdGhlc2UgY2hlY2tzIHJ1biB2ZXJ5IGVhcmx5XG4gICAgLy8gYW5kIHRoZSBgYm9keWAgd29uJ3QgYmUgZGVmaW5lZCBpZiB0aGUgY29uc3VtZXIgcHV0IHRoZWlyIHNjcmlwdHMgaW4gdGhlIGBoZWFkYC5cbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIXRoaXMuX2NoZWNrc0FyZUVuYWJsZWQoKSB8fFxuICAgICAgKHRoaXMuX3Nhbml0eUNoZWNrcyA9PT0gZmFsc2UgfHwgISh0aGlzLl9zYW5pdHlDaGVja3MgYXMgR3JhbnVsYXJTYW5pdHlDaGVja3MpLnRoZW1lKTtcblxuICAgIGlmIChpc0Rpc2FibGVkIHx8ICF0aGlzLl9kb2N1bWVudCB8fCAhdGhpcy5fZG9jdW1lbnQuYm9keSB8fFxuICAgICAgICB0eXBlb2YgZ2V0Q29tcHV0ZWRTdHlsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRlc3RFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtdGhlbWUtbG9hZGVkLW1hcmtlcicpO1xuICAgIHRoaXMuX2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVzdEVsZW1lbnQpO1xuXG4gICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGVzdEVsZW1lbnQpO1xuXG4gICAgLy8gSW4gc29tZSBzaXR1YXRpb25zIHRoZSBjb21wdXRlZCBzdHlsZSBvZiB0aGUgdGVzdCBlbGVtZW50IGNhbiBiZSBudWxsLiBGb3IgZXhhbXBsZSBpblxuICAgIC8vIEZpcmVmb3gsIHRoZSBjb21wdXRlZCBzdHlsZSBpcyBudWxsIGlmIGFuIGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcgaW5zaWRlIG9mIGEgaGlkZGVuIGlmcmFtZS5cbiAgICAvLyBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTU0ODM5N1xuICAgIGlmIChjb21wdXRlZFN0eWxlICYmIGNvbXB1dGVkU3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdDb3VsZCBub3QgZmluZCBBbmd1bGFyIE1hdGVyaWFsIGNvcmUgdGhlbWUuIE1vc3QgTWF0ZXJpYWwgJyArXG4gICAgICAgICdjb21wb25lbnRzIG1heSBub3Qgd29yayBhcyBleHBlY3RlZC4gRm9yIG1vcmUgaW5mbyByZWZlciAnICtcbiAgICAgICAgJ3RvIHRoZSB0aGVtaW5nIGd1aWRlOiBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvdGhlbWluZydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0ZXN0RWxlbWVudCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIG1hdGVyaWFsIHZlcnNpb24gbWF0Y2hlcyB0aGUgY2RrIHZlcnNpb24gKi9cbiAgcHJpdmF0ZSBfY2hlY2tDZGtWZXJzaW9uTWF0Y2goKTogdm9pZCB7XG4gICAgY29uc3QgaXNFbmFibGVkID0gdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpICYmXG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSB0cnVlIHx8ICh0aGlzLl9zYW5pdHlDaGVja3MgYXMgR3JhbnVsYXJTYW5pdHlDaGVja3MpLnZlcnNpb24pO1xuXG4gICAgaWYgKGlzRW5hYmxlZCAmJiBWRVJTSU9OLmZ1bGwgIT09IENES19WRVJTSU9OLmZ1bGwpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnVGhlIEFuZ3VsYXIgTWF0ZXJpYWwgdmVyc2lvbiAoJyArIFZFUlNJT04uZnVsbCArICcpIGRvZXMgbm90IG1hdGNoICcgK1xuICAgICAgICAgICd0aGUgQW5ndWxhciBDREsgdmVyc2lvbiAoJyArIENES19WRVJTSU9OLmZ1bGwgKyAnKS5cXG4nICtcbiAgICAgICAgICAnUGxlYXNlIGVuc3VyZSB0aGUgdmVyc2lvbnMgb2YgdGhlc2UgdHdvIHBhY2thZ2VzIGV4YWN0bHkgbWF0Y2guJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
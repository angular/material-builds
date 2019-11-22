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
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { Inject, InjectionToken, isDevMode, NgModule, Optional, Version } from '@angular/core';
import { VERSION as CDK_VERSION } from '@angular/cdk';
// Private version constant to circumvent test/build issues,
// i.e. avoid core to depend on the @angular/material primary entry-point
// Can be removed once the Material primary entry-point no longer
// re-exports all secondary entry-points
/** @type {?} */
const VERSION = new Version('9.0.0-rc.3-sha-376606521');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzNELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0YsT0FBTyxFQUFDLE9BQU8sSUFBSSxXQUFXLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7OztNQU85QyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsbUJBQW1CLENBQUM7Ozs7O0FBR2hELE1BQU0sVUFBVSw4QkFBOEI7SUFDNUMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDOzs7OztBQUdELE1BQU0sT0FBTyxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBZSxtQkFBbUIsRUFBRTtJQUMxRixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsOEJBQThCO0NBQ3hDLENBQUM7Ozs7O0FBU0YsMENBVUM7OztJQVRDLHVDQUFpQjs7SUFDakIscUNBQWU7O0lBQ2YsdUNBQWlCOzs7Ozs7SUFNakIsc0NBQWdCOzs7Ozs7OztBQWFsQixNQUFNLE9BQU8sZUFBZTs7Ozs7SUFhMUIsWUFDSSx3QkFBa0QsRUFDTixZQUFpQjs7OztRQWJ6RCx5QkFBb0IsR0FBRyxLQUFLLENBQUM7Ozs7UUFHN0IsY0FBUyxHQUFHLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzs7O1FBR3ZFLFlBQU8sR0FB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QUksU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLElBQUksRUFBRTtZQUNsRCxPQUFPLENBQUMsSUFBSSxDQUNSLGdDQUFnQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQW1CO2dCQUNyRSwyQkFBMkIsR0FBRyxXQUFXLENBQUMsSUFBSSxHQUFHLE1BQU07Z0JBQ3ZELGlFQUFpRSxDQUNwRSxDQUFDO1NBQ0g7SUFDSCxDQUFDOzs7WUF2R0YsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDckIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2FBQ3RCOzs7O1lBbkRPLHdCQUF3Qjs0Q0FtRXpCLFFBQVEsWUFBSSxNQUFNLFNBQUMsc0JBQXNCOzs7Ozs7OztJQWI5QywrQ0FBcUM7Ozs7OztJQUdyQyxvQ0FBK0U7Ozs7OztJQUcvRSxrQ0FBdUU7Ozs7OztJQUd2RSx3Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7QmlkaU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGlvblRva2VuLCBpc0Rldk1vZGUsIE5nTW9kdWxlLCBPcHRpb25hbCwgVmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZFUlNJT04gYXMgQ0RLX1ZFUlNJT059IGZyb20gJ0Bhbmd1bGFyL2Nkayc7XG5cblxuLy8gUHJpdmF0ZSB2ZXJzaW9uIGNvbnN0YW50IHRvIGNpcmN1bXZlbnQgdGVzdC9idWlsZCBpc3N1ZXMsXG4vLyBpLmUuIGF2b2lkIGNvcmUgdG8gZGVwZW5kIG9uIHRoZSBAYW5ndWxhci9tYXRlcmlhbCBwcmltYXJ5IGVudHJ5LXBvaW50XG4vLyBDYW4gYmUgcmVtb3ZlZCBvbmNlIHRoZSBNYXRlcmlhbCBwcmltYXJ5IGVudHJ5LXBvaW50IG5vIGxvbmdlclxuLy8gcmUtZXhwb3J0cyBhbGwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50c1xuY29uc3QgVkVSU0lPTiA9IG5ldyBWZXJzaW9uKCcwLjAuMC1QTEFDRUhPTERFUicpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVEVSSUFMX1NBTklUWV9DSEVDS1NfRkFDVE9SWSgpOiBTYW5pdHlDaGVja3Mge1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNvbmZpZ3VyZXMgd2hldGhlciB0aGUgTWF0ZXJpYWwgc2FuaXR5IGNoZWNrcyBhcmUgZW5hYmxlZC4gKi9cbmV4cG9ydCBjb25zdCBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTID0gbmV3IEluamVjdGlvblRva2VuPFNhbml0eUNoZWNrcz4oJ21hdC1zYW5pdHktY2hlY2tzJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6IE1BVEVSSUFMX1NBTklUWV9DSEVDS1NfRkFDVE9SWSxcbn0pO1xuXG4vKipcbiAqIFBvc3NpYmxlIHNhbml0eSBjaGVja3MgdGhhdCBjYW4gYmUgZW5hYmxlZC4gSWYgc2V0IHRvXG4gKiB0cnVlL2ZhbHNlLCBhbGwgY2hlY2tzIHdpbGwgYmUgZW5hYmxlZC9kaXNhYmxlZC5cbiAqL1xuZXhwb3J0IHR5cGUgU2FuaXR5Q2hlY2tzID0gYm9vbGVhbiB8IEdyYW51bGFyU2FuaXR5Q2hlY2tzO1xuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBzYW5pdHkgY2hlY2tzIGdyYW51bGFybHkuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyYW51bGFyU2FuaXR5Q2hlY2tzIHtcbiAgZG9jdHlwZTogYm9vbGVhbjtcbiAgdGhlbWU6IGJvb2xlYW47XG4gIHZlcnNpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgaGFtbWVyOiBib29sZWFuO1xufVxuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGNhcHR1cmVzIGFueXRoaW5nIHRoYXQgc2hvdWxkIGJlIGxvYWRlZCBhbmQvb3IgcnVuIGZvciAqYWxsKiBBbmd1bGFyIE1hdGVyaWFsXG4gKiBjb21wb25lbnRzLiBUaGlzIGluY2x1ZGVzIEJpZGksIGV0Yy5cbiAqXG4gKiBUaGlzIG1vZHVsZSBzaG91bGQgYmUgaW1wb3J0ZWQgdG8gZWFjaCB0b3AtbGV2ZWwgY29tcG9uZW50IG1vZHVsZSAoZS5nLiwgTWF0VGFic01vZHVsZSkuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtCaWRpTW9kdWxlXSxcbiAgZXhwb3J0czogW0JpZGlNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDb21tb25Nb2R1bGUge1xuICAvKiogV2hldGhlciB3ZSd2ZSBkb25lIHRoZSBnbG9iYWwgc2FuaXR5IGNoZWNrcyAoZS5nLiBhIHRoZW1lIGlzIGxvYWRlZCwgdGhlcmUgaXMgYSBkb2N0eXBlKS4gKi9cbiAgcHJpdmF0ZSBfaGFzRG9uZUdsb2JhbENoZWNrcyA9IGZhbHNlO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBgZG9jdW1lbnRgIG9iamVjdC4gKi9cbiAgcHJpdmF0ZSBfZG9jdW1lbnQgPSB0eXBlb2YgZG9jdW1lbnQgPT09ICdvYmplY3QnICYmIGRvY3VtZW50ID8gZG9jdW1lbnQgOiBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCAnd2luZG93JyBvYmplY3QuICovXG4gIHByaXZhdGUgX3dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHdpbmRvdyA/IHdpbmRvdyA6IG51bGw7XG5cbiAgLyoqIENvbmZpZ3VyZWQgc2FuaXR5IGNoZWNrcy4gKi9cbiAgcHJpdmF0ZSBfc2FuaXR5Q2hlY2tzOiBTYW5pdHlDaGVja3M7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBoaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3I6IEhpZ2hDb250cmFzdE1vZGVEZXRlY3RvcixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFURVJJQUxfU0FOSVRZX0NIRUNLUykgc2FuaXR5Q2hlY2tzOiBhbnkpIHtcbiAgICAvLyBXaGlsZSBBMTF5TW9kdWxlIGFsc28gZG9lcyB0aGlzLCB3ZSByZXBlYXQgaXQgaGVyZSB0byBhdm9pZCBpbXBvcnRpbmcgQTExeU1vZHVsZVxuICAgIC8vIGluIE1hdENvbW1vbk1vZHVsZS5cbiAgICBoaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3IuX2FwcGx5Qm9keUhpZ2hDb250cmFzdE1vZGVDc3NDbGFzc2VzKCk7XG5cbiAgICAvLyBOb3RlIHRoYXQgYF9zYW5pdHlDaGVja3NgIGlzIHR5cGVkIHRvIGBhbnlgLCBiZWNhdXNlIEFvVFxuICAgIC8vIHRocm93cyBhbiBlcnJvciBpZiB3ZSB1c2UgdGhlIGBTYW5pdHlDaGVja3NgIHR5cGUgZGlyZWN0bHkuXG4gICAgdGhpcy5fc2FuaXR5Q2hlY2tzID0gc2FuaXR5Q2hlY2tzO1xuXG4gICAgaWYgKCF0aGlzLl9oYXNEb25lR2xvYmFsQ2hlY2tzKSB7XG4gICAgICB0aGlzLl9jaGVja0RvY3R5cGVJc0RlZmluZWQoKTtcbiAgICAgIHRoaXMuX2NoZWNrVGhlbWVJc1ByZXNlbnQoKTtcbiAgICAgIHRoaXMuX2NoZWNrQ2RrVmVyc2lvbk1hdGNoKCk7XG4gICAgICB0aGlzLl9oYXNEb25lR2xvYmFsQ2hlY2tzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciBhbnkgc2FuaXR5IGNoZWNrcyBhcmUgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tzQXJlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNEZXZNb2RlKCkgJiYgIXRoaXMuX2lzVGVzdEVudigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvZGUgaXMgcnVubmluZyBpbiB0ZXN0cy4gKi9cbiAgcHJpdmF0ZSBfaXNUZXN0RW52KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX3dpbmRvdyBhcyBhbnk7XG4gICAgcmV0dXJuIHdpbmRvdyAmJiAod2luZG93Ll9fa2FybWFfXyB8fCB3aW5kb3cuamFzbWluZSk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja0RvY3R5cGVJc0RlZmluZWQoKTogdm9pZCB7XG4gICAgY29uc3QgaXNFbmFibGVkID0gdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpICYmXG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSB0cnVlIHx8ICh0aGlzLl9zYW5pdHlDaGVja3MgYXMgR3JhbnVsYXJTYW5pdHlDaGVja3MpLmRvY3R5cGUpO1xuXG4gICAgaWYgKGlzRW5hYmxlZCAmJiB0aGlzLl9kb2N1bWVudCAmJiAhdGhpcy5fZG9jdW1lbnQuZG9jdHlwZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnQ3VycmVudCBkb2N1bWVudCBkb2VzIG5vdCBoYXZlIGEgZG9jdHlwZS4gVGhpcyBtYXkgY2F1c2UgJyArXG4gICAgICAgICdzb21lIEFuZ3VsYXIgTWF0ZXJpYWwgY29tcG9uZW50cyBub3QgdG8gYmVoYXZlIGFzIGV4cGVjdGVkLidcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tUaGVtZUlzUHJlc2VudCgpOiB2b2lkIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFzc2VydCB0aGF0IHRoZSBgYm9keWAgaXMgZGVmaW5lZCwgYmVjYXVzZSB0aGVzZSBjaGVja3MgcnVuIHZlcnkgZWFybHlcbiAgICAvLyBhbmQgdGhlIGBib2R5YCB3b24ndCBiZSBkZWZpbmVkIGlmIHRoZSBjb25zdW1lciBwdXQgdGhlaXIgc2NyaXB0cyBpbiB0aGUgYGhlYWRgLlxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAhdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpIHx8XG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSBmYWxzZSB8fCAhKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykudGhlbWUpO1xuXG4gICAgaWYgKGlzRGlzYWJsZWQgfHwgIXRoaXMuX2RvY3VtZW50IHx8ICF0aGlzLl9kb2N1bWVudC5ib2R5IHx8XG4gICAgICAgIHR5cGVvZiBnZXRDb21wdXRlZFN0eWxlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGVzdEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC10aGVtZS1sb2FkZWQtbWFya2VyJyk7XG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0ZXN0RWxlbWVudCk7XG5cbiAgICAvLyBJbiBzb21lIHNpdHVhdGlvbnMgdGhlIGNvbXB1dGVkIHN0eWxlIG9mIHRoZSB0ZXN0IGVsZW1lbnQgY2FuIGJlIG51bGwuIEZvciBleGFtcGxlIGluXG4gICAgLy8gRmlyZWZveCwgdGhlIGNvbXB1dGVkIHN0eWxlIGlzIG51bGwgaWYgYW4gYXBwbGljYXRpb24gaXMgcnVubmluZyBpbnNpZGUgb2YgYSBoaWRkZW4gaWZyYW1lLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTQ4Mzk3XG4gICAgaWYgKGNvbXB1dGVkU3R5bGUgJiYgY29tcHV0ZWRTdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIEFuZ3VsYXIgTWF0ZXJpYWwgY29yZSB0aGVtZS4gTW9zdCBNYXRlcmlhbCAnICtcbiAgICAgICAgJ2NvbXBvbmVudHMgbWF5IG5vdCB3b3JrIGFzIGV4cGVjdGVkLiBGb3IgbW9yZSBpbmZvIHJlZmVyICcgK1xuICAgICAgICAndG8gdGhlIHRoZW1pbmcgZ3VpZGU6IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRlc3RFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgbWF0ZXJpYWwgdmVyc2lvbiBtYXRjaGVzIHRoZSBjZGsgdmVyc2lvbiAqL1xuICBwcml2YXRlIF9jaGVja0Nka1ZlcnNpb25NYXRjaCgpOiB2b2lkIHtcbiAgICBjb25zdCBpc0VuYWJsZWQgPSB0aGlzLl9jaGVja3NBcmVFbmFibGVkKCkgJiZcbiAgICAgICh0aGlzLl9zYW5pdHlDaGVja3MgPT09IHRydWUgfHwgKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykudmVyc2lvbik7XG5cbiAgICBpZiAoaXNFbmFibGVkICYmIFZFUlNJT04uZnVsbCAhPT0gQ0RLX1ZFUlNJT04uZnVsbCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdUaGUgQW5ndWxhciBNYXRlcmlhbCB2ZXJzaW9uICgnICsgVkVSU0lPTi5mdWxsICsgJykgZG9lcyBub3QgbWF0Y2ggJyArXG4gICAgICAgICAgJ3RoZSBBbmd1bGFyIENESyB2ZXJzaW9uICgnICsgQ0RLX1ZFUlNJT04uZnVsbCArICcpLlxcbicgK1xuICAgICAgICAgICdQbGVhc2UgZW5zdXJlIHRoZSB2ZXJzaW9ucyBvZiB0aGVzZSB0d28gcGFja2FnZXMgZXhhY3RseSBtYXRjaC4nXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19
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
import { DOCUMENT } from '@angular/common';
// Private version constant to circumvent test/build issues,
// i.e. avoid core to depend on the @angular/material primary entry-point
// Can be removed once the Material primary entry-point no longer
// re-exports all secondary entry-points
/** @type {?} */
const VERSION = new Version('9.1.2-sha-e3d205121');
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
     * @param {?=} document
     */
    constructor(highContrastModeDetector, sanityChecks, 
    /** @breaking-change 11.0.0 make document required */
    document) {
        /**
         * Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype).
         */
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
    /**
     * Access injected document if available or fallback to global document reference
     * @private
     * @return {?}
     */
    _getDocument() {
        /** @type {?} */
        const doc = this._document || document;
        return typeof doc === 'object' && doc ? doc : null;
    }
    /**
     * Use defaultView of injected document if available or fallback to global window reference
     * @private
     * @return {?}
     */
    _getWindow() {
        var _a;
        /** @type {?} */
        const doc = this._getDocument();
        /** @type {?} */
        const win = ((_a = doc) === null || _a === void 0 ? void 0 : _a.defaultView) || window;
        return typeof win === 'object' && win ? win : null;
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
        const window = (/** @type {?} */ (this._getWindow()));
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
        /** @type {?} */
        const document = this._getDocument();
        if (isEnabled && document && !document.doctype) {
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
        /** @type {?} */
        const document = this._getDocument();
        if (isDisabled || !document || !document.body ||
            typeof getComputedStyle !== 'function') {
            return;
        }
        /** @type {?} */
        const testElement = document.createElement('div');
        testElement.classList.add('mat-theme-loaded-marker');
        document.body.appendChild(testElement);
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
        document.body.removeChild(testElement);
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
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_SANITY_CHECKS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
];
if (false) {
    /**
     * Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype).
     * @type {?}
     * @private
     */
    MatCommonModule.prototype._hasDoneGlobalChecks;
    /**
     * Configured sanity checks.
     * @type {?}
     * @private
     */
    MatCommonModule.prototype._sanityChecks;
    /**
     * Used to reference correct document/window
     * @type {?}
     * @protected
     */
    MatCommonModule.prototype._document;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxPQUFPLElBQUksV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O01BTW5DLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs7Ozs7QUFHaEQsTUFBTSxVQUFVLDhCQUE4QjtJQUM1QyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7Ozs7O0FBR0QsTUFBTSxPQUFPLHNCQUFzQixHQUFHLElBQUksY0FBYyxDQUFlLG1CQUFtQixFQUFFO0lBQzFGLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSw4QkFBOEI7Q0FDeEMsQ0FBQzs7Ozs7QUFTRiwwQ0FVQzs7O0lBVEMsdUNBQWlCOztJQUNqQixxQ0FBZTs7SUFDZix1Q0FBaUI7Ozs7OztJQU1qQixzQ0FBZ0I7Ozs7Ozs7O0FBYWxCLE1BQU0sT0FBTyxlQUFlOzs7Ozs7SUFVMUIsWUFDSSx3QkFBa0QsRUFDTixZQUFpQjtJQUM3RCxxREFBcUQ7SUFDdkIsUUFBYzs7OztRQVp4Qyx5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFhbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFFMUIs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SSxDQUNWLDREQUE0RDtnQkFDNUQsMkRBQTJEO2dCQUMzRCxpRUFBaUUsQ0FDbEUsQ0FBQztTQUNIO1FBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7Ozs7O0lBR08scUJBQXFCOztjQUNyQixTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3hDLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLElBQUksQ0FBQyxtQkFBQSxJQUFJLENBQUMsYUFBYSxFQUF3QixDQUFDLENBQUMsT0FBTyxDQUFDO1FBRXZGLElBQUksU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLElBQUksRUFBRTtZQUNsRCxPQUFPLENBQUMsSUFBSSxDQUNSLGdDQUFnQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQW1CO2dCQUNyRSwyQkFBMkIsR0FBRyxXQUFXLENBQUMsSUFBSSxHQUFHLE1BQU07Z0JBQ3ZELGlFQUFpRSxDQUNwRSxDQUFDO1NBQ0g7SUFDSCxDQUFDOzs7WUF2SEYsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDckIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2FBQ3RCOzs7O1lBbkRPLHdCQUF3Qjs0Q0FnRXpCLFFBQVEsWUFBSSxNQUFNLFNBQUMsc0JBQXNCOzRDQUV6QyxRQUFRLFlBQUksTUFBTSxTQUFDLFFBQVE7Ozs7Ozs7O0lBWmhDLCtDQUFxQzs7Ozs7O0lBR3JDLHdDQUFvQzs7Ozs7O0lBR3BDLG9DQUErQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hpZ2hDb250cmFzdE1vZGVEZXRlY3Rvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCaWRpTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0aW9uVG9rZW4sIGlzRGV2TW9kZSwgTmdNb2R1bGUsIE9wdGlvbmFsLCBWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VkVSU0lPTiBhcyBDREtfVkVSU0lPTn0gZnJvbSAnQGFuZ3VsYXIvY2RrJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8vIFByaXZhdGUgdmVyc2lvbiBjb25zdGFudCB0byBjaXJjdW12ZW50IHRlc3QvYnVpbGQgaXNzdWVzLFxuLy8gaS5lLiBhdm9pZCBjb3JlIHRvIGRlcGVuZCBvbiB0aGUgQGFuZ3VsYXIvbWF0ZXJpYWwgcHJpbWFyeSBlbnRyeS1wb2ludFxuLy8gQ2FuIGJlIHJlbW92ZWQgb25jZSB0aGUgTWF0ZXJpYWwgcHJpbWFyeSBlbnRyeS1wb2ludCBubyBsb25nZXJcbi8vIHJlLWV4cG9ydHMgYWxsIHNlY29uZGFyeSBlbnRyeS1wb2ludHNcbmNvbnN0IFZFUlNJT04gPSBuZXcgVmVyc2lvbignMC4wLjAtUExBQ0VIT0xERVInKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTX0ZBQ1RPUlkoKTogU2FuaXR5Q2hlY2tzIHtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjb25maWd1cmVzIHdoZXRoZXIgdGhlIE1hdGVyaWFsIHNhbml0eSBjaGVja3MgYXJlIGVuYWJsZWQuICovXG5leHBvcnQgY29uc3QgTUFURVJJQUxfU0FOSVRZX0NIRUNLUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTYW5pdHlDaGVja3M+KCdtYXQtc2FuaXR5LWNoZWNrcycsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTX0ZBQ1RPUlksXG59KTtcblxuLyoqXG4gKiBQb3NzaWJsZSBzYW5pdHkgY2hlY2tzIHRoYXQgY2FuIGJlIGVuYWJsZWQuIElmIHNldCB0b1xuICogdHJ1ZS9mYWxzZSwgYWxsIGNoZWNrcyB3aWxsIGJlIGVuYWJsZWQvZGlzYWJsZWQuXG4gKi9cbmV4cG9ydCB0eXBlIFNhbml0eUNoZWNrcyA9IGJvb2xlYW4gfCBHcmFudWxhclNhbml0eUNoZWNrcztcblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgc2FuaXR5IGNoZWNrcyBncmFudWxhcmx5LiAqL1xuZXhwb3J0IGludGVyZmFjZSBHcmFudWxhclNhbml0eUNoZWNrcyB7XG4gIGRvY3R5cGU6IGJvb2xlYW47XG4gIHRoZW1lOiBib29sZWFuO1xuICB2ZXJzaW9uOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIGhhbW1lcjogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNb2R1bGUgdGhhdCBjYXB0dXJlcyBhbnl0aGluZyB0aGF0IHNob3VsZCBiZSBsb2FkZWQgYW5kL29yIHJ1biBmb3IgKmFsbCogQW5ndWxhciBNYXRlcmlhbFxuICogY29tcG9uZW50cy4gVGhpcyBpbmNsdWRlcyBCaWRpLCBldGMuXG4gKlxuICogVGhpcyBtb2R1bGUgc2hvdWxkIGJlIGltcG9ydGVkIHRvIGVhY2ggdG9wLWxldmVsIGNvbXBvbmVudCBtb2R1bGUgKGUuZy4sIE1hdFRhYnNNb2R1bGUpLlxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQmlkaU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtCaWRpTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29tbW9uTW9kdWxlIHtcbiAgLyoqIFdoZXRoZXIgd2UndmUgZG9uZSB0aGUgZ2xvYmFsIHNhbml0eSBjaGVja3MgKGUuZy4gYSB0aGVtZSBpcyBsb2FkZWQsIHRoZXJlIGlzIGEgZG9jdHlwZSkuICovXG4gIHByaXZhdGUgX2hhc0RvbmVHbG9iYWxDaGVja3MgPSBmYWxzZTtcblxuICAvKiogQ29uZmlndXJlZCBzYW5pdHkgY2hlY2tzLiAqL1xuICBwcml2YXRlIF9zYW5pdHlDaGVja3M6IFNhbml0eUNoZWNrcztcblxuICAvKiogVXNlZCB0byByZWZlcmVuY2UgY29ycmVjdCBkb2N1bWVudC93aW5kb3cgKi9cbiAgcHJvdGVjdGVkIF9kb2N1bWVudD86IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgaGlnaENvbnRyYXN0TW9kZURldGVjdG9yOiBIaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3IsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVEVSSUFMX1NBTklUWV9DSEVDS1MpIHNhbml0eUNoZWNrczogYW55LFxuICAgICAgLyoqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIG1ha2UgZG9jdW1lbnQgcmVxdWlyZWQgKi9cbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50PzogYW55KSB7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcblxuICAgIC8vIFdoaWxlIEExMXlNb2R1bGUgYWxzbyBkb2VzIHRoaXMsIHdlIHJlcGVhdCBpdCBoZXJlIHRvIGF2b2lkIGltcG9ydGluZyBBMTF5TW9kdWxlXG4gICAgLy8gaW4gTWF0Q29tbW9uTW9kdWxlLlxuICAgIGhpZ2hDb250cmFzdE1vZGVEZXRlY3Rvci5fYXBwbHlCb2R5SGlnaENvbnRyYXN0TW9kZUNzc0NsYXNzZXMoKTtcblxuICAgIC8vIE5vdGUgdGhhdCBgX3Nhbml0eUNoZWNrc2AgaXMgdHlwZWQgdG8gYGFueWAsIGJlY2F1c2UgQW9UXG4gICAgLy8gdGhyb3dzIGFuIGVycm9yIGlmIHdlIHVzZSB0aGUgYFNhbml0eUNoZWNrc2AgdHlwZSBkaXJlY3RseS5cbiAgICB0aGlzLl9zYW5pdHlDaGVja3MgPSBzYW5pdHlDaGVja3M7XG5cbiAgICBpZiAoIXRoaXMuX2hhc0RvbmVHbG9iYWxDaGVja3MpIHtcbiAgICAgIHRoaXMuX2NoZWNrRG9jdHlwZUlzRGVmaW5lZCgpO1xuICAgICAgdGhpcy5fY2hlY2tUaGVtZUlzUHJlc2VudCgpO1xuICAgICAgdGhpcy5fY2hlY2tDZGtWZXJzaW9uTWF0Y2goKTtcbiAgICAgIHRoaXMuX2hhc0RvbmVHbG9iYWxDaGVja3MgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gICAgLyoqIEFjY2VzcyBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIGRvY3VtZW50IHJlZmVyZW5jZSAqL1xuICAgIHByaXZhdGUgX2dldERvY3VtZW50KCk6IERvY3VtZW50IHwgbnVsbCB7XG4gICAgICBjb25zdCBkb2MgPSB0aGlzLl9kb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgIHJldHVybiB0eXBlb2YgZG9jID09PSAnb2JqZWN0JyAmJiBkb2MgPyBkb2MgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKiBVc2UgZGVmYXVsdFZpZXcgb2YgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIGdsb2JhbCB3aW5kb3cgcmVmZXJlbmNlICovXG4gICAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB8IG51bGwge1xuICAgICAgY29uc3QgZG9jID0gdGhpcy5fZ2V0RG9jdW1lbnQoKTtcbiAgICAgIGNvbnN0IHdpbiA9IGRvYz8uZGVmYXVsdFZpZXcgfHwgd2luZG93O1xuICAgICAgcmV0dXJuIHR5cGVvZiB3aW4gPT09ICdvYmplY3QnICYmIHdpbiA/IHdpbiA6IG51bGw7XG4gICAgfVxuXG4gIC8qKiBXaGV0aGVyIGFueSBzYW5pdHkgY2hlY2tzIGFyZSBlbmFibGVkLiAqL1xuICBwcml2YXRlIF9jaGVja3NBcmVFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0Rldk1vZGUoKSAmJiAhdGhpcy5faXNUZXN0RW52KCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY29kZSBpcyBydW5uaW5nIGluIHRlc3RzLiAqL1xuICBwcml2YXRlIF9pc1Rlc3RFbnYoKSB7XG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy5fZ2V0V2luZG93KCkgYXMgYW55O1xuICAgIHJldHVybiB3aW5kb3cgJiYgKHdpbmRvdy5fX2thcm1hX18gfHwgd2luZG93Lmphc21pbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tEb2N0eXBlSXNEZWZpbmVkKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzRW5hYmxlZCA9IHRoaXMuX2NoZWNrc0FyZUVuYWJsZWQoKSAmJlxuICAgICAgKHRoaXMuX3Nhbml0eUNoZWNrcyA9PT0gdHJ1ZSB8fCAodGhpcy5fc2FuaXR5Q2hlY2tzIGFzIEdyYW51bGFyU2FuaXR5Q2hlY2tzKS5kb2N0eXBlKTtcbiAgICBjb25zdCBkb2N1bWVudCA9IHRoaXMuX2dldERvY3VtZW50KCk7XG5cbiAgICBpZiAoaXNFbmFibGVkICYmIGRvY3VtZW50ICYmICFkb2N1bWVudC5kb2N0eXBlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdDdXJyZW50IGRvY3VtZW50IGRvZXMgbm90IGhhdmUgYSBkb2N0eXBlLiBUaGlzIG1heSBjYXVzZSAnICtcbiAgICAgICAgJ3NvbWUgQW5ndWxhciBNYXRlcmlhbCBjb21wb25lbnRzIG5vdCB0byBiZWhhdmUgYXMgZXhwZWN0ZWQuJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jaGVja1RoZW1lSXNQcmVzZW50KCk6IHZvaWQge1xuICAgIC8vIFdlIG5lZWQgdG8gYXNzZXJ0IHRoYXQgdGhlIGBib2R5YCBpcyBkZWZpbmVkLCBiZWNhdXNlIHRoZXNlIGNoZWNrcyBydW4gdmVyeSBlYXJseVxuICAgIC8vIGFuZCB0aGUgYGJvZHlgIHdvbid0IGJlIGRlZmluZWQgaWYgdGhlIGNvbnN1bWVyIHB1dCB0aGVpciBzY3JpcHRzIGluIHRoZSBgaGVhZGAuXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9ICF0aGlzLl9jaGVja3NBcmVFbmFibGVkKCkgfHxcbiAgICAgICh0aGlzLl9zYW5pdHlDaGVja3MgPT09IGZhbHNlIHx8ICEodGhpcy5fc2FuaXR5Q2hlY2tzIGFzIEdyYW51bGFyU2FuaXR5Q2hlY2tzKS50aGVtZSk7XG4gICAgY29uc3QgZG9jdW1lbnQgPSB0aGlzLl9nZXREb2N1bWVudCgpO1xuXG4gICAgaWYgKGlzRGlzYWJsZWQgfHwgIWRvY3VtZW50IHx8ICFkb2N1bWVudC5ib2R5IHx8XG4gICAgICAgIHR5cGVvZiBnZXRDb21wdXRlZFN0eWxlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC10aGVtZS1sb2FkZWQtbWFya2VyJyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0ZXN0RWxlbWVudCk7XG5cbiAgICAvLyBJbiBzb21lIHNpdHVhdGlvbnMgdGhlIGNvbXB1dGVkIHN0eWxlIG9mIHRoZSB0ZXN0IGVsZW1lbnQgY2FuIGJlIG51bGwuIEZvciBleGFtcGxlIGluXG4gICAgLy8gRmlyZWZveCwgdGhlIGNvbXB1dGVkIHN0eWxlIGlzIG51bGwgaWYgYW4gYXBwbGljYXRpb24gaXMgcnVubmluZyBpbnNpZGUgb2YgYSBoaWRkZW4gaWZyYW1lLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTQ4Mzk3XG4gICAgaWYgKGNvbXB1dGVkU3R5bGUgJiYgY29tcHV0ZWRTdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIEFuZ3VsYXIgTWF0ZXJpYWwgY29yZSB0aGVtZS4gTW9zdCBNYXRlcmlhbCAnICtcbiAgICAgICAgJ2NvbXBvbmVudHMgbWF5IG5vdCB3b3JrIGFzIGV4cGVjdGVkLiBGb3IgbW9yZSBpbmZvIHJlZmVyICcgK1xuICAgICAgICAndG8gdGhlIHRoZW1pbmcgZ3VpZGU6IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRlc3RFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgbWF0ZXJpYWwgdmVyc2lvbiBtYXRjaGVzIHRoZSBjZGsgdmVyc2lvbiAqL1xuICBwcml2YXRlIF9jaGVja0Nka1ZlcnNpb25NYXRjaCgpOiB2b2lkIHtcbiAgICBjb25zdCBpc0VuYWJsZWQgPSB0aGlzLl9jaGVja3NBcmVFbmFibGVkKCkgJiZcbiAgICAgICh0aGlzLl9zYW5pdHlDaGVja3MgPT09IHRydWUgfHwgKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykudmVyc2lvbik7XG5cbiAgICBpZiAoaXNFbmFibGVkICYmIFZFUlNJT04uZnVsbCAhPT0gQ0RLX1ZFUlNJT04uZnVsbCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdUaGUgQW5ndWxhciBNYXRlcmlhbCB2ZXJzaW9uICgnICsgVkVSU0lPTi5mdWxsICsgJykgZG9lcyBub3QgbWF0Y2ggJyArXG4gICAgICAgICAgJ3RoZSBBbmd1bGFyIENESyB2ZXJzaW9uICgnICsgQ0RLX1ZFUlNJT04uZnVsbCArICcpLlxcbicgK1xuICAgICAgICAgICdQbGVhc2UgZW5zdXJlIHRoZSB2ZXJzaW9ucyBvZiB0aGVzZSB0d28gcGFja2FnZXMgZXhhY3RseSBtYXRjaC4nXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19
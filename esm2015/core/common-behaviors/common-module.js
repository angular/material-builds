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
const VERSION = new Version('10.2.0-next.0-sha-c79dc6fc4');
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
export class MatCommonModule {
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
MatCommonModule.ctorParameters = () => [
    { type: HighContrastModeDetector },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_SANITY_CHECKS,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxPQUFPLElBQUksV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6Qyw0REFBNEQ7QUFDNUQseUVBQXlFO0FBQ3pFLGlFQUFpRTtBQUNqRSx3Q0FBd0M7QUFDeEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUVqRCxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLDhCQUE4QjtJQUM1QyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxzRkFBc0Y7QUFDdEYsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxjQUFjLENBQWUsbUJBQW1CLEVBQUU7SUFDMUYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLDhCQUE4QjtDQUN4QyxDQUFDLENBQUM7QUFxQkg7Ozs7O0dBS0c7QUFLSCxNQUFNLE9BQU8sZUFBZTtJQVUxQixZQUNJLHdCQUFrRCxFQUNOLFlBQWlCO0lBQzdELHFEQUFxRDtJQUN2QixRQUFjO1FBYmhELGdHQUFnRztRQUN4Rix5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFhbkMsSUFBSSxDQUFD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QUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXBELHdGQUF3RjtRQUN4Riw4RkFBOEY7UUFDOUYsMkRBQTJEO1FBQzNELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO1lBQ3JELE9BQU8sQ0FBQyxJQUFJLENBQ1YsNERBQTREO2dCQUM1RCwyREFBMkQ7Z0JBQzNELGlFQUFpRSxDQUNsRSxDQUFDO1NBQ0g7UUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsa0VBQWtFO0lBQzFELHFCQUFxQjtRQUMzQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDeEMsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksSUFBSyxJQUFJLENBQUMsYUFBc0MsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RixJQUFJLFNBQVMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDbEQsT0FBTyxDQUFDLElBQUksQ0FDUixnQ0FBZ0MsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLG1CQUFtQjtnQkFDckUsMkJBQTJCLEdBQUcsV0FBVyxDQUFDLElBQUksR0FBRyxNQUFNO2dCQUN2RCxpRUFBaUUsQ0FDcEUsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7O1lBdkhGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQzthQUN0Qjs7O1lBbkRPLHdCQUF3Qjs0Q0FnRXpCLFFBQVEsWUFBSSxNQUFNLFNBQUMsc0JBQXNCOzRDQUV6QyxRQUFRLFlBQUksTUFBTSxTQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7QmlkaU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGlvblRva2VuLCBpc0Rldk1vZGUsIE5nTW9kdWxlLCBPcHRpb25hbCwgVmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZFUlNJT04gYXMgQ0RLX1ZFUlNJT059IGZyb20gJ0Bhbmd1bGFyL2Nkayc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4vLyBQcml2YXRlIHZlcnNpb24gY29uc3RhbnQgdG8gY2lyY3VtdmVudCB0ZXN0L2J1aWxkIGlzc3Vlcyxcbi8vIGkuZS4gYXZvaWQgY29yZSB0byBkZXBlbmQgb24gdGhlIEBhbmd1bGFyL21hdGVyaWFsIHByaW1hcnkgZW50cnktcG9pbnRcbi8vIENhbiBiZSByZW1vdmVkIG9uY2UgdGhlIE1hdGVyaWFsIHByaW1hcnkgZW50cnktcG9pbnQgbm8gbG9uZ2VyXG4vLyByZS1leHBvcnRzIGFsbCBzZWNvbmRhcnkgZW50cnktcG9pbnRzXG5jb25zdCBWRVJTSU9OID0gbmV3IFZlcnNpb24oJzAuMC4wLVBMQUNFSE9MREVSJyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFURVJJQUxfU0FOSVRZX0NIRUNLU19GQUNUT1JZKCk6IFNhbml0eUNoZWNrcyB7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY29uZmlndXJlcyB3aGV0aGVyIHRoZSBNYXRlcmlhbCBzYW5pdHkgY2hlY2tzIGFyZSBlbmFibGVkLiAqL1xuZXhwb3J0IGNvbnN0IE1BVEVSSUFMX1NBTklUWV9DSEVDS1MgPSBuZXcgSW5qZWN0aW9uVG9rZW48U2FuaXR5Q2hlY2tzPignbWF0LXNhbml0eS1jaGVja3MnLCB7XG4gIHByb3ZpZGVkSW46ICdyb290JyxcbiAgZmFjdG9yeTogTUFURVJJQUxfU0FOSVRZX0NIRUNLU19GQUNUT1JZLFxufSk7XG5cbi8qKlxuICogUG9zc2libGUgc2FuaXR5IGNoZWNrcyB0aGF0IGNhbiBiZSBlbmFibGVkLiBJZiBzZXQgdG9cbiAqIHRydWUvZmFsc2UsIGFsbCBjaGVja3Mgd2lsbCBiZSBlbmFibGVkL2Rpc2FibGVkLlxuICovXG5leHBvcnQgdHlwZSBTYW5pdHlDaGVja3MgPSBib29sZWFuIHwgR3JhbnVsYXJTYW5pdHlDaGVja3M7XG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIHNhbml0eSBjaGVja3MgZ3JhbnVsYXJseS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JhbnVsYXJTYW5pdHlDaGVja3Mge1xuICBkb2N0eXBlOiBib29sZWFuO1xuICB0aGVtZTogYm9vbGVhbjtcbiAgdmVyc2lvbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqL1xuICBoYW1tZXI6IGJvb2xlYW47XG59XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgY2FwdHVyZXMgYW55dGhpbmcgdGhhdCBzaG91bGQgYmUgbG9hZGVkIGFuZC9vciBydW4gZm9yICphbGwqIEFuZ3VsYXIgTWF0ZXJpYWxcbiAqIGNvbXBvbmVudHMuIFRoaXMgaW5jbHVkZXMgQmlkaSwgZXRjLlxuICpcbiAqIFRoaXMgbW9kdWxlIHNob3VsZCBiZSBpbXBvcnRlZCB0byBlYWNoIHRvcC1sZXZlbCBjb21wb25lbnQgbW9kdWxlIChlLmcuLCBNYXRUYWJzTW9kdWxlKS5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0JpZGlNb2R1bGVdLFxuICBleHBvcnRzOiBbQmlkaU1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbW1vbk1vZHVsZSB7XG4gIC8qKiBXaGV0aGVyIHdlJ3ZlIGRvbmUgdGhlIGdsb2JhbCBzYW5pdHkgY2hlY2tzIChlLmcuIGEgdGhlbWUgaXMgbG9hZGVkLCB0aGVyZSBpcyBhIGRvY3R5cGUpLiAqL1xuICBwcml2YXRlIF9oYXNEb25lR2xvYmFsQ2hlY2tzID0gZmFsc2U7XG5cbiAgLyoqIENvbmZpZ3VyZWQgc2FuaXR5IGNoZWNrcy4gKi9cbiAgcHJpdmF0ZSBfc2FuaXR5Q2hlY2tzOiBTYW5pdHlDaGVja3M7XG5cbiAgLyoqIFVzZWQgdG8gcmVmZXJlbmNlIGNvcnJlY3QgZG9jdW1lbnQvd2luZG93ICovXG4gIHByb3RlY3RlZCBfZG9jdW1lbnQ/OiBEb2N1bWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGhpZ2hDb250cmFzdE1vZGVEZXRlY3RvcjogSGlnaENvbnRyYXN0TW9kZURldGVjdG9yLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTKSBzYW5pdHlDaGVja3M6IGFueSxcbiAgICAgIC8qKiBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBtYWtlIGRvY3VtZW50IHJlcXVpcmVkICovXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudD86IGFueSkge1xuICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG5cbiAgICAvLyBXaGlsZSBBMTF5TW9kdWxlIGFsc28gZG9lcyB0aGlzLCB3ZSByZXBlYXQgaXQgaGVyZSB0byBhdm9pZCBpbXBvcnRpbmcgQTExeU1vZHVsZVxuICAgIC8vIGluIE1hdENvbW1vbk1vZHVsZS5cbiAgICBoaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3IuX2FwcGx5Qm9keUhpZ2hDb250cmFzdE1vZGVDc3NDbGFzc2VzKCk7XG5cbiAgICAvLyBOb3RlIHRoYXQgYF9zYW5pdHlDaGVja3NgIGlzIHR5cGVkIHRvIGBhbnlgLCBiZWNhdXNlIEFvVFxuICAgIC8vIHRocm93cyBhbiBlcnJvciBpZiB3ZSB1c2UgdGhlIGBTYW5pdHlDaGVja3NgIHR5cGUgZGlyZWN0bHkuXG4gICAgdGhpcy5fc2FuaXR5Q2hlY2tzID0gc2FuaXR5Q2hlY2tzO1xuXG4gICAgaWYgKCF0aGlzLl9oYXNEb25lR2xvYmFsQ2hlY2tzKSB7XG4gICAgICB0aGlzLl9jaGVja0RvY3R5cGVJc0RlZmluZWQoKTtcbiAgICAgIHRoaXMuX2NoZWNrVGhlbWVJc1ByZXNlbnQoKTtcbiAgICAgIHRoaXMuX2NoZWNrQ2RrVmVyc2lvbk1hdGNoKCk7XG4gICAgICB0aGlzLl9oYXNEb25lR2xvYmFsQ2hlY2tzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAgIC8qKiBBY2Nlc3MgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIGdsb2JhbCBkb2N1bWVudCByZWZlcmVuY2UgKi9cbiAgICBwcml2YXRlIF9nZXREb2N1bWVudCgpOiBEb2N1bWVudCB8IG51bGwge1xuICAgICAgY29uc3QgZG9jID0gdGhpcy5fZG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICByZXR1cm4gdHlwZW9mIGRvYyA9PT0gJ29iamVjdCcgJiYgZG9jID8gZG9jIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKiogVXNlIGRlZmF1bHRWaWV3IG9mIGluamVjdGVkIGRvY3VtZW50IGlmIGF2YWlsYWJsZSBvciBmYWxsYmFjayB0byBnbG9iYWwgd2luZG93IHJlZmVyZW5jZSAqL1xuICAgIHByaXZhdGUgX2dldFdpbmRvdygpOiBXaW5kb3cgfCBudWxsIHtcbiAgICAgIGNvbnN0IGRvYyA9IHRoaXMuX2dldERvY3VtZW50KCk7XG4gICAgICBjb25zdCB3aW4gPSBkb2M/LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgICAgIHJldHVybiB0eXBlb2Ygd2luID09PSAnb2JqZWN0JyAmJiB3aW4gPyB3aW4gOiBudWxsO1xuICAgIH1cblxuICAvKiogV2hldGhlciBhbnkgc2FuaXR5IGNoZWNrcyBhcmUgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tzQXJlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNEZXZNb2RlKCkgJiYgIXRoaXMuX2lzVGVzdEVudigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvZGUgaXMgcnVubmluZyBpbiB0ZXN0cy4gKi9cbiAgcHJpdmF0ZSBfaXNUZXN0RW52KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpIGFzIGFueTtcbiAgICByZXR1cm4gd2luZG93ICYmICh3aW5kb3cuX19rYXJtYV9fIHx8IHdpbmRvdy5qYXNtaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrRG9jdHlwZUlzRGVmaW5lZCgpOiB2b2lkIHtcbiAgICBjb25zdCBpc0VuYWJsZWQgPSB0aGlzLl9jaGVja3NBcmVFbmFibGVkKCkgJiZcbiAgICAgICh0aGlzLl9zYW5pdHlDaGVja3MgPT09IHRydWUgfHwgKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykuZG9jdHlwZSk7XG4gICAgY29uc3QgZG9jdW1lbnQgPSB0aGlzLl9nZXREb2N1bWVudCgpO1xuXG4gICAgaWYgKGlzRW5hYmxlZCAmJiBkb2N1bWVudCAmJiAhZG9jdW1lbnQuZG9jdHlwZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnQ3VycmVudCBkb2N1bWVudCBkb2VzIG5vdCBoYXZlIGEgZG9jdHlwZS4gVGhpcyBtYXkgY2F1c2UgJyArXG4gICAgICAgICdzb21lIEFuZ3VsYXIgTWF0ZXJpYWwgY29tcG9uZW50cyBub3QgdG8gYmVoYXZlIGFzIGV4cGVjdGVkLidcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tUaGVtZUlzUHJlc2VudCgpOiB2b2lkIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFzc2VydCB0aGF0IHRoZSBgYm9keWAgaXMgZGVmaW5lZCwgYmVjYXVzZSB0aGVzZSBjaGVja3MgcnVuIHZlcnkgZWFybHlcbiAgICAvLyBhbmQgdGhlIGBib2R5YCB3b24ndCBiZSBkZWZpbmVkIGlmIHRoZSBjb25zdW1lciBwdXQgdGhlaXIgc2NyaXB0cyBpbiB0aGUgYGhlYWRgLlxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAhdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpIHx8XG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSBmYWxzZSB8fCAhKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykudGhlbWUpO1xuICAgIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5fZ2V0RG9jdW1lbnQoKTtcblxuICAgIGlmIChpc0Rpc2FibGVkIHx8ICFkb2N1bWVudCB8fCAhZG9jdW1lbnQuYm9keSB8fFxuICAgICAgICB0eXBlb2YgZ2V0Q29tcHV0ZWRTdHlsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtdGhlbWUtbG9hZGVkLW1hcmtlcicpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVzdEVsZW1lbnQpO1xuXG4gICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGVzdEVsZW1lbnQpO1xuXG4gICAgLy8gSW4gc29tZSBzaXR1YXRpb25zIHRoZSBjb21wdXRlZCBzdHlsZSBvZiB0aGUgdGVzdCBlbGVtZW50IGNhbiBiZSBudWxsLiBGb3IgZXhhbXBsZSBpblxuICAgIC8vIEZpcmVmb3gsIHRoZSBjb21wdXRlZCBzdHlsZSBpcyBudWxsIGlmIGFuIGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcgaW5zaWRlIG9mIGEgaGlkZGVuIGlmcmFtZS5cbiAgICAvLyBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTU0ODM5N1xuICAgIGlmIChjb21wdXRlZFN0eWxlICYmIGNvbXB1dGVkU3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdDb3VsZCBub3QgZmluZCBBbmd1bGFyIE1hdGVyaWFsIGNvcmUgdGhlbWUuIE1vc3QgTWF0ZXJpYWwgJyArXG4gICAgICAgICdjb21wb25lbnRzIG1heSBub3Qgd29yayBhcyBleHBlY3RlZC4gRm9yIG1vcmUgaW5mbyByZWZlciAnICtcbiAgICAgICAgJ3RvIHRoZSB0aGVtaW5nIGd1aWRlOiBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvdGhlbWluZydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0ZXN0RWxlbWVudCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIG1hdGVyaWFsIHZlcnNpb24gbWF0Y2hlcyB0aGUgY2RrIHZlcnNpb24gKi9cbiAgcHJpdmF0ZSBfY2hlY2tDZGtWZXJzaW9uTWF0Y2goKTogdm9pZCB7XG4gICAgY29uc3QgaXNFbmFibGVkID0gdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpICYmXG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSB0cnVlIHx8ICh0aGlzLl9zYW5pdHlDaGVja3MgYXMgR3JhbnVsYXJTYW5pdHlDaGVja3MpLnZlcnNpb24pO1xuXG4gICAgaWYgKGlzRW5hYmxlZCAmJiBWRVJTSU9OLmZ1bGwgIT09IENES19WRVJTSU9OLmZ1bGwpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnVGhlIEFuZ3VsYXIgTWF0ZXJpYWwgdmVyc2lvbiAoJyArIFZFUlNJT04uZnVsbCArICcpIGRvZXMgbm90IG1hdGNoICcgK1xuICAgICAgICAgICd0aGUgQW5ndWxhciBDREsgdmVyc2lvbiAoJyArIENES19WRVJTSU9OLmZ1bGwgKyAnKS5cXG4nICtcbiAgICAgICAgICAnUGxlYXNlIGVuc3VyZSB0aGUgdmVyc2lvbnMgb2YgdGhlc2UgdHdvIHBhY2thZ2VzIGV4YWN0bHkgbWF0Y2guJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
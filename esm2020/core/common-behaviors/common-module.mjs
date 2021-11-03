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
import { _isTestEnvironment } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
// Private version constant to circumvent test/build issues,
// i.e. avoid core to depend on the @angular/material primary entry-point
// Can be removed once the Material primary entry-point no longer
// re-exports all secondary entry-points
const VERSION = new Version('13.0.0');
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
    constructor(highContrastModeDetector, sanityChecks, document) {
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
    /** Gets whether a specific sanity check is enabled. */
    _checkIsEnabled(name) {
        // TODO(crisbeto): we can't use `ngDevMode` here yet, because ViewEngine apps might not support
        // it. Since these checks can have performance implications and they aren't tree shakeable
        // in their current form, we can leave the `isDevMode` check in for now.
        // tslint:disable-next-line:ban
        if (!isDevMode() || _isTestEnvironment()) {
            return false;
        }
        if (typeof this._sanityChecks === 'boolean') {
            return this._sanityChecks;
        }
        return !!this._sanityChecks[name];
    }
    _checkDoctypeIsDefined() {
        if (this._checkIsEnabled('doctype') && !this._document.doctype) {
            console.warn('Current document does not have a doctype. This may cause ' +
                'some Angular Material components not to behave as expected.');
        }
    }
    _checkThemeIsPresent() {
        // We need to assert that the `body` is defined, because these checks run very early
        // and the `body` won't be defined if the consumer put their scripts in the `head`.
        if (!this._checkIsEnabled('theme') ||
            !this._document.body ||
            typeof getComputedStyle !== 'function') {
            return;
        }
        const testElement = this._document.createElement('div');
        testElement.classList.add('mat-theme-loaded-marker');
        this._document.body.appendChild(testElement);
        const computedStyle = getComputedStyle(testElement);
        // In some situations the computed style of the test element can be null. For example in
        // Firefox, the computed style is null if an application is running inside of a hidden iframe.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
        if (computedStyle && computedStyle.display !== 'none') {
            console.warn('Could not find Angular Material core theme. Most Material ' +
                'components may not work as expected. For more info refer ' +
                'to the theming guide: https://material.angular.io/guide/theming');
        }
        testElement.remove();
    }
    /** Checks whether the material version matches the cdk version */
    _checkCdkVersionMatch() {
        if (this._checkIsEnabled('version') && VERSION.full !== CDK_VERSION.full) {
            console.warn('The Angular Material version (' +
                VERSION.full +
                ') does not match ' +
                'the Angular CDK version (' +
                CDK_VERSION.full +
                ').\n' +
                'Please ensure the versions of these two packages exactly match.');
        }
    }
}
MatCommonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatCommonModule, deps: [{ token: i1.HighContrastModeDetector }, { token: MATERIAL_SANITY_CHECKS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.NgModule });
MatCommonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatCommonModule, imports: [BidiModule], exports: [BidiModule] });
MatCommonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatCommonModule, imports: [[BidiModule], BidiModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [BidiModule],
                    exports: [BidiModule],
                }]
        }], ctorParameters: function () { return [{ type: i1.HighContrastModeDetector }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MATERIAL_SANITY_CHECKS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxPQUFPLElBQUksV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBRXpELDREQUE0RDtBQUM1RCx5RUFBeUU7QUFDekUsaUVBQWlFO0FBQ2pFLHdDQUF3QztBQUN4QyxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRWpELG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsOEJBQThCO0lBQzVDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHNGQUFzRjtBQUN0RixNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBZSxtQkFBbUIsRUFBRTtJQUMxRixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsOEJBQThCO0NBQ3hDLENBQUMsQ0FBQztBQWVIOzs7OztHQUtHO0FBS0gsTUFBTSxPQUFPLGVBQWU7SUFVMUIsWUFDRSx3QkFBa0QsRUFDTixZQUFpQixFQUMzQyxRQUFhO1FBWmpDLGdHQUFnRztRQUN4Rix5QkFB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QUFDLFVBQVUsQ0FBQyxFQUNYLFVBQVU7Z0dBRVQsZUFBZTtrQkFKM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3JCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztpQkFDdEI7OzBCQWFJLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsc0JBQXNCOzswQkFDekMsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGlnaENvbnRyYXN0TW9kZURldGVjdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0JpZGlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgaXNEZXZNb2RlLCBOZ01vZHVsZSwgT3B0aW9uYWwsIFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtWRVJTSU9OIGFzIENES19WRVJTSU9OfSBmcm9tICdAYW5ndWxhci9jZGsnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7X2lzVGVzdEVudmlyb25tZW50fSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG4vLyBQcml2YXRlIHZlcnNpb24gY29uc3RhbnQgdG8gY2lyY3VtdmVudCB0ZXN0L2J1aWxkIGlzc3Vlcyxcbi8vIGkuZS4gYXZvaWQgY29yZSB0byBkZXBlbmQgb24gdGhlIEBhbmd1bGFyL21hdGVyaWFsIHByaW1hcnkgZW50cnktcG9pbnRcbi8vIENhbiBiZSByZW1vdmVkIG9uY2UgdGhlIE1hdGVyaWFsIHByaW1hcnkgZW50cnktcG9pbnQgbm8gbG9uZ2VyXG4vLyByZS1leHBvcnRzIGFsbCBzZWNvbmRhcnkgZW50cnktcG9pbnRzXG5jb25zdCBWRVJTSU9OID0gbmV3IFZlcnNpb24oJzAuMC4wLVBMQUNFSE9MREVSJyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFURVJJQUxfU0FOSVRZX0NIRUNLU19GQUNUT1JZKCk6IFNhbml0eUNoZWNrcyB7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY29uZmlndXJlcyB3aGV0aGVyIHRoZSBNYXRlcmlhbCBzYW5pdHkgY2hlY2tzIGFyZSBlbmFibGVkLiAqL1xuZXhwb3J0IGNvbnN0IE1BVEVSSUFMX1NBTklUWV9DSEVDS1MgPSBuZXcgSW5qZWN0aW9uVG9rZW48U2FuaXR5Q2hlY2tzPignbWF0LXNhbml0eS1jaGVja3MnLCB7XG4gIHByb3ZpZGVkSW46ICdyb290JyxcbiAgZmFjdG9yeTogTUFURVJJQUxfU0FOSVRZX0NIRUNLU19GQUNUT1JZLFxufSk7XG5cbi8qKlxuICogUG9zc2libGUgc2FuaXR5IGNoZWNrcyB0aGF0IGNhbiBiZSBlbmFibGVkLiBJZiBzZXQgdG9cbiAqIHRydWUvZmFsc2UsIGFsbCBjaGVja3Mgd2lsbCBiZSBlbmFibGVkL2Rpc2FibGVkLlxuICovXG5leHBvcnQgdHlwZSBTYW5pdHlDaGVja3MgPSBib29sZWFuIHwgR3JhbnVsYXJTYW5pdHlDaGVja3M7XG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIHNhbml0eSBjaGVja3MgZ3JhbnVsYXJseS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JhbnVsYXJTYW5pdHlDaGVja3Mge1xuICBkb2N0eXBlOiBib29sZWFuO1xuICB0aGVtZTogYm9vbGVhbjtcbiAgdmVyc2lvbjogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNb2R1bGUgdGhhdCBjYXB0dXJlcyBhbnl0aGluZyB0aGF0IHNob3VsZCBiZSBsb2FkZWQgYW5kL29yIHJ1biBmb3IgKmFsbCogQW5ndWxhciBNYXRlcmlhbFxuICogY29tcG9uZW50cy4gVGhpcyBpbmNsdWRlcyBCaWRpLCBldGMuXG4gKlxuICogVGhpcyBtb2R1bGUgc2hvdWxkIGJlIGltcG9ydGVkIHRvIGVhY2ggdG9wLWxldmVsIGNvbXBvbmVudCBtb2R1bGUgKGUuZy4sIE1hdFRhYnNNb2R1bGUpLlxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQmlkaU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtCaWRpTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29tbW9uTW9kdWxlIHtcbiAgLyoqIFdoZXRoZXIgd2UndmUgZG9uZSB0aGUgZ2xvYmFsIHNhbml0eSBjaGVja3MgKGUuZy4gYSB0aGVtZSBpcyBsb2FkZWQsIHRoZXJlIGlzIGEgZG9jdHlwZSkuICovXG4gIHByaXZhdGUgX2hhc0RvbmVHbG9iYWxDaGVja3MgPSBmYWxzZTtcblxuICAvKiogQ29uZmlndXJlZCBzYW5pdHkgY2hlY2tzLiAqL1xuICBwcml2YXRlIF9zYW5pdHlDaGVja3M6IFNhbml0eUNoZWNrcztcblxuICAvKiogVXNlZCB0byByZWZlcmVuY2UgY29ycmVjdCBkb2N1bWVudC93aW5kb3cgKi9cbiAgcHJvdGVjdGVkIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaGlnaENvbnRyYXN0TW9kZURldGVjdG9yOiBIaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTKSBzYW5pdHlDaGVja3M6IGFueSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICApIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuXG4gICAgLy8gV2hpbGUgQTExeU1vZHVsZSBhbHNvIGRvZXMgdGhpcywgd2UgcmVwZWF0IGl0IGhlcmUgdG8gYXZvaWQgaW1wb3J0aW5nIEExMXlNb2R1bGVcbiAgICAvLyBpbiBNYXRDb21tb25Nb2R1bGUuXG4gICAgaGlnaENvbnRyYXN0TW9kZURldGVjdG9yLl9hcHBseUJvZHlIaWdoQ29udHJhc3RNb2RlQ3NzQ2xhc3NlcygpO1xuXG4gICAgLy8gTm90ZSB0aGF0IGBfc2FuaXR5Q2hlY2tzYCBpcyB0eXBlZCB0byBgYW55YCwgYmVjYXVzZSBBb1RcbiAgICAvLyB0aHJvd3MgYW4gZXJyb3IgaWYgd2UgdXNlIHRoZSBgU2FuaXR5Q2hlY2tzYCB0eXBlIGRpcmVjdGx5LlxuICAgIHRoaXMuX3Nhbml0eUNoZWNrcyA9IHNhbml0eUNoZWNrcztcblxuICAgIGlmICghdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcykge1xuICAgICAgdGhpcy5fY2hlY2tEb2N0eXBlSXNEZWZpbmVkKCk7XG4gICAgICB0aGlzLl9jaGVja1RoZW1lSXNQcmVzZW50KCk7XG4gICAgICB0aGlzLl9jaGVja0Nka1ZlcnNpb25NYXRjaCgpO1xuICAgICAgdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIHNwZWNpZmljIHNhbml0eSBjaGVjayBpcyBlbmFibGVkLiAqL1xuICBwcml2YXRlIF9jaGVja0lzRW5hYmxlZChuYW1lOiBrZXlvZiBHcmFudWxhclNhbml0eUNoZWNrcyk6IGJvb2xlYW4ge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBjYW4ndCB1c2UgYG5nRGV2TW9kZWAgaGVyZSB5ZXQsIGJlY2F1c2UgVmlld0VuZ2luZSBhcHBzIG1pZ2h0IG5vdCBzdXBwb3J0XG4gICAgLy8gaXQuIFNpbmNlIHRoZXNlIGNoZWNrcyBjYW4gaGF2ZSBwZXJmb3JtYW5jZSBpbXBsaWNhdGlvbnMgYW5kIHRoZXkgYXJlbid0IHRyZWUgc2hha2VhYmxlXG4gICAgLy8gaW4gdGhlaXIgY3VycmVudCBmb3JtLCB3ZSBjYW4gbGVhdmUgdGhlIGBpc0Rldk1vZGVgIGNoZWNrIGluIGZvciBub3cuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhblxuICAgIGlmICghaXNEZXZNb2RlKCkgfHwgX2lzVGVzdEVudmlyb25tZW50KCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuX3Nhbml0eUNoZWNrcyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2FuaXR5Q2hlY2tzO1xuICAgIH1cblxuICAgIHJldHVybiAhIXRoaXMuX3Nhbml0eUNoZWNrc1tuYW1lXTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrRG9jdHlwZUlzRGVmaW5lZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2hlY2tJc0VuYWJsZWQoJ2RvY3R5cGUnKSAmJiAhdGhpcy5fZG9jdW1lbnQuZG9jdHlwZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnQ3VycmVudCBkb2N1bWVudCBkb2VzIG5vdCBoYXZlIGEgZG9jdHlwZS4gVGhpcyBtYXkgY2F1c2UgJyArXG4gICAgICAgICAgJ3NvbWUgQW5ndWxhciBNYXRlcmlhbCBjb21wb25lbnRzIG5vdCB0byBiZWhhdmUgYXMgZXhwZWN0ZWQuJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tUaGVtZUlzUHJlc2VudCgpOiB2b2lkIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFzc2VydCB0aGF0IHRoZSBgYm9keWAgaXMgZGVmaW5lZCwgYmVjYXVzZSB0aGVzZSBjaGVja3MgcnVuIHZlcnkgZWFybHlcbiAgICAvLyBhbmQgdGhlIGBib2R5YCB3b24ndCBiZSBkZWZpbmVkIGlmIHRoZSBjb25zdW1lciBwdXQgdGhlaXIgc2NyaXB0cyBpbiB0aGUgYGhlYWRgLlxuICAgIGlmIChcbiAgICAgICF0aGlzLl9jaGVja0lzRW5hYmxlZCgndGhlbWUnKSB8fFxuICAgICAgIXRoaXMuX2RvY3VtZW50LmJvZHkgfHxcbiAgICAgIHR5cGVvZiBnZXRDb21wdXRlZFN0eWxlICE9PSAnZnVuY3Rpb24nXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGVzdEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC10aGVtZS1sb2FkZWQtbWFya2VyJyk7XG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0ZXN0RWxlbWVudCk7XG5cbiAgICAvLyBJbiBzb21lIHNpdHVhdGlvbnMgdGhlIGNvbXB1dGVkIHN0eWxlIG9mIHRoZSB0ZXN0IGVsZW1lbnQgY2FuIGJlIG51bGwuIEZvciBleGFtcGxlIGluXG4gICAgLy8gRmlyZWZveCwgdGhlIGNvbXB1dGVkIHN0eWxlIGlzIG51bGwgaWYgYW4gYXBwbGljYXRpb24gaXMgcnVubmluZyBpbnNpZGUgb2YgYSBoaWRkZW4gaWZyYW1lLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTQ4Mzk3XG4gICAgaWYgKGNvbXB1dGVkU3R5bGUgJiYgY29tcHV0ZWRTdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIEFuZ3VsYXIgTWF0ZXJpYWwgY29yZSB0aGVtZS4gTW9zdCBNYXRlcmlhbCAnICtcbiAgICAgICAgICAnY29tcG9uZW50cyBtYXkgbm90IHdvcmsgYXMgZXhwZWN0ZWQuIEZvciBtb3JlIGluZm8gcmVmZXIgJyArXG4gICAgICAgICAgJ3RvIHRoZSB0aGVtaW5nIGd1aWRlOiBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvdGhlbWluZycsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRlc3RFbGVtZW50LnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBtYXRlcmlhbCB2ZXJzaW9uIG1hdGNoZXMgdGhlIGNkayB2ZXJzaW9uICovXG4gIHByaXZhdGUgX2NoZWNrQ2RrVmVyc2lvbk1hdGNoKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jaGVja0lzRW5hYmxlZCgndmVyc2lvbicpICYmIFZFUlNJT04uZnVsbCAhPT0gQ0RLX1ZFUlNJT04uZnVsbCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnVGhlIEFuZ3VsYXIgTWF0ZXJpYWwgdmVyc2lvbiAoJyArXG4gICAgICAgICAgVkVSU0lPTi5mdWxsICtcbiAgICAgICAgICAnKSBkb2VzIG5vdCBtYXRjaCAnICtcbiAgICAgICAgICAndGhlIEFuZ3VsYXIgQ0RLIHZlcnNpb24gKCcgK1xuICAgICAgICAgIENES19WRVJTSU9OLmZ1bGwgK1xuICAgICAgICAgICcpLlxcbicgK1xuICAgICAgICAgICdQbGVhc2UgZW5zdXJlIHRoZSB2ZXJzaW9ucyBvZiB0aGVzZSB0d28gcGFja2FnZXMgZXhhY3RseSBtYXRjaC4nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
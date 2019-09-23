/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule, InjectionToken, Optional, Inject, isDevMode, Version } from '@angular/core';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { BidiModule } from '@angular/cdk/bidi';
import { VERSION as CDK_VERSION } from '@angular/cdk';
// Private version constant to circumvent test/build issues,
// i.e. avoid core to depend on the @angular/material primary entry-point
// Can be removed once the Material primary entry-point no longer
// re-exports all secondary entry-points
var VERSION = new Version('8.2.0-2112fac64-2112fac');
/** @docs-private */
export function MATERIAL_SANITY_CHECKS_FACTORY() {
    return true;
}
/** Injection token that configures whether the Material sanity checks are enabled. */
export var MATERIAL_SANITY_CHECKS = new InjectionToken('mat-sanity-checks', {
    providedIn: 'root',
    factory: MATERIAL_SANITY_CHECKS_FACTORY,
});
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, etc.
 *
 * This module should be imported to each top-level component module (e.g., MatTabsModule).
 */
var MatCommonModule = /** @class */ (function () {
    function MatCommonModule(sanityChecks, _hammerLoader) {
        this._hammerLoader = _hammerLoader;
        /** Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype). */
        this._hasDoneGlobalChecks = false;
        /** Whether we've already checked for HammerJs availability. */
        this._hasCheckedHammer = false;
        /** Reference to the global `document` object. */
        this._document = typeof document === 'object' && document ? document : null;
        /** Reference to the global 'window' object. */
        this._window = typeof window === 'object' && window ? window : null;
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
    /** Whether any sanity checks are enabled. */
    MatCommonModule.prototype._checksAreEnabled = function () {
        return isDevMode() && !this._isTestEnv();
    };
    /** Whether the code is running in tests. */
    MatCommonModule.prototype._isTestEnv = function () {
        var window = this._window;
        return window && (window.__karma__ || window.jasmine);
    };
    MatCommonModule.prototype._checkDoctypeIsDefined = function () {
        var isEnabled = this._checksAreEnabled() &&
            (this._sanityChecks === true || this._sanityChecks.doctype);
        if (isEnabled && this._document && !this._document.doctype) {
            console.warn('Current document does not have a doctype. This may cause ' +
                'some Angular Material components not to behave as expected.');
        }
    };
    MatCommonModule.prototype._checkThemeIsPresent = function () {
        // We need to assert that the `body` is defined, because these checks run very early
        // and the `body` won't be defined if the consumer put their scripts in the `head`.
        var isDisabled = !this._checksAreEnabled() ||
            (this._sanityChecks === false || !this._sanityChecks.theme);
        if (isDisabled || !this._document || !this._document.body ||
            typeof getComputedStyle !== 'function') {
            return;
        }
        var testElement = this._document.createElement('div');
        testElement.classList.add('mat-theme-loaded-marker');
        this._document.body.appendChild(testElement);
        var computedStyle = getComputedStyle(testElement);
        // In some situations the computed style of the test element can be null. For example in
        // Firefox, the computed style is null if an application is running inside of a hidden iframe.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
        if (computedStyle && computedStyle.display !== 'none') {
            console.warn('Could not find Angular Material core theme. Most Material ' +
                'components may not work as expected. For more info refer ' +
                'to the theming guide: https://material.angular.io/guide/theming');
        }
        this._document.body.removeChild(testElement);
    };
    /** Checks whether the material version matches the cdk version */
    MatCommonModule.prototype._checkCdkVersionMatch = function () {
        var isEnabled = this._checksAreEnabled() &&
            (this._sanityChecks === true || this._sanityChecks.version);
        if (isEnabled && VERSION.full !== CDK_VERSION.full) {
            console.warn('The Angular Material version (' + VERSION.full + ') does not match ' +
                'the Angular CDK version (' + CDK_VERSION.full + ').\n' +
                'Please ensure the versions of these two packages exactly match.');
        }
    };
    /** Checks whether HammerJS is available. */
    MatCommonModule.prototype._checkHammerIsAvailable = function () {
        if (this._hasCheckedHammer || !this._window) {
            return;
        }
        var isEnabled = this._checksAreEnabled() &&
            (this._sanityChecks === true || this._sanityChecks.hammer);
        if (isEnabled && !this._window['Hammer'] && !this._hammerLoader) {
            console.warn('Could not find HammerJS. Certain Angular Material components may not work correctly.');
        }
        this._hasCheckedHammer = true;
    };
    MatCommonModule.decorators = [
        { type: NgModule, args: [{
                    imports: [BidiModule],
                    exports: [BidiModule],
                },] }
    ];
    /** @nocollapse */
    MatCommonModule.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_SANITY_CHECKS,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [HAMMER_LOADER,] }] }
    ]; };
    return MatCommonModule;
}());
export { MatCommonModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0YsT0FBTyxFQUFlLGFBQWEsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsT0FBTyxJQUFJLFdBQVcsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUVwRCw0REFBNEQ7QUFDNUQseUVBQXlFO0FBQ3pFLGlFQUFpRTtBQUNqRSx3Q0FBd0M7QUFDeEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUVqRCxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLDhCQUE4QjtJQUM1QyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxzRkFBc0Y7QUFDdEYsTUFBTSxDQUFDLElBQU0sc0JBQXNCLEdBQUcsSUFBSSxjQUFjLENBQWUsbUJBQW1CLEVBQUU7SUFDMUYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLDhCQUE4QjtDQUN4QyxDQUFDLENBQUM7QUFnQkg7Ozs7O0dBS0c7QUFDSDtJQW9CRSx5QkFDOEMsWUFBaUIsRUFDbEIsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFqQnpFLGdHQUFnRztRQUN4Rix5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFFckMsK0RBQStEO1FBQ3ZELHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUVsQyxpREFBaUQ7UUFD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SFksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwsIEluamVjdCwgaXNEZXZNb2RlLCBWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SGFtbWVyTG9hZGVyLCBIQU1NRVJfTE9BREVSfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7QmlkaU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtWRVJTSU9OIGFzIENES19WRVJTSU9OfSBmcm9tICdAYW5ndWxhci9jZGsnO1xuXG4vLyBQcml2YXRlIHZlcnNpb24gY29uc3RhbnQgdG8gY2lyY3VtdmVudCB0ZXN0L2J1aWxkIGlzc3Vlcyxcbi8vIGkuZS4gYXZvaWQgY29yZSB0byBkZXBlbmQgb24gdGhlIEBhbmd1bGFyL21hdGVyaWFsIHByaW1hcnkgZW50cnktcG9pbnRcbi8vIENhbiBiZSByZW1vdmVkIG9uY2UgdGhlIE1hdGVyaWFsIHByaW1hcnkgZW50cnktcG9pbnQgbm8gbG9uZ2VyXG4vLyByZS1leHBvcnRzIGFsbCBzZWNvbmRhcnkgZW50cnktcG9pbnRzXG5jb25zdCBWRVJTSU9OID0gbmV3IFZlcnNpb24oJzAuMC4wLVBMQUNFSE9MREVSJyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFURVJJQUxfU0FOSVRZX0NIRUNLU19GQUNUT1JZKCk6IFNhbml0eUNoZWNrcyB7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY29uZmlndXJlcyB3aGV0aGVyIHRoZSBNYXRlcmlhbCBzYW5pdHkgY2hlY2tzIGFyZSBlbmFibGVkLiAqL1xuZXhwb3J0IGNvbnN0IE1BVEVSSUFMX1NBTklUWV9DSEVDS1MgPSBuZXcgSW5qZWN0aW9uVG9rZW48U2FuaXR5Q2hlY2tzPignbWF0LXNhbml0eS1jaGVja3MnLCB7XG4gIHByb3ZpZGVkSW46ICdyb290JyxcbiAgZmFjdG9yeTogTUFURVJJQUxfU0FOSVRZX0NIRUNLU19GQUNUT1JZLFxufSk7XG5cbi8qKlxuICogUG9zc2libGUgc2FuaXR5IGNoZWNrcyB0aGF0IGNhbiBiZSBlbmFibGVkLiBJZiBzZXQgdG9cbiAqIHRydWUvZmFsc2UsIGFsbCBjaGVja3Mgd2lsbCBiZSBlbmFibGVkL2Rpc2FibGVkLlxuICovXG5leHBvcnQgdHlwZSBTYW5pdHlDaGVja3MgPSBib29sZWFuIHwgR3JhbnVsYXJTYW5pdHlDaGVja3M7XG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIHNhbml0eSBjaGVja3MgZ3JhbnVsYXJseS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JhbnVsYXJTYW5pdHlDaGVja3Mge1xuICBkb2N0eXBlOiBib29sZWFuO1xuICB0aGVtZTogYm9vbGVhbjtcbiAgdmVyc2lvbjogYm9vbGVhbjtcbiAgaGFtbWVyOiBib29sZWFuO1xufVxuXG4vKipcbiAqIE1vZHVsZSB0aGF0IGNhcHR1cmVzIGFueXRoaW5nIHRoYXQgc2hvdWxkIGJlIGxvYWRlZCBhbmQvb3IgcnVuIGZvciAqYWxsKiBBbmd1bGFyIE1hdGVyaWFsXG4gKiBjb21wb25lbnRzLiBUaGlzIGluY2x1ZGVzIEJpZGksIGV0Yy5cbiAqXG4gKiBUaGlzIG1vZHVsZSBzaG91bGQgYmUgaW1wb3J0ZWQgdG8gZWFjaCB0b3AtbGV2ZWwgY29tcG9uZW50IG1vZHVsZSAoZS5nLiwgTWF0VGFic01vZHVsZSkuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtCaWRpTW9kdWxlXSxcbiAgZXhwb3J0czogW0JpZGlNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDb21tb25Nb2R1bGUge1xuICAvKiogV2hldGhlciB3ZSd2ZSBkb25lIHRoZSBnbG9iYWwgc2FuaXR5IGNoZWNrcyAoZS5nLiBhIHRoZW1lIGlzIGxvYWRlZCwgdGhlcmUgaXMgYSBkb2N0eXBlKS4gKi9cbiAgcHJpdmF0ZSBfaGFzRG9uZUdsb2JhbENoZWNrcyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHdlJ3ZlIGFscmVhZHkgY2hlY2tlZCBmb3IgSGFtbWVySnMgYXZhaWxhYmlsaXR5LiAqL1xuICBwcml2YXRlIF9oYXNDaGVja2VkSGFtbWVyID0gZmFsc2U7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIGBkb2N1bWVudGAgb2JqZWN0LiAqL1xuICBwcml2YXRlIF9kb2N1bWVudCA9IHR5cGVvZiBkb2N1bWVudCA9PT0gJ29iamVjdCcgJiYgZG9jdW1lbnQgPyBkb2N1bWVudCA6IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsICd3aW5kb3cnIG9iamVjdC4gKi9cbiAgcHJpdmF0ZSBfd2luZG93ID0gdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgJiYgd2luZG93ID8gd2luZG93IDogbnVsbDtcblxuICAvKiogQ29uZmlndXJlZCBzYW5pdHkgY2hlY2tzLiAqL1xuICBwcml2YXRlIF9zYW5pdHlDaGVja3M6IFNhbml0eUNoZWNrcztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVEVSSUFMX1NBTklUWV9DSEVDS1MpIHNhbml0eUNoZWNrczogYW55LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoSEFNTUVSX0xPQURFUikgcHJpdmF0ZSBfaGFtbWVyTG9hZGVyPzogSGFtbWVyTG9hZGVyKSB7XG5cbiAgICAvLyBOb3RlIHRoYXQgYF9zYW5pdHlDaGVja3NgIGlzIHR5cGVkIHRvIGBhbnlgLCBiZWNhdXNlIEFvVFxuICAgIC8vIHRocm93cyBhbiBlcnJvciBpZiB3ZSB1c2UgdGhlIGBTYW5pdHlDaGVja3NgIHR5cGUgZGlyZWN0bHkuXG4gICAgdGhpcy5fc2FuaXR5Q2hlY2tzID0gc2FuaXR5Q2hlY2tzO1xuXG4gICAgaWYgKCF0aGlzLl9oYXNEb25lR2xvYmFsQ2hlY2tzKSB7XG4gICAgICB0aGlzLl9jaGVja0RvY3R5cGVJc0RlZmluZWQoKTtcbiAgICAgIHRoaXMuX2NoZWNrVGhlbWVJc1ByZXNlbnQoKTtcbiAgICAgIHRoaXMuX2NoZWNrQ2RrVmVyc2lvbk1hdGNoKCk7XG4gICAgICB0aGlzLl9oYXNEb25lR2xvYmFsQ2hlY2tzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciBhbnkgc2FuaXR5IGNoZWNrcyBhcmUgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tzQXJlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNEZXZNb2RlKCkgJiYgIXRoaXMuX2lzVGVzdEVudigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvZGUgaXMgcnVubmluZyBpbiB0ZXN0cy4gKi9cbiAgcHJpdmF0ZSBfaXNUZXN0RW52KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX3dpbmRvdyBhcyBhbnk7XG4gICAgcmV0dXJuIHdpbmRvdyAmJiAod2luZG93Ll9fa2FybWFfXyB8fCB3aW5kb3cuamFzbWluZSk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja0RvY3R5cGVJc0RlZmluZWQoKTogdm9pZCB7XG4gICAgY29uc3QgaXNFbmFibGVkID0gdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpICYmXG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSB0cnVlIHx8ICh0aGlzLl9zYW5pdHlDaGVja3MgYXMgR3JhbnVsYXJTYW5pdHlDaGVja3MpLmRvY3R5cGUpO1xuXG4gICAgaWYgKGlzRW5hYmxlZCAmJiB0aGlzLl9kb2N1bWVudCAmJiAhdGhpcy5fZG9jdW1lbnQuZG9jdHlwZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnQ3VycmVudCBkb2N1bWVudCBkb2VzIG5vdCBoYXZlIGEgZG9jdHlwZS4gVGhpcyBtYXkgY2F1c2UgJyArXG4gICAgICAgICdzb21lIEFuZ3VsYXIgTWF0ZXJpYWwgY29tcG9uZW50cyBub3QgdG8gYmVoYXZlIGFzIGV4cGVjdGVkLidcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tUaGVtZUlzUHJlc2VudCgpOiB2b2lkIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFzc2VydCB0aGF0IHRoZSBgYm9keWAgaXMgZGVmaW5lZCwgYmVjYXVzZSB0aGVzZSBjaGVja3MgcnVuIHZlcnkgZWFybHlcbiAgICAvLyBhbmQgdGhlIGBib2R5YCB3b24ndCBiZSBkZWZpbmVkIGlmIHRoZSBjb25zdW1lciBwdXQgdGhlaXIgc2NyaXB0cyBpbiB0aGUgYGhlYWRgLlxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAhdGhpcy5fY2hlY2tzQXJlRW5hYmxlZCgpIHx8XG4gICAgICAodGhpcy5fc2FuaXR5Q2hlY2tzID09PSBmYWxzZSB8fCAhKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykudGhlbWUpO1xuXG4gICAgaWYgKGlzRGlzYWJsZWQgfHwgIXRoaXMuX2RvY3VtZW50IHx8ICF0aGlzLl9kb2N1bWVudC5ib2R5IHx8XG4gICAgICAgIHR5cGVvZiBnZXRDb21wdXRlZFN0eWxlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGVzdEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC10aGVtZS1sb2FkZWQtbWFya2VyJyk7XG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0ZXN0RWxlbWVudCk7XG5cbiAgICAvLyBJbiBzb21lIHNpdHVhdGlvbnMgdGhlIGNvbXB1dGVkIHN0eWxlIG9mIHRoZSB0ZXN0IGVsZW1lbnQgY2FuIGJlIG51bGwuIEZvciBleGFtcGxlIGluXG4gICAgLy8gRmlyZWZveCwgdGhlIGNvbXB1dGVkIHN0eWxlIGlzIG51bGwgaWYgYW4gYXBwbGljYXRpb24gaXMgcnVubmluZyBpbnNpZGUgb2YgYSBoaWRkZW4gaWZyYW1lLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTQ4Mzk3XG4gICAgaWYgKGNvbXB1dGVkU3R5bGUgJiYgY29tcHV0ZWRTdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIEFuZ3VsYXIgTWF0ZXJpYWwgY29yZSB0aGVtZS4gTW9zdCBNYXRlcmlhbCAnICtcbiAgICAgICAgJ2NvbXBvbmVudHMgbWF5IG5vdCB3b3JrIGFzIGV4cGVjdGVkLiBGb3IgbW9yZSBpbmZvIHJlZmVyICcgK1xuICAgICAgICAndG8gdGhlIHRoZW1pbmcgZ3VpZGU6IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRlc3RFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgbWF0ZXJpYWwgdmVyc2lvbiBtYXRjaGVzIHRoZSBjZGsgdmVyc2lvbiAqL1xuICBwcml2YXRlIF9jaGVja0Nka1ZlcnNpb25NYXRjaCgpOiB2b2lkIHtcbiAgICBjb25zdCBpc0VuYWJsZWQgPSB0aGlzLl9jaGVja3NBcmVFbmFibGVkKCkgJiZcbiAgICAgICh0aGlzLl9zYW5pdHlDaGVja3MgPT09IHRydWUgfHwgKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykudmVyc2lvbik7XG5cbiAgICBpZiAoaXNFbmFibGVkICYmIFZFUlNJT04uZnVsbCAhPT0gQ0RLX1ZFUlNJT04uZnVsbCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdUaGUgQW5ndWxhciBNYXRlcmlhbCB2ZXJzaW9uICgnICsgVkVSU0lPTi5mdWxsICsgJykgZG9lcyBub3QgbWF0Y2ggJyArXG4gICAgICAgICAgJ3RoZSBBbmd1bGFyIENESyB2ZXJzaW9uICgnICsgQ0RLX1ZFUlNJT04uZnVsbCArICcpLlxcbicgK1xuICAgICAgICAgICdQbGVhc2UgZW5zdXJlIHRoZSB2ZXJzaW9ucyBvZiB0aGVzZSB0d28gcGFja2FnZXMgZXhhY3RseSBtYXRjaC4nXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciBIYW1tZXJKUyBpcyBhdmFpbGFibGUuICovXG4gIF9jaGVja0hhbW1lcklzQXZhaWxhYmxlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9oYXNDaGVja2VkSGFtbWVyIHx8ICF0aGlzLl93aW5kb3cpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc0VuYWJsZWQgPSB0aGlzLl9jaGVja3NBcmVFbmFibGVkKCkgJiZcbiAgICAgICh0aGlzLl9zYW5pdHlDaGVja3MgPT09IHRydWUgfHwgKHRoaXMuX3Nhbml0eUNoZWNrcyBhcyBHcmFudWxhclNhbml0eUNoZWNrcykuaGFtbWVyKTtcblxuICAgIGlmIChpc0VuYWJsZWQgJiYgISh0aGlzLl93aW5kb3cgYXMgYW55KVsnSGFtbWVyJ10gJiYgIXRoaXMuX2hhbW1lckxvYWRlcikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnQ291bGQgbm90IGZpbmQgSGFtbWVySlMuIENlcnRhaW4gQW5ndWxhciBNYXRlcmlhbCBjb21wb25lbnRzIG1heSBub3Qgd29yayBjb3JyZWN0bHkuJyk7XG4gICAgfVxuICAgIHRoaXMuX2hhc0NoZWNrZWRIYW1tZXIgPSB0cnVlO1xuICB9XG59XG4iXX0=
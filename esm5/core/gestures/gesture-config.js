/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { MatCommonModule } from '../common-behaviors/common-module';
/**
 * Injection token that can be used to provide options to the Hammerjs instance.
 * More info at http://hammerjs.github.io/api/.
 * @deprecated No longer being used. To be removed.
 * @breaking-change 10.0.0
 */
export var MAT_HAMMER_OPTIONS = new InjectionToken('MAT_HAMMER_OPTIONS');
var ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES = [
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
];
var ɵ0 = function () { }, ɵ1 = function () { };
/**
 * Fake HammerInstance that is used when a Hammer instance is requested when HammerJS has not
 * been loaded on the page.
 */
var noopHammerInstance = {
    on: ɵ0,
    off: ɵ1,
};
/**
 * Adjusts configuration of our gesture library, Hammer.
 * @deprecated No longer being used. To be removed.
 * @breaking-change 10.0.0
 */
var GestureConfig = /** @class */ (function (_super) {
    __extends(GestureConfig, _super);
    function GestureConfig(_hammerOptions, _commonModule) {
        var _this = _super.call(this) || this;
        _this._hammerOptions = _hammerOptions;
        /** List of new event names to add to the gesture support list */
        _this.events = ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES;
        return _this;
    }
    /**
     * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
     *
     * Our gesture names come from the Material Design gestures spec:
     * https://material.io/design/#gestures-touch-mechanics
     *
     * More information on default recognizers can be found in Hammer docs:
     * http://hammerjs.github.io/recognizer-pan/
     * http://hammerjs.github.io/recognizer-press/
     *
     * @param element Element to which to assign the new HammerJS gestures.
     * @returns Newly-created HammerJS instance.
     */
    GestureConfig.prototype.buildHammer = function (element) {
        var hammer = typeof window !== 'undefined' ? window.Hammer : null;
        if (!hammer) {
            // If HammerJS is not loaded here, return the noop HammerInstance. This is necessary to
            // ensure that omitting HammerJS completely will not cause any errors while *also* supporting
            // the lazy-loading of HammerJS via the HAMMER_LOADER token introduced in Angular 6.1.
            // Because we can't depend on HAMMER_LOADER's existance until 7.0, we have to always set
            // `this.events` to the set we support, instead of conditionally setting it to `[]` if
            // `HAMMER_LOADER` is present (and then throwing an Error here if `window.Hammer` is
            // undefined).
            // @breaking-change 8.0.0
            return noopHammerInstance;
        }
        var mc = new hammer(element, this._hammerOptions || undefined);
        // Default Hammer Recognizers.
        var pan = new hammer.Pan();
        var swipe = new hammer.Swipe();
        var press = new hammer.Press();
        // Notice that a HammerJS recognizer can only depend on one other recognizer once.
        // Otherwise the previous `recognizeWith` will be dropped.
        // TODO: Confirm threshold numbers with Material Design UX Team
        var slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
        var longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
        // Overwrite the default `pan` event to use the swipe event.
        pan.recognizeWith(swipe);
        // Since the slide event threshold is set to zero, the slide recognizer can fire and
        // accidentally reset the longpress recognizer. In order to make sure that the two
        // recognizers can run simultaneously but don't affect each other, we allow the slide
        // recognizer to recognize while a longpress is being processed.
        // See: https://github.com/hammerjs/hammer.js/blob/master/src/manager.js#L123-L124
        longpress.recognizeWith(slide);
        // Add customized gestures to Hammer manager
        mc.add([swipe, press, pan, slide, longpress]);
        return mc;
    };
    /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
    GestureConfig.prototype._createRecognizer = function (base, options) {
        var inheritances = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            inheritances[_i - 2] = arguments[_i];
        }
        var recognizer = new base.constructor(options);
        inheritances.push(base);
        inheritances.forEach(function (item) { return recognizer.recognizeWith(item); });
        return recognizer;
    };
    GestureConfig.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    GestureConfig.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_HAMMER_OPTIONS,] }] },
        { type: MatCommonModule, decorators: [{ type: Optional }] }
    ]; };
    return GestureConfig;
}(HammerGestureConfig));
export { GestureConfig };
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9nZXN0dXJlcy9nZXN0dXJlLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMzRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFTbEU7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLGNBQWMsQ0FBZ0Isb0JBQW9CLENBQUMsQ0FBQztBQUUxRixJQUFNLDBDQUEwQyxHQUFHO0lBQ2pELFdBQVc7SUFDWCxPQUFPO0lBQ1AsWUFBWTtJQUNaLFVBQVU7SUFDVixZQUFZO0lBQ1osV0FBVztDQUNaLENBQUM7U0FPSSxjQUFPLENBQUMsT0FDUCxjQUFPLENBQUM7QUFOZjs7O0dBR0c7QUFDSCxJQUFNLGtCQUFrQixHQUFtQjtJQUN6QyxFQUFFLElBQVU7SUFDWixHQUFHLElBQVU7Q0FDZCxDQUFDO0FBRUY7Ozs7R0FJRztBQUNIO0lBQ21DLGlDQUFtQjtJQUlwRCx1QkFDa0QsY0FBOEIsRUFDbEUsYUFBK0I7UUFGN0MsWUFHRSxpQkFBTyxTQUNSO1FBSGlELG9CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUpoRixpRUFBaUU7UUFDakUsWUFBTSxHQUFHLDBDQUEwQyxDQUFDOztJQU1wRCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsbUNBQVcsR0FBWCxVQUFZLE9BQW9CO1FBQzlCLElBQU0sTUFBTSxHQUFpQixPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFFLE1BQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUUzRixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsdUZBQXVGO1lBQ3ZGLDZGQUE2RjtZQUM3RixzRkFBc0Y7WUFDdEYsd0ZBQXdGO1lBQ3hGLHNGQUFzRjtZQUN0RixvRkFBb0Y7WUFDcEYsY0FBYztZQUNkLHlCQUF5QjtZQUN6QixPQUFPLGtCQUFrQixDQUFDO1NBQzNCO1FBRUQsSUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLElBQUksU0FBUyxDQUFDLENBQUM7UUFFakUsOEJBQThCO1FBQzlCLElBQU0sR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzdCLElBQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2pDLElBQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWpDLGtGQUFrRjtRQUNsRiwwREFBMEQ7UUFDMUQsK0RBQStEO1FBQy9ELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUVqRiw0REFBNEQ7UUFDNUQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QixvRkFBb0Y7UUFDcEYsa0ZBQWtGO1FBQ2xGLHFGQUFxRjtRQUNyRixnRUFBZ0U7UUFDaEUsa0ZBQWtGO1FBQ2xGLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0IsNENBQTRDO1FBQzVDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUU5QyxPQUFPLEVBQW9CLENBQUM7SUFDOUIsQ0FBQztJQUVELHNGQUFzRjtJQUM5RSx5Q0FBaUIsR0FBekIsVUFBMEIsSUFBZ0IsRUFBRSxPQUFZO1FBQUUsc0JBQTZCO2FBQTdCLFVBQTZCLEVBQTdCLHFCQUE2QixFQUE3QixJQUE2QjtZQUE3QixxQ0FBNkI7O1FBQ3JGLElBQUksVUFBVSxHQUFHLElBQUssSUFBSSxDQUFDLFdBQWdDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckUsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1FBRTdELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7O2dCQTVFRixVQUFVOzs7O2dEQU1OLFFBQVEsWUFBSSxNQUFNLFNBQUMsa0JBQWtCO2dCQTlDbEMsZUFBZSx1QkErQ2xCLFFBQVE7O0lBdUViLG9CQUFDO0NBQUEsQUE5RUQsQ0FDbUMsbUJBQW1CLEdBNkVyRDtTQTdFWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIEluamVjdCwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIYW1tZXJHZXN0dXJlQ29uZmlnfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2NvbW1vbi1tb2R1bGUnO1xuaW1wb3J0IHtcbiAgSGFtbWVyU3RhdGljLFxuICBIYW1tZXJJbnN0YW5jZSxcbiAgUmVjb2duaXplcixcbiAgUmVjb2duaXplclN0YXRpYyxcbiAgSGFtbWVyT3B0aW9ucyxcbn0gZnJvbSAnLi9nZXN0dXJlLWFubm90YXRpb25zJztcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG9wdGlvbnMgdG8gdGhlIEhhbW1lcmpzIGluc3RhbmNlLlxuICogTW9yZSBpbmZvIGF0IGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vYXBpLy5cbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9IQU1NRVJfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxIYW1tZXJPcHRpb25zPignTUFUX0hBTU1FUl9PUFRJT05TJyk7XG5cbmNvbnN0IEFOR1VMQVJfTUFURVJJQUxfU1VQUE9SVEVEX0hBTU1FUl9HRVNUVVJFUyA9IFtcbiAgJ2xvbmdwcmVzcycsXG4gICdzbGlkZScsXG4gICdzbGlkZXN0YXJ0JyxcbiAgJ3NsaWRlZW5kJyxcbiAgJ3NsaWRlcmlnaHQnLFxuICAnc2xpZGVsZWZ0J1xuXTtcblxuLyoqXG4gKiBGYWtlIEhhbW1lckluc3RhbmNlIHRoYXQgaXMgdXNlZCB3aGVuIGEgSGFtbWVyIGluc3RhbmNlIGlzIHJlcXVlc3RlZCB3aGVuIEhhbW1lckpTIGhhcyBub3RcbiAqIGJlZW4gbG9hZGVkIG9uIHRoZSBwYWdlLlxuICovXG5jb25zdCBub29wSGFtbWVySW5zdGFuY2U6IEhhbW1lckluc3RhbmNlID0ge1xuICBvbjogKCkgPT4ge30sXG4gIG9mZjogKCkgPT4ge30sXG59O1xuXG4vKipcbiAqIEFkanVzdHMgY29uZmlndXJhdGlvbiBvZiBvdXIgZ2VzdHVyZSBsaWJyYXJ5LCBIYW1tZXIuXG4gKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBHZXN0dXJlQ29uZmlnIGV4dGVuZHMgSGFtbWVyR2VzdHVyZUNvbmZpZyB7XG4gIC8qKiBMaXN0IG9mIG5ldyBldmVudCBuYW1lcyB0byBhZGQgdG8gdGhlIGdlc3R1cmUgc3VwcG9ydCBsaXN0ICovXG4gIGV2ZW50cyA9IEFOR1VMQVJfTUFURVJJQUxfU1VQUE9SVEVEX0hBTU1FUl9HRVNUVVJFUztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9IQU1NRVJfT1BUSU9OUykgcHJpdmF0ZSBfaGFtbWVyT3B0aW9ucz86IEhhbW1lck9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgX2NvbW1vbk1vZHVsZT86IE1hdENvbW1vbk1vZHVsZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIEhhbW1lciBpbnN0YW5jZSBtYW51YWxseSB0byBhZGQgY3VzdG9tIHJlY29nbml6ZXJzIHRoYXQgbWF0Y2ggdGhlIE1hdGVyaWFsIERlc2lnbiBzcGVjLlxuICAgKlxuICAgKiBPdXIgZ2VzdHVyZSBuYW1lcyBjb21lIGZyb20gdGhlIE1hdGVyaWFsIERlc2lnbiBnZXN0dXJlcyBzcGVjOlxuICAgKiBodHRwczovL21hdGVyaWFsLmlvL2Rlc2lnbi8jZ2VzdHVyZXMtdG91Y2gtbWVjaGFuaWNzXG4gICAqXG4gICAqIE1vcmUgaW5mb3JtYXRpb24gb24gZGVmYXVsdCByZWNvZ25pemVycyBjYW4gYmUgZm91bmQgaW4gSGFtbWVyIGRvY3M6XG4gICAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vcmVjb2duaXplci1wYW4vXG4gICAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vcmVjb2duaXplci1wcmVzcy9cbiAgICpcbiAgICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCB0byB3aGljaCB0byBhc3NpZ24gdGhlIG5ldyBIYW1tZXJKUyBnZXN0dXJlcy5cbiAgICogQHJldHVybnMgTmV3bHktY3JlYXRlZCBIYW1tZXJKUyBpbnN0YW5jZS5cbiAgICovXG4gIGJ1aWxkSGFtbWVyKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSGFtbWVySW5zdGFuY2Uge1xuICAgIGNvbnN0IGhhbW1lcjogSGFtbWVyU3RhdGljID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyAod2luZG93IGFzIGFueSkuSGFtbWVyIDogbnVsbDtcblxuICAgIGlmICghaGFtbWVyKSB7XG4gICAgICAvLyBJZiBIYW1tZXJKUyBpcyBub3QgbG9hZGVkIGhlcmUsIHJldHVybiB0aGUgbm9vcCBIYW1tZXJJbnN0YW5jZS4gVGhpcyBpcyBuZWNlc3NhcnkgdG9cbiAgICAgIC8vIGVuc3VyZSB0aGF0IG9taXR0aW5nIEhhbW1lckpTIGNvbXBsZXRlbHkgd2lsbCBub3QgY2F1c2UgYW55IGVycm9ycyB3aGlsZSAqYWxzbyogc3VwcG9ydGluZ1xuICAgICAgLy8gdGhlIGxhenktbG9hZGluZyBvZiBIYW1tZXJKUyB2aWEgdGhlIEhBTU1FUl9MT0FERVIgdG9rZW4gaW50cm9kdWNlZCBpbiBBbmd1bGFyIDYuMS5cbiAgICAgIC8vIEJlY2F1c2Ugd2UgY2FuJ3QgZGVwZW5kIG9uIEhBTU1FUl9MT0FERVIncyBleGlzdGFuY2UgdW50aWwgNy4wLCB3ZSBoYXZlIHRvIGFsd2F5cyBzZXRcbiAgICAgIC8vIGB0aGlzLmV2ZW50c2AgdG8gdGhlIHNldCB3ZSBzdXBwb3J0LCBpbnN0ZWFkIG9mIGNvbmRpdGlvbmFsbHkgc2V0dGluZyBpdCB0byBgW11gIGlmXG4gICAgICAvLyBgSEFNTUVSX0xPQURFUmAgaXMgcHJlc2VudCAoYW5kIHRoZW4gdGhyb3dpbmcgYW4gRXJyb3IgaGVyZSBpZiBgd2luZG93LkhhbW1lcmAgaXNcbiAgICAgIC8vIHVuZGVmaW5lZCkuXG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICByZXR1cm4gbm9vcEhhbW1lckluc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1jID0gbmV3IGhhbW1lcihlbGVtZW50LCB0aGlzLl9oYW1tZXJPcHRpb25zIHx8IHVuZGVmaW5lZCk7XG5cbiAgICAvLyBEZWZhdWx0IEhhbW1lciBSZWNvZ25pemVycy5cbiAgICBjb25zdCBwYW4gPSBuZXcgaGFtbWVyLlBhbigpO1xuICAgIGNvbnN0IHN3aXBlID0gbmV3IGhhbW1lci5Td2lwZSgpO1xuICAgIGNvbnN0IHByZXNzID0gbmV3IGhhbW1lci5QcmVzcygpO1xuXG4gICAgLy8gTm90aWNlIHRoYXQgYSBIYW1tZXJKUyByZWNvZ25pemVyIGNhbiBvbmx5IGRlcGVuZCBvbiBvbmUgb3RoZXIgcmVjb2duaXplciBvbmNlLlxuICAgIC8vIE90aGVyd2lzZSB0aGUgcHJldmlvdXMgYHJlY29nbml6ZVdpdGhgIHdpbGwgYmUgZHJvcHBlZC5cbiAgICAvLyBUT0RPOiBDb25maXJtIHRocmVzaG9sZCBudW1iZXJzIHdpdGggTWF0ZXJpYWwgRGVzaWduIFVYIFRlYW1cbiAgICBjb25zdCBzbGlkZSA9IHRoaXMuX2NyZWF0ZVJlY29nbml6ZXIocGFuLCB7ZXZlbnQ6ICdzbGlkZScsIHRocmVzaG9sZDogMH0sIHN3aXBlKTtcbiAgICBjb25zdCBsb25ncHJlc3MgPSB0aGlzLl9jcmVhdGVSZWNvZ25pemVyKHByZXNzLCB7ZXZlbnQ6ICdsb25ncHJlc3MnLCB0aW1lOiA1MDB9KTtcblxuICAgIC8vIE92ZXJ3cml0ZSB0aGUgZGVmYXVsdCBgcGFuYCBldmVudCB0byB1c2UgdGhlIHN3aXBlIGV2ZW50LlxuICAgIHBhbi5yZWNvZ25pemVXaXRoKHN3aXBlKTtcblxuICAgIC8vIFNpbmNlIHRoZSBzbGlkZSBldmVudCB0aHJlc2hvbGQgaXMgc2V0IHRvIHplcm8sIHRoZSBzbGlkZSByZWNvZ25pemVyIGNhbiBmaXJlIGFuZFxuICAgIC8vIGFjY2lkZW50YWxseSByZXNldCB0aGUgbG9uZ3ByZXNzIHJlY29nbml6ZXIuIEluIG9yZGVyIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB0d29cbiAgICAvLyByZWNvZ25pemVycyBjYW4gcnVuIHNpbXVsdGFuZW91c2x5IGJ1dCBkb24ndCBhZmZlY3QgZWFjaCBvdGhlciwgd2UgYWxsb3cgdGhlIHNsaWRlXG4gICAgLy8gcmVjb2duaXplciB0byByZWNvZ25pemUgd2hpbGUgYSBsb25ncHJlc3MgaXMgYmVpbmcgcHJvY2Vzc2VkLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2hhbW1lcmpzL2hhbW1lci5qcy9ibG9iL21hc3Rlci9zcmMvbWFuYWdlci5qcyNMMTIzLUwxMjRcbiAgICBsb25ncHJlc3MucmVjb2duaXplV2l0aChzbGlkZSk7XG5cbiAgICAvLyBBZGQgY3VzdG9taXplZCBnZXN0dXJlcyB0byBIYW1tZXIgbWFuYWdlclxuICAgIG1jLmFkZChbc3dpcGUsIHByZXNzLCBwYW4sIHNsaWRlLCBsb25ncHJlc3NdKTtcblxuICAgIHJldHVybiBtYyBhcyBIYW1tZXJJbnN0YW5jZTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgbmV3IHJlY29nbml6ZXIsIHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBkZWZhdWx0IHJlY29nbml6ZXJzIG9mIEhhbW1lckpTICovXG4gIHByaXZhdGUgX2NyZWF0ZVJlY29nbml6ZXIoYmFzZTogUmVjb2duaXplciwgb3B0aW9uczogYW55LCAuLi5pbmhlcml0YW5jZXM6IFJlY29nbml6ZXJbXSkge1xuICAgIGxldCByZWNvZ25pemVyID0gbmV3IChiYXNlLmNvbnN0cnVjdG9yIGFzIFJlY29nbml6ZXJTdGF0aWMpKG9wdGlvbnMpO1xuXG4gICAgaW5oZXJpdGFuY2VzLnB1c2goYmFzZSk7XG4gICAgaW5oZXJpdGFuY2VzLmZvckVhY2goaXRlbSA9PiByZWNvZ25pemVyLnJlY29nbml6ZVdpdGgoaXRlbSkpO1xuXG4gICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gIH1cblxufVxuIl19
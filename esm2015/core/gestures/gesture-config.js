/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { MatCommonModule } from '../common-behaviors/common-module';
/**
 * Injection token that can be used to provide options to the Hammerjs instance.
 * More info at http://hammerjs.github.io/api/.
 * @deprecated No longer being used. To be removed.
 * \@breaking-change 10.0.0
 * @type {?}
 */
export const MAT_HAMMER_OPTIONS = new InjectionToken('MAT_HAMMER_OPTIONS');
/** @type {?} */
const ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES = [
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
];
const ɵ0 = /**
 * @return {?}
 */
() => { }, ɵ1 = /**
 * @return {?}
 */
() => { };
/**
 * Fake HammerInstance that is used when a Hammer instance is requested when HammerJS has not
 * been loaded on the page.
 * @type {?}
 */
const noopHammerInstance = {
    on: (ɵ0),
    off: (ɵ1),
};
/**
 * Adjusts configuration of our gesture library, Hammer.
 * @deprecated No longer being used. To be removed.
 * \@breaking-change 10.0.0
 */
export class GestureConfig extends HammerGestureConfig {
    /**
     * @param {?=} _hammerOptions
     * @param {?=} _commonModule
     */
    constructor(_hammerOptions, _commonModule) {
        super();
        this._hammerOptions = _hammerOptions;
        /**
         * List of new event names to add to the gesture support list
         */
        this.events = ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES;
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
     * @param {?} element Element to which to assign the new HammerJS gestures.
     * @return {?} Newly-created HammerJS instance.
     */
    buildHammer(element) {
        /** @type {?} */
        const hammer = typeof window !== 'undefined' ? ((/** @type {?} */ (window))).Hammer : null;
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
        /** @type {?} */
        const mc = new hammer(element, this._hammerOptions || undefined);
        // Default Hammer Recognizers.
        /** @type {?} */
        const pan = new hammer.Pan();
        /** @type {?} */
        const swipe = new hammer.Swipe();
        /** @type {?} */
        const press = new hammer.Press();
        // Notice that a HammerJS recognizer can only depend on one other recognizer once.
        // Otherwise the previous `recognizeWith` will be dropped.
        // TODO: Confirm threshold numbers with Material Design UX Team
        /** @type {?} */
        const slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
        /** @type {?} */
        const longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
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
        return (/** @type {?} */ (mc));
    }
    /**
     * Creates a new recognizer, without affecting the default recognizers of HammerJS
     * @private
     * @param {?} base
     * @param {?} options
     * @param {...?} inheritances
     * @return {?}
     */
    _createRecognizer(base, options, ...inheritances) {
        /** @type {?} */
        let recognizer = new ((/** @type {?} */ (base.constructor)))(options);
        inheritances.push(base);
        inheritances.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => recognizer.recognizeWith(item)));
        return recognizer;
    }
}
GestureConfig.decorators = [
    { type: Injectable }
];
/** @nocollapse */
GestureConfig.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_HAMMER_OPTIONS,] }] },
    { type: MatCommonModule, decorators: [{ type: Optional }] }
];
if (false) {
    /**
     * List of new event names to add to the gesture support list
     * @type {?}
     */
    GestureConfig.prototype.events;
    /**
     * @type {?}
     * @private
     */
    GestureConfig.prototype._hammerOptions;
}
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9nZXN0dXJlcy9nZXN0dXJlLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDOzs7Ozs7OztBQWVsRSxNQUFNLE9BQU8sa0JBQWtCLEdBQUcsSUFBSSxjQUFjLENBQWdCLG9CQUFvQixDQUFDOztNQUVuRiwwQ0FBMEMsR0FBRztJQUNqRCxXQUFXO0lBQ1gsT0FBTztJQUNQLFlBQVk7SUFDWixVQUFVO0lBQ1YsWUFBWTtJQUNaLFdBQVc7Q0FDWjs7OztBQU9LLEdBQUcsRUFBRSxHQUFFLENBQUM7OztBQUNQLEdBQUcsRUFBRSxHQUFFLENBQUM7Ozs7OztNQUZULGtCQUFrQixHQUFtQjtJQUN6QyxFQUFFLE1BQVU7SUFDWixHQUFHLE1BQVU7Q0FDZDs7Ozs7O0FBUUQsTUFBTSxPQUFPLGFBQWMsU0FBUSxtQkFBbUI7Ozs7O0lBSXBELFlBQ2tELGNBQThCLEVBQ2xFLGFBQStCO1FBQzNDLEtBQUssRUFBRSxDQUFDO1FBRndDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjs7OztRQUhoRixXQUFNLEdBQUcsMENBQTBDLENBQUM7SUFNcEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7SUFlRCxXQUFXLENBQUMsT0FBb0I7O2NBQ3hCLE1BQU0sR0FBaUIsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFBLE1BQU0sRUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBRTFGLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCx1RkFBdUY7WUFDdkYsNkZBQTZGO1lBQzdGLHNGQUFzRjtZQUN0Rix3RkFBd0Y7WUFDeEYsc0ZBQXNGO1lBQ3RGLG9GQUFvRjtZQUNwRixjQUFjO1lBQ2QseUJBQXlCO1lBQ3pCLE9BQU8sa0JBQWtCLENBQUM7U0FDM0I7O2NBRUssRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxJQUFJLFNBQVMsQ0FBQzs7O2NBRzFELEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7O2NBQ3RCLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7O2NBQzFCLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Ozs7O2NBSzFCLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFDLEVBQUUsS0FBSyxDQUFDOztjQUMxRSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDO1FBRWhGLDREQUE0RDtRQUM1RCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpCLG9GQUFvRjtRQUNwRixrRkFBa0Y7UUFDbEYscUZBQXFGO1FBQ3JGLGdFQUFnRTtRQUNoRSxrRkFBa0Y7UUFDbEYsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvQiw0Q0FBNEM7UUFDNUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRTlDLE9BQU8sbUJBQUEsRUFBRSxFQUFrQixDQUFDO0lBQzlCLENBQUM7Ozs7Ozs7OztJQUdPLGlCQUFpQixDQUFDLElBQWdCLEVBQUUsT0FBWSxFQUFFLEdBQUcsWUFBMEI7O1lBQ2pGLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQUEsSUFBSSxDQUFDLFdBQVcsRUFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUVwRSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLFlBQVksQ0FBQyxPQUFPOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUM7UUFFN0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQzs7O1lBNUVGLFVBQVU7Ozs7NENBTU4sUUFBUSxZQUFJLE1BQU0sU0FBQyxrQkFBa0I7WUE5Q2xDLGVBQWUsdUJBK0NsQixRQUFROzs7Ozs7O0lBSlgsK0JBQW9EOzs7OztJQUdsRCx1Q0FBOEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0LCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0hhbW1lckdlc3R1cmVDb25maWd9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5pbXBvcnQge1xuICBIYW1tZXJTdGF0aWMsXG4gIEhhbW1lckluc3RhbmNlLFxuICBSZWNvZ25pemVyLFxuICBSZWNvZ25pemVyU3RhdGljLFxuICBIYW1tZXJPcHRpb25zLFxufSBmcm9tICcuL2dlc3R1cmUtYW5ub3RhdGlvbnMnO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgb3B0aW9ucyB0byB0aGUgSGFtbWVyanMgaW5zdGFuY2UuXG4gKiBNb3JlIGluZm8gYXQgaHR0cDovL2hhbW1lcmpzLmdpdGh1Yi5pby9hcGkvLlxuICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICovXG5leHBvcnQgY29uc3QgTUFUX0hBTU1FUl9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPEhhbW1lck9wdGlvbnM+KCdNQVRfSEFNTUVSX09QVElPTlMnKTtcblxuY29uc3QgQU5HVUxBUl9NQVRFUklBTF9TVVBQT1JURURfSEFNTUVSX0dFU1RVUkVTID0gW1xuICAnbG9uZ3ByZXNzJyxcbiAgJ3NsaWRlJyxcbiAgJ3NsaWRlc3RhcnQnLFxuICAnc2xpZGVlbmQnLFxuICAnc2xpZGVyaWdodCcsXG4gICdzbGlkZWxlZnQnXG5dO1xuXG4vKipcbiAqIEZha2UgSGFtbWVySW5zdGFuY2UgdGhhdCBpcyB1c2VkIHdoZW4gYSBIYW1tZXIgaW5zdGFuY2UgaXMgcmVxdWVzdGVkIHdoZW4gSGFtbWVySlMgaGFzIG5vdFxuICogYmVlbiBsb2FkZWQgb24gdGhlIHBhZ2UuXG4gKi9cbmNvbnN0IG5vb3BIYW1tZXJJbnN0YW5jZTogSGFtbWVySW5zdGFuY2UgPSB7XG4gIG9uOiAoKSA9PiB7fSxcbiAgb2ZmOiAoKSA9PiB7fSxcbn07XG5cbi8qKlxuICogQWRqdXN0cyBjb25maWd1cmF0aW9uIG9mIG91ciBnZXN0dXJlIGxpYnJhcnksIEhhbW1lci5cbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdlc3R1cmVDb25maWcgZXh0ZW5kcyBIYW1tZXJHZXN0dXJlQ29uZmlnIHtcbiAgLyoqIExpc3Qgb2YgbmV3IGV2ZW50IG5hbWVzIHRvIGFkZCB0byB0aGUgZ2VzdHVyZSBzdXBwb3J0IGxpc3QgKi9cbiAgZXZlbnRzID0gQU5HVUxBUl9NQVRFUklBTF9TVVBQT1JURURfSEFNTUVSX0dFU1RVUkVTO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0hBTU1FUl9PUFRJT05TKSBwcml2YXRlIF9oYW1tZXJPcHRpb25zPzogSGFtbWVyT3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBfY29tbW9uTW9kdWxlPzogTWF0Q29tbW9uTW9kdWxlKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgSGFtbWVyIGluc3RhbmNlIG1hbnVhbGx5IHRvIGFkZCBjdXN0b20gcmVjb2duaXplcnMgdGhhdCBtYXRjaCB0aGUgTWF0ZXJpYWwgRGVzaWduIHNwZWMuXG4gICAqXG4gICAqIE91ciBnZXN0dXJlIG5hbWVzIGNvbWUgZnJvbSB0aGUgTWF0ZXJpYWwgRGVzaWduIGdlc3R1cmVzIHNwZWM6XG4gICAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduLyNnZXN0dXJlcy10b3VjaC1tZWNoYW5pY3NcbiAgICpcbiAgICogTW9yZSBpbmZvcm1hdGlvbiBvbiBkZWZhdWx0IHJlY29nbml6ZXJzIGNhbiBiZSBmb3VuZCBpbiBIYW1tZXIgZG9jczpcbiAgICogaHR0cDovL2hhbW1lcmpzLmdpdGh1Yi5pby9yZWNvZ25pemVyLXBhbi9cbiAgICogaHR0cDovL2hhbW1lcmpzLmdpdGh1Yi5pby9yZWNvZ25pemVyLXByZXNzL1xuICAgKlxuICAgKiBAcGFyYW0gZWxlbWVudCBFbGVtZW50IHRvIHdoaWNoIHRvIGFzc2lnbiB0aGUgbmV3IEhhbW1lckpTIGdlc3R1cmVzLlxuICAgKiBAcmV0dXJucyBOZXdseS1jcmVhdGVkIEhhbW1lckpTIGluc3RhbmNlLlxuICAgKi9cbiAgYnVpbGRIYW1tZXIoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIYW1tZXJJbnN0YW5jZSB7XG4gICAgY29uc3QgaGFtbWVyOiBIYW1tZXJTdGF0aWMgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/ICh3aW5kb3cgYXMgYW55KS5IYW1tZXIgOiBudWxsO1xuXG4gICAgaWYgKCFoYW1tZXIpIHtcbiAgICAgIC8vIElmIEhhbW1lckpTIGlzIG5vdCBsb2FkZWQgaGVyZSwgcmV0dXJuIHRoZSBub29wIEhhbW1lckluc3RhbmNlLiBUaGlzIGlzIG5lY2Vzc2FyeSB0b1xuICAgICAgLy8gZW5zdXJlIHRoYXQgb21pdHRpbmcgSGFtbWVySlMgY29tcGxldGVseSB3aWxsIG5vdCBjYXVzZSBhbnkgZXJyb3JzIHdoaWxlICphbHNvKiBzdXBwb3J0aW5nXG4gICAgICAvLyB0aGUgbGF6eS1sb2FkaW5nIG9mIEhhbW1lckpTIHZpYSB0aGUgSEFNTUVSX0xPQURFUiB0b2tlbiBpbnRyb2R1Y2VkIGluIEFuZ3VsYXIgNi4xLlxuICAgICAgLy8gQmVjYXVzZSB3ZSBjYW4ndCBkZXBlbmQgb24gSEFNTUVSX0xPQURFUidzIGV4aXN0YW5jZSB1bnRpbCA3LjAsIHdlIGhhdmUgdG8gYWx3YXlzIHNldFxuICAgICAgLy8gYHRoaXMuZXZlbnRzYCB0byB0aGUgc2V0IHdlIHN1cHBvcnQsIGluc3RlYWQgb2YgY29uZGl0aW9uYWxseSBzZXR0aW5nIGl0IHRvIGBbXWAgaWZcbiAgICAgIC8vIGBIQU1NRVJfTE9BREVSYCBpcyBwcmVzZW50IChhbmQgdGhlbiB0aHJvd2luZyBhbiBFcnJvciBoZXJlIGlmIGB3aW5kb3cuSGFtbWVyYCBpc1xuICAgICAgLy8gdW5kZWZpbmVkKS5cbiAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICAgIHJldHVybiBub29wSGFtbWVySW5zdGFuY2U7XG4gICAgfVxuXG4gICAgY29uc3QgbWMgPSBuZXcgaGFtbWVyKGVsZW1lbnQsIHRoaXMuX2hhbW1lck9wdGlvbnMgfHwgdW5kZWZpbmVkKTtcblxuICAgIC8vIERlZmF1bHQgSGFtbWVyIFJlY29nbml6ZXJzLlxuICAgIGNvbnN0IHBhbiA9IG5ldyBoYW1tZXIuUGFuKCk7XG4gICAgY29uc3Qgc3dpcGUgPSBuZXcgaGFtbWVyLlN3aXBlKCk7XG4gICAgY29uc3QgcHJlc3MgPSBuZXcgaGFtbWVyLlByZXNzKCk7XG5cbiAgICAvLyBOb3RpY2UgdGhhdCBhIEhhbW1lckpTIHJlY29nbml6ZXIgY2FuIG9ubHkgZGVwZW5kIG9uIG9uZSBvdGhlciByZWNvZ25pemVyIG9uY2UuXG4gICAgLy8gT3RoZXJ3aXNlIHRoZSBwcmV2aW91cyBgcmVjb2duaXplV2l0aGAgd2lsbCBiZSBkcm9wcGVkLlxuICAgIC8vIFRPRE86IENvbmZpcm0gdGhyZXNob2xkIG51bWJlcnMgd2l0aCBNYXRlcmlhbCBEZXNpZ24gVVggVGVhbVxuICAgIGNvbnN0IHNsaWRlID0gdGhpcy5fY3JlYXRlUmVjb2duaXplcihwYW4sIHtldmVudDogJ3NsaWRlJywgdGhyZXNob2xkOiAwfSwgc3dpcGUpO1xuICAgIGNvbnN0IGxvbmdwcmVzcyA9IHRoaXMuX2NyZWF0ZVJlY29nbml6ZXIocHJlc3MsIHtldmVudDogJ2xvbmdwcmVzcycsIHRpbWU6IDUwMH0pO1xuXG4gICAgLy8gT3ZlcndyaXRlIHRoZSBkZWZhdWx0IGBwYW5gIGV2ZW50IHRvIHVzZSB0aGUgc3dpcGUgZXZlbnQuXG4gICAgcGFuLnJlY29nbml6ZVdpdGgoc3dpcGUpO1xuXG4gICAgLy8gU2luY2UgdGhlIHNsaWRlIGV2ZW50IHRocmVzaG9sZCBpcyBzZXQgdG8gemVybywgdGhlIHNsaWRlIHJlY29nbml6ZXIgY2FuIGZpcmUgYW5kXG4gICAgLy8gYWNjaWRlbnRhbGx5IHJlc2V0IHRoZSBsb25ncHJlc3MgcmVjb2duaXplci4gSW4gb3JkZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHR3b1xuICAgIC8vIHJlY29nbml6ZXJzIGNhbiBydW4gc2ltdWx0YW5lb3VzbHkgYnV0IGRvbid0IGFmZmVjdCBlYWNoIG90aGVyLCB3ZSBhbGxvdyB0aGUgc2xpZGVcbiAgICAvLyByZWNvZ25pemVyIHRvIHJlY29nbml6ZSB3aGlsZSBhIGxvbmdwcmVzcyBpcyBiZWluZyBwcm9jZXNzZWQuXG4gICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vaGFtbWVyanMvaGFtbWVyLmpzL2Jsb2IvbWFzdGVyL3NyYy9tYW5hZ2VyLmpzI0wxMjMtTDEyNFxuICAgIGxvbmdwcmVzcy5yZWNvZ25pemVXaXRoKHNsaWRlKTtcblxuICAgIC8vIEFkZCBjdXN0b21pemVkIGdlc3R1cmVzIHRvIEhhbW1lciBtYW5hZ2VyXG4gICAgbWMuYWRkKFtzd2lwZSwgcHJlc3MsIHBhbiwgc2xpZGUsIGxvbmdwcmVzc10pO1xuXG4gICAgcmV0dXJuIG1jIGFzIEhhbW1lckluc3RhbmNlO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBuZXcgcmVjb2duaXplciwgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGRlZmF1bHQgcmVjb2duaXplcnMgb2YgSGFtbWVySlMgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlUmVjb2duaXplcihiYXNlOiBSZWNvZ25pemVyLCBvcHRpb25zOiBhbnksIC4uLmluaGVyaXRhbmNlczogUmVjb2duaXplcltdKSB7XG4gICAgbGV0IHJlY29nbml6ZXIgPSBuZXcgKGJhc2UuY29uc3RydWN0b3IgYXMgUmVjb2duaXplclN0YXRpYykob3B0aW9ucyk7XG5cbiAgICBpbmhlcml0YW5jZXMucHVzaChiYXNlKTtcbiAgICBpbmhlcml0YW5jZXMuZm9yRWFjaChpdGVtID0+IHJlY29nbml6ZXIucmVjb2duaXplV2l0aChpdGVtKSk7XG5cbiAgICByZXR1cm4gcmVjb2duaXplcjtcbiAgfVxuXG59XG4iXX0=
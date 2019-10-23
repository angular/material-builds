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
import { Observable } from 'rxjs';
/**
 * Mixin that adds an initialized property to a directive which, when subscribed to, will emit a
 * value once markInitialized has been called, which should be done during the ngOnInit function.
 * If the subscription is made after it has already been marked as initialized, then it will trigger
 * an emit immediately.
 * \@docs-private
 * @record
 */
export function HasInitialized() { }
if (false) {
    /**
     * Stream that emits once during the directive/component's ngOnInit.
     * @type {?}
     */
    HasInitialized.prototype.initialized;
    /**
     * Sets the state as initialized and must be called during ngOnInit to notify subscribers that
     * the directive has been initialized.
     * \@docs-private
     * @type {?}
     */
    HasInitialized.prototype._markInitialized;
}
/**
 * Mixin to augment a directive with an initialized property that will emits when ngOnInit ends.
 * @template T
 * @param {?} base
 * @return {?}
 */
export function mixinInitialized(base) {
    return class extends base {
        /**
         * @param {...?} args
         */
        constructor(...args) {
            super(...args);
            /**
             * Whether this directive has been marked as initialized.
             */
            this._isInitialized = false;
            /**
             * List of subscribers that subscribed before the directive was initialized. Should be notified
             * during _markInitialized. Set to null after pending subscribers are notified, and should
             * not expect to be populated after.
             */
            this._pendingSubscribers = [];
            /**
             * Observable stream that emits when the directive initializes. If already initialized, the
             * subscriber is stored to be notified once _markInitialized is called.
             */
            this.initialized = new Observable((/**
             * @param {?} subscriber
             * @return {?}
             */
            subscriber => {
                // If initialized, immediately notify the subscriber. Otherwise store the subscriber to notify
                // when _markInitialized is called.
                if (this._isInitialized) {
                    this._notifySubscriber(subscriber);
                }
                else {
                    (/** @type {?} */ (this._pendingSubscribers)).push(subscriber);
                }
            }));
        }
        /**
         * Marks the state as initialized and notifies pending subscribers. Should be called at the end
         * of ngOnInit.
         * \@docs-private
         * @return {?}
         */
        _markInitialized() {
            if (this._isInitialized) {
                throw Error('This directive has already been marked as initialized and ' +
                    'should not be called twice.');
            }
            this._isInitialized = true;
            (/** @type {?} */ (this._pendingSubscribers)).forEach(this._notifySubscriber);
            this._pendingSubscribers = null;
        }
        /**
         * Emits and completes the subscriber stream (should only emit once).
         * @param {?} subscriber
         * @return {?}
         */
        _notifySubscriber(subscriber) {
            subscriber.next();
            subscriber.complete();
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2luaXRpYWxpemVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFVBQVUsRUFBYSxNQUFNLE1BQU0sQ0FBQzs7Ozs7Ozs7O0FBVzVDLG9DQVVDOzs7Ozs7SUFSQyxxQ0FBOEI7Ozs7Ozs7SUFPOUIsMENBQTZCOzs7Ozs7OztBQU8vQixNQUFNLFVBQVUsZ0JBQWdCLENBQTRCLElBQU87SUFFakUsT0FBTyxLQUFNLFNBQVEsSUFBSTs7OztRQXlCdkIsWUFBWSxHQUFHLElBQVc7WUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzs7OztZQXZCN0MsbUJBQWMsR0FBRyxLQUFLLENBQUM7Ozs7OztZQU92Qix3QkFBbUIsR0FBOEIsRUFBRSxDQUFDOzs7OztZQU1wRCxnQkFBVyxHQUFHLElBQUksVUFBVTs7OztZQUFPLFVBQVUsQ0FBQyxFQUFFO2dCQUM5Qyw4RkFBOEY7Z0JBQzlGLG1DQUFtQztnQkFDbkMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ3BDO3FCQUFNO29CQUNMLG1CQUFBLElBQUksQ0FBQyxtQkFBbUIsRUFBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDNUM7WUFDSCxDQUFDLEVBQUMsQ0FBQztRQUUyQyxDQUFDOzs7Ozs7O1FBTy9DLGdCQUFnQjtZQUNkLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDdkIsTUFBTSxLQUFLLENBQUMsNERBQTREO29CQUNwRSw2QkFBNkIsQ0FBQyxDQUFDO2FBQ3BDO1lBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFFM0IsbUJBQUEsSUFBSSxDQUFDLG1CQUFtQixFQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDbEMsQ0FBQzs7Ozs7O1FBR0QsaUJBQWlCLENBQUMsVUFBNEI7WUFDNUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJzY3JpYmVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Q29uc3RydWN0b3J9IGZyb20gJy4vY29uc3RydWN0b3InO1xuXG5cbi8qKlxuICogTWl4aW4gdGhhdCBhZGRzIGFuIGluaXRpYWxpemVkIHByb3BlcnR5IHRvIGEgZGlyZWN0aXZlIHdoaWNoLCB3aGVuIHN1YnNjcmliZWQgdG8sIHdpbGwgZW1pdCBhXG4gKiB2YWx1ZSBvbmNlIG1hcmtJbml0aWFsaXplZCBoYXMgYmVlbiBjYWxsZWQsIHdoaWNoIHNob3VsZCBiZSBkb25lIGR1cmluZyB0aGUgbmdPbkluaXQgZnVuY3Rpb24uXG4gKiBJZiB0aGUgc3Vic2NyaXB0aW9uIGlzIG1hZGUgYWZ0ZXIgaXQgaGFzIGFscmVhZHkgYmVlbiBtYXJrZWQgYXMgaW5pdGlhbGl6ZWQsIHRoZW4gaXQgd2lsbCB0cmlnZ2VyXG4gKiBhbiBlbWl0IGltbWVkaWF0ZWx5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEhhc0luaXRpYWxpemVkIHtcbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIG9uY2UgZHVyaW5nIHRoZSBkaXJlY3RpdmUvY29tcG9uZW50J3MgbmdPbkluaXQuICovXG4gIGluaXRpYWxpemVkOiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdGF0ZSBhcyBpbml0aWFsaXplZCBhbmQgbXVzdCBiZSBjYWxsZWQgZHVyaW5nIG5nT25Jbml0IHRvIG5vdGlmeSBzdWJzY3JpYmVycyB0aGF0XG4gICAqIHRoZSBkaXJlY3RpdmUgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIF9tYXJrSW5pdGlhbGl6ZWQ6ICgpID0+IHZvaWQ7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgdHlwZSBIYXNJbml0aWFsaXplZEN0b3IgPSBDb25zdHJ1Y3RvcjxIYXNJbml0aWFsaXplZD47XG5cbi8qKiBNaXhpbiB0byBhdWdtZW50IGEgZGlyZWN0aXZlIHdpdGggYW4gaW5pdGlhbGl6ZWQgcHJvcGVydHkgdGhhdCB3aWxsIGVtaXRzIHdoZW4gbmdPbkluaXQgZW5kcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbkluaXRpYWxpemVkPFQgZXh0ZW5kcyBDb25zdHJ1Y3Rvcjx7fT4+KGJhc2U6IFQpOlxuICAgIEhhc0luaXRpYWxpemVkQ3RvciAmIFQge1xuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBiYXNlIHtcbiAgICAvKiogV2hldGhlciB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiBtYXJrZWQgYXMgaW5pdGlhbGl6ZWQuICovXG4gICAgX2lzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2Ygc3Vic2NyaWJlcnMgdGhhdCBzdWJzY3JpYmVkIGJlZm9yZSB0aGUgZGlyZWN0aXZlIHdhcyBpbml0aWFsaXplZC4gU2hvdWxkIGJlIG5vdGlmaWVkXG4gICAgICogZHVyaW5nIF9tYXJrSW5pdGlhbGl6ZWQuIFNldCB0byBudWxsIGFmdGVyIHBlbmRpbmcgc3Vic2NyaWJlcnMgYXJlIG5vdGlmaWVkLCBhbmQgc2hvdWxkXG4gICAgICogbm90IGV4cGVjdCB0byBiZSBwb3B1bGF0ZWQgYWZ0ZXIuXG4gICAgICovXG4gICAgX3BlbmRpbmdTdWJzY3JpYmVyczogU3Vic2NyaWJlcjx2b2lkPltdIHwgbnVsbCA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogT2JzZXJ2YWJsZSBzdHJlYW0gdGhhdCBlbWl0cyB3aGVuIHRoZSBkaXJlY3RpdmUgaW5pdGlhbGl6ZXMuIElmIGFscmVhZHkgaW5pdGlhbGl6ZWQsIHRoZVxuICAgICAqIHN1YnNjcmliZXIgaXMgc3RvcmVkIHRvIGJlIG5vdGlmaWVkIG9uY2UgX21hcmtJbml0aWFsaXplZCBpcyBjYWxsZWQuXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZWQgPSBuZXcgT2JzZXJ2YWJsZTx2b2lkPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIC8vIElmIGluaXRpYWxpemVkLCBpbW1lZGlhdGVseSBub3RpZnkgdGhlIHN1YnNjcmliZXIuIE90aGVyd2lzZSBzdG9yZSB0aGUgc3Vic2NyaWJlciB0byBub3RpZnlcbiAgICAgIC8vIHdoZW4gX21hcmtJbml0aWFsaXplZCBpcyBjYWxsZWQuXG4gICAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZCkge1xuICAgICAgICB0aGlzLl9ub3RpZnlTdWJzY3JpYmVyKHN1YnNjcmliZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1N1YnNjcmliZXJzIS5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgc3VwZXIoLi4uYXJncyk7IH1cblxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoZSBzdGF0ZSBhcyBpbml0aWFsaXplZCBhbmQgbm90aWZpZXMgcGVuZGluZyBzdWJzY3JpYmVycy4gU2hvdWxkIGJlIGNhbGxlZCBhdCB0aGUgZW5kXG4gICAgICogb2YgbmdPbkluaXQuXG4gICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tYXJrSW5pdGlhbGl6ZWQoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZCkge1xuICAgICAgICB0aHJvdyBFcnJvcignVGhpcyBkaXJlY3RpdmUgaGFzIGFscmVhZHkgYmVlbiBtYXJrZWQgYXMgaW5pdGlhbGl6ZWQgYW5kICcgK1xuICAgICAgICAgICAgJ3Nob3VsZCBub3QgYmUgY2FsbGVkIHR3aWNlLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgdGhpcy5fcGVuZGluZ1N1YnNjcmliZXJzIS5mb3JFYWNoKHRoaXMuX25vdGlmeVN1YnNjcmliZXIpO1xuICAgICAgdGhpcy5fcGVuZGluZ1N1YnNjcmliZXJzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiogRW1pdHMgYW5kIGNvbXBsZXRlcyB0aGUgc3Vic2NyaWJlciBzdHJlYW0gKHNob3VsZCBvbmx5IGVtaXQgb25jZSkuICovXG4gICAgX25vdGlmeVN1YnNjcmliZXIoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjx2b2lkPik6IHZvaWQge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KCk7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9O1xufVxuIl19
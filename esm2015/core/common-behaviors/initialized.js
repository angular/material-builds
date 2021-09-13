/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
/** Mixin to augment a directive with an initialized property that will emits when ngOnInit ends. */
export function mixinInitialized(base) {
    return class extends base {
        constructor(...args) {
            super(...args);
            /** Whether this directive has been marked as initialized. */
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
            this.initialized = new Observable(subscriber => {
                // If initialized, immediately notify the subscriber. Otherwise store the subscriber to notify
                // when _markInitialized is called.
                if (this._isInitialized) {
                    this._notifySubscriber(subscriber);
                }
                else {
                    this._pendingSubscribers.push(subscriber);
                }
            });
        }
        /**
         * Marks the state as initialized and notifies pending subscribers. Should be called at the end
         * of ngOnInit.
         * @docs-private
         */
        _markInitialized() {
            if (this._isInitialized && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('This directive has already been marked as initialized and ' +
                    'should not be called twice.');
            }
            this._isInitialized = true;
            this._pendingSubscribers.forEach(this._notifySubscriber);
            this._pendingSubscribers = null;
        }
        /** Emits and completes the subscriber stream (should only emit once). */
        _notifySubscriber(subscriber) {
            subscriber.next();
            subscriber.complete();
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2luaXRpYWxpemVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQWEsTUFBTSxNQUFNLENBQUM7QUF5QjVDLG9HQUFvRztBQUNwRyxNQUFNLFVBQVUsZ0JBQWdCLENBQTRCLElBQU87SUFFakUsT0FBTyxLQUFNLFNBQVEsSUFBSTtRQXlCdkIsWUFBWSxHQUFHLElBQVc7WUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQXhCN0MsNkRBQTZEO1lBQzdELG1CQUFjLEdBQUcsS0FBSyxDQUFDO1lBRXZCOzs7O2VBSUc7WUFDSCx3QkFBbUIsR0FBOEIsRUFBRSxDQUFDO1lBRXBEOzs7ZUFHRztZQUNILGdCQUFXLEdBQUcsSUFBSSxVQUFVLENBQU8sVUFBVSxDQUFDLEVBQUU7Z0JBQzlDLDhGQUE4RjtnQkFDOUYsbUNBQW1DO2dCQUNuQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDcEM7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLG1CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDNUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUUyQyxDQUFDO1FBRS9DOzs7O1dBSUc7UUFDSCxnQkFBZ0I7WUFDZCxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7Z0JBQzFFLE1BQU0sS0FBSyxDQUFDLDREQUE0RDtvQkFDcEUsNkJBQTZCLENBQUMsQ0FBQzthQUNwQztZQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBRTNCLElBQUksQ0FBQyxtQkFBb0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUNsQyxDQUFDO1FBRUQseUVBQXlFO1FBQ3pFLGlCQUFpQixDQUFDLFVBQTRCO1lBQzVDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3Vic2NyaWJlcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0NvbnN0cnVjdG9yfSBmcm9tICcuL2NvbnN0cnVjdG9yJztcblxuXG4vKipcbiAqIE1peGluIHRoYXQgYWRkcyBhbiBpbml0aWFsaXplZCBwcm9wZXJ0eSB0byBhIGRpcmVjdGl2ZSB3aGljaCwgd2hlbiBzdWJzY3JpYmVkIHRvLCB3aWxsIGVtaXQgYVxuICogdmFsdWUgb25jZSBtYXJrSW5pdGlhbGl6ZWQgaGFzIGJlZW4gY2FsbGVkLCB3aGljaCBzaG91bGQgYmUgZG9uZSBkdXJpbmcgdGhlIG5nT25Jbml0IGZ1bmN0aW9uLlxuICogSWYgdGhlIHN1YnNjcmlwdGlvbiBpcyBtYWRlIGFmdGVyIGl0IGhhcyBhbHJlYWR5IGJlZW4gbWFya2VkIGFzIGluaXRpYWxpemVkLCB0aGVuIGl0IHdpbGwgdHJpZ2dlclxuICogYW4gZW1pdCBpbW1lZGlhdGVseS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIYXNJbml0aWFsaXplZCB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyBvbmNlIGR1cmluZyB0aGUgZGlyZWN0aXZlL2NvbXBvbmVudCdzIG5nT25Jbml0LiAqL1xuICBpbml0aWFsaXplZDogT2JzZXJ2YWJsZTx2b2lkPjtcblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhdGUgYXMgaW5pdGlhbGl6ZWQgYW5kIG11c3QgYmUgY2FsbGVkIGR1cmluZyBuZ09uSW5pdCB0byBub3RpZnkgc3Vic2NyaWJlcnMgdGhhdFxuICAgKiB0aGUgZGlyZWN0aXZlIGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBfbWFya0luaXRpYWxpemVkOiAoKSA9PiB2b2lkO1xufVxuXG50eXBlIEhhc0luaXRpYWxpemVkQ3RvciA9IENvbnN0cnVjdG9yPEhhc0luaXRpYWxpemVkPjtcblxuLyoqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCBhbiBpbml0aWFsaXplZCBwcm9wZXJ0eSB0aGF0IHdpbGwgZW1pdHMgd2hlbiBuZ09uSW5pdCBlbmRzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIENvbnN0cnVjdG9yPHt9Pj4oYmFzZTogVCk6XG4gICAgSGFzSW5pdGlhbGl6ZWRDdG9yICYgVCB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGJhc2Uge1xuICAgIC8qKiBXaGV0aGVyIHRoaXMgZGlyZWN0aXZlIGhhcyBiZWVuIG1hcmtlZCBhcyBpbml0aWFsaXplZC4gKi9cbiAgICBfaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBzdWJzY3JpYmVycyB0aGF0IHN1YnNjcmliZWQgYmVmb3JlIHRoZSBkaXJlY3RpdmUgd2FzIGluaXRpYWxpemVkLiBTaG91bGQgYmUgbm90aWZpZWRcbiAgICAgKiBkdXJpbmcgX21hcmtJbml0aWFsaXplZC4gU2V0IHRvIG51bGwgYWZ0ZXIgcGVuZGluZyBzdWJzY3JpYmVycyBhcmUgbm90aWZpZWQsIGFuZCBzaG91bGRcbiAgICAgKiBub3QgZXhwZWN0IHRvIGJlIHBvcHVsYXRlZCBhZnRlci5cbiAgICAgKi9cbiAgICBfcGVuZGluZ1N1YnNjcmliZXJzOiBTdWJzY3JpYmVyPHZvaWQ+W10gfCBudWxsID0gW107XG5cbiAgICAvKipcbiAgICAgKiBPYnNlcnZhYmxlIHN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gdGhlIGRpcmVjdGl2ZSBpbml0aWFsaXplcy4gSWYgYWxyZWFkeSBpbml0aWFsaXplZCwgdGhlXG4gICAgICogc3Vic2NyaWJlciBpcyBzdG9yZWQgdG8gYmUgbm90aWZpZWQgb25jZSBfbWFya0luaXRpYWxpemVkIGlzIGNhbGxlZC5cbiAgICAgKi9cbiAgICBpbml0aWFsaXplZCA9IG5ldyBPYnNlcnZhYmxlPHZvaWQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgLy8gSWYgaW5pdGlhbGl6ZWQsIGltbWVkaWF0ZWx5IG5vdGlmeSB0aGUgc3Vic2NyaWJlci4gT3RoZXJ3aXNlIHN0b3JlIHRoZSBzdWJzY3JpYmVyIHRvIG5vdGlmeVxuICAgICAgLy8gd2hlbiBfbWFya0luaXRpYWxpemVkIGlzIGNhbGxlZC5cbiAgICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICAgIHRoaXMuX25vdGlmeVN1YnNjcmliZXIoc3Vic2NyaWJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wZW5kaW5nU3Vic2NyaWJlcnMhLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyBzdXBlciguLi5hcmdzKTsgfVxuXG4gICAgLyoqXG4gICAgICogTWFya3MgdGhlIHN0YXRlIGFzIGluaXRpYWxpemVkIGFuZCBub3RpZmllcyBwZW5kaW5nIHN1YnNjcmliZXJzLiBTaG91bGQgYmUgY2FsbGVkIGF0IHRoZSBlbmRcbiAgICAgKiBvZiBuZ09uSW5pdC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgX21hcmtJbml0aWFsaXplZCgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdUaGlzIGRpcmVjdGl2ZSBoYXMgYWxyZWFkeSBiZWVuIG1hcmtlZCBhcyBpbml0aWFsaXplZCBhbmQgJyArXG4gICAgICAgICAgICAnc2hvdWxkIG5vdCBiZSBjYWxsZWQgdHdpY2UuJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLl9wZW5kaW5nU3Vic2NyaWJlcnMhLmZvckVhY2godGhpcy5fbm90aWZ5U3Vic2NyaWJlcik7XG4gICAgICB0aGlzLl9wZW5kaW5nU3Vic2NyaWJlcnMgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBFbWl0cyBhbmQgY29tcGxldGVzIHRoZSBzdWJzY3JpYmVyIHN0cmVhbSAoc2hvdWxkIG9ubHkgZW1pdCBvbmNlKS4gKi9cbiAgICBfbm90aWZ5U3Vic2NyaWJlcihzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPHZvaWQ+KTogdm9pZCB7XG4gICAgICBzdWJzY3JpYmVyLm5leHQoKTtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9XG4gIH07XG59XG4iXX0=
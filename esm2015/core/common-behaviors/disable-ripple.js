/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export function mixinDisableRipple(base) {
    return class extends base {
        constructor(...args) {
            super(...args);
            this._disableRipple = false;
        }
        /** Whether the ripple effect is disabled or not. */
        get disableRipple() { return this._disableRipple; }
        set disableRipple(value) { this._disableRipple = coerceBooleanProperty(value); }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYWJsZS1yaXBwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2Rpc2FibGUtcmlwcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBb0I1RCxNQUFNLFVBQVUsa0JBQWtCLENBQTRCLElBQU87SUFDbkUsT0FBTyxLQUFNLFNBQVEsSUFBSTtRQU92QixZQUFZLEdBQUcsSUFBVztZQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBTnJDLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBTU0sQ0FBQztRQUovQyxvREFBb0Q7UUFDcEQsSUFBSSxhQUFhLEtBQUssT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLGFBQWEsQ0FBQyxLQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FHdEYsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0Fic3RyYWN0Q29uc3RydWN0b3IsIENvbnN0cnVjdG9yfSBmcm9tICcuL2NvbnN0cnVjdG9yJztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FuRGlzYWJsZVJpcHBsZSB7XG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgYXJlIGRpc2FibGVkLiAqL1xuICBkaXNhYmxlUmlwcGxlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBuZWNlc3NhcnkgdG8gYXBwbHkgdG8gbWl4aW4gY2xhc3Nlcy4gVG8gYmUgbWFkZSBwcml2YXRlLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgPSBDb25zdHJ1Y3RvcjxDYW5EaXNhYmxlUmlwcGxlPiAmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFic3RyYWN0Q29uc3RydWN0b3I8Q2FuRGlzYWJsZVJpcHBsZT47XG5cbi8qKiBNaXhpbiB0byBhdWdtZW50IGEgZGlyZWN0aXZlIHdpdGggYSBgZGlzYWJsZVJpcHBsZWAgcHJvcGVydHkuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5EaXNhYmxlUmlwcGxlPFQgZXh0ZW5kcyBBYnN0cmFjdENvbnN0cnVjdG9yPHt9Pj4oYmFzZTogVCk6XG4gIENhbkRpc2FibGVSaXBwbGVDdG9yICYgVDtcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbkRpc2FibGVSaXBwbGU8VCBleHRlbmRzIENvbnN0cnVjdG9yPHt9Pj4oYmFzZTogVCk6IENhbkRpc2FibGVSaXBwbGVDdG9yICYgVCB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGJhc2Uge1xuICAgIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBXaGV0aGVyIHRoZSByaXBwbGUgZWZmZWN0IGlzIGRpc2FibGVkIG9yIG5vdC4gKi9cbiAgICBnZXQgZGlzYWJsZVJpcHBsZSgpIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7IH1cbiAgICBzZXQgZGlzYWJsZVJpcHBsZSh2YWx1ZTogYW55KSB7IHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkgeyBzdXBlciguLi5hcmdzKTsgfVxuICB9O1xufVxuIl19
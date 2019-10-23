/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __read, __spread } from "tslib";
/** Mixin to augment a directive with a `tabIndex` property. */
export function mixinTabIndex(base, defaultTabIndex) {
    if (defaultTabIndex === void 0) { defaultTabIndex = 0; }
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spread(args)) || this;
            _this._tabIndex = defaultTabIndex;
            return _this;
        }
        Object.defineProperty(class_1.prototype, "tabIndex", {
            get: function () { return this.disabled ? -1 : this._tabIndex; },
            set: function (value) {
                // If the specified tabIndex value is null or undefined, fall back to the default value.
                this._tabIndex = value != null ? value : defaultTabIndex;
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(base));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL3RhYmluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFlSCwrREFBK0Q7QUFDL0QsTUFBTSxVQUFVLGFBQWEsQ0FBb0MsSUFBTyxFQUFFLGVBQW1CO0lBQW5CLGdDQUFBLEVBQUEsbUJBQW1CO0lBRTNGO1FBQXFCLDJCQUFJO1FBU3ZCO1lBQVksY0FBYztpQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO2dCQUFkLHlCQUFjOztZQUExQix3Q0FDVyxJQUFJLFdBQ2Q7WUFWTyxlQUFTLEdBQVcsZUFBZSxDQUFDOztRQVU1QyxDQUFDO1FBUkQsc0JBQUksNkJBQVE7aUJBQVosY0FBeUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RFLFVBQWEsS0FBYTtnQkFDeEIsd0ZBQXdGO2dCQUN4RixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQzNELENBQUM7OztXQUpxRTtRQVN4RSxjQUFDO0lBQUQsQ0FBQyxBQVpNLENBQWMsSUFBSSxHQVl2QjtBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25zdHJ1Y3Rvcn0gZnJvbSAnLi9jb25zdHJ1Y3Rvcic7XG5pbXBvcnQge0NhbkRpc2FibGV9IGZyb20gJy4vZGlzYWJsZWQnO1xuXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgaW50ZXJmYWNlIEhhc1RhYkluZGV4IHtcbiAgLyoqIFRhYmluZGV4IG9mIHRoZSBjb21wb25lbnQuICovXG4gIHRhYkluZGV4OiBudW1iZXI7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgdHlwZSBIYXNUYWJJbmRleEN0b3IgPSBDb25zdHJ1Y3RvcjxIYXNUYWJJbmRleD47XG5cbi8qKiBNaXhpbiB0byBhdWdtZW50IGEgZGlyZWN0aXZlIHdpdGggYSBgdGFiSW5kZXhgIHByb3BlcnR5LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluVGFiSW5kZXg8VCBleHRlbmRzIENvbnN0cnVjdG9yPENhbkRpc2FibGU+PihiYXNlOiBULCBkZWZhdWx0VGFiSW5kZXggPSAwKVxuICAgIDogSGFzVGFiSW5kZXhDdG9yICYgVCB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGJhc2Uge1xuICAgIHByaXZhdGUgX3RhYkluZGV4OiBudW1iZXIgPSBkZWZhdWx0VGFiSW5kZXg7XG5cbiAgICBnZXQgdGFiSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAtMSA6IHRoaXMuX3RhYkluZGV4OyB9XG4gICAgc2V0IHRhYkluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICAgIC8vIElmIHRoZSBzcGVjaWZpZWQgdGFiSW5kZXggdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQsIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAgICAgIHRoaXMuX3RhYkluZGV4ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogZGVmYXVsdFRhYkluZGV4O1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcbiAgICB9XG4gIH07XG59XG4iXX0=
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __read, __spread } from "tslib";
/** Mixin to augment a directive with a `color` property. */
export function mixinColor(base, defaultColor) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spread(args)) || this;
            // Set the default color that can be specified from the mixin.
            _this.color = defaultColor;
            return _this;
        }
        Object.defineProperty(class_1.prototype, "color", {
            get: function () { return this._color; },
            set: function (value) {
                var colorPalette = value || defaultColor;
                if (colorPalette !== this._color) {
                    if (this._color) {
                        this._elementRef.nativeElement.classList.remove("mat-" + this._color);
                    }
                    if (colorPalette) {
                        this._elementRef.nativeElement.classList.add("mat-" + colorPalette);
                    }
                    this._color = colorPalette;
                }
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(base));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFzQkgsNERBQTREO0FBQzVELE1BQU0sVUFBVSxVQUFVLENBQ3RCLElBQU8sRUFBRSxZQUEyQjtJQUN0QztRQUFxQiwyQkFBSTtRQW1CdkI7WUFBWSxjQUFjO2lCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7Z0JBQWQseUJBQWM7O1lBQTFCLHdDQUNXLElBQUksV0FJZDtZQUZDLDhEQUE4RDtZQUM5RCxLQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQzs7UUFDNUIsQ0FBQztRQXJCRCxzQkFBSSwwQkFBSztpQkFBVCxjQUE0QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUNqRCxVQUFVLEtBQW1CO2dCQUMzQixJQUFNLFlBQVksR0FBRyxLQUFLLElBQUksWUFBWSxDQUFDO2dCQUUzQyxJQUFJLFlBQVksS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFPLElBQUksQ0FBQyxNQUFRLENBQUMsQ0FBQztxQkFDdkU7b0JBQ0QsSUFBSSxZQUFZLEVBQUU7d0JBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBTyxZQUFjLENBQUMsQ0FBQztxQkFDckU7b0JBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7aUJBQzVCO1lBQ0gsQ0FBQzs7O1dBZGdEO1FBc0JuRCxjQUFDO0lBQUQsQ0FBQyxBQXpCTSxDQUFjLElBQUksR0F5QnZCO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnN0cnVjdG9yfSBmcm9tICcuL2NvbnN0cnVjdG9yJztcbmltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgaW50ZXJmYWNlIENhbkNvbG9yIHtcbiAgLyoqIFRoZW1lIGNvbG9yIHBhbGV0dGUgZm9yIHRoZSBjb21wb25lbnQuICovXG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgdHlwZSBDYW5Db2xvckN0b3IgPSBDb25zdHJ1Y3RvcjxDYW5Db2xvcj47XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgaW50ZXJmYWNlIEhhc0VsZW1lbnRSZWYge1xuICBfZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbn1cblxuLyoqIFBvc3NpYmxlIGNvbG9yIHBhbGV0dGUgdmFsdWVzLiAqL1xuZXhwb3J0IHR5cGUgVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknIHwgJ2FjY2VudCcgfCAnd2FybicgfCB1bmRlZmluZWQ7XG5cbi8qKiBNaXhpbiB0byBhdWdtZW50IGEgZGlyZWN0aXZlIHdpdGggYSBgY29sb3JgIHByb3BlcnR5LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluQ29sb3I8VCBleHRlbmRzIENvbnN0cnVjdG9yPEhhc0VsZW1lbnRSZWY+PihcbiAgICBiYXNlOiBULCBkZWZhdWx0Q29sb3I/OiBUaGVtZVBhbGV0dGUpOiBDYW5Db2xvckN0b3IgJiBUIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYmFzZSB7XG4gICAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAgIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fY29sb3I7IH1cbiAgICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgICAgY29uc3QgY29sb3JQYWxldHRlID0gdmFsdWUgfHwgZGVmYXVsdENvbG9yO1xuXG4gICAgICBpZiAoY29sb3JQYWxldHRlICE9PSB0aGlzLl9jb2xvcikge1xuICAgICAgICBpZiAodGhpcy5fY29sb3IpIHtcbiAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgbWF0LSR7dGhpcy5fY29sb3J9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbG9yUGFsZXR0ZSkge1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtJHtjb2xvclBhbGV0dGV9YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb2xvciA9IGNvbG9yUGFsZXR0ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCBjb2xvciB0aGF0IGNhbiBiZSBzcGVjaWZpZWQgZnJvbSB0aGUgbWl4aW4uXG4gICAgICB0aGlzLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIH1cbiAgfTtcbn1cblxuIl19
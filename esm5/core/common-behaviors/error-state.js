/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __read, __spread } from "tslib";
import { Subject } from 'rxjs';
/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export function mixinErrorState(base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spread(args)) || this;
            /** Whether the component is in an error state. */
            _this.errorState = false;
            /**
             * Stream that emits whenever the state of the input changes such that the wrapping
             * `MatFormField` needs to run change detection.
             */
            _this.stateChanges = new Subject();
            return _this;
        }
        class_1.prototype.updateErrorState = function () {
            var oldState = this.errorState;
            var parent = this._parentFormGroup || this._parentForm;
            var matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
            var control = this.ngControl ? this.ngControl.control : null;
            var newState = matcher.isErrorState(control, parent);
            if (newState !== oldState) {
                this.errorState = newState;
                this.stateChanges.next();
            }
        };
        return class_1;
    }(base));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3Itc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2Vycm9yLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFHSCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBd0I3Qjs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsZUFBZSxDQUF1QyxJQUFPO0lBRTNFO1FBQXFCLDJCQUFJO1FBeUJ2QjtZQUFZLGNBQWM7aUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztnQkFBZCx5QkFBYzs7WUFBMUIsd0NBQ1csSUFBSSxXQUNkO1lBMUJELGtEQUFrRDtZQUNsRCxnQkFBVSxHQUFZLEtBQUssQ0FBQztZQUU1Qjs7O2VBR0c7WUFDTSxrQkFBWSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7O1FBbUI1QyxDQUFDO1FBZkQsa0NBQWdCLEdBQWhCO1lBQ0UsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN6RCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLHlCQUF5QixDQUFDO1lBQ3pFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlFLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXZELElBQUksUUFBUSxLQUFLLFFBQVEsRUFBRTtnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUI7UUFDSCxDQUFDO1FBS0gsY0FBQztJQUFELENBQUMsQUE1Qk0sQ0FBYyxJQUFJLEdBNEJ2QjtBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb3JtQ29udHJvbCwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXJ9IGZyb20gJy4uL2Vycm9yL2Vycm9yLW9wdGlvbnMnO1xuaW1wb3J0IHtDb25zdHJ1Y3Rvcn0gZnJvbSAnLi9jb25zdHJ1Y3Rvcic7XG5cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIHVwZGF0ZUVycm9yU3RhdGUoKTogdm9pZDtcbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+O1xuICBlcnJvclN0YXRlOiBib29sZWFuO1xuICBlcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgdHlwZSBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciA9IENvbnN0cnVjdG9yPENhblVwZGF0ZUVycm9yU3RhdGU+O1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGludGVyZmFjZSBIYXNFcnJvclN0YXRlIHtcbiAgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlO1xuICBfcGFyZW50Rm9ybTogTmdGb3JtO1xuICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcbiAgbmdDb250cm9sOiBOZ0NvbnRyb2w7XG59XG5cbi8qKlxuICogTWl4aW4gdG8gYXVnbWVudCBhIGRpcmVjdGl2ZSB3aXRoIHVwZGF0ZUVycm9yU3RhdGUgbWV0aG9kLlxuICogRm9yIGNvbXBvbmVudCB3aXRoIGBlcnJvclN0YXRlYCBhbmQgbmVlZCB0byB1cGRhdGUgYGVycm9yU3RhdGVgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5FcnJvclN0YXRlPFQgZXh0ZW5kcyBDb25zdHJ1Y3RvcjxIYXNFcnJvclN0YXRlPj4oYmFzZTogVClcbjogQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IgJiBUIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYmFzZSB7XG4gICAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBpbiBhbiBlcnJvciBzdGF0ZS4gKi9cbiAgICBlcnJvclN0YXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgc3RhdGUgb2YgdGhlIGlucHV0IGNoYW5nZXMgc3VjaCB0aGF0IHRoZSB3cmFwcGluZ1xuICAgICAqIGBNYXRGb3JtRmllbGRgIG5lZWRzIHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAqL1xuICAgIHJlYWRvbmx5IHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICBlcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG5cbiAgICB1cGRhdGVFcnJvclN0YXRlKCkge1xuICAgICAgY29uc3Qgb2xkU3RhdGUgPSB0aGlzLmVycm9yU3RhdGU7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnRGb3JtR3JvdXAgfHwgdGhpcy5fcGFyZW50Rm9ybTtcbiAgICAgIGNvbnN0IG1hdGNoZXIgPSB0aGlzLmVycm9yU3RhdGVNYXRjaGVyIHx8IHRoaXMuX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjtcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLm5nQ29udHJvbCA/IHRoaXMubmdDb250cm9sLmNvbnRyb2wgYXMgRm9ybUNvbnRyb2wgOiBudWxsO1xuICAgICAgY29uc3QgbmV3U3RhdGUgPSBtYXRjaGVyLmlzRXJyb3JTdGF0ZShjb250cm9sLCBwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3U3RhdGUgIT09IG9sZFN0YXRlKSB7XG4gICAgICAgIHRoaXMuZXJyb3JTdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
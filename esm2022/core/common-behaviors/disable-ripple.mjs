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
        /** Whether the ripple effect is disabled or not. */
        get disableRipple() {
            return this._disableRipple;
        }
        set disableRipple(value) {
            this._disableRipple = coerceBooleanProperty(value);
        }
        constructor(...args) {
            super(...args);
            this._disableRipple = false;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYWJsZS1yaXBwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2Rpc2FibGUtcmlwcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBdUI1RCxNQUFNLFVBQVUsa0JBQWtCLENBQTRCLElBQU87SUFDbkUsT0FBTyxLQUFNLFNBQVEsSUFBSTtRQUd2QixvREFBb0Q7UUFDcEQsSUFBSSxhQUFhO1lBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzdCLENBQUM7UUFDRCxJQUFJLGFBQWEsQ0FBQyxLQUFVO1lBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVELFlBQVksR0FBRyxJQUFXO1lBQ3hCLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBWFQsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFZeEMsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtBYnN0cmFjdENvbnN0cnVjdG9yLCBDb25zdHJ1Y3Rvcn0gZnJvbSAnLi9jb25zdHJ1Y3Rvcic7XG5cbi8qKlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgV2lsbCBiZSByZW1vdmVkIHRvZ2V0aGVyIHdpdGggYG1peGluRGlzYWJsZVJpcHBsZWAuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE5LjAuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhbkRpc2FibGVSaXBwbGUge1xuICAvKiogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZC4gKi9cbiAgZGlzYWJsZVJpcHBsZTogYm9vbGVhbjtcbn1cblxudHlwZSBDYW5EaXNhYmxlUmlwcGxlQ3RvciA9IENvbnN0cnVjdG9yPENhbkRpc2FibGVSaXBwbGU+ICYgQWJzdHJhY3RDb25zdHJ1Y3RvcjxDYW5EaXNhYmxlUmlwcGxlPjtcblxuLyoqXG4gKiBNaXhpbiB0byBhdWdtZW50IGEgZGlyZWN0aXZlIHdpdGggYSBgZGlzYWJsZVJpcHBsZWAgcHJvcGVydHkuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYW4gaW5wdXQgd2l0aCBhIHRyYW5zZm9ybSBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxOS4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluRGlzYWJsZVJpcHBsZTxUIGV4dGVuZHMgQWJzdHJhY3RDb25zdHJ1Y3Rvcjx7fT4+KFxuICBiYXNlOiBULFxuKTogQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiBUO1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluRGlzYWJsZVJpcHBsZTxUIGV4dGVuZHMgQ29uc3RydWN0b3I8e30+PihiYXNlOiBUKTogQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiBUIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYmFzZSB7XG4gICAgcHJpdmF0ZSBfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICAgIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7XG4gICAgfVxuICAgIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBhbnkpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcbiAgICB9XG4gIH07XG59XG4iXX0=
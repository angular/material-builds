/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Directive, Input } from '@angular/core';
let nextUniqueId = 0;
/** Single error message to be shown underneath the form field. */
let MatError = /** @class */ (() => {
    let MatError = class MatError {
        constructor() {
            this.id = `mat-error-${nextUniqueId++}`;
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatError.prototype, "id", void 0);
    MatError = __decorate([
        Directive({
            selector: 'mat-error',
            host: {
                'class': 'mat-error',
                'role': 'alert',
                '[attr.id]': 'id',
            }
        })
    ], MatError);
    return MatError;
})();
export { MatError };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHL0MsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBR3JCLGtFQUFrRTtBQVNsRTtJQUFBLElBQWEsUUFBUSxHQUFyQixNQUFhLFFBQVE7UUFBckI7WUFDVyxPQUFFLEdBQVcsYUFBYSxZQUFZLEVBQUUsRUFBRSxDQUFDO1FBQ3RELENBQUM7S0FBQSxDQUFBO0lBRFU7UUFBUixLQUFLLEVBQUU7O3dDQUE0QztJQUR6QyxRQUFRO1FBUnBCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxXQUFXO1lBQ3JCLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsV0FBVztnQkFDcEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRixDQUFDO09BQ1csUUFBUSxDQUVwQjtJQUFELGVBQUM7S0FBQTtTQUZZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuXG4vKiogU2luZ2xlIGVycm9yIG1lc3NhZ2UgdG8gYmUgc2hvd24gdW5kZXJuZWF0aCB0aGUgZm9ybSBmaWVsZC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1lcnJvcicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWVycm9yJyxcbiAgICAncm9sZSc6ICdhbGVydCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXJyb3Ige1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1lcnJvci0ke25leHRVbmlxdWVJZCsrfWA7XG59XG4iXX0=
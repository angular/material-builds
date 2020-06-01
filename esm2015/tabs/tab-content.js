/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, TemplateRef } from '@angular/core';
/** Decorates the `ng-template` tags and reads out the template from it. */
let MatTabContent = /** @class */ (() => {
    class MatTabContent {
        constructor(template) {
            this.template = template;
        }
    }
    MatTabContent.decorators = [
        { type: Directive, args: [{ selector: '[matTabContent]' },] }
    ];
    /** @nocollapse */
    MatTabContent.ctorParameters = () => [
        { type: TemplateRef }
    ];
    return MatTabContent;
})();
export { MatTabContent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItY29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVyRCwyRUFBMkU7QUFDM0U7SUFBQSxNQUNhLGFBQWE7UUFDeEIsWUFBbUIsUUFBMEI7WUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFBSSxDQUFDOzs7Z0JBRm5ELFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQzs7OztnQkFIckIsV0FBVzs7SUFNOUIsb0JBQUM7S0FBQTtTQUZZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqIERlY29yYXRlcyB0aGUgYG5nLXRlbXBsYXRlYCB0YWdzIGFuZCByZWFkcyBvdXQgdGhlIHRlbXBsYXRlIGZyb20gaXQuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1ttYXRUYWJDb250ZW50XSd9KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkNvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHsgfVxufVxuIl19
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @docs-private */
export function createMissingDateImplError(provider) {
    return Error(`MatDatepicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: MatNativeDateModule, MatMomentDateModule, or provide a ` +
        `custom implementation.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlcGlja2VyLWVycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLDBCQUEwQixDQUFDLFFBQWdCO0lBQ3pELE9BQU8sS0FBSyxDQUNWLHdDQUF3QyxRQUFRLHlDQUF5QztRQUN2RiwyRkFBMkY7UUFDM0Ysd0JBQXdCLENBQzNCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IocHJvdmlkZXI6IHN0cmluZykge1xuICByZXR1cm4gRXJyb3IoXG4gICAgYE1hdERhdGVwaWNrZXI6IE5vIHByb3ZpZGVyIGZvdW5kIGZvciAke3Byb3ZpZGVyfS4gWW91IG11c3QgaW1wb3J0IG9uZSBvZiB0aGUgZm9sbG93aW5nIGAgK1xuICAgICAgYG1vZHVsZXMgYXQgeW91ciBhcHBsaWNhdGlvbiByb290OiBNYXROYXRpdmVEYXRlTW9kdWxlLCBNYXRNb21lbnREYXRlTW9kdWxlLCBvciBwcm92aWRlIGEgYCArXG4gICAgICBgY3VzdG9tIGltcGxlbWVudGF0aW9uLmAsXG4gICk7XG59XG4iXX0=
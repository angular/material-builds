/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Harness for interacting with a `mat-divider`.
 * @dynamic
 */
export class MatDividerHarness extends ComponentHarness {
    static with(options = {}) {
        return new HarnessPredicate(MatDividerHarness, options);
    }
    getOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-orientation');
        });
    }
    isInset() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-divider-inset');
        });
    }
}
MatDividerHarness.hostSelector = '.mat-divider';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpdmlkZXIvdGVzdGluZy9kaXZpZGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFOzs7R0FHRztBQUNILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxnQkFBZ0I7SUFHckQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFpQyxFQUFFO1FBQzdDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUssY0FBYzs7WUFDbEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUNwQixDQUFDO1FBQ3pDLENBQUM7S0FBQTtJQUVLLE9BQU87O1lBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUFBOztBQWJNLDhCQUFZLEdBQUcsY0FBYyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtEaXZpZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGl2aWRlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBgbWF0LWRpdmlkZXJgLlxuICogQGR5bmFtaWNcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdERpdmlkZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1kaXZpZGVyJztcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEaXZpZGVySGFybmVzc0ZpbHRlcnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXREaXZpZGVySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRPcmllbnRhdGlvbigpOiBQcm9taXNlPCdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtb3JpZW50YXRpb24nKSBhc1xuICAgICAgICBQcm9taXNlPCdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCc+O1xuICB9XG5cbiAgYXN5bmMgaXNJbnNldCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWRpdmlkZXItaW5zZXQnKTtcbiAgfVxufVxuIl19
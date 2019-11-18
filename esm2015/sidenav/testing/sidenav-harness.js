/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatDrawerHarness } from './drawer-harness';
/** Harness for interacting with a standard mat-sidenav in tests. */
export class MatSidenavHarness extends MatDrawerHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a sidenav with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options)
            .addOption('position', options.position, (harness, position) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getPosition()) === position; }));
    }
    /** Gets whether the sidenav is fixed in the viewport. */
    isFixedInViewport() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-sidenav-fixed');
        });
    }
}
MatSidenavHarness.hostSelector = '.mat-sidenav';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvdGVzdGluZy9zaWRlbmF2LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBR2xELG9FQUFvRTtBQUNwRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBR3JEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFnQyxFQUFFO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUM7YUFDakQsU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUNuQyxDQUFPLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxnREFBQyxPQUFBLENBQUMsTUFBTSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxRQUFRLENBQUEsR0FBQSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELHlEQUF5RDtJQUNuRCxpQkFBaUI7O1lBQ3JCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzNELENBQUM7S0FBQTs7QUFqQk0sOEJBQVksR0FBRyxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdERyYXdlckhhcm5lc3N9IGZyb20gJy4vZHJhd2VyLWhhcm5lc3MnO1xuaW1wb3J0IHtEcmF3ZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kcmF3ZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2lkZW5hdiBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2SGFybmVzcyBleHRlbmRzIE1hdERyYXdlckhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2lkZW5hdic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgc2lkZW5hdiB3aXRoXG4gICAqIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoLlxuICAgKiBAcmV0dXJuIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEcmF3ZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREcmF3ZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERyYXdlckhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3Bvc2l0aW9uJywgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBwb3NpdGlvbikgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0UG9zaXRpb24oKSkgPT09IHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHNpZGVuYXYgaXMgZml4ZWQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBhc3luYyBpc0ZpeGVkSW5WaWV3cG9ydCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LXNpZGVuYXYtZml4ZWQnKTtcbiAgfVxufVxuIl19
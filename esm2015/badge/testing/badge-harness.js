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
 * Harness for interacting with a standard Material badge in tests.
 * @dynamic
 */
export class MatBadgeHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._badgeElement = this.locatorFor('.mat-badge-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a badge with specific attributes.
     * @param options Options for narrowing the search:
     *   - `text` finds a badge host with a particular text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatBadgeHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets a promise for the badge text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._badgeElement()).text();
        });
    }
    /** Gets whether the badge is overlapping the content. */
    isOverlapping() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-badge-overlap');
        });
    }
    /** Gets the position of the badge. */
    getPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            let result = '';
            if (yield host.hasClass('mat-badge-above')) {
                result += 'above';
            }
            else if (yield host.hasClass('mat-badge-below')) {
                result += 'below';
            }
            if (yield host.hasClass('mat-badge-before')) {
                result += ' before';
            }
            else if (yield host.hasClass('mat-badge-after')) {
                result += ' after';
            }
            return result.trim();
        });
    }
    /** Gets the size of the badge. */
    getSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            if (yield host.hasClass('mat-badge-small')) {
                return 'small';
            }
            else if (yield host.hasClass('mat-badge-large')) {
                return 'large';
            }
            return 'medium';
        });
    }
    /** Gets whether the badge is hidden. */
    isHidden() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-badge-hidden');
        });
    }
    /** Gets whether the badge is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-badge-disabled');
        });
    }
}
MatBadgeHarness.hostSelector = '.mat-badge';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9iYWRnZS90ZXN0aW5nL2JhZGdlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBS3hFOzs7R0FHRztBQUNILE1BQU0sT0FBTyxlQUFnQixTQUFRLGdCQUFnQjtJQUFyRDs7UUFlVSxrQkFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQXNEaEUsQ0FBQztJQWxFQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBK0IsRUFBRTtRQUMzQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQzthQUNoRCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFJRCx5Q0FBeUM7SUFDbkMsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM3QyxDQUFDO0tBQUE7SUFFRCx5REFBeUQ7SUFDbkQsYUFBYTs7WUFDakIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUFBO0lBRUQsc0NBQXNDO0lBQ2hDLFdBQVc7O1lBQ2YsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBRWhCLElBQUksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQzFDLE1BQU0sSUFBSSxPQUFPLENBQUM7YUFDbkI7aUJBQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDakQsTUFBTSxJQUFJLE9BQU8sQ0FBQzthQUNuQjtZQUVELElBQUksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7Z0JBQzNDLE1BQU0sSUFBSSxTQUFTLENBQUM7YUFDckI7aUJBQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDakQsTUFBTSxJQUFJLFFBQVEsQ0FBQzthQUNwQjtZQUVELE9BQU8sTUFBTSxDQUFDLElBQUksRUFBc0IsQ0FBQztRQUMzQyxDQUFDO0tBQUE7SUFFRCxrQ0FBa0M7SUFDNUIsT0FBTzs7WUFDWCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUUvQixJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUMxQyxPQUFPLE9BQU8sQ0FBQzthQUNoQjtpQkFBTSxJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUNqRCxPQUFPLE9BQU8sQ0FBQzthQUNoQjtZQUVELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FBQTtJQUVELHdDQUF3QztJQUNsQyxRQUFROztZQUNaLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFELENBQUM7S0FBQTtJQUVELDBDQUEwQztJQUNwQyxVQUFVOztZQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVELENBQUM7S0FBQTs7QUFuRU0sNEJBQVksR0FBRyxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEJhZGdlUG9zaXRpb24sIE1hdEJhZGdlU2l6ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYmFkZ2UnO1xuaW1wb3J0IHtCYWRnZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2JhZGdlLWhhcm5lc3MtZmlsdGVycyc7XG5cblxuLyoqXG4gKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgYmFkZ2UgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0QmFkZ2VIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1iYWRnZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYmFkZ2Ugd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGB0ZXh0YCBmaW5kcyBhIGJhZGdlIGhvc3Qgd2l0aCBhIHBhcnRpY3VsYXIgdGV4dC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBCYWRnZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEJhZGdlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRCYWRnZUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSk7XG4gIH1cblxuICBwcml2YXRlIF9iYWRnZUVsZW1lbnQgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtYmFkZ2UtY29udGVudCcpO1xuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIGJhZGdlIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2JhZGdlRWxlbWVudCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBiYWRnZSBpcyBvdmVybGFwcGluZyB0aGUgY29udGVudC4gKi9cbiAgYXN5bmMgaXNPdmVybGFwcGluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWJhZGdlLW92ZXJsYXAnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYmFkZ2UuICovXG4gIGFzeW5jIGdldFBvc2l0aW9uKCk6IFByb21pc2U8TWF0QmFkZ2VQb3NpdGlvbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWFib3ZlJykpIHtcbiAgICAgIHJlc3VsdCArPSAnYWJvdmUnO1xuICAgIH0gZWxzZSBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWJlbG93JykpIHtcbiAgICAgIHJlc3VsdCArPSAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtYmFkZ2UtYmVmb3JlJykpIHtcbiAgICAgIHJlc3VsdCArPSAnIGJlZm9yZSc7XG4gICAgfSBlbHNlIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtYmFkZ2UtYWZ0ZXInKSkge1xuICAgICAgcmVzdWx0ICs9ICcgYWZ0ZXInO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQudHJpbSgpIGFzIE1hdEJhZGdlUG9zaXRpb247XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2l6ZSBvZiB0aGUgYmFkZ2UuICovXG4gIGFzeW5jIGdldFNpemUoKTogUHJvbWlzZTxNYXRCYWRnZVNpemU+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLXNtYWxsJykpIHtcbiAgICAgIHJldHVybiAnc21hbGwnO1xuICAgIH0gZWxzZSBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWxhcmdlJykpIHtcbiAgICAgIHJldHVybiAnbGFyZ2UnO1xuICAgIH1cblxuICAgIHJldHVybiAnbWVkaXVtJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJhZGdlIGlzIGhpZGRlbi4gKi9cbiAgYXN5bmMgaXNIaWRkZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1iYWRnZS1oaWRkZW4nKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJhZGdlIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtYmFkZ2UtZGlzYWJsZWQnKTtcbiAgfVxufVxuIl19
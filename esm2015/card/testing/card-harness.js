/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-card in tests. */
export class MatCardHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional('.mat-card-title');
        this._subtitle = this.locatorForOptional('.mat-card-subtitle');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCardHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatCardHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitleText(), title))
            .addOption('subtitle', options.subtitle, (harness, subtitle) => HarnessPredicate.stringMatches(harness.getSubtitleText(), subtitle));
    }
    /** Gets all of the card's content as text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
    /** Gets the cards's title text. */
    getTitleText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._title())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
    /** Gets the cards's subtitle text. */
    getSubtitleText() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this._subtitle())) === null || _a === void 0 ? void 0 : _a.text()) !== null && _b !== void 0 ? _b : '';
        });
    }
}
/** The selector for the host element of a `MatCard` instance. */
MatCardHarness.hostSelector = '.mat-card';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NhcmQvdGVzdGluZy9jYXJkLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQ0FBZ0MsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBV3hGLGlFQUFpRTtBQUNqRSxNQUFNLE9BQU8sY0FBZSxTQUFRLGdDQUFnRDtJQUFwRjs7UUFxQlUsV0FBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3BELGNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQWdCcEUsQ0FBQztJQWxDQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBOEIsRUFBRTtRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQzthQUMvQyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzNCLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUM5RSxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQzdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNyRixTQUFTLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQ25DLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQ2xCLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBS0QsOENBQThDO0lBQ3hDLE9BQU87O1lBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQztLQUFBO0lBRUQsbUNBQW1DO0lBQzdCLFlBQVk7OztZQUNoQixtQkFBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLDBDQUFFLElBQUkscUNBQU0sRUFBRSxDQUFDOztLQUM1QztJQUVELHNDQUFzQztJQUNoQyxlQUFlOzs7WUFDbkIsbUJBQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQywwQ0FBRSxJQUFJLHFDQUFNLEVBQUUsQ0FBQzs7S0FDL0M7O0FBcENELGlFQUFpRTtBQUMxRCwyQkFBWSxHQUFHLFdBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NhcmRIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9jYXJkLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBTZWxlY3RvcnMgZm9yIGRpZmZlcmVudCBzZWN0aW9ucyBvZiB0aGUgbWF0LWNhcmQgdGhhdCBjYW4gY29udGFpbmVyIHVzZXIgY29udGVudC4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIE1hdENhcmRTZWN0aW9uIHtcbiAgSEVBREVSID0gJy5tYXQtY2FyZC1oZWFkZXInLFxuICBDT05URU5UID0gJy5tYXQtY2FyZC1jb250ZW50JyxcbiAgQUNUSU9OUyA9ICcubWF0LWNhcmQtYWN0aW9ucycsXG4gIEZPT1RFUiA9ICcubWF0LWNhcmQtZm9vdGVyJ1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1jYXJkIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENhcmRIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8TWF0Q2FyZFNlY3Rpb24+IHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRDYXJkYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWNhcmQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRDYXJkSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggY2FyZCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBDYXJkSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0Q2FyZEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0Q2FyZEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsXG4gICAgICAgICAgICAoaGFybmVzcywgdGV4dCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSlcbiAgICAgICAgLmFkZE9wdGlvbigndGl0bGUnLCBvcHRpb25zLnRpdGxlLFxuICAgICAgICAgICAgKGhhcm5lc3MsIHRpdGxlKSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUaXRsZVRleHQoKSwgdGl0bGUpKVxuICAgICAgICAuYWRkT3B0aW9uKCdzdWJ0aXRsZScsIG9wdGlvbnMuc3VidGl0bGUsXG4gICAgICAgICAgICAoaGFybmVzcywgc3VidGl0bGUpID0+XG4gICAgICAgICAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0U3VidGl0bGVUZXh0KCksIHN1YnRpdGxlKSk7XG4gIH1cblxuICBwcml2YXRlIF90aXRsZSA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWNhcmQtdGl0bGUnKTtcbiAgcHJpdmF0ZSBfc3VidGl0bGUgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1jYXJkLXN1YnRpdGxlJyk7XG5cbiAgLyoqIEdldHMgYWxsIG9mIHRoZSBjYXJkJ3MgY29udGVudCBhcyB0ZXh0LiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNhcmRzJ3MgdGl0bGUgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGl0bGVUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl90aXRsZSgpKT8udGV4dCgpID8/ICcnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGNhcmRzJ3Mgc3VidGl0bGUgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0U3VidGl0bGVUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9zdWJ0aXRsZSgpKT8udGV4dCgpID8/ICcnO1xuICB9XG59XG4iXX0=
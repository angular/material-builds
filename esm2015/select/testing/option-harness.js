/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a the `mat-option` for a `mat-select` in tests. */
export class MatSelectOptionHarness extends ComponentHarness {
    // TODO(crisbeto): things to add here when adding a common option harness:
    // - isDisabled
    // - isSelected
    // - isActive
    // - isMultiple
    static with(options = {}) {
        return new HarnessPredicate(MatSelectOptionHarness, options)
            .addOption('text', options.text, (harness, title) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getText(), title); }));
    }
    /** Clicks the option. */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
    /** Gets a promise for the option's label text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text();
        });
    }
}
MatSelectOptionHarness.hostSelector = '.mat-select-panel .mat-option';
/** Harness for interacting with a the `mat-optgroup` for a `mat-select` in tests. */
export class MatSelectOptionGroupHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('.mat-optgroup-label');
    }
    static with(options = {}) {
        return new HarnessPredicate(MatSelectOptionGroupHarness, options)
            .addOption('labelText', options.labelText, (harness, title) => __awaiter(this, void 0, void 0, function* () { return HarnessPredicate.stringMatches(yield harness.getLabelText(), title); }));
    }
    /** Gets a promise for the option group's label text. */
    getLabelText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
}
MatSelectOptionGroupHarness.hostSelector = '.mat-select-panel .mat-optgroup';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3Rlc3Rpbmcvb3B0aW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBcUIsTUFBTSxzQkFBc0IsQ0FBQztBQWE1RixtRkFBbUY7QUFDbkYsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGdCQUFnQjtJQUMxRCwwRUFBMEU7SUFDMUUsZUFBZTtJQUNmLGVBQWU7SUFDZixhQUFhO0lBQ2IsZUFBZTtJQUVmLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDO2FBQ3ZELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsQ0FBTyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsZ0RBQ3JCLE9BQUEsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBLEdBQUEsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFJRCx5QkFBeUI7SUFDbkIsS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRCxrREFBa0Q7SUFDNUMsT0FBTzs7WUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7O0FBVk0sbUNBQVksR0FBRywrQkFBK0IsQ0FBQztBQWF4RCxxRkFBcUY7QUFDckYsTUFBTSxPQUFPLDJCQUE0QixTQUFRLGdCQUFnQjtJQUFqRTs7UUFDVSxXQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBYzFELENBQUM7SUFYQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXFDLEVBQUU7UUFDakQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLDJCQUEyQixFQUFFLE9BQU8sQ0FBQzthQUM1RCxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQ3JDLENBQU8sT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLGdEQUNyQixPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQSxHQUFBLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsd0RBQXdEO0lBQ2xELFlBQVk7O1lBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RDLENBQUM7S0FBQTs7QUFaTSx3Q0FBWSxHQUFHLGlDQUFpQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgQmFzZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5cbi8vIFRPRE8oY3Jpc2JldG8pOiBjb21iaW5lIHRoZXNlIHdpdGggdGhlIG9uZXMgaW4gYG1hdC1hdXRvY29tcGxldGVgXG4vLyBhbmQgZXhwYW5kIHRvIGNvdmVyIGFsbCBzdGF0ZXMgb25jZSB3ZSBoYXZlIGV4cGVyaW1lbnRhbC9jb3JlLlxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbkhhcm5lc3NGaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzIHtcbiAgdGV4dD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzIGV4dGVuZHMgQmFzZUhhcm5lc3NGaWx0ZXJzIHtcbiAgbGFiZWxUZXh0Pzogc3RyaW5nO1xufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHRoZSBgbWF0LW9wdGlvbmAgZm9yIGEgYG1hdC1zZWxlY3RgIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdE9wdGlvbkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaW5ncyB0byBhZGQgaGVyZSB3aGVuIGFkZGluZyBhIGNvbW1vbiBvcHRpb24gaGFybmVzczpcbiAgLy8gLSBpc0Rpc2FibGVkXG4gIC8vIC0gaXNTZWxlY3RlZFxuICAvLyAtIGlzQWN0aXZlXG4gIC8vIC0gaXNNdWx0aXBsZVxuXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IE9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2VsZWN0T3B0aW9uSGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCB0aXRsZSkgPT5cbiAgICAgICAgICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgaGFybmVzcy5nZXRUZXh0KCksIHRpdGxlKSk7XG4gIH1cblxuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2VsZWN0LXBhbmVsIC5tYXQtb3B0aW9uJztcblxuICAvKiogQ2xpY2tzIHRoZSBvcHRpb24uICovXG4gIGFzeW5jIGNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBvcHRpb24ncyBsYWJlbCB0ZXh0LiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCgpO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgdGhlIGBtYXQtb3B0Z3JvdXBgIGZvciBhIGBtYXQtc2VsZWN0YCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RPcHRpb25Hcm91cEhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtb3B0Z3JvdXAtbGFiZWwnKTtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNlbGVjdC1wYW5lbCAubWF0LW9wdGdyb3VwJztcblxuICBzdGF0aWMgd2l0aChvcHRpb25zOiBPcHRpb25Hcm91cEhhcm5lc3NGaWx0ZXJzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2VsZWN0T3B0aW9uR3JvdXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdsYWJlbFRleHQnLCBvcHRpb25zLmxhYmVsVGV4dCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCB0aXRsZSkgPT5cbiAgICAgICAgICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgaGFybmVzcy5nZXRMYWJlbFRleHQoKSwgdGl0bGUpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIG9wdGlvbiBncm91cCdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG59XG5cbiJdfQ==
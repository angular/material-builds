/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatNativeOptionHarness } from './native-option-harness';
/** Harness for interacting with a native `select` in tests. */
export class MatNativeSelectHarness extends MatFormFieldControlHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatNativeSelectHarness, options);
    }
    /** Gets a boolean promise indicating if the select is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('disabled');
        });
    }
    /** Gets a boolean promise indicating if the select is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('required');
        });
    }
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    isMultiple() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('multiple');
        });
    }
    /** Gets the name of the select. */
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "name" property of the native select is never undefined.
            return (yield (yield this.host()).getProperty('name'));
        });
    }
    /** Gets the id of the select. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            // We're guaranteed to have an id, because the `matNativeControl` always assigns one.
            return (yield (yield this.host()).getProperty('id'));
        });
    }
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the select is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Gets the options inside the select panel. */
    getOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatNativeOptionHarness.with(filter))();
        });
    }
    /**
     * Selects the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    selectOptions(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const [isMultiple, options] = yield Promise.all([this.isMultiple(), this.getOptions(filter)]);
            if (options.length === 0) {
                throw Error('Select does not have options matching the specified filter');
            }
            const [host, optionIndexes] = yield Promise.all([
                this.host(),
                Promise.all(options.slice(0, isMultiple ? undefined : 1).map(option => option.getIndex()))
            ]);
            // @breaking-change 12.0.0 Error can be removed once `selectOptions` is a required method.
            if (!host.selectOptions) {
                throw Error('TestElement implementation does not support the selectOptions ' +
                    'method which is required for this function.');
            }
            yield host.selectOptions(...optionIndexes);
        });
    }
}
MatNativeSelectHarness.hostSelector = 'select[matNativeControl]';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlLXNlbGVjdC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2lucHV0L3Rlc3RpbmcvbmF0aXZlLXNlbGVjdC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQU8vRCwrREFBK0Q7QUFDL0QsTUFBTSxPQUFPLHNCQUF1QixTQUFRLDBCQUEwQjtJQUdwRTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBc0MsRUFBRTtRQUNsRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELG1FQUFtRTtJQUM3RCxVQUFVOztZQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7SUFFRCxtRUFBbUU7SUFDN0QsVUFBVTs7WUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckQsQ0FBQztLQUFBO0lBRUQsa0ZBQWtGO0lBQzVFLFVBQVU7O1lBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELENBQUM7S0FBQTtJQUVELG1DQUFtQztJQUM3QixPQUFPOztZQUNYLCtEQUErRDtZQUMvRCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFFLENBQUM7UUFDMUQsQ0FBQztLQUFBO0lBRUQsaUNBQWlDO0lBQzNCLEtBQUs7O1lBQ1QscUZBQXFGO1lBQ3JGLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQztRQUN4RCxDQUFDO0tBQUE7SUFFRCxnR0FBZ0c7SUFDMUYsS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRCw4RkFBOEY7SUFDeEYsSUFBSTs7WUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7SUFFRCxxQ0FBcUM7SUFDL0IsU0FBUzs7WUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QyxDQUFDO0tBQUE7SUFFRCxnREFBZ0Q7SUFDMUMsVUFBVSxDQUFDLFNBQXFDLEVBQUU7O1lBRXRELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLGFBQWEsQ0FBQyxTQUFxQyxFQUFFOztZQUN6RCxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixNQUFNLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO2FBQzNFO1lBRUQsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDM0YsQ0FBQyxDQUFDO1lBRUgsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN2QixNQUFNLEtBQUssQ0FBQyxnRUFBZ0U7b0JBQ2hFLDZDQUE2QyxDQUFDLENBQUM7YUFDNUQ7WUFFRCxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQztRQUM3QyxDQUFDO0tBQUE7O0FBbkZNLG1DQUFZLEdBQUcsMEJBQTBCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkL3Rlc3RpbmcvY29udHJvbCc7XG5pbXBvcnQge01hdE5hdGl2ZU9wdGlvbkhhcm5lc3N9IGZyb20gJy4vbmF0aXZlLW9wdGlvbi1oYXJuZXNzJztcbmltcG9ydCB7XG4gIE5hdGl2ZU9wdGlvbkhhcm5lc3NGaWx0ZXJzLFxuICBOYXRpdmVTZWxlY3RIYXJuZXNzRmlsdGVycyxcbn0gZnJvbSAnLi9uYXRpdmUtc2VsZWN0LWhhcm5lc3MtZmlsdGVycyc7XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBuYXRpdmUgYHNlbGVjdGAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TmF0aXZlU2VsZWN0SGFybmVzcyBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdzZWxlY3RbbWF0TmF0aXZlQ29udHJvbF0nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXROYXRpdmVTZWxlY3RIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzZWxlY3QgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTmF0aXZlU2VsZWN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TmF0aXZlU2VsZWN0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXROYXRpdmVTZWxlY3RIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgncmVxdWlyZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb24gbW9kZS4gKi9cbiAgYXN5bmMgaXNNdWx0aXBsZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnbXVsdGlwbGUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBzZWxlY3QuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJuYW1lXCIgcHJvcGVydHkgb2YgdGhlIG5hdGl2ZSBzZWxlY3QgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnbmFtZScpKSE7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIHNlbGVjdC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBXZSdyZSBndWFyYW50ZWVkIHRvIGhhdmUgYW4gaWQsIGJlY2F1c2UgdGhlIGBtYXROYXRpdmVDb250cm9sYCBhbHdheXMgYXNzaWducyBvbmUuXG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5KCdpZCcpKSE7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2VsZWN0IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgc2VsZWN0IGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcHRpb25zIGluc2lkZSB0aGUgc2VsZWN0IHBhbmVsLiAqL1xuICBhc3luYyBnZXRPcHRpb25zKGZpbHRlcjogTmF0aXZlT3B0aW9uSGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgUHJvbWlzZTxNYXROYXRpdmVPcHRpb25IYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdE5hdGl2ZU9wdGlvbkhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIG9wdGlvbnMgdGhhdCBtYXRjaCB0aGUgcGFzc2VkLWluIGZpbHRlci4gSWYgdGhlIHNlbGVjdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb25cbiAgICogbW9kZSBhbGwgb3B0aW9ucyB3aWxsIGJlIGNsaWNrZWQsIG90aGVyd2lzZSB0aGUgaGFybmVzcyB3aWxsIHBpY2sgdGhlIGZpcnN0IG1hdGNoaW5nIG9wdGlvbi5cbiAgICovXG4gIGFzeW5jIHNlbGVjdE9wdGlvbnMoZmlsdGVyOiBOYXRpdmVPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgW2lzTXVsdGlwbGUsIG9wdGlvbnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaXNNdWx0aXBsZSgpLCB0aGlzLmdldE9wdGlvbnMoZmlsdGVyKV0pO1xuXG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignU2VsZWN0IGRvZXMgbm90IGhhdmUgb3B0aW9ucyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IFtob3N0LCBvcHRpb25JbmRleGVzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuaG9zdCgpLFxuICAgICAgUHJvbWlzZS5hbGwob3B0aW9ucy5zbGljZSgwLCBpc011bHRpcGxlID8gdW5kZWZpbmVkIDogMSkubWFwKG9wdGlvbiA9PiBvcHRpb24uZ2V0SW5kZXgoKSkpXG4gICAgXSk7XG5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMCBFcnJvciBjYW4gYmUgcmVtb3ZlZCBvbmNlIGBzZWxlY3RPcHRpb25zYCBpcyBhIHJlcXVpcmVkIG1ldGhvZC5cbiAgICBpZiAoIWhvc3Quc2VsZWN0T3B0aW9ucykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1Rlc3RFbGVtZW50IGltcGxlbWVudGF0aW9uIGRvZXMgbm90IHN1cHBvcnQgdGhlIHNlbGVjdE9wdGlvbnMgJyArXG4gICAgICAgICAgICAgICAgICAnbWV0aG9kIHdoaWNoIGlzIHJlcXVpcmVkIGZvciB0aGlzIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIGF3YWl0IGhvc3Quc2VsZWN0T3B0aW9ucyguLi5vcHRpb25JbmRleGVzKTtcbiAgfVxufVxuIl19
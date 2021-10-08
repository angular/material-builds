/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel } from '@angular/cdk/testing';
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
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Gets a boolean promise indicating if the select is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    async isMultiple() {
        return (await this.host()).getProperty('multiple');
    }
    /** Gets the name of the select. */
    async getName() {
        // The "name" property of the native select is never undefined.
        return (await (await this.host()).getProperty('name'));
    }
    /** Gets the id of the select. */
    async getId() {
        // We're guaranteed to have an id, because the `matNativeControl` always assigns one.
        return (await (await this.host()).getProperty('id'));
    }
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the select is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Gets the options inside the select panel. */
    async getOptions(filter = {}) {
        return this.locatorForAll(MatNativeOptionHarness.with(filter))();
    }
    /**
     * Selects the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    async selectOptions(filter = {}) {
        const [isMultiple, options] = await parallel(() => {
            return [this.isMultiple(), this.getOptions(filter)];
        });
        if (options.length === 0) {
            throw Error('Select does not have options matching the specified filter');
        }
        const [host, optionIndexes] = await parallel(() => [
            this.host(),
            parallel(() => options.slice(0, isMultiple ? undefined : 1).map(option => option.getIndex()))
        ]);
        await host.selectOptions(...optionIndexes);
    }
}
MatNativeSelectHarness.hostSelector = 'select[matNativeControl]';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlLXNlbGVjdC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2lucHV0L3Rlc3RpbmcvbmF0aXZlLXNlbGVjdC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQU8vRCwrREFBK0Q7QUFDL0QsTUFBTSxPQUFPLHNCQUF1QixTQUFRLDBCQUEwQjtJQUdwRTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBc0MsRUFBRTtRQUNsRCxPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBVSxVQUFVLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFVLFVBQVUsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQVUsVUFBVSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxLQUFLLENBQUMsT0FBTztRQUNYLCtEQUErRDtRQUMvRCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFTLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELGlDQUFpQztJQUNqQyxLQUFLLENBQUMsS0FBSztRQUNULHFGQUFxRjtRQUNyRixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFTLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELGdHQUFnRztJQUNoRyxLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCw4RkFBOEY7SUFDOUYsS0FBSyxDQUFDLElBQUk7UUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQXFDLEVBQUU7UUFFdEQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBcUMsRUFBRTtRQUN6RCxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUMzRTtRQUVELE1BQU0sQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDakQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDOUYsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7QUEvRU0sbUNBQVksR0FBRywwQkFBMEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkL3Rlc3RpbmcvY29udHJvbCc7XG5pbXBvcnQge01hdE5hdGl2ZU9wdGlvbkhhcm5lc3N9IGZyb20gJy4vbmF0aXZlLW9wdGlvbi1oYXJuZXNzJztcbmltcG9ydCB7XG4gIE5hdGl2ZU9wdGlvbkhhcm5lc3NGaWx0ZXJzLFxuICBOYXRpdmVTZWxlY3RIYXJuZXNzRmlsdGVycyxcbn0gZnJvbSAnLi9uYXRpdmUtc2VsZWN0LWhhcm5lc3MtZmlsdGVycyc7XG5cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBuYXRpdmUgYHNlbGVjdGAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0TmF0aXZlU2VsZWN0SGFybmVzcyBleHRlbmRzIE1hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICdzZWxlY3RbbWF0TmF0aXZlQ29udHJvbF0nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXROYXRpdmVTZWxlY3RIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzZWxlY3QgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogTmF0aXZlU2VsZWN0SGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0TmF0aXZlU2VsZWN0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXROYXRpdmVTZWxlY3RIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPignZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPigncmVxdWlyZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdCBpcyBpbiBtdWx0aS1zZWxlY3Rpb24gbW9kZS4gKi9cbiAgYXN5bmMgaXNNdWx0aXBsZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPignbXVsdGlwbGUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBzZWxlY3QuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgXCJuYW1lXCIgcHJvcGVydHkgb2YgdGhlIG5hdGl2ZSBzZWxlY3QgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCduYW1lJykpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBzZWxlY3QuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gV2UncmUgZ3VhcmFudGVlZCB0byBoYXZlIGFuIGlkLCBiZWNhdXNlIHRoZSBgbWF0TmF0aXZlQ29udHJvbGAgYWx3YXlzIGFzc2lnbnMgb25lLlxuICAgIHJldHVybiAoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdpZCcpKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBzZWxlY3QgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9wdGlvbnMgaW5zaWRlIHRoZSBzZWxlY3QgcGFuZWwuICovXG4gIGFzeW5jIGdldE9wdGlvbnMoZmlsdGVyOiBOYXRpdmVPcHRpb25IYXJuZXNzRmlsdGVycyA9IHt9KTpcbiAgICBQcm9taXNlPE1hdE5hdGl2ZU9wdGlvbkhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0TmF0aXZlT3B0aW9uSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyB0aGUgb3B0aW9ucyB0aGF0IG1hdGNoIHRoZSBwYXNzZWQtaW4gZmlsdGVyLiBJZiB0aGUgc2VsZWN0IGlzIGluIG11bHRpLXNlbGVjdGlvblxuICAgKiBtb2RlIGFsbCBvcHRpb25zIHdpbGwgYmUgY2xpY2tlZCwgb3RoZXJ3aXNlIHRoZSBoYXJuZXNzIHdpbGwgcGljayB0aGUgZmlyc3QgbWF0Y2hpbmcgb3B0aW9uLlxuICAgKi9cbiAgYXN5bmMgc2VsZWN0T3B0aW9ucyhmaWx0ZXI6IE5hdGl2ZU9wdGlvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBbaXNNdWx0aXBsZSwgb3B0aW9uc10gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiB7XG4gICAgICByZXR1cm4gW3RoaXMuaXNNdWx0aXBsZSgpLCB0aGlzLmdldE9wdGlvbnMoZmlsdGVyKV07XG4gICAgfSk7XG5cbiAgICBpZiAob3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IEVycm9yKCdTZWxlY3QgZG9lcyBub3QgaGF2ZSBvcHRpb25zIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVyJyk7XG4gICAgfVxuXG4gICAgY29uc3QgW2hvc3QsIG9wdGlvbkluZGV4ZXNdID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gW1xuICAgICAgdGhpcy5ob3N0KCksXG4gICAgICBwYXJhbGxlbCgoKSA9PiBvcHRpb25zLnNsaWNlKDAsIGlzTXVsdGlwbGUgPyB1bmRlZmluZWQgOiAxKS5tYXAob3B0aW9uID0+IG9wdGlvbi5nZXRJbmRleCgpKSlcbiAgICBdKTtcblxuICAgIGF3YWl0IGhvc3Quc2VsZWN0T3B0aW9ucyguLi5vcHRpb25JbmRleGVzKTtcbiAgfVxufVxuIl19
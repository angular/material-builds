/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a MDC-based mat-button in tests. */
export class MatButtonHarness extends ContentContainerComponentHarness {
    // TODO(jelbourn) use a single class, like `.mat-button-base`
    static { this.hostSelector = `[mat-button], [mat-raised-button], [mat-flat-button],
                         [mat-icon-button], [mat-stroked-button], [mat-fab], [mat-mini-fab]`; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a button with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a button whose host element matches the given selector.
     *   - `text` finds a button with specific text content.
     *   - `variant` finds buttons matching a specific variant.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('variant', options.variant, (harness, variant) => HarnessPredicate.stringMatches(harness.getVariant(), variant))
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
    async click(...args) {
        return (await this.host()).click(...args);
    }
    /** Gets a boolean promise indicating if the button is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Gets a promise for the button's label text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Focuses the button and returns a void promise that indicates when the action is complete. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the button and returns a void promise that indicates when the action is complete. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the button is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Gets the variant of the button. */
    async getVariant() {
        const host = await this.host();
        if ((await host.getAttribute('mat-raised-button')) != null) {
            return 'raised';
        }
        else if ((await host.getAttribute('mat-flat-button')) != null) {
            return 'flat';
        }
        else if ((await host.getAttribute('mat-icon-button')) != null) {
            return 'icon';
        }
        else if ((await host.getAttribute('mat-stroked-button')) != null) {
            return 'stroked';
        }
        else if ((await host.getAttribute('mat-fab')) != null) {
            return 'fab';
        }
        else if ((await host.getAttribute('mat-mini-fab')) != null) {
            return 'mini-fab';
        }
        return 'basic';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL3Rlc3RpbmcvYnV0dG9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RCxvRUFBb0U7QUFDcEUsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdDQUFnQztJQUNwRSw2REFBNkQ7YUFDdEQsaUJBQVksR0FBRzs0RkFDb0UsQ0FBQztJQUUzRjs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FFVCxVQUFnQyxFQUFFO1FBRWxDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3ZDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNqRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUN4RDthQUNBLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUMxRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUM5RDthQUNBLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ25FLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFZRCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBd0M7UUFDckQsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUksSUFBVyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxrREFBa0Q7SUFDbEQsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsZ0dBQWdHO0lBQ2hHLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELDhGQUE4RjtJQUM5RixLQUFLLENBQUMsSUFBSTtRQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQzFELE9BQU8sUUFBUSxDQUFDO1NBQ2pCO2FBQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQy9ELE9BQU8sTUFBTSxDQUFDO1NBQ2Y7YUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDL0QsT0FBTyxNQUFNLENBQUM7U0FDZjthQUFNLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNsRSxPQUFPLFNBQVMsQ0FBQztTQUNsQjthQUFNLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDdkQsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDNUQsT0FBTyxVQUFVLENBQUM7U0FDbkI7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtCdXR0b25IYXJuZXNzRmlsdGVycywgQnV0dG9uVmFyaWFudH0gZnJvbSAnLi9idXR0b24taGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBNREMtYmFzZWQgbWF0LWJ1dHRvbiBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25IYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3Mge1xuICAvLyBUT0RPKGplbGJvdXJuKSB1c2UgYSBzaW5nbGUgY2xhc3MsIGxpa2UgYC5tYXQtYnV0dG9uLWJhc2VgXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSBgW21hdC1idXR0b25dLCBbbWF0LXJhaXNlZC1idXR0b25dLCBbbWF0LWZsYXQtYnV0dG9uXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBbbWF0LWljb24tYnV0dG9uXSwgW21hdC1zdHJva2VkLWJ1dHRvbl0sIFttYXQtZmFiXSwgW21hdC1taW5pLWZhYl1gO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGJ1dHRvbiB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIGJ1dHRvbiB3aG9zZSBob3N0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqICAgLSBgdGV4dGAgZmluZHMgYSBidXR0b24gd2l0aCBzcGVjaWZpYyB0ZXh0IGNvbnRlbnQuXG4gICAqICAgLSBgdmFyaWFudGAgZmluZHMgYnV0dG9ucyBtYXRjaGluZyBhIHNwZWNpZmljIHZhcmlhbnQuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGg8VCBleHRlbmRzIE1hdEJ1dHRvbkhhcm5lc3M+KFxuICAgIHRoaXM6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgICBvcHRpb25zOiBCdXR0b25IYXJuZXNzRmlsdGVycyA9IHt9LFxuICApOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodGhpcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsIChoYXJuZXNzLCB0ZXh0KSA9PlxuICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpLFxuICAgICAgKVxuICAgICAgLmFkZE9wdGlvbigndmFyaWFudCcsIG9wdGlvbnMudmFyaWFudCwgKGhhcm5lc3MsIHZhcmlhbnQpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFZhcmlhbnQoKSwgdmFyaWFudCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCdkaXNhYmxlZCcsIG9wdGlvbnMuZGlzYWJsZWQsIGFzeW5jIChoYXJuZXNzLCBkaXNhYmxlZCkgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuaXNEaXNhYmxlZCgpKSA9PT0gZGlzYWJsZWQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGlja3MgdGhlIGJ1dHRvbiBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gcmVsYXRpdmUgdG8gaXRzIHRvcC1sZWZ0LlxuICAgKiBAcGFyYW0gcmVsYXRpdmVYIFRoZSByZWxhdGl2ZSB4IHBvc2l0aW9uIG9mIHRoZSBjbGljay5cbiAgICogQHBhcmFtIHJlbGF0aXZlWSBUaGUgcmVsYXRpdmUgeSBwb3NpdGlvbiBvZiB0aGUgY2xpY2suXG4gICAqL1xuICBjbGljayhyZWxhdGl2ZVg6IG51bWJlciwgcmVsYXRpdmVZOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQ2xpY2tzIHRoZSBidXR0b24gYXQgaXRzIGNlbnRlci4gKi9cbiAgY2xpY2sobG9jYXRpb246ICdjZW50ZXInKTogUHJvbWlzZTx2b2lkPjtcbiAgLyoqIENsaWNrcyB0aGUgYnV0dG9uLiAqL1xuICBjbGljaygpOiBQcm9taXNlPHZvaWQ+O1xuICBhc3luYyBjbGljayguLi5hcmdzOiBbXSB8IFsnY2VudGVyJ10gfCBbbnVtYmVyLCBudW1iZXJdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soLi4uKGFyZ3MgYXMgW10pKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIGJ1dHRvbiBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBidXR0b24gYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBidXR0b24gYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBidXR0b24gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhcmlhbnQgb2YgdGhlIGJ1dHRvbi4gKi9cbiAgYXN5bmMgZ2V0VmFyaWFudCgpOiBQcm9taXNlPEJ1dHRvblZhcmlhbnQ+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtcmFpc2VkLWJ1dHRvbicpKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gJ3JhaXNlZCc7XG4gICAgfSBlbHNlIGlmICgoYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1mbGF0LWJ1dHRvbicpKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gJ2ZsYXQnO1xuICAgIH0gZWxzZSBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtaWNvbi1idXR0b24nKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdpY29uJztcbiAgICB9IGVsc2UgaWYgKChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnbWF0LXN0cm9rZWQtYnV0dG9uJykpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiAnc3Ryb2tlZCc7XG4gICAgfSBlbHNlIGlmICgoYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1mYWInKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdmYWInO1xuICAgIH0gZWxzZSBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtbWluaS1mYWInKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdtaW5pLWZhYic7XG4gICAgfVxuXG4gICAgcmV0dXJuICdiYXNpYyc7XG4gIH1cbn1cbiJdfQ==
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
// TODO(jelbourn) use a single class, like `.mat-button-base`
MatButtonHarness.hostSelector = `[mat-button], [mat-raised-button], [mat-flat-button],
                         [mat-icon-button], [mat-stroked-button], [mat-fab], [mat-mini-fab]`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL3Rlc3RpbmcvYnV0dG9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RCxvRUFBb0U7QUFDcEUsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdDQUFnQztJQUtwRTs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FFVCxVQUFnQyxFQUFFO1FBRWxDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3ZDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNqRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUN4RDthQUNBLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUMxRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUM5RDthQUNBLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ25FLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFZRCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBd0M7UUFDckQsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUksSUFBVyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxrREFBa0Q7SUFDbEQsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsZ0dBQWdHO0lBQ2hHLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELDhGQUE4RjtJQUM5RixLQUFLLENBQUMsSUFBSTtRQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQzFELE9BQU8sUUFBUSxDQUFDO1NBQ2pCO2FBQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQy9ELE9BQU8sTUFBTSxDQUFDO1NBQ2Y7YUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDL0QsT0FBTyxNQUFNLENBQUM7U0FDZjthQUFNLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNsRSxPQUFPLFNBQVMsQ0FBQztTQUNsQjthQUFNLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDdkQsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDNUQsT0FBTyxVQUFVLENBQUM7U0FDbkI7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDOztBQXZGRCw2REFBNkQ7QUFDdEQsNkJBQVksR0FBRzs0RkFDb0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLFxuICBIYXJuZXNzUHJlZGljYXRlLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7QnV0dG9uSGFybmVzc0ZpbHRlcnMsIEJ1dHRvblZhcmlhbnR9IGZyb20gJy4vYnV0dG9uLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgTURDLWJhc2VkIG1hdC1idXR0b24gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uSGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzIHtcbiAgLy8gVE9ETyhqZWxib3VybikgdXNlIGEgc2luZ2xlIGNsYXNzLCBsaWtlIGAubWF0LWJ1dHRvbi1iYXNlYFxuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gYFttYXQtYnV0dG9uXSwgW21hdC1yYWlzZWQtYnV0dG9uXSwgW21hdC1mbGF0LWJ1dHRvbl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgW21hdC1pY29uLWJ1dHRvbl0sIFttYXQtc3Ryb2tlZC1idXR0b25dLCBbbWF0LWZhYl0sIFttYXQtbWluaS1mYWJdYDtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBidXR0b24gd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBidXR0b24gd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYHRleHRgIGZpbmRzIGEgYnV0dG9uIHdpdGggc3BlY2lmaWMgdGV4dCBjb250ZW50LlxuICAgKiAgIC0gYHZhcmlhbnRgIGZpbmRzIGJ1dHRvbnMgbWF0Y2hpbmcgYSBzcGVjaWZpYyB2YXJpYW50LlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoPFQgZXh0ZW5kcyBNYXRCdXR0b25IYXJuZXNzPihcbiAgICB0aGlzOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gICAgb3B0aW9uczogQnV0dG9uSGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHRoaXMsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LCAoaGFybmVzcywgdGV4dCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ3ZhcmlhbnQnLCBvcHRpb25zLnZhcmlhbnQsIChoYXJuZXNzLCB2YXJpYW50KSA9PlxuICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRWYXJpYW50KCksIHZhcmlhbnQpLFxuICAgICAgKVxuICAgICAgLmFkZE9wdGlvbignZGlzYWJsZWQnLCBvcHRpb25zLmRpc2FibGVkLCBhc3luYyAoaGFybmVzcywgZGlzYWJsZWQpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2tzIHRoZSBidXR0b24gYXQgdGhlIGdpdmVuIHBvc2l0aW9uIHJlbGF0aXZlIHRvIGl0cyB0b3AtbGVmdC5cbiAgICogQHBhcmFtIHJlbGF0aXZlWCBUaGUgcmVsYXRpdmUgeCBwb3NpdGlvbiBvZiB0aGUgY2xpY2suXG4gICAqIEBwYXJhbSByZWxhdGl2ZVkgVGhlIHJlbGF0aXZlIHkgcG9zaXRpb24gb2YgdGhlIGNsaWNrLlxuICAgKi9cbiAgY2xpY2socmVsYXRpdmVYOiBudW1iZXIsIHJlbGF0aXZlWTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPjtcbiAgLyoqIENsaWNrcyB0aGUgYnV0dG9uIGF0IGl0cyBjZW50ZXIuICovXG4gIGNsaWNrKGxvY2F0aW9uOiAnY2VudGVyJyk6IFByb21pc2U8dm9pZD47XG4gIC8qKiBDbGlja3MgdGhlIGJ1dHRvbi4gKi9cbiAgY2xpY2soKTogUHJvbWlzZTx2b2lkPjtcbiAgYXN5bmMgY2xpY2soLi4uYXJnczogW10gfCBbJ2NlbnRlciddIHwgW251bWJlciwgbnVtYmVyXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKC4uLihhcmdzIGFzIFtdKSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIGJ1dHRvbidzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYnV0dG9uIGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgYnV0dG9uIGFuZCByZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYnV0dG9uIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YXJpYW50IG9mIHRoZSBidXR0b24uICovXG4gIGFzeW5jIGdldFZhcmlhbnQoKTogUHJvbWlzZTxCdXR0b25WYXJpYW50PiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuXG4gICAgaWYgKChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnbWF0LXJhaXNlZC1idXR0b24nKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdyYWlzZWQnO1xuICAgIH0gZWxzZSBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtZmxhdC1idXR0b24nKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdmbGF0JztcbiAgICB9IGVsc2UgaWYgKChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnbWF0LWljb24tYnV0dG9uJykpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiAnaWNvbic7XG4gICAgfSBlbHNlIGlmICgoYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1zdHJva2VkLWJ1dHRvbicpKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gJ3N0cm9rZWQnO1xuICAgIH0gZWxzZSBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtZmFiJykpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiAnZmFiJztcbiAgICB9IGVsc2UgaWYgKChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnbWF0LW1pbmktZmFiJykpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiAnbWluaS1mYWInO1xuICAgIH1cblxuICAgIHJldHVybiAnYmFzaWMnO1xuICB9XG59XG4iXX0=
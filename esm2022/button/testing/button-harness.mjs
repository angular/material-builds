/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { booleanAttribute } from '@angular/core';
import { ContentContainerComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
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
        return booleanAttribute(await disabled);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL3Rlc3RpbmcvYnV0dG9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFFTCxnQ0FBZ0MsRUFDaEMsZ0JBQWdCLEdBQ2pCLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsb0VBQW9FO0FBQ3BFLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxnQ0FBZ0M7SUFDcEUsNkRBQTZEO2FBQ3RELGlCQUFZLEdBQUc7NEZBQ29FLENBQUM7SUFFM0Y7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBZ0MsRUFBRTtRQUVsQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUN2QyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDakQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDeEQ7YUFDQSxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FDMUQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FDOUQ7YUFDQSxTQUFTLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUNuRSxPQUFPLENBQUMsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxRQUFRLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBWUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQXdDO1FBQ3JELE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFJLElBQVcsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxtRUFBbUU7SUFDbkUsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlELE9BQU8sZ0JBQWdCLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsa0RBQWtEO0lBQ2xELEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELGdHQUFnRztJQUNoRyxLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCw4RkFBOEY7SUFDOUYsS0FBSyxDQUFDLElBQUk7UUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxLQUFLLENBQUMsVUFBVTtRQUNkLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzNELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7YUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNoRSxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO2FBQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDaEUsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQzthQUFNLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ25FLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7YUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDeEQsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO2FBQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzdELE9BQU8sVUFBVSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Ym9vbGVhbkF0dHJpYnV0ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLFxuICBIYXJuZXNzUHJlZGljYXRlLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0J1dHRvbkhhcm5lc3NGaWx0ZXJzLCBCdXR0b25WYXJpYW50fSBmcm9tICcuL2J1dHRvbi1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIE1EQy1iYXNlZCBtYXQtYnV0dG9uIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvbkhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyB7XG4gIC8vIFRPRE8oamVsYm91cm4pIHVzZSBhIHNpbmdsZSBjbGFzcywgbGlrZSBgLm1hdC1idXR0b24tYmFzZWBcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9IGBbbWF0LWJ1dHRvbl0sIFttYXQtcmFpc2VkLWJ1dHRvbl0sIFttYXQtZmxhdC1idXR0b25dLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFttYXQtaWNvbi1idXR0b25dLCBbbWF0LXN0cm9rZWQtYnV0dG9uXSwgW21hdC1mYWJdLCBbbWF0LW1pbmktZmFiXWA7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYnV0dG9uIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2g6XG4gICAqICAgLSBgc2VsZWN0b3JgIGZpbmRzIGEgYnV0dG9uIHdob3NlIGhvc3QgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci5cbiAgICogICAtIGB0ZXh0YCBmaW5kcyBhIGJ1dHRvbiB3aXRoIHNwZWNpZmljIHRleHQgY29udGVudC5cbiAgICogICAtIGB2YXJpYW50YCBmaW5kcyBidXR0b25zIG1hdGNoaW5nIGEgc3BlY2lmaWMgdmFyaWFudC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aDxUIGV4dGVuZHMgTWF0QnV0dG9uSGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IEJ1dHRvbkhhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8VD4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZSh0aGlzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCwgKGhhcm5lc3MsIHRleHQpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCd2YXJpYW50Jywgb3B0aW9ucy52YXJpYW50LCAoaGFybmVzcywgdmFyaWFudCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VmFyaWFudCgpLCB2YXJpYW50KSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ2Rpc2FibGVkJywgb3B0aW9ucy5kaXNhYmxlZCwgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09PSBkaXNhYmxlZDtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrcyB0aGUgYnV0dG9uIGF0IHRoZSBnaXZlbiBwb3NpdGlvbiByZWxhdGl2ZSB0byBpdHMgdG9wLWxlZnQuXG4gICAqIEBwYXJhbSByZWxhdGl2ZVggVGhlIHJlbGF0aXZlIHggcG9zaXRpb24gb2YgdGhlIGNsaWNrLlxuICAgKiBAcGFyYW0gcmVsYXRpdmVZIFRoZSByZWxhdGl2ZSB5IHBvc2l0aW9uIG9mIHRoZSBjbGljay5cbiAgICovXG4gIGNsaWNrKHJlbGF0aXZlWDogbnVtYmVyLCByZWxhdGl2ZVk6IG51bWJlcik6IFByb21pc2U8dm9pZD47XG4gIC8qKiBDbGlja3MgdGhlIGJ1dHRvbiBhdCBpdHMgY2VudGVyLiAqL1xuICBjbGljayhsb2NhdGlvbjogJ2NlbnRlcicpOiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQ2xpY2tzIHRoZSBidXR0b24uICovXG4gIGNsaWNrKCk6IFByb21pc2U8dm9pZD47XG4gIGFzeW5jIGNsaWNrKC4uLmFyZ3M6IFtdIHwgWydjZW50ZXInXSB8IFtudW1iZXIsIG51bWJlcl0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljayguLi4oYXJncyBhcyBbXSkpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGJvb2xlYW5BdHRyaWJ1dGUoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBidXR0b24gYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBidXR0b24gYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBidXR0b24gaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmlzRm9jdXNlZCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhcmlhbnQgb2YgdGhlIGJ1dHRvbi4gKi9cbiAgYXN5bmMgZ2V0VmFyaWFudCgpOiBQcm9taXNlPEJ1dHRvblZhcmlhbnQ+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtcmFpc2VkLWJ1dHRvbicpKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gJ3JhaXNlZCc7XG4gICAgfSBlbHNlIGlmICgoYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1mbGF0LWJ1dHRvbicpKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gJ2ZsYXQnO1xuICAgIH0gZWxzZSBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtaWNvbi1idXR0b24nKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdpY29uJztcbiAgICB9IGVsc2UgaWYgKChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnbWF0LXN0cm9rZWQtYnV0dG9uJykpICE9IG51bGwpIHtcbiAgICAgIHJldHVybiAnc3Ryb2tlZCc7XG4gICAgfSBlbHNlIGlmICgoYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ21hdC1mYWInKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdmYWInO1xuICAgIH0gZWxzZSBpZiAoKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdtYXQtbWluaS1mYWInKSkgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuICdtaW5pLWZhYic7XG4gICAgfVxuXG4gICAgcmV0dXJuICdiYXNpYyc7XG4gIH1cbn1cbiJdfQ==
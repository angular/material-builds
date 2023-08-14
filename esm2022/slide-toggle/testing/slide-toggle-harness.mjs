/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a mat-slide-toggle in tests. */
export class MatSlideToggleHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('label');
        this._nativeElement = this.locatorFor('button');
    }
    static { this.hostSelector = '.mat-mdc-slide-toggle'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a slide-toggle w/ specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a slide-toggle whose host element matches the given selector.
     *   - `label` finds a slide-toggle with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return (new HarnessPredicate(this, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            // We want to provide a filter option for "name" because the name of the slide-toggle is
            // only set on the underlying input. This means that it's not possible for developers
            // to retrieve the harness of a specific checkbox with name through a CSS selector.
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) == disabled));
    }
    /** Toggle the checked state of the slide-toggle. */
    async toggle() {
        return (await this._nativeElement()).click();
    }
    /** Whether the slide-toggle is checked. */
    async isChecked() {
        const checked = (await this._nativeElement()).getAttribute('aria-checked');
        return coerceBooleanProperty(await checked);
    }
    /** Whether the slide-toggle is disabled. */
    async isDisabled() {
        const disabled = (await this._nativeElement()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Whether the slide-toggle is required. */
    async isRequired() {
        const ariaRequired = await (await this._nativeElement()).getAttribute('aria-required');
        return ariaRequired === 'true';
    }
    /** Whether the slide-toggle is valid. */
    async isValid() {
        const invalid = (await this.host()).hasClass('ng-invalid');
        return !(await invalid);
    }
    /** Gets the slide-toggle's name. */
    async getName() {
        return (await this._nativeElement()).getAttribute('name');
    }
    /** Gets the slide-toggle's aria-label. */
    async getAriaLabel() {
        return (await this._nativeElement()).getAttribute('aria-label');
    }
    /** Gets the slide-toggle's aria-labelledby. */
    async getAriaLabelledby() {
        return (await this._nativeElement()).getAttribute('aria-labelledby');
    }
    /** Gets the slide-toggle's label text. */
    async getLabelText() {
        return (await this._label()).text();
    }
    /** Focuses the slide-toggle. */
    async focus() {
        return (await this._nativeElement()).focus();
    }
    /** Blurs the slide-toggle. */
    async blur() {
        return (await this._nativeElement()).blur();
    }
    /** Whether the slide-toggle is focused. */
    async isFocused() {
        return (await this._nativeElement()).isFocused();
    }
    /**
     * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    async check() {
        if (!(await this.isChecked())) {
            await this.toggle();
        }
    }
    /**
     * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    async uncheck() {
        if (await this.isChecked()) {
            await this.toggle();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGUtdG9nZ2xlL3Rlc3Rpbmcvc2xpZGUtdG9nZ2xlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUVoQixnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc1RCxnRUFBZ0U7QUFDaEUsTUFBTSxPQUFPLHFCQUFzQixTQUFRLGdCQUFnQjtJQUEzRDs7UUFDVSxXQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxtQkFBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUEySDdDLENBQUM7YUExSFEsaUJBQVksR0FBRyx1QkFBdUIsQUFBMUIsQ0FBMkI7SUFFOUM7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FFVCxVQUFxQyxFQUFFO1FBRXZDLE9BQU8sQ0FDTCxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7YUFDaEMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQzlEO1lBQ0Qsd0ZBQXdGO1lBQ3hGLHFGQUFxRjtZQUNyRixtRkFBbUY7YUFDbEYsU0FBUyxDQUNSLE1BQU0sRUFDTixPQUFPLENBQUMsSUFBSSxFQUNaLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLE9BQU8s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RUQsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRTtZQUM3QixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsT0FBTztRQUNYLElBQUksTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1NsaWRlVG9nZ2xlSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc2xpZGUtdG9nZ2xlLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbWF0LXNsaWRlLXRvZ2dsZSBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbGlkZVRvZ2dsZUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJpdmF0ZSBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJ2xhYmVsJyk7XG4gIF9uYXRpdmVFbGVtZW50ID0gdGhpcy5sb2NhdG9yRm9yKCdidXR0b24nKTtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1kYy1zbGlkZS10b2dnbGUnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHNsaWRlLXRvZ2dsZSB3LyBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBzbGlkZS10b2dnbGUgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGxhYmVsYCBmaW5kcyBhIHNsaWRlLXRvZ2dsZSB3aXRoIHNwZWNpZmljIGxhYmVsIHRleHQuXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGg8VCBleHRlbmRzIE1hdFNsaWRlVG9nZ2xlSGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IFNsaWRlVG9nZ2xlSGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG5ldyBIYXJuZXNzUHJlZGljYXRlKHRoaXMsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCwgKGhhcm5lc3MsIGxhYmVsKSA9PlxuICAgICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldExhYmVsVGV4dCgpLCBsYWJlbCksXG4gICAgICAgIClcbiAgICAgICAgLy8gV2Ugd2FudCB0byBwcm92aWRlIGEgZmlsdGVyIG9wdGlvbiBmb3IgXCJuYW1lXCIgYmVjYXVzZSB0aGUgbmFtZSBvZiB0aGUgc2xpZGUtdG9nZ2xlIGlzXG4gICAgICAgIC8vIG9ubHkgc2V0IG9uIHRoZSB1bmRlcmx5aW5nIGlucHV0LiBUaGlzIG1lYW5zIHRoYXQgaXQncyBub3QgcG9zc2libGUgZm9yIGRldmVsb3BlcnNcbiAgICAgICAgLy8gdG8gcmV0cmlldmUgdGhlIGhhcm5lc3Mgb2YgYSBzcGVjaWZpYyBjaGVja2JveCB3aXRoIG5hbWUgdGhyb3VnaCBhIENTUyBzZWxlY3Rvci5cbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAnbmFtZScsXG4gICAgICAgICAgb3B0aW9ucy5uYW1lLFxuICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBuYW1lKSA9PiAoYXdhaXQgaGFybmVzcy5nZXROYW1lKCkpID09PSBuYW1lLFxuICAgICAgICApXG4gICAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICAgJ2NoZWNrZWQnLFxuICAgICAgICAgIG9wdGlvbnMuY2hlY2tlZCxcbiAgICAgICAgICBhc3luYyAoaGFybmVzcywgY2hlY2tlZCkgPT4gKGF3YWl0IGhhcm5lc3MuaXNDaGVja2VkKCkpID09IGNoZWNrZWQsXG4gICAgICAgIClcbiAgICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAgIG9wdGlvbnMuZGlzYWJsZWQsXG4gICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09IGRpc2FibGVkLFxuICAgICAgICApXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIHNsaWRlLXRvZ2dsZS4gKi9cbiAgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbmF0aXZlRWxlbWVudCgpKS5jbGljaygpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlLXRvZ2dsZSBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9uYXRpdmVFbGVtZW50KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBjaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZS10b2dnbGUgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5fbmF0aXZlRWxlbWVudCgpKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGUtdG9nZ2xlIGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGFyaWFSZXF1aXJlZCA9IGF3YWl0IChhd2FpdCB0aGlzLl9uYXRpdmVFbGVtZW50KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1yZXF1aXJlZCcpO1xuICAgIHJldHVybiBhcmlhUmVxdWlyZWQgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZS10b2dnbGUgaXMgdmFsaWQuICovXG4gIGFzeW5jIGlzVmFsaWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaW52YWxpZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ25nLWludmFsaWQnKTtcbiAgICByZXR1cm4gIShhd2FpdCBpbnZhbGlkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzbGlkZS10b2dnbGUncyBuYW1lLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbmF0aXZlRWxlbWVudCgpKS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzbGlkZS10b2dnbGUncyBhcmlhLWxhYmVsLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWwoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9uYXRpdmVFbGVtZW50KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNsaWRlLXRvZ2dsZSdzIGFyaWEtbGFiZWxsZWRieS4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsbGVkYnkoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9uYXRpdmVFbGVtZW50KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2xpZGUtdG9nZ2xlJ3MgbGFiZWwgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWxUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9sYWJlbCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2xpZGUtdG9nZ2xlLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX25hdGl2ZUVsZW1lbnQoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgc2xpZGUtdG9nZ2xlLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbmF0aXZlRWxlbWVudCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGUtdG9nZ2xlIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX25hdGl2ZUVsZW1lbnQoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgc2xpZGUtdG9nZ2xlIGluIGEgY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgdW5jaGVja2VkLCBvciBkb2luZ1xuICAgKiBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBzbGlkZS10b2dnbGUgaW4gYW4gdW5jaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSBjaGVja2VkLCBvciBkb2luZ1xuICAgKiBub3RoaW5nIGlmIGl0IGlzIGFscmVhZHkgdW5jaGVja2VkLlxuICAgKi9cbiAgYXN5bmMgdW5jaGVjaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
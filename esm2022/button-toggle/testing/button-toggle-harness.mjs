/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard mat-button-toggle in tests. */
export class MatButtonToggleHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('.mat-button-toggle-label-content');
        this._button = this.locatorFor('.mat-button-toggle-button');
    }
    /** The selector for the host element of a `MatButton` instance. */
    static { this.hostSelector = '.mat-button-toggle'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatButtonToggleHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name))
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) === checked)
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
    /** Gets a boolean promise indicating if the button toggle is checked. */
    async isChecked() {
        const button = await this._button();
        const [checked, pressed] = await parallel(() => [
            button.getAttribute('aria-checked'),
            button.getAttribute('aria-pressed'),
        ]);
        return coerceBooleanProperty(checked) || coerceBooleanProperty(pressed);
    }
    /** Gets a boolean promise indicating if the button toggle is disabled. */
    async isDisabled() {
        const disabled = (await this._button()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Gets a promise for the button toggle's name. */
    async getName() {
        return (await this._button()).getAttribute('name');
    }
    /** Gets a promise for the button toggle's aria-label. */
    async getAriaLabel() {
        return (await this._button()).getAttribute('aria-label');
    }
    /** Gets a promise for the button toggles's aria-labelledby. */
    async getAriaLabelledby() {
        return (await this._button()).getAttribute('aria-labelledby');
    }
    /** Gets a promise for the button toggle's text. */
    async getText() {
        return (await this._label()).text();
    }
    /** Gets the appearance that the button toggle is using. */
    async getAppearance() {
        const host = await this.host();
        const className = 'mat-button-toggle-appearance-standard';
        return (await host.hasClass(className)) ? 'standard' : 'legacy';
    }
    /** Focuses the toggle. */
    async focus() {
        return (await this._button()).focus();
    }
    /** Blurs the toggle. */
    async blur() {
        return (await this._button()).blur();
    }
    /** Whether the toggle is focused. */
    async isFocused() {
        return (await this._button()).isFocused();
    }
    /** Toggle the checked state of the buttons toggle. */
    async toggle() {
        return (await this._button()).click();
    }
    /**
     * Puts the button toggle in a checked state by toggling it if it's
     * currently unchecked, or doing nothing if it is already checked.
     */
    async check() {
        if (!(await this.isChecked())) {
            await this.toggle();
        }
    }
    /**
     * Puts the button toggle in an unchecked state by toggling it if it's
     * currently checked, or doing nothing if it's already unchecked.
     */
    async uncheck() {
        if (await this.isChecked()) {
            await this.toggle();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi10b2dnbGUvdGVzdGluZy9idXR0b24tdG9nZ2xlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSTVELDBFQUEwRTtBQUMxRSxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsZ0JBQWdCO0lBQTVEOztRQUlVLFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDN0QsWUFBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQTRHakUsQ0FBQztJQWhIQyxtRUFBbUU7YUFDNUQsaUJBQVksR0FBRyxvQkFBb0IsQUFBdkIsQ0FBd0I7SUFLM0M7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXNDLEVBQUU7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQzthQUN6RCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDakQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDeEQ7YUFDQSxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDakQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFB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TyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsc0RBQXNEO0lBQ3RELEtBQUssQ0FBQyxNQUFNO1FBQ1YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzlCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLE9BQU87UUFDWCxJQUFJLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7WUFDM0IsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbi10b2dnbGUnO1xuaW1wb3J0IHtCdXR0b25Ub2dnbGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9idXR0b24tdG9nZ2xlLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWJ1dHRvbi10b2dnbGUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlSGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdEJ1dHRvbmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1idXR0b24tdG9nZ2xlJztcblxuICBwcml2YXRlIF9sYWJlbCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1idXR0b24tdG9nZ2xlLWxhYmVsLWNvbnRlbnQnKTtcbiAgcHJpdmF0ZSBfYnV0dG9uID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LWJ1dHRvbi10b2dnbGUtYnV0dG9uJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdEJ1dHRvblRvZ2dsZUhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGJ1dHRvbiB0b2dnbGUgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogQnV0dG9uVG9nZ2xlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0QnV0dG9uVG9nZ2xlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRCdXR0b25Ub2dnbGVIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCwgKGhhcm5lc3MsIHRleHQpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLCAoaGFybmVzcywgbmFtZSkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TmFtZSgpLCBuYW1lKSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICdjaGVja2VkJyxcbiAgICAgICAgb3B0aW9ucy5jaGVja2VkLFxuICAgICAgICBhc3luYyAoaGFybmVzcywgY2hlY2tlZCkgPT4gKGF3YWl0IGhhcm5lc3MuaXNDaGVja2VkKCkpID09PSBjaGVja2VkLFxuICAgICAgKVxuICAgICAgLmFkZE9wdGlvbignZGlzYWJsZWQnLCBvcHRpb25zLmRpc2FibGVkLCBhc3luYyAoaGFybmVzcywgZGlzYWJsZWQpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBidXR0b24gdG9nZ2xlIGlzIGNoZWNrZWQuICovXG4gIGFzeW5jIGlzQ2hlY2tlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBidXR0b24gPSBhd2FpdCB0aGlzLl9idXR0b24oKTtcbiAgICBjb25zdCBbY2hlY2tlZCwgcHJlc3NlZF0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICBidXR0b24uZ2V0QXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKSxcbiAgICAgIGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcpLFxuICAgIF0pO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoY2hlY2tlZCkgfHwgY29lcmNlQm9vbGVhblByb3BlcnR5KHByZXNzZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgYnV0dG9uIHRvZ2dsZSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLl9idXR0b24oKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uIHRvZ2dsZSdzIG5hbWUuICovXG4gIGFzeW5jIGdldE5hbWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBidXR0b24gdG9nZ2xlJ3MgYXJpYS1sYWJlbC4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgYnV0dG9uIHRvZ2dsZXMncyBhcmlhLWxhYmVsbGVkYnkuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBidXR0b24gdG9nZ2xlJ3MgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFwcGVhcmFuY2UgdGhhdCB0aGUgYnV0dG9uIHRvZ2dsZSBpcyB1c2luZy4gKi9cbiAgYXN5bmMgZ2V0QXBwZWFyYW5jZSgpOiBQcm9taXNlPE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2U+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gJ21hdC1idXR0b24tdG9nZ2xlLWFwcGVhcmFuY2Utc3RhbmRhcmQnO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdC5oYXNDbGFzcyhjbGFzc05hbWUpKSA/ICdzdGFuZGFyZCcgOiAnbGVnYWN5JztcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSB0b2dnbGUuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYnV0dG9uKCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHRvZ2dsZS4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2J1dHRvbigpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdG9nZ2xlIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2J1dHRvbigpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIGJ1dHRvbnMgdG9nZ2xlLiAqL1xuICBhc3luYyB0b2dnbGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9idXR0b24oKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBidXR0b24gdG9nZ2xlIGluIGEgY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCdzXG4gICAqIGN1cnJlbnRseSB1bmNoZWNrZWQsIG9yIGRvaW5nIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSBjaGVja2VkLlxuICAgKi9cbiAgYXN5bmMgY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0NoZWNrZWQoKSkpIHtcbiAgICAgIGF3YWl0IHRoaXMudG9nZ2xlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIGJ1dHRvbiB0b2dnbGUgaW4gYW4gdW5jaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0J3NcbiAgICogY3VycmVudGx5IGNoZWNrZWQsIG9yIGRvaW5nIG5vdGhpbmcgaWYgaXQncyBhbHJlYWR5IHVuY2hlY2tlZC5cbiAgICovXG4gIGFzeW5jIHVuY2hlY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNDaGVja2VkKCkpIHtcbiAgICAgIGF3YWl0IHRoaXMudG9nZ2xlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=
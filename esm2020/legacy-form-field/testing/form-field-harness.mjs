/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatDatepickerInputHarness, MatDateRangeInputHarness, } from '@angular/material/datepicker/testing';
import { _MatFormFieldHarnessBase, } from '@angular/material/form-field/testing';
import { MatLegacyInputHarness } from '@angular/material/legacy-input/testing';
import { MatLegacySelectHarness } from '@angular/material/legacy-select/testing';
/**
 * Harness for interacting with a standard Material form-field's in tests.
 * @deprecated Use `MatFormFieldHarness` from `@angular/material/form-field/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyFormFieldHarness extends _MatFormFieldHarnessBase {
    constructor() {
        super(...arguments);
        this._prefixContainer = this.locatorForOptional('.mat-form-field-prefix');
        this._suffixContainer = this.locatorForOptional('.mat-form-field-suffix');
        this._label = this.locatorForOptional('.mat-form-field-label');
        this._errors = this.locatorForAll('.mat-error');
        this._hints = this.locatorForAll('mat-hint, .mat-hint');
        this._inputControl = this.locatorForOptional(MatLegacyInputHarness);
        this._selectControl = this.locatorForOptional(MatLegacySelectHarness);
        this._datepickerInputControl = this.locatorForOptional(MatDatepickerInputHarness);
        this._dateRangeInputControl = this.locatorForOptional(MatDateRangeInputHarness);
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatFormFieldHarness` that meets
     * certain criteria.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatLegacyFormFieldHarness, options)
            .addOption('floatingLabelText', options.floatingLabelText, async (harness, text) => HarnessPredicate.stringMatches(await harness.getLabel(), text))
            .addOption('hasErrors', options.hasErrors, async (harness, hasErrors) => (await harness.hasErrors()) === hasErrors);
    }
    /** Gets the appearance of the form-field. */
    async getAppearance() {
        const hostClasses = await (await this.host()).getAttribute('class');
        if (hostClasses !== null) {
            const appearanceMatch = hostClasses.match(/mat-form-field-appearance-(legacy|standard|fill|outline)(?:$| )/);
            if (appearanceMatch) {
                return appearanceMatch[1];
            }
        }
        throw Error('Could not determine appearance of form-field.');
    }
    /** Whether the form-field has a label. */
    async hasLabel() {
        return (await this.host()).hasClass('mat-form-field-has-label');
    }
    /** Whether the label is currently floating. */
    async isLabelFloating() {
        const host = await this.host();
        const [hasLabel, shouldFloat] = await parallel(() => [
            this.hasLabel(),
            host.hasClass('mat-form-field-should-float'),
        ]);
        // If there is no label, the label conceptually can never float. The `should-float` class
        // is just always set regardless of whether the label is displayed or not.
        return hasLabel && shouldFloat;
    }
}
MatLegacyFormFieldHarness.hostSelector = '.mat-form-field';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1mb3JtLWZpZWxkL3Rlc3RpbmcvZm9ybS1maWVsZC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRSxPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLHdCQUF3QixHQUN6QixNQUFNLHNDQUFzQyxDQUFDO0FBQzlDLE9BQU8sRUFFTCx3QkFBd0IsR0FDekIsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5QyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUM3RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQztBQWMvRTs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHlCQUEwQixTQUFRLHdCQUF1RDtJQUF0Rzs7UUFxQlkscUJBQWdCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckUscUJBQWdCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckUsV0FBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzFELFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLFdBQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbkQsa0JBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUMvRCxtQkFBYyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2pFLDRCQUF1QixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzdFLDJCQUFzQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBZ0N2RixDQUFDO0lBMURDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFtQyxFQUFFO1FBQy9DLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUM7YUFDNUQsU0FBUyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQ2pGLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDL0Q7YUFDQSxTQUFTLENBQ1IsV0FBVyxFQUNYLE9BQU8sQ0FBQyxTQUFTLEVBQ2pCLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssU0FBUyxDQUN4RSxDQUFDO0lBQ04sQ0FBQztJQVlELDZDQUE2QztJQUM3QyxLQUFLLENBQUMsYUFBYTtRQUNqQixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEUsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO1lBQ3hCLE1BQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQ3ZDLGlFQUFpRSxDQUNsRSxDQUFDO1lBQ0YsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLE9BQU8sZUFBZSxDQUFDLENBQUMsQ0FBK0MsQ0FBQzthQUN6RTtTQUNGO1FBQ0QsTUFBTSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLEtBQUssQ0FBQyxRQUFRO1FBQ1osT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELCtDQUErQztJQUMvQyxLQUFLLENBQUMsZUFBZTtRQUNuQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLDZCQUE2QixDQUFDO1NBQzdDLENBQUMsQ0FBQztRQUNILHlGQUF5RjtRQUN6RiwwRUFBMEU7UUFDMUUsT0FBTyxRQUFRLElBQUksV0FBVyxDQUFDO0lBQ2pDLENBQUM7O0FBM0RNLHNDQUFZLEdBQUcsaUJBQWlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzcyxcbiAgTWF0RGF0ZVJhbmdlSW5wdXRIYXJuZXNzLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kYXRlcGlja2VyL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgRm9ybUZpZWxkSGFybmVzc0ZpbHRlcnMsXG4gIF9NYXRGb3JtRmllbGRIYXJuZXNzQmFzZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZC90ZXN0aW5nJztcbmltcG9ydCB7TWF0TGVnYWN5SW5wdXRIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9sZWdhY3ktaW5wdXQvdGVzdGluZyc7XG5pbXBvcnQge01hdExlZ2FjeVNlbGVjdEhhcm5lc3N9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1zZWxlY3QvdGVzdGluZyc7XG5cbi8vIFRPRE8oZGV2dmVyc2lvbik6IHN1cHBvcnQgc3VwcG9ydCBjaGlwIGxpc3QgaGFybmVzc1xuLyoqXG4gKiBQb3NzaWJsZSBoYXJuZXNzZXMgb2YgY29udHJvbHMgd2hpY2ggY2FuIGJlIGJvdW5kIHRvIGEgZm9ybS1maWVsZC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgRm9ybUZpZWxkQ29udHJvbEhhcm5lc3NgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQvdGVzdGluZ2AgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgdHlwZSBMZWdhY3lGb3JtRmllbGRDb250cm9sSGFybmVzcyA9XG4gIHwgTWF0TGVnYWN5SW5wdXRIYXJuZXNzXG4gIHwgTWF0TGVnYWN5U2VsZWN0SGFybmVzc1xuICB8IE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NcbiAgfCBNYXREYXRlUmFuZ2VJbnB1dEhhcm5lc3M7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIGZvcm0tZmllbGQncyBpbiB0ZXN0cy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Rm9ybUZpZWxkSGFybmVzc2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZC90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lGb3JtRmllbGRIYXJuZXNzIGV4dGVuZHMgX01hdEZvcm1GaWVsZEhhcm5lc3NCYXNlPExlZ2FjeUZvcm1GaWVsZENvbnRyb2xIYXJuZXNzPiB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1mb3JtLWZpZWxkJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Rm9ybUZpZWxkSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZm9ybSBmaWVsZCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBGb3JtRmllbGRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRMZWdhY3lGb3JtRmllbGRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdExlZ2FjeUZvcm1GaWVsZEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdmbG9hdGluZ0xhYmVsVGV4dCcsIG9wdGlvbnMuZmxvYXRpbmdMYWJlbFRleHQsIGFzeW5jIChoYXJuZXNzLCB0ZXh0KSA9PlxuICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoYXdhaXQgaGFybmVzcy5nZXRMYWJlbCgpLCB0ZXh0KSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICdoYXNFcnJvcnMnLFxuICAgICAgICBvcHRpb25zLmhhc0Vycm9ycyxcbiAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGhhc0Vycm9ycykgPT4gKGF3YWl0IGhhcm5lc3MuaGFzRXJyb3JzKCkpID09PSBoYXNFcnJvcnMsXG4gICAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcmVmaXhDb250YWluZXIgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1mb3JtLWZpZWxkLXByZWZpeCcpO1xuICBwcm90ZWN0ZWQgX3N1ZmZpeENvbnRhaW5lciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LWZvcm0tZmllbGQtc3VmZml4Jyk7XG4gIHByb3RlY3RlZCBfbGFiZWwgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1mb3JtLWZpZWxkLWxhYmVsJyk7XG4gIHByb3RlY3RlZCBfZXJyb3JzID0gdGhpcy5sb2NhdG9yRm9yQWxsKCcubWF0LWVycm9yJyk7XG4gIHByb3RlY3RlZCBfaGludHMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoJ21hdC1oaW50LCAubWF0LWhpbnQnKTtcbiAgcHJvdGVjdGVkIF9pbnB1dENvbnRyb2wgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRMZWdhY3lJbnB1dEhhcm5lc3MpO1xuICBwcm90ZWN0ZWQgX3NlbGVjdENvbnRyb2wgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXRMZWdhY3lTZWxlY3RIYXJuZXNzKTtcbiAgcHJvdGVjdGVkIF9kYXRlcGlja2VySW5wdXRDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzcyk7XG4gIHByb3RlY3RlZCBfZGF0ZVJhbmdlSW5wdXRDb250cm9sID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RGF0ZVJhbmdlSW5wdXRIYXJuZXNzKTtcblxuICAvKiogR2V0cyB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgZm9ybS1maWVsZC4gKi9cbiAgYXN5bmMgZ2V0QXBwZWFyYW5jZSgpOiBQcm9taXNlPCdsZWdhY3knIHwgJ3N0YW5kYXJkJyB8ICdmaWxsJyB8ICdvdXRsaW5lJz4ge1xuICAgIGNvbnN0IGhvc3RDbGFzc2VzID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgaWYgKGhvc3RDbGFzc2VzICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBhcHBlYXJhbmNlTWF0Y2ggPSBob3N0Q2xhc3Nlcy5tYXRjaChcbiAgICAgICAgL21hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtKGxlZ2FjeXxzdGFuZGFyZHxmaWxsfG91dGxpbmUpKD86JHwgKS8sXG4gICAgICApO1xuICAgICAgaWYgKGFwcGVhcmFuY2VNYXRjaCkge1xuICAgICAgICByZXR1cm4gYXBwZWFyYW5jZU1hdGNoWzFdIGFzICdsZWdhY3knIHwgJ3N0YW5kYXJkJyB8ICdmaWxsJyB8ICdvdXRsaW5lJztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgRXJyb3IoJ0NvdWxkIG5vdCBkZXRlcm1pbmUgYXBwZWFyYW5jZSBvZiBmb3JtLWZpZWxkLicpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZvcm0tZmllbGQgaGFzIGEgbGFiZWwuICovXG4gIGFzeW5jIGhhc0xhYmVsKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1oYXMtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBpcyBjdXJyZW50bHkgZmxvYXRpbmcuICovXG4gIGFzeW5jIGlzTGFiZWxGbG9hdGluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2hhc0xhYmVsLCBzaG91bGRGbG9hdF0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICB0aGlzLmhhc0xhYmVsKCksXG4gICAgICBob3N0Lmhhc0NsYXNzKCdtYXQtZm9ybS1maWVsZC1zaG91bGQtZmxvYXQnKSxcbiAgICBdKTtcbiAgICAvLyBJZiB0aGVyZSBpcyBubyBsYWJlbCwgdGhlIGxhYmVsIGNvbmNlcHR1YWxseSBjYW4gbmV2ZXIgZmxvYXQuIFRoZSBgc2hvdWxkLWZsb2F0YCBjbGFzc1xuICAgIC8vIGlzIGp1c3QgYWx3YXlzIHNldCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIGxhYmVsIGlzIGRpc3BsYXllZCBvciBub3QuXG4gICAgcmV0dXJuIGhhc0xhYmVsICYmIHNob3VsZEZsb2F0O1xuICB9XG59XG4iXX0=
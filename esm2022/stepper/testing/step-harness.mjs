/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material step in tests. */
export class MatStepHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatStep` instance. */
    static { this.hostSelector = '.mat-step-header'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected)
            .addOption('completed', options.completed, async (harness, completed) => (await harness.isCompleted()) === completed)
            .addOption('invalid', options.invalid, async (harness, invalid) => (await harness.hasErrors()) === invalid);
    }
    /** Gets the label of the step. */
    async getLabel() {
        return (await this.locatorFor('.mat-step-text-label')()).text();
    }
    /** Gets the `aria-label` of the step. */
    async getAriaLabel() {
        return (await this.host()).getAttribute('aria-label');
    }
    /** Gets the value of the `aria-labelledby` attribute. */
    async getAriaLabelledby() {
        return (await this.host()).getAttribute('aria-labelledby');
    }
    /** Whether the step is selected. */
    async isSelected() {
        const host = await this.host();
        return (await host.getAttribute('aria-selected')) === 'true';
    }
    /** Whether the step has been filled out. */
    async isCompleted() {
        const state = await this._getIconState();
        return state === 'done' || (state === 'edit' && !(await this.isSelected()));
    }
    /**
     * Whether the step is currently showing its error state. Note that this doesn't mean that there
     * are or aren't any invalid form controls inside the step, but that the step is showing its
     * error-specific styling which depends on there being invalid controls, as well as the
     * `ErrorStateMatcher` determining that an error should be shown and that the `showErrors`
     * option was enabled through the `STEPPER_GLOBAL_OPTIONS` injection token.
     */
    async hasErrors() {
        return (await this._getIconState()) === 'error';
    }
    /** Whether the step is optional. */
    async isOptional() {
        // If the node with the optional text is present, it means that the step is optional.
        const optionalNode = await this.locatorForOptional('.mat-step-optional')();
        return !!optionalNode;
    }
    /**
     * Selects the given step by clicking on the label. The step may not be selected
     * if the stepper doesn't allow it (e.g. if there are validation errors).
     */
    async select() {
        await (await this.host()).click();
    }
    async getRootHarnessLoader() {
        const contentId = await (await this.host()).getAttribute('aria-controls');
        return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
    }
    /**
     * Gets the state of the step. Note that we have a `StepState` which we could use to type the
     * return value, but it's basically the same as `string`, because the type has `| string`.
     */
    async _getIconState() {
        // The state is exposed on the icon with a class that looks like `mat-step-icon-state-{{state}}`
        const icon = await this.locatorFor('.mat-step-icon')();
        const classes = (await icon.getAttribute('class'));
        const match = classes.match(/mat-step-icon-state-([a-z]+)/);
        if (!match) {
            throw Error(`Could not determine step state from "${classes}".`);
        }
        return match[1];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvdGVzdGluZy9zdGVwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5Qiw4RUFBOEU7QUFDOUUsTUFBTSxPQUFPLGNBQWUsU0FBUSxnQ0FBd0M7SUFDMUUsaUVBQWlFO2FBQzFELGlCQUFZLEdBQUcsa0JBQWtCLENBQUM7SUFFekM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQThCLEVBQUU7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUM7YUFDakQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQzFEO2FBQ0EsU0FBUyxDQUNSLFVBQVUsRUFDVixPQUFPLENBQUMsUUFBUSxFQUNoQixLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FDdkU7YUFDQSxTQUFTLENBQ1IsV0FBVyxFQUNYLE9BQU8sQ0FBQyxTQUFTLEVBQ2pCLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssU0FBUyxDQUMxRTthQUNBLFNBQVMsQ0FDUixTQUFTLEVBQ1QsT0FBTyxDQUFDLE9BQU8sRUFDZixLQUFLLEVBQUUsT0FBTyxFQUFF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IENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgSGFybmVzc0xvYWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtTdGVwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc3RlcC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgc3RlcCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTdGVwSGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFN0ZXBgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc3RlcC1oZWFkZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTdGVwSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc3RlcHMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTdGVwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U3RlcEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U3RlcEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCdsYWJlbCcsIG9wdGlvbnMubGFiZWwsIChoYXJuZXNzLCBsYWJlbCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWwoKSwgbGFiZWwpLFxuICAgICAgKVxuICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgJ3NlbGVjdGVkJyxcbiAgICAgICAgb3B0aW9ucy5zZWxlY3RlZCxcbiAgICAgICAgYXN5bmMgKGhhcm5lc3MsIHNlbGVjdGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc1NlbGVjdGVkKCkpID09PSBzZWxlY3RlZCxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICdjb21wbGV0ZWQnLFxuICAgICAgICBvcHRpb25zLmNvbXBsZXRlZCxcbiAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGNvbXBsZXRlZCkgPT4gKGF3YWl0IGhhcm5lc3MuaXNDb21wbGV0ZWQoKSkgPT09IGNvbXBsZXRlZCxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICdpbnZhbGlkJyxcbiAgICAgICAgb3B0aW9ucy5pbnZhbGlkLFxuICAgICAgICBhc3luYyAoaGFybmVzcywgaW52YWxpZCkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzRXJyb3JzKCkpID09PSBpbnZhbGlkLFxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgc3RlcC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubG9jYXRvckZvcignLm1hdC1zdGVwLXRleHQtbGFiZWwnKSgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYGFyaWEtbGFiZWxgIG9mIHRoZSBzdGVwLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWwoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZS4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsbGVkYnkoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIHNlbGVjdGVkLiAqL1xuICBhc3luYyBpc1NlbGVjdGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICByZXR1cm4gKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc3RlcCBoYXMgYmVlbiBmaWxsZWQgb3V0LiAqL1xuICBhc3luYyBpc0NvbXBsZXRlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHRoaXMuX2dldEljb25TdGF0ZSgpO1xuICAgIHJldHVybiBzdGF0ZSA9PT0gJ2RvbmUnIHx8IChzdGF0ZSA9PT0gJ2VkaXQnICYmICEoYXdhaXQgdGhpcy5pc1NlbGVjdGVkKCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzdGVwIGlzIGN1cnJlbnRseSBzaG93aW5nIGl0cyBlcnJvciBzdGF0ZS4gTm90ZSB0aGF0IHRoaXMgZG9lc24ndCBtZWFuIHRoYXQgdGhlcmVcbiAgICogYXJlIG9yIGFyZW4ndCBhbnkgaW52YWxpZCBmb3JtIGNvbnRyb2xzIGluc2lkZSB0aGUgc3RlcCwgYnV0IHRoYXQgdGhlIHN0ZXAgaXMgc2hvd2luZyBpdHNcbiAgICogZXJyb3Itc3BlY2lmaWMgc3R5bGluZyB3aGljaCBkZXBlbmRzIG9uIHRoZXJlIGJlaW5nIGludmFsaWQgY29udHJvbHMsIGFzIHdlbGwgYXMgdGhlXG4gICAqIGBFcnJvclN0YXRlTWF0Y2hlcmAgZGV0ZXJtaW5pbmcgdGhhdCBhbiBlcnJvciBzaG91bGQgYmUgc2hvd24gYW5kIHRoYXQgdGhlIGBzaG93RXJyb3JzYFxuICAgKiBvcHRpb24gd2FzIGVuYWJsZWQgdGhyb3VnaCB0aGUgYFNURVBQRVJfR0xPQkFMX09QVElPTlNgIGluamVjdGlvbiB0b2tlbi5cbiAgICovXG4gIGFzeW5jIGhhc0Vycm9ycygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2dldEljb25TdGF0ZSgpKSA9PT0gJ2Vycm9yJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIG9wdGlvbmFsLiAqL1xuICBhc3luYyBpc09wdGlvbmFsKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIElmIHRoZSBub2RlIHdpdGggdGhlIG9wdGlvbmFsIHRleHQgaXMgcHJlc2VudCwgaXQgbWVhbnMgdGhhdCB0aGUgc3RlcCBpcyBvcHRpb25hbC5cbiAgICBjb25zdCBvcHRpb25hbE5vZGUgPSBhd2FpdCB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1zdGVwLW9wdGlvbmFsJykoKTtcbiAgICByZXR1cm4gISFvcHRpb25hbE5vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyB0aGUgZ2l2ZW4gc3RlcCBieSBjbGlja2luZyBvbiB0aGUgbGFiZWwuIFRoZSBzdGVwIG1heSBub3QgYmUgc2VsZWN0ZWRcbiAgICogaWYgdGhlIHN0ZXBwZXIgZG9lc24ndCBhbGxvdyBpdCAoZS5nLiBpZiB0aGVyZSBhcmUgdmFsaWRhdGlvbiBlcnJvcnMpLlxuICAgKi9cbiAgYXN5bmMgc2VsZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBhc3luYyBnZXRSb290SGFybmVzc0xvYWRlcigpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICBjb25zdCBjb250ZW50SWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCkuaGFybmVzc0xvYWRlckZvcihgIyR7Y29udGVudElkfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHN0YXRlIG9mIHRoZSBzdGVwLiBOb3RlIHRoYXQgd2UgaGF2ZSBhIGBTdGVwU3RhdGVgIHdoaWNoIHdlIGNvdWxkIHVzZSB0byB0eXBlIHRoZVxuICAgKiByZXR1cm4gdmFsdWUsIGJ1dCBpdCdzIGJhc2ljYWxseSB0aGUgc2FtZSBhcyBgc3RyaW5nYCwgYmVjYXVzZSB0aGUgdHlwZSBoYXMgYHwgc3RyaW5nYC5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX2dldEljb25TdGF0ZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIC8vIFRoZSBzdGF0ZSBpcyBleHBvc2VkIG9uIHRoZSBpY29uIHdpdGggYSBjbGFzcyB0aGF0IGxvb2tzIGxpa2UgYG1hdC1zdGVwLWljb24tc3RhdGUte3tzdGF0ZX19YFxuICAgIGNvbnN0IGljb24gPSBhd2FpdCB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc3RlcC1pY29uJykoKTtcbiAgICBjb25zdCBjbGFzc2VzID0gKGF3YWl0IGljb24uZ2V0QXR0cmlidXRlKCdjbGFzcycpKSE7XG4gICAgY29uc3QgbWF0Y2ggPSBjbGFzc2VzLm1hdGNoKC9tYXQtc3RlcC1pY29uLXN0YXRlLShbYS16XSspLyk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGRldGVybWluZSBzdGVwIHN0YXRlIGZyb20gXCIke2NsYXNzZXN9XCIuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoWzFdO1xuICB9XG59XG4iXX0=
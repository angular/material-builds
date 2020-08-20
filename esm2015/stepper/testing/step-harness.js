/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ContentContainerComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material step in tests. */
export class MatStepHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('selected', options.selected, (harness, selected) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isSelected()) === selected; }))
            .addOption('completed', options.completed, (harness, completed) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isCompleted()) === completed; }))
            .addOption('invalid', options.invalid, (harness, invalid) => __awaiter(this, void 0, void 0, function* () { return (yield harness.hasErrors()) === invalid; }));
    }
    /** Gets the label of the step. */
    getLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFor('.mat-step-text-label')()).text();
        });
    }
    /** Gets the `aria-label` of the step. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /** Gets the value of the `aria-labelledby` attribute. */
    getAriaLabelledby() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('aria-labelledby');
        });
    }
    /** Whether the step is selected. */
    isSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.getAttribute('aria-selected')) === 'true';
        });
    }
    /** Whether the step has been filled out. */
    isCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this._getIconState();
            return state === 'done' || (state === 'edit' && !(yield this.isSelected()));
        });
    }
    /**
     * Whether the step is currently showing its error state. Note that this doesn't mean that there
     * are or aren't any invalid form controls inside the step, but that the step is showing its
     * error-specific styling which depends on there being invalid controls, as well as the
     * `ErrorStateMatcher` determining that an error should be shown and that the `showErrors`
     * option was enabled through the `STEPPER_GLOBAL_OPTIONS` injection token.
     */
    hasErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._getIconState()) === 'error';
        });
    }
    /** Whether the step is optional. */
    isOptional() {
        return __awaiter(this, void 0, void 0, function* () {
            // If the node with the optional text is present, it means that the step is optional.
            const optionalNode = yield this.locatorForOptional('.mat-step-optional')();
            return !!optionalNode;
        });
    }
    /**
     * Selects the given step by clicking on the label. The step may not be selected
     * if the stepper doesn't allow it (e.g. if there are validation errors).
     */
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.host()).click();
        });
    }
    getChildLoader(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._getContentLoader()).getChildLoader(selector);
        });
    }
    getAllChildLoaders(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._getContentLoader()).getAllChildLoaders(selector);
        });
    }
    getHarness(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._getContentLoader()).getHarness(query);
        });
    }
    getAllHarnesses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._getContentLoader()).getAllHarnesses(query);
        });
    }
    /** Gets the element id for the content of the current step. */
    _getContentLoader() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = yield (yield this.host()).getAttribute('aria-controls');
            return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
        });
    }
    /**
     * Gets the state of the step. Note that we have a `StepState` which we could use to type the
     * return value, but it's basically the same as `string`, because the type has `| string`.
     */
    _getIconState() {
        return __awaiter(this, void 0, void 0, function* () {
            // The state is exposed on the icon with a class that looks like `mat-step-icon-state-{{state}}`
            const icon = yield this.locatorFor('.mat-step-icon')();
            const classes = (yield icon.getAttribute('class'));
            const match = classes.match(/mat-step-icon-state-([a-z]+)/);
            if (!match) {
                throw Error(`Could not determine step state from "${classes}".`);
            }
            return match[1];
        });
    }
}
/** The selector for the host element of a `MatStep` instance. */
MatStepHarness.hostSelector = '.mat-step-header';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvdGVzdGluZy9zdGVwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxnQ0FBZ0MsRUFDaEMsZ0JBQWdCLEdBSWpCLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsOEVBQThFO0FBQzlFLE1BQU0sT0FBTyxjQUFlLFNBQVEsZ0NBQXdDO0lBSTFFOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2FBQy9DLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ2pGLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFDbkMsQ0FBTyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsZ0RBQUMsT0FBQSxDQUFDLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssUUFBUSxDQUFBLEdBQUEsQ0FBQzthQUMxRSxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQ3JDLENBQU8sT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLGdEQUFDLE9BQUEsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLFNBQVMsQ0FBQSxHQUFBLENBQUM7YUFDN0UsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUNqQyxDQUFPLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxnREFBQyxP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LEVBQUUsQ0FBQyxDQUFDO1FBQzdFLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNXLGFBQWE7O1lBQ3pCLGdHQUFnRztZQUNoRyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO1lBQ3ZELE1BQU0sT0FBTyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFFLENBQUM7WUFDcEQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBRTVELElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsTUFBTSxLQUFLLENBQUMsd0NBQXdDLE9BQU8sSUFBSSxDQUFDLENBQUM7YUFDbEU7WUFFRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixDQUFDO0tBQUE7O0FBL0dELGlFQUFpRTtBQUMxRCwyQkFBWSxHQUFHLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLFxuICBIYXJuZXNzUHJlZGljYXRlLFxuICBIYXJuZXNzTG9hZGVyLFxuICBDb21wb25lbnRIYXJuZXNzLFxuICBIYXJuZXNzUXVlcnksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7U3RlcEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3N0ZXAtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHN0ZXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U3RlcEhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTdGVwYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXN0ZXAtaGVhZGVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U3RlcEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHN0ZXBzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU3RlcEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFN0ZXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFN0ZXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgICAuYWRkT3B0aW9uKCdsYWJlbCcsIG9wdGlvbnMubGFiZWwsXG4gICAgICAgICAgICAoaGFybmVzcywgbGFiZWwpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldExhYmVsKCksIGxhYmVsKSlcbiAgICAgICAgLmFkZE9wdGlvbignc2VsZWN0ZWQnLCBvcHRpb25zLnNlbGVjdGVkLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIHNlbGVjdGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc1NlbGVjdGVkKCkpID09PSBzZWxlY3RlZClcbiAgICAgICAgLmFkZE9wdGlvbignY29tcGxldGVkJywgb3B0aW9ucy5jb21wbGV0ZWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgY29tcGxldGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0NvbXBsZXRlZCgpKSA9PT0gY29tcGxldGVkKVxuICAgICAgICAuYWRkT3B0aW9uKCdpbnZhbGlkJywgb3B0aW9ucy5pbnZhbGlkLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGludmFsaWQpID0+IChhd2FpdCBoYXJuZXNzLmhhc0Vycm9ycygpKSA9PT0gaW52YWxpZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGFiZWwgb2YgdGhlIHN0ZXAuICovXG4gIGFzeW5jIGdldExhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc3RlcC10ZXh0LWxhYmVsJykoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGBhcmlhLWxhYmVsYCBvZiB0aGUgc3RlcC4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWxsZWRieSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIHNlbGVjdGVkLiAqL1xuICBhc3luYyBpc1NlbGVjdGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICByZXR1cm4gKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc3RlcCBoYXMgYmVlbiBmaWxsZWQgb3V0LiAqL1xuICBhc3luYyBpc0NvbXBsZXRlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHRoaXMuX2dldEljb25TdGF0ZSgpO1xuICAgIHJldHVybiBzdGF0ZSA9PT0gJ2RvbmUnIHx8IChzdGF0ZSA9PT0gJ2VkaXQnICYmICEoYXdhaXQgdGhpcy5pc1NlbGVjdGVkKCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzdGVwIGlzIGN1cnJlbnRseSBzaG93aW5nIGl0cyBlcnJvciBzdGF0ZS4gTm90ZSB0aGF0IHRoaXMgZG9lc24ndCBtZWFuIHRoYXQgdGhlcmVcbiAgICogYXJlIG9yIGFyZW4ndCBhbnkgaW52YWxpZCBmb3JtIGNvbnRyb2xzIGluc2lkZSB0aGUgc3RlcCwgYnV0IHRoYXQgdGhlIHN0ZXAgaXMgc2hvd2luZyBpdHNcbiAgICogZXJyb3Itc3BlY2lmaWMgc3R5bGluZyB3aGljaCBkZXBlbmRzIG9uIHRoZXJlIGJlaW5nIGludmFsaWQgY29udHJvbHMsIGFzIHdlbGwgYXMgdGhlXG4gICAqIGBFcnJvclN0YXRlTWF0Y2hlcmAgZGV0ZXJtaW5pbmcgdGhhdCBhbiBlcnJvciBzaG91bGQgYmUgc2hvd24gYW5kIHRoYXQgdGhlIGBzaG93RXJyb3JzYFxuICAgKiBvcHRpb24gd2FzIGVuYWJsZWQgdGhyb3VnaCB0aGUgYFNURVBQRVJfR0xPQkFMX09QVElPTlNgIGluamVjdGlvbiB0b2tlbi5cbiAgICovXG4gIGFzeW5jIGhhc0Vycm9ycygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2dldEljb25TdGF0ZSgpKSA9PT0gJ2Vycm9yJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGlzIG9wdGlvbmFsLiAqL1xuICBhc3luYyBpc09wdGlvbmFsKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIElmIHRoZSBub2RlIHdpdGggdGhlIG9wdGlvbmFsIHRleHQgaXMgcHJlc2VudCwgaXQgbWVhbnMgdGhhdCB0aGUgc3RlcCBpcyBvcHRpb25hbC5cbiAgICBjb25zdCBvcHRpb25hbE5vZGUgPSBhd2FpdCB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1zdGVwLW9wdGlvbmFsJykoKTtcbiAgICByZXR1cm4gISFvcHRpb25hbE5vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyB0aGUgZ2l2ZW4gc3RlcCBieSBjbGlja2luZyBvbiB0aGUgbGFiZWwuIFRoZSBzdGVwIG1heSBub3QgYmUgc2VsZWN0ZWRcbiAgICogaWYgdGhlIHN0ZXBwZXIgZG9lc24ndCBhbGxvdyBpdCAoZS5nLiBpZiB0aGVyZSBhcmUgdmFsaWRhdGlvbiBlcnJvcnMpLlxuICAgKi9cbiAgYXN5bmMgc2VsZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuY2xpY2soKTtcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkTG9hZGVyKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2dldENvbnRlbnRMb2FkZXIoKSkuZ2V0Q2hpbGRMb2FkZXIoc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsQ2hpbGRMb2FkZXJzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXJbXT4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZ2V0Q29udGVudExvYWRlcigpKS5nZXRBbGxDaGlsZExvYWRlcnMoc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgZ2V0SGFybmVzczxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4ocXVlcnk6IEhhcm5lc3NRdWVyeTxUPik6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZ2V0Q29udGVudExvYWRlcigpKS5nZXRIYXJuZXNzKHF1ZXJ5KTtcbiAgfVxuXG4gIGFzeW5jIGdldEFsbEhhcm5lc3NlczxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4ocXVlcnk6IEhhcm5lc3NRdWVyeTxUPik6IFByb21pc2U8VFtdPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9nZXRDb250ZW50TG9hZGVyKCkpLmdldEFsbEhhcm5lc3NlcyhxdWVyeSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZWxlbWVudCBpZCBmb3IgdGhlIGNvbnRlbnQgb2YgdGhlIGN1cnJlbnQgc3RlcC4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0Q29udGVudExvYWRlcigpOiBQcm9taXNlPEhhcm5lc3NMb2FkZXI+IHtcbiAgICBjb25zdCBjb250ZW50SWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCkuaGFybmVzc0xvYWRlckZvcihgIyR7Y29udGVudElkfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHN0YXRlIG9mIHRoZSBzdGVwLiBOb3RlIHRoYXQgd2UgaGF2ZSBhIGBTdGVwU3RhdGVgIHdoaWNoIHdlIGNvdWxkIHVzZSB0byB0eXBlIHRoZVxuICAgKiByZXR1cm4gdmFsdWUsIGJ1dCBpdCdzIGJhc2ljYWxseSB0aGUgc2FtZSBhcyBgc3RyaW5nYCwgYmVjYXVzZSB0aGUgdHlwZSBoYXMgYHwgc3RyaW5nYC5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX2dldEljb25TdGF0ZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIC8vIFRoZSBzdGF0ZSBpcyBleHBvc2VkIG9uIHRoZSBpY29uIHdpdGggYSBjbGFzcyB0aGF0IGxvb2tzIGxpa2UgYG1hdC1zdGVwLWljb24tc3RhdGUte3tzdGF0ZX19YFxuICAgIGNvbnN0IGljb24gPSBhd2FpdCB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc3RlcC1pY29uJykoKTtcbiAgICBjb25zdCBjbGFzc2VzID0gKGF3YWl0IGljb24uZ2V0QXR0cmlidXRlKCdjbGFzcycpKSE7XG4gICAgY29uc3QgbWF0Y2ggPSBjbGFzc2VzLm1hdGNoKC9tYXQtc3RlcC1pY29uLXN0YXRlLShbYS16XSspLyk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGRldGVybWluZSBzdGVwIHN0YXRlIGZyb20gXCIke2NsYXNzZXN9XCIuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoWzFdO1xuICB9XG59XG4iXX0=
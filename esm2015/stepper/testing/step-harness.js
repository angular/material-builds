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
    getRootHarnessLoader() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvdGVzdGluZy9zdGVwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxnQ0FBZ0MsRUFDaEMsZ0JBQWdCLEdBRWpCLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsOEVBQThFO0FBQzlFLE1BQU0sT0FBTyxjQUFlLFNBQVEsZ0NBQXdDO0lBSTFFOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2FBQy9DLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ2pGLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFDbkMsQ0FBTyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsZ0RBQUMsT0FBQSxDQUFDLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssUUFBUSxDQUFBLEdBQUEsQ0FBQzthQUMxRSxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQ3JDLENBQU8sT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLGdEQUFDLE9BQUEsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLFNBQVMsQ0FBQSxHQUFBLENBQUM7YUFDN0UsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUNqQyxDQUFPLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxnREFBQyxP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cHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgSGFybmVzc0xvYWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtTdGVwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc3RlcC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgc3RlcCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTdGVwSGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFN0ZXBgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc3RlcC1oZWFkZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTdGVwSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc3RlcHMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTdGVwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U3RlcEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U3RlcEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWwoKSwgbGFiZWwpKVxuICAgICAgICAuYWRkT3B0aW9uKCdzZWxlY3RlZCcsIG9wdGlvbnMuc2VsZWN0ZWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgc2VsZWN0ZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzU2VsZWN0ZWQoKSkgPT09IHNlbGVjdGVkKVxuICAgICAgICAuYWRkT3B0aW9uKCdjb21wbGV0ZWQnLCBvcHRpb25zLmNvbXBsZXRlZCxcbiAgICAgICAgICAgIGFzeW5jIChoYXJuZXNzLCBjb21wbGV0ZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzQ29tcGxldGVkKCkpID09PSBjb21wbGV0ZWQpXG4gICAgICAgIC5hZGRPcHRpb24oJ2ludmFsaWQnLCBvcHRpb25zLmludmFsaWQsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgaW52YWxpZCkgPT4gKGF3YWl0IGhhcm5lc3MuaGFzRXJyb3JzKCkpID09PSBpbnZhbGlkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGUgc3RlcC4gKi9cbiAgYXN5bmMgZ2V0TGFiZWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubG9jYXRvckZvcignLm1hdC1zdGVwLXRleHQtbGFiZWwnKSgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYGFyaWEtbGFiZWxgIG9mIHRoZSBzdGVwLiAqL1xuICBhc3luYyBnZXRBcmlhTGFiZWwoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHN0ZXAgaXMgc2VsZWN0ZWQuICovXG4gIGFzeW5jIGlzU2VsZWN0ZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSkgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzdGVwIGhhcyBiZWVuIGZpbGxlZCBvdXQuICovXG4gIGFzeW5jIGlzQ29tcGxldGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpcy5fZ2V0SWNvblN0YXRlKCk7XG4gICAgcmV0dXJuIHN0YXRlID09PSAnZG9uZScgfHwgKHN0YXRlID09PSAnZWRpdCcgJiYgIShhd2FpdCB0aGlzLmlzU2VsZWN0ZWQoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHN0ZXAgaXMgY3VycmVudGx5IHNob3dpbmcgaXRzIGVycm9yIHN0YXRlLiBOb3RlIHRoYXQgdGhpcyBkb2Vzbid0IG1lYW4gdGhhdCB0aGVyZVxuICAgKiBhcmUgb3IgYXJlbid0IGFueSBpbnZhbGlkIGZvcm0gY29udHJvbHMgaW5zaWRlIHRoZSBzdGVwLCBidXQgdGhhdCB0aGUgc3RlcCBpcyBzaG93aW5nIGl0c1xuICAgKiBlcnJvci1zcGVjaWZpYyBzdHlsaW5nIHdoaWNoIGRlcGVuZHMgb24gdGhlcmUgYmVpbmcgaW52YWxpZCBjb250cm9scywgYXMgd2VsbCBhcyB0aGVcbiAgICogYEVycm9yU3RhdGVNYXRjaGVyYCBkZXRlcm1pbmluZyB0aGF0IGFuIGVycm9yIHNob3VsZCBiZSBzaG93biBhbmQgdGhhdCB0aGUgYHNob3dFcnJvcnNgXG4gICAqIG9wdGlvbiB3YXMgZW5hYmxlZCB0aHJvdWdoIHRoZSBgU1RFUFBFUl9HTE9CQUxfT1BUSU9OU2AgaW5qZWN0aW9uIHRva2VuLlxuICAgKi9cbiAgYXN5bmMgaGFzRXJyb3JzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZ2V0SWNvblN0YXRlKCkpID09PSAnZXJyb3InO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHN0ZXAgaXMgb3B0aW9uYWwuICovXG4gIGFzeW5jIGlzT3B0aW9uYWwoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgLy8gSWYgdGhlIG5vZGUgd2l0aCB0aGUgb3B0aW9uYWwgdGV4dCBpcyBwcmVzZW50LCBpdCBtZWFucyB0aGF0IHRoZSBzdGVwIGlzIG9wdGlvbmFsLlxuICAgIGNvbnN0IG9wdGlvbmFsTm9kZSA9IGF3YWl0IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXN0ZXAtb3B0aW9uYWwnKSgpO1xuICAgIHJldHVybiAhIW9wdGlvbmFsTm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSBnaXZlbiBzdGVwIGJ5IGNsaWNraW5nIG9uIHRoZSBsYWJlbC4gVGhlIHN0ZXAgbWF5IG5vdCBiZSBzZWxlY3RlZFxuICAgKiBpZiB0aGUgc3RlcHBlciBkb2Vzbid0IGFsbG93IGl0IChlLmcuIGlmIHRoZXJlIGFyZSB2YWxpZGF0aW9uIGVycm9ycykuXG4gICAqL1xuICBhc3luYyBzZWxlY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5jbGljaygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGFzeW5jIGdldFJvb3RIYXJuZXNzTG9hZGVyKCk6IFByb21pc2U8SGFybmVzc0xvYWRlcj4ge1xuICAgIGNvbnN0IGNvbnRlbnRJZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKS5oYXJuZXNzTG9hZGVyRm9yKGAjJHtjb250ZW50SWR9YCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc3RhdGUgb2YgdGhlIHN0ZXAuIE5vdGUgdGhhdCB3ZSBoYXZlIGEgYFN0ZXBTdGF0ZWAgd2hpY2ggd2UgY291bGQgdXNlIHRvIHR5cGUgdGhlXG4gICAqIHJldHVybiB2YWx1ZSwgYnV0IGl0J3MgYmFzaWNhbGx5IHRoZSBzYW1lIGFzIGBzdHJpbmdgLCBiZWNhdXNlIHRoZSB0eXBlIGhhcyBgfCBzdHJpbmdgLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBfZ2V0SWNvblN0YXRlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIHN0YXRlIGlzIGV4cG9zZWQgb24gdGhlIGljb24gd2l0aCBhIGNsYXNzIHRoYXQgbG9va3MgbGlrZSBgbWF0LXN0ZXAtaWNvbi1zdGF0ZS17e3N0YXRlfX1gXG4gICAgY29uc3QgaWNvbiA9IGF3YWl0IHRoaXMubG9jYXRvckZvcignLm1hdC1zdGVwLWljb24nKSgpO1xuICAgIGNvbnN0IGNsYXNzZXMgPSAoYXdhaXQgaWNvbi5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpITtcbiAgICBjb25zdCBtYXRjaCA9IGNsYXNzZXMubWF0Y2goL21hdC1zdGVwLWljb24tc3RhdGUtKFthLXpdKykvKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb3VsZCBub3QgZGV0ZXJtaW5lIHN0ZXAgc3RhdGUgZnJvbSBcIiR7Y2xhc3Nlc31cIi5gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hbMV07XG4gIH1cbn1cbiJdfQ==
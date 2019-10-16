/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
/**
 * Harness for interacting with a standard mat-slide-toggle in tests.
 * @dynamic
 */
export class MatSlideToggleHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._label = this.locatorFor('label');
        this._input = this.locatorFor('input');
        this._inputContainer = this.locatorFor('.mat-slide-toggle-bar');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a slide-toggle w/ specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a slide-toggle whose host element matches the given selector.
     *   - `label` finds a slide-toggle with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSlideToggleHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            // We want to provide a filter option for "name" because the name of the slide-toggle is
            // only set on the underlying input. This means that it's not possible for developers
            // to retrieve the harness of a specific checkbox with name through a CSS selector.
            .addOption('name', options.name, (harness, name) => tslib_1.__awaiter(this, void 0, void 0, function* () { return (yield harness.getName()) === name; }));
    }
    /** Gets a boolean promise indicating if the slide-toggle is checked. */
    isChecked() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checked = (yield this._input()).getProperty('checked');
            return coerceBooleanProperty(yield checked);
        });
    }
    /** Gets a boolean promise indicating if the slide-toggle is disabled. */
    isDisabled() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this._input()).getAttribute('disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Gets a boolean promise indicating if the slide-toggle is required. */
    isRequired() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const required = (yield this._input()).getAttribute('required');
            return coerceBooleanProperty(yield required);
        });
    }
    /** Gets a boolean promise indicating if the slide-toggle is valid. */
    isValid() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const invalid = (yield this.host()).hasClass('ng-invalid');
            return !(yield invalid);
        });
    }
    /** Gets a promise for the slide-toggle's name. */
    getName() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getAttribute('name');
        });
    }
    /** Gets a promise for the slide-toggle's aria-label. */
    getAriaLabel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getAttribute('aria-label');
        });
    }
    /** Gets a promise for the slide-toggle's aria-labelledby. */
    getAriaLabelledby() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).getAttribute('aria-labelledby');
        });
    }
    /** Gets a promise for the slide-toggle's label text. */
    getLabelText() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._label()).text();
        });
    }
    /** Focuses the slide-toggle and returns a void promise that indicates action completion. */
    focus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).focus();
        });
    }
    /** Blurs the slide-toggle and returns a void promise that indicates action completion. */
    blur() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._input()).blur();
        });
    }
    /**
     * Toggle the checked state of the slide-toggle and returns a void promise that indicates when the
     * action is complete.
     *
     * Note: This toggles the slide-toggle as a user would, by clicking it.
     */
    toggle() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this._inputContainer()).click();
        });
    }
    /**
     * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked. Returns a void promise that indicates when the action is
     * complete.
     *
     * Note: This attempts to check the slide-toggle as a user would, by clicking it.
     */
    check() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isChecked())) {
                yield this.toggle();
            }
        });
    }
    /**
     * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked. Returns a void promise that indicates when the action is
     * complete.
     *
     * Note: This toggles the slide-toggle as a user would, by clicking it.
     */
    uncheck() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isChecked()) {
                yield this.toggle();
            }
        });
    }
}
MatSlideToggleHarness.hostSelector = 'mat-slide-toggle';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGUtdG9nZ2xlL3Rlc3Rpbmcvc2xpZGUtdG9nZ2xlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSTVEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxnQkFBZ0I7SUFBM0Q7O1FBb0JVLFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLFdBQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLG9CQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBMkZyRSxDQUFDO0lBOUdDOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBcUMsRUFBRTtRQUNqRCxPQUFPLElBQUksZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDO2FBQ3RELFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDN0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RGLHdGQUF3RjtZQUN4RixxRkFBcUY7WUFDckYsbUZBQW1GO2FBQ2xGLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFPLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSx3REFBQyxPQUFBLENBQUEsTUFBTSxP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dXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTbGlkZVRvZ2dsZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NsaWRlLXRvZ2dsZS1oYXJuZXNzLWZpbHRlcnMnO1xuXG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zbGlkZS10b2dnbGUgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVUb2dnbGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXNsaWRlLXRvZ2dsZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgc2xpZGUtdG9nZ2xlIHcvIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoOlxuICAgKiAgIC0gYHNlbGVjdG9yYCBmaW5kcyBhIHNsaWRlLXRvZ2dsZSB3aG9zZSBob3N0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3IuXG4gICAqICAgLSBgbGFiZWxgIGZpbmRzIGEgc2xpZGUtdG9nZ2xlIHdpdGggc3BlY2lmaWMgbGFiZWwgdGV4dC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTbGlkZVRvZ2dsZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNsaWRlVG9nZ2xlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTbGlkZVRvZ2dsZUhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ2xhYmVsJywgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIChoYXJuZXNzLCBsYWJlbCkgPT4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TGFiZWxUZXh0KCksIGxhYmVsKSlcbiAgICAgICAgLy8gV2Ugd2FudCB0byBwcm92aWRlIGEgZmlsdGVyIG9wdGlvbiBmb3IgXCJuYW1lXCIgYmVjYXVzZSB0aGUgbmFtZSBvZiB0aGUgc2xpZGUtdG9nZ2xlIGlzXG4gICAgICAgIC8vIG9ubHkgc2V0IG9uIHRoZSB1bmRlcmx5aW5nIGlucHV0LiBUaGlzIG1lYW5zIHRoYXQgaXQncyBub3QgcG9zc2libGUgZm9yIGRldmVsb3BlcnNcbiAgICAgICAgLy8gdG8gcmV0cmlldmUgdGhlIGhhcm5lc3Mgb2YgYSBzcGVjaWZpYyBjaGVja2JveCB3aXRoIG5hbWUgdGhyb3VnaCBhIENTUyBzZWxlY3Rvci5cbiAgICAgICAgLmFkZE9wdGlvbignbmFtZScsIG9wdGlvbnMubmFtZSwgYXN5bmMgKGhhcm5lc3MsIG5hbWUpID0+IGF3YWl0IGhhcm5lc3MuZ2V0TmFtZSgpID09PSBuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX2xhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCdsYWJlbCcpO1xuICBwcml2YXRlIF9pbnB1dCA9IHRoaXMubG9jYXRvckZvcignaW5wdXQnKTtcbiAgcHJpdmF0ZSBfaW5wdXRDb250YWluZXIgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2xpZGUtdG9nZ2xlLWJhcicpO1xuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNsaWRlLXRvZ2dsZSBpcyBjaGVja2VkLiAqL1xuICBhc3luYyBpc0NoZWNrZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2hlY2tlZCA9IChhd2FpdCB0aGlzLl9pbnB1dCgpKS5nZXRQcm9wZXJ0eSgnY2hlY2tlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgY2hlY2tlZCk7XG4gIH1cblxuICAvKiogR2V0cyBhIGJvb2xlYW4gcHJvbWlzZSBpbmRpY2F0aW5nIGlmIHRoZSBzbGlkZS10b2dnbGUgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBib29sZWFuIHByb21pc2UgaW5kaWNhdGluZyBpZiB0aGUgc2xpZGUtdG9nZ2xlIGlzIHJlcXVpcmVkLiAqL1xuICBhc3luYyBpc1JlcXVpcmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IHJlcXVpcmVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgYm9vbGVhbiBwcm9taXNlIGluZGljYXRpbmcgaWYgdGhlIHNsaWRlLXRvZ2dsZSBpcyB2YWxpZC4gKi9cbiAgYXN5bmMgaXNWYWxpZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBpbnZhbGlkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbmctaW52YWxpZCcpO1xuICAgIHJldHVybiAhKGF3YWl0IGludmFsaWQpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgc2xpZGUtdG9nZ2xlJ3MgbmFtZS4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2lucHV0KCkpLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwcm9taXNlIGZvciB0aGUgc2xpZGUtdG9nZ2xlJ3MgYXJpYS1sYWJlbC4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIH1cblxuICAvKiogR2V0cyBhIHByb21pc2UgZm9yIHRoZSBzbGlkZS10b2dnbGUncyBhcmlhLWxhYmVsbGVkYnkuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXQoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHNsaWRlLXRvZ2dsZSdzIGxhYmVsIHRleHQuICovXG4gIGFzeW5jIGdldExhYmVsVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fbGFiZWwoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNsaWRlLXRvZ2dsZSBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyBhY3Rpb24gY29tcGxldGlvbi4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBzbGlkZS10b2dnbGUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgYWN0aW9uIGNvbXBsZXRpb24uICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9pbnB1dCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHRoZSBjaGVja2VkIHN0YXRlIG9mIHRoZSBzbGlkZS10b2dnbGUgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIHRvZ2dsZXMgdGhlIHNsaWRlLXRvZ2dsZSBhcyBhIHVzZXIgd291bGQsIGJ5IGNsaWNraW5nIGl0LlxuICAgKi9cbiAgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5faW5wdXRDb250YWluZXIoKSkuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBzbGlkZS10b2dnbGUgaW4gYSBjaGVja2VkIHN0YXRlIGJ5IHRvZ2dsaW5nIGl0IGlmIGl0IGlzIGN1cnJlbnRseSB1bmNoZWNrZWQsIG9yIGRvaW5nXG4gICAqIG5vdGhpbmcgaWYgaXQgaXMgYWxyZWFkeSBjaGVja2VkLiBSZXR1cm5zIGEgdm9pZCBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlIGFjdGlvbiBpc1xuICAgKiBjb21wbGV0ZS5cbiAgICpcbiAgICogTm90ZTogVGhpcyBhdHRlbXB0cyB0byBjaGVjayB0aGUgc2xpZGUtdG9nZ2xlIGFzIGEgdXNlciB3b3VsZCwgYnkgY2xpY2tpbmcgaXQuXG4gICAqL1xuICBhc3luYyBjaGVjaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIShhd2FpdCB0aGlzLmlzQ2hlY2tlZCgpKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHV0cyB0aGUgc2xpZGUtdG9nZ2xlIGluIGFuIHVuY2hlY2tlZCBzdGF0ZSBieSB0b2dnbGluZyBpdCBpZiBpdCBpcyBjdXJyZW50bHkgY2hlY2tlZCwgb3IgZG9pbmdcbiAgICogbm90aGluZyBpZiBpdCBpcyBhbHJlYWR5IHVuY2hlY2tlZC4gUmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZSBhY3Rpb24gaXNcbiAgICogY29tcGxldGUuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgdG9nZ2xlcyB0aGUgc2xpZGUtdG9nZ2xlIGFzIGEgdXNlciB3b3VsZCwgYnkgY2xpY2tpbmcgaXQuXG4gICAqL1xuICBhc3luYyB1bmNoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzQ2hlY2tlZCgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxufVxuIl19
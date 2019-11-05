/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
/**
 * Harness for interacting with a standard mat-slider in tests.
 * @dynamic
 */
export class MatSliderHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('.mat-slider-thumb-label-text');
        this._wrapper = this.locatorFor('.mat-slider-wrapper');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a mat-slider with
     * specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a slider whose host element matches the given selector.
     *   - `id` finds a slider with specific id.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSliderHarness, options);
    }
    /** Gets the slider's id. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield (yield this.host()).getAttribute('id');
            // In case no id has been specified, the "id" property always returns
            // an empty string. To make this method more explicit, we return null.
            return id !== '' ? id : null;
        });
    }
    /**
     * Gets the current display value of the slider. Returns null if the thumb
     * label is disabled.
     */
    getDisplayValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const [host, textLabel] = yield Promise.all([this.host(), this._textLabel()]);
            if (yield host.hasClass('mat-slider-thumb-label-showing')) {
                return textLabel.text();
            }
            return null;
        });
    }
    /** Gets the current percentage value of the slider. */
    getPercentage() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._calculatePercentage(yield this.getValue());
        });
    }
    /** Gets the current value of the slider. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuenow'));
        });
    }
    /** Gets the maximum value of the slider. */
    getMaxValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuemax'));
        });
    }
    /** Gets the minimum value of the slider. */
    getMinValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuemin'));
        });
    }
    /** Whether the slider is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('aria-disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Gets the orientation of the slider. */
    getOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            // "aria-orientation" will always be set to either "horizontal" or "vertical".
            return (yield this.host()).getAttribute('aria-orientation');
        });
    }
    /**
     * Sets the value of the slider by clicking on the slider track.
     *
     * Note that in rare cases the value cannot be set to the exact specified value. This
     * can happen if not every value of the slider maps to a single pixel that could be
     * clicked using mouse interaction. In such cases consider using the keyboard to
     * select the given value or expand the slider's size for a better user experience.
     */
    setValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const [sliderEl, wrapperEl, orientation] = yield Promise.all([this.host(), this._wrapper(), this.getOrientation()]);
            let percentage = yield this._calculatePercentage(value);
            const { height, width } = yield wrapperEl.getDimensions();
            const isVertical = orientation === 'vertical';
            // In case the slider is inverted in LTR mode or not inverted in RTL mode,
            // we need to invert the percentage so that the proper value is set.
            if (yield sliderEl.hasClass('mat-slider-invert-mouse-coords')) {
                percentage = 1 - percentage;
            }
            // We need to round the new coordinates because creating fake DOM
            // events will cause the coordinates to be rounded down.
            const relativeX = isVertical ? 0 : Math.round(width * percentage);
            const relativeY = isVertical ? Math.round(height * percentage) : 0;
            yield wrapperEl.click(relativeX, relativeY);
        });
    }
    /**
     * Focuses the slider and returns a void promise that indicates when the
     * action is complete.
     */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /**
     * Blurs the slider and returns a void promise that indicates when the
     * action is complete.
     */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Calculates the percentage of the given value. */
    _calculatePercentage(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const [min, max] = yield Promise.all([this.getMinValue(), this.getMaxValue()]);
            return (value - min) / (max - min);
        });
    }
}
MatSliderHarness.hostSelector = 'mat-slider';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3Rlc3Rpbmcvc2xpZGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR2xGOzs7R0FHRztBQUNILE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxnQkFBZ0I7SUFBdEQ7O1FBZVUsZUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUM3RCxhQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBd0c1RCxDQUFDO0lBckhDOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWdDLEVBQUU7UUFDNUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFLRCw0QkFBNEI7SUFDdEIsS0FBSzs7WUFDVCxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQscUVBQXFFO1lBQ3JFLHNFQUFzRTtZQUN0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQy9CLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLGVBQWU7O1lBQ25CLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMs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QUM7UUFDOUMsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxJQUFJOztZQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7S0FBQTtJQUVELG9EQUFvRDtJQUN0QyxvQkFBb0IsQ0FBQyxLQUFhOztZQUM5QyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9FLE9BQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBOztBQXRITSw2QkFBWSxHQUFHLFlBQVksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2xpZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc2xpZGVyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zbGlkZXIgaW4gdGVzdHMuXG4gKiBAZHluYW1pY1xuICovXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJ21hdC1zbGlkZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIG1hdC1zbGlkZXIgd2l0aFxuICAgKiBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGBzZWxlY3RvcmAgZmluZHMgYSBzbGlkZXIgd2hvc2UgaG9zdCBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLlxuICAgKiAgIC0gYGlkYCBmaW5kcyBhIHNsaWRlciB3aXRoIHNwZWNpZmljIGlkLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNsaWRlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNsaWRlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2xpZGVySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIF90ZXh0TGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2xpZGVyLXRodW1iLWxhYmVsLXRleHQnKTtcbiAgcHJpdmF0ZSBfd3JhcHBlciA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zbGlkZXItd3JhcHBlcicpO1xuXG4gIC8qKiBHZXRzIHRoZSBzbGlkZXIncyBpZC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGlkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgLy8gSW4gY2FzZSBubyBpZCBoYXMgYmVlbiBzcGVjaWZpZWQsIHRoZSBcImlkXCIgcHJvcGVydHkgYWx3YXlzIHJldHVybnNcbiAgICAvLyBhbiBlbXB0eSBzdHJpbmcuIFRvIG1ha2UgdGhpcyBtZXRob2QgbW9yZSBleHBsaWNpdCwgd2UgcmV0dXJuIG51bGwuXG4gICAgcmV0dXJuIGlkICE9PSAnJyA/IGlkIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IGRpc3BsYXkgdmFsdWUgb2YgdGhlIHNsaWRlci4gUmV0dXJucyBudWxsIGlmIHRoZSB0aHVtYlxuICAgKiBsYWJlbCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIGFzeW5jIGdldERpc3BsYXlWYWx1ZSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgY29uc3QgW2hvc3QsIHRleHRMYWJlbF0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5ob3N0KCksIHRoaXMuX3RleHRMYWJlbCgpXSk7XG4gICAgaWYgKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZycpKSB7XG4gICAgICByZXR1cm4gdGV4dExhYmVsLnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY3VycmVudCBwZXJjZW50YWdlIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldFBlcmNlbnRhZ2UoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZShhd2FpdCB0aGlzLmdldFZhbHVlKCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWF4aW11bSB2YWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBnZXRNYXhWYWx1ZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldE1pblZhbHVlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJykpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0T3JpZW50YXRpb24oKTogUHJvbWlzZTwnaG9yaXpvbnRhbCd8J3ZlcnRpY2FsJz4ge1xuICAgIC8vIFwiYXJpYS1vcmllbnRhdGlvblwiIHdpbGwgYWx3YXlzIGJlIHNldCB0byBlaXRoZXIgXCJob3Jpem9udGFsXCIgb3IgXCJ2ZXJ0aWNhbFwiLlxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1vcmllbnRhdGlvbicpIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc2xpZGVyIGJ5IGNsaWNraW5nIG9uIHRoZSBzbGlkZXIgdHJhY2suXG4gICAqXG4gICAqIE5vdGUgdGhhdCBpbiByYXJlIGNhc2VzIHRoZSB2YWx1ZSBjYW5ub3QgYmUgc2V0IHRvIHRoZSBleGFjdCBzcGVjaWZpZWQgdmFsdWUuIFRoaXNcbiAgICogY2FuIGhhcHBlbiBpZiBub3QgZXZlcnkgdmFsdWUgb2YgdGhlIHNsaWRlciBtYXBzIHRvIGEgc2luZ2xlIHBpeGVsIHRoYXQgY291bGQgYmVcbiAgICogY2xpY2tlZCB1c2luZyBtb3VzZSBpbnRlcmFjdGlvbi4gSW4gc3VjaCBjYXNlcyBjb25zaWRlciB1c2luZyB0aGUga2V5Ym9hcmQgdG9cbiAgICogc2VsZWN0IHRoZSBnaXZlbiB2YWx1ZSBvciBleHBhbmQgdGhlIHNsaWRlcidzIHNpemUgZm9yIGEgYmV0dGVyIHVzZXIgZXhwZXJpZW5jZS5cbiAgICovXG4gIGFzeW5jIHNldFZhbHVlKHZhbHVlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBbc2xpZGVyRWwsIHdyYXBwZXJFbCwgb3JpZW50YXRpb25dID1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaG9zdCgpLCB0aGlzLl93cmFwcGVyKCksIHRoaXMuZ2V0T3JpZW50YXRpb24oKV0pO1xuICAgIGxldCBwZXJjZW50YWdlID0gYXdhaXQgdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZSk7XG4gICAgY29uc3Qge2hlaWdodCwgd2lkdGh9ID0gYXdhaXQgd3JhcHBlckVsLmdldERpbWVuc2lvbnMoKTtcbiAgICBjb25zdCBpc1ZlcnRpY2FsID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCc7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBzbGlkZXIgaXMgaW52ZXJ0ZWQgaW4gTFRSIG1vZGUgb3Igbm90IGludmVydGVkIGluIFJUTCBtb2RlLFxuICAgIC8vIHdlIG5lZWQgdG8gaW52ZXJ0IHRoZSBwZXJjZW50YWdlIHNvIHRoYXQgdGhlIHByb3BlciB2YWx1ZSBpcyBzZXQuXG4gICAgaWYgKGF3YWl0IHNsaWRlckVsLmhhc0NsYXNzKCdtYXQtc2xpZGVyLWludmVydC1tb3VzZS1jb29yZHMnKSkge1xuICAgICAgcGVyY2VudGFnZSA9IDEgLSBwZXJjZW50YWdlO1xuICAgIH1cblxuICAgIC8vIFdlIG5lZWQgdG8gcm91bmQgdGhlIG5ldyBjb29yZGluYXRlcyBiZWNhdXNlIGNyZWF0aW5nIGZha2UgRE9NXG4gICAgLy8gZXZlbnRzIHdpbGwgY2F1c2UgdGhlIGNvb3JkaW5hdGVzIHRvIGJlIHJvdW5kZWQgZG93bi5cbiAgICBjb25zdCByZWxhdGl2ZVggPSBpc1ZlcnRpY2FsID8gMCA6IE1hdGgucm91bmQod2lkdGggKiBwZXJjZW50YWdlKTtcbiAgICBjb25zdCByZWxhdGl2ZVkgPSBpc1ZlcnRpY2FsID8gTWF0aC5yb3VuZChoZWlnaHQgKiBwZXJjZW50YWdlKSA6IDA7XG5cbiAgICBhd2FpdCB3cmFwcGVyRWwuY2xpY2socmVsYXRpdmVYLCByZWxhdGl2ZVkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHNsaWRlciBhbmQgcmV0dXJucyBhIHZvaWQgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB3aGVuIHRoZVxuICAgKiBhY3Rpb24gaXMgY29tcGxldGUuXG4gICAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJsdXJzIHRoZSBzbGlkZXIgYW5kIHJldHVybnMgYSB2b2lkIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgcGVyY2VudGFnZSBvZiB0aGUgZ2l2ZW4gdmFsdWUuICovXG4gIHByaXZhdGUgYXN5bmMgX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWU6IG51bWJlcikge1xuICAgIGNvbnN0IFttaW4sIG1heF0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5nZXRNaW5WYWx1ZSgpLCB0aGlzLmdldE1heFZhbHVlKCldKTtcbiAgICByZXR1cm4gKHZhbHVlIC0gbWluKSAvIChtYXggLSBtaW4pO1xuICB9XG59XG4iXX0=
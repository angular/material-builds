/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { TestKey } from '@angular/cdk/testing';
import { MatDatepickerInputHarnessBase, getInputPredicate } from './datepicker-input-harness-base';
import { closeCalendar, getCalendarId, getCalendar, } from './datepicker-trigger-harness-base';
/** Harness for interacting with a standard Material datepicker inputs in tests. */
export class MatDatepickerInputHarness extends MatDatepickerInputHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getInputPredicate(MatDatepickerInputHarness, options);
    }
    /** Gets whether the calendar associated with the input is open. */
    isCalendarOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            // `aria-owns` is set only if there's an open datepicker so we can use it as an indicator.
            const host = yield this.host();
            return (yield host.getAttribute('aria-owns')) != null;
        });
    }
    /** Opens the calendar associated with the input. */
    openCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            const [isDisabled, hasCalendar] = yield Promise.all([this.isDisabled(), this.hasCalendar()]);
            if (!isDisabled && hasCalendar) {
                // Alt + down arrow is the combination for opening the calendar with the keyboard.
                const host = yield this.host();
                return host.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
            }
        });
    }
    /** Closes the calendar associated with the input. */
    closeCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isCalendarOpen()) {
                yield closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
                // This is necessary so that we wait for the closing animation to finish in touch UI mode.
                yield this.forceStabilize();
            }
        });
    }
    /** Whether a calendar is associated with the input. */
    hasCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield getCalendarId(this.host())) != null;
        });
    }
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    getCalendar(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
        });
    }
}
MatDatepickerInputHarness.hostSelector = '.mat-datepicker-input';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZy9kYXRlcGlja2VyLWlucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBbUIsT0FBTyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFL0QsT0FBTyxFQUFDLDZCQUE2QixFQUFFLGlCQUFpQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFakcsT0FBTyxFQUVMLGFBQWEsRUFDYixhQUFhLEVBQ2IsV0FBVyxHQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsbUZBQW1GO0FBQ25GLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSw2QkFBNkI7SUFJMUU7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXlDLEVBQUU7UUFFckQsT0FBTyxpQkFBaUIsQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsbUVBQW1FO0lBQzdELGNBQWM7O1lBQ2xCLDBGQUEwRjtZQUMxRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3hELENBQUM7S0FBQTtJQUVELG9EQUFvRDtJQUM5QyxZQUFZOztZQUNoQixNQUFNLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTdGLElBQUksQ0FBQyxVQUFVLElBQUksV0FBVyxFQUFFO2dCQUM5QixrRkFBa0Y7Z0JBQ2xGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMvQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3ZEO1FBQ0gsQ0FBQztLQUFBO0lBRUQscURBQXFEO0lBQy9DLGFBQWE7O1lBQ2pCLElBQUksTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQy9CLE1BQU0sYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRiwwRkFBMEY7Z0JBQzFGLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQzdCO1FBQ0gsQ0FBQztLQUFBO0lBRUQsdURBQXVEO0lBQ2pELFdBQVc7O1lBQ2YsT0FBTyxDQUFDLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3BELENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNHLFdBQVcsQ0FBQyxTQUFpQyxFQUFFOztZQUNuRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUM7UUFDN0UsQ0FBQztLQUFBOztBQW5ETSxzQ0FBWSxHQUFHLHVCQUF1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZSwgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtEYXRlcGlja2VySW5wdXRIYXJuZXNzRmlsdGVycywgQ2FsZW5kYXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kYXRlcGlja2VyLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NCYXNlLCBnZXRJbnB1dFByZWRpY2F0ZX0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWhhcm5lc3MtYmFzZSc7XG5pbXBvcnQge01hdENhbGVuZGFySGFybmVzc30gZnJvbSAnLi9jYWxlbmRhci1oYXJuZXNzJztcbmltcG9ydCB7XG4gIERhdGVwaWNrZXJUcmlnZ2VyLFxuICBjbG9zZUNhbGVuZGFyLFxuICBnZXRDYWxlbmRhcklkLFxuICBnZXRDYWxlbmRhcixcbn0gZnJvbSAnLi9kYXRlcGlja2VyLXRyaWdnZXItaGFybmVzcy1iYXNlJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBkYXRlcGlja2VyIGlucHV0cyBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzIGV4dGVuZHMgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc0Jhc2UgaW1wbGVtZW50c1xuICBEYXRlcGlja2VyVHJpZ2dlciB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1kYXRlcGlja2VyLWlucHV0JztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggaW5wdXQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRGF0ZXBpY2tlcklucHV0SGFybmVzc0ZpbHRlcnMgPSB7fSk6XG4gICAgSGFybmVzc1ByZWRpY2F0ZTxNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIGdldElucHV0UHJlZGljYXRlKE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgY2FsZW5kYXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCBpcyBvcGVuLiAqL1xuICBhc3luYyBpc0NhbGVuZGFyT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAvLyBgYXJpYS1vd25zYCBpcyBzZXQgb25seSBpZiB0aGVyZSdzIGFuIG9wZW4gZGF0ZXBpY2tlciBzbyB3ZSBjYW4gdXNlIGl0IGFzIGFuIGluZGljYXRvci5cbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS1vd25zJykpICE9IG51bGw7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIGNhbGVuZGFyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIGFzeW5jIG9wZW5DYWxlbmRhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBbaXNEaXNhYmxlZCwgaGFzQ2FsZW5kYXJdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaXNEaXNhYmxlZCgpLCB0aGlzLmhhc0NhbGVuZGFyKCldKTtcblxuICAgIGlmICghaXNEaXNhYmxlZCAmJiBoYXNDYWxlbmRhcikge1xuICAgICAgLy8gQWx0ICsgZG93biBhcnJvdyBpcyB0aGUgY29tYmluYXRpb24gZm9yIG9wZW5pbmcgdGhlIGNhbGVuZGFyIHdpdGggdGhlIGtleWJvYXJkLlxuICAgICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgICAgcmV0dXJuIGhvc3Quc2VuZEtleXMoe2FsdDogdHJ1ZX0sIFRlc3RLZXkuRE9XTl9BUlJPVyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgY2FsZW5kYXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgY2xvc2VDYWxlbmRhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoYXdhaXQgdGhpcy5pc0NhbGVuZGFyT3BlbigpKSB7XG4gICAgICBhd2FpdCBjbG9zZUNhbGVuZGFyKGdldENhbGVuZGFySWQodGhpcy5ob3N0KCkpLCB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCkpO1xuICAgICAgLy8gVGhpcyBpcyBuZWNlc3Nhcnkgc28gdGhhdCB3ZSB3YWl0IGZvciB0aGUgY2xvc2luZyBhbmltYXRpb24gdG8gZmluaXNoIGluIHRvdWNoIFVJIG1vZGUuXG4gICAgICBhd2FpdCB0aGlzLmZvcmNlU3RhYmlsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgYSBjYWxlbmRhciBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBhc3luYyBoYXNDYWxlbmRhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IGdldENhbGVuZGFySWQodGhpcy5ob3N0KCkpKSAhPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGBNYXRDYWxlbmRhckhhcm5lc3NgIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSB0cmlnZ2VyLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBjYWxlbmRhciBpcyBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldENhbGVuZGFyKGZpbHRlcjogQ2FsZW5kYXJIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRDYWxlbmRhckhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0Q2FsZW5kYXIoZmlsdGVyLCB0aGlzLmhvc3QoKSwgdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpKTtcbiAgfVxufVxuIl19
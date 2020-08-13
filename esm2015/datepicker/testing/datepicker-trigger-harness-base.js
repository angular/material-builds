/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness } from '@angular/cdk/testing';
import { MatCalendarHarness } from './calendar-harness';
/** Base class for harnesses that can trigger a calendar. */
export class DatepickerTriggerHarnessBase extends ComponentHarness {
    /** Opens the calendar if the trigger is enabled and it has a calendar. */
    openCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            const [isDisabled, hasCalendar] = yield Promise.all([this.isDisabled(), this.hasCalendar()]);
            if (!isDisabled && hasCalendar) {
                return this._openCalendar();
            }
        });
    }
    /** Closes the calendar if it is open. */
    closeCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isCalendarOpen()) {
                yield closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
                // This is necessary so that we wait for the closing animation to finish in touch UI mode.
                yield this.forceStabilize();
            }
        });
    }
    /** Gets whether there is a calendar associated with the trigger. */
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
/** Gets the ID of the calendar that a particular test element can trigger. */
export function getCalendarId(host) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield host).getAttribute('data-mat-calendar');
    });
}
/** Closes the calendar with a specific ID. */
export function closeCalendar(calendarId, documentLocator) {
    return __awaiter(this, void 0, void 0, function* () {
        // We close the calendar by clicking on the backdrop, even though all datepicker variants
        // have the ability to close by pressing escape. The backdrop is preferrable, because the
        // escape key has multiple functions inside a range picker (either cancel the current range
        // or close the calendar). Since we don't have access to set the ID on the backdrop in all
        // cases, we set a unique class instead which is the same as the calendar's ID and suffixed
        // with `-backdrop`.
        const backdropSelector = `.${yield calendarId}-backdrop`;
        return (yield documentLocator.locatorFor(backdropSelector)()).click();
    });
}
/** Gets the test harness for a calendar associated with a particular host. */
export function getCalendar(filter, host, documentLocator) {
    return __awaiter(this, void 0, void 0, function* () {
        const calendarId = yield getCalendarId(host);
        if (!calendarId) {
            throw Error(`Element is not associated with a calendar`);
        }
        return documentLocator.locatorFor(MatCalendarHarness.with(Object.assign(Object.assign({}, filter), { selector: `#${calendarId}` })))();
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci10cmlnZ2VyLWhhcm5lc3MtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL3Rlc3RpbmcvZGF0ZXBpY2tlci10cmlnZ2VyLWhhcm5lc3MtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUE4QixNQUFNLHNCQUFzQixDQUFDO0FBRW5GLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBV3RELDREQUE0RDtBQUM1RCxNQUFNLE9BQWdCLDRCQUE2QixTQUFRLGdCQUFnQjtJQVd6RSwwRUFBMEU7SUFDcEUsWUFBWTs7WUFDaEIsTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUU3RixJQUFJLENBQUMsVUFBVSxJQUFJLFdBQVcsRUFBRTtnQkFDOUIsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDN0I7UUFDSCxDQUFDO0tBQUE7SUFFRCx5Q0FBeUM7SUFDbkMsYUFBYTs7WUFDakIsSUFBSSxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDL0IsTUFBTSxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUM7Z0JBQ25GLDBGQUEwRjtnQkFDMUYsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDN0I7UUFDSCxDQUFDO0tBQUE7SUFFRCxvRUFBb0U7SUFDOUQsV0FBVzs7WUFDZixPQUFPLENBQUMsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDcEQsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csV0FBVyxDQUFDLFNBQWlDLEVBQUU7O1lBQ25ELE9BQU8sV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztRQUM3RSxDQUFDO0tBQUE7Q0FDRjtBQUVELDhFQUE4RTtBQUM5RSxNQUFNLFVBQWdCLGFBQWEsQ0FBQyxJQUEwQjs7UUFDNUQsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUFBO0FBRUQsOENBQThDO0FBQzlDLE1BQU0sVUFBZ0IsYUFBYSxDQUNqQyxVQUFrQyxFQUNsQyxlQUErQjs7UUFDL0IseUZBQXlGO1FBQ3pGLHlGQUF5RjtRQUN6RiwyRkFBMkY7UUFDM0YsMEZBQTBGO1FBQzFGLDJGQUEyRjtRQUMzRixvQkFBb0I7UUFDcEIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sVUFBVSxXQUFXLENBQUM7UUFDekQsT0FBTyxDQUFDLE1BQU0sZUFBZSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4RSxDQUFDO0NBQUE7QUFFRCw4RUFBOEU7QUFDOUUsTUFBTSxVQUFnQixXQUFXLENBQy9CLE1BQThCLEVBQzlCLElBQTBCLEVBQzFCLGVBQStCOztRQUMvQixNQUFNLFVBQVUsR0FBRyxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsTUFBTSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUMxRDtRQUVELE9BQU8sZUFBZSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLGlDQUNwRCxNQUFNLEtBQ1QsUUFBUSxFQUFFLElBQUksVUFBVSxFQUFFLElBQzFCLENBQUMsRUFBRSxDQUFDO0lBQ1IsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgTG9jYXRvckZhY3RvcnksIFRlc3RFbGVtZW50fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NhbGVuZGFySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGF0ZXBpY2tlci1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRDYWxlbmRhckhhcm5lc3N9IGZyb20gJy4vY2FsZW5kYXItaGFybmVzcyc7XG5cbi8qKiBJbnRlcmZhY2UgZm9yIGEgdGVzdCBoYXJuZXNzIHRoYXQgY2FuIG9wZW4gYW5kIGNsb3NlIGEgY2FsZW5kYXIuICovXG5leHBvcnQgaW50ZXJmYWNlIERhdGVwaWNrZXJUcmlnZ2VyIHtcbiAgaXNDYWxlbmRhck9wZW4oKTogUHJvbWlzZTxib29sZWFuPjtcbiAgb3BlbkNhbGVuZGFyKCk6IFByb21pc2U8dm9pZD47XG4gIGNsb3NlQ2FsZW5kYXIoKTogUHJvbWlzZTx2b2lkPjtcbiAgaGFzQ2FsZW5kYXIoKTogUHJvbWlzZTxib29sZWFuPjtcbiAgZ2V0Q2FsZW5kYXIoZmlsdGVyPzogQ2FsZW5kYXJIYXJuZXNzRmlsdGVycyk6IFByb21pc2U8TWF0Q2FsZW5kYXJIYXJuZXNzPjtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGhhcm5lc3NlcyB0aGF0IGNhbiB0cmlnZ2VyIGEgY2FsZW5kYXIuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGF0ZXBpY2tlclRyaWdnZXJIYXJuZXNzQmFzZSBleHRlbmRzIENvbXBvbmVudEhhcm5lc3MgaW1wbGVtZW50c1xuICBEYXRlcGlja2VyVHJpZ2dlciB7XG4gIC8qKiBXaGV0aGVyIHRoZSB0cmlnZ2VyIGlzIGRpc2FibGVkLiAqL1xuICBhYnN0cmFjdCBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGFzc29jaWF0ZWQgd2l0aCB0aGUgdHJpZ2dlciBpcyBvcGVuLiAqL1xuICBhYnN0cmFjdCBpc0NhbGVuZGFyT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+O1xuXG4gIC8qKiBPcGVucyB0aGUgY2FsZW5kYXIgYXNzb2NpYXRlZCB3aXRoIHRoZSB0cmlnZ2VyLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX29wZW5DYWxlbmRhcigpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKiBPcGVucyB0aGUgY2FsZW5kYXIgaWYgdGhlIHRyaWdnZXIgaXMgZW5hYmxlZCBhbmQgaXQgaGFzIGEgY2FsZW5kYXIuICovXG4gIGFzeW5jIG9wZW5DYWxlbmRhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBbaXNEaXNhYmxlZCwgaGFzQ2FsZW5kYXJdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaXNEaXNhYmxlZCgpLCB0aGlzLmhhc0NhbGVuZGFyKCldKTtcblxuICAgIGlmICghaXNEaXNhYmxlZCAmJiBoYXNDYWxlbmRhcikge1xuICAgICAgcmV0dXJuIHRoaXMuX29wZW5DYWxlbmRhcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGNhbGVuZGFyIGlmIGl0IGlzIG9wZW4uICovXG4gIGFzeW5jIGNsb3NlQ2FsZW5kYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNDYWxlbmRhck9wZW4oKSkge1xuICAgICAgYXdhaXQgY2xvc2VDYWxlbmRhcihnZXRDYWxlbmRhcklkKHRoaXMuaG9zdCgpKSwgdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpKTtcbiAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHNvIHRoYXQgd2Ugd2FpdCBmb3IgdGhlIGNsb3NpbmcgYW5pbWF0aW9uIHRvIGZpbmlzaCBpbiB0b3VjaCBVSSBtb2RlLlxuICAgICAgYXdhaXQgdGhpcy5mb3JjZVN0YWJpbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlcmUgaXMgYSBjYWxlbmRhciBhc3NvY2lhdGVkIHdpdGggdGhlIHRyaWdnZXIuICovXG4gIGFzeW5jIGhhc0NhbGVuZGFyKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgZ2V0Q2FsZW5kYXJJZCh0aGlzLmhvc3QoKSkpICE9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYE1hdENhbGVuZGFySGFybmVzc2AgdGhhdCBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIHRyaWdnZXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIGNhbGVuZGFyIGlzIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q2FsZW5kYXIoZmlsdGVyOiBDYWxlbmRhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdENhbGVuZGFySGFybmVzcz4ge1xuICAgIHJldHVybiBnZXRDYWxlbmRhcihmaWx0ZXIsIHRoaXMuaG9zdCgpLCB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCkpO1xuICB9XG59XG5cbi8qKiBHZXRzIHRoZSBJRCBvZiB0aGUgY2FsZW5kYXIgdGhhdCBhIHBhcnRpY3VsYXIgdGVzdCBlbGVtZW50IGNhbiB0cmlnZ2VyLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENhbGVuZGFySWQoaG9zdDogUHJvbWlzZTxUZXN0RWxlbWVudD4pOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgcmV0dXJuIChhd2FpdCBob3N0KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWNhbGVuZGFyJyk7XG59XG5cbi8qKiBDbG9zZXMgdGhlIGNhbGVuZGFyIHdpdGggYSBzcGVjaWZpYyBJRC4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbG9zZUNhbGVuZGFyKFxuICBjYWxlbmRhcklkOiBQcm9taXNlPHN0cmluZyB8IG51bGw+LFxuICBkb2N1bWVudExvY2F0b3I6IExvY2F0b3JGYWN0b3J5KSB7XG4gIC8vIFdlIGNsb3NlIHRoZSBjYWxlbmRhciBieSBjbGlja2luZyBvbiB0aGUgYmFja2Ryb3AsIGV2ZW4gdGhvdWdoIGFsbCBkYXRlcGlja2VyIHZhcmlhbnRzXG4gIC8vIGhhdmUgdGhlIGFiaWxpdHkgdG8gY2xvc2UgYnkgcHJlc3NpbmcgZXNjYXBlLiBUaGUgYmFja2Ryb3AgaXMgcHJlZmVycmFibGUsIGJlY2F1c2UgdGhlXG4gIC8vIGVzY2FwZSBrZXkgaGFzIG11bHRpcGxlIGZ1bmN0aW9ucyBpbnNpZGUgYSByYW5nZSBwaWNrZXIgKGVpdGhlciBjYW5jZWwgdGhlIGN1cnJlbnQgcmFuZ2VcbiAgLy8gb3IgY2xvc2UgdGhlIGNhbGVuZGFyKS4gU2luY2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gc2V0IHRoZSBJRCBvbiB0aGUgYmFja2Ryb3AgaW4gYWxsXG4gIC8vIGNhc2VzLCB3ZSBzZXQgYSB1bmlxdWUgY2xhc3MgaW5zdGVhZCB3aGljaCBpcyB0aGUgc2FtZSBhcyB0aGUgY2FsZW5kYXIncyBJRCBhbmQgc3VmZml4ZWRcbiAgLy8gd2l0aCBgLWJhY2tkcm9wYC5cbiAgY29uc3QgYmFja2Ryb3BTZWxlY3RvciA9IGAuJHthd2FpdCBjYWxlbmRhcklkfS1iYWNrZHJvcGA7XG4gIHJldHVybiAoYXdhaXQgZG9jdW1lbnRMb2NhdG9yLmxvY2F0b3JGb3IoYmFja2Ryb3BTZWxlY3RvcikoKSkuY2xpY2soKTtcbn1cblxuLyoqIEdldHMgdGhlIHRlc3QgaGFybmVzcyBmb3IgYSBjYWxlbmRhciBhc3NvY2lhdGVkIHdpdGggYSBwYXJ0aWN1bGFyIGhvc3QuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q2FsZW5kYXIoXG4gIGZpbHRlcjogQ2FsZW5kYXJIYXJuZXNzRmlsdGVycyxcbiAgaG9zdDogUHJvbWlzZTxUZXN0RWxlbWVudD4sXG4gIGRvY3VtZW50TG9jYXRvcjogTG9jYXRvckZhY3RvcnkpOiBQcm9taXNlPE1hdENhbGVuZGFySGFybmVzcz4ge1xuICBjb25zdCBjYWxlbmRhcklkID0gYXdhaXQgZ2V0Q2FsZW5kYXJJZChob3N0KTtcblxuICBpZiAoIWNhbGVuZGFySWQpIHtcbiAgICB0aHJvdyBFcnJvcihgRWxlbWVudCBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGEgY2FsZW5kYXJgKTtcbiAgfVxuXG4gIHJldHVybiBkb2N1bWVudExvY2F0b3IubG9jYXRvckZvcihNYXRDYWxlbmRhckhhcm5lc3Mud2l0aCh7XG4gICAgLi4uZmlsdGVyLFxuICAgIHNlbGVjdG9yOiBgIyR7Y2FsZW5kYXJJZH1gXG4gIH0pKSgpO1xufVxuIl19
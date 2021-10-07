/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
/** Base class for the `MatDialogHarness` implementation. */
export class _MatDialogHarnessBase extends 
// @breaking-change 14.0.0 change generic type to MatDialogSection.
ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional(".mat-dialog-title" /* TITLE */);
        this._content = this.locatorForOptional(".mat-dialog-content" /* CONTENT */);
        this._actions = this.locatorForOptional(".mat-dialog-actions" /* ACTIONS */);
    }
    /** Gets the id of the dialog. */
    async getId() {
        const id = await (await this.host()).getAttribute('id');
        // In case no id has been specified, the "id" property always returns
        // an empty string. To make this method more explicit, we return null.
        return id !== '' ? id : null;
    }
    /** Gets the role of the dialog. */
    async getRole() {
        return (await this.host()).getAttribute('role');
    }
    /** Gets the value of the dialog's "aria-label" attribute. */
    async getAriaLabel() {
        return (await this.host()).getAttribute('aria-label');
    }
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    async getAriaLabelledby() {
        return (await this.host()).getAttribute('aria-labelledby');
    }
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    async getAriaDescribedby() {
        return (await this.host()).getAttribute('aria-describedby');
    }
    /**
     * Closes the dialog by pressing escape.
     *
     * Note: this method does nothing if `disableClose` has been set to `true` for the dialog.
     */
    async close() {
        await (await this.host()).sendKeys(TestKey.ESCAPE);
    }
    /** Gets te dialog's text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Gets the dialog's title text. This only works if the dialog is using mat-dialog-title. */
    async getTitleText() {
        return (await this._title())?.text() ?? '';
    }
    /** Gets the dialog's content text. This only works if the dialog is using mat-dialog-content. */
    async getContentText() {
        return (await this._content())?.text() ?? '';
    }
    /** Gets the dialog's actions text. This only works if the dialog is using mat-dialog-actions. */
    async getActionsText() {
        return (await this._actions())?.text() ?? '';
    }
}
/** Harness for interacting with a standard `MatDialog` in tests. */
export class MatDialogHarness extends _MatDialogHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDialogHarness` that meets
     * certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDialogHarness, options);
    }
}
// Developers can provide a custom component or template for the
// dialog. The canonical dialog parent is the "MatDialogContainer".
/** The selector for the host element of a `MatDialog` instance. */
MatDialogHarness.hostSelector = '.mat-dialog-container';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL3Rlc3RpbmcvZGlhbG9nLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdDQUFnQyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBV2pHLDREQUE0RDtBQUM1RCxNQUFNLE9BQU8scUJBQXNCO0FBQy9CLG1FQUFtRTtBQUNuRSxnQ0FBMkQ7SUFGL0Q7O1FBSVksV0FBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsaUNBQXdCLENBQUM7UUFDekQsYUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IscUNBQTBCLENBQUM7UUFDN0QsYUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IscUNBQTBCLENBQUM7SUEwRHpFLENBQUM7SUF4REMsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBQyxLQUFLO1FBQ1QsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELHFFQUFxRTtRQUNyRSxzRUFBc0U7UUFDdEUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBNkIsQ0FBQztJQUM5RSxDQUFDO0lBRUQsNkRBQTZEO0lBQzdELEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsa0VBQWtFO0lBQ2xFLEtBQUssQ0FBQyxpQkFBaUI7UUFDckIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxLQUFLLENBQUMsa0JBQWtCO1FBQ3RCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLEtBQUs7UUFDVCxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCw2QkFBNkI7SUFDN0IsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsNkZBQTZGO0lBQzdGLEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsaUdBQWlHO0lBQ2pHLEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsaUdBQWlHO0lBQ2pHLEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUFFRCxvRUFBb0U7QUFDcEUsTUFBTSxPQUFPLGdCQUFpQixTQUFRLHFCQUFxQjtJQU16RDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQzs7QUFiRCxnRUFBZ0U7QUFDaEUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUM1RCw2QkFBWSxHQUFHLHVCQUF1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGUsIFRlc3RLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RGlhbG9nUm9sZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7RGlhbG9nSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGlhbG9nLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBTZWxlY3RvcnMgZm9yIGRpZmZlcmVudCBzZWN0aW9ucyBvZiB0aGUgbWF0LWRpYWxvZyB0aGF0IGNhbiBjb250YWluIHVzZXIgY29udGVudC4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIE1hdERpYWxvZ1NlY3Rpb24ge1xuICBUSVRMRSA9ICcubWF0LWRpYWxvZy10aXRsZScsXG4gIENPTlRFTlQgPSAnLm1hdC1kaWFsb2ctY29udGVudCcsXG4gIEFDVElPTlMgPSAnLm1hdC1kaWFsb2ctYWN0aW9ucydcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIHRoZSBgTWF0RGlhbG9nSGFybmVzc2AgaW1wbGVtZW50YXRpb24uICovXG5leHBvcnQgY2xhc3MgX01hdERpYWxvZ0hhcm5lc3NCYXNlIGV4dGVuZHNcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMCBjaGFuZ2UgZ2VuZXJpYyB0eXBlIHRvIE1hdERpYWxvZ1NlY3Rpb24uXG4gICAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8TWF0RGlhbG9nU2VjdGlvbiB8IHN0cmluZz4ge1xuXG4gIHByb3RlY3RlZCBfdGl0bGUgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXREaWFsb2dTZWN0aW9uLlRJVExFKTtcbiAgcHJvdGVjdGVkIF9jb250ZW50ID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RGlhbG9nU2VjdGlvbi5DT05URU5UKTtcbiAgcHJvdGVjdGVkIF9hY3Rpb25zID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RGlhbG9nU2VjdGlvbi5BQ1RJT05TKTtcblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIGRpYWxvZy4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGlkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgLy8gSW4gY2FzZSBubyBpZCBoYXMgYmVlbiBzcGVjaWZpZWQsIHRoZSBcImlkXCIgcHJvcGVydHkgYWx3YXlzIHJldHVybnNcbiAgICAvLyBhbiBlbXB0eSBzdHJpbmcuIFRvIG1ha2UgdGhpcyBtZXRob2QgbW9yZSBleHBsaWNpdCwgd2UgcmV0dXJuIG51bGwuXG4gICAgcmV0dXJuIGlkICE9PSAnJyA/IGlkIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByb2xlIG9mIHRoZSBkaWFsb2cuICovXG4gIGFzeW5jIGdldFJvbGUoKTogUHJvbWlzZTxEaWFsb2dSb2xlfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSBhcyBQcm9taXNlPERpYWxvZ1JvbGV8bnVsbD47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGRpYWxvZydzIFwiYXJpYS1sYWJlbFwiIGF0dHJpYnV0ZS4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZGlhbG9nJ3MgXCJhcmlhLWxhYmVsbGVkYnlcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBkaWFsb2cncyBcImFyaWEtZGVzY3JpYmVkYnlcIiBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFEZXNjcmliZWRieSgpOiBQcm9taXNlPHN0cmluZ3xudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBkaWFsb2cgYnkgcHJlc3NpbmcgZXNjYXBlLlxuICAgKlxuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcgaWYgYGRpc2FibGVDbG9zZWAgaGFzIGJlZW4gc2V0IHRvIGB0cnVlYCBmb3IgdGhlIGRpYWxvZy5cbiAgICovXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuc2VuZEtleXMoVGVzdEtleS5FU0NBUEUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGUgZGlhbG9nJ3MgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGlhbG9nJ3MgdGl0bGUgdGV4dC4gVGhpcyBvbmx5IHdvcmtzIGlmIHRoZSBkaWFsb2cgaXMgdXNpbmcgbWF0LWRpYWxvZy10aXRsZS4gKi9cbiAgYXN5bmMgZ2V0VGl0bGVUZXh0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fdGl0bGUoKSk/LnRleHQoKSA/PyAnJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkaWFsb2cncyBjb250ZW50IHRleHQuIFRoaXMgb25seSB3b3JrcyBpZiB0aGUgZGlhbG9nIGlzIHVzaW5nIG1hdC1kaWFsb2ctY29udGVudC4gKi9cbiAgYXN5bmMgZ2V0Q29udGVudFRleHQoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9jb250ZW50KCkpPy50ZXh0KCkgPz8gJyc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGlhbG9nJ3MgYWN0aW9ucyB0ZXh0LiBUaGlzIG9ubHkgd29ya3MgaWYgdGhlIGRpYWxvZyBpcyB1c2luZyBtYXQtZGlhbG9nLWFjdGlvbnMuICovXG4gIGFzeW5jIGdldEFjdGlvbnNUZXh0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYWN0aW9ucygpKT8udGV4dCgpID8/ICcnO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgYE1hdERpYWxvZ2AgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0RGlhbG9nSGFybmVzcyBleHRlbmRzIF9NYXREaWFsb2dIYXJuZXNzQmFzZSB7XG4gIC8vIERldmVsb3BlcnMgY2FuIHByb3ZpZGUgYSBjdXN0b20gY29tcG9uZW50IG9yIHRlbXBsYXRlIGZvciB0aGVcbiAgLy8gZGlhbG9nLiBUaGUgY2Fub25pY2FsIGRpYWxvZyBwYXJlbnQgaXMgdGhlIFwiTWF0RGlhbG9nQ29udGFpbmVyXCIuXG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0RGlhbG9nYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWRpYWxvZy1jb250YWluZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXREaWFsb2dIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBkaWFsb2cgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogRGlhbG9nSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0RGlhbG9nSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXREaWFsb2dIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxufVxuIl19
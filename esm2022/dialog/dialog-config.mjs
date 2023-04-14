/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Configuration for opening a modal dialog with the MatDialog service.
 */
export class MatDialogConfig {
    constructor() {
        /** The ARIA role of the dialog element. */
        this.role = 'dialog';
        /** Custom class for the overlay pane. */
        this.panelClass = '';
        /** Whether the dialog has a backdrop. */
        this.hasBackdrop = true;
        /** Custom class for the backdrop. */
        this.backdropClass = '';
        /** Whether the user can use escape or clicking on the backdrop to close the modal. */
        this.disableClose = false;
        /** Width of the dialog. */
        this.width = '';
        /** Height of the dialog. */
        this.height = '';
        /** Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
        this.maxWidth = '80vw';
        /** Data being injected into the child component. */
        this.data = null;
        /** ID of the element that describes the dialog. */
        this.ariaDescribedBy = null;
        /** ID of the element that labels the dialog. */
        this.ariaLabelledBy = null;
        /** Aria label to assign to the dialog element. */
        this.ariaLabel = null;
        /** Whether this is a modal dialog. Used to set the `aria-modal` attribute. */
        this.ariaModal = true;
        /**
         * Where the dialog should focus on open.
         * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
         * AutoFocusTarget instead.
         */
        this.autoFocus = 'first-tabbable';
        /**
         * Whether the dialog should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
        /** Whether to wait for the opening animation to finish before trapping focus. */
        this.delayFocusTrap = true;
        /**
         * Whether the dialog should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUE0Qkg7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUE1QjtRQWtCRSwyQ0FBMkM7UUFDM0MsU0FBSSxHQUFnQixRQUFRLENBQUM7UUFFN0IseUNBQXlDO1FBQ3pDLGVBQVUsR0FBdUIsRUFBRSxDQUFDO1FBRXBDLHlDQUF5QztRQUN6QyxnQkFBVyxHQUFhLElBQUksQ0FBQztRQUU3QixxQ0FBcUM7UUFDckMsa0JBQWEsR0FBdUIsRUFBRSxDQUFDO1FBRXZDLHNGQUFzRjtRQUN0RixpQkFBWSxHQUFhLEtBQUssQ0FBQztRQUUvQiwyQkFBMkI7UUFDM0IsVUFBSyxHQUFZLEVBQUUsQ0FBQztRQUVwQiw0QkFBNEI7UUFDNUIsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQVFyQiwrRkFBK0Y7UUFDL0YsYUFBUSxHQUFxQixNQUFNLENBQUM7UUFRcEMsb0RBQW9EO1FBQ3BELFNBQUksR0FBYyxJQUFJLENBQUM7UUFLdkIsbURBQW1EO1FBQ25ELG9CQUFlLEdBQW1CLElBQUksQ0FBQztRQUV2QyxnREFBZ0Q7UUFDaEQsbUJBQWMsR0FBbUIsSUFBSSxDQUFDO1FBRXRDLGtEQUFrRDtRQUNsRCxjQUFTLEdBQW1CLElBQUksQ0FBQztRQUVqQyw4RUFBOEU7UUFDOUUsY0FBUyxHQUFhLElBQUksQ0FBQztRQUUzQjs7OztXQUlHO1FBQ0gsY0FBUyxHQUF3QyxnQkFBZ0IsQ0FBQztRQUVsRTs7O1dBR0c7UUFDSCxpQkFBWSxHQUFhLElBQUksQ0FBQztRQUU5QixpRkFBaUY7UUFDakYsbUJBQWMsR0FBYSxJQUFJLENBQUM7UUFLaEM7Ozs7V0FJRztRQUNILHNCQUFpQixHQUFhLElBQUksQ0FBQztRQW1CbkMseUVBQXlFO0lBQzNFLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgSW5qZWN0b3J9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7U2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7X2RlZmF1bHRQYXJhbXN9IGZyb20gJy4vZGlhbG9nLWFuaW1hdGlvbnMnO1xuXG4vKiogT3B0aW9ucyBmb3Igd2hlcmUgdG8gc2V0IGZvY3VzIHRvIGF1dG9tYXRpY2FsbHkgb24gZGlhbG9nIG9wZW4gKi9cbmV4cG9ydCB0eXBlIEF1dG9Gb2N1c1RhcmdldCA9ICdkaWFsb2cnIHwgJ2ZpcnN0LXRhYmJhYmxlJyB8ICdmaXJzdC1oZWFkaW5nJztcblxuLyoqIFZhbGlkIEFSSUEgcm9sZXMgZm9yIGEgZGlhbG9nIGVsZW1lbnQuICovXG5leHBvcnQgdHlwZSBEaWFsb2dSb2xlID0gJ2RpYWxvZycgfCAnYWxlcnRkaWFsb2cnO1xuXG4vKiogUG9zc2libGUgb3ZlcnJpZGVzIGZvciBhIGRpYWxvZydzIHBvc2l0aW9uLiAqL1xuZXhwb3J0IGludGVyZmFjZSBEaWFsb2dQb3NpdGlvbiB7XG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIHRvcCBwb3NpdGlvbi4gKi9cbiAgdG9wPzogc3RyaW5nO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIGJvdHRvbSBwb3NpdGlvbi4gKi9cbiAgYm90dG9tPzogc3RyaW5nO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIGxlZnQgcG9zaXRpb24uICovXG4gIGxlZnQ/OiBzdHJpbmc7XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgcmlnaHQgcG9zaXRpb24uICovXG4gIHJpZ2h0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIG9wZW5pbmcgYSBtb2RhbCBkaWFsb2cgd2l0aCB0aGUgTWF0RGlhbG9nIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb25maWc8RCA9IGFueT4ge1xuICAvKipcbiAgICogV2hlcmUgdGhlIGF0dGFjaGVkIGNvbXBvbmVudCBzaG91bGQgbGl2ZSBpbiBBbmd1bGFyJ3MgKmxvZ2ljYWwqIGNvbXBvbmVudCB0cmVlLlxuICAgKiBUaGlzIGFmZmVjdHMgd2hhdCBpcyBhdmFpbGFibGUgZm9yIGluamVjdGlvbiBhbmQgdGhlIGNoYW5nZSBkZXRlY3Rpb24gb3JkZXIgZm9yIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFudGlhdGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLiBUaGlzIGRvZXMgbm90IGFmZmVjdCB3aGVyZSB0aGUgZGlhbG9nXG4gICAqIGNvbnRlbnQgd2lsbCBiZSByZW5kZXJlZC5cbiAgICovXG4gIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKlxuICAgKiBJbmplY3RvciB1c2VkIGZvciB0aGUgaW5zdGFudGlhdGlvbiBvZiB0aGUgY29tcG9uZW50IHRvIGJlIGF0dGFjaGVkLiBJZiBwcm92aWRlZCxcbiAgICogdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHRoZSBpbmplY3RvciBpbmRpcmVjdGx5IHByb3ZpZGVkIGJ5IGBWaWV3Q29udGFpbmVyUmVmYC5cbiAgICovXG4gIGluamVjdG9yPzogSW5qZWN0b3I7XG5cbiAgLyoqIElEIGZvciB0aGUgZGlhbG9nLiBJZiBvbWl0dGVkLCBhIHVuaXF1ZSBvbmUgd2lsbCBiZSBnZW5lcmF0ZWQuICovXG4gIGlkPzogc3RyaW5nO1xuXG4gIC8qKiBUaGUgQVJJQSByb2xlIG9mIHRoZSBkaWFsb2cgZWxlbWVudC4gKi9cbiAgcm9sZT86IERpYWxvZ1JvbGUgPSAnZGlhbG9nJztcblxuICAvKiogQ3VzdG9tIGNsYXNzIGZvciB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICBwYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW10gPSAnJztcblxuICAvKiogV2hldGhlciB0aGUgZGlhbG9nIGhhcyBhIGJhY2tkcm9wLiAqL1xuICBoYXNCYWNrZHJvcD86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBDdXN0b20gY2xhc3MgZm9yIHRoZSBiYWNrZHJvcC4gKi9cbiAgYmFja2Ryb3BDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgY2FuIHVzZSBlc2NhcGUgb3IgY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wIHRvIGNsb3NlIHRoZSBtb2RhbC4gKi9cbiAgZGlzYWJsZUNsb3NlPzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaWR0aCBvZiB0aGUgZGlhbG9nLiAqL1xuICB3aWR0aD86IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGRpYWxvZy4gKi9cbiAgaGVpZ2h0Pzogc3RyaW5nID0gJyc7XG5cbiAgLyoqIE1pbi13aWR0aCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWluV2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIE1pbi1oZWlnaHQgb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIG1pbkhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWF4LXdpZHRoIG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiBEZWZhdWx0cyB0byA4MHZ3LiAqL1xuICBtYXhXaWR0aD86IG51bWJlciB8IHN0cmluZyA9ICc4MHZ3JztcblxuICAvKiogTWF4LWhlaWdodCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWF4SGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBQb3NpdGlvbiBvdmVycmlkZXMuICovXG4gIHBvc2l0aW9uPzogRGlhbG9nUG9zaXRpb247XG5cbiAgLyoqIERhdGEgYmVpbmcgaW5qZWN0ZWQgaW50byB0aGUgY2hpbGQgY29tcG9uZW50LiAqL1xuICBkYXRhPzogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBMYXlvdXQgZGlyZWN0aW9uIGZvciB0aGUgZGlhbG9nJ3MgY29udGVudC4gKi9cbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IGRlc2NyaWJlcyB0aGUgZGlhbG9nLiAqL1xuICBhcmlhRGVzY3JpYmVkQnk/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogSUQgb2YgdGhlIGVsZW1lbnQgdGhhdCBsYWJlbHMgdGhlIGRpYWxvZy4gKi9cbiAgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogQXJpYSBsYWJlbCB0byBhc3NpZ24gdG8gdGhlIGRpYWxvZyBlbGVtZW50LiAqL1xuICBhcmlhTGFiZWw/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGlzIGlzIGEgbW9kYWwgZGlhbG9nLiBVc2VkIHRvIHNldCB0aGUgYGFyaWEtbW9kYWxgIGF0dHJpYnV0ZS4gKi9cbiAgYXJpYU1vZGFsPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRoZSBkaWFsb2cgc2hvdWxkIGZvY3VzIG9uIG9wZW4uXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBib29sZWFuIG9wdGlvbiBmcm9tIGF1dG9Gb2N1cy4gVXNlIHN0cmluZyBvclxuICAgKiBBdXRvRm9jdXNUYXJnZXQgaW5zdGVhZC5cbiAgICovXG4gIGF1dG9Gb2N1cz86IEF1dG9Gb2N1c1RhcmdldCB8IHN0cmluZyB8IGJvb2xlYW4gPSAnZmlyc3QtdGFiYmFibGUnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaWFsb2cgc2hvdWxkIHJlc3RvcmUgZm9jdXMgdG8gdGhlXG4gICAqIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50LCBhZnRlciBpdCdzIGNsb3NlZC5cbiAgICovXG4gIHJlc3RvcmVGb2N1cz86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHdhaXQgZm9yIHRoZSBvcGVuaW5nIGFuaW1hdGlvbiB0byBmaW5pc2ggYmVmb3JlIHRyYXBwaW5nIGZvY3VzLiAqL1xuICBkZWxheUZvY3VzVHJhcD86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBTY3JvbGwgc3RyYXRlZ3kgdG8gYmUgdXNlZCBmb3IgdGhlIGRpYWxvZy4gKi9cbiAgc2Nyb2xsU3RyYXRlZ3k/OiBTY3JvbGxTdHJhdGVneTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGlhbG9nIHNob3VsZCBjbG9zZSB3aGVuIHRoZSB1c2VyIGdvZXMgYmFja3dhcmRzL2ZvcndhcmRzIGluIGhpc3RvcnkuXG4gICAqIE5vdGUgdGhhdCB0aGlzIHVzdWFsbHkgZG9lc24ndCBpbmNsdWRlIGNsaWNraW5nIG9uIGxpbmtzICh1bmxlc3MgdGhlIHVzZXIgaXMgdXNpbmdcbiAgICogdGhlIGBIYXNoTG9jYXRpb25TdHJhdGVneWApLlxuICAgKi9cbiAgY2xvc2VPbk5hdmlnYXRpb24/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogQWx0ZXJuYXRlIGBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJgIHRvIHVzZSB3aGVuIHJlc29sdmluZyB0aGUgYXNzb2NpYXRlZCBjb21wb25lbnQuICovXG4gIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcj86IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjtcblxuICAvKipcbiAgICogRHVyYXRpb24gb2YgdGhlIGVudGVyIGFuaW1hdGlvbiBpbiBtcy5cbiAgICogU2hvdWxkIGJlIGEgbnVtYmVyLCBzdHJpbmcgdHlwZSBpcyBkZXByZWNhdGVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMCBSZW1vdmUgc3RyaW5nIHNpZ25hdHVyZS5cbiAgICovXG4gIGVudGVyQW5pbWF0aW9uRHVyYXRpb24/OiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLyoqXG4gICAqIER1cmF0aW9uIG9mIHRoZSBleGl0IGFuaW1hdGlvbiBpbiBtcy5cbiAgICogU2hvdWxkIGJlIGEgbnVtYmVyLCBzdHJpbmcgdHlwZSBpcyBkZXByZWNhdGVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMCBSZW1vdmUgc3RyaW5nIHNpZ25hdHVyZS5cbiAgICovXG4gIGV4aXRBbmltYXRpb25EdXJhdGlvbj86IHN0cmluZyB8IG51bWJlcjtcblxuICAvLyBUT0RPKGplbGJvdXJuKTogYWRkIGNvbmZpZ3VyYXRpb24gZm9yIGxpZmVjeWNsZSBob29rcywgQVJJQSBsYWJlbGxpbmcuXG59XG4iXX0=
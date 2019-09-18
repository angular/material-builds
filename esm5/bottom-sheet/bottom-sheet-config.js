/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/** Injection token that can be used to access the data that was passed in to a bottom sheet. */
export var MAT_BOTTOM_SHEET_DATA = new InjectionToken('MatBottomSheetData');
/**
 * Configuration used when opening a bottom sheet.
 */
var MatBottomSheetConfig = /** @class */ (function () {
    function MatBottomSheetConfig() {
        /** Data being injected into the child component. */
        this.data = null;
        /** Whether the bottom sheet has a backdrop. */
        this.hasBackdrop = true;
        /** Whether the user can use escape or clicking outside to close the bottom sheet. */
        this.disableClose = false;
        /** Aria label to assign to the bottom sheet element. */
        this.ariaLabel = null;
        /**
         * Whether the bottom sheet should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        // Note that this is disabled by default, because while the a11y recommendations are to focus
        // the first focusable element, doing so prevents screen readers from reading out the
        // rest of the bottom sheet content.
        /** Whether the bottom sheet should focus the first focusable element on open. */
        this.autoFocus = false;
        /**
         * Whether the bottom sheet should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
    }
    return MatBottomSheetConfig;
}());
export { MatBottomSheetConfig };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFJSCxPQUFPLEVBQUMsY0FBYyxFQUFtQixNQUFNLGVBQWUsQ0FBQztBQUUvRCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLElBQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQU0sb0JBQW9CLENBQUMsQ0FBQztBQUVuRjs7R0FFRztBQUNIO0lBQUE7UUFVRSxvREFBb0Q7UUFDcEQsU0FBSSxHQUFjLElBQUksQ0FBQztRQUV2QiwrQ0FBK0M7UUFDL0MsZ0JBQVcsR0FBYSxJQUFJLENBQUM7UUFLN0IscUZBQXFGO1FBQ3JGLGlCQUFZLEdBQWEsS0FBSyxDQUFDO1FBRS9CLHdEQUF3RDtRQUN4RCxjQUFTLEdBQW1CLElBQUksQ0FBQztRQUVqQzs7OztXQUlHO1FBQ0gsc0JBQWlCLEdBQWEsSUFBSSxDQUFDO1FBRW5DLDZGQUE2RjtRQUM3RixxRkFBcUY7UUFDckYsb0NBQW9DO1FBQ3BDLGlGQUFpRjtRQUNqRixjQUFTLEdBQWEsS0FBSyxDQUFDO1FBRTVCOzs7V0FHRztRQUNILGlCQUFZLEdBQWEsSUFBSSxDQUFDO0lBSWhDLENBQUM7SUFBRCwyQkFBQztBQUFELENBQUMsQUE5Q0QsSUE4Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7U2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7SW5qZWN0aW9uVG9rZW4sIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSBkYXRhIHRoYXQgd2FzIHBhc3NlZCBpbiB0byBhIGJvdHRvbSBzaGVldC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQk9UVE9NX1NIRUVUX0RBVEEgPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignTWF0Qm90dG9tU2hlZXREYXRhJyk7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiB1c2VkIHdoZW4gb3BlbmluZyBhIGJvdHRvbSBzaGVldC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQgPSBhbnk+IHtcbiAgLyoqIFRoZSB2aWV3IGNvbnRhaW5lciB0byBwbGFjZSB0aGUgb3ZlcmxheSBmb3IgdGhlIGJvdHRvbSBzaGVldCBpbnRvLiAqL1xuICB2aWV3Q29udGFpbmVyUmVmPzogVmlld0NvbnRhaW5lclJlZjtcblxuICAvKiogRXh0cmEgQ1NTIGNsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIGJvdHRvbSBzaGVldCBjb250YWluZXIuICovXG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogVGV4dCBsYXlvdXQgZGlyZWN0aW9uIGZvciB0aGUgYm90dG9tIHNoZWV0LiAqL1xuICBkaXJlY3Rpb24/OiBEaXJlY3Rpb247XG5cbiAgLyoqIERhdGEgYmVpbmcgaW5qZWN0ZWQgaW50byB0aGUgY2hpbGQgY29tcG9uZW50LiAqL1xuICBkYXRhPzogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBib3R0b20gc2hlZXQgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyBmb3IgdGhlIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGNhbiB1c2UgZXNjYXBlIG9yIGNsaWNraW5nIG91dHNpZGUgdG8gY2xvc2UgdGhlIGJvdHRvbSBzaGVldC4gKi9cbiAgZGlzYWJsZUNsb3NlPzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBBcmlhIGxhYmVsIHRvIGFzc2lnbiB0byB0aGUgYm90dG9tIHNoZWV0IGVsZW1lbnQuICovXG4gIGFyaWFMYWJlbD86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBib3R0b20gc2hlZXQgc2hvdWxkIGNsb3NlIHdoZW4gdGhlIHVzZXIgZ29lcyBiYWNrd2FyZHMvZm9yd2FyZHMgaW4gaGlzdG9yeS5cbiAgICogTm90ZSB0aGF0IHRoaXMgdXN1YWxseSBkb2Vzbid0IGluY2x1ZGUgY2xpY2tpbmcgb24gbGlua3MgKHVubGVzcyB0aGUgdXNlciBpcyB1c2luZ1xuICAgKiB0aGUgYEhhc2hMb2NhdGlvblN0cmF0ZWd5YCkuXG4gICAqL1xuICBjbG9zZU9uTmF2aWdhdGlvbj86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8vIE5vdGUgdGhhdCB0aGlzIGlzIGRpc2FibGVkIGJ5IGRlZmF1bHQsIGJlY2F1c2Ugd2hpbGUgdGhlIGExMXkgcmVjb21tZW5kYXRpb25zIGFyZSB0byBmb2N1c1xuICAvLyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGRvaW5nIHNvIHByZXZlbnRzIHNjcmVlbiByZWFkZXJzIGZyb20gcmVhZGluZyBvdXQgdGhlXG4gIC8vIHJlc3Qgb2YgdGhlIGJvdHRvbSBzaGVldCBjb250ZW50LlxuICAvKiogV2hldGhlciB0aGUgYm90dG9tIHNoZWV0IHNob3VsZCBmb2N1cyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgb24gb3Blbi4gKi9cbiAgYXV0b0ZvY3VzPzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBib3R0b20gc2hlZXQgc2hvdWxkIHJlc3RvcmUgZm9jdXMgdG8gdGhlXG4gICAqIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50LCBhZnRlciBpdCdzIGNsb3NlZC5cbiAgICovXG4gIHJlc3RvcmVGb2N1cz86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBTY3JvbGwgc3RyYXRlZ3kgdG8gYmUgdXNlZCBmb3IgdGhlIGJvdHRvbSBzaGVldC4gKi9cbiAgc2Nyb2xsU3RyYXRlZ3k/OiBTY3JvbGxTdHJhdGVneTtcbn1cbiJdfQ==
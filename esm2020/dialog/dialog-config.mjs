/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { defaultParams } from './dialog-animations';
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
        /** Duration of the enter animation. Has to be a valid CSS value (e.g. 100ms). */
        this.enterAnimationDuration = defaultParams.params.enterAnimationDuration;
        /** Duration of the exit animation. Has to be a valid CSS value (e.g. 50ms). */
        this.exitAnimationDuration = defaultParams.params.exitAnimationDuration;
        // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFLSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUF1QmxEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGVBQWU7SUFBNUI7UUFrQkUsMkNBQTJDO1FBQzNDLFNBQUksR0FBZ0IsUUFBUSxDQUFDO1FBRTdCLHlDQUF5QztRQUN6QyxlQUFVLEdBQXVCLEVBQUUsQ0FBQztRQUVwQyx5Q0FBeUM7UUFDekMsZ0JBQVcsR0FBYSxJQUFJLENBQUM7UUFFN0IscUNBQXFDO1FBQ3JDLGtCQUFhLEdBQXVCLEVBQUUsQ0FBQztRQUV2QyxzRkFBc0Y7UUFDdEYsaUJBQVksR0FBYSxLQUFLLENBQUM7UUFFL0IsMkJBQTJCO1FBQzNCLFVBQUssR0FBWSxFQUFFLENBQUM7UUFFcEIsNEJBQTRCO1FBQzVCLFdBQU0sR0FBWSxFQUFFLENBQUM7UUFRckIsK0ZBQStGO1FBQy9GLGFBQVEsR0FBcUIsTUFBTSxDQUFDO1FBUXBDLG9EQUFvRDtRQUNwRCxTQUFJLEdBQWMsSUFBSSxDQUFDO1FBS3ZCLG1EQUFtRDtRQUNuRCxvQkFBZSxHQUFtQixJQUFJLENBQUM7UUFFdkMsZ0RBQWdEO1FBQ2hELG1CQUFjLEdBQW1CLElBQUksQ0FBQztRQUV0QyxrREFBa0Q7UUFDbEQsY0FBUyxHQUFtQixJQUFJLENBQUM7UUFFakMsOEVBQThFO1FBQzlFLGNBQVMsR0FBYSxJQUFJLENBQUM7UUFFM0I7Ozs7V0FJRztRQUNILGNBQVMsR0FBd0MsZ0JBQWdCLENBQUM7UUFFbEU7OztXQUdHO1FBQ0gsaUJBQVksR0FBYSxJQUFJLENBQUM7UUFFOUIsaUZBQWlGO1FBQ2pGLG1CQUFjLEdBQWEsSUFBSSxDQUFDO1FBS2hDOzs7O1dBSUc7UUFDSCxzQkFBaUIsR0FBYSxJQUFJLENBQUM7UUFLbkMsaUZBQWlGO1FBQ2pGLDJCQUFzQixHQUFZLGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUM7UUFFOUUsK0VBQStFO1FBQy9FLDBCQUFxQixHQUFZLGFBQWEsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUM7UUFFNUUseUVBQXlFO0lBQzNFLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgSW5qZWN0b3J9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7U2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7ZGVmYXVsdFBhcmFtc30gZnJvbSAnLi9kaWFsb2ctYW5pbWF0aW9ucyc7XG5cbi8qKiBPcHRpb25zIGZvciB3aGVyZSB0byBzZXQgZm9jdXMgdG8gYXV0b21hdGljYWxseSBvbiBkaWFsb2cgb3BlbiAqL1xuZXhwb3J0IHR5cGUgQXV0b0ZvY3VzVGFyZ2V0ID0gJ2RpYWxvZycgfCAnZmlyc3QtdGFiYmFibGUnIHwgJ2ZpcnN0LWhlYWRpbmcnO1xuXG4vKiogVmFsaWQgQVJJQSByb2xlcyBmb3IgYSBkaWFsb2cgZWxlbWVudC4gKi9cbmV4cG9ydCB0eXBlIERpYWxvZ1JvbGUgPSAnZGlhbG9nJyB8ICdhbGVydGRpYWxvZyc7XG5cbi8qKiBQb3NzaWJsZSBvdmVycmlkZXMgZm9yIGEgZGlhbG9nJ3MgcG9zaXRpb24uICovXG5leHBvcnQgaW50ZXJmYWNlIERpYWxvZ1Bvc2l0aW9uIHtcbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgdG9wIHBvc2l0aW9uLiAqL1xuICB0b3A/OiBzdHJpbmc7XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgYm90dG9tIHBvc2l0aW9uLiAqL1xuICBib3R0b20/OiBzdHJpbmc7XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgbGVmdCBwb3NpdGlvbi4gKi9cbiAgbGVmdD86IHN0cmluZztcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBkaWFsb2cncyByaWdodCBwb3NpdGlvbi4gKi9cbiAgcmlnaHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3Igb3BlbmluZyBhIG1vZGFsIGRpYWxvZyB3aXRoIHRoZSBNYXREaWFsb2cgc2VydmljZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbmZpZzxEID0gYW55PiB7XG4gIC8qKlxuICAgKiBXaGVyZSB0aGUgYXR0YWNoZWQgY29tcG9uZW50IHNob3VsZCBsaXZlIGluIEFuZ3VsYXIncyAqbG9naWNhbCogY29tcG9uZW50IHRyZWUuXG4gICAqIFRoaXMgYWZmZWN0cyB3aGF0IGlzIGF2YWlsYWJsZSBmb3IgaW5qZWN0aW9uIGFuZCB0aGUgY2hhbmdlIGRldGVjdGlvbiBvcmRlciBmb3IgdGhlXG4gICAqIGNvbXBvbmVudCBpbnN0YW50aWF0ZWQgaW5zaWRlIG9mIHRoZSBkaWFsb2cuIFRoaXMgZG9lcyBub3QgYWZmZWN0IHdoZXJlIHRoZSBkaWFsb2dcbiAgICogY29udGVudCB3aWxsIGJlIHJlbmRlcmVkLlxuICAgKi9cbiAgdmlld0NvbnRhaW5lclJlZj86IFZpZXdDb250YWluZXJSZWY7XG5cbiAgLyoqXG4gICAqIEluamVjdG9yIHVzZWQgZm9yIHRoZSBpbnN0YW50aWF0aW9uIG9mIHRoZSBjb21wb25lbnQgdG8gYmUgYXR0YWNoZWQuIElmIHByb3ZpZGVkLFxuICAgKiB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgdGhlIGluamVjdG9yIGluZGlyZWN0bHkgcHJvdmlkZWQgYnkgYFZpZXdDb250YWluZXJSZWZgLlxuICAgKi9cbiAgaW5qZWN0b3I/OiBJbmplY3RvcjtcblxuICAvKiogSUQgZm9yIHRoZSBkaWFsb2cuIElmIG9taXR0ZWQsIGEgdW5pcXVlIG9uZSB3aWxsIGJlIGdlbmVyYXRlZC4gKi9cbiAgaWQ/OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBBUklBIHJvbGUgb2YgdGhlIGRpYWxvZyBlbGVtZW50LiAqL1xuICByb2xlPzogRGlhbG9nUm9sZSA9ICdkaWFsb2cnO1xuXG4gIC8qKiBDdXN0b20gY2xhc3MgZm9yIHRoZSBvdmVybGF5IHBhbmUuICovXG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXSA9ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkaWFsb2cgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyBmb3IgdGhlIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW10gPSAnJztcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBjYW4gdXNlIGVzY2FwZSBvciBjbGlja2luZyBvbiB0aGUgYmFja2Ryb3AgdG8gY2xvc2UgdGhlIG1vZGFsLiAqL1xuICBkaXNhYmxlQ2xvc2U/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBkaWFsb2cuICovXG4gIHdpZHRoPzogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgZGlhbG9nLiAqL1xuICBoZWlnaHQ/OiBzdHJpbmcgPSAnJztcblxuICAvKiogTWluLXdpZHRoIG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtaW5XaWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWluLWhlaWdodCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWluSGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBNYXgtd2lkdGggb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuIERlZmF1bHRzIHRvIDgwdncuICovXG4gIG1heFdpZHRoPzogbnVtYmVyIHwgc3RyaW5nID0gJzgwdncnO1xuXG4gIC8qKiBNYXgtaGVpZ2h0IG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtYXhIZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIFBvc2l0aW9uIG92ZXJyaWRlcy4gKi9cbiAgcG9zaXRpb24/OiBEaWFsb2dQb3NpdGlvbjtcblxuICAvKiogRGF0YSBiZWluZyBpbmplY3RlZCBpbnRvIHRoZSBjaGlsZCBjb21wb25lbnQuICovXG4gIGRhdGE/OiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gZm9yIHRoZSBkaWFsb2cncyBjb250ZW50LiAqL1xuICBkaXJlY3Rpb24/OiBEaXJlY3Rpb247XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgZGVzY3JpYmVzIHRoZSBkaWFsb2cuICovXG4gIGFyaWFEZXNjcmliZWRCeT86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IGxhYmVscyB0aGUgZGlhbG9nLiAqL1xuICBhcmlhTGFiZWxsZWRCeT86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBcmlhIGxhYmVsIHRvIGFzc2lnbiB0byB0aGUgZGlhbG9nIGVsZW1lbnQuICovXG4gIGFyaWFMYWJlbD86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgaXMgYSBtb2RhbCBkaWFsb2cuIFVzZWQgdG8gc2V0IHRoZSBgYXJpYS1tb2RhbGAgYXR0cmlidXRlLiAqL1xuICBhcmlhTW9kYWw/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogV2hlcmUgdGhlIGRpYWxvZyBzaG91bGQgZm9jdXMgb24gb3Blbi5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjAgUmVtb3ZlIGJvb2xlYW4gb3B0aW9uIGZyb20gYXV0b0ZvY3VzLiBVc2Ugc3RyaW5nIG9yXG4gICAqIEF1dG9Gb2N1c1RhcmdldCBpbnN0ZWFkLlxuICAgKi9cbiAgYXV0b0ZvY3VzPzogQXV0b0ZvY3VzVGFyZ2V0IHwgc3RyaW5nIHwgYm9vbGVhbiA9ICdmaXJzdC10YWJiYWJsZSc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRpYWxvZyBzaG91bGQgcmVzdG9yZSBmb2N1cyB0byB0aGVcbiAgICogcHJldmlvdXNseS1mb2N1c2VkIGVsZW1lbnQsIGFmdGVyIGl0J3MgY2xvc2VkLlxuICAgKi9cbiAgcmVzdG9yZUZvY3VzPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdG8gd2FpdCBmb3IgdGhlIG9wZW5pbmcgYW5pbWF0aW9uIHRvIGZpbmlzaCBiZWZvcmUgdHJhcHBpbmcgZm9jdXMuICovXG4gIGRlbGF5Rm9jdXNUcmFwPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFNjcm9sbCBzdHJhdGVneSB0byBiZSB1c2VkIGZvciB0aGUgZGlhbG9nLiAqL1xuICBzY3JvbGxTdHJhdGVneT86IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaWFsb2cgc2hvdWxkIGNsb3NlIHdoZW4gdGhlIHVzZXIgZ29lcyBiYWNrd2FyZHMvZm9yd2FyZHMgaW4gaGlzdG9yeS5cbiAgICogTm90ZSB0aGF0IHRoaXMgdXN1YWxseSBkb2Vzbid0IGluY2x1ZGUgY2xpY2tpbmcgb24gbGlua3MgKHVubGVzcyB0aGUgdXNlciBpcyB1c2luZ1xuICAgKiB0aGUgYEhhc2hMb2NhdGlvblN0cmF0ZWd5YCkuXG4gICAqL1xuICBjbG9zZU9uTmF2aWdhdGlvbj86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBBbHRlcm5hdGUgYENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcmAgdG8gdXNlIHdoZW4gcmVzb2x2aW5nIHRoZSBhc3NvY2lhdGVkIGNvbXBvbmVudC4gKi9cbiAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyPzogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuXG4gIC8qKiBEdXJhdGlvbiBvZiB0aGUgZW50ZXIgYW5pbWF0aW9uLiBIYXMgdG8gYmUgYSB2YWxpZCBDU1MgdmFsdWUgKGUuZy4gMTAwbXMpLiAqL1xuICBlbnRlckFuaW1hdGlvbkR1cmF0aW9uPzogc3RyaW5nID0gZGVmYXVsdFBhcmFtcy5wYXJhbXMuZW50ZXJBbmltYXRpb25EdXJhdGlvbjtcblxuICAvKiogRHVyYXRpb24gb2YgdGhlIGV4aXQgYW5pbWF0aW9uLiBIYXMgdG8gYmUgYSB2YWxpZCBDU1MgdmFsdWUgKGUuZy4gNTBtcykuICovXG4gIGV4aXRBbmltYXRpb25EdXJhdGlvbj86IHN0cmluZyA9IGRlZmF1bHRQYXJhbXMucGFyYW1zLmV4aXRBbmltYXRpb25EdXJhdGlvbjtcblxuICAvLyBUT0RPKGplbGJvdXJuKTogYWRkIGNvbmZpZ3VyYXRpb24gZm9yIGxpZmVjeWNsZSBob29rcywgQVJJQSBsYWJlbGxpbmcuXG59XG4iXX0=
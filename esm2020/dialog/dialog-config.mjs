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
        /**
         * Whether the dialog should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUEyQkg7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUE1QjtRQVlFLDJDQUEyQztRQUMzQyxTQUFJLEdBQWdCLFFBQVEsQ0FBQztRQUU3Qix5Q0FBeUM7UUFDekMsZUFBVSxHQUF1QixFQUFFLENBQUM7UUFFcEMseUNBQXlDO1FBQ3pDLGdCQUFXLEdBQWEsSUFBSSxDQUFDO1FBRTdCLHFDQUFxQztRQUNyQyxrQkFBYSxHQUF1QixFQUFFLENBQUM7UUFFdkMsc0ZBQXNGO1FBQ3RGLGlCQUFZLEdBQWEsS0FBSyxDQUFDO1FBRS9CLDJCQUEyQjtRQUMzQixVQUFLLEdBQVksRUFBRSxDQUFDO1FBRXBCLDRCQUE0QjtRQUM1QixXQUFNLEdBQVksRUFBRSxDQUFDO1FBUXJCLCtGQUErRjtRQUMvRixhQUFRLEdBQXFCLE1BQU0sQ0FBQztRQVFwQyxvREFBb0Q7UUFDcEQsU0FBSSxHQUFjLElBQUksQ0FBQztRQUt2QixtREFBbUQ7UUFDbkQsb0JBQWUsR0FBbUIsSUFBSSxDQUFDO1FBRXZDLGdEQUFnRDtRQUNoRCxtQkFBYyxHQUFtQixJQUFJLENBQUM7UUFFdEMsa0RBQWtEO1FBQ2xELGNBQVMsR0FBbUIsSUFBSSxDQUFDO1FBRWpDOzs7O1dBSUc7UUFDSCxjQUFTLEdBQXdDLGdCQUFnQixDQUFDO1FBRWxFOzs7V0FHRztRQUNILGlCQUFZLEdBQWEsSUFBSSxDQUFDO1FBSzlCOzs7O1dBSUc7UUFDSCxzQkFBaUIsR0FBYSxJQUFJLENBQUM7UUFLbkMseUVBQXlFO0lBQzNFLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtTY3JvbGxTdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuXG4vKiogT3B0aW9ucyBmb3Igd2hlcmUgdG8gc2V0IGZvY3VzIHRvIGF1dG9tYXRpY2FsbHkgb24gZGlhbG9nIG9wZW4gKi9cbmV4cG9ydCB0eXBlIEF1dG9Gb2N1c1RhcmdldCA9ICdkaWFsb2cnIHwgJ2ZpcnN0LXRhYmJhYmxlJyB8ICdmaXJzdC1oZWFkaW5nJztcblxuLyoqIFZhbGlkIEFSSUEgcm9sZXMgZm9yIGEgZGlhbG9nIGVsZW1lbnQuICovXG5leHBvcnQgdHlwZSBEaWFsb2dSb2xlID0gJ2RpYWxvZycgfCAnYWxlcnRkaWFsb2cnO1xuXG4vKiogUG9zc2libGUgb3ZlcnJpZGVzIGZvciBhIGRpYWxvZydzIHBvc2l0aW9uLiAqL1xuZXhwb3J0IGludGVyZmFjZSBEaWFsb2dQb3NpdGlvbiB7XG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIHRvcCBwb3NpdGlvbi4gKi9cbiAgdG9wPzogc3RyaW5nO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIGJvdHRvbSBwb3NpdGlvbi4gKi9cbiAgYm90dG9tPzogc3RyaW5nO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGRpYWxvZydzIGxlZnQgcG9zaXRpb24uICovXG4gIGxlZnQ/OiBzdHJpbmc7XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgZGlhbG9nJ3MgcmlnaHQgcG9zaXRpb24uICovXG4gIHJpZ2h0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIG9wZW5pbmcgYSBtb2RhbCBkaWFsb2cgd2l0aCB0aGUgTWF0RGlhbG9nIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dDb25maWc8RCA9IGFueT4ge1xuICAvKipcbiAgICogV2hlcmUgdGhlIGF0dGFjaGVkIGNvbXBvbmVudCBzaG91bGQgbGl2ZSBpbiBBbmd1bGFyJ3MgKmxvZ2ljYWwqIGNvbXBvbmVudCB0cmVlLlxuICAgKiBUaGlzIGFmZmVjdHMgd2hhdCBpcyBhdmFpbGFibGUgZm9yIGluamVjdGlvbiBhbmQgdGhlIGNoYW5nZSBkZXRlY3Rpb24gb3JkZXIgZm9yIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFudGlhdGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLiBUaGlzIGRvZXMgbm90IGFmZmVjdCB3aGVyZSB0aGUgZGlhbG9nXG4gICAqIGNvbnRlbnQgd2lsbCBiZSByZW5kZXJlZC5cbiAgICovXG4gIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKiBJRCBmb3IgdGhlIGRpYWxvZy4gSWYgb21pdHRlZCwgYSB1bmlxdWUgb25lIHdpbGwgYmUgZ2VuZXJhdGVkLiAqL1xuICBpZD86IHN0cmluZztcblxuICAvKiogVGhlIEFSSUEgcm9sZSBvZiB0aGUgZGlhbG9nIGVsZW1lbnQuICovXG4gIHJvbGU/OiBEaWFsb2dSb2xlID0gJ2RpYWxvZyc7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyBmb3IgdGhlIG92ZXJsYXkgcGFuZS4gKi9cbiAgcGFuZWxDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpYWxvZyBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogQ3VzdG9tIGNsYXNzIGZvciB0aGUgYmFja2Ryb3AuICovXG4gIGJhY2tkcm9wQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXSA9ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGNhbiB1c2UgZXNjYXBlIG9yIGNsaWNraW5nIG9uIHRoZSBiYWNrZHJvcCB0byBjbG9zZSB0aGUgbW9kYWwuICovXG4gIGRpc2FibGVDbG9zZT86IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2lkdGggb2YgdGhlIGRpYWxvZy4gKi9cbiAgd2lkdGg/OiBzdHJpbmcgPSAnJztcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBkaWFsb2cuICovXG4gIGhlaWdodD86IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBNaW4td2lkdGggb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIG1pbldpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBNaW4taGVpZ2h0IG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtaW5IZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIE1heC13aWR0aCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gRGVmYXVsdHMgdG8gODB2dy4gKi9cbiAgbWF4V2lkdGg/OiBudW1iZXIgfCBzdHJpbmcgPSAnODB2dyc7XG5cbiAgLyoqIE1heC1oZWlnaHQgb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIG1heEhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogUG9zaXRpb24gb3ZlcnJpZGVzLiAqL1xuICBwb3NpdGlvbj86IERpYWxvZ1Bvc2l0aW9uO1xuXG4gIC8qKiBEYXRhIGJlaW5nIGluamVjdGVkIGludG8gdGhlIGNoaWxkIGNvbXBvbmVudC4gKi9cbiAgZGF0YT86IEQgfCBudWxsID0gbnVsbDtcblxuICAvKiogTGF5b3V0IGRpcmVjdGlvbiBmb3IgdGhlIGRpYWxvZydzIGNvbnRlbnQuICovXG4gIGRpcmVjdGlvbj86IERpcmVjdGlvbjtcblxuICAvKiogSUQgb2YgdGhlIGVsZW1lbnQgdGhhdCBkZXNjcmliZXMgdGhlIGRpYWxvZy4gKi9cbiAgYXJpYURlc2NyaWJlZEJ5Pzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgbGFiZWxzIHRoZSBkaWFsb2cuICovXG4gIGFyaWFMYWJlbGxlZEJ5Pzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEFyaWEgbGFiZWwgdG8gYXNzaWduIHRvIHRoZSBkaWFsb2cgZWxlbWVudC4gKi9cbiAgYXJpYUxhYmVsPzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRoZSBkaWFsb2cgc2hvdWxkIGZvY3VzIG9uIG9wZW4uXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBib29sZWFuIG9wdGlvbiBmcm9tIGF1dG9Gb2N1cy4gVXNlIHN0cmluZyBvclxuICAgKiBBdXRvRm9jdXNUYXJnZXQgaW5zdGVhZC5cbiAgICovXG4gIGF1dG9Gb2N1cz86IEF1dG9Gb2N1c1RhcmdldCB8IHN0cmluZyB8IGJvb2xlYW4gPSAnZmlyc3QtdGFiYmFibGUnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaWFsb2cgc2hvdWxkIHJlc3RvcmUgZm9jdXMgdG8gdGhlXG4gICAqIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50LCBhZnRlciBpdCdzIGNsb3NlZC5cbiAgICovXG4gIHJlc3RvcmVGb2N1cz86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBTY3JvbGwgc3RyYXRlZ3kgdG8gYmUgdXNlZCBmb3IgdGhlIGRpYWxvZy4gKi9cbiAgc2Nyb2xsU3RyYXRlZ3k/OiBTY3JvbGxTdHJhdGVneTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGlhbG9nIHNob3VsZCBjbG9zZSB3aGVuIHRoZSB1c2VyIGdvZXMgYmFja3dhcmRzL2ZvcndhcmRzIGluIGhpc3RvcnkuXG4gICAqIE5vdGUgdGhhdCB0aGlzIHVzdWFsbHkgZG9lc24ndCBpbmNsdWRlIGNsaWNraW5nIG9uIGxpbmtzICh1bmxlc3MgdGhlIHVzZXIgaXMgdXNpbmdcbiAgICogdGhlIGBIYXNoTG9jYXRpb25TdHJhdGVneWApLlxuICAgKi9cbiAgY2xvc2VPbk5hdmlnYXRpb24/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogQWx0ZXJuYXRlIGBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJgIHRvIHVzZSB3aGVuIHJlc29sdmluZyB0aGUgYXNzb2NpYXRlZCBjb21wb25lbnQuICovXG4gIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcj86IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjtcblxuICAvLyBUT0RPKGplbGJvdXJuKTogYWRkIGNvbmZpZ3VyYXRpb24gZm9yIGxpZmVjeWNsZSBob29rcywgQVJJQSBsYWJlbGxpbmcuXG59XG4iXX0=
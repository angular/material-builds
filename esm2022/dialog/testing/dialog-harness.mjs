/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, TestKey, } from '@angular/cdk/testing';
/** Harness for interacting with a standard `MatDialog` in tests. */
export class MatDialogHarness
// @breaking-change 14.0.0 change generic type to MatDialogSection.
 extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional(".mat-mdc-dialog-title" /* MatDialogSection.TITLE */);
        this._content = this.locatorForOptional(".mat-mdc-dialog-content" /* MatDialogSection.CONTENT */);
        this._actions = this.locatorForOptional(".mat-mdc-dialog-actions" /* MatDialogSection.ACTIONS */);
    }
    /** The selector for the host element of a `MatDialog` instance. */
    static { this.hostSelector = '.mat-mdc-dialog-container'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a dialog with specific attributes.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL3Rlc3RpbmcvZGlhbG9nLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsRUFDaEIsT0FBTyxHQUNSLE1BQU0sc0JBQXNCLENBQUM7QUFXOUIsb0VBQW9FO0FBQ3BFLE1BQU0sT0FBTyxnQkFBZ0I7QUFDM0IsbUVBQW1FO0FBQ25FLFNBQVEsZ0NBQTJEO0lBRnJFOztRQW1CWSxXQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixzREFBd0IsQ0FBQztRQUN6RCxhQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQiwwREFBMEIsQ0FBQztRQUM3RCxhQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQiwwREFBMEIsQ0FBQztJQTBEekUsQ0FBQztJQTNFQyxtRUFBbUU7YUFDNUQsaUJBQVksR0FBRywyQkFBMkIsQUFBOUIsQ0FBK0I7SUFFbEQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBZ0MsRUFBRTtRQUVsQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFNRCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLEtBQUs7UUFDVCxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQscUVBQXFFO1FBQ3JFLHNFQUFzRTtRQUN0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQy9CLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUErQixDQUFDO0lBQ2hGLENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsS0FBSyxDQUFDLGlCQUFpQjtRQUNyQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLEtBQUssQ0FBQyxrQkFBa0I7UUFDdEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsS0FBSztRQUNULE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELDZCQUE2QjtJQUM3QixLQUFLLENBQUMsT0FBTztRQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCw2RkFBNkY7SUFDN0YsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxpR0FBaUc7SUFDakcsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxpR0FBaUc7SUFDakcsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEtleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtEaWFsb2dIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kaWFsb2ctaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7RGlhbG9nUm9sZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcblxuLyoqIFNlbGVjdG9ycyBmb3IgZGlmZmVyZW50IHNlY3Rpb25zIG9mIHRoZSBtYXQtZGlhbG9nIHRoYXQgY2FuIGNvbnRhaW4gdXNlciBjb250ZW50LiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gTWF0RGlhbG9nU2VjdGlvbiB7XG4gIFRJVExFID0gJy5tYXQtbWRjLWRpYWxvZy10aXRsZScsXG4gIENPTlRFTlQgPSAnLm1hdC1tZGMtZGlhbG9nLWNvbnRlbnQnLFxuICBBQ1RJT05TID0gJy5tYXQtbWRjLWRpYWxvZy1hY3Rpb25zJyxcbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBgTWF0RGlhbG9nYCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXREaWFsb2dIYXJuZXNzXG4gIC8vIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIGNoYW5nZSBnZW5lcmljIHR5cGUgdG8gTWF0RGlhbG9nU2VjdGlvbi5cbiAgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxNYXREaWFsb2dTZWN0aW9uIHwgc3RyaW5nPlxue1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdERpYWxvZ2AgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtZGlhbG9nLWNvbnRhaW5lcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgZGlhbG9nIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGRpYWxvZyBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aDxUIGV4dGVuZHMgTWF0RGlhbG9nSGFybmVzcz4oXG4gICAgdGhpczogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM6IERpYWxvZ0hhcm5lc3NGaWx0ZXJzID0ge30sXG4gICk6IEhhcm5lc3NQcmVkaWNhdGU8VD4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZSh0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdGl0bGUgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbChNYXREaWFsb2dTZWN0aW9uLlRJVExFKTtcbiAgcHJvdGVjdGVkIF9jb250ZW50ID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RGlhbG9nU2VjdGlvbi5DT05URU5UKTtcbiAgcHJvdGVjdGVkIF9hY3Rpb25zID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RGlhbG9nU2VjdGlvbi5BQ1RJT05TKTtcblxuICAvKiogR2V0cyB0aGUgaWQgb2YgdGhlIGRpYWxvZy4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgaWQgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAvLyBJbiBjYXNlIG5vIGlkIGhhcyBiZWVuIHNwZWNpZmllZCwgdGhlIFwiaWRcIiBwcm9wZXJ0eSBhbHdheXMgcmV0dXJuc1xuICAgIC8vIGFuIGVtcHR5IHN0cmluZy4gVG8gbWFrZSB0aGlzIG1ldGhvZCBtb3JlIGV4cGxpY2l0LCB3ZSByZXR1cm4gbnVsbC5cbiAgICByZXR1cm4gaWQgIT09ICcnID8gaWQgOiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJvbGUgb2YgdGhlIGRpYWxvZy4gKi9cbiAgYXN5bmMgZ2V0Um9sZSgpOiBQcm9taXNlPERpYWxvZ1JvbGUgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdyb2xlJykgYXMgUHJvbWlzZTxEaWFsb2dSb2xlIHwgbnVsbD47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGRpYWxvZydzIFwiYXJpYS1sYWJlbFwiIGF0dHJpYnV0ZS4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBkaWFsb2cncyBcImFyaWEtbGFiZWxsZWRieVwiIGF0dHJpYnV0ZS4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsbGVkYnkoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZGlhbG9nJ3MgXCJhcmlhLWRlc2NyaWJlZGJ5XCIgYXR0cmlidXRlLiAqL1xuICBhc3luYyBnZXRBcmlhRGVzY3JpYmVkYnkoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBkaWFsb2cgYnkgcHJlc3NpbmcgZXNjYXBlLlxuICAgKlxuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcgaWYgYGRpc2FibGVDbG9zZWAgaGFzIGJlZW4gc2V0IHRvIGB0cnVlYCBmb3IgdGhlIGRpYWxvZy5cbiAgICovXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuc2VuZEtleXMoVGVzdEtleS5FU0NBUEUpO1xuICB9XG5cbiAgLyoqIEdldHMgdGUgZGlhbG9nJ3MgdGV4dC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGlhbG9nJ3MgdGl0bGUgdGV4dC4gVGhpcyBvbmx5IHdvcmtzIGlmIHRoZSBkaWFsb2cgaXMgdXNpbmcgbWF0LWRpYWxvZy10aXRsZS4gKi9cbiAgYXN5bmMgZ2V0VGl0bGVUZXh0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fdGl0bGUoKSk/LnRleHQoKSA/PyAnJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkaWFsb2cncyBjb250ZW50IHRleHQuIFRoaXMgb25seSB3b3JrcyBpZiB0aGUgZGlhbG9nIGlzIHVzaW5nIG1hdC1kaWFsb2ctY29udGVudC4gKi9cbiAgYXN5bmMgZ2V0Q29udGVudFRleHQoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9jb250ZW50KCkpPy50ZXh0KCkgPz8gJyc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGlhbG9nJ3MgYWN0aW9ucyB0ZXh0LiBUaGlzIG9ubHkgd29ya3MgaWYgdGhlIGRpYWxvZyBpcyB1c2luZyBtYXQtZGlhbG9nLWFjdGlvbnMuICovXG4gIGFzeW5jIGdldEFjdGlvbnNUZXh0KCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fYWN0aW9ucygpKT8udGV4dCgpID8/ICcnO1xuICB9XG59XG4iXX0=
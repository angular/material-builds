/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TestKey } from '@angular/cdk/testing';
import { MatChipEditInputHarness } from './chip-edit-input-harness';
import { MatChipHarness } from './chip-harness';
/** Harness for interacting with a mat-chip-row in tests. */
export class MatChipRowHarness extends MatChipHarness {
    static { this.hostSelector = '.mat-mdc-chip-row'; }
    /** Whether the chip is editable. */
    async isEditable() {
        return (await this.host()).hasClass('mat-mdc-chip-editable');
    }
    /** Whether the chip is currently being edited. */
    async isEditing() {
        return (await this.host()).hasClass('mat-mdc-chip-editing');
    }
    /** Sets the chip row into an editing state, if it is editable. */
    async startEditing() {
        if (!(await this.isEditable())) {
            throw new Error('Cannot begin editing a chip that is not editable.');
        }
        return (await this.host()).dispatchEvent('dblclick');
    }
    /** Stops editing the chip, if it was in the editing state. */
    async finishEditing() {
        if (await this.isEditing()) {
            await (await this.host()).sendKeys(TestKey.ENTER);
        }
    }
    /** Gets the edit input inside the chip row. */
    async getEditInput(filter = {}) {
        return this.locatorFor(MatChipEditInputHarness.with(filter))();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1yb3ctaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jaGlwcy90ZXN0aW5nL2NoaXAtcm93LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzdDLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUc5Qyw0REFBNEQ7QUFDNUQsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGNBQWM7YUFDbkMsaUJBQVksR0FBRyxtQkFBbUIsQ0FBQztJQUVuRCxvQ0FBb0M7SUFDcEMsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsa0RBQWtEO0lBQ2xELEtBQUssQ0FBQyxTQUFTO1FBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELGtFQUFrRTtJQUNsRSxLQUFLLENBQUMsWUFBWTtRQUNoQixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUN0RTtRQUNELE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsOERBQThEO0lBQzlELEtBQUssQ0FBQyxhQUFhO1FBQ2pCLElBQUksTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUM7SUFFRCwrQ0FBK0M7SUFDL0MsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFzQyxFQUFFO1FBQ3pELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2pFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUZXN0S2V5fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdENoaXBFZGl0SW5wdXRIYXJuZXNzfSBmcm9tICcuL2NoaXAtZWRpdC1pbnB1dC1oYXJuZXNzJztcbmltcG9ydCB7TWF0Q2hpcEhhcm5lc3N9IGZyb20gJy4vY2hpcC1oYXJuZXNzJztcbmltcG9ydCB7Q2hpcEVkaXRJbnB1dEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2NoaXAtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBtYXQtY2hpcC1yb3cgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFJvd0hhcm5lc3MgZXh0ZW5kcyBNYXRDaGlwSGFybmVzcyB7XG4gIHN0YXRpYyBvdmVycmlkZSBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtY2hpcC1yb3cnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGVkaXRhYmxlLiAqL1xuICBhc3luYyBpc0VkaXRhYmxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtbWRjLWNoaXAtZWRpdGFibGUnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGN1cnJlbnRseSBiZWluZyBlZGl0ZWQuICovXG4gIGFzeW5jIGlzRWRpdGluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LW1kYy1jaGlwLWVkaXRpbmcnKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBjaGlwIHJvdyBpbnRvIGFuIGVkaXRpbmcgc3RhdGUsIGlmIGl0IGlzIGVkaXRhYmxlLiAqL1xuICBhc3luYyBzdGFydEVkaXRpbmcoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0VkaXRhYmxlKCkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBiZWdpbiBlZGl0aW5nIGEgY2hpcCB0aGF0IGlzIG5vdCBlZGl0YWJsZS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZGlzcGF0Y2hFdmVudCgnZGJsY2xpY2snKTtcbiAgfVxuXG4gIC8qKiBTdG9wcyBlZGl0aW5nIHRoZSBjaGlwLCBpZiBpdCB3YXMgaW4gdGhlIGVkaXRpbmcgc3RhdGUuICovXG4gIGFzeW5jIGZpbmlzaEVkaXRpbmcoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNFZGl0aW5nKCkpIHtcbiAgICAgIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuc2VuZEtleXMoVGVzdEtleS5FTlRFUik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgdGhlIGVkaXQgaW5wdXQgaW5zaWRlIHRoZSBjaGlwIHJvdy4gKi9cbiAgYXN5bmMgZ2V0RWRpdElucHV0KGZpbHRlcjogQ2hpcEVkaXRJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdENoaXBFZGl0SW5wdXRIYXJuZXNzPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvcihNYXRDaGlwRWRpdElucHV0SGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cbn1cbiJdfQ==
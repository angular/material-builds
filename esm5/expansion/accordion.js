/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { Directive, Input, ContentChildren, QueryList } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { HOME, END, hasModifierKey } from '@angular/cdk/keycodes';
import { startWith } from 'rxjs/operators';
import { MAT_ACCORDION } from './accordion-base';
import { MatExpansionPanelHeader } from './expansion-panel-header';
/**
 * Directive for a Material Design Accordion.
 */
var MatAccordion = /** @class */ (function (_super) {
    __extends(MatAccordion, _super);
    function MatAccordion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Headers belonging to this accordion. */
        _this._ownHeaders = new QueryList();
        _this._hideToggle = false;
        /**
         * Display mode used for all expansion panels in the accordion. Currently two display
         * modes exist:
         *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
         *     panel at a different elevation from the rest of the accordion.
         *  flat - no spacing is placed around expanded panels, showing all panels at the same
         *     elevation.
         */
        _this.displayMode = 'default';
        /** The position of the expansion indicator. */
        _this.togglePosition = 'after';
        return _this;
    }
    Object.defineProperty(MatAccordion.prototype, "hideToggle", {
        /** Whether the expansion indicator should be hidden. */
        get: function () { return this._hideToggle; },
        set: function (show) { this._hideToggle = coerceBooleanProperty(show); },
        enumerable: true,
        configurable: true
    });
    MatAccordion.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._headers.changes
            .pipe(startWith(this._headers))
            .subscribe(function (headers) {
            _this._ownHeaders.reset(headers.filter(function (header) { return header.panel.accordion === _this; }));
            _this._ownHeaders.notifyOnChanges();
        });
        this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap();
    };
    /** Handles keyboard events coming in from the panel headers. */
    MatAccordion.prototype._handleHeaderKeydown = function (event) {
        var keyCode = event.keyCode;
        var manager = this._keyManager;
        if (keyCode === HOME) {
            if (!hasModifierKey(event)) {
                manager.setFirstItemActive();
                event.preventDefault();
            }
        }
        else if (keyCode === END) {
            if (!hasModifierKey(event)) {
                manager.setLastItemActive();
                event.preventDefault();
            }
        }
        else {
            this._keyManager.onKeydown(event);
        }
    };
    MatAccordion.prototype._handleHeaderFocus = function (header) {
        this._keyManager.updateActiveItem(header);
    };
    MatAccordion.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-accordion',
                    exportAs: 'matAccordion',
                    inputs: ['multi'],
                    providers: [{
                            provide: MAT_ACCORDION,
                            useExisting: MatAccordion
                        }],
                    host: {
                        class: 'mat-accordion',
                        // Class binding which is only used by the test harness as there is no other
                        // way for the harness to detect if multiple panel support is enabled.
                        '[class.mat-accordion-multi]': 'this.multi',
                    }
                },] }
    ];
    MatAccordion.propDecorators = {
        _headers: [{ type: ContentChildren, args: [MatExpansionPanelHeader, { descendants: true },] }],
        hideToggle: [{ type: Input }],
        displayMode: [{ type: Input }],
        togglePosition: [{ type: Input }]
    };
    return MatAccordion;
}(CdkAccordion));
export { MatAccordion };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQW1CLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxhQUFhLEVBSWQsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQixPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUVqRTs7R0FFRztBQUNIO0lBZWtDLGdDQUFZO0lBZjlDO1FBQUEscUVBaUZDO1FBL0RDLDJDQUEyQztRQUNuQyxpQkFBVyxHQUFHLElBQUksU0FBUyxFQUEyQixDQUFDO1FBVXZELGlCQUFXLEdBQVksS0FBSyxDQUFDO1FBRXJDOzs7Ozs7O1dBT0c7UUFDTSxpQkFBVyxHQUE0QixTQUFTLENBQUM7UUFFMUQsK0NBQStDO1FBQ3RDLG9CQUFjLEdBQStCLE9BQU8sQ0FBQzs7SUF1Q2hFLENBQUM7SUF2REMsc0JBQ0ksb0NBQVU7UUFGZCx3REFBd0Q7YUFDeEQsY0FDNEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzthQUN0RCxVQUFlLElBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BRDNCO0lBaUJ0RCx5Q0FBa0IsR0FBbEI7UUFBQSxpQkFTQztRQVJDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTzthQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QixTQUFTLENBQUMsVUFBQyxPQUEyQztZQUNyRCxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssS0FBSSxFQUEvQixDQUErQixDQUFDLENBQUMsQ0FBQztZQUNsRixLQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUwsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdEUsQ0FBQztJQUVELGdFQUFnRTtJQUNoRSwyQ0FBb0IsR0FBcEIsVUFBcUIsS0FBb0I7UUFDaEMsSUFBQSx1QkFBTyxDQUFVO1FBQ3hCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFakMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUM3QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDeEI7U0FDRjthQUFNLElBQUksT0FBTyxLQUFLLEdBQUcsRUFBRTtZQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMxQixPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDNUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELHlDQUFrQixHQUFsQixVQUFtQixNQUErQjtRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLENBQUM7O2dCQTdFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7b0JBQ2pCLFNBQVMsRUFBRSxDQUFDOzRCQUNWLE9BQU8sRUFBRSxhQUFhOzRCQUN0QixXQUFXLEVBQUUsWUFBWTt5QkFDMUIsQ0FBQztvQkFDRixJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLGVBQWU7d0JBQ3RCLDRFQUE0RTt3QkFDNUUsc0VBQXNFO3dCQUN0RSw2QkFBNkIsRUFBRSxZQUFZO3FCQUM1QztpQkFDRjs7OzJCQVFFLGVBQWUsU0FBQyx1QkFBdUIsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7NkJBSTVELEtBQUs7OEJBYUwsS0FBSztpQ0FHTCxLQUFLOztJQXVDUixtQkFBQztDQUFBLEFBakZELENBZWtDLFlBQVksR0FrRTdDO1NBbEVZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBDb250ZW50Q2hpbGRyZW4sIFF1ZXJ5TGlzdCwgQWZ0ZXJDb250ZW50SW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q2RrQWNjb3JkaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYWNjb3JkaW9uJztcbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0hPTUUsIEVORCwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgTUFUX0FDQ09SRElPTixcbiAgTWF0QWNjb3JkaW9uQmFzZSxcbiAgTWF0QWNjb3JkaW9uRGlzcGxheU1vZGUsXG4gIE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uXG59IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbEhlYWRlcn0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgZm9yIGEgTWF0ZXJpYWwgRGVzaWduIEFjY29yZGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWFjY29yZGlvbicsXG4gIGV4cG9ydEFzOiAnbWF0QWNjb3JkaW9uJyxcbiAgaW5wdXRzOiBbJ211bHRpJ10sXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBNQVRfQUNDT1JESU9OLFxuICAgIHVzZUV4aXN0aW5nOiBNYXRBY2NvcmRpb25cbiAgfV0sXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1hY2NvcmRpb24nLFxuICAgIC8vIENsYXNzIGJpbmRpbmcgd2hpY2ggaXMgb25seSB1c2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgYXMgdGhlcmUgaXMgbm8gb3RoZXJcbiAgICAvLyB3YXkgZm9yIHRoZSBoYXJuZXNzIHRvIGRldGVjdCBpZiBtdWx0aXBsZSBwYW5lbCBzdXBwb3J0IGlzIGVuYWJsZWQuXG4gICAgJ1tjbGFzcy5tYXQtYWNjb3JkaW9uLW11bHRpXSc6ICd0aGlzLm11bHRpJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRBY2NvcmRpb24gZXh0ZW5kcyBDZGtBY2NvcmRpb24gaW1wbGVtZW50cyBNYXRBY2NvcmRpb25CYXNlLCBBZnRlckNvbnRlbnRJbml0IHtcbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPjtcblxuICAvKiogSGVhZGVycyBiZWxvbmdpbmcgdG8gdGhpcyBhY2NvcmRpb24uICovXG4gIHByaXZhdGUgX293bkhlYWRlcnMgPSBuZXcgUXVlcnlMaXN0PE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPigpO1xuXG4gIC8qKiBBbGwgaGVhZGVycyBpbnNpZGUgdGhlIGFjY29yZGlvbi4gSW5jbHVkZXMgaGVhZGVycyBpbnNpZGUgbmVzdGVkIGFjY29yZGlvbnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIsIHtkZXNjZW5kYW50czogdHJ1ZX0pXG4gIF9oZWFkZXJzOiBRdWVyeUxpc3Q8TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXI+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBleHBhbnNpb24gaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlVG9nZ2xlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZVRvZ2dsZTsgfVxuICBzZXQgaGlkZVRvZ2dsZShzaG93OiBib29sZWFuKSB7IHRoaXMuX2hpZGVUb2dnbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkoc2hvdyk7IH1cbiAgcHJpdmF0ZSBfaGlkZVRvZ2dsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBEaXNwbGF5IG1vZGUgdXNlZCBmb3IgYWxsIGV4cGFuc2lvbiBwYW5lbHMgaW4gdGhlIGFjY29yZGlvbi4gQ3VycmVudGx5IHR3byBkaXNwbGF5XG4gICAqIG1vZGVzIGV4aXN0OlxuICAgKiAgZGVmYXVsdCAtIGEgZ3V0dGVyLWxpa2Ugc3BhY2luZyBpcyBwbGFjZWQgYXJvdW5kIGFueSBleHBhbmRlZCBwYW5lbCwgcGxhY2luZyB0aGUgZXhwYW5kZWRcbiAgICogICAgIHBhbmVsIGF0IGEgZGlmZmVyZW50IGVsZXZhdGlvbiBmcm9tIHRoZSByZXN0IG9mIHRoZSBhY2NvcmRpb24uXG4gICAqICBmbGF0IC0gbm8gc3BhY2luZyBpcyBwbGFjZWQgYXJvdW5kIGV4cGFuZGVkIHBhbmVscywgc2hvd2luZyBhbGwgcGFuZWxzIGF0IHRoZSBzYW1lXG4gICAqICAgICBlbGV2YXRpb24uXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5TW9kZTogTWF0QWNjb3JkaW9uRGlzcGxheU1vZGUgPSAnZGVmYXVsdCc7XG5cbiAgLyoqIFRoZSBwb3NpdGlvbiBvZiB0aGUgZXhwYW5zaW9uIGluZGljYXRvci4gKi9cbiAgQElucHV0KCkgdG9nZ2xlUG9zaXRpb246IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uID0gJ2FmdGVyJztcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faGVhZGVycy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5faGVhZGVycykpXG4gICAgICAuc3Vic2NyaWJlKChoZWFkZXJzOiBRdWVyeUxpc3Q8TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXI+KSA9PiB7XG4gICAgICAgIHRoaXMuX293bkhlYWRlcnMucmVzZXQoaGVhZGVycy5maWx0ZXIoaGVhZGVyID0+IGhlYWRlci5wYW5lbC5hY2NvcmRpb24gPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fb3duSGVhZGVycy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXIodGhpcy5fb3duSGVhZGVycykud2l0aFdyYXAoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBjb21pbmcgaW4gZnJvbSB0aGUgcGFuZWwgaGVhZGVycy4gKi9cbiAgX2hhbmRsZUhlYWRlcktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCB7a2V5Q29kZX0gPSBldmVudDtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIGlmIChrZXlDb2RlID09PSBIT01FKSB7XG4gICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICBtYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gRU5EKSB7XG4gICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICBtYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlSGVhZGVyRm9jdXMoaGVhZGVyOiBNYXRFeHBhbnNpb25QYW5lbEhlYWRlcikge1xuICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShoZWFkZXIpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVUb2dnbGU6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGk6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xufVxuIl19
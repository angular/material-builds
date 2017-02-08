var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, Input } from '@angular/core';
import { MdDialogRef } from './dialog-ref';
/**
 * Button that will close the current dialog.
 */
export var MdDialogClose = (function () {
    function MdDialogClose(dialogRef) {
        this.dialogRef = dialogRef;
        /** Screenreader label for the button. */
        this.ariaLabel = 'Close dialog';
    }
    __decorate([
        Input('aria-label'), 
        __metadata('design:type', String)
    ], MdDialogClose.prototype, "ariaLabel", void 0);
    MdDialogClose = __decorate([
        Directive({
            selector: 'button[md-dialog-close], button[mat-dialog-close]',
            host: {
                '(click)': 'dialogRef.close()',
                '[attr.aria-label]': 'ariaLabel',
                'type': 'button',
            }
        }), 
        __metadata('design:paramtypes', [MdDialogRef])
    ], MdDialogClose);
    return MdDialogClose;
}());
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
export var MdDialogTitle = (function () {
    function MdDialogTitle() {
    }
    MdDialogTitle = __decorate([
        Directive({
            selector: '[md-dialog-title], [mat-dialog-title]',
            host: {
                '[class.mat-dialog-title]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdDialogTitle);
    return MdDialogTitle;
}());
/**
 * Scrollable content container of a dialog.
 */
export var MdDialogContent = (function () {
    function MdDialogContent() {
    }
    MdDialogContent = __decorate([
        Directive({
            selector: '[md-dialog-content], md-dialog-content, [mat-dialog-content], mat-dialog-content',
            host: {
                '[class.mat-dialog-content]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdDialogContent);
    return MdDialogContent;
}());
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
export var MdDialogActions = (function () {
    function MdDialogActions() {
    }
    MdDialogActions = __decorate([
        Directive({
            selector: '[md-dialog-actions], md-dialog-actions, [mat-dialog-actions], mat-dialog-actions',
            host: {
                '[class.mat-dialog-actions]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdDialogActions);
    return MdDialogActions;
}());
//# sourceMappingURL=dialog-content-directives.js.map
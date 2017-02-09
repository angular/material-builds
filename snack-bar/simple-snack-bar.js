var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
export var SimpleSnackBar = (function () {
    function SimpleSnackBar() {
    }
    /** Dismisses the snack bar. */
    SimpleSnackBar.prototype.dismiss = function () {
        this.snackBarRef._action();
    };
    Object.defineProperty(SimpleSnackBar.prototype, "hasAction", {
        /** If the action button should be shown. */
        get: function () { return !!this.action; },
        enumerable: true,
        configurable: true
    });
    SimpleSnackBar = __decorate([
        Component({selector: 'simple-snack-bar',
            template: "<span class=\"mat-simple-snackbar-message\">{{message}}</span> <button class=\"mat-simple-snackbar-action\" *ngIf=\"hasAction\" (click)=\"dismiss()\">{{action}}</button>",
            styles: [":host{display:flex;justify-content:space-between;color:#fff;line-height:20px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif}.mat-simple-snackbar-message{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis}.mat-simple-snackbar-action{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;background:0 0;margin:-5px 0 0;padding:5px;text-transform:uppercase;color:inherit;line-height:inherit;flex-shrink:0;font-family:inherit;font-size:inherit;font-weight:600}"],
            host: {
                '[class.mat-simple-snackbar]': 'true',
            }
        }), 
        __metadata('design:paramtypes', [])
    ], SimpleSnackBar);
    return SimpleSnackBar;
}());
//# sourceMappingURL=simple-snack-bar.js.map
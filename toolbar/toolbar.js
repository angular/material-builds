var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule, Component, ChangeDetectionStrategy, Input, ViewEncapsulation, Directive, ElementRef, Renderer } from '@angular/core';
import { DefaultStyleCompatibilityModeModule } from '../core';
export var MdToolbarRow = (function () {
    function MdToolbarRow() {
    }
    MdToolbarRow = __decorate([
        Directive({
            selector: 'md-toolbar-row, mat-toolbar-row'
        }), 
        __metadata('design:paramtypes', [])
    ], MdToolbarRow);
    return MdToolbarRow;
}());
export var MdToolbar = (function () {
    function MdToolbar(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    Object.defineProperty(MdToolbar.prototype, "color", {
        /** The color of the toolbar. Can be primary, accent, or warn. */
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdToolbar.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdToolbar.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this.renderer.setElementClass(this.elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdToolbar.prototype, "color", null);
    MdToolbar = __decorate([
        Component({selector: 'md-toolbar, mat-toolbar',
            template: "<div class=\"md-toolbar-layout\"><md-toolbar-row><ng-content></ng-content></md-toolbar-row><ng-content select=\"md-toolbar-row, mat-toolbar-row\"></ng-content></div>",
            styles: ["md-toolbar,md-toolbar md-toolbar-row{display:flex;box-sizing:border-box;width:100%}md-toolbar{font-size:20px;font-weight:400;font-family:Roboto,\"Helvetica Neue\",sans-serif;padding:0 16px;flex-direction:column;min-height:64px}md-toolbar md-toolbar-row{flex-direction:row;align-items:center}md-toolbar-row{height:64px}@media (max-width:600px) and (orientation:portrait){md-toolbar{min-height:56px}md-toolbar-row{height:56px}}@media (max-width:960px) and (orientation:landscape){md-toolbar{min-height:48px}md-toolbar-row{height:48px}}"],
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [ElementRef, Renderer])
    ], MdToolbar);
    return MdToolbar;
}());
export var MdToolbarModule = (function () {
    function MdToolbarModule() {
    }
    MdToolbarModule.forRoot = function () {
        return {
            ngModule: MdToolbarModule,
            providers: []
        };
    };
    MdToolbarModule = __decorate([
        NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [MdToolbar, MdToolbarRow, DefaultStyleCompatibilityModeModule],
            declarations: [MdToolbar, MdToolbarRow],
        }), 
        __metadata('design:paramtypes', [])
    ], MdToolbarModule);
    return MdToolbarModule;
}());

//# sourceMappingURL=toolbar.js.map

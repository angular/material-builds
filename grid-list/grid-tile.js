var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation, Renderer, ElementRef, Input, ContentChildren, QueryList, Directive } from '@angular/core';
import { MdLine, MdLineSetter } from '../core';
import { coerceToNumber } from './grid-list-measure';
export var MdGridTile = (function () {
    function MdGridTile(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._rowspan = 1;
        this._colspan = 1;
    }
    Object.defineProperty(MdGridTile.prototype, "rowspan", {
        /** Amount of rows that the grid tile takes up. */
        get: function () { return this._rowspan; },
        set: function (value) { this._rowspan = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridTile.prototype, "colspan", {
        /** Amount of columns that the grid tile takes up. */
        get: function () { return this._colspan; },
        set: function (value) { this._colspan = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    MdGridTile.prototype._setStyle = function (property, value) {
        this._renderer.setElementStyle(this._element.nativeElement, property, value);
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdGridTile.prototype, "rowspan", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdGridTile.prototype, "colspan", null);
    MdGridTile = __decorate([
        Component({selector: 'md-grid-tile, mat-grid-tile',
            host: {
                'role': 'listitem',
                '[class.mat-grid-tile]': 'true',
            },
            template: "<figure class=\"mat-figure\"><ng-content></ng-content></figure>",
            styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{display:flex;position:absolute;align-items:center;justify-content:center;height:100%;top:0;right:0;bottom:0;left:0;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-footer,.mat-grid-tile .mat-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;font-size:16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-footer .mat-line,.mat-grid-tile .mat-grid-tile-header .mat-line{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile .mat-grid-tile-footer .mat-line:nth-child(n+2),.mat-grid-tile .mat-grid-tile-header .mat-line:nth-child(n+2){font-size:12px}.mat-grid-tile .mat-grid-list-text>*,.mat-grid-tile .mat-grid-tile-footer>*,.mat-grid-tile .mat-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-grid-tile .mat-grid-tile-footer.mat-2-line,.mat-grid-tile .mat-grid-tile-header.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-avatar:empty,.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}"],
            encapsulation: ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [Renderer, ElementRef])
    ], MdGridTile);
    return MdGridTile;
}());
export var MdGridTileText = (function () {
    function MdGridTileText(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
    }
    MdGridTileText.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    __decorate([
        ContentChildren(MdLine), 
        __metadata('design:type', QueryList)
    ], MdGridTileText.prototype, "_lines", void 0);
    MdGridTileText = __decorate([
        Component({selector: 'md-grid-tile-header, mat-grid-tile-header, md-grid-tile-footer, mat-grid-tile-footer',
            template: "<ng-content select=\"[md-grid-avatar], [mat-grid-avatar]\"></ng-content><div class=\"mat-grid-list-text\"><ng-content select=\"[md-line], [mat-line]\"></ng-content></div><ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [Renderer, ElementRef])
    ], MdGridTileText);
    return MdGridTileText;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdGridAvatarCssMatStyler = (function () {
    function MdGridAvatarCssMatStyler() {
    }
    MdGridAvatarCssMatStyler = __decorate([
        Directive({
            selector: '[md-grid-avatar], [mat-grid-avatar]',
            host: {
                '[class.mat-grid-avatar]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdGridAvatarCssMatStyler);
    return MdGridAvatarCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdGridTileHeaderCssMatStyler = (function () {
    function MdGridTileHeaderCssMatStyler() {
    }
    MdGridTileHeaderCssMatStyler = __decorate([
        Directive({
            selector: 'md-grid-tile-header, mat-grid-tile-header',
            host: {
                '[class.mat-grid-tile-header]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdGridTileHeaderCssMatStyler);
    return MdGridTileHeaderCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdGridTileFooterCssMatStyler = (function () {
    function MdGridTileFooterCssMatStyler() {
    }
    MdGridTileFooterCssMatStyler = __decorate([
        Directive({
            selector: 'md-grid-tile-footer, mat-grid-tile-footer',
            host: {
                '[class.mat-grid-tile-footer]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdGridTileFooterCssMatStyler);
    return MdGridTileFooterCssMatStyler;
}());
//# sourceMappingURL=grid-tile.js.map
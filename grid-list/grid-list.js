var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { NgModule, Component, ViewEncapsulation, Input, ContentChildren, QueryList, Renderer, ElementRef, Optional } from '@angular/core';
import { MdGridTile, MdGridTileText } from './grid-tile';
import { TileCoordinator } from './tile-coordinator';
import { FitTileStyler, RatioTileStyler, FixedTileStyler } from './tile-styler';
import { MdGridListColsError } from './grid-list-errors';
import { Dir, MdLineModule, DefaultStyleCompatibilityModeModule } from '../core';
import { coerceToString, coerceToNumber } from './grid-list-measure';
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
var MD_FIT_MODE = 'fit';
export var MdGridList = (function () {
    function MdGridList(_renderer, _element, _dir) {
        this._renderer = _renderer;
        this._element = _element;
        this._dir = _dir;
        /** The amount of space between tiles. This will be something like '5px' or '2em'. */
        this._gutter = '1px';
    }
    Object.defineProperty(MdGridList.prototype, "cols", {
        get: function () { return this._cols; },
        set: function (value) { this._cols = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "gutterSize", {
        get: function () { return this._gutter; },
        set: function (value) { this._gutter = coerceToString(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "rowHeight", {
        /** Set internal representation of row height from the user-provided value. */
        set: function (value) {
            this._rowHeight = coerceToString(value);
            this._setTileStyler();
        },
        enumerable: true,
        configurable: true
    });
    MdGridList.prototype.ngOnInit = function () {
        this._checkCols();
        this._checkRowHeight();
    };
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     */
    MdGridList.prototype.ngAfterContentChecked = function () {
        this._layoutTiles();
    };
    /** Throw a friendly error if cols property is missing */
    MdGridList.prototype._checkCols = function () {
        if (!this.cols) {
            throw new MdGridListColsError();
        }
    };
    /** Default to equal width:height if rowHeight property is missing */
    MdGridList.prototype._checkRowHeight = function () {
        if (!this._rowHeight) {
            this._tileStyler = new RatioTileStyler('1:1');
        }
    };
    /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
    MdGridList.prototype._setTileStyler = function () {
        if (this._rowHeight === MD_FIT_MODE) {
            this._tileStyler = new FitTileStyler();
        }
        else if (this._rowHeight && this._rowHeight.match(/:/g)) {
            this._tileStyler = new RatioTileStyler(this._rowHeight);
        }
        else {
            this._tileStyler = new FixedTileStyler(this._rowHeight);
        }
    };
    /** Computes and applies the size and position for all children grid tiles. */
    MdGridList.prototype._layoutTiles = function () {
        var tiles = this._tiles.toArray();
        var tracker = new TileCoordinator(this.cols, tiles);
        var direction = this._dir ? this._dir.value : 'ltr';
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        for (var i = 0; i < tiles.length; i++) {
            var pos = tracker.positions[i];
            var tile = tiles[i];
            this._tileStyler.setStyle(tile, pos.row, pos.col);
        }
        this._setListStyle(this._tileStyler.getComputedHeight());
    };
    /** Sets style on the main grid-list element, given the style name and value. */
    MdGridList.prototype._setListStyle = function (style) {
        if (style) {
            this._renderer.setElementStyle(this._element.nativeElement, style[0], style[1]);
        }
    };
    __decorate([
        ContentChildren(MdGridTile), 
        __metadata('design:type', QueryList)
    ], MdGridList.prototype, "_tiles", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdGridList.prototype, "cols", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdGridList.prototype, "gutterSize", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], MdGridList.prototype, "rowHeight", null);
    MdGridList = __decorate([
        Component({selector: 'md-grid-list, mat-grid-list',
            template: "<div class=\"md-grid-list\"><ng-content></ng-content></div>",
            styles: ["md-grid-list{display:block;position:relative}md-grid-tile{display:block;position:absolute;overflow:hidden}md-grid-tile figure{display:flex;position:absolute;align-items:center;justify-content:center;height:100%;top:0;right:0;bottom:0;left:0;padding:0;margin:0}md-grid-tile md-grid-tile-footer,md-grid-tile md-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;font-size:16px;position:absolute;left:0;right:0}md-grid-tile md-grid-tile-footer [md-line],md-grid-tile md-grid-tile-header [md-line]{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}md-grid-tile md-grid-tile-footer [md-line]:nth-child(n+2),md-grid-tile md-grid-tile-header [md-line]:nth-child(n+2){font-size:12px}md-grid-tile .md-grid-list-text>*,md-grid-tile md-grid-tile-footer>*,md-grid-tile md-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}md-grid-tile md-grid-tile-footer.md-2-line,md-grid-tile md-grid-tile-header.md-2-line{height:68px}md-grid-tile .md-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}md-grid-tile .md-grid-list-text:empty,md-grid-tile [md-grid-avatar]:empty{display:none}md-grid-tile md-grid-tile-header{top:0}md-grid-tile md-grid-tile-footer{bottom:0}md-grid-tile [md-grid-avatar]{padding-right:16px}[dir=rtl] md-grid-tile [md-grid-avatar]{padding-right:0;padding-left:16px}"],
            host: {
                'role': 'list'
            },
            encapsulation: ViewEncapsulation.None,
        }),
        __param(2, Optional()), 
        __metadata('design:paramtypes', [Renderer, ElementRef, Dir])
    ], MdGridList);
    return MdGridList;
}());
export var MdGridListModule = (function () {
    function MdGridListModule() {
    }
    MdGridListModule.forRoot = function () {
        return {
            ngModule: MdGridListModule,
            providers: []
        };
    };
    MdGridListModule = __decorate([
        NgModule({
            imports: [MdLineModule, DefaultStyleCompatibilityModeModule],
            exports: [
                MdGridList,
                MdGridTile,
                MdGridTileText,
                MdLineModule,
                DefaultStyleCompatibilityModeModule,
            ],
            declarations: [MdGridList, MdGridTile, MdGridTileText],
        }), 
        __metadata('design:paramtypes', [])
    ], MdGridListModule);
    return MdGridListModule;
}());

//# sourceMappingURL=grid-list.js.map

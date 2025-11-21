import { TileCoordinator } from './_public-api-chunk.mjs';
export { ɵTileCoordinator } from './_public-api-chunk.mjs';
import { setLines, MatLine, MatLineModule } from './_line-chunk.mjs';
import { Directionality, BidiModule } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ContentChildren, Directive, NgModule } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import 'rxjs/operators';

const MAT_GRID_LIST = new InjectionToken('MAT_GRID_LIST');

class MatGridTile {
  _element = inject(ElementRef);
  _gridList = inject(MAT_GRID_LIST, {
    optional: true
  });
  _rowspan = 1;
  _colspan = 1;
  constructor() {}
  get rowspan() {
    return this._rowspan;
  }
  set rowspan(value) {
    this._rowspan = Math.round(coerceNumberProperty(value));
  }
  get colspan() {
    return this._colspan;
  }
  set colspan(value) {
    this._colspan = Math.round(coerceNumberProperty(value));
  }
  _setStyle(property, value) {
    this._element.nativeElement.style[property] = value;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridTile,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatGridTile,
    isStandalone: true,
    selector: "mat-grid-tile",
    inputs: {
      rowspan: "rowspan",
      colspan: "colspan"
    },
    host: {
      properties: {
        "attr.rowspan": "rowspan",
        "attr.colspan": "colspan"
      },
      classAttribute: "mat-grid-tile"
    },
    exportAs: ["matGridTile"],
    ngImport: i0,
    template: "<div class=\"mat-grid-tile-content\">\n  <ng-content></ng-content>\n</div>\n",
    styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-header{font-size:var(--mat-grid-list-tile-header-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-header .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-header .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-header-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-footer{font-size:var(--mat-grid-list-tile-footer-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-footer .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-footer .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-footer-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatGridTile,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-grid-tile',
      exportAs: 'matGridTile',
      host: {
        'class': 'mat-grid-tile',
        '[attr.rowspan]': 'rowspan',
        '[attr.colspan]': 'colspan'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: "<div class=\"mat-grid-tile-content\">\n  <ng-content></ng-content>\n</div>\n",
      styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-header{font-size:var(--mat-grid-list-tile-header-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-header .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-header .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-header-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-footer{font-size:var(--mat-grid-list-tile-footer-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-footer .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-footer .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-footer-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    rowspan: [{
      type: Input
    }],
    colspan: [{
      type: Input
    }]
  }
});
class MatGridTileText {
  _element = inject(ElementRef);
  _lines;
  constructor() {}
  ngAfterContentInit() {
    setLines(this._lines, this._element);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridTileText,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatGridTileText,
    isStandalone: true,
    selector: "mat-grid-tile-header, mat-grid-tile-footer",
    queries: [{
      propertyName: "_lines",
      predicate: MatLine,
      descendants: true
    }],
    ngImport: i0,
    template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n",
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatGridTileText,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-grid-tile-header, mat-grid-tile-footer',
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n"
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _lines: [{
      type: ContentChildren,
      args: [MatLine, {
        descendants: true
      }]
    }]
  }
});
class MatGridAvatarCssMatStyler {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridAvatarCssMatStyler,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatGridAvatarCssMatStyler,
    isStandalone: true,
    selector: "[mat-grid-avatar], [matGridAvatar]",
    host: {
      classAttribute: "mat-grid-avatar"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatGridAvatarCssMatStyler,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-grid-avatar], [matGridAvatar]',
      host: {
        'class': 'mat-grid-avatar'
      }
    }]
  }]
});
class MatGridTileHeaderCssMatStyler {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridTileHeaderCssMatStyler,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatGridTileHeaderCssMatStyler,
    isStandalone: true,
    selector: "mat-grid-tile-header",
    host: {
      classAttribute: "mat-grid-tile-header"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatGridTileHeaderCssMatStyler,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-grid-tile-header',
      host: {
        'class': 'mat-grid-tile-header'
      }
    }]
  }]
});
class MatGridTileFooterCssMatStyler {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridTileFooterCssMatStyler,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatGridTileFooterCssMatStyler,
    isStandalone: true,
    selector: "mat-grid-tile-footer",
    host: {
      classAttribute: "mat-grid-tile-footer"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatGridTileFooterCssMatStyler,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-grid-tile-footer',
      host: {
        'class': 'mat-grid-tile-footer'
      }
    }]
  }]
});

const cssCalcAllowedValue = /^-?\d+((\.\d+)?[A-Za-z%$]?)+$/;
class TileStyler {
  _gutterSize;
  _rows = 0;
  _rowspan = 0;
  _cols;
  _direction;
  init(gutterSize, tracker, cols, direction) {
    this._gutterSize = normalizeUnits(gutterSize);
    this._rows = tracker.rowCount;
    this._rowspan = tracker.rowspan;
    this._cols = cols;
    this._direction = direction;
  }
  getBaseTileSize(sizePercent, gutterFraction) {
    return `(${sizePercent}% - (${this._gutterSize} * ${gutterFraction}))`;
  }
  getTilePosition(baseSize, offset) {
    return offset === 0 ? '0' : calc(`(${baseSize} + ${this._gutterSize}) * ${offset}`);
  }
  getTileSize(baseSize, span) {
    return `(${baseSize} * ${span}) + (${span - 1} * ${this._gutterSize})`;
  }
  setStyle(tile, rowIndex, colIndex) {
    let percentWidthPerTile = 100 / this._cols;
    let gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
    this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
  }
  setColStyles(tile, colIndex, percentWidth, gutterWidth) {
    let baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
    let side = this._direction === 'rtl' ? 'right' : 'left';
    tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
    tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
  }
  getGutterSpan() {
    return `${this._gutterSize} * (${this._rowspan} - 1)`;
  }
  getTileSpan(tileHeight) {
    return `${this._rowspan} * ${this.getTileSize(tileHeight, 1)}`;
  }
  getComputedHeight() {
    return null;
  }
}
class FixedTileStyler extends TileStyler {
  fixedRowHeight;
  constructor(fixedRowHeight) {
    super();
    this.fixedRowHeight = fixedRowHeight;
  }
  init(gutterSize, tracker, cols, direction) {
    super.init(gutterSize, tracker, cols, direction);
    this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
    if (!cssCalcAllowedValue.test(this.fixedRowHeight) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`Invalid value "${this.fixedRowHeight}" set as rowHeight.`);
    }
  }
  setRowStyles(tile, rowIndex) {
    tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
    tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
  }
  getComputedHeight() {
    return ['height', calc(`${this.getTileSpan(this.fixedRowHeight)} + ${this.getGutterSpan()}`)];
  }
  reset(list) {
    list._setListStyle(['height', null]);
    if (list._tiles) {
      list._tiles.forEach(tile => {
        tile._setStyle('top', null);
        tile._setStyle('height', null);
      });
    }
  }
}
class RatioTileStyler extends TileStyler {
  rowHeightRatio;
  baseTileHeight;
  constructor(value) {
    super();
    this._parseRatio(value);
  }
  setRowStyles(tile, rowIndex, percentWidth, gutterWidth) {
    let percentHeightPerTile = percentWidth / this.rowHeightRatio;
    this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
    tile._setStyle('marginTop', this.getTilePosition(this.baseTileHeight, rowIndex));
    tile._setStyle('paddingTop', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
  }
  getComputedHeight() {
    return ['paddingBottom', calc(`${this.getTileSpan(this.baseTileHeight)} + ${this.getGutterSpan()}`)];
  }
  reset(list) {
    list._setListStyle(['paddingBottom', null]);
    list._tiles.forEach(tile => {
      tile._setStyle('marginTop', null);
      tile._setStyle('paddingTop', null);
    });
  }
  _parseRatio(value) {
    const ratioParts = value.split(':');
    if (ratioParts.length !== 2 && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`mat-grid-list: invalid ratio given for row-height: "${value}"`);
    }
    this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
  }
}
class FitTileStyler extends TileStyler {
  setRowStyles(tile, rowIndex) {
    let percentHeightPerTile = 100 / this._rowspan;
    let gutterHeightPerTile = (this._rows - 1) / this._rows;
    let baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
    tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
    tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
  }
  reset(list) {
    if (list._tiles) {
      list._tiles.forEach(tile => {
        tile._setStyle('top', null);
        tile._setStyle('height', null);
      });
    }
  }
}
function calc(exp) {
  return `calc(${exp})`;
}
function normalizeUnits(value) {
  return value.match(/([A-Za-z%]+)$/) ? value : `${value}px`;
}

const MAT_FIT_MODE = 'fit';
class MatGridList {
  _element = inject(ElementRef);
  _dir = inject(Directionality, {
    optional: true
  });
  _cols;
  _tileCoordinator;
  _rowHeight;
  _gutter = '1px';
  _tileStyler;
  _tiles;
  constructor() {}
  get cols() {
    return this._cols;
  }
  set cols(value) {
    this._cols = Math.max(1, Math.round(coerceNumberProperty(value)));
  }
  get gutterSize() {
    return this._gutter;
  }
  set gutterSize(value) {
    this._gutter = `${value == null ? '' : value}`;
  }
  get rowHeight() {
    return this._rowHeight;
  }
  set rowHeight(value) {
    const newValue = `${value == null ? '' : value}`;
    if (newValue !== this._rowHeight) {
      this._rowHeight = newValue;
      this._setTileStyler(this._rowHeight);
    }
  }
  ngOnInit() {
    this._checkCols();
    this._checkRowHeight();
  }
  ngAfterContentChecked() {
    this._layoutTiles();
  }
  _checkCols() {
    if (!this.cols && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`mat-grid-list: must pass in number of columns. ` + `Example: <mat-grid-list cols="3">`);
    }
  }
  _checkRowHeight() {
    if (!this._rowHeight) {
      this._setTileStyler('1:1');
    }
  }
  _setTileStyler(rowHeight) {
    if (this._tileStyler) {
      this._tileStyler.reset(this);
    }
    if (rowHeight === MAT_FIT_MODE) {
      this._tileStyler = new FitTileStyler();
    } else if (rowHeight && rowHeight.indexOf(':') > -1) {
      this._tileStyler = new RatioTileStyler(rowHeight);
    } else {
      this._tileStyler = new FixedTileStyler(rowHeight);
    }
  }
  _layoutTiles() {
    if (!this._tileCoordinator) {
      this._tileCoordinator = new TileCoordinator();
    }
    const tracker = this._tileCoordinator;
    const tiles = this._tiles.filter(tile => !tile._gridList || tile._gridList === this);
    const direction = this._dir ? this._dir.value : 'ltr';
    this._tileCoordinator.update(this.cols, tiles);
    this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
    tiles.forEach((tile, index) => {
      const pos = tracker.positions[index];
      this._tileStyler.setStyle(tile, pos.row, pos.col);
    });
    this._setListStyle(this._tileStyler.getComputedHeight());
  }
  _setListStyle(style) {
    if (style) {
      this._element.nativeElement.style[style[0]] = style[1];
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridList,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatGridList,
    isStandalone: true,
    selector: "mat-grid-list",
    inputs: {
      cols: "cols",
      gutterSize: "gutterSize",
      rowHeight: "rowHeight"
    },
    host: {
      properties: {
        "attr.cols": "cols"
      },
      classAttribute: "mat-grid-list"
    },
    providers: [{
      provide: MAT_GRID_LIST,
      useExisting: MatGridList
    }],
    queries: [{
      propertyName: "_tiles",
      predicate: MatGridTile,
      descendants: true
    }],
    exportAs: ["matGridList"],
    ngImport: i0,
    template: "<div>\n  <ng-content></ng-content>\n</div>",
    styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-header{font-size:var(--mat-grid-list-tile-header-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-header .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-header .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-header-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-footer{font-size:var(--mat-grid-list-tile-footer-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-footer .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-footer .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-footer-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatGridList,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-grid-list',
      exportAs: 'matGridList',
      host: {
        'class': 'mat-grid-list',
        '[attr.cols]': 'cols'
      },
      providers: [{
        provide: MAT_GRID_LIST,
        useExisting: MatGridList
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: "<div>\n  <ng-content></ng-content>\n</div>",
      styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-header{font-size:var(--mat-grid-list-tile-header-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-header .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-header .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-header-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-footer{font-size:var(--mat-grid-list-tile-footer-primary-text-size, var(--mat-sys-body-large))}.mat-grid-tile-footer .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-footer .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-footer-secondary-text-size, var(--mat-sys-body-medium))}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _tiles: [{
      type: ContentChildren,
      args: [MatGridTile, {
        descendants: true
      }]
    }],
    cols: [{
      type: Input
    }],
    gutterSize: [{
      type: Input
    }],
    rowHeight: [{
      type: Input
    }]
  }
});

class MatGridListModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridListModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridListModule,
    imports: [MatLineModule, MatGridList, MatGridTile, MatGridTileText, MatGridTileHeaderCssMatStyler, MatGridTileFooterCssMatStyler, MatGridAvatarCssMatStyler],
    exports: [BidiModule, MatGridList, MatGridTile, MatGridTileText, MatLineModule, MatGridTileHeaderCssMatStyler, MatGridTileFooterCssMatStyler, MatGridAvatarCssMatStyler]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatGridListModule,
    imports: [MatLineModule, BidiModule, MatLineModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatGridListModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [MatLineModule, MatGridList, MatGridTile, MatGridTileText, MatGridTileHeaderCssMatStyler, MatGridTileFooterCssMatStyler, MatGridAvatarCssMatStyler],
      exports: [BidiModule, MatGridList, MatGridTile, MatGridTileText, MatLineModule, MatGridTileHeaderCssMatStyler, MatGridTileFooterCssMatStyler, MatGridAvatarCssMatStyler]
    }]
  }]
});

export { MatGridAvatarCssMatStyler, MatGridList, MatGridListModule, MatGridTile, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler, MatGridTileText, MatLine };
//# sourceMappingURL=grid-list.mjs.map

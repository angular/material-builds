import * as i0 from '@angular/core';
import { Directive, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, booleanAttribute, NgModule } from '@angular/core';
import { CdkTable, CDK_TABLE, STICKY_POSITIONING_LISTENER, HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet, CdkCellDef, CdkHeaderCellDef, CdkFooterCellDef, CdkColumnDef, CdkHeaderCell, CdkFooterCell, CdkCell, CdkHeaderRowDef, CdkFooterRowDef, CdkRowDef, CdkHeaderRow, CdkCellOutlet, CdkFooterRow, CdkRow, CdkNoDataRow, CdkTextColumn, CdkTableModule } from '@angular/cdk/table';
import { _VIEW_REPEATER_STRATEGY, _RecycleViewRepeaterStrategy, _DisposeViewRepeaterStrategy, DataSource } from '@angular/cdk/collections';
import { BidiModule } from '@angular/cdk/bidi';
import { BehaviorSubject, Subject, merge, of, combineLatest } from 'rxjs';
import { _isNumberValue } from '@angular/cdk/coercion';
import { map } from 'rxjs/operators';

class MatRecycleRows {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatRecycleRows,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatRecycleRows,
    isStandalone: true,
    selector: "mat-table[recycleRows], table[mat-table][recycleRows]",
    providers: [{
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _RecycleViewRepeaterStrategy
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatRecycleRows,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-table[recycleRows], table[mat-table][recycleRows]',
      providers: [{
        provide: _VIEW_REPEATER_STRATEGY,
        useClass: _RecycleViewRepeaterStrategy
      }]
    }]
  }]
});
class MatTable extends CdkTable {
  stickyCssClass = 'mat-mdc-table-sticky';
  needsPositionStickyOnElement = false;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatTable,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatTable,
    isStandalone: true,
    selector: "mat-table, table[mat-table]",
    host: {
      properties: {
        "class.mat-table-fixed-layout": "fixedLayout"
      },
      classAttribute: "mat-mdc-table mdc-data-table__table"
    },
    providers: [{
      provide: CdkTable,
      useExisting: MatTable
    }, {
      provide: CDK_TABLE,
      useExisting: MatTable
    }, {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy
    }, {
      provide: STICKY_POSITIONING_LISTENER,
      useValue: null
    }],
    exportAs: ["matTable"],
    usesInheritance: true,
    ngImport: i0,
    template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody class="mdc-data-table__content" role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
    isInline: true,
    styles: [".mat-mdc-table-sticky{position:sticky !important}mat-table{display:block}mat-header-row{min-height:var(--mat-table-header-container-height, 56px)}mat-row{min-height:var(--mat-table-row-item-container-height, 52px)}mat-footer-row{min-height:var(--mat-table-footer-container-height, 52px)}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{min-width:100%;border:0;border-spacing:0;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color, var(--mat-sys-surface))}.mat-table-fixed-layout{table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:start;text-overflow:ellipsis}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-header-headline-font, var(--mat-sys-title-small-font, Roboto, sans-serif));line-height:var(--mat-table-header-headline-line-height, var(--mat-sys-title-small-line-height));font-size:var(--mat-table-header-headline-size, var(--mat-sys-title-small-size, 14px));font-weight:var(--mat-table-header-headline-weight, var(--mat-sys-title-small-weight, 500))}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-row-item-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-row-item-label-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-row-item-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-footer-supporting-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-footer-supporting-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-footer-supporting-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-footer-supporting-text-weight, var(--mat-sys-body-medium-weight));letter-spacing:var(--mat-table-footer-supporting-text-tracking, var(--mat-sys-body-medium-tracking))}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking, var(--mat-sys-title-small-tracking));font-weight:inherit;line-height:inherit;box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:start}.mdc-data-table__row:last-child>.mat-mdc-header-cell{border-bottom:none}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking));line-height:inherit}.mdc-data-table__row:last-child>.mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking))}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}\n"],
    dependencies: [{
      kind: "directive",
      type: HeaderRowOutlet,
      selector: "[headerRowOutlet]"
    }, {
      kind: "directive",
      type: DataRowOutlet,
      selector: "[rowOutlet]"
    }, {
      kind: "directive",
      type: NoDataRowOutlet,
      selector: "[noDataRowOutlet]"
    }, {
      kind: "directive",
      type: FooterRowOutlet,
      selector: "[footerRowOutlet]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.Default,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatTable,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-table, table[mat-table]',
      exportAs: 'matTable',
      template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody class="mdc-data-table__content" role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
      host: {
        'class': 'mat-mdc-table mdc-data-table__table',
        '[class.mat-table-fixed-layout]': 'fixedLayout'
      },
      providers: [{
        provide: CdkTable,
        useExisting: MatTable
      }, {
        provide: CDK_TABLE,
        useExisting: MatTable
      }, {
        provide: _VIEW_REPEATER_STRATEGY,
        useClass: _DisposeViewRepeaterStrategy
      }, {
        provide: STICKY_POSITIONING_LISTENER,
        useValue: null
      }],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
      styles: [".mat-mdc-table-sticky{position:sticky !important}mat-table{display:block}mat-header-row{min-height:var(--mat-table-header-container-height, 56px)}mat-row{min-height:var(--mat-table-row-item-container-height, 52px)}mat-footer-row{min-height:var(--mat-table-footer-container-height, 52px)}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{min-width:100%;border:0;border-spacing:0;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color, var(--mat-sys-surface))}.mat-table-fixed-layout{table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:start;text-overflow:ellipsis}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-header-headline-font, var(--mat-sys-title-small-font, Roboto, sans-serif));line-height:var(--mat-table-header-headline-line-height, var(--mat-sys-title-small-line-height));font-size:var(--mat-table-header-headline-size, var(--mat-sys-title-small-size, 14px));font-weight:var(--mat-table-header-headline-weight, var(--mat-sys-title-small-weight, 500))}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-row-item-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-row-item-label-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-row-item-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-footer-supporting-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-footer-supporting-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-footer-supporting-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-footer-supporting-text-weight, var(--mat-sys-body-medium-weight));letter-spacing:var(--mat-table-footer-supporting-text-tracking, var(--mat-sys-body-medium-tracking))}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking, var(--mat-sys-title-small-tracking));font-weight:inherit;line-height:inherit;box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:start}.mdc-data-table__row:last-child>.mat-mdc-header-cell{border-bottom:none}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking));line-height:inherit}.mdc-data-table__row:last-child>.mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking))}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}\n"]
    }]
  }]
});

class MatCellDef extends CdkCellDef {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatCellDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatCellDef,
    isStandalone: true,
    selector: "[matCellDef]",
    providers: [{
      provide: CdkCellDef,
      useExisting: MatCellDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatCellDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matCellDef]',
      providers: [{
        provide: CdkCellDef,
        useExisting: MatCellDef
      }]
    }]
  }]
});
class MatHeaderCellDef extends CdkHeaderCellDef {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatHeaderCellDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatHeaderCellDef,
    isStandalone: true,
    selector: "[matHeaderCellDef]",
    providers: [{
      provide: CdkHeaderCellDef,
      useExisting: MatHeaderCellDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatHeaderCellDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matHeaderCellDef]',
      providers: [{
        provide: CdkHeaderCellDef,
        useExisting: MatHeaderCellDef
      }]
    }]
  }]
});
class MatFooterCellDef extends CdkFooterCellDef {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatFooterCellDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatFooterCellDef,
    isStandalone: true,
    selector: "[matFooterCellDef]",
    providers: [{
      provide: CdkFooterCellDef,
      useExisting: MatFooterCellDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatFooterCellDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matFooterCellDef]',
      providers: [{
        provide: CdkFooterCellDef,
        useExisting: MatFooterCellDef
      }]
    }]
  }]
});
class MatColumnDef extends CdkColumnDef {
  get name() {
    return this._name;
  }
  set name(name) {
    this._setNameInput(name);
  }
  _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatColumnDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatColumnDef,
    isStandalone: true,
    selector: "[matColumnDef]",
    inputs: {
      name: ["matColumnDef", "name"]
    },
    providers: [{
      provide: CdkColumnDef,
      useExisting: MatColumnDef
    }, {
      provide: 'MAT_SORT_HEADER_COLUMN_DEF',
      useExisting: MatColumnDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatColumnDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matColumnDef]',
      providers: [{
        provide: CdkColumnDef,
        useExisting: MatColumnDef
      }, {
        provide: 'MAT_SORT_HEADER_COLUMN_DEF',
        useExisting: MatColumnDef
      }]
    }]
  }],
  propDecorators: {
    name: [{
      type: Input,
      args: ['matColumnDef']
    }]
  }
});
class MatHeaderCell extends CdkHeaderCell {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatHeaderCell,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatHeaderCell,
    isStandalone: true,
    selector: "mat-header-cell, th[mat-header-cell]",
    host: {
      attributes: {
        "role": "columnheader"
      },
      classAttribute: "mat-mdc-header-cell mdc-data-table__header-cell"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatHeaderCell,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-header-cell, th[mat-header-cell]',
      host: {
        'class': 'mat-mdc-header-cell mdc-data-table__header-cell',
        'role': 'columnheader'
      }
    }]
  }]
});
class MatFooterCell extends CdkFooterCell {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatFooterCell,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatFooterCell,
    isStandalone: true,
    selector: "mat-footer-cell, td[mat-footer-cell]",
    host: {
      classAttribute: "mat-mdc-footer-cell mdc-data-table__cell"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatFooterCell,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-footer-cell, td[mat-footer-cell]',
      host: {
        'class': 'mat-mdc-footer-cell mdc-data-table__cell'
      }
    }]
  }]
});
class MatCell extends CdkCell {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatCell,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatCell,
    isStandalone: true,
    selector: "mat-cell, td[mat-cell]",
    host: {
      classAttribute: "mat-mdc-cell mdc-data-table__cell"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatCell,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-cell, td[mat-cell]',
      host: {
        'class': 'mat-mdc-cell mdc-data-table__cell'
      }
    }]
  }]
});

const ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;
class MatHeaderRowDef extends CdkHeaderRowDef {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatHeaderRowDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.3",
    type: MatHeaderRowDef,
    isStandalone: true,
    selector: "[matHeaderRowDef]",
    inputs: {
      columns: ["matHeaderRowDef", "columns"],
      sticky: ["matHeaderRowDefSticky", "sticky", booleanAttribute]
    },
    providers: [{
      provide: CdkHeaderRowDef,
      useExisting: MatHeaderRowDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatHeaderRowDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matHeaderRowDef]',
      providers: [{
        provide: CdkHeaderRowDef,
        useExisting: MatHeaderRowDef
      }],
      inputs: [{
        name: 'columns',
        alias: 'matHeaderRowDef'
      }, {
        name: 'sticky',
        alias: 'matHeaderRowDefSticky',
        transform: booleanAttribute
      }]
    }]
  }]
});
class MatFooterRowDef extends CdkFooterRowDef {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatFooterRowDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.3",
    type: MatFooterRowDef,
    isStandalone: true,
    selector: "[matFooterRowDef]",
    inputs: {
      columns: ["matFooterRowDef", "columns"],
      sticky: ["matFooterRowDefSticky", "sticky", booleanAttribute]
    },
    providers: [{
      provide: CdkFooterRowDef,
      useExisting: MatFooterRowDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatFooterRowDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matFooterRowDef]',
      providers: [{
        provide: CdkFooterRowDef,
        useExisting: MatFooterRowDef
      }],
      inputs: [{
        name: 'columns',
        alias: 'matFooterRowDef'
      }, {
        name: 'sticky',
        alias: 'matFooterRowDefSticky',
        transform: booleanAttribute
      }]
    }]
  }]
});
class MatRowDef extends CdkRowDef {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatRowDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatRowDef,
    isStandalone: true,
    selector: "[matRowDef]",
    inputs: {
      columns: ["matRowDefColumns", "columns"],
      when: ["matRowDefWhen", "when"]
    },
    providers: [{
      provide: CdkRowDef,
      useExisting: MatRowDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatRowDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matRowDef]',
      providers: [{
        provide: CdkRowDef,
        useExisting: MatRowDef
      }],
      inputs: [{
        name: 'columns',
        alias: 'matRowDefColumns'
      }, {
        name: 'when',
        alias: 'matRowDefWhen'
      }]
    }]
  }]
});
class MatHeaderRow extends CdkHeaderRow {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatHeaderRow,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatHeaderRow,
    isStandalone: true,
    selector: "mat-header-row, tr[mat-header-row]",
    host: {
      attributes: {
        "role": "row"
      },
      classAttribute: "mat-mdc-header-row mdc-data-table__header-row"
    },
    providers: [{
      provide: CdkHeaderRow,
      useExisting: MatHeaderRow
    }],
    exportAs: ["matHeaderRow"],
    usesInheritance: true,
    ngImport: i0,
    template: "<ng-container cdkCellOutlet></ng-container>",
    isInline: true,
    dependencies: [{
      kind: "directive",
      type: CdkCellOutlet,
      selector: "[cdkCellOutlet]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.Default,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatHeaderRow,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-header-row, tr[mat-header-row]',
      template: ROW_TEMPLATE,
      host: {
        'class': 'mat-mdc-header-row mdc-data-table__header-row',
        'role': 'row'
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      exportAs: 'matHeaderRow',
      providers: [{
        provide: CdkHeaderRow,
        useExisting: MatHeaderRow
      }],
      imports: [CdkCellOutlet]
    }]
  }]
});
class MatFooterRow extends CdkFooterRow {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatFooterRow,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatFooterRow,
    isStandalone: true,
    selector: "mat-footer-row, tr[mat-footer-row]",
    host: {
      attributes: {
        "role": "row"
      },
      classAttribute: "mat-mdc-footer-row mdc-data-table__row"
    },
    providers: [{
      provide: CdkFooterRow,
      useExisting: MatFooterRow
    }],
    exportAs: ["matFooterRow"],
    usesInheritance: true,
    ngImport: i0,
    template: "<ng-container cdkCellOutlet></ng-container>",
    isInline: true,
    dependencies: [{
      kind: "directive",
      type: CdkCellOutlet,
      selector: "[cdkCellOutlet]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.Default,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatFooterRow,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-footer-row, tr[mat-footer-row]',
      template: ROW_TEMPLATE,
      host: {
        'class': 'mat-mdc-footer-row mdc-data-table__row',
        'role': 'row'
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      exportAs: 'matFooterRow',
      providers: [{
        provide: CdkFooterRow,
        useExisting: MatFooterRow
      }],
      imports: [CdkCellOutlet]
    }]
  }]
});
class MatRow extends CdkRow {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatRow,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatRow,
    isStandalone: true,
    selector: "mat-row, tr[mat-row]",
    host: {
      attributes: {
        "role": "row"
      },
      classAttribute: "mat-mdc-row mdc-data-table__row"
    },
    providers: [{
      provide: CdkRow,
      useExisting: MatRow
    }],
    exportAs: ["matRow"],
    usesInheritance: true,
    ngImport: i0,
    template: "<ng-container cdkCellOutlet></ng-container>",
    isInline: true,
    dependencies: [{
      kind: "directive",
      type: CdkCellOutlet,
      selector: "[cdkCellOutlet]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.Default,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatRow,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-row, tr[mat-row]',
      template: ROW_TEMPLATE,
      host: {
        'class': 'mat-mdc-row mdc-data-table__row',
        'role': 'row'
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      exportAs: 'matRow',
      providers: [{
        provide: CdkRow,
        useExisting: MatRow
      }],
      imports: [CdkCellOutlet]
    }]
  }]
});
class MatNoDataRow extends CdkNoDataRow {
  _cellSelector = 'td, mat-cell, [mat-cell], .mat-cell';
  constructor() {
    super();
    this._contentClassNames.push('mat-mdc-no-data-row', 'mat-mdc-row', 'mdc-data-table__row');
    this._cellClassNames.push('mat-mdc-cell', 'mdc-data-table__cell', 'mat-no-data-cell');
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatNoDataRow,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatNoDataRow,
    isStandalone: true,
    selector: "ng-template[matNoDataRow]",
    providers: [{
      provide: CdkNoDataRow,
      useExisting: MatNoDataRow
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatNoDataRow,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[matNoDataRow]',
      providers: [{
        provide: CdkNoDataRow,
        useExisting: MatNoDataRow
      }]
    }]
  }],
  ctorParameters: () => []
});

class MatTextColumn extends CdkTextColumn {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatTextColumn,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatTextColumn,
    isStandalone: true,
    selector: "mat-text-column",
    usesInheritance: true,
    ngImport: i0,
    template: `
    <ng-container matColumnDef>
      <th mat-header-cell *matHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td mat-cell *matCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
    isInline: true,
    dependencies: [{
      kind: "directive",
      type: MatColumnDef,
      selector: "[matColumnDef]",
      inputs: ["matColumnDef"]
    }, {
      kind: "directive",
      type: MatHeaderCellDef,
      selector: "[matHeaderCellDef]"
    }, {
      kind: "directive",
      type: MatHeaderCell,
      selector: "mat-header-cell, th[mat-header-cell]"
    }, {
      kind: "directive",
      type: MatCellDef,
      selector: "[matCellDef]"
    }, {
      kind: "directive",
      type: MatCell,
      selector: "mat-cell, td[mat-cell]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.Default,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatTextColumn,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-text-column',
      template: `
    <ng-container matColumnDef>
      <th mat-header-cell *matHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td mat-cell *matCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      imports: [MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell]
    }]
  }]
});

const EXPORTED_DECLARATIONS = [MatTable, MatRecycleRows, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatFooterCellDef, MatFooterRowDef, MatHeaderCell, MatCell, MatFooterCell, MatHeaderRow, MatRow, MatFooterRow, MatNoDataRow, MatTextColumn];
class MatTableModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatTableModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatTableModule,
    imports: [CdkTableModule, MatTable, MatRecycleRows, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatFooterCellDef, MatFooterRowDef, MatHeaderCell, MatCell, MatFooterCell, MatHeaderRow, MatRow, MatFooterRow, MatNoDataRow, MatTextColumn],
    exports: [BidiModule, MatTable, MatRecycleRows, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatFooterCellDef, MatFooterRowDef, MatHeaderCell, MatCell, MatFooterCell, MatHeaderRow, MatRow, MatFooterRow, MatNoDataRow, MatTextColumn]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatTableModule,
    imports: [CdkTableModule, BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatTableModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [CdkTableModule, ...EXPORTED_DECLARATIONS],
      exports: [BidiModule, EXPORTED_DECLARATIONS]
    }]
  }]
});

const MAX_SAFE_INTEGER = 9007199254740991;
class MatTableDataSource extends DataSource {
  _data;
  _renderData = new BehaviorSubject([]);
  _filter = new BehaviorSubject('');
  _internalPageChanges = new Subject();
  _renderChangesSubscription = null;
  filteredData;
  get data() {
    return this._data.value;
  }
  set data(data) {
    data = Array.isArray(data) ? data : [];
    this._data.next(data);
    if (!this._renderChangesSubscription) {
      this._filterData(data);
    }
  }
  get filter() {
    return this._filter.value;
  }
  set filter(filter) {
    this._filter.next(filter);
    if (!this._renderChangesSubscription) {
      this._filterData(this.data);
    }
  }
  get sort() {
    return this._sort;
  }
  set sort(sort) {
    this._sort = sort;
    this._updateChangeSubscription();
  }
  _sort;
  get paginator() {
    return this._paginator;
  }
  set paginator(paginator) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }
  _paginator;
  sortingDataAccessor = (data, sortHeaderId) => {
    const value = data[sortHeaderId];
    if (_isNumberValue(value)) {
      const numberValue = Number(value);
      return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }
    return value;
  };
  sortData = (data, sort) => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == '') {
      return data;
    }
    return data.sort((a, b) => {
      let valueA = this.sortingDataAccessor(a, active);
      let valueB = this.sortingDataAccessor(b, active);
      const valueAType = typeof valueA;
      const valueBType = typeof valueB;
      if (valueAType !== valueBType) {
        if (valueAType === 'number') {
          valueA += '';
        }
        if (valueBType === 'number') {
          valueB += '';
        }
      }
      let comparatorResult = 0;
      if (valueA != null && valueB != null) {
        if (valueA > valueB) {
          comparatorResult = 1;
        } else if (valueA < valueB) {
          comparatorResult = -1;
        }
      } else if (valueA != null) {
        comparatorResult = 1;
      } else if (valueB != null) {
        comparatorResult = -1;
      }
      return comparatorResult * (direction == 'asc' ? 1 : -1);
    });
  };
  filterPredicate = (data, filter) => {
    const transformedFilter = filter.trim().toLowerCase();
    return Object.values(data).some(value => `${value}`.toLowerCase().includes(transformedFilter));
  };
  constructor(initialData = []) {
    super();
    this._data = new BehaviorSubject(initialData);
    this._updateChangeSubscription();
  }
  _updateChangeSubscription() {
    const sortChange = this._sort ? merge(this._sort.sortChange, this._sort.initialized) : of(null);
    const pageChange = this._paginator ? merge(this._paginator.page, this._internalPageChanges, this._paginator.initialized) : of(null);
    const dataStream = this._data;
    const filteredData = combineLatest([dataStream, this._filter]).pipe(map(([data]) => this._filterData(data)));
    const orderedData = combineLatest([filteredData, sortChange]).pipe(map(([data]) => this._orderData(data)));
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(map(([data]) => this._pageData(data)));
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe(data => this._renderData.next(data));
  }
  _filterData(data) {
    this.filteredData = this.filter == null || this.filter === '' ? data : data.filter(obj => this.filterPredicate(obj, this.filter));
    if (this.paginator) {
      this._updatePaginator(this.filteredData.length);
    }
    return this.filteredData;
  }
  _orderData(data) {
    if (!this.sort) {
      return data;
    }
    return this.sortData(data.slice(), this.sort);
  }
  _pageData(data) {
    if (!this.paginator) {
      return data;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice(startIndex, startIndex + this.paginator.pageSize);
  }
  _updatePaginator(filteredDataLength) {
    Promise.resolve().then(() => {
      const paginator = this.paginator;
      if (!paginator) {
        return;
      }
      paginator.length = filteredDataLength;
      if (paginator.pageIndex > 0) {
        const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
        const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);
        if (newPageIndex !== paginator.pageIndex) {
          paginator.pageIndex = newPageIndex;
          this._internalPageChanges.next();
        }
      }
    });
  }
  connect() {
    if (!this._renderChangesSubscription) {
      this._updateChangeSubscription();
    }
    return this._renderData;
  }
  disconnect() {
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = null;
  }
}

export { MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRecycleRows, MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule, MatTextColumn };
//# sourceMappingURL=table.mjs.map

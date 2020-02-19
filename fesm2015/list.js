import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, Directive, ChangeDetectorRef, Optional, ContentChildren, ContentChild, forwardRef, Inject, ViewChild, Input, EventEmitter, Attribute, Output, NgModule } from '@angular/core';
import { mixinDisableRipple, setLines, MatLine, MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { hasModifierKey, A, END, HOME, ENTER, SPACE, UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/list/list.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// Boilerplate for applying mixins to MatList.
/**
 * \@docs-private
 */
class MatListBase {
}
/** @type {?} */
const _MatListMixinBase = mixinDisableRipple(MatListBase);
// Boilerplate for applying mixins to MatListItem.
/**
 * \@docs-private
 */
class MatListItemBase {
}
/** @type {?} */
const _MatListItemMixinBase = mixinDisableRipple(MatListItemBase);
class MatNavList extends _MatListMixinBase {
    constructor() {
        super(...arguments);
        /**
         * Emits when the state of the list changes.
         */
        this._stateChanges = new Subject();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this._stateChanges.next();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.complete();
    }
}
MatNavList.decorators = [
    { type: Component, args: [{
                selector: 'mat-nav-list',
                exportAs: 'matNavList',
                host: {
                    'role': 'navigation',
                    'class': 'mat-nav-list mat-list-base'
                },
                template: "<ng-content></ng-content>\n\n",
                inputs: ['disableRipple'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}.cdk-high-contrast-active .mat-selection-list:focus{outline-style:dotted}.cdk-high-contrast-active .mat-list-option:hover,.cdk-high-contrast-active .mat-list-option:focus,.cdk-high-contrast-active .mat-nav-list .mat-list-item:hover,.cdk-high-contrast-active .mat-nav-list .mat-list-item:focus,.cdk-high-contrast-active mat-action-list .mat-list-item:hover,.cdk-high-contrast-active mat-action-list .mat-list-item:focus{outline:dotted 1px}@media(hover: none){.mat-list-option:not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}\n"]
            }] }
];
if (false) {
    /** @type {?} */
    MatNavList.ngAcceptInputType_disableRipple;
    /**
     * Emits when the state of the list changes.
     * @type {?}
     */
    MatNavList.prototype._stateChanges;
}
class MatList extends _MatListMixinBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        super();
        this._elementRef = _elementRef;
        /**
         * Emits when the state of the list changes.
         */
        this._stateChanges = new Subject();
        if (this._getListType() === 'action-list') {
            _elementRef.nativeElement.classList.add('mat-action-list');
        }
    }
    /**
     * @return {?}
     */
    _getListType() {
        /** @type {?} */
        const nodeName = this._elementRef.nativeElement.nodeName.toLowerCase();
        if (nodeName === 'mat-list') {
            return 'list';
        }
        if (nodeName === 'mat-action-list') {
            return 'action-list';
        }
        return null;
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this._stateChanges.next();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.complete();
    }
}
MatList.decorators = [
    { type: Component, args: [{
                selector: 'mat-list, mat-action-list',
                exportAs: 'matList',
                template: "<ng-content></ng-content>\n\n",
                host: {
                    'class': 'mat-list mat-list-base'
                },
                inputs: ['disableRipple'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}.cdk-high-contrast-active .mat-selection-list:focus{outline-style:dotted}.cdk-high-contrast-active .mat-list-option:hover,.cdk-high-contrast-active .mat-list-option:focus,.cdk-high-contrast-active .mat-nav-list .mat-list-item:hover,.cdk-high-contrast-active .mat-nav-list .mat-list-item:focus,.cdk-high-contrast-active mat-action-list .mat-list-item:hover,.cdk-high-contrast-active mat-action-list .mat-list-item:focus{outline:dotted 1px}@media(hover: none){.mat-list-option:not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}\n"]
            }] }
];
/** @nocollapse */
MatList.ctorParameters = () => [
    { type: ElementRef }
];
if (false) {
    /** @type {?} */
    MatList.ngAcceptInputType_disableRipple;
    /**
     * Emits when the state of the list changes.
     * @type {?}
     */
    MatList.prototype._stateChanges;
    /**
     * @type {?}
     * @private
     */
    MatList.prototype._elementRef;
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatListAvatarCssMatStyler {
}
MatListAvatarCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[mat-list-avatar], [matListAvatar]',
                host: { 'class': 'mat-list-avatar' }
            },] }
];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatListIconCssMatStyler {
}
MatListIconCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[mat-list-icon], [matListIcon]',
                host: { 'class': 'mat-list-icon' }
            },] }
];
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatListSubheaderCssMatStyler {
}
MatListSubheaderCssMatStyler.decorators = [
    { type: Directive, args: [{
                selector: '[mat-subheader], [matSubheader]',
                host: { 'class': 'mat-subheader' }
            },] }
];
/**
 * An item within a Material Design list.
 */
class MatListItem extends _MatListItemMixinBase {
    /**
     * @param {?} _element
     * @param {?} _changeDetectorRef
     * @param {?=} navList
     * @param {?=} list
     */
    constructor(_element, _changeDetectorRef, navList, list) {
        super();
        this._element = _element;
        this._isInteractiveList = false;
        this._destroyed = new Subject();
        this._isInteractiveList = !!(navList || (list && list._getListType() === 'action-list'));
        this._list = navList || list;
        // If no type attributed is specified for <button>, set it to "button".
        // If a type attribute is already specified, do nothing.
        /** @type {?} */
        const element = this._getHostElement();
        if (element.nodeName.toLowerCase() === 'button' && !element.hasAttribute('type')) {
            element.setAttribute('type', 'button');
        }
        if (this._list) {
            // React to changes in the state of the parent list since
            // some of the item's properties depend on it (e.g. `disableRipple`).
            this._list._stateChanges.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @return {?}
             */
            () => {
                _changeDetectorRef.markForCheck();
            }));
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        setLines(this._lines, this._element);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    _isRippleDisabled() {
        return !this._isInteractiveList || this.disableRipple ||
            !!(this._list && this._list.disableRipple);
    }
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
}
MatListItem.decorators = [
    { type: Component, args: [{
                selector: 'mat-list-item, a[mat-list-item], button[mat-list-item]',
                exportAs: 'matListItem',
                host: {
                    'class': 'mat-list-item',
                    // @breaking-change 8.0.0 Remove `mat-list-item-avatar` in favor of `mat-list-item-with-avatar`.
                    '[class.mat-list-item-avatar]': '_avatar || _icon',
                    '[class.mat-list-item-with-avatar]': '_avatar || _icon',
                },
                inputs: ['disableRipple'],
                template: "<div class=\"mat-list-item-content\">\n  <div class=\"mat-list-item-ripple\" mat-ripple\n       [matRippleTrigger]=\"_getHostElement()\"\n       [matRippleDisabled]=\"_isRippleDisabled()\">\n  </div>\n\n  <ng-content select=\"[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]\">\n  </ng-content>\n\n  <div class=\"mat-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n\n  <ng-content></ng-content>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
MatListItem.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatNavList, decorators: [{ type: Optional }] },
    { type: MatList, decorators: [{ type: Optional }] }
];
MatListItem.propDecorators = {
    _lines: [{ type: ContentChildren, args: [MatLine, { descendants: true },] }],
    _avatar: [{ type: ContentChild, args: [MatListAvatarCssMatStyler,] }],
    _icon: [{ type: ContentChild, args: [MatListIconCssMatStyler,] }]
};
if (false) {
    /** @type {?} */
    MatListItem.ngAcceptInputType_disableRipple;
    /**
     * @type {?}
     * @private
     */
    MatListItem.prototype._isInteractiveList;
    /**
     * @type {?}
     * @private
     */
    MatListItem.prototype._list;
    /**
     * @type {?}
     * @private
     */
    MatListItem.prototype._destroyed;
    /** @type {?} */
    MatListItem.prototype._lines;
    /** @type {?} */
    MatListItem.prototype._avatar;
    /** @type {?} */
    MatListItem.prototype._icon;
    /**
     * @type {?}
     * @private
     */
    MatListItem.prototype._element;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/list/selection-list.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * \@docs-private
 */
class MatSelectionListBase {
}
/** @type {?} */
const _MatSelectionListMixinBase = mixinDisableRipple(MatSelectionListBase);
/**
 * \@docs-private
 */
class MatListOptionBase {
}
/** @type {?} */
const _MatListOptionMixinBase = mixinDisableRipple(MatListOptionBase);
/**
 * \@docs-private
 * @type {?}
 */
const MAT_SELECTION_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatSelectionList)),
    multi: true
};
/**
 * Change event that is being fired whenever the selected state of an option changes.
 */
class MatSelectionListChange {
    /**
     * @param {?} source
     * @param {?} option
     */
    constructor(source, option) {
        this.source = source;
        this.option = option;
    }
}
if (false) {
    /**
     * Reference to the selection list that emitted the event.
     * @type {?}
     */
    MatSelectionListChange.prototype.source;
    /**
     * Reference to the option that has been changed.
     * @type {?}
     */
    MatSelectionListChange.prototype.option;
}
/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is selected.
 */
class MatListOption extends _MatListOptionMixinBase {
    /**
     * @param {?} _element
     * @param {?} _changeDetector
     * @param {?} selectionList
     */
    constructor(_element, _changeDetector, selectionList) {
        super();
        this._element = _element;
        this._changeDetector = _changeDetector;
        this.selectionList = selectionList;
        this._selected = false;
        this._disabled = false;
        this._hasFocus = false;
        /**
         * Whether the label should appear before or after the checkbox. Defaults to 'after'
         */
        this.checkboxPosition = 'after';
        /**
         * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
         * in the first cycle.
         */
        this._inputsInitialized = false;
    }
    /**
     * Theme color of the list option. This sets the color of the checkbox.
     * @return {?}
     */
    get color() { return this._color || this.selectionList.color; }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set color(newValue) { this._color = newValue; }
    /**
     * Value of the option
     * @return {?}
     */
    get value() { return this._value; }
    /**
     * @param {?} newValue
     * @return {?}
     */
    set value(newValue) {
        if (this.selected && newValue !== this.value && this._inputsInitialized) {
            this.selected = false;
        }
        this._value = newValue;
    }
    /**
     * Whether the option is disabled.
     * @return {?}
     */
    get disabled() { return this._disabled || (this.selectionList && this.selectionList.disabled); }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        /** @type {?} */
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Whether the option is selected.
     * @return {?}
     */
    get selected() { return this.selectionList.selectedOptions.isSelected(this); }
    /**
     * @param {?} value
     * @return {?}
     */
    set selected(value) {
        /** @type {?} */
        const isSelected = coerceBooleanProperty(value);
        if (isSelected !== this._selected) {
            this._setSelected(isSelected);
            this.selectionList._reportValueChange();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const list = this.selectionList;
        if (list._value && list._value.some((/**
         * @param {?} value
         * @return {?}
         */
        value => list.compareWith(value, this._value)))) {
            this._setSelected(true);
        }
        /** @type {?} */
        const wasSelected = this._selected;
        // List options that are selected at initialization can't be reported properly to the form
        // control. This is because it takes some time until the selection-list knows about all
        // available options. Also it can happen that the ControlValueAccessor has an initial value
        // that should be used instead. Deferring the value change report to the next tick ensures
        // that the form control value is not being overwritten.
        Promise.resolve().then((/**
         * @return {?}
         */
        () => {
            if (this._selected || wasSelected) {
                this.selected = true;
                this._changeDetector.markForCheck();
            }
        }));
        this._inputsInitialized = true;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        setLines(this._lines, this._element);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.selected) {
            // We have to delay this until the next tick in order
            // to avoid changed after checked errors.
            Promise.resolve().then((/**
             * @return {?}
             */
            () => {
                this.selected = false;
            }));
        }
        /** @type {?} */
        const hadFocus = this._hasFocus;
        /** @type {?} */
        const newActiveItem = this.selectionList._removeOptionFromList(this);
        // Only move focus if this option was focused at the time it was destroyed.
        if (hadFocus && newActiveItem) {
            newActiveItem.focus();
        }
    }
    /**
     * Toggles the selection state of the option.
     * @return {?}
     */
    toggle() {
        this.selected = !this.selected;
    }
    /**
     * Allows for programmatic focusing of the option.
     * @return {?}
     */
    focus() {
        this._element.nativeElement.focus();
    }
    /**
     * Returns the list item's text label. Implemented as a part of the FocusKeyManager.
     * \@docs-private
     * @return {?}
     */
    getLabel() {
        return this._text ? (this._text.nativeElement.textContent || '') : '';
    }
    /**
     * Whether this list item should show a ripple effect when clicked.
     * @return {?}
     */
    _isRippleDisabled() {
        return this.disabled || this.disableRipple || this.selectionList.disableRipple;
    }
    /**
     * @return {?}
     */
    _handleClick() {
        if (!this.disabled) {
            this.toggle();
            // Emit a change event if the selected state of the option changed through user interaction.
            this.selectionList._emitChangeEvent(this);
        }
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        this.selectionList._setFocusedOption(this);
        this._hasFocus = true;
    }
    /**
     * @return {?}
     */
    _handleBlur() {
        this.selectionList._onTouched();
        this._hasFocus = false;
    }
    /**
     * Retrieves the DOM element of the component host.
     * @return {?}
     */
    _getHostElement() {
        return this._element.nativeElement;
    }
    /**
     * Sets the selected state of the option. Returns whether the value has changed.
     * @param {?} selected
     * @return {?}
     */
    _setSelected(selected) {
        if (selected === this._selected) {
            return false;
        }
        this._selected = selected;
        if (selected) {
            this.selectionList.selectedOptions.select(this);
        }
        else {
            this.selectionList.selectedOptions.deselect(this);
        }
        this._changeDetector.markForCheck();
        return true;
    }
    /**
     * Notifies Angular that the option needs to be checked in the next change detection run. Mainly
     * used to trigger an update of the list option if the disabled state of the selection list
     * changed.
     * @return {?}
     */
    _markForCheck() {
        this._changeDetector.markForCheck();
    }
}
MatListOption.decorators = [
    { type: Component, args: [{
                selector: 'mat-list-option',
                exportAs: 'matListOption',
                inputs: ['disableRipple'],
                host: {
                    'role': 'option',
                    'class': 'mat-list-item mat-list-option',
                    '(focus)': '_handleFocus()',
                    '(blur)': '_handleBlur()',
                    '(click)': '_handleClick()',
                    '[class.mat-list-item-disabled]': 'disabled',
                    '[class.mat-list-item-with-avatar]': '_avatar || _icon',
                    // Manually set the "primary" or "warn" class if the color has been explicitly
                    // set to "primary" or "warn". The pseudo checkbox picks up these classes for
                    // its theme.
                    '[class.mat-primary]': 'color === "primary"',
                    // Even though accent is the default, we need to set this class anyway, because the  list might
                    // be placed inside a parent that has one of the other colors with a higher specificity.
                    '[class.mat-accent]': 'color !== "primary" && color !== "warn"',
                    '[class.mat-warn]': 'color === "warn"',
                    '[attr.aria-selected]': 'selected',
                    '[attr.aria-disabled]': 'disabled',
                    '[attr.tabindex]': '-1',
                },
                template: "<div class=\"mat-list-item-content\"\n  [class.mat-list-item-content-reverse]=\"checkboxPosition == 'after'\">\n\n  <div mat-ripple\n    class=\"mat-list-item-ripple\"\n    [matRippleTrigger]=\"_getHostElement()\"\n    [matRippleDisabled]=\"_isRippleDisabled()\"></div>\n\n  <mat-pseudo-checkbox\n    [state]=\"selected ? 'checked' : 'unchecked'\"\n    [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n  <div class=\"mat-list-text\" #text><ng-content></ng-content></div>\n\n  <ng-content select=\"[mat-list-avatar], [mat-list-icon], [matListAvatar], [matListIcon]\">\n  </ng-content>\n\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
MatListOption.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatSelectionList, decorators: [{ type: Inject, args: [forwardRef((/**
                     * @return {?}
                     */
                    () => MatSelectionList)),] }] }
];
MatListOption.propDecorators = {
    _avatar: [{ type: ContentChild, args: [MatListAvatarCssMatStyler,] }],
    _icon: [{ type: ContentChild, args: [MatListIconCssMatStyler,] }],
    _lines: [{ type: ContentChildren, args: [MatLine, { descendants: true },] }],
    _text: [{ type: ViewChild, args: ['text',] }],
    checkboxPosition: [{ type: Input }],
    color: [{ type: Input }],
    value: [{ type: Input }],
    disabled: [{ type: Input }],
    selected: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatListOption.ngAcceptInputType_disabled;
    /** @type {?} */
    MatListOption.ngAcceptInputType_selected;
    /** @type {?} */
    MatListOption.ngAcceptInputType_disableRipple;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._selected;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._hasFocus;
    /** @type {?} */
    MatListOption.prototype._avatar;
    /** @type {?} */
    MatListOption.prototype._icon;
    /** @type {?} */
    MatListOption.prototype._lines;
    /**
     * DOM element containing the item's text.
     * @type {?}
     */
    MatListOption.prototype._text;
    /**
     * Whether the label should appear before or after the checkbox. Defaults to 'after'
     * @type {?}
     */
    MatListOption.prototype.checkboxPosition;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._color;
    /**
     * This is set to true after the first OnChanges cycle so we don't clear the value of `selected`
     * in the first cycle.
     * @type {?}
     * @private
     */
    MatListOption.prototype._inputsInitialized;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._value;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MatListOption.prototype._changeDetector;
    /**
     * \@docs-private
     * @type {?}
     */
    MatListOption.prototype.selectionList;
}
/**
 * Material Design list component where each item is a selectable option. Behaves as a listbox.
 */
class MatSelectionList extends _MatSelectionListMixinBase {
    /**
     * @param {?} _element
     * @param {?} tabIndex
     * @param {?} _changeDetector
     */
    constructor(_element, 
    // @breaking-change 11.0.0 Remove `tabIndex` parameter.
    tabIndex, _changeDetector) {
        super();
        this._element = _element;
        this._changeDetector = _changeDetector;
        /**
         * Emits a change event whenever the selected state of an option changes.
         */
        this.selectionChange = new EventEmitter();
        /**
         * Tabindex of the selection list.
         * \@breaking-change 11.0.0 Remove `tabIndex` input.
         */
        this.tabIndex = 0;
        /**
         * Theme color of the selection list. This sets the checkbox color for all list options.
         */
        this.color = 'accent';
        /**
         * Function used for comparing an option against the selected value when determining which
         * options should appear as selected. The first argument is the value of an options. The second
         * one is a value from the selected value. A boolean must be returned.
         */
        this.compareWith = (/**
         * @param {?} a1
         * @param {?} a2
         * @return {?}
         */
        (a1, a2) => a1 === a2);
        this._disabled = false;
        /**
         * The currently selected options.
         */
        this.selectedOptions = new SelectionModel(true);
        /**
         * The tabindex of the selection list.
         */
        this._tabIndex = -1;
        /**
         * View to model callback that should be called whenever the selected options change.
         */
        this._onChange = (/**
         * @param {?} _
         * @return {?}
         */
        (_) => { });
        /**
         * Emits when the list has been destroyed.
         */
        this._destroyed = new Subject();
        /**
         * View to model callback that should be called if the list or its options lost focus.
         */
        this._onTouched = (/**
         * @return {?}
         */
        () => { });
    }
    /**
     * Whether the selection list is disabled.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // The `MatSelectionList` and `MatListOption` are using the `OnPush` change detection
        // strategy. Therefore the options will not check for any changes if the `MatSelectionList`
        // changed its state. Since we know that a change to `disabled` property of the list affects
        // the state of the options, we manually mark each option for check.
        this._markOptionsForCheck();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new FocusKeyManager(this.options)
            .withWrap()
            .withTypeAhead()
            // Allow disabled items to be focusable. For accessibility reasons, there must be a way for
            // screenreader users, that allows reading the different options of the list.
            .skipPredicate((/**
         * @return {?}
         */
        () => false))
            .withAllowedModifierKeys(['shiftKey']);
        if (this._value) {
            this._setOptionsFromValues(this._value);
        }
        // If the user attempts to tab out of the selection list, allow focus to escape.
        this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => {
            this._allowFocusEscape();
        }));
        // When the number of options change, update the tabindex of the selection list.
        this.options.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => {
            this._updateTabIndex();
        }));
        // Sync external changes to the model back to the options.
        this.selectedOptions.changed.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event.added) {
                for (let item of event.added) {
                    item.selected = true;
                }
            }
            if (event.removed) {
                for (let item of event.removed) {
                    item.selected = false;
                }
            }
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const disableRippleChanges = changes['disableRipple'];
        /** @type {?} */
        const colorChanges = changes['color'];
        if ((disableRippleChanges && !disableRippleChanges.firstChange) ||
            (colorChanges && !colorChanges.firstChange)) {
            this._markOptionsForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this._isDestroyed = true;
    }
    /**
     * Focuses the selection list.
     * @param {?=} options
     * @return {?}
     */
    focus(options) {
        this._element.nativeElement.focus(options);
    }
    /**
     * Selects all of the options.
     * @return {?}
     */
    selectAll() {
        this._setAllOptionsSelected(true);
    }
    /**
     * Deselects all of the options.
     * @return {?}
     */
    deselectAll() {
        this._setAllOptionsSelected(false);
    }
    /**
     * Sets the focused option of the selection-list.
     * @param {?} option
     * @return {?}
     */
    _setFocusedOption(option) {
        this._keyManager.updateActiveItem(option);
    }
    /**
     * Removes an option from the selection list and updates the active item.
     * @param {?} option
     * @return {?} Currently-active item.
     */
    _removeOptionFromList(option) {
        /** @type {?} */
        const optionIndex = this._getOptionIndex(option);
        if (optionIndex > -1 && this._keyManager.activeItemIndex === optionIndex) {
            // Check whether the option is the last item
            if (optionIndex > 0) {
                this._keyManager.updateActiveItem(optionIndex - 1);
            }
            else if (optionIndex === 0 && this.options.length > 1) {
                this._keyManager.updateActiveItem(Math.min(optionIndex + 1, this.options.length - 1));
            }
        }
        return this._keyManager.activeItem;
    }
    /**
     * Passes relevant key presses to our key manager.
     * @param {?} event
     * @return {?}
     */
    _keydown(event) {
        /** @type {?} */
        const keyCode = event.keyCode;
        /** @type {?} */
        const manager = this._keyManager;
        /** @type {?} */
        const previousFocusIndex = manager.activeItemIndex;
        /** @type {?} */
        const hasModifier = hasModifierKey(event);
        switch (keyCode) {
            case SPACE:
            case ENTER:
                if (!hasModifier && !manager.isTyping()) {
                    this._toggleFocusedOption();
                    // Always prevent space from scrolling the page since the list has focus
                    event.preventDefault();
                }
                break;
            case HOME:
            case END:
                if (!hasModifier) {
                    keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
                    event.preventDefault();
                }
                break;
            case A:
                if (hasModifierKey(event, 'ctrlKey') && !manager.isTyping()) {
                    this.options.find((/**
                     * @param {?} option
                     * @return {?}
                     */
                    option => !option.selected)) ? this.selectAll() : this.deselectAll();
                    event.preventDefault();
                }
                break;
            default:
                manager.onKeydown(event);
        }
        if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && event.shiftKey &&
            manager.activeItemIndex !== previousFocusIndex) {
            this._toggleFocusedOption();
        }
    }
    /**
     * Reports a value change to the ControlValueAccessor
     * @return {?}
     */
    _reportValueChange() {
        // Stop reporting value changes after the list has been destroyed. This avoids
        // cases where the list might wrongly reset its value once it is removed, but
        // the form control is still live.
        if (this.options && !this._isDestroyed) {
            /** @type {?} */
            const value = this._getSelectedOptionValues();
            this._onChange(value);
            this._value = value;
        }
    }
    /**
     * Emits a change event if the selected state of an option changed.
     * @param {?} option
     * @return {?}
     */
    _emitChangeEvent(option) {
        this.selectionChange.emit(new MatSelectionListChange(this, option));
    }
    /**
     * When the selection list is focused, we want to move focus to an option within the list. Do this
     * by setting the appropriate option to be active.
     * @return {?}
     */
    _onFocus() {
        /** @type {?} */
        const activeIndex = this._keyManager.activeItemIndex;
        if (!activeIndex || (activeIndex === -1)) {
            // If there is no active index, set focus to the first option.
            this._keyManager.setFirstItemActive();
        }
        else {
            // Otherwise, set focus to the active option.
            this._keyManager.setActiveItem(activeIndex);
        }
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} values
     * @return {?}
     */
    writeValue(values) {
        this._value = values;
        if (this.options) {
            this._setOptionsFromValues(values || []);
        }
    }
    /**
     * Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Sets the selected options based on the specified values.
     * @private
     * @param {?} values
     * @return {?}
     */
    _setOptionsFromValues(values) {
        this.options.forEach((/**
         * @param {?} option
         * @return {?}
         */
        option => option._setSelected(false)));
        values.forEach((/**
         * @param {?} value
         * @return {?}
         */
        value => {
            /** @type {?} */
            const correspondingOption = this.options.find((/**
             * @param {?} option
             * @return {?}
             */
            option => {
                // Skip options that are already in the model. This allows us to handle cases
                // where the same primitive value is selected multiple times.
                return option.selected ? false : this.compareWith(option.value, value);
            }));
            if (correspondingOption) {
                correspondingOption._setSelected(true);
            }
        }));
    }
    /**
     * Returns the values of the selected options.
     * @private
     * @return {?}
     */
    _getSelectedOptionValues() {
        return this.options.filter((/**
         * @param {?} option
         * @return {?}
         */
        option => option.selected)).map((/**
         * @param {?} option
         * @return {?}
         */
        option => option.value));
    }
    /**
     * Toggles the state of the currently focused option if enabled.
     * @private
     * @return {?}
     */
    _toggleFocusedOption() {
        /** @type {?} */
        let focusedIndex = this._keyManager.activeItemIndex;
        if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
            /** @type {?} */
            let focusedOption = this.options.toArray()[focusedIndex];
            if (focusedOption && !focusedOption.disabled) {
                focusedOption.toggle();
                // Emit a change event because the focused option changed its state through user
                // interaction.
                this._emitChangeEvent(focusedOption);
            }
        }
    }
    /**
     * Sets the selected state on all of the options
     * and emits an event if anything changed.
     * @private
     * @param {?} isSelected
     * @return {?}
     */
    _setAllOptionsSelected(isSelected) {
        // Keep track of whether anything changed, because we only want to
        // emit the changed event when something actually changed.
        /** @type {?} */
        let hasChanged = false;
        this.options.forEach((/**
         * @param {?} option
         * @return {?}
         */
        option => {
            if (option._setSelected(isSelected)) {
                hasChanged = true;
            }
        }));
        if (hasChanged) {
            this._reportValueChange();
        }
    }
    /**
     * Utility to ensure all indexes are valid.
     * @private
     * @param {?} index The index to be checked.
     * @return {?} True if the index is valid for our list of options.
     */
    _isValidIndex(index) {
        return index >= 0 && index < this.options.length;
    }
    /**
     * Returns the index of the specified list option.
     * @private
     * @param {?} option
     * @return {?}
     */
    _getOptionIndex(option) {
        return this.options.toArray().indexOf(option);
    }
    /**
     * Marks all the options to be checked in the next change detection run.
     * @private
     * @return {?}
     */
    _markOptionsForCheck() {
        if (this.options) {
            this.options.forEach((/**
             * @param {?} option
             * @return {?}
             */
            option => option._markForCheck()));
        }
    }
    /**
     * Removes the tabindex from the selection list and resets it back afterwards, allowing the user
     * to tab out of it. This prevents the list from capturing focus and redirecting it back within
     * the list, creating a focus trap if it user tries to tab away.
     * @private
     * @return {?}
     */
    _allowFocusEscape() {
        this._tabIndex = -1;
        setTimeout((/**
         * @return {?}
         */
        () => {
            this._tabIndex = 0;
            this._changeDetector.markForCheck();
        }));
    }
    /**
     * Updates the tabindex based upon if the selection list is empty.
     * @private
     * @return {?}
     */
    _updateTabIndex() {
        this._tabIndex = (this.options.length === 0) ? -1 : 0;
    }
}
MatSelectionList.decorators = [
    { type: Component, args: [{
                selector: 'mat-selection-list',
                exportAs: 'matSelectionList',
                inputs: ['disableRipple'],
                host: {
                    'role': 'listbox',
                    'class': 'mat-selection-list mat-list-base',
                    '(focus)': '_onFocus()',
                    '(blur)': '_onTouched()',
                    '(keydown)': '_keydown($event)',
                    'aria-multiselectable': 'true',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.tabindex]': '_tabIndex',
                },
                template: '<ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None,
                providers: [MAT_SELECTION_LIST_VALUE_ACCESSOR],
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.mat-list-base .mat-subheader{margin:0}.mat-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:transparent}.mat-list-base .mat-subheader{height:48px;line-height:16px}.mat-list-base .mat-subheader:first-child{margin-top:-8px}.mat-list-base .mat-list-item,.mat-list-base .mat-list-option{display:block;height:48px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base .mat-list-item .mat-list-item-content,.mat-list-base .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base .mat-list-item .mat-list-item-content-reverse,.mat-list-base .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base .mat-list-item .mat-list-item-ripple,.mat-list-base .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar,.mat-list-base .mat-list-option.mat-list-item-with-avatar{height:56px}.mat-list-base .mat-list-item.mat-2-line,.mat-list-base .mat-list-option.mat-2-line{height:72px}.mat-list-base .mat-list-item.mat-3-line,.mat-list-base .mat-list-option.mat-3-line{height:88px}.mat-list-base .mat-list-item.mat-multi-line,.mat-list-base .mat-list-option.mat-multi-line{height:auto}.mat-list-base .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base .mat-list-item .mat-list-text,.mat-list-base .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base .mat-list-item .mat-list-text>*,.mat-list-base .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base .mat-list-item .mat-list-text:empty,.mat-list-base .mat-list-option .mat-list-text:empty{display:none}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base .mat-list-item .mat-list-avatar,.mat-list-base .mat-list-option .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:72px}.mat-list-base .mat-list-item .mat-list-icon,.mat-list-base .mat-list-option .mat-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .mat-list-base .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:64px}.mat-list-base .mat-list-item .mat-divider,.mat-list-base .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base .mat-list-item .mat-divider,[dir=rtl] .mat-list-base .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-list-base[dense]{padding-top:4px;display:block}.mat-list-base[dense] .mat-subheader{height:40px;line-height:8px}.mat-list-base[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list-base[dense] .mat-list-item,.mat-list-base[dense] .mat-list-option{display:block;height:40px;-webkit-tap-highlight-color:transparent;width:100%;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-item-content,.mat-list-base[dense] .mat-list-option .mat-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.mat-list-base[dense] .mat-list-item .mat-list-item-content-reverse,.mat-list-base[dense] .mat-list-option .mat-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.mat-list-base[dense] .mat-list-item .mat-list-item-ripple,.mat-list-base[dense] .mat-list-option .mat-list-item-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar{height:48px}.mat-list-base[dense] .mat-list-item.mat-2-line,.mat-list-base[dense] .mat-list-option.mat-2-line{height:60px}.mat-list-base[dense] .mat-list-item.mat-3-line,.mat-list-base[dense] .mat-list-option.mat-3-line{height:76px}.mat-list-base[dense] .mat-list-item.mat-multi-line,.mat-list-base[dense] .mat-list-option.mat-multi-line{height:auto}.mat-list-base[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-list-base[dense] .mat-list-option.mat-multi-line .mat-list-item-content{padding-top:16px;padding-bottom:16px}.mat-list-base[dense] .mat-list-item .mat-list-text,.mat-list-base[dense] .mat-list-option .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0}.mat-list-base[dense] .mat-list-item .mat-list-text>*,.mat-list-base[dense] .mat-list-option .mat-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-list-base[dense] .mat-list-item .mat-list-text:empty,.mat-list-base[dense] .mat-list-option .mat-list-text:empty{display:none}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:0;padding-left:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:0}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-left:0;padding-right:16px}[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-item.mat-list-option .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar .mat-list-item-content-reverse .mat-list-text,[dir=rtl] .mat-list-base[dense] .mat-list-option.mat-list-option .mat-list-item-content-reverse .mat-list-text{padding-right:0;padding-left:16px}.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-item.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content-reverse .mat-list-text,.mat-list-base[dense] .mat-list-option.mat-list-item-with-avatar.mat-list-option .mat-list-item-content .mat-list-text{padding-right:16px;padding-left:16px}.mat-list-base[dense] .mat-list-item .mat-list-avatar,.mat-list-base[dense] .mat-list-option .mat-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-avatar~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-avatar~.mat-divider-inset{margin-left:auto;margin-right:68px}.mat-list-base[dense] .mat-list-item .mat-list-icon,.mat-list-base[dense] .mat-list-option .mat-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-list-icon~.mat-divider-inset,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-list-icon~.mat-divider-inset{margin-left:auto;margin-right:60px}.mat-list-base[dense] .mat-list-item .mat-divider,.mat-list-base[dense] .mat-list-option .mat-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .mat-list-base[dense] .mat-list-item .mat-divider,[dir=rtl] .mat-list-base[dense] .mat-list-option .mat-divider{margin-left:auto;margin-right:0}.mat-list-base[dense] .mat-list-item .mat-divider.mat-divider-inset,.mat-list-base[dense] .mat-list-option .mat-divider.mat-divider-inset{position:absolute}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item{cursor:pointer;outline:none}mat-action-list button{background:none;color:inherit;border:none;font:inherit;outline:inherit;-webkit-tap-highlight-color:transparent;text-align:left}[dir=rtl] mat-action-list button{text-align:right}mat-action-list button::-moz-focus-inner{border:0}mat-action-list .mat-list-item{cursor:pointer;outline:inherit}.mat-list-option:not(.mat-list-item-disabled){cursor:pointer;outline:none}.cdk-high-contrast-active .mat-selection-list:focus{outline-style:dotted}.cdk-high-contrast-active .mat-list-option:hover,.cdk-high-contrast-active .mat-list-option:focus,.cdk-high-contrast-active .mat-nav-list .mat-list-item:hover,.cdk-high-contrast-active .mat-nav-list .mat-list-item:focus,.cdk-high-contrast-active mat-action-list .mat-list-item:hover,.cdk-high-contrast-active mat-action-list .mat-list-item:focus{outline:dotted 1px}@media(hover: none){.mat-list-option:not(.mat-list-item-disabled):hover,.mat-nav-list .mat-list-item:not(.mat-list-item-disabled):hover,.mat-action-list .mat-list-item:not(.mat-list-item-disabled):hover{background:none}}\n"]
            }] }
];
/** @nocollapse */
MatSelectionList.ctorParameters = () => [
    { type: ElementRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: ChangeDetectorRef }
];
MatSelectionList.propDecorators = {
    options: [{ type: ContentChildren, args: [MatListOption, { descendants: true },] }],
    selectionChange: [{ type: Output }],
    tabIndex: [{ type: Input }],
    color: [{ type: Input }],
    compareWith: [{ type: Input }],
    disabled: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatSelectionList.ngAcceptInputType_disabled;
    /** @type {?} */
    MatSelectionList.ngAcceptInputType_disableRipple;
    /**
     * The FocusKeyManager which handles focus.
     * @type {?}
     */
    MatSelectionList.prototype._keyManager;
    /**
     * The option components contained within this selection-list.
     * @type {?}
     */
    MatSelectionList.prototype.options;
    /**
     * Emits a change event whenever the selected state of an option changes.
     * @type {?}
     */
    MatSelectionList.prototype.selectionChange;
    /**
     * Tabindex of the selection list.
     * \@breaking-change 11.0.0 Remove `tabIndex` input.
     * @type {?}
     */
    MatSelectionList.prototype.tabIndex;
    /**
     * Theme color of the selection list. This sets the checkbox color for all list options.
     * @type {?}
     */
    MatSelectionList.prototype.color;
    /**
     * Function used for comparing an option against the selected value when determining which
     * options should appear as selected. The first argument is the value of an options. The second
     * one is a value from the selected value. A boolean must be returned.
     * @type {?}
     */
    MatSelectionList.prototype.compareWith;
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._disabled;
    /**
     * The currently selected options.
     * @type {?}
     */
    MatSelectionList.prototype.selectedOptions;
    /**
     * The tabindex of the selection list.
     * @type {?}
     */
    MatSelectionList.prototype._tabIndex;
    /**
     * View to model callback that should be called whenever the selected options change.
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._onChange;
    /**
     * Keeps track of the currently-selected value.
     * @type {?}
     */
    MatSelectionList.prototype._value;
    /**
     * Emits when the list has been destroyed.
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._destroyed;
    /**
     * View to model callback that should be called if the list or its options lost focus.
     * @type {?}
     */
    MatSelectionList.prototype._onTouched;
    /**
     * Whether the list has been destroyed.
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._isDestroyed;
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MatSelectionList.prototype._changeDetector;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/list/list-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MatListModule {
}
MatListModule.decorators = [
    { type: NgModule, args: [{
                imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule],
                exports: [
                    MatList,
                    MatNavList,
                    MatListItem,
                    MatListAvatarCssMatStyler,
                    MatLineModule,
                    MatCommonModule,
                    MatListIconCssMatStyler,
                    MatListSubheaderCssMatStyler,
                    MatPseudoCheckboxModule,
                    MatSelectionList,
                    MatListOption,
                    MatDividerModule
                ],
                declarations: [
                    MatList,
                    MatNavList,
                    MatListItem,
                    MatListAvatarCssMatStyler,
                    MatListIconCssMatStyler,
                    MatListSubheaderCssMatStyler,
                    MatSelectionList,
                    MatListOption
                ],
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/list/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MAT_SELECTION_LIST_VALUE_ACCESSOR, MatList, MatListAvatarCssMatStyler, MatListIconCssMatStyler, MatListItem, MatListModule, MatListOption, MatListSubheaderCssMatStyler, MatNavList, MatSelectionList, MatSelectionListChange };
//# sourceMappingURL=list.js.map

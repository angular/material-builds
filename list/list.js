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
import { Component, ViewEncapsulation, ContentChildren, ContentChild, QueryList, Directive, ElementRef, Inject, Input, OpaqueToken, Optional, Renderer } from '@angular/core';
import { MdLine, MdLineSetter } from '../core';
export var MdListDivider = (function () {
    function MdListDivider() {
    }
    MdListDivider = __decorate([
        Directive({
            selector: 'md-divider, mat-divider'
        }), 
        __metadata('design:paramtypes', [])
    ], MdListDivider);
    return MdListDivider;
}());
/**
 * Token used to inject the list type into child MdListItem components so they can know whether
 * they're in a nav list (and thus should use an MdRipple).
 */
export var LIST_TYPE_TOKEN = new OpaqueToken('list_type');
var NORMAL_LIST_TYPE = 'normal_list_type';
var NAV_LIST_TYPE = 'nav_list_type';
export var MdList = (function () {
    function MdList() {
    }
    MdList = __decorate([
        Component({selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
            host: {
                'role': 'list' },
            template: '<ng-content></ng-content>',
            styles: [".mat-list,.mat-nav-list{padding-top:8px;display:block}.mat-list .mat-subheader,.mat-nav-list .mat-subheader{display:block;box-sizing:border-box;height:48px;padding:16px;margin:0;font-size:14px;font-weight:500}.mat-list .mat-subheader:first-child,.mat-nav-list .mat-subheader:first-child{margin-top:-8px}.mat-list .mat-list-item,.mat-nav-list .mat-list-item{display:block}.mat-list .mat-list-item .mat-list-item-content,.mat-nav-list .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;font-family:Roboto,\"Helvetica Neue\",sans-serif;box-sizing:border-box;font-size:16px;height:48px;padding:0 16px;position:relative}.mat-list .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:56px}.mat-list .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-2-line .mat-list-item-content{height:72px}.mat-list .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-3-line .mat-list-item-content{height:88px}.mat-list .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list .mat-list-item .mat-list-text,.mat-nav-list .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list .mat-list-item .mat-list-text>*,.mat-nav-list .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list .mat-list-item .mat-list-text:empty,.mat-nav-list .mat-list-item .mat-list-text:empty{display:none}.mat-list .mat-list-item .mat-list-text:first-child,.mat-nav-list .mat-list-item .mat-list-text:first-child{padding:0}.mat-list .mat-list-item .mat-list-avatar,.mat-nav-list .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list .mat-list-item .mat-list-icon,.mat-nav-list .mat-list-item .mat-list-icon{width:24px;height:24px;border-radius:50%;padding:4px}.mat-list .mat-list-item .mat-line,.mat-nav-list .mat-list-item .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-list .mat-list-item .mat-line:nth-child(n+2),.mat-nav-list .mat-list-item .mat-line:nth-child(n+2){font-size:14px}.mat-list[dense],.mat-nav-list[dense]{padding-top:4px;display:block}.mat-list[dense] .mat-subheader,.mat-nav-list[dense] .mat-subheader{display:block;box-sizing:border-box;height:40px;padding:16px;margin:0;font-size:13px;font-weight:500}.mat-list[dense] .mat-subheader:first-child,.mat-nav-list[dense] .mat-subheader:first-child{margin-top:-4px}.mat-list[dense] .mat-list-item,.mat-nav-list[dense] .mat-list-item{display:block}.mat-list[dense] .mat-list-item .mat-list-item-content,.mat-nav-list[dense] .mat-list-item .mat-list-item-content{display:flex;flex-direction:row;align-items:center;font-family:Roboto,\"Helvetica Neue\",sans-serif;box-sizing:border-box;font-size:13px;height:40px;padding:0 16px;position:relative}.mat-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-list-item-avatar .mat-list-item-content{height:48px}.mat-list[dense] .mat-list-item.mat-2-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-2-line .mat-list-item-content{height:60px}.mat-list[dense] .mat-list-item.mat-3-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-3-line .mat-list-item-content{height:76px}.mat-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content,.mat-nav-list[dense] .mat-list-item.mat-multi-line .mat-list-item-content{height:100%;padding:8px 16px}.mat-list[dense] .mat-list-item .mat-list-text,.mat-nav-list[dense] .mat-list-item .mat-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}.mat-list[dense] .mat-list-item .mat-list-text>*,.mat-nav-list[dense] .mat-list-item .mat-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}.mat-list[dense] .mat-list-item .mat-list-text:empty,.mat-nav-list[dense] .mat-list-item .mat-list-text:empty{display:none}.mat-list[dense] .mat-list-item .mat-list-text:first-child,.mat-nav-list[dense] .mat-list-item .mat-list-text:first-child{padding:0}.mat-list[dense] .mat-list-item .mat-list-avatar,.mat-nav-list[dense] .mat-list-item .mat-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%}.mat-list[dense] .mat-list-item .mat-list-icon,.mat-nav-list[dense] .mat-list-item .mat-list-icon{width:24px;height:24px;border-radius:50%;padding:4px}.mat-list[dense] .mat-list-item .mat-line,.mat-nav-list[dense] .mat-list-item .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-list[dense] .mat-list-item .mat-line:nth-child(n+2),.mat-nav-list[dense] .mat-list-item .mat-line:nth-child(n+2){font-size:13px}.mat-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}.mat-nav-list a{text-decoration:none;color:inherit}.mat-nav-list .mat-list-item-content{cursor:pointer}.mat-nav-list .mat-list-item-content.mat-list-item-focus,.mat-nav-list .mat-list-item-content:hover{outline:0} /*# sourceMappingURL=list.css.map */ "],
            providers: [{ provide: LIST_TYPE_TOKEN, useValue: NORMAL_LIST_TYPE }],
            encapsulation: ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], MdList);
    return MdList;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export var MdListCssMatStyler = (function () {
    function MdListCssMatStyler() {
    }
    MdListCssMatStyler = __decorate([
        Directive({
            selector: 'md-list, mat-list',
            host: {
                '[class.mat-list]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdListCssMatStyler);
    return MdListCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export var MdNavListCssMatStyler = (function () {
    function MdNavListCssMatStyler() {
    }
    MdNavListCssMatStyler = __decorate([
        Directive({
            selector: 'md-nav-list, mat-nav-list',
            host: {
                '[class.mat-nav-list]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdNavListCssMatStyler);
    return MdNavListCssMatStyler;
}());
/**
 * Directive to set the ListType token to NAV_LIST_TYPE.
 */
export var MdNavListTokenSetter = (function () {
    function MdNavListTokenSetter() {
    }
    MdNavListTokenSetter = __decorate([
        Directive({
            selector: 'md-nav-list, mat-nav-list',
            providers: [{ provide: LIST_TYPE_TOKEN, useValue: NAV_LIST_TYPE }],
        }), 
        __metadata('design:paramtypes', [])
    ], MdNavListTokenSetter);
    return MdNavListTokenSetter;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export var MdDividerCssMatStyler = (function () {
    function MdDividerCssMatStyler() {
    }
    MdDividerCssMatStyler = __decorate([
        Directive({
            selector: 'md-divider, mat-divider',
            host: {
                '[class.mat-divider]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdDividerCssMatStyler);
    return MdDividerCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export var MdListAvatarCssMatStyler = (function () {
    function MdListAvatarCssMatStyler() {
    }
    MdListAvatarCssMatStyler = __decorate([
        Directive({
            selector: '[md-list-avatar], [mat-list-avatar]',
            host: {
                '[class.mat-list-avatar]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdListAvatarCssMatStyler);
    return MdListAvatarCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export var MdListIconCssMatStyler = (function () {
    function MdListIconCssMatStyler() {
    }
    MdListIconCssMatStyler = __decorate([
        Directive({
            selector: '[md-list-icon], [mat-list-icon]',
            host: {
                '[class.mat-list-icon]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdListIconCssMatStyler);
    return MdListIconCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export var MdListSubheaderCssMatStyler = (function () {
    function MdListSubheaderCssMatStyler() {
    }
    MdListSubheaderCssMatStyler = __decorate([
        Directive({
            selector: '[md-subheader], [mat-subheader]',
            host: {
                '[class.mat-subheader]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdListSubheaderCssMatStyler);
    return MdListSubheaderCssMatStyler;
}());
export var MdListItem = (function () {
    function MdListItem(_renderer, _element, _listType) {
        this._renderer = _renderer;
        this._element = _element;
        this._listType = _listType;
        /**
         * Whether the ripple effect on click should be disabled. This applies only to list items that
         * are children of an md-nav-list; md-list items never have ripples.
         */
        this.disableRipple = false;
        this._hasFocus = false;
    }
    Object.defineProperty(MdListItem.prototype, "_hasAvatar", {
        set: function (avatar) {
            this._renderer.setElementClass(this._element.nativeElement, 'mat-list-item-avatar', avatar != null);
        },
        enumerable: true,
        configurable: true
    });
    MdListItem.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    /** Whether this list item should show a ripple effect when clicked.  */
    MdListItem.prototype.isRippleEnabled = function () {
        return !this.disableRipple && (this._listType === NAV_LIST_TYPE);
    };
    MdListItem.prototype._handleFocus = function () {
        this._hasFocus = true;
    };
    MdListItem.prototype._handleBlur = function () {
        this._hasFocus = false;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdListItem.prototype, "disableRipple", void 0);
    __decorate([
        ContentChildren(MdLine), 
        __metadata('design:type', QueryList)
    ], MdListItem.prototype, "_lines", void 0);
    __decorate([
        ContentChild(MdListAvatarCssMatStyler), 
        __metadata('design:type', MdListAvatarCssMatStyler), 
        __metadata('design:paramtypes', [MdListAvatarCssMatStyler])
    ], MdListItem.prototype, "_hasAvatar", null);
    MdListItem = __decorate([
        Component({selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
            host: {
                'role': 'listitem',
                '(focus)': '_handleFocus()',
                '(blur)': '_handleBlur()',
                '[class.mat-list-item]': 'true',
            },
            template: "<div class=\"mat-list-item-content\" [class.mat-list-item-focus]=\"_hasFocus\" md-ripple [mdRippleDisabled]=\"!isRippleEnabled()\"><ng-content select=\"[md-list-avatar],[md-list-icon], [mat-list-avatar], [mat-list-icon]\"></ng-content><div class=\"mat-list-text\"><ng-content select=\"[md-line], [mat-line]\"></ng-content></div><ng-content></ng-content></div>",
            encapsulation: ViewEncapsulation.None
        }),
        __param(2, Optional()),
        __param(2, Inject(LIST_TYPE_TOKEN)), 
        __metadata('design:paramtypes', [Renderer, ElementRef, String])
    ], MdListItem);
    return MdListItem;
}());
//# sourceMappingURL=list.js.map
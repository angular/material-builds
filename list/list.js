var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation, ContentChildren, ContentChild, QueryList, Directive, ElementRef, Renderer, NgModule } from '@angular/core';
import { MdLine, MdLineSetter, MdLineModule, DefaultStyleCompatibilityModeModule } from '../core';
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
export var MdList = (function () {
    function MdList() {
    }
    MdList = __decorate([
        Component({selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
            host: { 'role': 'list' },
            template: '<ng-content></ng-content>',
            styles: ["md-list,md-nav-list{padding-top:8px;display:block}md-list [md-subheader],md-nav-list [md-subheader]{display:block;box-sizing:border-box;height:48px;padding:16px;margin:0;font-size:14px;font-weight:500}md-list [md-subheader]:first-child,md-nav-list [md-subheader]:first-child{margin-top:-8px}md-list a[md-list-item],md-list md-list-item,md-nav-list a[md-list-item],md-nav-list md-list-item{display:block}md-list a[md-list-item] .md-list-item,md-list md-list-item .md-list-item,md-nav-list a[md-list-item] .md-list-item,md-nav-list md-list-item .md-list-item{display:flex;flex-direction:row;align-items:center;font-family:Roboto,\"Helvetica Neue\",sans-serif;box-sizing:border-box;font-size:16px;height:48px;padding:0 16px}md-list a[md-list-item].md-list-avatar .md-list-item,md-list md-list-item.md-list-avatar .md-list-item,md-nav-list a[md-list-item].md-list-avatar .md-list-item,md-nav-list md-list-item.md-list-avatar .md-list-item{height:56px}md-list a[md-list-item].md-2-line .md-list-item,md-list md-list-item.md-2-line .md-list-item,md-nav-list a[md-list-item].md-2-line .md-list-item,md-nav-list md-list-item.md-2-line .md-list-item{height:72px}md-list a[md-list-item].md-3-line .md-list-item,md-list md-list-item.md-3-line .md-list-item,md-nav-list a[md-list-item].md-3-line .md-list-item,md-nav-list md-list-item.md-3-line .md-list-item{height:88px}md-list a[md-list-item].md-multi-line .md-list-item,md-list md-list-item.md-multi-line .md-list-item,md-nav-list a[md-list-item].md-multi-line .md-list-item,md-nav-list md-list-item.md-multi-line .md-list-item{height:100%;padding:8px 16px}md-list a[md-list-item] .md-list-text,md-list md-list-item .md-list-text,md-nav-list a[md-list-item] .md-list-text,md-nav-list md-list-item .md-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}md-list a[md-list-item] .md-list-text>*,md-list md-list-item .md-list-text>*,md-nav-list a[md-list-item] .md-list-text>*,md-nav-list md-list-item .md-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}md-list a[md-list-item] .md-list-text:empty,md-list md-list-item .md-list-text:empty,md-nav-list a[md-list-item] .md-list-text:empty,md-nav-list md-list-item .md-list-text:empty{display:none}md-list a[md-list-item] .md-list-text:first-child,md-list md-list-item .md-list-text:first-child,md-nav-list a[md-list-item] .md-list-text:first-child,md-nav-list md-list-item .md-list-text:first-child{padding:0}md-list a[md-list-item] [md-list-avatar],md-list md-list-item [md-list-avatar],md-nav-list a[md-list-item] [md-list-avatar],md-nav-list md-list-item [md-list-avatar]{flex-shrink:0;width:40px;height:40px;border-radius:50%}md-list a[md-list-item] [md-list-icon],md-list md-list-item [md-list-icon],md-nav-list a[md-list-item] [md-list-icon],md-nav-list md-list-item [md-list-icon]{width:24px;height:24px;border-radius:50%;padding:4px}md-list a[md-list-item] [md-line],md-list md-list-item [md-line],md-nav-list a[md-list-item] [md-line],md-nav-list md-list-item [md-line]{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}md-list a[md-list-item] [md-line]:nth-child(n+2),md-list md-list-item [md-line]:nth-child(n+2),md-nav-list a[md-list-item] [md-line]:nth-child(n+2),md-nav-list md-list-item [md-line]:nth-child(n+2){font-size:14px}md-list[dense],md-nav-list[dense]{padding-top:4px;display:block}md-list[dense] [md-subheader],md-nav-list[dense] [md-subheader]{display:block;box-sizing:border-box;height:40px;padding:16px;margin:0;font-size:13px;font-weight:500}md-list[dense] [md-subheader]:first-child,md-nav-list[dense] [md-subheader]:first-child{margin-top:-4px}md-list[dense] a[md-list-item],md-list[dense] md-list-item,md-nav-list[dense] a[md-list-item],md-nav-list[dense] md-list-item{display:block}md-list[dense] a[md-list-item] .md-list-item,md-list[dense] md-list-item .md-list-item,md-nav-list[dense] a[md-list-item] .md-list-item,md-nav-list[dense] md-list-item .md-list-item{display:flex;flex-direction:row;align-items:center;font-family:Roboto,\"Helvetica Neue\",sans-serif;box-sizing:border-box;font-size:13px;height:40px;padding:0 16px}md-list[dense] a[md-list-item].md-list-avatar .md-list-item,md-list[dense] md-list-item.md-list-avatar .md-list-item,md-nav-list[dense] a[md-list-item].md-list-avatar .md-list-item,md-nav-list[dense] md-list-item.md-list-avatar .md-list-item{height:48px}md-list[dense] a[md-list-item].md-2-line .md-list-item,md-list[dense] md-list-item.md-2-line .md-list-item,md-nav-list[dense] a[md-list-item].md-2-line .md-list-item,md-nav-list[dense] md-list-item.md-2-line .md-list-item{height:60px}md-list[dense] a[md-list-item].md-3-line .md-list-item,md-list[dense] md-list-item.md-3-line .md-list-item,md-nav-list[dense] a[md-list-item].md-3-line .md-list-item,md-nav-list[dense] md-list-item.md-3-line .md-list-item{height:76px}md-list[dense] a[md-list-item].md-multi-line .md-list-item,md-list[dense] md-list-item.md-multi-line .md-list-item,md-nav-list[dense] a[md-list-item].md-multi-line .md-list-item,md-nav-list[dense] md-list-item.md-multi-line .md-list-item{height:100%;padding:8px 16px}md-list[dense] a[md-list-item] .md-list-text,md-list[dense] md-list-item .md-list-text,md-nav-list[dense] a[md-list-item] .md-list-text,md-nav-list[dense] md-list-item .md-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}md-list[dense] a[md-list-item] .md-list-text>*,md-list[dense] md-list-item .md-list-text>*,md-nav-list[dense] a[md-list-item] .md-list-text>*,md-nav-list[dense] md-list-item .md-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}md-list[dense] a[md-list-item] .md-list-text:empty,md-list[dense] md-list-item .md-list-text:empty,md-nav-list[dense] a[md-list-item] .md-list-text:empty,md-nav-list[dense] md-list-item .md-list-text:empty{display:none}md-list[dense] a[md-list-item] .md-list-text:first-child,md-list[dense] md-list-item .md-list-text:first-child,md-nav-list[dense] a[md-list-item] .md-list-text:first-child,md-nav-list[dense] md-list-item .md-list-text:first-child{padding:0}md-list[dense] a[md-list-item] [md-list-avatar],md-list[dense] md-list-item [md-list-avatar],md-nav-list[dense] a[md-list-item] [md-list-avatar],md-nav-list[dense] md-list-item [md-list-avatar]{flex-shrink:0;width:40px;height:40px;border-radius:50%}md-list[dense] a[md-list-item] [md-list-icon],md-list[dense] md-list-item [md-list-icon],md-nav-list[dense] a[md-list-item] [md-list-icon],md-nav-list[dense] md-list-item [md-list-icon]{width:24px;height:24px;border-radius:50%;padding:4px}md-list[dense] a[md-list-item] [md-line],md-list[dense] md-list-item [md-line],md-nav-list[dense] a[md-list-item] [md-line],md-nav-list[dense] md-list-item [md-line]{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}md-list[dense] a[md-list-item] [md-line]:nth-child(n+2),md-list[dense] md-list-item [md-line]:nth-child(n+2),md-nav-list[dense] a[md-list-item] [md-line]:nth-child(n+2),md-nav-list[dense] md-list-item [md-line]:nth-child(n+2){font-size:13px}md-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}md-nav-list a{text-decoration:none;color:inherit}md-nav-list .md-list-item{cursor:pointer}md-nav-list .md-list-item.md-list-item-focus,md-nav-list .md-list-item:hover{outline:0}"],
            encapsulation: ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], MdList);
    return MdList;
}());
/* Need directive for a ContentChild query in list-item */
export var MdListAvatar = (function () {
    function MdListAvatar() {
    }
    MdListAvatar = __decorate([
        Directive({ selector: '[md-list-avatar], [mat-list-avatar]' }), 
        __metadata('design:paramtypes', [])
    ], MdListAvatar);
    return MdListAvatar;
}());
export var MdListItem = (function () {
    function MdListItem(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._hasFocus = false;
    }
    Object.defineProperty(MdListItem.prototype, "_hasAvatar", {
        set: function (avatar) {
            this._renderer.setElementClass(this._element.nativeElement, 'md-list-avatar', avatar != null);
        },
        enumerable: true,
        configurable: true
    });
    MdListItem.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    MdListItem.prototype._handleFocus = function () {
        this._hasFocus = true;
    };
    MdListItem.prototype._handleBlur = function () {
        this._hasFocus = false;
    };
    __decorate([
        ContentChildren(MdLine), 
        __metadata('design:type', QueryList)
    ], MdListItem.prototype, "_lines", void 0);
    __decorate([
        ContentChild(MdListAvatar), 
        __metadata('design:type', MdListAvatar), 
        __metadata('design:paramtypes', [MdListAvatar])
    ], MdListItem.prototype, "_hasAvatar", null);
    MdListItem = __decorate([
        Component({selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
            host: {
                'role': 'listitem',
                '(focus)': '_handleFocus()',
                '(blur)': '_handleBlur()',
            },
            template: "<div class=\"md-list-item\" [class.md-list-item-focus]=\"_hasFocus\"><ng-content select=\"[md-list-avatar],[md-list-icon], [mat-list-avatar], [mat-list-icon]\"></ng-content><div class=\"md-list-text\"><ng-content select=\"[md-line], [mat-line]\"></ng-content></div><ng-content></ng-content></div>",
            encapsulation: ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [Renderer, ElementRef])
    ], MdListItem);
    return MdListItem;
}());
export var MdListModule = (function () {
    function MdListModule() {
    }
    MdListModule.forRoot = function () {
        return {
            ngModule: MdListModule,
            providers: []
        };
    };
    MdListModule = __decorate([
        NgModule({
            imports: [MdLineModule, DefaultStyleCompatibilityModeModule],
            exports: [
                MdList,
                MdListItem,
                MdListDivider,
                MdListAvatar,
                MdLineModule,
                DefaultStyleCompatibilityModeModule,
            ],
            declarations: [MdList, MdListItem, MdListDivider, MdListAvatar],
        }), 
        __metadata('design:paramtypes', [])
    ], MdListModule);
    return MdListModule;
}());

//# sourceMappingURL=list.js.map

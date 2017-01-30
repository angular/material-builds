var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { MdPlaceholder, MdInputContainer, MdHint, MdInputDirective } from './input-container';
import { MdTextareaAutosize } from './autosize';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformModule } from '../core/platform/index';
export * from './autosize';
export * from './input-container';
export * from './input-container-errors';
export var MdInputModule = (function () {
    function MdInputModule() {
    }
    /** @deprecated */
    MdInputModule.forRoot = function () {
        return {
            ngModule: MdInputModule,
            providers: [],
        };
    };
    MdInputModule = __decorate([
        NgModule({
            declarations: [
                MdPlaceholder,
                MdInputContainer,
                MdHint,
                MdTextareaAutosize,
                MdInputDirective
            ],
            imports: [
                CommonModule,
                FormsModule,
                PlatformModule,
            ],
            exports: [
                MdPlaceholder,
                MdInputContainer,
                MdHint,
                MdTextareaAutosize,
                MdInputDirective
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdInputModule);
    return MdInputModule;
}());
//# sourceMappingURL=index.js.map
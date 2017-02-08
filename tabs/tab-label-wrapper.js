var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Renderer, Input } from '@angular/core';
import { coerceBooleanProperty } from '../core/coercion/boolean-property';
/** Used in the `md-tab-group` view to display tab labels */
export var MdTabLabelWrapper = (function () {
    function MdTabLabelWrapper(elementRef, _renderer) {
        this.elementRef = elementRef;
        this._renderer = _renderer;
        /** Whether the tab label is disabled.  */
        this._disabled = false;
    }
    Object.defineProperty(MdTabLabelWrapper.prototype, "disabled", {
        /** Whether the element is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    /** Sets focus on the wrapper element */
    MdTabLabelWrapper.prototype.focus = function () {
        this._renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus');
    };
    MdTabLabelWrapper.prototype.getOffsetLeft = function () {
        return this.elementRef.nativeElement.offsetLeft;
    };
    MdTabLabelWrapper.prototype.getOffsetWidth = function () {
        return this.elementRef.nativeElement.offsetWidth;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdTabLabelWrapper.prototype, "disabled", null);
    MdTabLabelWrapper = __decorate([
        Directive({
            selector: '[md-tab-label-wrapper], [mat-tab-label-wrapper]',
            host: {
                '[class.mat-tab-disabled]': 'disabled'
            }
        }), 
        __metadata('design:paramtypes', [ElementRef, Renderer])
    ], MdTabLabelWrapper);
    return MdTabLabelWrapper;
}());
//# sourceMappingURL=tab-label-wrapper.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Input } from '@angular/core';
/**
 * Directive to automatically resize a textarea to fit its content.
 */
export var MdTextareaAutosize = (function () {
    function MdTextareaAutosize(_elementRef) {
        this._elementRef = _elementRef;
    }
    Object.defineProperty(MdTextareaAutosize.prototype, "mdAutosizeMinRows", {
        get: function () {
            return this.minRows;
        },
        set: function (value) {
            this.minRows = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "mdAutosizeMaxRows", {
        get: function () {
            return this.maxRows;
        },
        set: function (value) {
            this.maxRows = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_minHeight", {
        /** The minimum height of the textarea as determined by minRows. */
        get: function () {
            return this.minRows ? this.minRows * this._cachedLineHeight + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_maxHeight", {
        /** The maximum height of the textarea as determined by maxRows. */
        get: function () {
            return this.maxRows ? this.maxRows * this._cachedLineHeight + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    MdTextareaAutosize.prototype.ngOnInit = function () {
        this._cacheTextareaLineHeight();
        this.resizeToFitContent();
    };
    /**
     * Cache the height of a single-row textarea.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     */
    MdTextareaAutosize.prototype._cacheTextareaLineHeight = function () {
        var textarea = this._elementRef.nativeElement;
        // Use a clone element because we have to override some styles.
        var textareaClone = textarea.cloneNode(false);
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';
        textarea.parentNode.appendChild(textareaClone);
        this._cachedLineHeight = textareaClone.offsetHeight;
        textarea.parentNode.removeChild(textareaClone);
    };
    /** Resize the textarea to fit its content. */
    MdTextareaAutosize.prototype.resizeToFitContent = function () {
        var textarea = this._elementRef.nativeElement;
        // Reset the textarea height to auto in order to shrink back to its default size.
        textarea.style.height = 'auto';
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = textarea.scrollHeight + "px";
    };
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], MdTextareaAutosize.prototype, "minRows", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], MdTextareaAutosize.prototype, "mdAutosizeMinRows", null);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], MdTextareaAutosize.prototype, "maxRows", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], MdTextareaAutosize.prototype, "mdAutosizeMaxRows", null);
    MdTextareaAutosize = __decorate([
        Directive({
            selector: 'textarea[md-autosize], textarea[mdTextareaAutosize],' +
                'textarea[mat-autosize], textarea[matTextareaAutosize]',
            exportAs: 'mdTextareaAutosize',
            host: {
                '(input)': 'resizeToFitContent()',
                '[style.min-height]': '_minHeight',
                '[style.max-height]': '_maxHeight',
            },
        }), 
        __metadata('design:paramtypes', [ElementRef])
    ], MdTextareaAutosize);
    return MdTextareaAutosize;
}());
//# sourceMappingURL=autosize.js.map
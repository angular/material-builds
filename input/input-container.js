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
import { Component, Input, Directive, ContentChild, ContentChildren, ElementRef, QueryList, ViewEncapsulation, Optional, Output, EventEmitter, Renderer } from '@angular/core';
import { coerceBooleanProperty } from '../core';
import { NgControl } from '@angular/forms';
import { getSupportedInputTypes } from '../core/platform/features';
import { MdInputContainerUnsupportedTypeError, MdInputContainerPlaceholderConflictError, MdInputContainerDuplicatedHintError, MdInputContainerMissingMdInputError } from './input-container-errors';
// Invalid input type. Using one of these will throw an MdInputContainerUnsupportedTypeError.
var MD_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit'
];
var nextUniqueId = 0;
/**
 * The placeholder directive. The content can declare this to implement more
 * complex placeholders.
 */
export var MdPlaceholder = (function () {
    function MdPlaceholder() {
    }
    MdPlaceholder = __decorate([
        Directive({
            selector: 'md-placeholder, mat-placeholder'
        }), 
        __metadata('design:paramtypes', [])
    ], MdPlaceholder);
    return MdPlaceholder;
}());
/** The hint directive, used to tag content as hint labels (going under the input). */
export var MdHint = (function () {
    function MdHint() {
        // Whether to align the hint label at the start or end of the line.
        this.align = 'start';
    }
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdHint.prototype, "align", void 0);
    MdHint = __decorate([
        Directive({
            selector: 'md-hint, mat-hint',
            host: {
                'class': 'md-hint',
                '[class.md-right]': 'align == "end"',
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdHint);
    return MdHint;
}());
/** The input directive, used to mark the input that `MdInputContainer` is wrapping. */
export var MdInputDirective = (function () {
    function MdInputDirective(_elementRef, _renderer, _ngControl) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngControl = _ngControl;
        this._disabled = false;
        this._placeholder = '';
        this._required = false;
        this._type = 'text';
        /**
         * Emits an event when the placeholder changes so that the `md-input-container` can re-validate.
         */
        this._placeholderChange = new EventEmitter();
        this.focused = false;
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week'
        ].filter(function (t) { return getSupportedInputTypes().has(t); });
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        if (this._ngControl && this._ngControl.valueChanges) {
            this._ngControl.valueChanges.subscribe(function (value) {
                _this.value = value;
            });
        }
    }
    Object.defineProperty(MdInputDirective.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "id", {
        get: function () { return this._id; },
        set: function (value) { this._id = value || this._uid; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdInputDirective.prototype, "placeholder", {
        get: function () { return this._placeholder; },
        set: function (value) {
            if (this._placeholder != value) {
                this._placeholder = value;
                this._placeholderChange.emit(this._placeholder);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "type", {
        get: function () { return this._type; },
        set: function (value) {
            this._type = value || 'text';
            this._validateType();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "empty", {
        get: function () { return (this.value == null || this.value === '') && !this._isNeverEmpty(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "_uid", {
        get: function () { return this._cachedUid = this._cachedUid || "md-input-" + nextUniqueId++; },
        enumerable: true,
        configurable: true
    });
    MdInputDirective.prototype.ngAfterContentInit = function () {
        this.value = this._elementRef.nativeElement.value;
    };
    /** Focus the input element. */
    MdInputDirective.prototype.focus = function () { this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus'); };
    MdInputDirective.prototype._onFocus = function () { this.focused = true; };
    MdInputDirective.prototype._onBlur = function () { this.focused = false; };
    MdInputDirective.prototype._onInput = function () { this.value = this._elementRef.nativeElement.value; };
    /** Make sure the input is a supported type. */
    MdInputDirective.prototype._validateType = function () {
        if (MD_INPUT_INVALID_TYPES.indexOf(this._type) != -1) {
            throw new MdInputContainerUnsupportedTypeError(this._type);
        }
    };
    MdInputDirective.prototype._isNeverEmpty = function () { return this._neverEmptyInputTypes.indexOf(this._type) != -1; };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputDirective.prototype, "disabled", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputDirective.prototype, "id", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputDirective.prototype, "placeholder", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputDirective.prototype, "required", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputDirective.prototype, "type", null);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MdInputDirective.prototype, "_placeholderChange", void 0);
    MdInputDirective = __decorate([
        Directive({
            selector: 'input[md-input], textarea[md-input], input[mat-input], textarea[mat-input]',
            host: {
                'class': 'md-input-element',
                '[id]': 'id',
                '(blur)': '_onBlur()',
                '(focus)': '_onFocus()',
                '(input)': '_onInput()',
            }
        }),
        __param(2, Optional()), 
        __metadata('design:paramtypes', [ElementRef, Renderer, NgControl])
    ], MdInputDirective);
    return MdInputDirective;
}());
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
export var MdInputContainer = (function () {
    function MdInputContainer() {
        this.align = 'start';
        this.dividerColor = 'primary';
        this._hintLabel = '';
        this._floatingPlaceholder = true;
    }
    Object.defineProperty(MdInputContainer.prototype, "hintLabel", {
        get: function () { return this._hintLabel; },
        set: function (value) {
            this._hintLabel = value;
            this._validateHints();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "floatingPlaceholder", {
        get: function () { return this._floatingPlaceholder; },
        set: function (value) { this._floatingPlaceholder = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    MdInputContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (!this._mdInputChild) {
            throw new MdInputContainerMissingMdInputError();
        }
        this._validateHints();
        this._validatePlaceholders();
        // Re-validate when things change.
        this._hintChildren.changes.subscribe(function () {
            _this._validateHints();
        });
        this._mdInputChild._placeholderChange.subscribe(function () {
            _this._validatePlaceholders();
        });
    };
    MdInputContainer.prototype._isUntouched = function () { return this._hasNgControl() && this._mdInputChild._ngControl.untouched; };
    MdInputContainer.prototype._isTouched = function () { return this._hasNgControl() && this._mdInputChild._ngControl.touched; };
    MdInputContainer.prototype._isPristine = function () { return this._hasNgControl() && this._mdInputChild._ngControl.pristine; };
    MdInputContainer.prototype._isDirty = function () { return this._hasNgControl() && this._mdInputChild._ngControl.dirty; };
    MdInputContainer.prototype._isValid = function () { return this._hasNgControl() && this._mdInputChild._ngControl.valid; };
    MdInputContainer.prototype._isInvalid = function () { return this._hasNgControl() && this._mdInputChild._ngControl.invalid; };
    MdInputContainer.prototype._isPending = function () { return this._hasNgControl() && this._mdInputChild._ngControl.pending; };
    /** Whether the input has a placeholder. */
    MdInputContainer.prototype._hasPlaceholder = function () { return !!(this._mdInputChild.placeholder || this._placeholderChild); };
    MdInputContainer.prototype._focusInput = function () { this._mdInputChild.focus(); };
    MdInputContainer.prototype._hasNgControl = function () { return !!(this._mdInputChild && this._mdInputChild._ngControl); };
    /**
     * Ensure that there is only one placeholder (either `input` attribute or child element with the
     * `md-placeholder` attribute.
     */
    MdInputContainer.prototype._validatePlaceholders = function () {
        if (this._mdInputChild.placeholder && this._placeholderChild) {
            throw new MdInputContainerPlaceholderConflictError();
        }
    };
    /**
     * Ensure that there is a maximum of one of each `<md-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    MdInputContainer.prototype._validateHints = function () {
        var _this = this;
        if (this._hintChildren) {
            var startHint_1 = null;
            var endHint_1 = null;
            this._hintChildren.forEach(function (hint) {
                if (hint.align == 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw new MdInputContainerDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint_1) {
                        throw new MdInputContainerDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputContainer.prototype, "align", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputContainer.prototype, "dividerColor", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdInputContainer.prototype, "hintLabel", null);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdInputContainer.prototype, "floatingPlaceholder", null);
    __decorate([
        ContentChild(MdInputDirective), 
        __metadata('design:type', MdInputDirective)
    ], MdInputContainer.prototype, "_mdInputChild", void 0);
    __decorate([
        ContentChild(MdPlaceholder), 
        __metadata('design:type', MdPlaceholder)
    ], MdInputContainer.prototype, "_placeholderChild", void 0);
    __decorate([
        ContentChildren(MdHint), 
        __metadata('design:type', QueryList)
    ], MdInputContainer.prototype, "_hintChildren", void 0);
    MdInputContainer = __decorate([
        Component({selector: 'md-input-container, mat-input-container',
            template: "<div class=\"md-input-wrapper\"><div class=\"md-input-table\"><div class=\"md-input-prefix\"><ng-content select=\"[md-prefix]\"></ng-content></div><div class=\"md-input-infix\" [class.md-end]=\"align == 'end'\"><ng-content selector=\"input, textarea\"></ng-content><label class=\"md-input-placeholder\" [attr.for]=\"_mdInputChild.id\" [class.md-empty]=\"_mdInputChild.empty\" [class.md-focused]=\"_mdInputChild.focused\" [class.md-float]=\"floatingPlaceholder\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\" *ngif=\"_hasPlaceholder()\"><ng-content select=\"md-placeholder\"></ng-content>{{_mdInputChild.placeholder}} <span class=\"md-placeholder-required\" *ngif=\"_mdInputChild.required\">*</span></label></div><div class=\"md-input-suffix\"><ng-content select=\"[md-suffix]\"></ng-content></div></div><div class=\"md-input-underline\" [class.md-disabled]=\"_mdInputChild.disabled\"><span class=\"md-input-ripple\" [class.md-focused]=\"_mdInputChild.focused\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\"></span></div><div *ngif=\"hintLabel != ''\" class=\"md-hint\">{{hintLabel}}</div><ng-content select=\"md-hint\"></ng-content></div>",
            styles: ["md-input,md-textarea{display:inline-block;position:relative;font-family:Roboto,\"Helvetica Neue\",sans-serif;line-height:normal;text-align:left}.md-input-element.md-end,[dir=rtl] md-input,[dir=rtl] md-textarea{text-align:right}.md-input-wrapper{margin:16px 0}.md-input-table{display:inline-table;flex-flow:column;vertical-align:bottom;width:100%}.md-input-table>*{display:table-cell}.md-input-infix{position:relative}.md-input-element{font:inherit;background:0 0;color:currentColor;border:none;outline:0;padding:0;width:100%}[dir=rtl] .md-input-element.md-end{text-align:left}.md-input-element:-moz-ui-invalid{box-shadow:none}.md-input-element:-webkit-autofill+.md-input-placeholder.md-float{display:block;padding-bottom:5px;transform:translateY(-100%) scale(.75);width:133.33333%}.md-input-placeholder{position:absolute;left:0;top:0;font-size:100%;pointer-events:none;z-index:1;width:100%;display:none;white-space:nowrap;text-overflow:ellipsis;overflow-x:hidden;transform:translateY(0);transform-origin:bottom left;transition:transform .4s cubic-bezier(.25,.8,.25,1),scale .4s cubic-bezier(.25,.8,.25,1),color .4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.md-input-placeholder.md-empty{display:block;cursor:text}.md-input-placeholder.md-float.md-focused,.md-input-placeholder.md-float:not(.md-empty){display:block;padding-bottom:5px;transform:translateY(-100%) scale(.75);width:133.33333%}[dir=rtl] .md-input-placeholder{transform-origin:bottom right;left:auto;right:0}.md-input-underline{position:absolute;height:1px;width:100%;margin-top:4px;border-top-width:1px;border-top-style:solid}.md-input-underline.md-disabled{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;border-top:0;background-position:0}.md-input-underline .md-input-ripple{position:absolute;height:2px;z-index:1;top:-1px;width:100%;transform-origin:top;opacity:0;transform:scaleY(0);transition:transform .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.md-input-underline .md-input-ripple.md-focused{opacity:1;transform:scaleY(1)}.md-hint{display:block;position:absolute;font-size:75%;bottom:-.5em}.md-hint.md-right{right:0}[dir=rtl] .md-hint{right:0;left:auto}[dir=rtl] .md-hint.md-right{right:auto;left:0}",
"md-input-container{display:inline-block;position:relative;font-family:Roboto,\"Helvetica Neue\",sans-serif;line-height:normal;text-align:left}.md-end .md-input-element,[dir=rtl] md-input-container{text-align:right}.md-input-element::-webkit-input-placeholder{visibility:hidden}.md-input-element::-moz-placeholder{visibility:hidden}.md-input-element:-ms-input-placeholder{visibility:hidden}.md-input-element::placeholder{visibility:hidden}[dir=rtl] .md-end .md-input-element{text-align:left}"],
            host: {
                // Remove align attribute to prevent it from interfering with layout.
                '[attr.align]': 'null',
                '[class.ng-untouched]': '_isUntouched()',
                '[class.ng-touched]': '_isTouched()',
                '[class.ng-pristine]': '_isPristine()',
                '[class.ng-dirty]': '_isDirty()',
                '[class.ng-valid]': '_isValid()',
                '[class.ng-invalid]': '_isInvalid()',
                '[class.ng-pending]': '_isPending()',
                '(click)': '_focusInput()',
            },
            encapsulation: ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [])
    ], MdInputContainer);
    return MdInputContainer;
}());

//# sourceMappingURL=input-container.js.map

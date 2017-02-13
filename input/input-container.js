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
        // Unique ID for the hint. Used for the aria-describedby on the input.
        this.id = "md-input-hint-" + nextUniqueId++;
    }
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdHint.prototype, "align", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdHint.prototype, "id", void 0);
    MdHint = __decorate([
        Directive({
            selector: 'md-hint, mat-hint',
            host: {
                '[class.mat-hint]': 'true',
                '[class.mat-right]': 'align == "end"',
                '[attr.id]': 'id',
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdHint);
    return MdHint;
}());
/** The input directive, used to mark the input that `MdInputContainer` is wrapping. */
export var MdInputDirective = (function () {
    function MdInputDirective(_elementRef, _renderer, _ngControl) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngControl = _ngControl;
        /** Variables used as cache for getters and setters. */
        this._type = 'text';
        this._placeholder = '';
        this._disabled = false;
        this._required = false;
        /** Whether the element is focused or not. */
        this.focused = false;
        /**
         * Emits an event when the placeholder changes so that the `md-input-container` can re-validate.
         */
        this._placeholderChange = new EventEmitter();
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
    }
    Object.defineProperty(MdInputDirective.prototype, "disabled", {
        /** Whether the element is disabled. */
        get: function () {
            return this._ngControl ? this._ngControl.disabled : this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "id", {
        /** Unique id of the element. */
        get: function () { return this._id; },
        set: function (value) { this._id = value || this._uid; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdInputDirective.prototype, "placeholder", {
        /** Placeholder attribute of the element. */
        get: function () { return this._placeholder; },
        set: function (value) {
            if (this._placeholder !== value) {
                this._placeholder = value;
                this._placeholderChange.emit(this._placeholder);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "required", {
        /** Whether the element is required. */
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "type", {
        /** Input type of the element. */
        get: function () { return this._type; },
        set: function (value) {
            this._type = value || 'text';
            this._validateType();
            // When using Angular inputs, developers are no longer able to set the properties on the native
            // input element. To ensure that bindings for `type` work, we need to sync the setter
            // with the native property. Textarea elements don't support the type property or attribute.
            if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
                this._renderer.setElementProperty(this._elementRef.nativeElement, 'type', this._type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "value", {
        /** The input element's value. */
        get: function () { return this._elementRef.nativeElement.value; },
        set: function (value) { this._elementRef.nativeElement.value = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "empty", {
        get: function () {
            return !this._isNeverEmpty() &&
                (this.value == null || this.value === '') &&
                // Check if the input contains bad input. If so, we know that it only appears empty because
                // the value failed to parse. From the user's perspective it is not empty.
                // TODO(mmalerba): Add e2e test for bad input case.
                !this._isBadInput();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "_uid", {
        get: function () { return this._cachedUid = this._cachedUid || "md-input-" + nextUniqueId++; },
        enumerable: true,
        configurable: true
    });
    /** Focuses the input element. */
    MdInputDirective.prototype.focus = function () { this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus'); };
    MdInputDirective.prototype._onFocus = function () { this.focused = true; };
    MdInputDirective.prototype._onBlur = function () { this.focused = false; };
    MdInputDirective.prototype._onInput = function () {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    };
    /** Make sure the input is a supported type. */
    MdInputDirective.prototype._validateType = function () {
        if (MD_INPUT_INVALID_TYPES.indexOf(this._type) !== -1) {
            throw new MdInputContainerUnsupportedTypeError(this._type);
        }
    };
    MdInputDirective.prototype._isNeverEmpty = function () { return this._neverEmptyInputTypes.indexOf(this._type) !== -1; };
    MdInputDirective.prototype._isBadInput = function () {
        return this._elementRef.nativeElement.validity.badInput;
    };
    /** Determines if the component host is a textarea. If not recognizable it returns false. */
    MdInputDirective.prototype._isTextarea = function () {
        var nativeElement = this._elementRef.nativeElement;
        return nativeElement ? nativeElement.nodeName.toLowerCase() === 'textarea' : false;
    };
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
            selector: "input[mdInput], textarea[mdInput], input[matInput], textarea[matInput]",
            host: {
                '[class.mat-input-element]': 'true',
                // Native input properties that are overwritten by Angular inputs need to be synced with
                // the native input element. Otherwise property bindings for those don't work.
                '[id]': 'id',
                '[placeholder]': 'placeholder',
                '[disabled]': 'disabled',
                '[required]': 'required',
                '[attr.aria-describedby]': 'ariaDescribedby',
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
        /** Alignment of the input container's content. */
        this.align = 'start';
        /** Color of the input divider, based on the theme. */
        this.dividerColor = 'primary';
        this._hintLabel = '';
        // Unique id for the hint label.
        this._hintLabelId = "md-input-hint-" + nextUniqueId++;
        this._floatPlaceholder = 'auto';
    }
    Object.defineProperty(MdInputContainer.prototype, "_shouldAlwaysFloat", {
        /** Whether the floating label should always float or not. */
        get: function () { return this._floatPlaceholder === 'always'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdInputContainer.prototype, "_canPlaceholderFloat", {
        /** Whether the placeholder can float or not. */
        get: function () { return this._floatPlaceholder !== 'never'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "hintLabel", {
        /** Text for the input hint. */
        get: function () { return this._hintLabel; },
        set: function (value) {
            this._hintLabel = value;
            this._processHints();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "floatPlaceholder", {
        /** Whether the placeholder should always float, never float or float as the user types. */
        get: function () { return this._floatPlaceholder; },
        set: function (value) {
            this._floatPlaceholder = value || 'auto';
        },
        enumerable: true,
        configurable: true
    });
    MdInputContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (!this._mdInputChild) {
            throw new MdInputContainerMissingMdInputError();
        }
        this._processHints();
        this._validatePlaceholders();
        // Re-validate when things change.
        this._hintChildren.changes.subscribe(function () { return _this._processHints(); });
        this._mdInputChild._placeholderChange.subscribe(function () { return _this._validatePlaceholders(); });
    };
    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    MdInputContainer.prototype._shouldForward = function (prop) {
        var control = this._mdInputChild ? this._mdInputChild._ngControl : null;
        return control && control[prop];
    };
    /** Whether the input has a placeholder. */
    MdInputContainer.prototype._hasPlaceholder = function () { return !!(this._mdInputChild.placeholder || this._placeholderChild); };
    /** Focuses the underlying input. */
    MdInputContainer.prototype._focusInput = function () { this._mdInputChild.focus(); };
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
     * Does any extra processing that is required when handling the hints.
     */
    MdInputContainer.prototype._processHints = function () {
        this._validateHints();
        this._syncAriaDescribedby();
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
    /**
     * Sets the child input's `aria-describedby` to a space-separated list of the ids
     * of the currently-specified hints, as well as a generated id for the hint label.
     */
    MdInputContainer.prototype._syncAriaDescribedby = function () {
        var ids = [];
        var startHint = this._hintChildren ?
            this._hintChildren.find(function (hint) { return hint.align === 'start'; }) : null;
        var endHint = this._hintChildren ?
            this._hintChildren.find(function (hint) { return hint.align === 'end'; }) : null;
        if (startHint) {
            ids.push(startHint.id);
        }
        else if (this._hintLabel) {
            ids.push(this._hintLabelId);
        }
        if (endHint) {
            ids.push(endHint.id);
        }
        this._mdInputChild.ariaDescribedby = ids.join(' ');
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
        __metadata('design:type', Object)
    ], MdInputContainer.prototype, "floatPlaceholder", null);
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
            template: "<div class=\"mat-input-wrapper\"><div class=\"mat-input-table\"><div class=\"mat-input-prefix\"><ng-content select=\"[mdPrefix], [matPrefix], [md-prefix]\"></ng-content></div><div class=\"mat-input-infix\" [class.mat-end]=\"align == 'end'\"><ng-content selector=\"input, textarea\"></ng-content><span class=\"mat-input-placeholder-wrapper\"><label class=\"mat-input-placeholder\" [attr.for]=\"_mdInputChild.id\" [class.mat-empty]=\"_mdInputChild.empty && !_shouldAlwaysFloat\" [class.mat-focused]=\"_mdInputChild.focused\" [class.mat-float]=\"_canPlaceholderFloat\" [class.mat-accent]=\"dividerColor == 'accent'\" [class.mat-warn]=\"dividerColor == 'warn'\" *ngIf=\"_hasPlaceholder()\"><ng-content select=\"md-placeholder, mat-placeholder\"></ng-content>{{_mdInputChild.placeholder}} <span class=\"mat-placeholder-required\" *ngIf=\"_mdInputChild.required\">*</span></label></span></div><div class=\"mat-input-suffix\"><ng-content select=\"[mdSuffix], [matSuffix], [md-suffix]\"></ng-content></div></div><div class=\"mat-input-underline\" [class.mat-disabled]=\"_mdInputChild.disabled\"><span class=\"mat-input-ripple\" [class.mat-focused]=\"_mdInputChild.focused\" [class.mat-accent]=\"dividerColor == 'accent'\" [class.mat-warn]=\"dividerColor == 'warn'\"></span></div><div *ngIf=\"hintLabel != ''\" [attr.id]=\"_hintLabelId\" class=\"mat-hint\">{{hintLabel}}</div><ng-content select=\"md-hint, mat-hint\"></ng-content></div>",
            styles: [".mat-input-container{display:inline-block;position:relative;font-family:Roboto,\"Helvetica Neue\",sans-serif;line-height:normal;text-align:left}.mat-end .mat-input-element,[dir=rtl] .mat-input-container{text-align:right}.mat-input-wrapper{margin:1em 0;padding-bottom:6px}.mat-input-table{display:inline-table;flex-flow:column;vertical-align:bottom;width:100%}.mat-input-table>*{display:table-cell}.mat-input-infix{position:relative}.mat-input-element{font:inherit;background:0 0;color:currentColor;border:none;outline:0;padding:0;width:100%}.mat-input-placeholder,.mat-input-placeholder-wrapper{padding-top:1em;pointer-events:none;position:absolute}[dir=rtl] .mat-end .mat-input-element{text-align:left}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element:-webkit-autofill+.mat-input-placeholder.mat-float{display:block;transform:translateY(-1.35em) scale(.75);width:133.33333%}.mat-input-element::placeholder{color:transparent}.mat-input-element::-moz-placeholder{color:transparent}.mat-input-element::-webkit-input-placeholder{color:transparent}.mat-input-element:-ms-input-placeholder{color:transparent}.mat-input-placeholder{left:0;top:0;font-size:100%;z-index:1;width:100%;display:none;white-space:nowrap;text-overflow:ellipsis;overflow-x:hidden;transform:translateY(0);transform-origin:bottom left;transition:transform .4s cubic-bezier(.25,.8,.25,1),color .4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.mat-input-placeholder.mat-empty{display:block;cursor:text}.mat-input-placeholder.mat-float.mat-focused,.mat-input-placeholder.mat-float:not(.mat-empty){display:block;transform:translateY(-1.35em) scale(.75);width:133.33333%}[dir=rtl] .mat-input-placeholder{transform-origin:bottom right;left:auto;right:0}.mat-input-placeholder-wrapper{left:0;top:-1em;width:100%;overflow:hidden}.mat-input-placeholder-wrapper::after{content:'';display:inline-table}.mat-input-underline{position:absolute;height:1px;width:100%;margin-top:4px;border-top-width:1px;border-top-style:solid}.mat-input-underline.mat-disabled{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;border-top:0;background-position:0}.mat-input-underline .mat-input-ripple{position:absolute;height:2px;z-index:1;top:-1px;width:100%;transform-origin:top;opacity:0;transform:scaleY(0);transition:transform .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.mat-input-underline .mat-input-ripple.mat-focused{opacity:1;transform:scaleY(1)}.mat-hint{display:block;position:absolute;font-size:75%;bottom:0}.mat-hint.mat-right{right:0}[dir=rtl] .mat-hint{right:0;left:auto}[dir=rtl] .mat-hint.mat-right{right:auto;left:0}.mat-input-prefix,.mat-input-suffix{width:.1px;white-space:nowrap}"],
            host: {
                '[class.mat-input-container]': 'true',
                // Remove align attribute to prevent it from interfering with layout.
                '[attr.align]': 'null',
                '[class.ng-untouched]': '_shouldForward("untouched")',
                '[class.ng-touched]': '_shouldForward("touched")',
                '[class.ng-pristine]': '_shouldForward("pristine")',
                '[class.ng-dirty]': '_shouldForward("dirty")',
                '[class.ng-valid]': '_shouldForward("valid")',
                '[class.ng-invalid]': '_shouldForward("invalid")',
                '[class.ng-pending]': '_shouldForward("pending")',
                '(click)': '_focusInput()',
            },
            encapsulation: ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [])
    ], MdInputContainer);
    return MdInputContainer;
}());
//# sourceMappingURL=input-container.js.map
import { AfterContentInit, ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { FocusOriginMonitor, HammerInput, MdRipple } from '../core';
import { ControlValueAccessor } from '@angular/forms';
import { CanDisable } from '../core/common-behaviors/disabled';
export declare const MD_SLIDE_TOGGLE_VALUE_ACCESSOR: any;
export declare class MdSlideToggleChange {
    source: MdSlideToggle;
    checked: boolean;
}
export declare class MdSlideToggleBase {
}
export declare const _MdSlideToggleMixinBase: (new (...args: any[]) => CanDisable) & typeof MdSlideToggleBase;
/** Represents a slidable "switch" toggle that can be moved between on and off. */
export declare class MdSlideToggle extends _MdSlideToggleMixinBase implements OnDestroy, AfterContentInit, ControlValueAccessor, CanDisable {
    private _elementRef;
    private _renderer;
    private _focusOriginMonitor;
    private onChange;
    private onTouched;
    private _uniqueId;
    private _checked;
    private _color;
    private _slideRenderer;
    private _required;
    private _disableRipple;
    /** Reference to the focus state ripple. */
    private _focusRipple;
    /** Name value will be applied to the input element if present */
    name: string;
    /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
    id: string;
    /** Used to specify the tabIndex value for the underlying input element. */
    tabIndex: number;
    /** Whether the label should appear after or before the slide-toggle. Defaults to 'after' */
    labelPosition: 'before' | 'after';
    /** Used to set the aria-label attribute on the underlying input element. */
    ariaLabel: string;
    /** Used to set the aria-labelledby attribute on the underlying input element. */
    ariaLabelledby: string;
    /** Whether the slide-toggle is required. */
    required: boolean;
    /** Whether the ripple effect for this slide-toggle is disabled. */
    disableRipple: boolean;
    /** An event will be dispatched each time the slide-toggle changes its value. */
    change: EventEmitter<MdSlideToggleChange>;
    /** Returns the unique id for the visual hidden input. */
    readonly inputId: string;
    /** Reference to the underlying input element. */
    _inputElement: ElementRef;
    /** Reference to the ripple directive on the thumb container. */
    _ripple: MdRipple;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _focusOriginMonitor: FocusOriginMonitor);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * The onChangeEvent method will be also called on click.
     * This is because everything for the slide-toggle is wrapped inside of a label,
     * which triggers a onChange event on click.
     */
    _onChangeEvent(event: Event): void;
    _onInputClick(event: Event): void;
    /** Implemented as part of ControlValueAccessor. */
    writeValue(value: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: any): void;
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled: boolean): void;
    /** Focuses the slide-toggle. */
    focus(): void;
    /** Whether the slide-toggle is checked. */
    checked: boolean;
    /** The color of the slide-toggle. Can be primary, accent, or warn. */
    color: string;
    /** Toggles the checked state of the slide-toggle. */
    toggle(): void;
    /** Function is called whenever the focus changes for the input element. */
    private _onInputFocusChange(focusOrigin);
    private _updateColor(newColor);
    private _setElementColor(color, isAdd);
    /** Emits the change event to the `change` output EventEmitter */
    private _emitChangeEvent();
    _onDragStart(): void;
    _onDrag(event: HammerInput): void;
    _onDragEnd(): void;
}

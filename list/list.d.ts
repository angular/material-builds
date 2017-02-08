import { QueryList, ElementRef, Renderer, AfterContentInit, ModuleWithProviders } from '@angular/core';
import { MdLine } from '../core';
export declare class MdListDivider {
}
export declare class MdList {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdNavListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdDividerCssMatStyler {
}
export declare class MdListAvatarCssMatStyler {
}
export declare class MdListIconCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export declare class MdListSubheaderCssMatStyler {
}
export declare class MdListItem implements AfterContentInit {
    private _renderer;
    private _element;
    _hasFocus: boolean;
    private _lineSetter;
    _lines: QueryList<MdLine>;
    _hasAvatar: MdListAvatarCssMatStyler;
    constructor(_renderer: Renderer, _element: ElementRef);
    ngAfterContentInit(): void;
    _handleFocus(): void;
    _handleBlur(): void;
}
export declare class MdListModule {
    /** @deprecated */
    static forRoot(): ModuleWithProviders;
}

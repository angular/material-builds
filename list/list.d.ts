import { QueryList, ElementRef, Renderer, AfterContentInit, ModuleWithProviders } from '@angular/core';
import { MdLine } from '../core';
export declare class MdListDivider {
}
export declare class MdList {
}
export declare class MdListAvatar {
}
export declare class MdListItem implements AfterContentInit {
    private _renderer;
    private _element;
    _hasFocus: boolean;
    private _lineSetter;
    _lines: QueryList<MdLine>;
    _hasAvatar: MdListAvatar;
    constructor(_renderer: Renderer, _element: ElementRef);
    ngAfterContentInit(): void;
    _handleFocus(): void;
    _handleBlur(): void;
}
export declare class MdListModule {
    static forRoot(): ModuleWithProviders;
}

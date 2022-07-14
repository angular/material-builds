import { AnimationTriggerMetadata } from '@angular/animations';
import { AriaDescriber } from '@angular/cdk/a11y';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { ElementRef } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { getMatTooltipInvalidPositionError } from '@angular/material/tooltip';
import * as i0 from '@angular/core';
import * as i2 from '@angular/cdk/a11y';
import * as i3 from '@angular/common';
import * as i4 from '@angular/cdk/overlay';
import * as i5 from '@angular/material/core';
import * as i6 from '@angular/cdk/scrolling';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY } from '@angular/material/tooltip';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY } from '@angular/material/tooltip';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import { _MatTooltipBase } from '@angular/material/tooltip';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { SCROLL_THROTTLE_MS } from '@angular/material/tooltip';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { _TooltipComponentBase } from '@angular/material/tooltip';
import { TooltipPosition } from '@angular/material/tooltip';
import { TooltipTouchGestures } from '@angular/material/tooltip';
import { TooltipVisibility } from '@angular/material/tooltip';
import { ViewContainerRef } from '@angular/core';

export { getMatTooltipInvalidPositionError }

declare namespace i1 {
    export {
        MatLegacyTooltip,
        LegacyTooltipComponent
    }
}

/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
export declare class LegacyTooltipComponent extends _TooltipComponentBase {
    private _breakpointObserver;
    /** Stream that emits whether the user has a handset-sized display.  */
    _isHandset: Observable<BreakpointState>;
    _showAnimation: string;
    _hideAnimation: string;
    _tooltip: ElementRef<HTMLElement>;
    constructor(changeDetectorRef: ChangeDetectorRef, _breakpointObserver: BreakpointObserver, animationMode?: string);
    static ɵfac: i0.ɵɵFactoryDeclaration<LegacyTooltipComponent, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LegacyTooltipComponent, "mat-tooltip-component", never, {}, {}, never, never, false>;
}

export { MAT_TOOLTIP_DEFAULT_OPTIONS }

export { MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY }

export { MAT_TOOLTIP_SCROLL_STRATEGY }

export { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY }

export { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER }

/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 */
export declare class MatLegacyTooltip extends _MatTooltipBase<LegacyTooltipComponent> {
    protected readonly _tooltipComponent: typeof LegacyTooltipComponent;
    constructor(overlay: Overlay, elementRef: ElementRef<HTMLElement>, scrollDispatcher: ScrollDispatcher, viewContainerRef: ViewContainerRef, ngZone: NgZone, platform: Platform, ariaDescriber: AriaDescriber, focusMonitor: FocusMonitor, scrollStrategy: any, dir: Directionality, defaultOptions: MatTooltipDefaultOptions, _document: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyTooltip, [null, null, null, null, null, null, null, null, null, { optional: true; }, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatLegacyTooltip, "[matTooltip]", ["matTooltip"], {}, {}, never, never, false>;
}

export declare class MatLegacyTooltipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyTooltipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLegacyTooltipModule, [typeof i1.MatLegacyTooltip, typeof i1.LegacyTooltipComponent], [typeof i2.A11yModule, typeof i3.CommonModule, typeof i4.OverlayModule, typeof i5.MatCommonModule], [typeof i1.MatLegacyTooltip, typeof i1.LegacyTooltipComponent, typeof i5.MatCommonModule, typeof i6.CdkScrollableModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLegacyTooltipModule>;
}

/**
 * Animations used by MatTooltip.
 * @docs-private
 */
export declare const matTooltipAnimations: {
    readonly tooltipState: AnimationTriggerMetadata;
};

export { MatTooltipDefaultOptions }

export { SCROLL_THROTTLE_MS }

export { TooltipPosition }

export { TooltipTouchGestures }

export { TooltipVisibility }

export { }

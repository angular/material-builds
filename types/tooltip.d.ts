import { MatTooltip, TooltipComponent } from './_tooltip-chunk.js';
export { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY, MatTooltipDefaultOptions, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, TooltipPosition, TooltipTouchGestures, TooltipVisibility, getMatTooltipInvalidPositionError } from './_tooltip-chunk.js';
import * as i0 from '@angular/core';
import * as i1 from '@angular/cdk/a11y';
import * as i2 from '@angular/cdk/overlay';
import * as i2$1 from '@angular/cdk/bidi';
import * as i1$1 from '@angular/cdk/scrolling';
import '@angular/cdk/coercion';
import 'rxjs';

declare class MatTooltipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTooltipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatTooltipModule, never, [typeof i1.A11yModule, typeof i2.OverlayModule, typeof MatTooltip, typeof TooltipComponent], [typeof MatTooltip, typeof TooltipComponent, typeof i2$1.BidiModule, typeof i1$1.CdkScrollableModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatTooltipModule>;
}

export { MatTooltip, MatTooltipModule, TooltipComponent };

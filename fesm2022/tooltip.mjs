import { MatTooltip, TooltipComponent } from './tooltip2.mjs';
export { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, getMatTooltipInvalidPositionError } from './tooltip2.mjs';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatCommonModule } from './common-module.mjs';
import 'rxjs/operators';
import '@angular/cdk/coercion';
import '@angular/cdk/keycodes';
import '@angular/common';
import '@angular/cdk/platform';
import '@angular/cdk/bidi';
import '@angular/cdk/portal';
import 'rxjs';
import './animation.mjs';
import '@angular/cdk/layout';

class MatTooltipModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTooltipModule, imports: [A11yModule, OverlayModule, MatCommonModule, MatTooltip, TooltipComponent], exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTooltipModule, imports: [A11yModule, OverlayModule, MatCommonModule, MatCommonModule, CdkScrollableModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [A11yModule, OverlayModule, MatCommonModule, MatTooltip, TooltipComponent],
                    exports: [MatTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule],
                }]
        }] });

export { MatTooltip, MatTooltipModule, TooltipComponent };
//# sourceMappingURL=tooltip.mjs.map

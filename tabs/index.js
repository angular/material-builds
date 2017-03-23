var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '../core';
import { MdRippleModule } from '../core/ripple/index';
import { ObserveContentModule } from '../core/observe-content/observe-content';
import { MdTab } from './tab';
import { MdTabGroup } from './tab-group';
import { MdTabLabel } from './tab-label';
import { MdTabLabelWrapper } from './tab-label-wrapper';
import { MdTabNavBar, MdTabLink, MdTabLinkRipple } from './tab-nav-bar/tab-nav-bar';
import { MdInkBar } from './ink-bar';
import { MdTabBody } from './tab-body';
import { VIEWPORT_RULER_PROVIDER } from '../core/overlay/position/viewport-ruler';
import { MdTabHeader } from './tab-header';
import { SCROLL_DISPATCHER_PROVIDER } from '../core/overlay/scroll/scroll-dispatcher';
var MdTabsModule = MdTabsModule_1 = (function () {
    function MdTabsModule() {
    }
    /** @deprecated */
    MdTabsModule.forRoot = function () {
        return {
            ngModule: MdTabsModule_1,
            providers: []
        };
    };
    return MdTabsModule;
}());
MdTabsModule = MdTabsModule_1 = __decorate([
    NgModule({
        imports: [
            CommonModule,
            PortalModule,
            MdRippleModule,
            ObserveContentModule,
        ],
        // Don't export all components because some are only to be used internally.
        exports: [
            MdTabGroup,
            MdTabLabel,
            MdTab,
            MdTabNavBar,
            MdTabLink,
            MdTabLinkRipple
        ],
        declarations: [
            MdTabGroup,
            MdTabLabel,
            MdTab,
            MdInkBar,
            MdTabLabelWrapper,
            MdTabNavBar,
            MdTabLink,
            MdTabBody,
            MdTabLinkRipple,
            MdTabHeader
        ],
        providers: [VIEWPORT_RULER_PROVIDER, SCROLL_DISPATCHER_PROVIDER],
    })
], MdTabsModule);
export { MdTabsModule };
export * from './tab-group';
export { MdInkBar } from './ink-bar';
export { MdTabBody } from './tab-body';
export { MdTabHeader } from './tab-header';
export { MdTabLabelWrapper } from './tab-label-wrapper';
export { MdTab } from './tab';
export { MdTabLabel } from './tab-label';
var MdTabsModule_1;
//# sourceMappingURL=index.js.map
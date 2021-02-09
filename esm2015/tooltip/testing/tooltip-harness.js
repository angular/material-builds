/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-tooltip in tests. */
export class MatTooltipHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._optionalPanel = this.documentRootLocatorFactory().locatorForOptional('.mat-tooltip');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search
     * for a tooltip trigger with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTooltipHarness, options);
    }
    /** Shows the tooltip. */
    show() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            // We need to dispatch both `touchstart` and a hover event, because the tooltip binds
            // different events depending on the device. The `changedTouches` is there in case the
            // element has ripples.
            // @breaking-change 12.0.0 Remove null assertion from `dispatchEvent`.
            yield ((_a = host.dispatchEvent) === null || _a === void 0 ? void 0 : _a.call(host, 'touchstart', { changedTouches: [] }));
            yield host.hover();
        });
    }
    /** Hides the tooltip. */
    hide() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            // We need to dispatch both `touchstart` and a hover event, because
            // the tooltip binds different events depending on the device.
            // @breaking-change 12.0.0 Remove null assertion from `dispatchEvent`.
            yield ((_a = host.dispatchEvent) === null || _a === void 0 ? void 0 : _a.call(host, 'touchend'));
            yield host.mouseAway();
            yield this.forceStabilize(); // Needed in order to flush the `hide` animation.
        });
    }
    /** Gets whether the tooltip is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this._optionalPanel());
        });
    }
    /** Gets a promise for the tooltip panel's text. */
    getTooltipText() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = yield this._optionalPanel();
            return panel ? panel.text() : '';
        });
    }
}
MatTooltipHarness.hostSelector = '.mat-tooltip-trigger';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Rvb2x0aXAvdGVzdGluZy90b29sdGlwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hFLG9FQUFvRTtBQUNwRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBQXZEOztRQUNVLG1CQUFjLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7SUErQ2hHLENBQUM7SUE1Q0M7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWlDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCx5QkFBeUI7SUFDbkIsSUFBSTs7O1lBQ1IsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFL0IscUZBQXFGO1lBQ3JGLHNGQUFzRjtZQUN0Rix1QkFBdUI7WUFDdkIsc0VBQXNFO1lBQ3RFLGFBQU0sSUFBSSxDQUFDLGFBQWEsK0NBQWxCLElBQUksRUFBaUIsWUFBWSxFQUFFLEVBQUMsY0FBYyxFQUFFLEVBQUUsRUFBQyxFQUFDLENBQUM7WUFDL0QsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0tBQ3BCO0lBRUQseUJBQXlCO0lBQ25CLElBQUk7OztZQUNSLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRS9CLG1FQUFtRTtZQUNuRSw4REFBOEQ7WUFDOUQsc0VBQXNFO1lBQ3RFLGFBQU0sSUFBSSxDQUFDLGFBQWEsK0NBQWxCLElBQUksRUFBaUIsVUFBVSxFQUFDLENBQUM7WUFDdkMsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxpREFBaUQ7O0tBQy9FO0lBRUQsd0NBQXdDO0lBQ2xDLE1BQU07O1lBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7S0FBQTtJQUVELG1EQUFtRDtJQUM3QyxjQUFjOztZQUNsQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMxQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkMsQ0FBQztLQUFBOztBQTdDTSw4QkFBWSxHQUFHLHNCQUFzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtUb29sdGlwSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdG9vbHRpcC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC10b29sdGlwIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRvb2x0aXBIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByaXZhdGUgX29wdGlvbmFsUGFuZWwgPSB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCkubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LXRvb2x0aXAnKTtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRvb2x0aXAtdHJpZ2dlcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2hcbiAgICogZm9yIGEgdG9vbHRpcCB0cmlnZ2VyIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVG9vbHRpcEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRvb2x0aXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFRvb2x0aXBIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcC4gKi9cbiAgYXN5bmMgc2hvdygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRpc3BhdGNoIGJvdGggYHRvdWNoc3RhcnRgIGFuZCBhIGhvdmVyIGV2ZW50LCBiZWNhdXNlIHRoZSB0b29sdGlwIGJpbmRzXG4gICAgLy8gZGlmZmVyZW50IGV2ZW50cyBkZXBlbmRpbmcgb24gdGhlIGRldmljZS4gVGhlIGBjaGFuZ2VkVG91Y2hlc2AgaXMgdGhlcmUgaW4gY2FzZSB0aGVcbiAgICAvLyBlbGVtZW50IGhhcyByaXBwbGVzLlxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wIFJlbW92ZSBudWxsIGFzc2VydGlvbiBmcm9tIGBkaXNwYXRjaEV2ZW50YC5cbiAgICBhd2FpdCBob3N0LmRpc3BhdGNoRXZlbnQ/LigndG91Y2hzdGFydCcsIHtjaGFuZ2VkVG91Y2hlczogW119KTtcbiAgICBhd2FpdCBob3N0LmhvdmVyKCk7XG4gIH1cblxuICAvKiogSGlkZXMgdGhlIHRvb2x0aXAuICovXG4gIGFzeW5jIGhpZGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuXG4gICAgLy8gV2UgbmVlZCB0byBkaXNwYXRjaCBib3RoIGB0b3VjaHN0YXJ0YCBhbmQgYSBob3ZlciBldmVudCwgYmVjYXVzZVxuICAgIC8vIHRoZSB0b29sdGlwIGJpbmRzIGRpZmZlcmVudCBldmVudHMgZGVwZW5kaW5nIG9uIHRoZSBkZXZpY2UuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMi4wLjAgUmVtb3ZlIG51bGwgYXNzZXJ0aW9uIGZyb20gYGRpc3BhdGNoRXZlbnRgLlxuICAgIGF3YWl0IGhvc3QuZGlzcGF0Y2hFdmVudD8uKCd0b3VjaGVuZCcpO1xuICAgIGF3YWl0IGhvc3QubW91c2VBd2F5KCk7XG4gICAgYXdhaXQgdGhpcy5mb3JjZVN0YWJpbGl6ZSgpOyAvLyBOZWVkZWQgaW4gb3JkZXIgdG8gZmx1c2ggdGhlIGBoaWRlYCBhbmltYXRpb24uXG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSB0b29sdGlwIGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gISEoYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHRvb2x0aXAgcGFuZWwncyB0ZXh0LiAqL1xuICBhc3luYyBnZXRUb29sdGlwVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpO1xuICAgIHJldHVybiBwYW5lbCA/IHBhbmVsLnRleHQoKSA6ICcnO1xuICB9XG59XG4iXX0=
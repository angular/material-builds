/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-template-check", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    /** List of known events which are supported by the "HammerGesturesPlugin". */
    const STANDARD_HAMMERJS_EVENTS = [
        // Events supported by the "HammerGesturesPlugin". See:
        // angular/angular/blob/0119f46d/packages/platform-browser/src/dom/events/hammer_gestures.ts#L19
        'pan', 'panstart', 'panmove', 'panend', 'pancancel', 'panleft',
        'panright', 'panup', 'pandown', 'pinch', 'pinchstart', 'pinchmove',
        'pinchend', 'pinchcancel', 'pinchin', 'pinchout', 'press', 'pressup',
        'rotate', 'rotatestart', 'rotatemove', 'rotateend', 'rotatecancel', 'swipe',
        'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'tap',
    ];
    /** List of events which are provided by the deprecated Angular Material "GestureConfig". */
    const CUSTOM_MATERIAL_HAMMERJS_EVENS = ['longpress', 'slide', 'slidestart', 'slideend', 'slideright', 'slideleft'];
    /**
     * Parses the specified HTML and searches for elements with Angular outputs listening to
     * one of the known HammerJS events. This check naively assumes that the bindings never
     * match on a component output, but only on the Hammer plugin.
     */
    function isHammerJsUsedInTemplate(html) {
        const document = schematics_1.parse5.parseFragment(html, { sourceCodeLocationInfo: true });
        let customEvents = false;
        let standardEvents = false;
        const visitNodes = nodes => {
            nodes.forEach((node) => {
                if (node.attrs) {
                    for (let attr of node.attrs) {
                        if (!customEvents && CUSTOM_MATERIAL_HAMMERJS_EVENS.some(e => `(${e})` === attr.name)) {
                            customEvents = true;
                        }
                        if (!standardEvents && STANDARD_HAMMERJS_EVENTS.some(e => `(${e})` === attr.name)) {
                            standardEvents = true;
                        }
                    }
                }
                // Do not continue traversing the AST if both type of HammerJS
                // usages have been detected already.
                if (node.childNodes && (!customEvents || !standardEvents)) {
                    visitNodes(node.childNodes);
                }
            });
        };
        visitNodes(document.childNodes);
        return { customEvents, standardEvents };
    }
    exports.isHammerJsUsedInTemplate = isHammerJsUsedInTemplate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLXRlbXBsYXRlLWNoZWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvaGFtbWVyLWdlc3R1cmVzLXY5L2hhbW1lci10ZW1wbGF0ZS1jaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUErQztJQUUvQyw4RUFBOEU7SUFDOUUsTUFBTSx3QkFBd0IsR0FBRztRQUMvQix1REFBdUQ7UUFDdkQsZ0dBQWdHO1FBQ2hHLEtBQUssRUFBUSxVQUFVLEVBQUssU0FBUyxFQUFLLFFBQVEsRUFBSyxXQUFXLEVBQUssU0FBUztRQUNoRixVQUFVLEVBQUcsT0FBTyxFQUFRLFNBQVMsRUFBSyxPQUFPLEVBQU0sWUFBWSxFQUFJLFdBQVc7UUFDbEYsVUFBVSxFQUFHLGFBQWEsRUFBRSxTQUFTLEVBQUssVUFBVSxFQUFHLE9BQU8sRUFBUyxTQUFTO1FBQ2hGLFFBQVEsRUFBSyxhQUFhLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsT0FBTztRQUM5RSxXQUFXLEVBQUUsWUFBWSxFQUFHLFNBQVMsRUFBSyxXQUFXLEVBQUUsS0FBSztLQUM3RCxDQUFDO0lBRUYsNEZBQTRGO0lBQzVGLE1BQU0sOEJBQThCLEdBQ2hDLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVoRjs7OztPQUlHO0lBQ0gsU0FBZ0Isd0JBQXdCLENBQUMsSUFBWTtRQUVuRCxNQUFNLFFBQVEsR0FDVixtQkFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxzQkFBc0IsRUFBRSxJQUFJLEVBQUMsQ0FBK0IsQ0FBQztRQUM3RixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzNCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUErQixFQUFFLEVBQUU7Z0JBQ2hELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDZCxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQzNCLElBQUksQ0FBQyxZQUFZLElBQUksOEJBQThCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQ3JGLFlBQVksR0FBRyxJQUFJLENBQUM7eUJBQ3JCO3dCQUNELElBQUksQ0FBQyxjQUFjLElBQUksd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQ2pGLGNBQWMsR0FBRyxJQUFJLENBQUM7eUJBQ3ZCO3FCQUNGO2lCQUNGO2dCQUVELDhEQUE4RDtnQkFDOUQscUNBQXFDO2dCQUNyQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO29CQUN6RCxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUM3QjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoQyxPQUFPLEVBQUMsWUFBWSxFQUFFLGNBQWMsRUFBQyxDQUFDO0lBQ3hDLENBQUM7SUE1QkQsNERBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGFyc2U1fSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbi8qKiBMaXN0IG9mIGtub3duIGV2ZW50cyB3aGljaCBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBcIkhhbW1lckdlc3R1cmVzUGx1Z2luXCIuICovXG5jb25zdCBTVEFOREFSRF9IQU1NRVJKU19FVkVOVFMgPSBbXG4gIC8vIEV2ZW50cyBzdXBwb3J0ZWQgYnkgdGhlIFwiSGFtbWVyR2VzdHVyZXNQbHVnaW5cIi4gU2VlOlxuICAvLyBhbmd1bGFyL2FuZ3VsYXIvYmxvYi8wMTE5ZjQ2ZC9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZXZlbnRzL2hhbW1lcl9nZXN0dXJlcy50cyNMMTlcbiAgJ3BhbicsICAgICAgICdwYW5zdGFydCcsICAgICdwYW5tb3ZlJywgICAgJ3BhbmVuZCcsICAgICdwYW5jYW5jZWwnLCAgICAncGFubGVmdCcsXG4gICdwYW5yaWdodCcsICAncGFudXAnLCAgICAgICAncGFuZG93bicsICAgICdwaW5jaCcsICAgICAncGluY2hzdGFydCcsICAgJ3BpbmNobW92ZScsXG4gICdwaW5jaGVuZCcsICAncGluY2hjYW5jZWwnLCAncGluY2hpbicsICAgICdwaW5jaG91dCcsICAncHJlc3MnLCAgICAgICAgJ3ByZXNzdXAnLFxuICAncm90YXRlJywgICAgJ3JvdGF0ZXN0YXJ0JywgJ3JvdGF0ZW1vdmUnLCAncm90YXRlZW5kJywgJ3JvdGF0ZWNhbmNlbCcsICdzd2lwZScsXG4gICdzd2lwZWxlZnQnLCAnc3dpcGVyaWdodCcsICAnc3dpcGV1cCcsICAgICdzd2lwZWRvd24nLCAndGFwJyxcbl07XG5cbi8qKiBMaXN0IG9mIGV2ZW50cyB3aGljaCBhcmUgcHJvdmlkZWQgYnkgdGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBcIkdlc3R1cmVDb25maWdcIi4gKi9cbmNvbnN0IENVU1RPTV9NQVRFUklBTF9IQU1NRVJKU19FVkVOUyA9XG4gICAgWydsb25ncHJlc3MnLCAnc2xpZGUnLCAnc2xpZGVzdGFydCcsICdzbGlkZWVuZCcsICdzbGlkZXJpZ2h0JywgJ3NsaWRlbGVmdCddO1xuXG4vKipcbiAqIFBhcnNlcyB0aGUgc3BlY2lmaWVkIEhUTUwgYW5kIHNlYXJjaGVzIGZvciBlbGVtZW50cyB3aXRoIEFuZ3VsYXIgb3V0cHV0cyBsaXN0ZW5pbmcgdG9cbiAqIG9uZSBvZiB0aGUga25vd24gSGFtbWVySlMgZXZlbnRzLiBUaGlzIGNoZWNrIG5haXZlbHkgYXNzdW1lcyB0aGF0IHRoZSBiaW5kaW5ncyBuZXZlclxuICogbWF0Y2ggb24gYSBjb21wb25lbnQgb3V0cHV0LCBidXQgb25seSBvbiB0aGUgSGFtbWVyIHBsdWdpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZShodG1sOiBzdHJpbmcpOlxuICAgIHtzdGFuZGFyZEV2ZW50czogYm9vbGVhbiwgY3VzdG9tRXZlbnRzOiBib29sZWFufSB7XG4gIGNvbnN0IGRvY3VtZW50ID1cbiAgICAgIHBhcnNlNS5wYXJzZUZyYWdtZW50KGh0bWwsIHtzb3VyY2VDb2RlTG9jYXRpb25JbmZvOiB0cnVlfSkgYXMgcGFyc2U1LkRlZmF1bHRUcmVlRG9jdW1lbnQ7XG4gIGxldCBjdXN0b21FdmVudHMgPSBmYWxzZTtcbiAgbGV0IHN0YW5kYXJkRXZlbnRzID0gZmFsc2U7XG4gIGNvbnN0IHZpc2l0Tm9kZXMgPSBub2RlcyA9PiB7XG4gICAgbm9kZXMuZm9yRWFjaCgobm9kZTogcGFyc2U1LkRlZmF1bHRUcmVlRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKG5vZGUuYXR0cnMpIHtcbiAgICAgICAgZm9yIChsZXQgYXR0ciBvZiBub2RlLmF0dHJzKSB7XG4gICAgICAgICAgaWYgKCFjdXN0b21FdmVudHMgJiYgQ1VTVE9NX01BVEVSSUFMX0hBTU1FUkpTX0VWRU5TLnNvbWUoZSA9PiBgKCR7ZX0pYCA9PT0gYXR0ci5uYW1lKSkge1xuICAgICAgICAgICAgY3VzdG9tRXZlbnRzID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFzdGFuZGFyZEV2ZW50cyAmJiBTVEFOREFSRF9IQU1NRVJKU19FVkVOVFMuc29tZShlID0+IGAoJHtlfSlgID09PSBhdHRyLm5hbWUpKSB7XG4gICAgICAgICAgICBzdGFuZGFyZEV2ZW50cyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERvIG5vdCBjb250aW51ZSB0cmF2ZXJzaW5nIHRoZSBBU1QgaWYgYm90aCB0eXBlIG9mIEhhbW1lckpTXG4gICAgICAvLyB1c2FnZXMgaGF2ZSBiZWVuIGRldGVjdGVkIGFscmVhZHkuXG4gICAgICBpZiAobm9kZS5jaGlsZE5vZGVzICYmICghY3VzdG9tRXZlbnRzIHx8ICFzdGFuZGFyZEV2ZW50cykpIHtcbiAgICAgICAgdmlzaXROb2Rlcyhub2RlLmNoaWxkTm9kZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICB2aXNpdE5vZGVzKGRvY3VtZW50LmNoaWxkTm9kZXMpO1xuICByZXR1cm4ge2N1c3RvbUV2ZW50cywgc3RhbmRhcmRFdmVudHN9O1xufVxuIl19
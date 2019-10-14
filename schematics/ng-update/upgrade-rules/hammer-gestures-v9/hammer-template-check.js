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
    /**
     * List of known events which are supported by the "HammerGesturesPlugin" and by
     * the gesture config which was provided by Angular Material.
     */
    const KNOWN_HAMMERJS_EVENTS = [
        // Events supported by the "HammerGesturesPlugin". See:
        // angular/angular/blob/0119f46d/packages/platform-browser/src/dom/events/hammer_gestures.ts#L19
        'pan', 'panstart', 'panmove', 'panend', 'pancancel', 'panleft', 'panright', 'panup', 'pandown',
        'pinch', 'pinchstart', 'pinchmove', 'pinchend', 'pinchcancel', 'pinchin', 'pinchout', 'press',
        'pressup', 'rotate', 'rotatestart', 'rotatemove', 'rotateend', 'rotatecancel', 'swipe',
        'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'tap',
        // Events from the Angular Material gesture config.
        'longpress', 'slide', 'slidestart', 'slideend', 'slideright', 'slideleft'
    ];
    /**
     * Parses the specified HTML and searches for elements with Angular outputs listening to
     * one of the known HammerJS events. This check naively assumes that the bindings never
     * match on a component output, but only on the Hammer plugin.
     */
    function isHammerJsUsedInTemplate(html) {
        const document = schematics_1.parse5.parseFragment(html, { sourceCodeLocationInfo: true });
        let result = false;
        const visitNodes = nodes => {
            nodes.forEach(node => {
                if (node.attrs &&
                    node.attrs.some(attr => KNOWN_HAMMERJS_EVENTS.some(e => `(${e})` === attr.name))) {
                    result = true;
                }
                else if (node.childNodes) {
                    visitNodes(node.childNodes);
                }
            });
        };
        visitNodes(document.childNodes);
        return result;
    }
    exports.isHammerJsUsedInTemplate = isHammerJsUsedInTemplate;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLXRlbXBsYXRlLWNoZWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvaGFtbWVyLWdlc3R1cmVzLXY5L2hhbW1lci10ZW1wbGF0ZS1jaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUErQztJQUUvQzs7O09BR0c7SUFDSCxNQUFNLHFCQUFxQixHQUFHO1FBQzVCLHVEQUF1RDtRQUN2RCxnR0FBZ0c7UUFDaEcsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTO1FBQzlGLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQzdGLFNBQVMsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLE9BQU87UUFDdEYsV0FBVyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUs7UUFFeEQsbURBQW1EO1FBQ25ELFdBQVcsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsV0FBVztLQUMxRSxDQUFDO0lBRUY7Ozs7T0FJRztJQUNILFNBQWdCLHdCQUF3QixDQUFDLElBQVk7UUFDbkQsTUFBTSxRQUFRLEdBQ1YsbUJBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFDLENBQStCLENBQUM7UUFDN0YsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLElBQUksSUFBSSxDQUFDLEtBQUs7b0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO29CQUNwRixNQUFNLEdBQUcsSUFBSSxDQUFDO2lCQUNmO3FCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDMUIsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDN0I7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUNGLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQWhCRCw0REFnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtwYXJzZTV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuLyoqXG4gKiBMaXN0IG9mIGtub3duIGV2ZW50cyB3aGljaCBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBcIkhhbW1lckdlc3R1cmVzUGx1Z2luXCIgYW5kIGJ5XG4gKiB0aGUgZ2VzdHVyZSBjb25maWcgd2hpY2ggd2FzIHByb3ZpZGVkIGJ5IEFuZ3VsYXIgTWF0ZXJpYWwuXG4gKi9cbmNvbnN0IEtOT1dOX0hBTU1FUkpTX0VWRU5UUyA9IFtcbiAgLy8gRXZlbnRzIHN1cHBvcnRlZCBieSB0aGUgXCJIYW1tZXJHZXN0dXJlc1BsdWdpblwiLiBTZWU6XG4gIC8vIGFuZ3VsYXIvYW5ndWxhci9ibG9iLzAxMTlmNDZkL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS9ldmVudHMvaGFtbWVyX2dlc3R1cmVzLnRzI0wxOVxuICAncGFuJywgJ3BhbnN0YXJ0JywgJ3Bhbm1vdmUnLCAncGFuZW5kJywgJ3BhbmNhbmNlbCcsICdwYW5sZWZ0JywgJ3BhbnJpZ2h0JywgJ3BhbnVwJywgJ3BhbmRvd24nLFxuICAncGluY2gnLCAncGluY2hzdGFydCcsICdwaW5jaG1vdmUnLCAncGluY2hlbmQnLCAncGluY2hjYW5jZWwnLCAncGluY2hpbicsICdwaW5jaG91dCcsICdwcmVzcycsXG4gICdwcmVzc3VwJywgJ3JvdGF0ZScsICdyb3RhdGVzdGFydCcsICdyb3RhdGVtb3ZlJywgJ3JvdGF0ZWVuZCcsICdyb3RhdGVjYW5jZWwnLCAnc3dpcGUnLFxuICAnc3dpcGVsZWZ0JywgJ3N3aXBlcmlnaHQnLCAnc3dpcGV1cCcsICdzd2lwZWRvd24nLCAndGFwJyxcblxuICAvLyBFdmVudHMgZnJvbSB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgJ2xvbmdwcmVzcycsICdzbGlkZScsICdzbGlkZXN0YXJ0JywgJ3NsaWRlZW5kJywgJ3NsaWRlcmlnaHQnLCAnc2xpZGVsZWZ0J1xuXTtcblxuLyoqXG4gKiBQYXJzZXMgdGhlIHNwZWNpZmllZCBIVE1MIGFuZCBzZWFyY2hlcyBmb3IgZWxlbWVudHMgd2l0aCBBbmd1bGFyIG91dHB1dHMgbGlzdGVuaW5nIHRvXG4gKiBvbmUgb2YgdGhlIGtub3duIEhhbW1lckpTIGV2ZW50cy4gVGhpcyBjaGVjayBuYWl2ZWx5IGFzc3VtZXMgdGhhdCB0aGUgYmluZGluZ3MgbmV2ZXJcbiAqIG1hdGNoIG9uIGEgY29tcG9uZW50IG91dHB1dCwgYnV0IG9ubHkgb24gdGhlIEhhbW1lciBwbHVnaW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0hhbW1lckpzVXNlZEluVGVtcGxhdGUoaHRtbDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGRvY3VtZW50ID1cbiAgICAgIHBhcnNlNS5wYXJzZUZyYWdtZW50KGh0bWwsIHtzb3VyY2VDb2RlTG9jYXRpb25JbmZvOiB0cnVlfSkgYXMgcGFyc2U1LkRlZmF1bHRUcmVlRG9jdW1lbnQ7XG4gIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgY29uc3QgdmlzaXROb2RlcyA9IG5vZGVzID0+IHtcbiAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgaWYgKG5vZGUuYXR0cnMgJiZcbiAgICAgICAgICBub2RlLmF0dHJzLnNvbWUoYXR0ciA9PiBLTk9XTl9IQU1NRVJKU19FVkVOVFMuc29tZShlID0+IGAoJHtlfSlgID09PSBhdHRyLm5hbWUpKSkge1xuICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChub2RlLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgdmlzaXROb2Rlcyhub2RlLmNoaWxkTm9kZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICB2aXNpdE5vZGVzKGRvY3VtZW50LmNoaWxkTm9kZXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19
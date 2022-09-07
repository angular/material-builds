/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, keyframes, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by MatTooltip.
 * @docs-private
 * @deprecated Use `matTooltipAnimations` from `@angular/material/tooltip` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const matLegacyTooltipAnimations = {
    /** Animation that transitions a tooltip in and out. */
    tooltipState: trigger('state', [
        state('initial, void, hidden', style({ opacity: 0, transform: 'scale(0)' })),
        state('visible', style({ transform: 'scale(1)' })),
        transition('* => visible', animate('200ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
            style({ opacity: 0.5, transform: 'scale(0.99)', offset: 0.5 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
        ]))),
        transition('* => hidden', animate('100ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 0 }))),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS10b29sdGlwL3Rvb2x0aXAtYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQ0wsT0FBTyxFQUVQLFNBQVMsRUFDVCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBQ1IsTUFBTSxxQkFBcUIsQ0FBQztBQUU3Qjs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUVuQztJQUNGLHVEQUF1RDtJQUN2RCxZQUFZLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRTtRQUM3QixLQUFLLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUMxRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO1FBQ2hELFVBQVUsQ0FDUixjQUFjLEVBQ2QsT0FBTyxDQUNMLGtDQUFrQyxFQUNsQyxTQUFTLENBQUM7WUFDUixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDO1lBQ3JELEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUM7WUFDNUQsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQztTQUN0RCxDQUFDLENBQ0gsQ0FDRjtRQUNELFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUYsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbiAga2V5ZnJhbWVzLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSBNYXRUb29sdGlwLlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgVXNlIGBtYXRUb29sdGlwQW5pbWF0aW9uc2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbHRpcGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgY29uc3QgbWF0TGVnYWN5VG9vbHRpcEFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgdG9vbHRpcFN0YXRlOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKiogQW5pbWF0aW9uIHRoYXQgdHJhbnNpdGlvbnMgYSB0b29sdGlwIGluIGFuZCBvdXQuICovXG4gIHRvb2x0aXBTdGF0ZTogdHJpZ2dlcignc3RhdGUnLCBbXG4gICAgc3RhdGUoJ2luaXRpYWwsIHZvaWQsIGhpZGRlbicsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgwKSd9KSksXG4gICAgc3RhdGUoJ3Zpc2libGUnLCBzdHlsZSh7dHJhbnNmb3JtOiAnc2NhbGUoMSknfSkpLFxuICAgIHRyYW5zaXRpb24oXG4gICAgICAnKiA9PiB2aXNpYmxlJyxcbiAgICAgIGFuaW1hdGUoXG4gICAgICAgICcyMDBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsXG4gICAgICAgIGtleWZyYW1lcyhbXG4gICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDApJywgb2Zmc2V0OiAwfSksXG4gICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAuNSwgdHJhbnNmb3JtOiAnc2NhbGUoMC45OSknLCBvZmZzZXQ6IDAuNX0pLFxuICAgICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxKScsIG9mZnNldDogMX0pLFxuICAgICAgICBdKSxcbiAgICAgICksXG4gICAgKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IGhpZGRlbicsIGFuaW1hdGUoJzEwMG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJywgc3R5bGUoe29wYWNpdHk6IDB9KSkpLFxuICBdKSxcbn07XG4iXX0=
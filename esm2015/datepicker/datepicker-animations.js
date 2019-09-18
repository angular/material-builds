/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material datepicker.
 * \@docs-private
 * @type {?}
 */
export const matDatepickerAnimations = {
    /**
     * Transforms the height of the datepicker's calendar.
     */
    transformPanel: trigger('transformPanel', [
        state('void', style({
            opacity: 0,
            transform: 'scale(1, 0.8)'
        })),
        transition('void => enter', animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({
            opacity: 1,
            transform: 'scale(1, 1)'
        }))),
        transition('* => void', animate('100ms linear', style({ opacity: 0 })))
    ]),
    /**
     * Fades in the content of the calendar.
     */
    fadeInCalendar: trigger('fadeInCalendar', [
        state('void', style({ opacity: 0 })),
        state('enter', style({ opacity: 1 })),
        // TODO(crisbeto): this animation should be removed since it isn't quite on spec, but we
        // need to keep it until #12440 gets in, otherwise the exit animation will look glitchy.
        transition('void => *', animate('120ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7O0FBTTdCLE1BQU0sT0FBTyx1QkFBdUIsR0FHaEM7Ozs7SUFFRixjQUFjLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQ3hDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsU0FBUyxFQUFFLGVBQWU7U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLGVBQWUsRUFBRyxPQUFPLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDO1lBQzdFLE9BQU8sRUFBRSxDQUFDO1lBQ1YsU0FBUyxFQUFFLGFBQWE7U0FDekIsQ0FBQyxDQUFDLENBQUM7UUFDSixVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUN0RSxDQUFDOzs7O0lBR0YsY0FBYyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUN4QyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ2xDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFFbkMsd0ZBQXdGO1FBQ3hGLHdGQUF3RjtRQUN4RixVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0tBQ2pGLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgTWF0ZXJpYWwgZGF0ZXBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdERhdGVwaWNrZXJBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybVBhbmVsOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IGZhZGVJbkNhbGVuZGFyOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKiogVHJhbnNmb3JtcyB0aGUgaGVpZ2h0IG9mIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIHRyYW5zZm9ybVBhbmVsOiB0cmlnZ2VyKCd0cmFuc2Zvcm1QYW5lbCcsIFtcbiAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLCAwLjgpJ1xuICAgIH0pKSxcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IGVudGVyJywgIGFuaW1hdGUoJzEyMG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJywgc3R5bGUoe1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEsIDEpJ1xuICAgIH0pKSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgYW5pbWF0ZSgnMTAwbXMgbGluZWFyJywgc3R5bGUoe29wYWNpdHk6IDB9KSkpXG4gIF0pLFxuXG4gIC8qKiBGYWRlcyBpbiB0aGUgY29udGVudCBvZiB0aGUgY2FsZW5kYXIuICovXG4gIGZhZGVJbkNhbGVuZGFyOiB0cmlnZ2VyKCdmYWRlSW5DYWxlbmRhcicsIFtcbiAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtvcGFjaXR5OiAwfSkpLFxuICAgIHN0YXRlKCdlbnRlcicsIHN0eWxlKHtvcGFjaXR5OiAxfSkpLFxuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgYW5pbWF0aW9uIHNob3VsZCBiZSByZW1vdmVkIHNpbmNlIGl0IGlzbid0IHF1aXRlIG9uIHNwZWMsIGJ1dCB3ZVxuICAgIC8vIG5lZWQgdG8ga2VlcCBpdCB1bnRpbCAjMTI0NDAgZ2V0cyBpbiwgb3RoZXJ3aXNlIHRoZSBleGl0IGFuaW1hdGlvbiB3aWxsIGxvb2sgZ2xpdGNoeS5cbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBhbmltYXRlKCcxMjBtcyAxMDBtcyBjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKScpKVxuICBdKVxufTtcbiJdfQ==
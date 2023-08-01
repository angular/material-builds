/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { InjectionToken } from '@angular/core';
/** Class that is applied when a tab indicator is active. */
const ACTIVE_CLASS = 'mdc-tab-indicator--active';
/** Class that is applied when the tab indicator should not transition. */
const NO_TRANSITION_CLASS = 'mdc-tab-indicator--no-transition';
/**
 * Abstraction around the MDC tab indicator that acts as the tab header's ink bar.
 * @docs-private
 */
export class MatInkBar {
    constructor(_items) {
        this._items = _items;
    }
    /** Hides the ink bar. */
    hide() {
        this._items.forEach(item => item.deactivateInkBar());
    }
    /** Aligns the ink bar to a DOM node. */
    alignToElement(element) {
        const correspondingItem = this._items.find(item => item.elementRef.nativeElement === element);
        const currentItem = this._currentItem;
        if (correspondingItem === currentItem) {
            return;
        }
        currentItem?.deactivateInkBar();
        if (correspondingItem) {
            const clientRect = currentItem?.elementRef.nativeElement.getBoundingClientRect?.();
            // The ink bar won't animate unless we give it the `ClientRect` of the previous item.
            correspondingItem.activateInkBar(clientRect);
            this._currentItem = correspondingItem;
        }
    }
}
/**
 * Mixin that can be used to apply the `MatInkBarItem` behavior to a class.
 * Base on MDC's `MDCSlidingTabIndicatorFoundation`:
 * https://github.com/material-components/material-components-web/blob/c0a11ef0d000a098fd0c372be8f12d6a99302855/packages/mdc-tab-indicator/sliding-foundation.ts
 * @docs-private
 */
export function mixinInkBarItem(base) {
    return class extends base {
        constructor(...args) {
            super(...args);
            this._fitToContent = false;
        }
        /** Whether the ink bar should fit to the entire tab or just its content. */
        get fitInkBarToContent() {
            return this._fitToContent;
        }
        set fitInkBarToContent(v) {
            const newValue = coerceBooleanProperty(v);
            if (this._fitToContent !== newValue) {
                this._fitToContent = newValue;
                if (this._inkBarElement) {
                    this._appendInkBarElement();
                }
            }
        }
        /** Aligns the ink bar to the current item. */
        activateInkBar(previousIndicatorClientRect) {
            const element = this.elementRef.nativeElement;
            // Early exit if no indicator is present to handle cases where an indicator
            // may be activated without a prior indicator state
            if (!previousIndicatorClientRect ||
                !element.getBoundingClientRect ||
                !this._inkBarContentElement) {
                element.classList.add(ACTIVE_CLASS);
                return;
            }
            // This animation uses the FLIP approach. You can read more about it at the link below:
            // https://aerotwist.com/blog/flip-your-animations/
            // Calculate the dimensions based on the dimensions of the previous indicator
            const currentClientRect = element.getBoundingClientRect();
            const widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
            const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
            element.classList.add(NO_TRANSITION_CLASS);
            this._inkBarContentElement.style.setProperty('transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);
            // Force repaint before updating classes and transform to ensure the transform properly takes effect
            element.getBoundingClientRect();
            element.classList.remove(NO_TRANSITION_CLASS);
            element.classList.add(ACTIVE_CLASS);
            this._inkBarContentElement.style.setProperty('transform', '');
        }
        /** Removes the ink bar from the current item. */
        deactivateInkBar() {
            this.elementRef.nativeElement.classList.remove(ACTIVE_CLASS);
        }
        /** Initializes the foundation. */
        ngOnInit() {
            this._createInkBarElement();
        }
        /** Destroys the foundation. */
        ngOnDestroy() {
            this._inkBarElement?.remove();
            this._inkBarElement = this._inkBarContentElement = null;
        }
        /** Creates and appends the ink bar element. */
        _createInkBarElement() {
            const documentNode = this.elementRef.nativeElement.ownerDocument || document;
            this._inkBarElement = documentNode.createElement('span');
            this._inkBarContentElement = documentNode.createElement('span');
            this._inkBarElement.className = 'mdc-tab-indicator';
            this._inkBarContentElement.className =
                'mdc-tab-indicator__content mdc-tab-indicator__content--underline';
            this._inkBarElement.appendChild(this._inkBarContentElement);
            this._appendInkBarElement();
        }
        /**
         * Appends the ink bar to the tab host element or content, depending on whether
         * the ink bar should fit to content.
         */
        _appendInkBarElement() {
            if (!this._inkBarElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Ink bar element has not been created and cannot be appended');
            }
            const parentElement = this._fitToContent
                ? this.elementRef.nativeElement.querySelector('.mdc-tab__content')
                : this.elementRef.nativeElement;
            if (!parentElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Missing element to host the ink bar');
            }
            parentElement.appendChild(this._inkBarElement);
        }
    };
}
/**
 * The default positioner function for the MatInkBar.
 * @docs-private
 */
export function _MAT_INK_BAR_POSITIONER_FACTORY() {
    const method = (element) => ({
        left: element ? (element.offsetLeft || 0) + 'px' : '0',
        width: element ? (element.offsetWidth || 0) + 'px' : '0',
    });
    return method;
}
/** Injection token for the MatInkBar's Positioner. */
export const _MAT_INK_BAR_POSITIONER = new InjectionToken('MatInkBarPositioner', {
    providedIn: 'root',
    factory: _MAT_INK_BAR_POSITIONER_FACTORY,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFhLGNBQWMsRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFhdkYsNERBQTREO0FBQzVELE1BQU0sWUFBWSxHQUFHLDJCQUEyQixDQUFDO0FBRWpELDBFQUEwRTtBQUMxRSxNQUFNLG1CQUFtQixHQUFHLGtDQUFrQyxDQUFDO0FBRS9EOzs7R0FHRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBSXBCLFlBQW9CLE1BQWdDO1FBQWhDLFdBQU0sR0FBTixNQUFNLENBQTBCO0lBQUcsQ0FBQztJQUV4RCx5QkFBeUI7SUFDekIsSUFBSTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLGNBQWMsQ0FBQyxPQUFvQjtRQUNqQyxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEtBQUssT0FBTyxDQUFDLENBQUM7UUFDOUYsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUV0QyxJQUFJLGlCQUFpQixLQUFLLFdBQVcsRUFBRTtZQUNyQyxPQUFPO1NBQ1I7UUFFRCxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztRQUVoQyxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLE1BQU0sVUFBVSxHQUFHLFdBQVcsRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLEVB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OztHQUdHO0FBQ0gsTUFBTSxVQUFVLCtCQUErQjtJQUM3QyxNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztRQUN0RCxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHO0tBQ3pELENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxzREFBc0Q7QUFDdEQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxjQUFjLENBQ3ZELHFCQUFxQixFQUNyQjtJQUNFLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSwrQkFBK0I7Q0FDekMsQ0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0VsZW1lbnRSZWYsIEluamVjdGlvblRva2VuLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUXVlcnlMaXN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBJdGVtIGluc2lkZSBhIHRhYiBoZWFkZXIgcmVsYXRpdmUgdG8gd2hpY2ggdGhlIGluayBiYXIgY2FuIGJlIGFsaWduZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0SW5rQmFySXRlbSBleHRlbmRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIGFjdGl2YXRlSW5rQmFyKHByZXZpb3VzSW5kaWNhdG9yQ2xpZW50UmVjdD86IENsaWVudFJlY3QpOiB2b2lkO1xuICBkZWFjdGl2YXRlSW5rQmFyKCk6IHZvaWQ7XG4gIGZpdElua0JhclRvQ29udGVudDogYm9vbGVhbjtcbn1cblxuLyoqIENsYXNzIHRoYXQgaXMgYXBwbGllZCB3aGVuIGEgdGFiIGluZGljYXRvciBpcyBhY3RpdmUuICovXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnbWRjLXRhYi1pbmRpY2F0b3ItLWFjdGl2ZSc7XG5cbi8qKiBDbGFzcyB0aGF0IGlzIGFwcGxpZWQgd2hlbiB0aGUgdGFiIGluZGljYXRvciBzaG91bGQgbm90IHRyYW5zaXRpb24uICovXG5jb25zdCBOT19UUkFOU0lUSU9OX0NMQVNTID0gJ21kYy10YWItaW5kaWNhdG9yLS1uby10cmFuc2l0aW9uJztcblxuLyoqXG4gKiBBYnN0cmFjdGlvbiBhcm91bmQgdGhlIE1EQyB0YWIgaW5kaWNhdG9yIHRoYXQgYWN0cyBhcyB0aGUgdGFiIGhlYWRlcidzIGluayBiYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRJbmtCYXIge1xuICAvKiogSXRlbSB0byB3aGljaCB0aGUgaW5rIGJhciBpcyBhbGlnbmVkIGN1cnJlbnRseS4gKi9cbiAgcHJpdmF0ZSBfY3VycmVudEl0ZW06IE1hdElua0Jhckl0ZW0gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRJbmtCYXJJdGVtPikge31cblxuICAvKiogSGlkZXMgdGhlIGluayBiYXIuICovXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5faXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVhY3RpdmF0ZUlua0JhcigpKTtcbiAgfVxuXG4gIC8qKiBBbGlnbnMgdGhlIGluayBiYXIgdG8gYSBET00gbm9kZS4gKi9cbiAgYWxpZ25Ub0VsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nSXRlbSA9IHRoaXMuX2l0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA9PT0gZWxlbWVudCk7XG4gICAgY29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLl9jdXJyZW50SXRlbTtcblxuICAgIGlmIChjb3JyZXNwb25kaW5nSXRlbSA9PT0gY3VycmVudEl0ZW0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjdXJyZW50SXRlbT8uZGVhY3RpdmF0ZUlua0JhcigpO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdJdGVtKSB7XG4gICAgICBjb25zdCBjbGllbnRSZWN0ID0gY3VycmVudEl0ZW0/LmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3Q/LigpO1xuXG4gICAgICAvLyBUaGUgaW5rIGJhciB3b24ndCBhbmltYXRlIHVubGVzcyB3ZSBnaXZlIGl0IHRoZSBgQ2xpZW50UmVjdGAgb2YgdGhlIHByZXZpb3VzIGl0ZW0uXG4gICAgICBjb3JyZXNwb25kaW5nSXRlbS5hY3RpdmF0ZUlua0JhcihjbGllbnRSZWN0KTtcbiAgICAgIHRoaXMuX2N1cnJlbnRJdGVtID0gY29ycmVzcG9uZGluZ0l0ZW07XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWl4aW4gdGhhdCBjYW4gYmUgdXNlZCB0byBhcHBseSB0aGUgYE1hdElua0Jhckl0ZW1gIGJlaGF2aW9yIHRvIGEgY2xhc3MuXG4gKiBCYXNlIG9uIE1EQydzIGBNRENTbGlkaW5nVGFiSW5kaWNhdG9yRm91bmRhdGlvbmA6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWF0ZXJpYWwtY29tcG9uZW50cy9tYXRlcmlhbC1jb21wb25lbnRzLXdlYi9ibG9iL2MwYTExZWYwZDAwMGEwOThmZDBjMzcyYmU4ZjEyZDZhOTkzMDI4NTUvcGFja2FnZXMvbWRjLXRhYi1pbmRpY2F0b3Ivc2xpZGluZy1mb3VuZGF0aW9uLnRzXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbklua0Jhckl0ZW08XG4gIFQgZXh0ZW5kcyBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiB7ZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD59LFxuPihiYXNlOiBUKTogVCAmIChuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBNYXRJbmtCYXJJdGVtKSB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pbmtCYXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgcHJpdmF0ZSBfaW5rQmFyQ29udGVudEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBwcml2YXRlIF9maXRUb0NvbnRlbnQgPSBmYWxzZTtcblxuICAgIC8qKiBXaGV0aGVyIHRoZSBpbmsgYmFyIHNob3VsZCBmaXQgdG8gdGhlIGVudGlyZSB0YWIgb3IganVzdCBpdHMgY29udGVudC4gKi9cbiAgICBnZXQgZml0SW5rQmFyVG9Db250ZW50KCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2ZpdFRvQ29udGVudDtcbiAgICB9XG4gICAgc2V0IGZpdElua0JhclRvQ29udGVudCh2OiBCb29sZWFuSW5wdXQpIHtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHYpO1xuXG4gICAgICBpZiAodGhpcy5fZml0VG9Db250ZW50ICE9PSBuZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLl9maXRUb0NvbnRlbnQgPSBuZXdWYWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5faW5rQmFyRWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuX2FwcGVuZElua0JhckVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBBbGlnbnMgdGhlIGluayBiYXIgdG8gdGhlIGN1cnJlbnQgaXRlbS4gKi9cbiAgICBhY3RpdmF0ZUlua0JhcihwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3Q/OiBDbGllbnRSZWN0KSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIEVhcmx5IGV4aXQgaWYgbm8gaW5kaWNhdG9yIGlzIHByZXNlbnQgdG8gaGFuZGxlIGNhc2VzIHdoZXJlIGFuIGluZGljYXRvclxuICAgICAgLy8gbWF5IGJlIGFjdGl2YXRlZCB3aXRob3V0IGEgcHJpb3IgaW5kaWNhdG9yIHN0YXRlXG4gICAgICBpZiAoXG4gICAgICAgICFwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3QgfHxcbiAgICAgICAgIWVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHx8XG4gICAgICAgICF0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChBQ1RJVkVfQ0xBU1MpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgYW5pbWF0aW9uIHVzZXMgdGhlIEZMSVAgYXBwcm9hY2guIFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IGl0IGF0IHRoZSBsaW5rIGJlbG93OlxuICAgICAgLy8gaHR0cHM6Ly9hZXJvdHdpc3QuY29tL2Jsb2cvZmxpcC15b3VyLWFuaW1hdGlvbnMvXG5cbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGltZW5zaW9ucyBiYXNlZCBvbiB0aGUgZGltZW5zaW9ucyBvZiB0aGUgcHJldmlvdXMgaW5kaWNhdG9yXG4gICAgICBjb25zdCBjdXJyZW50Q2xpZW50UmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB3aWR0aERlbHRhID0gcHJldmlvdXNJbmRpY2F0b3JDbGllbnRSZWN0LndpZHRoIC8gY3VycmVudENsaWVudFJlY3Qud2lkdGg7XG4gICAgICBjb25zdCB4UG9zaXRpb24gPSBwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3QubGVmdCAtIGN1cnJlbnRDbGllbnRSZWN0LmxlZnQ7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoTk9fVFJBTlNJVElPTl9DTEFTUyk7XG4gICAgICB0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAgIGB0cmFuc2xhdGVYKCR7eFBvc2l0aW9ufXB4KSBzY2FsZVgoJHt3aWR0aERlbHRhfSlgLFxuICAgICAgKTtcblxuICAgICAgLy8gRm9yY2UgcmVwYWludCBiZWZvcmUgdXBkYXRpbmcgY2xhc3NlcyBhbmQgdHJhbnNmb3JtIHRvIGVuc3VyZSB0aGUgdHJhbnNmb3JtIHByb3Blcmx5IHRha2VzIGVmZmVjdFxuICAgICAgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKE5PX1RSQU5TSVRJT05fQ0xBU1MpO1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKEFDVElWRV9DTEFTUyk7XG4gICAgICB0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgndHJhbnNmb3JtJywgJycpO1xuICAgIH1cblxuICAgIC8qKiBSZW1vdmVzIHRoZSBpbmsgYmFyIGZyb20gdGhlIGN1cnJlbnQgaXRlbS4gKi9cbiAgICBkZWFjdGl2YXRlSW5rQmFyKCkge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkVfQ0xBU1MpO1xuICAgIH1cblxuICAgIC8qKiBJbml0aWFsaXplcyB0aGUgZm91bmRhdGlvbi4gKi9cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZUlua0JhckVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKiogRGVzdHJveXMgdGhlIGZvdW5kYXRpb24uICovXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICB0aGlzLl9pbmtCYXJFbGVtZW50Py5yZW1vdmUoKTtcbiAgICAgIHRoaXMuX2lua0JhckVsZW1lbnQgPSB0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudCA9IG51bGwhO1xuICAgIH1cblxuICAgIC8qKiBDcmVhdGVzIGFuZCBhcHBlbmRzIHRoZSBpbmsgYmFyIGVsZW1lbnQuICovXG4gICAgcHJpdmF0ZSBfY3JlYXRlSW5rQmFyRWxlbWVudCgpIHtcbiAgICAgIGNvbnN0IGRvY3VtZW50Tm9kZSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICB0aGlzLl9pbmtCYXJFbGVtZW50ID0gZG9jdW1lbnROb2RlLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHRoaXMuX2lua0JhckNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnROb2RlLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICAgICAgdGhpcy5faW5rQmFyRWxlbWVudC5jbGFzc05hbWUgPSAnbWRjLXRhYi1pbmRpY2F0b3InO1xuICAgICAgdGhpcy5faW5rQmFyQ29udGVudEVsZW1lbnQuY2xhc3NOYW1lID1cbiAgICAgICAgJ21kYy10YWItaW5kaWNhdG9yX19jb250ZW50IG1kYy10YWItaW5kaWNhdG9yX19jb250ZW50LS11bmRlcmxpbmUnO1xuXG4gICAgICB0aGlzLl9pbmtCYXJFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2lua0JhckNvbnRlbnRFbGVtZW50KTtcbiAgICAgIHRoaXMuX2FwcGVuZElua0JhckVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBpbmsgYmFyIHRvIHRoZSB0YWIgaG9zdCBlbGVtZW50IG9yIGNvbnRlbnQsIGRlcGVuZGluZyBvbiB3aGV0aGVyXG4gICAgICogdGhlIGluayBiYXIgc2hvdWxkIGZpdCB0byBjb250ZW50LlxuICAgICAqL1xuICAgIHByaXZhdGUgX2FwcGVuZElua0JhckVsZW1lbnQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2lua0JhckVsZW1lbnQgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0luayBiYXIgZWxlbWVudCBoYXMgbm90IGJlZW4gY3JlYXRlZCBhbmQgY2Fubm90IGJlIGFwcGVuZGVkJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aGlzLl9maXRUb0NvbnRlbnRcbiAgICAgICAgPyB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWRjLXRhYl9fY29udGVudCcpXG4gICAgICAgIDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIGlmICghcGFyZW50RWxlbWVudCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBFcnJvcignTWlzc2luZyBlbGVtZW50IHRvIGhvc3QgdGhlIGluayBiYXInKTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50RWxlbWVudCEuYXBwZW5kQ2hpbGQodGhpcy5faW5rQmFyRWxlbWVudCEpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGEgTWF0SW5rQmFyIHBvc2l0aW9uZXIgbWV0aG9kLCBkZWZpbmluZyB0aGUgcG9zaXRpb25pbmcgYW5kIHdpZHRoIG9mIHRoZSBpbmtcbiAqIGJhciBpbiBhIHNldCBvZiB0YWJzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgKGVsZW1lbnQ6IEhUTUxFbGVtZW50KToge2xlZnQ6IHN0cmluZzsgd2lkdGg6IHN0cmluZ307XG59XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgcG9zaXRpb25lciBmdW5jdGlvbiBmb3IgdGhlIE1hdElua0Jhci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSX0ZBQ1RPUlkoKTogX01hdElua0JhclBvc2l0aW9uZXIge1xuICBjb25zdCBtZXRob2QgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+ICh7XG4gICAgbGVmdDogZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldExlZnQgfHwgMCkgKyAncHgnIDogJzAnLFxuICAgIHdpZHRoOiBlbGVtZW50ID8gKGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMCkgKyAncHgnIDogJzAnLFxuICB9KTtcblxuICByZXR1cm4gbWV0aG9kO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIGZvciB0aGUgTWF0SW5rQmFyJ3MgUG9zaXRpb25lci4gKi9cbmV4cG9ydCBjb25zdCBfTUFUX0lOS19CQVJfUE9TSVRJT05FUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxfTWF0SW5rQmFyUG9zaXRpb25lcj4oXG4gICdNYXRJbmtCYXJQb3NpdGlvbmVyJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZLFxuICB9LFxuKTtcbiJdfQ==
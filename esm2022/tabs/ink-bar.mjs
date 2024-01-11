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
            const domRect = currentItem?.elementRef.nativeElement.getBoundingClientRect?.();
            // The ink bar won't animate unless we give it the `DOMRect` of the previous item.
            correspondingItem.activateInkBar(domRect);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFhLGNBQWMsRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFhdkYsNERBQTREO0FBQzVELE1BQU0sWUFBWSxHQUFHLDJCQUEyQixDQUFDO0FBRWpELDBFQUEwRTtBQUMxRSxNQUFNLG1CQUFtQixHQUFHLGtDQUFrQyxDQUFDO0FBRS9EOzs7R0FHRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBSXBCLFlBQW9CLE1BQWdDO1FBQWhDLFdBQU0sR0FBTixNQUFNLENBQTBCO0lBQUcsQ0FBQztJQUV4RCx5QkFBeUI7SUFDekIsSUFBSTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLGNBQWMsQ0FBQyxPQUFvQjtRQUNqQyxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEtBQUssT0FBTyxDQUFDLENBQUM7UUFDOUYsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUV0QyxJQUFJLGlCQUFpQixLQUFLLFdBQVcsRUFBRSxDQUFDO1lBQ3RDLE9BQU87UUFDVCxDQUFDO1FBRUQsV0FBVyxFQUFFLGdCQUFnQixFQUFFLENBQUM7UUFFaEMsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sT0FBTyxHQUFHLFdBQVcsRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFD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QUFXLENBQUMsSUFBSSxDQUFDLGNBQWUsQ0FBQyxDQUFDO1FBQ25ELENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQVVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSwrQkFBK0I7SUFDN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7UUFDdEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztLQUN6RCxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsc0RBQXNEO0FBQ3RELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLElBQUksY0FBYyxDQUN2RCxxQkFBcUIsRUFDckI7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsK0JBQStCO0NBQ3pDLENBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFbGVtZW50UmVmLCBJbmplY3Rpb25Ub2tlbiwgT25EZXN0cm95LCBPbkluaXQsIFF1ZXJ5TGlzdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogSXRlbSBpbnNpZGUgYSB0YWIgaGVhZGVyIHJlbGF0aXZlIHRvIHdoaWNoIHRoZSBpbmsgYmFyIGNhbiBiZSBhbGlnbmVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdElua0Jhckl0ZW0gZXh0ZW5kcyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhY3RpdmF0ZUlua0JhcihwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3Q/OiBET01SZWN0KTogdm9pZDtcbiAgZGVhY3RpdmF0ZUlua0JhcigpOiB2b2lkO1xuICBmaXRJbmtCYXJUb0NvbnRlbnQ6IGJvb2xlYW47XG59XG5cbi8qKiBDbGFzcyB0aGF0IGlzIGFwcGxpZWQgd2hlbiBhIHRhYiBpbmRpY2F0b3IgaXMgYWN0aXZlLiAqL1xuY29uc3QgQUNUSVZFX0NMQVNTID0gJ21kYy10YWItaW5kaWNhdG9yLS1hY3RpdmUnO1xuXG4vKiogQ2xhc3MgdGhhdCBpcyBhcHBsaWVkIHdoZW4gdGhlIHRhYiBpbmRpY2F0b3Igc2hvdWxkIG5vdCB0cmFuc2l0aW9uLiAqL1xuY29uc3QgTk9fVFJBTlNJVElPTl9DTEFTUyA9ICdtZGMtdGFiLWluZGljYXRvci0tbm8tdHJhbnNpdGlvbic7XG5cbi8qKlxuICogQWJzdHJhY3Rpb24gYXJvdW5kIHRoZSBNREMgdGFiIGluZGljYXRvciB0aGF0IGFjdHMgYXMgdGhlIHRhYiBoZWFkZXIncyBpbmsgYmFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTWF0SW5rQmFyIHtcbiAgLyoqIEl0ZW0gdG8gd2hpY2ggdGhlIGluayBiYXIgaXMgYWxpZ25lZCBjdXJyZW50bHkuICovXG4gIHByaXZhdGUgX2N1cnJlbnRJdGVtOiBNYXRJbmtCYXJJdGVtIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0SW5rQmFySXRlbT4pIHt9XG5cbiAgLyoqIEhpZGVzIHRoZSBpbmsgYmFyLiAqL1xuICBoaWRlKCkge1xuICAgIHRoaXMuX2l0ZW1zLmZvckVhY2goaXRlbSA9PiBpdGVtLmRlYWN0aXZhdGVJbmtCYXIoKSk7XG4gIH1cblxuICAvKiogQWxpZ25zIHRoZSBpbmsgYmFyIHRvIGEgRE9NIG5vZGUuICovXG4gIGFsaWduVG9FbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ0l0ZW0gPSB0aGlzLl9pdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQpO1xuICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gdGhpcy5fY3VycmVudEl0ZW07XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ0l0ZW0gPT09IGN1cnJlbnRJdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3VycmVudEl0ZW0/LmRlYWN0aXZhdGVJbmtCYXIoKTtcblxuICAgIGlmIChjb3JyZXNwb25kaW5nSXRlbSkge1xuICAgICAgY29uc3QgZG9tUmVjdCA9IGN1cnJlbnRJdGVtPy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0Py4oKTtcblxuICAgICAgLy8gVGhlIGluayBiYXIgd29uJ3QgYW5pbWF0ZSB1bmxlc3Mgd2UgZ2l2ZSBpdCB0aGUgYERPTVJlY3RgIG9mIHRoZSBwcmV2aW91cyBpdGVtLlxuICAgICAgY29ycmVzcG9uZGluZ0l0ZW0uYWN0aXZhdGVJbmtCYXIoZG9tUmVjdCk7XG4gICAgICB0aGlzLl9jdXJyZW50SXRlbSA9IGNvcnJlc3BvbmRpbmdJdGVtO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1peGluIHRoYXQgY2FuIGJlIHVzZWQgdG8gYXBwbHkgdGhlIGBNYXRJbmtCYXJJdGVtYCBiZWhhdmlvciB0byBhIGNsYXNzLlxuICogQmFzZSBvbiBNREMncyBgTURDU2xpZGluZ1RhYkluZGljYXRvckZvdW5kYXRpb25gOlxuICogaHR0cHM6Ly9naXRodWIuY29tL21hdGVyaWFsLWNvbXBvbmVudHMvbWF0ZXJpYWwtY29tcG9uZW50cy13ZWIvYmxvYi9jMGExMWVmMGQwMDBhMDk4ZmQwYzM3MmJlOGYxMmQ2YTk5MzAyODU1L3BhY2thZ2VzL21kYy10YWItaW5kaWNhdG9yL3NsaWRpbmctZm91bmRhdGlvbi50c1xuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5JbmtCYXJJdGVtPFxuICBUIGV4dGVuZHMgbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4ge2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+fSxcbj4oYmFzZTogVCk6IFQgJiAobmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gTWF0SW5rQmFySXRlbSkge1xuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBiYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaW5rQmFyRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIHByaXZhdGUgX2lua0JhckNvbnRlbnRFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgcHJpdmF0ZSBfZml0VG9Db250ZW50ID0gZmFsc2U7XG5cbiAgICAvKiogV2hldGhlciB0aGUgaW5rIGJhciBzaG91bGQgZml0IHRvIHRoZSBlbnRpcmUgdGFiIG9yIGp1c3QgaXRzIGNvbnRlbnQuICovXG4gICAgZ2V0IGZpdElua0JhclRvQ29udGVudCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLl9maXRUb0NvbnRlbnQ7XG4gICAgfVxuICAgIHNldCBmaXRJbmtCYXJUb0NvbnRlbnQodjogQm9vbGVhbklucHV0KSB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTtcblxuICAgICAgaWYgKHRoaXMuX2ZpdFRvQ29udGVudCAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZml0VG9Db250ZW50ID0gbmV3VmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lua0JhckVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLl9hcHBlbmRJbmtCYXJFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQWxpZ25zIHRoZSBpbmsgYmFyIHRvIHRoZSBjdXJyZW50IGl0ZW0uICovXG4gICAgYWN0aXZhdGVJbmtCYXIocHJldmlvdXNJbmRpY2F0b3JDbGllbnRSZWN0PzogRE9NUmVjdCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAvLyBFYXJseSBleGl0IGlmIG5vIGluZGljYXRvciBpcyBwcmVzZW50IHRvIGhhbmRsZSBjYXNlcyB3aGVyZSBhbiBpbmRpY2F0b3JcbiAgICAgIC8vIG1heSBiZSBhY3RpdmF0ZWQgd2l0aG91dCBhIHByaW9yIGluZGljYXRvciBzdGF0ZVxuICAgICAgaWYgKFxuICAgICAgICAhcHJldmlvdXNJbmRpY2F0b3JDbGllbnRSZWN0IHx8XG4gICAgICAgICFlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCB8fFxuICAgICAgICAhdGhpcy5faW5rQmFyQ29udGVudEVsZW1lbnRcbiAgICAgICkge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGFuaW1hdGlvbiB1c2VzIHRoZSBGTElQIGFwcHJvYWNoLiBZb3UgY2FuIHJlYWQgbW9yZSBhYm91dCBpdCBhdCB0aGUgbGluayBiZWxvdzpcbiAgICAgIC8vIGh0dHBzOi8vYWVyb3R3aXN0LmNvbS9ibG9nL2ZsaXAteW91ci1hbmltYXRpb25zL1xuXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGRpbWVuc2lvbnMgYmFzZWQgb24gdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHByZXZpb3VzIGluZGljYXRvclxuICAgICAgY29uc3QgY3VycmVudENsaWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3Qgd2lkdGhEZWx0YSA9IHByZXZpb3VzSW5kaWNhdG9yQ2xpZW50UmVjdC53aWR0aCAvIGN1cnJlbnRDbGllbnRSZWN0LndpZHRoO1xuICAgICAgY29uc3QgeFBvc2l0aW9uID0gcHJldmlvdXNJbmRpY2F0b3JDbGllbnRSZWN0LmxlZnQgLSBjdXJyZW50Q2xpZW50UmVjdC5sZWZ0O1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKE5PX1RSQU5TSVRJT05fQ0xBU1MpO1xuICAgICAgdGhpcy5faW5rQmFyQ29udGVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgICBgdHJhbnNsYXRlWCgke3hQb3NpdGlvbn1weCkgc2NhbGVYKCR7d2lkdGhEZWx0YX0pYCxcbiAgICAgICk7XG5cbiAgICAgIC8vIEZvcmNlIHJlcGFpbnQgYmVmb3JlIHVwZGF0aW5nIGNsYXNzZXMgYW5kIHRyYW5zZm9ybSB0byBlbnN1cmUgdGhlIHRyYW5zZm9ybSBwcm9wZXJseSB0YWtlcyBlZmZlY3RcbiAgICAgIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShOT19UUkFOU0lUSU9OX0NMQVNTKTtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChBQ1RJVkVfQ0xBU1MpO1xuICAgICAgdGhpcy5faW5rQmFyQ29udGVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zZm9ybScsICcnKTtcbiAgICB9XG5cbiAgICAvKiogUmVtb3ZlcyB0aGUgaW5rIGJhciBmcm9tIHRoZSBjdXJyZW50IGl0ZW0uICovXG4gICAgZGVhY3RpdmF0ZUlua0JhcigpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQUNUSVZFX0NMQVNTKTtcbiAgICB9XG5cbiAgICAvKiogSW5pdGlhbGl6ZXMgdGhlIGZvdW5kYXRpb24uICovXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICB0aGlzLl9jcmVhdGVJbmtCYXJFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgLyoqIERlc3Ryb3lzIHRoZSBmb3VuZGF0aW9uLiAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgdGhpcy5faW5rQmFyRWxlbWVudD8ucmVtb3ZlKCk7XG4gICAgICB0aGlzLl9pbmtCYXJFbGVtZW50ID0gdGhpcy5faW5rQmFyQ29udGVudEVsZW1lbnQgPSBudWxsITtcbiAgICB9XG5cbiAgICAvKiogQ3JlYXRlcyBhbmQgYXBwZW5kcyB0aGUgaW5rIGJhciBlbGVtZW50LiAqL1xuICAgIHByaXZhdGUgX2NyZWF0ZUlua0JhckVsZW1lbnQoKSB7XG4gICAgICBjb25zdCBkb2N1bWVudE5vZGUgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgdGhpcy5faW5rQmFyRWxlbWVudCA9IGRvY3VtZW50Tm9kZS5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICB0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudCA9IGRvY3VtZW50Tm9kZS5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICAgIHRoaXMuX2lua0JhckVsZW1lbnQuY2xhc3NOYW1lID0gJ21kYy10YWItaW5kaWNhdG9yJztcbiAgICAgIHRoaXMuX2lua0JhckNvbnRlbnRFbGVtZW50LmNsYXNzTmFtZSA9XG4gICAgICAgICdtZGMtdGFiLWluZGljYXRvcl9fY29udGVudCBtZGMtdGFiLWluZGljYXRvcl9fY29udGVudC0tdW5kZXJsaW5lJztcblxuICAgICAgdGhpcy5faW5rQmFyRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudCk7XG4gICAgICB0aGlzLl9hcHBlbmRJbmtCYXJFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kcyB0aGUgaW5rIGJhciB0byB0aGUgdGFiIGhvc3QgZWxlbWVudCBvciBjb250ZW50LCBkZXBlbmRpbmcgb24gd2hldGhlclxuICAgICAqIHRoZSBpbmsgYmFyIHNob3VsZCBmaXQgdG8gY29udGVudC5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9hcHBlbmRJbmtCYXJFbGVtZW50KCkge1xuICAgICAgaWYgKCF0aGlzLl9pbmtCYXJFbGVtZW50ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdJbmsgYmFyIGVsZW1lbnQgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgYW5kIGNhbm5vdCBiZSBhcHBlbmRlZCcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5fZml0VG9Db250ZW50XG4gICAgICAgID8gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1kYy10YWJfX2NvbnRlbnQnKVxuICAgICAgICA6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICBpZiAoIXBhcmVudEVsZW1lbnQgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ01pc3NpbmcgZWxlbWVudCB0byBob3N0IHRoZSBpbmsgYmFyJyk7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsZW1lbnQhLmFwcGVuZENoaWxkKHRoaXMuX2lua0JhckVsZW1lbnQhKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBhIE1hdElua0JhciBwb3NpdGlvbmVyIG1ldGhvZCwgZGVmaW5pbmcgdGhlIHBvc2l0aW9uaW5nIGFuZCB3aWR0aCBvZiB0aGUgaW5rXG4gKiBiYXIgaW4gYSBzZXQgb2YgdGFicy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBfTWF0SW5rQmFyUG9zaXRpb25lciB7XG4gIChlbGVtZW50OiBIVE1MRWxlbWVudCk6IHtsZWZ0OiBzdHJpbmc7IHdpZHRoOiBzdHJpbmd9O1xufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHBvc2l0aW9uZXIgZnVuY3Rpb24gZm9yIHRoZSBNYXRJbmtCYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZKCk6IF9NYXRJbmtCYXJQb3NpdGlvbmVyIHtcbiAgY29uc3QgbWV0aG9kID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiAoe1xuICAgIGxlZnQ6IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgICB3aWR0aDogZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDApICsgJ3B4JyA6ICcwJyxcbiAgfSk7XG5cbiAgcmV0dXJuIG1ldGhvZDtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiBmb3IgdGhlIE1hdElua0JhcidzIFBvc2l0aW9uZXIuICovXG5leHBvcnQgY29uc3QgX01BVF9JTktfQkFSX1BPU0lUSU9ORVIgPSBuZXcgSW5qZWN0aW9uVG9rZW48X01hdElua0JhclBvc2l0aW9uZXI+KFxuICAnTWF0SW5rQmFyUG9zaXRpb25lcicsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogX01BVF9JTktfQkFSX1BPU0lUSU9ORVJfRkFDVE9SWSxcbiAgfSxcbik7XG4iXX0=
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, NgZone, Optional, EventEmitter, Directive, Inject, Input, } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { merge, of as observableOf, Subject, timer, fromEvent } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/platform";
/** Config used to bind passive event listeners */
const passiveEventListenerOptions = normalizePassiveListenerOptions({
    passive: true,
});
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
const EXAGGERATED_OVERSCROLL = 60;
/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 */
const HEADER_SCROLL_DELAY = 650;
/**
 * Interval in milliseconds at which to scroll the header
 * while the user is holding their pointer.
 */
const HEADER_SCROLL_INTERVAL = 100;
/**
 * Base class for a tab header that supported pagination.
 * @docs-private
 */
export class MatPaginatedTabHeader {
    constructor(_elementRef, _changeDetectorRef, _viewportRuler, _dir, _ngZone, _platform, _animationMode) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._viewportRuler = _viewportRuler;
        this._dir = _dir;
        this._ngZone = _ngZone;
        this._platform = _platform;
        this._animationMode = _animationMode;
        /** The distance in pixels that the tab labels should be translated to the left. */
        this._scrollDistance = 0;
        /** Whether the header should scroll to the selected index after the view has been checked. */
        this._selectedIndexChanged = false;
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /** Whether the controls for pagination should be displayed */
        this._showPaginationControls = false;
        /** Whether the tab list can be scrolled more towards the end of the tab label list. */
        this._disableScrollAfter = true;
        /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
        this._disableScrollBefore = true;
        /** Stream that will stop the automated scrolling. */
        this._stopScrolling = new Subject();
        this._disablePagination = false;
        this._selectedIndex = 0;
        /** Event emitted when the option is selected. */
        this.selectFocusedIndex = new EventEmitter();
        /** Event emitted when a label is focused. */
        this.indexFocused = new EventEmitter();
        // Bind the `mouseleave` event on the outside since it doesn't change anything in the view.
        _ngZone.runOutsideAngular(() => {
            fromEvent(_elementRef.nativeElement, 'mouseleave')
                .pipe(takeUntil(this._destroyed))
                .subscribe(() => {
                this._stopInterval();
            });
        });
    }
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     */
    get disablePagination() {
        return this._disablePagination;
    }
    set disablePagination(value) {
        this._disablePagination = coerceBooleanProperty(value);
    }
    /** The index of the active tab. */
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        value = coerceNumberProperty(value);
        if (this._selectedIndex != value) {
            this._selectedIndexChanged = true;
            this._selectedIndex = value;
            if (this._keyManager) {
                this._keyManager.updateActiveItem(value);
            }
        }
    }
    ngAfterViewInit() {
        // We need to handle these events manually, because we want to bind passive event listeners.
        fromEvent(this._previousPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            this._handlePaginatorPress('before');
        });
        fromEvent(this._nextPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            this._handlePaginatorPress('after');
        });
    }
    ngAfterContentInit() {
        const dirChange = this._dir ? this._dir.change : observableOf('ltr');
        const resize = this._viewportRuler.change(150);
        const realign = () => {
            this.updatePagination();
            this._alignInkBarToSelectedTab();
        };
        this._keyManager = new FocusKeyManager(this._items)
            .withHorizontalOrientation(this._getLayoutDirection())
            .withHomeAndEnd()
            .withWrap();
        this._keyManager.updateActiveItem(this._selectedIndex);
        // Defer the first call in order to allow for slower browsers to lay out the elements.
        // This helps in cases where the user lands directly on a page with paginated tabs.
        // Note that we use `onStable` instead of `requestAnimationFrame`, because the latter
        // can hold up tests that are in a background tab.
        this._ngZone.onStable.pipe(take(1)).subscribe(realign);
        // On dir change or window resize, realign the ink bar and update the orientation of
        // the key manager if the direction has changed.
        merge(dirChange, resize, this._items.changes)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            // We need to defer this to give the browser some time to recalculate
            // the element dimensions. The call has to be wrapped in `NgZone.run`,
            // because the viewport change handler runs outside of Angular.
            this._ngZone.run(() => {
                Promise.resolve().then(() => {
                    // Clamp the scroll distance, because it can change with the number of tabs.
                    this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), this._scrollDistance));
                    realign();
                });
            });
            this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
        });
        // If there is a change in the focus key manager we need to emit the `indexFocused`
        // event in order to provide a public event that notifies about focus changes. Also we realign
        // the tabs container by scrolling the new focused tab into the visible section.
        this._keyManager.change.pipe(takeUntil(this._destroyed)).subscribe(newFocusIndex => {
            this.indexFocused.emit(newFocusIndex);
            this._setTabFocus(newFocusIndex);
        });
    }
    ngAfterContentChecked() {
        // If the number of tab labels have changed, check if scrolling should be enabled
        if (this._tabLabelCount != this._items.length) {
            this.updatePagination();
            this._tabLabelCount = this._items.length;
            this._changeDetectorRef.markForCheck();
        }
        // If the selected index has changed, scroll to the label and check if the scrolling controls
        // should be disabled.
        if (this._selectedIndexChanged) {
            this._scrollToLabel(this._selectedIndex);
            this._checkScrollingControls();
            this._alignInkBarToSelectedTab();
            this._selectedIndexChanged = false;
            this._changeDetectorRef.markForCheck();
        }
        // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
        // then translate the header to reflect this.
        if (this._scrollDistanceChanged) {
            this._updateTabScrollPosition();
            this._scrollDistanceChanged = false;
            this._changeDetectorRef.markForCheck();
        }
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this._stopScrolling.complete();
    }
    /** Handles keyboard events on the header. */
    _handleKeydown(event) {
        // We don't handle any key bindings with a modifier key.
        if (hasModifierKey(event)) {
            return;
        }
        switch (event.keyCode) {
            case ENTER:
            case SPACE:
                if (this.focusIndex !== this.selectedIndex) {
                    this.selectFocusedIndex.emit(this.focusIndex);
                    this._itemSelected(event);
                }
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    }
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     */
    _onContentChanges() {
        const textContent = this._elementRef.nativeElement.textContent;
        // We need to diff the text content of the header, because the MutationObserver callback
        // will fire even if the text content didn't change which is inefficient and is prone
        // to infinite loops if a poorly constructed expression is passed in (see #14249).
        if (textContent !== this._currentTextContent) {
            this._currentTextContent = textContent || '';
            // The content observer runs outside the `NgZone` by default, which
            // means that we need to bring the callback back in ourselves.
            this._ngZone.run(() => {
                this.updatePagination();
                this._alignInkBarToSelectedTab();
                this._changeDetectorRef.markForCheck();
            });
        }
    }
    /**
     * Updates the view whether pagination should be enabled or not.
     *
     * WARNING: Calling this method can be very costly in terms of performance. It should be called
     * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
     * page.
     */
    updatePagination() {
        this._checkPaginationEnabled();
        this._checkScrollingControls();
        this._updateTabScrollPosition();
    }
    /** Tracks which element has focus; used for keyboard navigation */
    get focusIndex() {
        return this._keyManager ? this._keyManager.activeItemIndex : 0;
    }
    /** When the focus index is set, we must manually send focus to the correct label */
    set focusIndex(value) {
        if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
            return;
        }
        this._keyManager.setActiveItem(value);
    }
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     */
    _isValidIndex(index) {
        if (!this._items) {
            return true;
        }
        const tab = this._items ? this._items.toArray()[index] : null;
        return !!tab && !tab.disabled;
    }
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     */
    _setTabFocus(tabIndex) {
        if (this._showPaginationControls) {
            this._scrollToLabel(tabIndex);
        }
        if (this._items && this._items.length) {
            this._items.toArray()[tabIndex].focus();
            // Do not let the browser manage scrolling to focus the element, this will be handled
            // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
            // should be the full width minus the offset width.
            const containerEl = this._tabListContainer.nativeElement;
            const dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    }
    /** The layout direction of the containing app. */
    _getLayoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
    _updateTabScrollPosition() {
        if (this.disablePagination) {
            return;
        }
        const scrollDistance = this.scrollDistance;
        const translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
        // Don't use `translate3d` here because we don't want to create a new layer. A new layer
        // seems to cause flickering and overflow in Internet Explorer. For example, the ink bar
        // and ripples will exceed the boundaries of the visible tab bar.
        // See: https://github.com/angular/components/issues/10276
        // We round the `transform` here, because transforms with sub-pixel precision cause some
        // browsers to blur the content of the element.
        this._tabList.nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;
        // Setting the `transform` on IE will change the scroll offset of the parent, causing the
        // position to be thrown off in some cases. We have to reset it ourselves to ensure that
        // it doesn't get thrown off. Note that we scope it only to IE and Edge, because messing
        // with the scroll position throws off Chrome 71+ in RTL mode (see #14689).
        if (this._platform.TRIDENT || this._platform.EDGE) {
            this._tabListContainer.nativeElement.scrollLeft = 0;
        }
    }
    /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
    get scrollDistance() {
        return this._scrollDistance;
    }
    set scrollDistance(value) {
        this._scrollTo(value);
    }
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollHeader(direction) {
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        const scrollAmount = ((direction == 'before' ? -1 : 1) * viewLength) / 3;
        return this._scrollTo(this._scrollDistance + scrollAmount);
    }
    /** Handles click events on the pagination arrows. */
    _handlePaginatorClick(direction) {
        this._stopInterval();
        this._scrollHeader(direction);
    }
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollToLabel(labelIndex) {
        if (this.disablePagination) {
            return;
        }
        const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;
        let labelBeforePos, labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = offsetLeft;
            labelAfterPos = labelBeforePos + offsetWidth;
        }
        else {
            labelAfterPos = this._tabListInner.nativeElement.offsetWidth - offsetLeft;
            labelBeforePos = labelAfterPos - offsetWidth;
        }
        const beforeVisiblePos = this.scrollDistance;
        const afterVisiblePos = this.scrollDistance + viewLength;
        if (labelBeforePos < beforeVisiblePos) {
            // Scroll header to move label to the before direction
            this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
        }
        else if (labelAfterPos > afterVisiblePos) {
            // Scroll header to move label to the after direction
            this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
        }
    }
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkPaginationEnabled() {
        if (this.disablePagination) {
            this._showPaginationControls = false;
        }
        else {
            const isEnabled = this._tabListInner.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
            if (!isEnabled) {
                this.scrollDistance = 0;
            }
            if (isEnabled !== this._showPaginationControls) {
                this._changeDetectorRef.markForCheck();
            }
            this._showPaginationControls = isEnabled;
        }
    }
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkScrollingControls() {
        if (this.disablePagination) {
            this._disableScrollAfter = this._disableScrollBefore = true;
        }
        else {
            // Check if the pagination arrows should be activated.
            this._disableScrollBefore = this.scrollDistance == 0;
            this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _getMaxScrollDistance() {
        const lengthOfTabList = this._tabListInner.nativeElement.scrollWidth;
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return lengthOfTabList - viewLength || 0;
    }
    /** Tells the ink-bar to align itself to the current label wrapper */
    _alignInkBarToSelectedTab() {
        const selectedItem = this._items && this._items.length ? this._items.toArray()[this.selectedIndex] : null;
        const selectedLabelWrapper = selectedItem ? selectedItem.elementRef.nativeElement : null;
        if (selectedLabelWrapper) {
            this._inkBar.alignToElement(selectedLabelWrapper);
        }
        else {
            this._inkBar.hide();
        }
    }
    /** Stops the currently-running paginator interval.  */
    _stopInterval() {
        this._stopScrolling.next();
    }
    /**
     * Handles the user pressing down on one of the paginators.
     * Starts scrolling the header after a certain amount of time.
     * @param direction In which direction the paginator should be scrolled.
     */
    _handlePaginatorPress(direction, mouseEvent) {
        // Don't start auto scrolling for right mouse button clicks. Note that we shouldn't have to
        // null check the `button`, but we do it so we don't break tests that use fake events.
        if (mouseEvent && mouseEvent.button != null && mouseEvent.button !== 0) {
            return;
        }
        // Avoid overlapping timers.
        this._stopInterval();
        // Start a timer after the delay and keep firing based on the interval.
        timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
            // Keep the timer going until something tells it to stop or the component is destroyed.
            .pipe(takeUntil(merge(this._stopScrolling, this._destroyed)))
            .subscribe(() => {
            const { maxScrollDistance, distance } = this._scrollHeader(direction);
            // Stop the timer if we've reached the start or the end.
            if (distance === 0 || distance >= maxScrollDistance) {
                this._stopInterval();
            }
        });
    }
    /**
     * Scrolls the header to a given position.
     * @param position Position to which to scroll.
     * @returns Information on the current scroll distance and the maximum.
     */
    _scrollTo(position) {
        if (this.disablePagination) {
            return { maxScrollDistance: 0, distance: 0 };
        }
        const maxScrollDistance = this._getMaxScrollDistance();
        this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));
        // Mark that the scroll distance has changed so that after the view is checked, the CSS
        // transformation can move the header.
        this._scrollDistanceChanged = true;
        this._checkScrollingControls();
        return { maxScrollDistance, distance: this._scrollDistance };
    }
}
MatPaginatedTabHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-rc.0", ngImport: i0, type: MatPaginatedTabHeader, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: i2.Directionality, optional: true }, { token: i0.NgZone }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatPaginatedTabHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.0-rc.0", type: MatPaginatedTabHeader, inputs: { disablePagination: "disablePagination" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-rc.0", ngImport: i0, type: MatPaginatedTabHeader, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.ViewportRuler }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { disablePagination: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGVkLXRhYi1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy9wYWdpbmF0ZWQtdGFiLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFlBQVksRUFLWixTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssR0FDTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVksY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBa0IsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDMUUsT0FBTyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFFLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBRTNFLGtEQUFrRDtBQUNsRCxNQUFNLDJCQUEyQixHQUFHLCtCQUErQixDQUFDO0lBQ2xFLE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBeUIsQ0FBQztBQVMzQjs7O0dBR0c7QUFDSCxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUVsQzs7O0dBR0c7QUFDSCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsQ0FBQztBQUVoQzs7O0dBR0c7QUFDSCxNQUFNLHNCQUFzQixHQUFHLEdBQUcsQ0FBQztBQUtuQzs7O0dBR0c7QUFFSCxNQUFNLE9BQWdCLHFCQUFxQjtJQW9GekMsWUFDWSxXQUFvQyxFQUNwQyxrQkFBcUMsRUFDdkMsY0FBNkIsRUFDakIsSUFBb0IsRUFDaEMsT0FBZSxFQUNmLFNBQW1CLEVBQ3VCLGNBQXVCO1FBTi9ELGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3ZDLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ2hDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ3VCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBaEYzRSxtRkFBbUY7UUFDM0Usb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFFNUIsOEZBQThGO1FBQ3RGLDBCQUFxQixHQUFHLEtBQUssQ0FBQztRQUV0Qyw2Q0FBNkM7UUFDMUIsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFcEQsOERBQThEO1FBQzlELDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQUVoQyx1RkFBdUY7UUFDdkYsd0JBQW1CLEdBQUcsSUFBSSxDQUFDO1FBRTNCLDZGQUE2RjtRQUM3Rix5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFpQjVCLHFEQUFxRDtRQUM3QyxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFhckMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBa0JwQyxtQkFBYyxHQUFXLENBQUMsQ0FBQztRQUVuQyxpREFBaUQ7UUFDeEMsdUJBQWtCLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFFL0UsNkNBQTZDO1FBQ3BDLGlCQUFZLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFXdkUsMkZBQTJGO1FBQzNGLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsU0FBUyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDO2lCQUMvQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDaEMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUF0REQ7OztPQUdHO0lBQ0gsSUFDSSxpQkFBaUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDakMsQ0FBQztJQUNELElBQUksaUJBQWlCLENBQUMsS0FBbUI7UUFDdkMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFHRCxtQ0FBbUM7SUFDbkMsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLGFBQWEsQ0FBQyxLQUFrQjtRQUNsQyxLQUFLLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFcEMsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEtBQUssRUFBRTtZQUNoQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBRTVCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQztTQUNGO0lBQ0gsQ0FBQztJQStCRCxlQUFlO1FBQ2IsNEZBQTRGO1FBQzVGLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSwyQkFBMkIsQ0FBQzthQUN4RixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNoQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUwsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSwyQkFBMkIsQ0FBQzthQUNwRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNoQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNuQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUNuQyxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUE0QixJQUFJLENBQUMsTUFBTSxDQUFDO2FBQzNFLHlCQUF5QixDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQ3JELGNBQWMsRUFBRTthQUNoQixRQUFRLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXZELHNGQUFzRjtRQUN0RixtRkFBbUY7UUFDbkYscUZBQXFGO1FBQ3JGLGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZELG9GQUFvRjtRQUNwRixnREFBZ0Q7UUFDaEQsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7YUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNkLHFFQUFxRTtZQUNyRSxzRUFBc0U7WUFDdEUsK0RBQStEO1lBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQzFCLDRFQUE0RTtvQkFDNUUsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUM3QixDQUFDLEVBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQzdELENBQUM7b0JBQ0YsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztRQUN6RSxDQUFDLENBQUMsQ0FBQztRQUVMLG1GQUFtRjtRQUNuRiw4RkFBOEY7UUFDOUYsZ0ZBQWdGO1FBQ2hGLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2pGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQscUJBQXFCO1FBQ25CLGlGQUFpRjtRQUNqRixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDN0MsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDeEM7UUFFRCw2RkFBNkY7UUFDN0Ysc0JBQXNCO1FBQ3RCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7WUFDbkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hDO1FBRUQsOEZBQThGO1FBQzlGLDZDQUE2QztRQUM3QyxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELDZDQUE2QztJQUM3QyxjQUFjLENBQUMsS0FBb0I7UUFDakMsd0RBQXdEO1FBQ3hELElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE9BQU87U0FDUjtRQUVELFFBQVEsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNyQixLQUFLLEtBQUssQ0FBQztZQUNYLEtBQUssS0FBSztnQkFDUixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDMUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzNCO2dCQUNELE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQjtRQUNmLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUUvRCx3RkFBd0Y7UUFDeEYscUZBQXFGO1FBQ3JGLGtGQUFrRjtRQUNsRixJQUFJLFdBQVcsS0FBSyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFdBQVcsSUFBSSxFQUFFLENBQUM7WUFFN0MsbUVBQW1FO1lBQ25FLDhEQUE4RDtZQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxvRkFBb0Y7SUFDcEYsSUFBSSxVQUFVLENBQUMsS0FBYTtRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEYsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWEsQ0FBQyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUQsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxDQUFDLFFBQWdCO1FBQzNCLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0I7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUV4QyxxRkFBcUY7WUFDckYsc0ZBQXNGO1lBQ3RGLG1EQUFtRDtZQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDO1lBQ3pELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBRXZDLElBQUksR0FBRyxJQUFJLEtBQUssRUFBRTtnQkFDaEIsV0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7YUFDNUI7aUJBQU07Z0JBQ0wsV0FBVyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUM7YUFDNUU7U0FDRjtJQUNILENBQUM7SUFFRCxrREFBa0Q7SUFDbEQsbUJBQW1CO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2hFLENBQUM7SUFFRCwwRkFBMEY7SUFDMUYsd0JBQXdCO1FBQ3RCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUVELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDM0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBRTNGLHdGQUF3RjtRQUN4Rix3RkFBd0Y7UUFDeEYsaUVBQWlFO1FBQ2pFLDBEQUEwRDtRQUMxRCx3RkFBd0Y7UUFDeEYsK0NBQStDO1FBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsY0FBYyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFFeEYseUZBQXlGO1FBQ3pGLHdGQUF3RjtRQUN4Rix3RkFBd0Y7UUFDeEYsMkVBQTJFO1FBQzNFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDakQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1NBQ3JEO0lBQ0gsQ0FBQztJQUVELDJGQUEyRjtJQUMzRixJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFDRCxJQUFJLGNBQWMsQ0FBQyxLQUFhO1FBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxhQUFhLENBQUMsU0FBMEI7UUFDdEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7UUFFcEUsNEVBQTRFO1FBQzVFLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXpFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLFlBQVksQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxxREFBcUQ7SUFDckQscUJBQXFCLENBQUMsU0FBMEI7UUFDOUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsY0FBYyxDQUFDLFVBQWtCO1FBQy9CLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUVELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUU3RSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE9BQU87U0FDUjtRQUVELDBEQUEwRDtRQUMxRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUNwRSxNQUFNLEVBQUMsVUFBVSxFQUFFLFdBQVcsRUFBQyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBRXpFLElBQUksY0FBc0IsRUFBRSxhQUFxQixDQUFDO1FBQ2xELElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksS0FBSyxFQUFFO1lBQ3ZDLGNBQWMsR0FBRyxVQUFVLENBQUM7WUFDNUIsYUFBYSxHQUFHLGNBQWMsR0FBRyxXQUFXLENBQUM7U0FDOUM7YUFBTTtZQUNMLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1lBQzFFLGNBQWMsR0FBRyxhQUFhLEdBQUcsV0FBVyxDQUFDO1NBQzlDO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzdDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDO1FBRXpELElBQUksY0FBYyxHQUFHLGdCQUFnQixFQUFFO1lBQ3JDLHNEQUFzRDtZQUN0RCxJQUFJLENBQUMsY0FBYyxJQUFJLGdCQUFnQixHQUFHLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQztTQUNuRjthQUFNLElBQUksYUFBYSxHQUFHLGVBQWUsRUFBRTtZQUMxQyxxREFBcUQ7WUFDckQsSUFBSSxDQUFDLGNBQWMsSUFBSSxhQUFhLEdBQUcsZUFBZSxHQUFHLHNCQUFzQixDQUFDO1NBQ2pGO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCx1QkFBdUI7UUFDckIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQztTQUN0QzthQUFNO1lBQ0wsTUFBTSxTQUFTLEdBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztZQUU1RixJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1lBRUQsSUFBSSxTQUFTLEtBQUssSUFBSSxDQUFDLHVCQUF1QixFQUFFO2dCQUM5QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDeEM7WUFFRCxJQUFJLENBQUMsdUJBQXVCLEdBQUcsU0FBUyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsdUJBQXVCO1FBQ3JCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO1NBQzdEO2FBQU07WUFDTCxzREFBc0Q7WUFDdEQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQy9FLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxxQkFBcUI7UUFDbkIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBQ3JFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBQ3BFLE9BQU8sZUFBZSxHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELHFFQUFxRTtJQUNyRSx5QkFBeUI7UUFDdkIsTUFBTSxZQUFZLEdBQ2hCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkYsTUFBTSxvQkFBb0IsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFekYsSUFBSSxvQkFBb0IsRUFBRTtZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ25EO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxhQUFhO1FBQ1gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILHFCQUFxQixDQUFDLFNBQTBCLEVBQUUsVUFBdUI7UUFDdkUsMkZBQTJGO1FBQzNGLHNGQUFzRjtRQUN0RixJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN0RSxPQUFPO1NBQ1I7UUFFRCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLHVFQUF1RTtRQUN2RSxLQUFLLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUM7WUFDaEQsdUZBQXVGO2FBQ3RGLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDNUQsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNkLE1BQU0sRUFBQyxpQkFBaUIsRUFBRSxRQUFRLEVBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXBFLHdEQUF3RDtZQUN4RCxJQUFJLFFBQVEsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLGlCQUFpQixFQUFFO2dCQUNuRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDdEI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssU0FBUyxDQUFDLFFBQWdCO1FBQ2hDLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDO1NBQzVDO1FBRUQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUUxRSx1RkFBdUY7UUFDdkYsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFFL0IsT0FBTyxFQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFDLENBQUM7SUFDN0QsQ0FBQzs7dUhBL2hCbUIscUJBQXFCLHNNQTJGbkIscUJBQXFCOzJHQTNGdkIscUJBQXFCO2dHQUFyQixxQkFBcUI7a0JBRDFDLFNBQVM7OzBCQXlGTCxRQUFROzswQkFHUixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs0Q0F2Q3ZDLGlCQUFpQjtzQkFEcEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRWxlbWVudFJlZixcbiAgTmdab25lLFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uRGVzdHJveSxcbiAgRGlyZWN0aXZlLFxuICBJbmplY3QsXG4gIElucHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlciwgRm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VOVEVSLCBTUEFDRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge21lcmdlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QsIHRpbWVyLCBmcm9tRXZlbnR9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqIENvbmZpZyB1c2VkIHRvIGJpbmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMgKi9cbmNvbnN0IHBhc3NpdmVFdmVudExpc3RlbmVyT3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe1xuICBwYXNzaXZlOiB0cnVlLFxufSkgYXMgRXZlbnRMaXN0ZW5lck9wdGlvbnM7XG5cbi8qKlxuICogVGhlIGRpcmVjdGlvbnMgdGhhdCBzY3JvbGxpbmcgY2FuIGdvIGluIHdoZW4gdGhlIGhlYWRlcidzIHRhYnMgZXhjZWVkIHRoZSBoZWFkZXIgd2lkdGguICdBZnRlcidcbiAqIHdpbGwgc2Nyb2xsIHRoZSBoZWFkZXIgdG93YXJkcyB0aGUgZW5kIG9mIHRoZSB0YWJzIGxpc3QgYW5kICdiZWZvcmUnIHdpbGwgc2Nyb2xsIHRvd2FyZHMgdGhlXG4gKiBiZWdpbm5pbmcgb2YgdGhlIGxpc3QuXG4gKi9cbmV4cG9ydCB0eXBlIFNjcm9sbERpcmVjdGlvbiA9ICdhZnRlcicgfCAnYmVmb3JlJztcblxuLyoqXG4gKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgd2lsbCBiZSBvdmVyc2hvdCB3aGVuIHNjcm9sbGluZyBhIHRhYiBsYWJlbCBpbnRvIHZpZXcuIFRoaXMgaGVscHNcbiAqIHByb3ZpZGUgYSBzbWFsbCBhZmZvcmRhbmNlIHRvIHRoZSBsYWJlbCBuZXh0IHRvIGl0LlxuICovXG5jb25zdCBFWEFHR0VSQVRFRF9PVkVSU0NST0xMID0gNjA7XG5cbi8qKlxuICogQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBzdGFydGluZyB0byBzY3JvbGwgdGhlIGhlYWRlciBhdXRvbWF0aWNhbGx5LlxuICogU2V0IGEgbGl0dGxlIGNvbnNlcnZhdGl2ZWx5IGluIG9yZGVyIHRvIGhhbmRsZSBmYWtlIGV2ZW50cyBkaXNwYXRjaGVkIG9uIHRvdWNoIGRldmljZXMuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfREVMQVkgPSA2NTA7XG5cbi8qKlxuICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGF0IHdoaWNoIHRvIHNjcm9sbCB0aGUgaGVhZGVyXG4gKiB3aGlsZSB0aGUgdXNlciBpcyBob2xkaW5nIHRoZWlyIHBvaW50ZXIuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfSU5URVJWQUwgPSAxMDA7XG5cbi8qKiBJdGVtIGluc2lkZSBhIHBhZ2luYXRlZCB0YWIgaGVhZGVyLiAqL1xuZXhwb3J0IHR5cGUgTWF0UGFnaW5hdGVkVGFiSGVhZGVySXRlbSA9IEZvY3VzYWJsZU9wdGlvbiAmIHtlbGVtZW50UmVmOiBFbGVtZW50UmVmfTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhIHRhYiBoZWFkZXIgdGhhdCBzdXBwb3J0ZWQgcGFnaW5hdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0UGFnaW5hdGVkVGFiSGVhZGVyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95XG57XG4gIGFic3RyYWN0IF9pdGVtczogUXVlcnlMaXN0PE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuICBhYnN0cmFjdCBfaW5rQmFyOiB7aGlkZTogKCkgPT4gdm9pZDsgYWxpZ25Ub0VsZW1lbnQ6IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZH07XG4gIGFic3RyYWN0IF90YWJMaXN0Q29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX3RhYkxpc3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfdGFiTGlzdElubmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX25leHRQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgdGhlIHRhYiBsYWJlbHMgc2hvdWxkIGJlIHRyYW5zbGF0ZWQgdG8gdGhlIGxlZnQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlID0gMDtcblxuICAvKiogV2hldGhlciB0aGUgaGVhZGVyIHNob3VsZCBzY3JvbGwgdG8gdGhlIHNlbGVjdGVkIGluZGV4IGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gZmFsc2U7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbHMgZm9yIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc3BsYXllZCAqL1xuICBfc2hvd1BhZ2luYXRpb25Db250cm9scyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGlzdCBjYW4gYmUgc2Nyb2xsZWQgbW9yZSB0b3dhcmRzIHRoZSBlbmQgb2YgdGhlIHRhYiBsYWJlbCBsaXN0LiAqL1xuICBfZGlzYWJsZVNjcm9sbEFmdGVyID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGxpc3QgY2FuIGJlIHNjcm9sbGVkIG1vcmUgdG93YXJkcyB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWIgbGFiZWwgbGlzdC4gKi9cbiAgX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHRhYiBsYWJlbHMgdGhhdCBhcmUgZGlzcGxheWVkIG9uIHRoZSBoZWFkZXIuIFdoZW4gdGhpcyBjaGFuZ2VzLCB0aGUgaGVhZGVyXG4gICAqIHNob3VsZCByZS1ldmFsdWF0ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfdGFiTGFiZWxDb3VudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGNoYW5nZWQgYW5kIHNob3VsZCBiZSBhcHBsaWVkIGFmdGVyIHRoZSB2aWV3IGlzIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlQ2hhbmdlZDogYm9vbGVhbjtcblxuICAvKiogVXNlZCB0byBtYW5hZ2UgZm9jdXMgYmV0d2VlbiB0aGUgdGFicy4gKi9cbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuXG4gIC8qKiBDYWNoZWQgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIuICovXG4gIHByaXZhdGUgX2N1cnJlbnRUZXh0Q29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCB3aWxsIHN0b3AgdGhlIGF1dG9tYXRlZCBzY3JvbGxpbmcuICovXG4gIHByaXZhdGUgX3N0b3BTY3JvbGxpbmcgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc2FibGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF2b2lkIHVubmVjZXNzYXJ5XG4gICAqIGxheW91dCByZWNhbGN1bGF0aW9ucyBpZiBpdCdzIGtub3duIHRoYXQgcGFnaW5hdGlvbiB3b24ndCBiZSByZXF1aXJlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUGFnaW5hdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVBhZ2luYXRpb247XG4gIH1cbiAgc2V0IGRpc2FibGVQYWdpbmF0aW9uKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlUGFnaW5hdGlvbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVBhZ2luYXRpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGluZGV4IG9mIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBnZXQgc2VsZWN0ZWRJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICB9XG4gIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXggPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIHJlYWRvbmx5IHNlbGVjdEZvY3VzZWRJbmRleDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIGEgbGFiZWwgaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgaW5kZXhGb2N1c2VkOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICAvLyBCaW5kIHRoZSBgbW91c2VsZWF2ZWAgZXZlbnQgb24gdGhlIG91dHNpZGUgc2luY2UgaXQgZG9lc24ndCBjaGFuZ2UgYW55dGhpbmcgaW4gdGhlIHZpZXcuXG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmcm9tRXZlbnQoX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ21vdXNlbGVhdmUnKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc3RvcEludGVydmFsKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBzZWxlY3RlZCBhbiBpdGVtIHZpYSB0aGUga2V5Ym9hcmQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaXRlbVNlbGVjdGVkKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZDtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBoYW5kbGUgdGhlc2UgZXZlbnRzIG1hbnVhbGx5LCBiZWNhdXNlIHdlIHdhbnQgdG8gYmluZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy5cbiAgICBmcm9tRXZlbnQodGhpcy5fcHJldmlvdXNQYWdpbmF0b3IubmF0aXZlRWxlbWVudCwgJ3RvdWNoc3RhcnQnLCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYmVmb3JlJyk7XG4gICAgICB9KTtcblxuICAgIGZyb21FdmVudCh0aGlzLl9uZXh0UGFnaW5hdG9yLm5hdGl2ZUVsZW1lbnQsICd0b3VjaHN0YXJ0JywgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5faGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2FmdGVyJyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBjb25zdCBkaXJDaGFuZ2UgPSB0aGlzLl9kaXIgPyB0aGlzLl9kaXIuY2hhbmdlIDogb2JzZXJ2YWJsZU9mKCdsdHInKTtcbiAgICBjb25zdCByZXNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmNoYW5nZSgxNTApO1xuICAgIGNvbnN0IHJlYWxpZ24gPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgIHRoaXMuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgIH07XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtPih0aGlzLl9pdGVtcylcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2dldExheW91dERpcmVjdGlvbigpKVxuICAgICAgLndpdGhIb21lQW5kRW5kKClcbiAgICAgIC53aXRoV3JhcCgpO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKHRoaXMuX3NlbGVjdGVkSW5kZXgpO1xuXG4gICAgLy8gRGVmZXIgdGhlIGZpcnN0IGNhbGwgaW4gb3JkZXIgdG8gYWxsb3cgZm9yIHNsb3dlciBicm93c2VycyB0byBsYXkgb3V0IHRoZSBlbGVtZW50cy5cbiAgICAvLyBUaGlzIGhlbHBzIGluIGNhc2VzIHdoZXJlIHRoZSB1c2VyIGxhbmRzIGRpcmVjdGx5IG9uIGEgcGFnZSB3aXRoIHBhZ2luYXRlZCB0YWJzLlxuICAgIC8vIE5vdGUgdGhhdCB3ZSB1c2UgYG9uU3RhYmxlYCBpbnN0ZWFkIG9mIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLCBiZWNhdXNlIHRoZSBsYXR0ZXJcbiAgICAvLyBjYW4gaG9sZCB1cCB0ZXN0cyB0aGF0IGFyZSBpbiBhIGJhY2tncm91bmQgdGFiLlxuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShyZWFsaWduKTtcblxuICAgIC8vIE9uIGRpciBjaGFuZ2Ugb3Igd2luZG93IHJlc2l6ZSwgcmVhbGlnbiB0aGUgaW5rIGJhciBhbmQgdXBkYXRlIHRoZSBvcmllbnRhdGlvbiBvZlxuICAgIC8vIHRoZSBrZXkgbWFuYWdlciBpZiB0aGUgZGlyZWN0aW9uIGhhcyBjaGFuZ2VkLlxuICAgIG1lcmdlKGRpckNoYW5nZSwgcmVzaXplLCB0aGlzLl9pdGVtcy5jaGFuZ2VzKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWZlciB0aGlzIHRvIGdpdmUgdGhlIGJyb3dzZXIgc29tZSB0aW1lIHRvIHJlY2FsY3VsYXRlXG4gICAgICAgIC8vIHRoZSBlbGVtZW50IGRpbWVuc2lvbnMuIFRoZSBjYWxsIGhhcyB0byBiZSB3cmFwcGVkIGluIGBOZ1pvbmUucnVuYCxcbiAgICAgICAgLy8gYmVjYXVzZSB0aGUgdmlld3BvcnQgY2hhbmdlIGhhbmRsZXIgcnVucyBvdXRzaWRlIG9mIEFuZ3VsYXIuXG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQ2xhbXAgdGhlIHNjcm9sbCBkaXN0YW5jZSwgYmVjYXVzZSBpdCBjYW4gY2hhbmdlIHdpdGggdGhlIG51bWJlciBvZiB0YWJzLlxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2UgPSBNYXRoLm1heChcbiAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgTWF0aC5taW4odGhpcy5fZ2V0TWF4U2Nyb2xsRGlzdGFuY2UoKSwgdGhpcy5fc2Nyb2xsRGlzdGFuY2UpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlYWxpZ24oKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKSk7XG4gICAgICB9KTtcblxuICAgIC8vIElmIHRoZXJlIGlzIGEgY2hhbmdlIGluIHRoZSBmb2N1cyBrZXkgbWFuYWdlciB3ZSBuZWVkIHRvIGVtaXQgdGhlIGBpbmRleEZvY3VzZWRgXG4gICAgLy8gZXZlbnQgaW4gb3JkZXIgdG8gcHJvdmlkZSBhIHB1YmxpYyBldmVudCB0aGF0IG5vdGlmaWVzIGFib3V0IGZvY3VzIGNoYW5nZXMuIEFsc28gd2UgcmVhbGlnblxuICAgIC8vIHRoZSB0YWJzIGNvbnRhaW5lciBieSBzY3JvbGxpbmcgdGhlIG5ldyBmb2N1c2VkIHRhYiBpbnRvIHRoZSB2aXNpYmxlIHNlY3Rpb24uXG4gICAgdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG5ld0ZvY3VzSW5kZXggPT4ge1xuICAgICAgdGhpcy5pbmRleEZvY3VzZWQuZW1pdChuZXdGb2N1c0luZGV4KTtcbiAgICAgIHRoaXMuX3NldFRhYkZvY3VzKG5ld0ZvY3VzSW5kZXgpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQge1xuICAgIC8vIElmIHRoZSBudW1iZXIgb2YgdGFiIGxhYmVscyBoYXZlIGNoYW5nZWQsIGNoZWNrIGlmIHNjcm9sbGluZyBzaG91bGQgYmUgZW5hYmxlZFxuICAgIGlmICh0aGlzLl90YWJMYWJlbENvdW50ICE9IHRoaXMuX2l0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICB0aGlzLl90YWJMYWJlbENvdW50ID0gdGhpcy5faXRlbXMubGVuZ3RoO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHNlbGVjdGVkIGluZGV4IGhhcyBjaGFuZ2VkLCBzY3JvbGwgdG8gdGhlIGxhYmVsIGFuZCBjaGVjayBpZiB0aGUgc2Nyb2xsaW5nIGNvbnRyb2xzXG4gICAgLy8gc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4Q2hhbmdlZCkge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9MYWJlbCh0aGlzLl9zZWxlY3RlZEluZGV4KTtcbiAgICAgIHRoaXMuX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKTtcbiAgICAgIHRoaXMuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleENoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGJlZW4gY2hhbmdlZCAodGFiIHNlbGVjdGVkLCBmb2N1c2VkLCBzY3JvbGwgY29udHJvbHMgYWN0aXZhdGVkKSxcbiAgICAvLyB0aGVuIHRyYW5zbGF0ZSB0aGUgaGVhZGVyIHRvIHJlZmxlY3QgdGhpcy5cbiAgICBpZiAodGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl91cGRhdGVUYWJTY3JvbGxQb3NpdGlvbigpO1xuICAgICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX3N0b3BTY3JvbGxpbmcuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBvbiB0aGUgaGVhZGVyLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIFdlIGRvbid0IGhhbmRsZSBhbnkga2V5IGJpbmRpbmdzIHdpdGggYSBtb2RpZmllciBrZXkuXG4gICAgaWYgKGhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICAgIGlmICh0aGlzLmZvY3VzSW5kZXggIT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0Rm9jdXNlZEluZGV4LmVtaXQodGhpcy5mb2N1c0luZGV4KTtcbiAgICAgICAgICB0aGlzLl9pdGVtU2VsZWN0ZWQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgTXV0YXRpb25PYnNlcnZlciBkZXRlY3RzIHRoYXQgdGhlIGNvbnRlbnQgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBfb25Db250ZW50Q2hhbmdlcygpIHtcbiAgICBjb25zdCB0ZXh0Q29udGVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudDtcblxuICAgIC8vIFdlIG5lZWQgdG8gZGlmZiB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIsIGJlY2F1c2UgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgY2FsbGJhY2tcbiAgICAvLyB3aWxsIGZpcmUgZXZlbiBpZiB0aGUgdGV4dCBjb250ZW50IGRpZG4ndCBjaGFuZ2Ugd2hpY2ggaXMgaW5lZmZpY2llbnQgYW5kIGlzIHByb25lXG4gICAgLy8gdG8gaW5maW5pdGUgbG9vcHMgaWYgYSBwb29ybHkgY29uc3RydWN0ZWQgZXhwcmVzc2lvbiBpcyBwYXNzZWQgaW4gKHNlZSAjMTQyNDkpLlxuICAgIGlmICh0ZXh0Q29udGVudCAhPT0gdGhpcy5fY3VycmVudFRleHRDb250ZW50KSB7XG4gICAgICB0aGlzLl9jdXJyZW50VGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudCB8fCAnJztcblxuICAgICAgLy8gVGhlIGNvbnRlbnQgb2JzZXJ2ZXIgcnVucyBvdXRzaWRlIHRoZSBgTmdab25lYCBieSBkZWZhdWx0LCB3aGljaFxuICAgICAgLy8gbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIGJyaW5nIHRoZSBjYWxsYmFjayBiYWNrIGluIG91cnNlbHZlcy5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy5fYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiKCk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZpZXcgd2hldGhlciBwYWdpbmF0aW9uIHNob3VsZCBiZSBlbmFibGVkIG9yIG5vdC5cbiAgICpcbiAgICogV0FSTklORzogQ2FsbGluZyB0aGlzIG1ldGhvZCBjYW4gYmUgdmVyeSBjb3N0bHkgaW4gdGVybXMgb2YgcGVyZm9ybWFuY2UuIEl0IHNob3VsZCBiZSBjYWxsZWRcbiAgICogYXMgaW5mcmVxdWVudGx5IGFzIHBvc3NpYmxlIGZyb20gb3V0c2lkZSBvZiB0aGUgVGFicyBjb21wb25lbnQgYXMgaXQgY2F1c2VzIGEgcmVmbG93IG9mIHRoZVxuICAgKiBwYWdlLlxuICAgKi9cbiAgdXBkYXRlUGFnaW5hdGlvbigpIHtcbiAgICB0aGlzLl9jaGVja1BhZ2luYXRpb25FbmFibGVkKCk7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxpbmdDb250cm9scygpO1xuICAgIHRoaXMuX3VwZGF0ZVRhYlNjcm9sbFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKiogVHJhY2tzIHdoaWNoIGVsZW1lbnQgaGFzIGZvY3VzOyB1c2VkIGZvciBrZXlib2FyZCBuYXZpZ2F0aW9uICovXG4gIGdldCBmb2N1c0luZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2tleU1hbmFnZXIgPyB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCEgOiAwO1xuICB9XG5cbiAgLyoqIFdoZW4gdGhlIGZvY3VzIGluZGV4IGlzIHNldCwgd2UgbXVzdCBtYW51YWxseSBzZW5kIGZvY3VzIHRvIHRoZSBjb3JyZWN0IGxhYmVsICovXG4gIHNldCBmb2N1c0luZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuX2lzVmFsaWRJbmRleCh2YWx1ZSkgfHwgdGhpcy5mb2N1c0luZGV4ID09PSB2YWx1ZSB8fCAhdGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBhbiBpbmRleCBpcyB2YWxpZC4gIElmIHRoZSB0YWJzIGFyZSBub3QgcmVhZHkgeWV0LCB3ZSBhc3N1bWUgdGhhdCB0aGUgdXNlciBpc1xuICAgKiBwcm92aWRpbmcgYSB2YWxpZCBpbmRleCBhbmQgcmV0dXJuIHRydWUuXG4gICAqL1xuICBfaXNWYWxpZEluZGV4KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuX2l0ZW1zKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWIgPSB0aGlzLl9pdGVtcyA/IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVtpbmRleF0gOiBudWxsO1xuICAgIHJldHVybiAhIXRhYiAmJiAhdGFiLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9jdXMgb24gdGhlIEhUTUwgZWxlbWVudCBmb3IgdGhlIGxhYmVsIHdyYXBwZXIgYW5kIHNjcm9sbHMgaXQgaW50byB0aGUgdmlldyBpZlxuICAgKiBzY3JvbGxpbmcgaXMgZW5hYmxlZC5cbiAgICovXG4gIF9zZXRUYWJGb2N1cyh0YWJJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvTGFiZWwodGFiSW5kZXgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pdGVtcyAmJiB0aGlzLl9pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVt0YWJJbmRleF0uZm9jdXMoKTtcblxuICAgICAgLy8gRG8gbm90IGxldCB0aGUgYnJvd3NlciBtYW5hZ2Ugc2Nyb2xsaW5nIHRvIGZvY3VzIHRoZSBlbGVtZW50LCB0aGlzIHdpbGwgYmUgaGFuZGxlZFxuICAgICAgLy8gYnkgdXNpbmcgdHJhbnNsYXRpb24uIEluIExUUiwgdGhlIHNjcm9sbCBsZWZ0IHNob3VsZCBiZSAwLiBJbiBSVEwsIHRoZSBzY3JvbGwgd2lkdGhcbiAgICAgIC8vIHNob3VsZCBiZSB0aGUgZnVsbCB3aWR0aCBtaW51cyB0aGUgb2Zmc2V0IHdpZHRoLlxuICAgICAgY29uc3QgY29udGFpbmVyRWwgPSB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBkaXIgPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKTtcblxuICAgICAgaWYgKGRpciA9PSAnbHRyJykge1xuICAgICAgICBjb250YWluZXJFbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRhaW5lckVsLnNjcm9sbExlZnQgPSBjb250YWluZXJFbC5zY3JvbGxXaWR0aCAtIGNvbnRhaW5lckVsLm9mZnNldFdpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgbGF5b3V0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIF9nZXRMYXlvdXREaXJlY3Rpb24oKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIFBlcmZvcm1zIHRoZSBDU1MgdHJhbnNmb3JtYXRpb24gb24gdGhlIHRhYiBsaXN0IHRoYXQgd2lsbCBjYXVzZSB0aGUgbGlzdCB0byBzY3JvbGwuICovXG4gIF91cGRhdGVUYWJTY3JvbGxQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUGFnaW5hdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcm9sbERpc3RhbmNlID0gdGhpcy5zY3JvbGxEaXN0YW5jZTtcbiAgICBjb25zdCB0cmFuc2xhdGVYID0gdGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT09ICdsdHInID8gLXNjcm9sbERpc3RhbmNlIDogc2Nyb2xsRGlzdGFuY2U7XG5cbiAgICAvLyBEb24ndCB1c2UgYHRyYW5zbGF0ZTNkYCBoZXJlIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBjcmVhdGUgYSBuZXcgbGF5ZXIuIEEgbmV3IGxheWVyXG4gICAgLy8gc2VlbXMgdG8gY2F1c2UgZmxpY2tlcmluZyBhbmQgb3ZlcmZsb3cgaW4gSW50ZXJuZXQgRXhwbG9yZXIuIEZvciBleGFtcGxlLCB0aGUgaW5rIGJhclxuICAgIC8vIGFuZCByaXBwbGVzIHdpbGwgZXhjZWVkIHRoZSBib3VuZGFyaWVzIG9mIHRoZSB2aXNpYmxlIHRhYiBiYXIuXG4gICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xMDI3NlxuICAgIC8vIFdlIHJvdW5kIHRoZSBgdHJhbnNmb3JtYCBoZXJlLCBiZWNhdXNlIHRyYW5zZm9ybXMgd2l0aCBzdWItcGl4ZWwgcHJlY2lzaW9uIGNhdXNlIHNvbWVcbiAgICAvLyBicm93c2VycyB0byBibHVyIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50LlxuICAgIHRoaXMuX3RhYkxpc3QubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke01hdGgucm91bmQodHJhbnNsYXRlWCl9cHgpYDtcblxuICAgIC8vIFNldHRpbmcgdGhlIGB0cmFuc2Zvcm1gIG9uIElFIHdpbGwgY2hhbmdlIHRoZSBzY3JvbGwgb2Zmc2V0IG9mIHRoZSBwYXJlbnQsIGNhdXNpbmcgdGhlXG4gICAgLy8gcG9zaXRpb24gdG8gYmUgdGhyb3duIG9mZiBpbiBzb21lIGNhc2VzLiBXZSBoYXZlIHRvIHJlc2V0IGl0IG91cnNlbHZlcyB0byBlbnN1cmUgdGhhdFxuICAgIC8vIGl0IGRvZXNuJ3QgZ2V0IHRocm93biBvZmYuIE5vdGUgdGhhdCB3ZSBzY29wZSBpdCBvbmx5IHRvIElFIGFuZCBFZGdlLCBiZWNhdXNlIG1lc3NpbmdcbiAgICAvLyB3aXRoIHRoZSBzY3JvbGwgcG9zaXRpb24gdGhyb3dzIG9mZiBDaHJvbWUgNzErIGluIFJUTCBtb2RlIChzZWUgIzE0Njg5KS5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uVFJJREVOVCB8fCB0aGlzLl9wbGF0Zm9ybS5FREdFKSB7XG4gICAgICB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc3RhbmNlIGluIHBpeGVscyB0aGF0IHRoZSB0YWIgaGVhZGVyIHNob3VsZCBiZSB0cmFuc2Zvcm1lZCBpbiB0aGUgWC1heGlzLiAqL1xuICBnZXQgc2Nyb2xsRGlzdGFuY2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2Nyb2xsRGlzdGFuY2U7XG4gIH1cbiAgc2V0IHNjcm9sbERpc3RhbmNlKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9zY3JvbGxUbyh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIHRhYiBsaXN0IGluIHRoZSAnYmVmb3JlJyBvciAnYWZ0ZXInIGRpcmVjdGlvbiAodG93YXJkcyB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaXN0IG9yXG4gICAqIHRoZSBlbmQgb2YgdGhlIGxpc3QsIHJlc3BlY3RpdmVseSkuIFRoZSBkaXN0YW5jZSB0byBzY3JvbGwgaXMgY29tcHV0ZWQgdG8gYmUgYSB0aGlyZCBvZiB0aGVcbiAgICogbGVuZ3RoIG9mIHRoZSB0YWIgbGlzdCB2aWV3IHdpbmRvdy5cbiAgICpcbiAgICogVGhpcyBpcyBhbiBleHBlbnNpdmUgY2FsbCB0aGF0IGZvcmNlcyBhIGxheW91dCByZWZsb3cgdG8gY29tcHV0ZSBib3ggYW5kIHNjcm9sbCBtZXRyaWNzIGFuZFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIHNwYXJpbmdseS5cbiAgICovXG4gIF9zY3JvbGxIZWFkZXIoZGlyZWN0aW9uOiBTY3JvbGxEaXJlY3Rpb24pIHtcbiAgICBjb25zdCB2aWV3TGVuZ3RoID0gdGhpcy5fdGFiTGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuXG4gICAgLy8gTW92ZSB0aGUgc2Nyb2xsIGRpc3RhbmNlIG9uZS10aGlyZCB0aGUgbGVuZ3RoIG9mIHRoZSB0YWIgbGlzdCdzIHZpZXdwb3J0LlxuICAgIGNvbnN0IHNjcm9sbEFtb3VudCA9ICgoZGlyZWN0aW9uID09ICdiZWZvcmUnID8gLTEgOiAxKSAqIHZpZXdMZW5ndGgpIC8gMztcblxuICAgIHJldHVybiB0aGlzLl9zY3JvbGxUbyh0aGlzLl9zY3JvbGxEaXN0YW5jZSArIHNjcm9sbEFtb3VudCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBjbGljayBldmVudHMgb24gdGhlIHBhZ2luYXRpb24gYXJyb3dzLiAqL1xuICBfaGFuZGxlUGFnaW5hdG9yQ2xpY2soZGlyZWN0aW9uOiBTY3JvbGxEaXJlY3Rpb24pIHtcbiAgICB0aGlzLl9zdG9wSW50ZXJ2YWwoKTtcbiAgICB0aGlzLl9zY3JvbGxIZWFkZXIoZGlyZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgdGFiIGxpc3Qgc3VjaCB0aGF0IHRoZSBkZXNpcmVkIHRhYiBsYWJlbCAobWFya2VkIGJ5IGluZGV4KSBpcyBtb3ZlZCBpbnRvIHZpZXcuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfc2Nyb2xsVG9MYWJlbChsYWJlbEluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUGFnaW5hdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSB0aGlzLl9pdGVtcyA/IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVtsYWJlbEluZGV4XSA6IG51bGw7XG5cbiAgICBpZiAoIXNlbGVjdGVkTGFiZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgdmlldyBsZW5ndGggaXMgdGhlIHZpc2libGUgd2lkdGggb2YgdGhlIHRhYiBsYWJlbHMuXG4gICAgY29uc3Qgdmlld0xlbmd0aCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCB7b2Zmc2V0TGVmdCwgb2Zmc2V0V2lkdGh9ID0gc2VsZWN0ZWRMYWJlbC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBsZXQgbGFiZWxCZWZvcmVQb3M6IG51bWJlciwgbGFiZWxBZnRlclBvczogbnVtYmVyO1xuICAgIGlmICh0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PSAnbHRyJykge1xuICAgICAgbGFiZWxCZWZvcmVQb3MgPSBvZmZzZXRMZWZ0O1xuICAgICAgbGFiZWxBZnRlclBvcyA9IGxhYmVsQmVmb3JlUG9zICsgb2Zmc2V0V2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhYmVsQWZ0ZXJQb3MgPSB0aGlzLl90YWJMaXN0SW5uZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCAtIG9mZnNldExlZnQ7XG4gICAgICBsYWJlbEJlZm9yZVBvcyA9IGxhYmVsQWZ0ZXJQb3MgLSBvZmZzZXRXaWR0aDtcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmVWaXNpYmxlUG9zID0gdGhpcy5zY3JvbGxEaXN0YW5jZTtcbiAgICBjb25zdCBhZnRlclZpc2libGVQb3MgPSB0aGlzLnNjcm9sbERpc3RhbmNlICsgdmlld0xlbmd0aDtcblxuICAgIGlmIChsYWJlbEJlZm9yZVBvcyA8IGJlZm9yZVZpc2libGVQb3MpIHtcbiAgICAgIC8vIFNjcm9sbCBoZWFkZXIgdG8gbW92ZSBsYWJlbCB0byB0aGUgYmVmb3JlIGRpcmVjdGlvblxuICAgICAgdGhpcy5zY3JvbGxEaXN0YW5jZSAtPSBiZWZvcmVWaXNpYmxlUG9zIC0gbGFiZWxCZWZvcmVQb3MgKyBFWEFHR0VSQVRFRF9PVkVSU0NST0xMO1xuICAgIH0gZWxzZSBpZiAobGFiZWxBZnRlclBvcyA+IGFmdGVyVmlzaWJsZVBvcykge1xuICAgICAgLy8gU2Nyb2xsIGhlYWRlciB0byBtb3ZlIGxhYmVsIHRvIHRoZSBhZnRlciBkaXJlY3Rpb25cbiAgICAgIHRoaXMuc2Nyb2xsRGlzdGFuY2UgKz0gbGFiZWxBZnRlclBvcyAtIGFmdGVyVmlzaWJsZVBvcyArIEVYQUdHRVJBVEVEX09WRVJTQ1JPTEw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIHdoZXRoZXIgdGhlIHBhZ2luYXRpb24gY29udHJvbHMgc2hvdWxkIGJlIGRpc3BsYXllZC4gSWYgdGhlIHNjcm9sbCB3aWR0aCBvZiB0aGVcbiAgICogdGFiIGxpc3QgaXMgd2lkZXIgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgaGVhZGVyIGNvbnRhaW5lciwgdGhlbiB0aGUgcGFnaW5hdGlvbiBjb250cm9scyBzaG91bGRcbiAgICogYmUgc2hvd24uXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfY2hlY2tQYWdpbmF0aW9uRW5hYmxlZCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUGFnaW5hdGlvbikge1xuICAgICAgdGhpcy5fc2hvd1BhZ2luYXRpb25Db250cm9scyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpc0VuYWJsZWQgPVxuICAgICAgICB0aGlzLl90YWJMaXN0SW5uZXIubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aCA+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcblxuICAgICAgaWYgKCFpc0VuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxEaXN0YW5jZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0VuYWJsZWQgIT09IHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMpIHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMgPSBpc0VuYWJsZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIHdoZXRoZXIgdGhlIGJlZm9yZSBhbmQgYWZ0ZXIgY29udHJvbHMgc2hvdWxkIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWQuXG4gICAqIElmIHRoZSBoZWFkZXIgaXMgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGlzdCAoc2Nyb2xsIGRpc3RhbmNlIGlzIGVxdWFsIHRvIDApIHRoZW4gZGlzYWJsZSB0aGVcbiAgICogYmVmb3JlIGJ1dHRvbi4gSWYgdGhlIGhlYWRlciBpcyBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0IChzY3JvbGwgZGlzdGFuY2UgaXMgZXF1YWwgdG8gdGhlXG4gICAqIG1heGltdW0gZGlzdGFuY2Ugd2UgY2FuIHNjcm9sbCksIHRoZW4gZGlzYWJsZSB0aGUgYWZ0ZXIgYnV0dG9uLlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVTY3JvbGxBZnRlciA9IHRoaXMuX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcGFnaW5hdGlvbiBhcnJvd3Mgc2hvdWxkIGJlIGFjdGl2YXRlZC5cbiAgICAgIHRoaXMuX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0aGlzLnNjcm9sbERpc3RhbmNlID09IDA7XG4gICAgICB0aGlzLl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgPSB0aGlzLnNjcm9sbERpc3RhbmNlID09IHRoaXMuX2dldE1heFNjcm9sbERpc3RhbmNlKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGF0IGlzIHRoZSBtYXhpbXVtIGxlbmd0aCBpbiBwaXhlbHMgdGhhdCBjYW4gYmUgc2V0IGZvciB0aGUgc2Nyb2xsIGRpc3RhbmNlLiBUaGlzXG4gICAqIGlzIGVxdWFsIHRvIHRoZSBkaWZmZXJlbmNlIGluIHdpZHRoIGJldHdlZW4gdGhlIHRhYiBsaXN0IGNvbnRhaW5lciBhbmQgdGFiIGhlYWRlciBjb250YWluZXIuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfZ2V0TWF4U2Nyb2xsRGlzdGFuY2UoKTogbnVtYmVyIHtcbiAgICBjb25zdCBsZW5ndGhPZlRhYkxpc3QgPSB0aGlzLl90YWJMaXN0SW5uZXIubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aDtcbiAgICBjb25zdCB2aWV3TGVuZ3RoID0gdGhpcy5fdGFiTGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIHJldHVybiBsZW5ndGhPZlRhYkxpc3QgLSB2aWV3TGVuZ3RoIHx8IDA7XG4gIH1cblxuICAvKiogVGVsbHMgdGhlIGluay1iYXIgdG8gYWxpZ24gaXRzZWxmIHRvIHRoZSBjdXJyZW50IGxhYmVsIHdyYXBwZXIgKi9cbiAgX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPVxuICAgICAgdGhpcy5faXRlbXMgJiYgdGhpcy5faXRlbXMubGVuZ3RoID8gdGhpcy5faXRlbXMudG9BcnJheSgpW3RoaXMuc2VsZWN0ZWRJbmRleF0gOiBudWxsO1xuICAgIGNvbnN0IHNlbGVjdGVkTGFiZWxXcmFwcGVyID0gc2VsZWN0ZWRJdGVtID8gc2VsZWN0ZWRJdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICBpZiAoc2VsZWN0ZWRMYWJlbFdyYXBwZXIpIHtcbiAgICAgIHRoaXMuX2lua0Jhci5hbGlnblRvRWxlbWVudChzZWxlY3RlZExhYmVsV3JhcHBlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2lua0Jhci5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFN0b3BzIHRoZSBjdXJyZW50bHktcnVubmluZyBwYWdpbmF0b3IgaW50ZXJ2YWwuICAqL1xuICBfc3RvcEludGVydmFsKCkge1xuICAgIHRoaXMuX3N0b3BTY3JvbGxpbmcubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIHVzZXIgcHJlc3NpbmcgZG93biBvbiBvbmUgb2YgdGhlIHBhZ2luYXRvcnMuXG4gICAqIFN0YXJ0cyBzY3JvbGxpbmcgdGhlIGhlYWRlciBhZnRlciBhIGNlcnRhaW4gYW1vdW50IG9mIHRpbWUuXG4gICAqIEBwYXJhbSBkaXJlY3Rpb24gSW4gd2hpY2ggZGlyZWN0aW9uIHRoZSBwYWdpbmF0b3Igc2hvdWxkIGJlIHNjcm9sbGVkLlxuICAgKi9cbiAgX2hhbmRsZVBhZ2luYXRvclByZXNzKGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uLCBtb3VzZUV2ZW50PzogTW91c2VFdmVudCkge1xuICAgIC8vIERvbid0IHN0YXJ0IGF1dG8gc2Nyb2xsaW5nIGZvciByaWdodCBtb3VzZSBidXR0b24gY2xpY2tzLiBOb3RlIHRoYXQgd2Ugc2hvdWxkbid0IGhhdmUgdG9cbiAgICAvLyBudWxsIGNoZWNrIHRoZSBgYnV0dG9uYCwgYnV0IHdlIGRvIGl0IHNvIHdlIGRvbid0IGJyZWFrIHRlc3RzIHRoYXQgdXNlIGZha2UgZXZlbnRzLlxuICAgIGlmIChtb3VzZUV2ZW50ICYmIG1vdXNlRXZlbnQuYnV0dG9uICE9IG51bGwgJiYgbW91c2VFdmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBdm9pZCBvdmVybGFwcGluZyB0aW1lcnMuXG4gICAgdGhpcy5fc3RvcEludGVydmFsKCk7XG5cbiAgICAvLyBTdGFydCBhIHRpbWVyIGFmdGVyIHRoZSBkZWxheSBhbmQga2VlcCBmaXJpbmcgYmFzZWQgb24gdGhlIGludGVydmFsLlxuICAgIHRpbWVyKEhFQURFUl9TQ1JPTExfREVMQVksIEhFQURFUl9TQ1JPTExfSU5URVJWQUwpXG4gICAgICAvLyBLZWVwIHRoZSB0aW1lciBnb2luZyB1bnRpbCBzb21ldGhpbmcgdGVsbHMgaXQgdG8gc3RvcCBvciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC5cbiAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZSh0aGlzLl9zdG9wU2Nyb2xsaW5nLCB0aGlzLl9kZXN0cm95ZWQpKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCB7bWF4U2Nyb2xsRGlzdGFuY2UsIGRpc3RhbmNlfSA9IHRoaXMuX3Njcm9sbEhlYWRlcihkaXJlY3Rpb24pO1xuXG4gICAgICAgIC8vIFN0b3AgdGhlIHRpbWVyIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIHN0YXJ0IG9yIHRoZSBlbmQuXG4gICAgICAgIGlmIChkaXN0YW5jZSA9PT0gMCB8fCBkaXN0YW5jZSA+PSBtYXhTY3JvbGxEaXN0YW5jZSkge1xuICAgICAgICAgIHRoaXMuX3N0b3BJbnRlcnZhbCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY3JvbGxzIHRoZSBoZWFkZXIgdG8gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHBvc2l0aW9uIFBvc2l0aW9uIHRvIHdoaWNoIHRvIHNjcm9sbC5cbiAgICogQHJldHVybnMgSW5mb3JtYXRpb24gb24gdGhlIGN1cnJlbnQgc2Nyb2xsIGRpc3RhbmNlIGFuZCB0aGUgbWF4aW11bS5cbiAgICovXG4gIHByaXZhdGUgX3Njcm9sbFRvKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUGFnaW5hdGlvbikge1xuICAgICAgcmV0dXJuIHttYXhTY3JvbGxEaXN0YW5jZTogMCwgZGlzdGFuY2U6IDB9O1xuICAgIH1cblxuICAgIGNvbnN0IG1heFNjcm9sbERpc3RhbmNlID0gdGhpcy5fZ2V0TWF4U2Nyb2xsRGlzdGFuY2UoKTtcbiAgICB0aGlzLl9zY3JvbGxEaXN0YW5jZSA9IE1hdGgubWF4KDAsIE1hdGgubWluKG1heFNjcm9sbERpc3RhbmNlLCBwb3NpdGlvbikpO1xuXG4gICAgLy8gTWFyayB0aGF0IHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGNoYW5nZWQgc28gdGhhdCBhZnRlciB0aGUgdmlldyBpcyBjaGVja2VkLCB0aGUgQ1NTXG4gICAgLy8gdHJhbnNmb3JtYXRpb24gY2FuIG1vdmUgdGhlIGhlYWRlci5cbiAgICB0aGlzLl9zY3JvbGxEaXN0YW5jZUNoYW5nZWQgPSB0cnVlO1xuICAgIHRoaXMuX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKTtcblxuICAgIHJldHVybiB7bWF4U2Nyb2xsRGlzdGFuY2UsIGRpc3RhbmNlOiB0aGlzLl9zY3JvbGxEaXN0YW5jZX07XG4gIH1cbn1cbiJdfQ==
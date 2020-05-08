/**
 * @fileoverview added by tsickle
 * Generated from: src/material/tabs/paginated-tab-header.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, NgZone, Optional, EventEmitter, Directive, Inject, Input, } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { END, ENTER, HOME, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { merge, of as observableOf, Subject, timer, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * Config used to bind passive event listeners
 * @type {?}
 */
const passiveEventListenerOptions = (/** @type {?} */ (normalizePassiveListenerOptions({ passive: true })));
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 * @type {?}
 */
const EXAGGERATED_OVERSCROLL = 60;
/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 * @type {?}
 */
const HEADER_SCROLL_DELAY = 650;
/**
 * Interval in milliseconds at which to scroll the header
 * while the user is holding their pointer.
 * @type {?}
 */
const HEADER_SCROLL_INTERVAL = 100;
/**
 * Base class for a tab header that supported pagination.
 * \@docs-private
 * @abstract
 */
export class MatPaginatedTabHeader {
    /**
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} _viewportRuler
     * @param {?} _dir
     * @param {?} _ngZone
     * @param {?=} _platform
     * @param {?=} _animationMode
     */
    constructor(_elementRef, _changeDetectorRef, _viewportRuler, _dir, _ngZone, _platform, _animationMode) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._viewportRuler = _viewportRuler;
        this._dir = _dir;
        this._ngZone = _ngZone;
        this._platform = _platform;
        this._animationMode = _animationMode;
        /**
         * The distance in pixels that the tab labels should be translated to the left.
         */
        this._scrollDistance = 0;
        /**
         * Whether the header should scroll to the selected index after the view has been checked.
         */
        this._selectedIndexChanged = false;
        /**
         * Emits when the component is destroyed.
         */
        this._destroyed = new Subject();
        /**
         * Whether the controls for pagination should be displayed
         */
        this._showPaginationControls = false;
        /**
         * Whether the tab list can be scrolled more towards the end of the tab label list.
         */
        this._disableScrollAfter = true;
        /**
         * Whether the tab list can be scrolled more towards the beginning of the tab label list.
         */
        this._disableScrollBefore = true;
        /**
         * Stream that will stop the automated scrolling.
         */
        this._stopScrolling = new Subject();
        /**
         * Whether pagination should be disabled. This can be used to avoid unnecessary
         * layout recalculations if it's known that pagination won't be required.
         */
        this.disablePagination = false;
        this._selectedIndex = 0;
        /**
         * Event emitted when the option is selected.
         */
        this.selectFocusedIndex = new EventEmitter();
        /**
         * Event emitted when a label is focused.
         */
        this.indexFocused = new EventEmitter();
        // Bind the `mouseleave` event on the outside since it doesn't change anything in the view.
        _ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            fromEvent(_elementRef.nativeElement, 'mouseleave')
                .pipe(takeUntil(this._destroyed))
                .subscribe((/**
             * @return {?}
             */
            () => {
                this._stopInterval();
            }));
        }));
    }
    /**
     * The index of the active tab.
     * @return {?}
     */
    get selectedIndex() { return this._selectedIndex; }
    /**
     * @param {?} value
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // We need to handle these events manually, because we want to bind passive event listeners.
        fromEvent(this._previousPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe((/**
         * @return {?}
         */
        () => {
            this._handlePaginatorPress('before');
        }));
        fromEvent(this._nextPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe((/**
         * @return {?}
         */
        () => {
            this._handlePaginatorPress('after');
        }));
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        /** @type {?} */
        const dirChange = this._dir ? this._dir.change : observableOf(null);
        /** @type {?} */
        const resize = this._viewportRuler.change(150);
        /** @type {?} */
        const realign = (/**
         * @return {?}
         */
        () => {
            this.updatePagination();
            this._alignInkBarToSelectedTab();
        });
        this._keyManager = new FocusKeyManager(this._items)
            .withHorizontalOrientation(this._getLayoutDirection())
            .withWrap();
        this._keyManager.updateActiveItem(0);
        // Defer the first call in order to allow for slower browsers to lay out the elements.
        // This helps in cases where the user lands directly on a page with paginated tabs.
        typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(realign) : realign();
        // On dir change or window resize, realign the ink bar and update the orientation of
        // the key manager if the direction has changed.
        merge(dirChange, resize, this._items.changes).pipe(takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => {
            // We need to defer this to give the browser some time to recalculate the element dimensions.
            Promise.resolve().then(realign);
            this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
        }));
        // If there is a change in the focus key manager we need to emit the `indexFocused`
        // event in order to provide a public event that notifies about focus changes. Also we realign
        // the tabs container by scrolling the new focused tab into the visible section.
        this._keyManager.change.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @param {?} newFocusIndex
         * @return {?}
         */
        newFocusIndex => {
            this.indexFocused.emit(newFocusIndex);
            this._setTabFocus(newFocusIndex);
        }));
    }
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this._stopScrolling.complete();
    }
    /**
     * Handles keyboard events on the header.
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        // We don't handle any key bindings with a modifier key.
        if (hasModifierKey(event)) {
            return;
        }
        switch (event.keyCode) {
            case HOME:
                this._keyManager.setFirstItemActive();
                event.preventDefault();
                break;
            case END:
                this._keyManager.setLastItemActive();
                event.preventDefault();
                break;
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
     * @return {?}
     */
    _onContentChanges() {
        /** @type {?} */
        const textContent = this._elementRef.nativeElement.textContent;
        // We need to diff the text content of the header, because the MutationObserver callback
        // will fire even if the text content didn't change which is inefficient and is prone
        // to infinite loops if a poorly constructed expression is passed in (see #14249).
        if (textContent !== this._currentTextContent) {
            this._currentTextContent = textContent || '';
            // The content observer runs outside the `NgZone` by default, which
            // means that we need to bring the callback back in ourselves.
            this._ngZone.run((/**
             * @return {?}
             */
            () => {
                this.updatePagination();
                this._alignInkBarToSelectedTab();
                this._changeDetectorRef.markForCheck();
            }));
        }
    }
    /**
     * Updates the view whether pagination should be enabled or not.
     *
     * WARNING: Calling this method can be very costly in terms of performance. It should be called
     * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
     * page.
     * @return {?}
     */
    updatePagination() {
        this._checkPaginationEnabled();
        this._checkScrollingControls();
        this._updateTabScrollPosition();
    }
    /**
     * Tracks which element has focus; used for keyboard navigation
     * @return {?}
     */
    get focusIndex() {
        return this._keyManager ? (/** @type {?} */ (this._keyManager.activeItemIndex)) : 0;
    }
    /**
     * When the focus index is set, we must manually send focus to the correct label
     * @param {?} value
     * @return {?}
     */
    set focusIndex(value) {
        if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
            return;
        }
        this._keyManager.setActiveItem(value);
    }
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     * @param {?} index
     * @return {?}
     */
    _isValidIndex(index) {
        if (!this._items) {
            return true;
        }
        /** @type {?} */
        const tab = this._items ? this._items.toArray()[index] : null;
        return !!tab && !tab.disabled;
    }
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     * @param {?} tabIndex
     * @return {?}
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
            /** @type {?} */
            const containerEl = this._tabListContainer.nativeElement;
            /** @type {?} */
            const dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    }
    /**
     * The layout direction of the containing app.
     * @return {?}
     */
    _getLayoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /**
     * Performs the CSS transformation on the tab list that will cause the list to scroll.
     * @return {?}
     */
    _updateTabScrollPosition() {
        if (this.disablePagination) {
            return;
        }
        /** @type {?} */
        const scrollDistance = this.scrollDistance;
        /** @type {?} */
        const platform = this._platform;
        /** @type {?} */
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
        // @breaking-change 9.0.0 Remove null check for `platform` after it can no longer be undefined.
        if (platform && (platform.TRIDENT || platform.EDGE)) {
            this._tabListContainer.nativeElement.scrollLeft = 0;
        }
    }
    /**
     * Sets the distance in pixels that the tab header should be transformed in the X-axis.
     * @return {?}
     */
    get scrollDistance() { return this._scrollDistance; }
    /**
     * @param {?} value
     * @return {?}
     */
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
     * @param {?} direction
     * @return {?}
     */
    _scrollHeader(direction) {
        /** @type {?} */
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        /** @type {?} */
        const scrollAmount = (direction == 'before' ? -1 : 1) * viewLength / 3;
        return this._scrollTo(this._scrollDistance + scrollAmount);
    }
    /**
     * Handles click events on the pagination arrows.
     * @param {?} direction
     * @return {?}
     */
    _handlePaginatorClick(direction) {
        this._stopInterval();
        this._scrollHeader(direction);
    }
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @param {?} labelIndex
     * @return {?}
     */
    _scrollToLabel(labelIndex) {
        if (this.disablePagination) {
            return;
        }
        /** @type {?} */
        const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        /** @type {?} */
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;
        /** @type {?} */
        let labelBeforePos;
        /** @type {?} */
        let labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = offsetLeft;
            labelAfterPos = labelBeforePos + offsetWidth;
        }
        else {
            labelAfterPos = this._tabList.nativeElement.offsetWidth - offsetLeft;
            labelBeforePos = labelAfterPos - offsetWidth;
        }
        /** @type {?} */
        const beforeVisiblePos = this.scrollDistance;
        /** @type {?} */
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
     * @return {?}
     */
    _checkPaginationEnabled() {
        if (this.disablePagination) {
            this._showPaginationControls = false;
        }
        else {
            /** @type {?} */
            const isEnabled = this._tabList.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
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
     * @return {?}
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
     * @return {?}
     */
    _getMaxScrollDistance() {
        /** @type {?} */
        const lengthOfTabList = this._tabList.nativeElement.scrollWidth;
        /** @type {?} */
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return (lengthOfTabList - viewLength) || 0;
    }
    /**
     * Tells the ink-bar to align itself to the current label wrapper
     * @return {?}
     */
    _alignInkBarToSelectedTab() {
        /** @type {?} */
        const selectedItem = this._items && this._items.length ?
            this._items.toArray()[this.selectedIndex] : null;
        /** @type {?} */
        const selectedLabelWrapper = selectedItem ? selectedItem.elementRef.nativeElement : null;
        if (selectedLabelWrapper) {
            this._inkBar.alignToElement(selectedLabelWrapper);
        }
        else {
            this._inkBar.hide();
        }
    }
    /**
     * Stops the currently-running paginator interval.
     * @return {?}
     */
    _stopInterval() {
        this._stopScrolling.next();
    }
    /**
     * Handles the user pressing down on one of the paginators.
     * Starts scrolling the header after a certain amount of time.
     * @param {?} direction In which direction the paginator should be scrolled.
     * @param {?=} mouseEvent
     * @return {?}
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
            .subscribe((/**
         * @return {?}
         */
        () => {
            const { maxScrollDistance, distance } = this._scrollHeader(direction);
            // Stop the timer if we've reached the start or the end.
            if (distance === 0 || distance >= maxScrollDistance) {
                this._stopInterval();
            }
        }));
    }
    /**
     * Scrolls the header to a given position.
     * @private
     * @param {?} position Position to which to scroll.
     * @return {?} Information on the current scroll distance and the maximum.
     */
    _scrollTo(position) {
        if (this.disablePagination) {
            return { maxScrollDistance: 0, distance: 0 };
        }
        /** @type {?} */
        const maxScrollDistance = this._getMaxScrollDistance();
        this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));
        // Mark that the scroll distance has changed so that after the view is checked, the CSS
        // transformation can move the header.
        this._scrollDistanceChanged = true;
        this._checkScrollingControls();
        return { maxScrollDistance, distance: this._scrollDistance };
    }
}
MatPaginatedTabHeader.decorators = [
    { type: Directive }
];
/** @nocollapse */
MatPaginatedTabHeader.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: ViewportRuler },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NgZone },
    { type: Platform },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatPaginatedTabHeader.propDecorators = {
    disablePagination: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatPaginatedTabHeader.ngAcceptInputType_selectedIndex;
    /** @type {?} */
    MatPaginatedTabHeader.prototype._items;
    /** @type {?} */
    MatPaginatedTabHeader.prototype._inkBar;
    /** @type {?} */
    MatPaginatedTabHeader.prototype._tabListContainer;
    /** @type {?} */
    MatPaginatedTabHeader.prototype._tabList;
    /** @type {?} */
    MatPaginatedTabHeader.prototype._nextPaginator;
    /** @type {?} */
    MatPaginatedTabHeader.prototype._previousPaginator;
    /**
     * The distance in pixels that the tab labels should be translated to the left.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._scrollDistance;
    /**
     * Whether the header should scroll to the selected index after the view has been checked.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._selectedIndexChanged;
    /**
     * Emits when the component is destroyed.
     * @type {?}
     * @protected
     */
    MatPaginatedTabHeader.prototype._destroyed;
    /**
     * Whether the controls for pagination should be displayed
     * @type {?}
     */
    MatPaginatedTabHeader.prototype._showPaginationControls;
    /**
     * Whether the tab list can be scrolled more towards the end of the tab label list.
     * @type {?}
     */
    MatPaginatedTabHeader.prototype._disableScrollAfter;
    /**
     * Whether the tab list can be scrolled more towards the beginning of the tab label list.
     * @type {?}
     */
    MatPaginatedTabHeader.prototype._disableScrollBefore;
    /**
     * The number of tab labels that are displayed on the header. When this changes, the header
     * should re-evaluate the scroll position.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._tabLabelCount;
    /**
     * Whether the scroll distance has changed and should be applied after the view is checked.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._scrollDistanceChanged;
    /**
     * Used to manage focus between the tabs.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._keyManager;
    /**
     * Cached text content of the header.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._currentTextContent;
    /**
     * Stream that will stop the automated scrolling.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._stopScrolling;
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     * @type {?}
     */
    MatPaginatedTabHeader.prototype.disablePagination;
    /**
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._selectedIndex;
    /**
     * Event emitted when the option is selected.
     * @type {?}
     */
    MatPaginatedTabHeader.prototype.selectFocusedIndex;
    /**
     * Event emitted when a label is focused.
     * @type {?}
     */
    MatPaginatedTabHeader.prototype.indexFocused;
    /**
     * @type {?}
     * @protected
     */
    MatPaginatedTabHeader.prototype._elementRef;
    /**
     * @type {?}
     * @protected
     */
    MatPaginatedTabHeader.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._viewportRuler;
    /**
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._ngZone;
    /**
     * @deprecated \@breaking-change 9.0.0 `_platform` and `_animationMode`
     * parameters to become required.
     * @type {?}
     * @private
     */
    MatPaginatedTabHeader.prototype._platform;
    /** @type {?} */
    MatPaginatedTabHeader.prototype._animationMode;
    /**
     * Called when the user has selected an item via the keyboard.
     * @abstract
     * @protected
     * @param {?} event
     * @return {?}
     */
    MatPaginatedTabHeader.prototype._itemSelected = function (event) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGVkLXRhYi1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy9wYWdpbmF0ZWQtdGFiLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFlBQVksRUFLWixTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssR0FDTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVksY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxlQUFlLEVBQWtCLE1BQU0sbUJBQW1CLENBQUM7QUFDbkUsT0FBTyxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDMUUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxRQUFRLEVBQUUsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7Ozs7TUFJckUsMkJBQTJCLEdBQzdCLG1CQUFBLCtCQUErQixDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLEVBQXdCOzs7Ozs7TUFhdEUsc0JBQXNCLEdBQUcsRUFBRTs7Ozs7O01BTTNCLG1CQUFtQixH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QUFDLHFCQUFxQjs7O2dDQW5DcEQsS0FBSzs7OztJQStkTixzREFBb0Q7O0lBOWdCcEQsdUNBQXNEOztJQUN0RCx3Q0FBcUY7O0lBQ3JGLGtEQUFvRDs7SUFDcEQseUNBQTJDOztJQUMzQywrQ0FBaUQ7O0lBQ2pELG1EQUFxRDs7Ozs7O0lBR3JELGdEQUE0Qjs7Ozs7O0lBRzVCLHNEQUFzQzs7Ozs7O0lBR3RDLDJDQUFvRDs7Ozs7SUFHcEQsd0RBQWdDOzs7OztJQUdoQyxvREFBMkI7Ozs7O0lBRzNCLHFEQUE0Qjs7Ozs7OztJQU01QiwrQ0FBK0I7Ozs7OztJQUcvQix1REFBd0M7Ozs7OztJQUd4Qyw0Q0FBZ0U7Ozs7OztJQUdoRSxvREFBb0M7Ozs7OztJQUdwQywrQ0FBNkM7Ozs7OztJQU03QyxrREFDbUM7Ozs7O0lBZ0JuQywrQ0FBbUM7Ozs7O0lBR25DLG1EQUErRTs7Ozs7SUFHL0UsNkNBQXlFOzs7OztJQUU3RCw0Q0FBOEM7Ozs7O0lBQzlDLG1EQUErQzs7Ozs7SUFDL0MsK0NBQXFDOzs7OztJQUNyQyxxQ0FBd0M7Ozs7O0lBQ3hDLHdDQUF1Qjs7Ozs7OztJQUt2QiwwQ0FBNEI7O0lBQzVCLCtDQUF5RTs7Ozs7Ozs7SUFhckYscUVBQTZEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBFbGVtZW50UmVmLFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIEV2ZW50RW1pdHRlcixcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbiAgSW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlciwgRm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VORCwgRU5URVIsIEhPTUUsIFNQQUNFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7bWVyZ2UsIG9mIGFzIG9ic2VydmFibGVPZiwgU3ViamVjdCwgdGltZXIsIGZyb21FdmVudH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtQbGF0Zm9ybSwgbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbi8qKiBDb25maWcgdXNlZCB0byBiaW5kIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzICovXG5jb25zdCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMgPVxuICAgIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe3Bhc3NpdmU6IHRydWV9KSBhcyBFdmVudExpc3RlbmVyT3B0aW9ucztcblxuLyoqXG4gKiBUaGUgZGlyZWN0aW9ucyB0aGF0IHNjcm9sbGluZyBjYW4gZ28gaW4gd2hlbiB0aGUgaGVhZGVyJ3MgdGFicyBleGNlZWQgdGhlIGhlYWRlciB3aWR0aC4gJ0FmdGVyJ1xuICogd2lsbCBzY3JvbGwgdGhlIGhlYWRlciB0b3dhcmRzIHRoZSBlbmQgb2YgdGhlIHRhYnMgbGlzdCBhbmQgJ2JlZm9yZScgd2lsbCBzY3JvbGwgdG93YXJkcyB0aGVcbiAqIGJlZ2lubmluZyBvZiB0aGUgbGlzdC5cbiAqL1xuZXhwb3J0IHR5cGUgU2Nyb2xsRGlyZWN0aW9uID0gJ2FmdGVyJyB8ICdiZWZvcmUnO1xuXG4vKipcbiAqIFRoZSBkaXN0YW5jZSBpbiBwaXhlbHMgdGhhdCB3aWxsIGJlIG92ZXJzaG90IHdoZW4gc2Nyb2xsaW5nIGEgdGFiIGxhYmVsIGludG8gdmlldy4gVGhpcyBoZWxwc1xuICogcHJvdmlkZSBhIHNtYWxsIGFmZm9yZGFuY2UgdG8gdGhlIGxhYmVsIG5leHQgdG8gaXQuXG4gKi9cbmNvbnN0IEVYQUdHRVJBVEVEX09WRVJTQ1JPTEwgPSA2MDtcblxuLyoqXG4gKiBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIHN0YXJ0aW5nIHRvIHNjcm9sbCB0aGUgaGVhZGVyIGF1dG9tYXRpY2FsbHkuXG4gKiBTZXQgYSBsaXR0bGUgY29uc2VydmF0aXZlbHkgaW4gb3JkZXIgdG8gaGFuZGxlIGZha2UgZXZlbnRzIGRpc3BhdGNoZWQgb24gdG91Y2ggZGV2aWNlcy5cbiAqL1xuY29uc3QgSEVBREVSX1NDUk9MTF9ERUxBWSA9IDY1MDtcblxuLyoqXG4gKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMgYXQgd2hpY2ggdG8gc2Nyb2xsIHRoZSBoZWFkZXJcbiAqIHdoaWxlIHRoZSB1c2VyIGlzIGhvbGRpbmcgdGhlaXIgcG9pbnRlci5cbiAqL1xuY29uc3QgSEVBREVSX1NDUk9MTF9JTlRFUlZBTCA9IDEwMDtcblxuLyoqIEl0ZW0gaW5zaWRlIGEgcGFnaW5hdGVkIHRhYiBoZWFkZXIuICovXG5leHBvcnQgdHlwZSBNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtID0gRm9jdXNhYmxlT3B0aW9uICYge2VsZW1lbnRSZWY6IEVsZW1lbnRSZWZ9O1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGEgdGFiIGhlYWRlciB0aGF0IHN1cHBvcnRlZCBwYWdpbmF0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRQYWdpbmF0ZWRUYWJIZWFkZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBhYnN0cmFjdCBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtPjtcbiAgYWJzdHJhY3QgX2lua0Jhcjoge2hpZGU6ICgpID0+IHZvaWQsIGFsaWduVG9FbGVtZW50OiAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWR9O1xuICBhYnN0cmFjdCBfdGFiTGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIGFic3RyYWN0IF90YWJMaXN0OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX25leHRQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgdGhlIHRhYiBsYWJlbHMgc2hvdWxkIGJlIHRyYW5zbGF0ZWQgdG8gdGhlIGxlZnQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlID0gMDtcblxuICAvKiogV2hldGhlciB0aGUgaGVhZGVyIHNob3VsZCBzY3JvbGwgdG8gdGhlIHNlbGVjdGVkIGluZGV4IGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gZmFsc2U7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbHMgZm9yIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc3BsYXllZCAqL1xuICBfc2hvd1BhZ2luYXRpb25Db250cm9scyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGlzdCBjYW4gYmUgc2Nyb2xsZWQgbW9yZSB0b3dhcmRzIHRoZSBlbmQgb2YgdGhlIHRhYiBsYWJlbCBsaXN0LiAqL1xuICBfZGlzYWJsZVNjcm9sbEFmdGVyID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGxpc3QgY2FuIGJlIHNjcm9sbGVkIG1vcmUgdG93YXJkcyB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWIgbGFiZWwgbGlzdC4gKi9cbiAgX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHRhYiBsYWJlbHMgdGhhdCBhcmUgZGlzcGxheWVkIG9uIHRoZSBoZWFkZXIuIFdoZW4gdGhpcyBjaGFuZ2VzLCB0aGUgaGVhZGVyXG4gICAqIHNob3VsZCByZS1ldmFsdWF0ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfdGFiTGFiZWxDb3VudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGNoYW5nZWQgYW5kIHNob3VsZCBiZSBhcHBsaWVkIGFmdGVyIHRoZSB2aWV3IGlzIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlQ2hhbmdlZDogYm9vbGVhbjtcblxuICAvKiogVXNlZCB0byBtYW5hZ2UgZm9jdXMgYmV0d2VlbiB0aGUgdGFicy4gKi9cbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuXG4gIC8qKiBDYWNoZWQgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIuICovXG4gIHByaXZhdGUgX2N1cnJlbnRUZXh0Q29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCB3aWxsIHN0b3AgdGhlIGF1dG9tYXRlZCBzY3JvbGxpbmcuICovXG4gIHByaXZhdGUgX3N0b3BTY3JvbGxpbmcgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc2FibGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF2b2lkIHVubmVjZXNzYXJ5XG4gICAqIGxheW91dCByZWNhbGN1bGF0aW9ucyBpZiBpdCdzIGtub3duIHRoYXQgcGFnaW5hdGlvbiB3b24ndCBiZSByZXF1aXJlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGRpc2FibGVQYWdpbmF0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBpbmRleCBvZiB0aGUgYWN0aXZlIHRhYi4gKi9cbiAgZ2V0IHNlbGVjdGVkSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkSW5kZXg7IH1cbiAgc2V0IHNlbGVjdGVkSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXggPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIHJlYWRvbmx5IHNlbGVjdEZvY3VzZWRJbmRleDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIGEgbGFiZWwgaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgaW5kZXhGb2N1c2VkOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF92aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEBkZXByZWNhdGVkIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgYF9wbGF0Zm9ybWAgYW5kIGBfYW5pbWF0aW9uTW9kZWBcbiAgICAgICAgICAgICAgICogcGFyYW1ldGVycyB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBwcml2YXRlIF9wbGF0Zm9ybT86IFBsYXRmb3JtLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG5cbiAgICAvLyBCaW5kIHRoZSBgbW91c2VsZWF2ZWAgZXZlbnQgb24gdGhlIG91dHNpZGUgc2luY2UgaXQgZG9lc24ndCBjaGFuZ2UgYW55dGhpbmcgaW4gdGhlIHZpZXcuXG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmcm9tRXZlbnQoX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ21vdXNlbGVhdmUnKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc3RvcEludGVydmFsKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBzZWxlY3RlZCBhbiBpdGVtIHZpYSB0aGUga2V5Ym9hcmQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaXRlbVNlbGVjdGVkKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZDtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBoYW5kbGUgdGhlc2UgZXZlbnRzIG1hbnVhbGx5LCBiZWNhdXNlIHdlIHdhbnQgdG8gYmluZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy5cbiAgICBmcm9tRXZlbnQodGhpcy5fcHJldmlvdXNQYWdpbmF0b3IubmF0aXZlRWxlbWVudCwgJ3RvdWNoc3RhcnQnLCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYmVmb3JlJyk7XG4gICAgICB9KTtcblxuICAgIGZyb21FdmVudCh0aGlzLl9uZXh0UGFnaW5hdG9yLm5hdGl2ZUVsZW1lbnQsICd0b3VjaHN0YXJ0JywgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5faGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2FmdGVyJyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBjb25zdCBkaXJDaGFuZ2UgPSB0aGlzLl9kaXIgPyB0aGlzLl9kaXIuY2hhbmdlIDogb2JzZXJ2YWJsZU9mKG51bGwpO1xuICAgIGNvbnN0IHJlc2l6ZSA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuY2hhbmdlKDE1MCk7XG4gICAgY29uc3QgcmVhbGlnbiA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgdGhpcy5fYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiKCk7XG4gICAgfTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyPE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+KHRoaXMuX2l0ZW1zKVxuICAgICAgLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkpXG4gICAgICAud2l0aFdyYXAoKTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbSgwKTtcblxuICAgIC8vIERlZmVyIHRoZSBmaXJzdCBjYWxsIGluIG9yZGVyIHRvIGFsbG93IGZvciBzbG93ZXIgYnJvd3NlcnMgdG8gbGF5IG91dCB0aGUgZWxlbWVudHMuXG4gICAgLy8gVGhpcyBoZWxwcyBpbiBjYXNlcyB3aGVyZSB0aGUgdXNlciBsYW5kcyBkaXJlY3RseSBvbiBhIHBhZ2Ugd2l0aCBwYWdpbmF0ZWQgdGFicy5cbiAgICB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJyA/IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWFsaWduKSA6IHJlYWxpZ24oKTtcblxuICAgIC8vIE9uIGRpciBjaGFuZ2Ugb3Igd2luZG93IHJlc2l6ZSwgcmVhbGlnbiB0aGUgaW5rIGJhciBhbmQgdXBkYXRlIHRoZSBvcmllbnRhdGlvbiBvZlxuICAgIC8vIHRoZSBrZXkgbWFuYWdlciBpZiB0aGUgZGlyZWN0aW9uIGhhcyBjaGFuZ2VkLlxuICAgIG1lcmdlKGRpckNoYW5nZSwgcmVzaXplLCB0aGlzLl9pdGVtcy5jaGFuZ2VzKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gV2UgbmVlZCB0byBkZWZlciB0aGlzIHRvIGdpdmUgdGhlIGJyb3dzZXIgc29tZSB0aW1lIHRvIHJlY2FsY3VsYXRlIHRoZSBlbGVtZW50IGRpbWVuc2lvbnMuXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKHJlYWxpZ24pO1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2dldExheW91dERpcmVjdGlvbigpKTtcbiAgICB9KTtcblxuICAgIC8vIElmIHRoZXJlIGlzIGEgY2hhbmdlIGluIHRoZSBmb2N1cyBrZXkgbWFuYWdlciB3ZSBuZWVkIHRvIGVtaXQgdGhlIGBpbmRleEZvY3VzZWRgXG4gICAgLy8gZXZlbnQgaW4gb3JkZXIgdG8gcHJvdmlkZSBhIHB1YmxpYyBldmVudCB0aGF0IG5vdGlmaWVzIGFib3V0IGZvY3VzIGNoYW5nZXMuIEFsc28gd2UgcmVhbGlnblxuICAgIC8vIHRoZSB0YWJzIGNvbnRhaW5lciBieSBzY3JvbGxpbmcgdGhlIG5ldyBmb2N1c2VkIHRhYiBpbnRvIHRoZSB2aXNpYmxlIHNlY3Rpb24uXG4gICAgdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG5ld0ZvY3VzSW5kZXggPT4ge1xuICAgICAgdGhpcy5pbmRleEZvY3VzZWQuZW1pdChuZXdGb2N1c0luZGV4KTtcbiAgICAgIHRoaXMuX3NldFRhYkZvY3VzKG5ld0ZvY3VzSW5kZXgpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQge1xuICAgIC8vIElmIHRoZSBudW1iZXIgb2YgdGFiIGxhYmVscyBoYXZlIGNoYW5nZWQsIGNoZWNrIGlmIHNjcm9sbGluZyBzaG91bGQgYmUgZW5hYmxlZFxuICAgIGlmICh0aGlzLl90YWJMYWJlbENvdW50ICE9IHRoaXMuX2l0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICB0aGlzLl90YWJMYWJlbENvdW50ID0gdGhpcy5faXRlbXMubGVuZ3RoO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHNlbGVjdGVkIGluZGV4IGhhcyBjaGFuZ2VkLCBzY3JvbGwgdG8gdGhlIGxhYmVsIGFuZCBjaGVjayBpZiB0aGUgc2Nyb2xsaW5nIGNvbnRyb2xzXG4gICAgLy8gc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4Q2hhbmdlZCkge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9MYWJlbCh0aGlzLl9zZWxlY3RlZEluZGV4KTtcbiAgICAgIHRoaXMuX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKTtcbiAgICAgIHRoaXMuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleENoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGJlZW4gY2hhbmdlZCAodGFiIHNlbGVjdGVkLCBmb2N1c2VkLCBzY3JvbGwgY29udHJvbHMgYWN0aXZhdGVkKSxcbiAgICAvLyB0aGVuIHRyYW5zbGF0ZSB0aGUgaGVhZGVyIHRvIHJlZmxlY3QgdGhpcy5cbiAgICBpZiAodGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl91cGRhdGVUYWJTY3JvbGxQb3NpdGlvbigpO1xuICAgICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX3N0b3BTY3JvbGxpbmcuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBvbiB0aGUgaGVhZGVyLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIFdlIGRvbid0IGhhbmRsZSBhbnkga2V5IGJpbmRpbmdzIHdpdGggYSBtb2RpZmllciBrZXkuXG4gICAgaWYgKGhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICAgIGlmICh0aGlzLmZvY3VzSW5kZXggIT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0Rm9jdXNlZEluZGV4LmVtaXQodGhpcy5mb2N1c0luZGV4KTtcbiAgICAgICAgICB0aGlzLl9pdGVtU2VsZWN0ZWQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgTXV0YXRpb25PYnNlcnZlciBkZXRlY3RzIHRoYXQgdGhlIGNvbnRlbnQgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBfb25Db250ZW50Q2hhbmdlcygpIHtcbiAgICBjb25zdCB0ZXh0Q29udGVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudDtcblxuICAgIC8vIFdlIG5lZWQgdG8gZGlmZiB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIsIGJlY2F1c2UgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgY2FsbGJhY2tcbiAgICAvLyB3aWxsIGZpcmUgZXZlbiBpZiB0aGUgdGV4dCBjb250ZW50IGRpZG4ndCBjaGFuZ2Ugd2hpY2ggaXMgaW5lZmZpY2llbnQgYW5kIGlzIHByb25lXG4gICAgLy8gdG8gaW5maW5pdGUgbG9vcHMgaWYgYSBwb29ybHkgY29uc3RydWN0ZWQgZXhwcmVzc2lvbiBpcyBwYXNzZWQgaW4gKHNlZSAjMTQyNDkpLlxuICAgIGlmICh0ZXh0Q29udGVudCAhPT0gdGhpcy5fY3VycmVudFRleHRDb250ZW50KSB7XG4gICAgICB0aGlzLl9jdXJyZW50VGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudCB8fCAnJztcblxuICAgICAgLy8gVGhlIGNvbnRlbnQgb2JzZXJ2ZXIgcnVucyBvdXRzaWRlIHRoZSBgTmdab25lYCBieSBkZWZhdWx0LCB3aGljaFxuICAgICAgLy8gbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIGJyaW5nIHRoZSBjYWxsYmFjayBiYWNrIGluIG91cnNlbHZlcy5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy5fYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiKCk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZpZXcgd2hldGhlciBwYWdpbmF0aW9uIHNob3VsZCBiZSBlbmFibGVkIG9yIG5vdC5cbiAgICpcbiAgICogV0FSTklORzogQ2FsbGluZyB0aGlzIG1ldGhvZCBjYW4gYmUgdmVyeSBjb3N0bHkgaW4gdGVybXMgb2YgcGVyZm9ybWFuY2UuIEl0IHNob3VsZCBiZSBjYWxsZWRcbiAgICogYXMgaW5mcmVxdWVudGx5IGFzIHBvc3NpYmxlIGZyb20gb3V0c2lkZSBvZiB0aGUgVGFicyBjb21wb25lbnQgYXMgaXQgY2F1c2VzIGEgcmVmbG93IG9mIHRoZVxuICAgKiBwYWdlLlxuICAgKi9cbiAgdXBkYXRlUGFnaW5hdGlvbigpIHtcbiAgICB0aGlzLl9jaGVja1BhZ2luYXRpb25FbmFibGVkKCk7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxpbmdDb250cm9scygpO1xuICAgIHRoaXMuX3VwZGF0ZVRhYlNjcm9sbFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKiogVHJhY2tzIHdoaWNoIGVsZW1lbnQgaGFzIGZvY3VzOyB1c2VkIGZvciBrZXlib2FyZCBuYXZpZ2F0aW9uICovXG4gIGdldCBmb2N1c0luZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2tleU1hbmFnZXIgPyB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCEgOiAwO1xuICB9XG5cbiAgLyoqIFdoZW4gdGhlIGZvY3VzIGluZGV4IGlzIHNldCwgd2UgbXVzdCBtYW51YWxseSBzZW5kIGZvY3VzIHRvIHRoZSBjb3JyZWN0IGxhYmVsICovXG4gIHNldCBmb2N1c0luZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuX2lzVmFsaWRJbmRleCh2YWx1ZSkgfHwgdGhpcy5mb2N1c0luZGV4ID09PSB2YWx1ZSB8fCAhdGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBhbiBpbmRleCBpcyB2YWxpZC4gIElmIHRoZSB0YWJzIGFyZSBub3QgcmVhZHkgeWV0LCB3ZSBhc3N1bWUgdGhhdCB0aGUgdXNlciBpc1xuICAgKiBwcm92aWRpbmcgYSB2YWxpZCBpbmRleCBhbmQgcmV0dXJuIHRydWUuXG4gICAqL1xuICBfaXNWYWxpZEluZGV4KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuX2l0ZW1zKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICBjb25zdCB0YWIgPSB0aGlzLl9pdGVtcyA/IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVtpbmRleF0gOiBudWxsO1xuICAgIHJldHVybiAhIXRhYiAmJiAhdGFiLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9jdXMgb24gdGhlIEhUTUwgZWxlbWVudCBmb3IgdGhlIGxhYmVsIHdyYXBwZXIgYW5kIHNjcm9sbHMgaXQgaW50byB0aGUgdmlldyBpZlxuICAgKiBzY3JvbGxpbmcgaXMgZW5hYmxlZC5cbiAgICovXG4gIF9zZXRUYWJGb2N1cyh0YWJJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvTGFiZWwodGFiSW5kZXgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pdGVtcyAmJiB0aGlzLl9pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVt0YWJJbmRleF0uZm9jdXMoKTtcblxuICAgICAgLy8gRG8gbm90IGxldCB0aGUgYnJvd3NlciBtYW5hZ2Ugc2Nyb2xsaW5nIHRvIGZvY3VzIHRoZSBlbGVtZW50LCB0aGlzIHdpbGwgYmUgaGFuZGxlZFxuICAgICAgLy8gYnkgdXNpbmcgdHJhbnNsYXRpb24uIEluIExUUiwgdGhlIHNjcm9sbCBsZWZ0IHNob3VsZCBiZSAwLiBJbiBSVEwsIHRoZSBzY3JvbGwgd2lkdGhcbiAgICAgIC8vIHNob3VsZCBiZSB0aGUgZnVsbCB3aWR0aCBtaW51cyB0aGUgb2Zmc2V0IHdpZHRoLlxuICAgICAgY29uc3QgY29udGFpbmVyRWwgPSB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBkaXIgPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKTtcblxuICAgICAgaWYgKGRpciA9PSAnbHRyJykge1xuICAgICAgICBjb250YWluZXJFbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRhaW5lckVsLnNjcm9sbExlZnQgPSBjb250YWluZXJFbC5zY3JvbGxXaWR0aCAtIGNvbnRhaW5lckVsLm9mZnNldFdpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgbGF5b3V0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIF9nZXRMYXlvdXREaXJlY3Rpb24oKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIFBlcmZvcm1zIHRoZSBDU1MgdHJhbnNmb3JtYXRpb24gb24gdGhlIHRhYiBsaXN0IHRoYXQgd2lsbCBjYXVzZSB0aGUgbGlzdCB0byBzY3JvbGwuICovXG4gIF91cGRhdGVUYWJTY3JvbGxQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUGFnaW5hdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcm9sbERpc3RhbmNlID0gdGhpcy5zY3JvbGxEaXN0YW5jZTtcbiAgICBjb25zdCBwbGF0Zm9ybSA9IHRoaXMuX3BsYXRmb3JtO1xuICAgIGNvbnN0IHRyYW5zbGF0ZVggPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PT0gJ2x0cicgPyAtc2Nyb2xsRGlzdGFuY2UgOiBzY3JvbGxEaXN0YW5jZTtcblxuICAgIC8vIERvbid0IHVzZSBgdHJhbnNsYXRlM2RgIGhlcmUgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIGNyZWF0ZSBhIG5ldyBsYXllci4gQSBuZXcgbGF5ZXJcbiAgICAvLyBzZWVtcyB0byBjYXVzZSBmbGlja2VyaW5nIGFuZCBvdmVyZmxvdyBpbiBJbnRlcm5ldCBFeHBsb3Jlci4gRm9yIGV4YW1wbGUsIHRoZSBpbmsgYmFyXG4gICAgLy8gYW5kIHJpcHBsZXMgd2lsbCBleGNlZWQgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHZpc2libGUgdGFiIGJhci5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzEwMjc2XG4gICAgLy8gV2Ugcm91bmQgdGhlIGB0cmFuc2Zvcm1gIGhlcmUsIGJlY2F1c2UgdHJhbnNmb3JtcyB3aXRoIHN1Yi1waXhlbCBwcmVjaXNpb24gY2F1c2Ugc29tZVxuICAgIC8vIGJyb3dzZXJzIHRvIGJsdXIgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQuXG4gICAgdGhpcy5fdGFiTGlzdC5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7TWF0aC5yb3VuZCh0cmFuc2xhdGVYKX1weClgO1xuXG4gICAgLy8gU2V0dGluZyB0aGUgYHRyYW5zZm9ybWAgb24gSUUgd2lsbCBjaGFuZ2UgdGhlIHNjcm9sbCBvZmZzZXQgb2YgdGhlIHBhcmVudCwgY2F1c2luZyB0aGVcbiAgICAvLyBwb3NpdGlvbiB0byBiZSB0aHJvd24gb2ZmIGluIHNvbWUgY2FzZXMuIFdlIGhhdmUgdG8gcmVzZXQgaXQgb3Vyc2VsdmVzIHRvIGVuc3VyZSB0aGF0XG4gICAgLy8gaXQgZG9lc24ndCBnZXQgdGhyb3duIG9mZi4gTm90ZSB0aGF0IHdlIHNjb3BlIGl0IG9ubHkgdG8gSUUgYW5kIEVkZ2UsIGJlY2F1c2UgbWVzc2luZ1xuICAgIC8vIHdpdGggdGhlIHNjcm9sbCBwb3NpdGlvbiB0aHJvd3Mgb2ZmIENocm9tZSA3MSsgaW4gUlRMIG1vZGUgKHNlZSAjMTQ2ODkpLlxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBwbGF0Zm9ybWAgYWZ0ZXIgaXQgY2FuIG5vIGxvbmdlciBiZSB1bmRlZmluZWQuXG4gICAgaWYgKHBsYXRmb3JtICYmIChwbGF0Zm9ybS5UUklERU5UIHx8IHBsYXRmb3JtLkVER0UpKSB7XG4gICAgICB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGRpc3RhbmNlIGluIHBpeGVscyB0aGF0IHRoZSB0YWIgaGVhZGVyIHNob3VsZCBiZSB0cmFuc2Zvcm1lZCBpbiB0aGUgWC1heGlzLiAqL1xuICBnZXQgc2Nyb2xsRGlzdGFuY2UoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Njcm9sbERpc3RhbmNlOyB9XG4gIHNldCBzY3JvbGxEaXN0YW5jZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fc2Nyb2xsVG8odmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSB0YWIgbGlzdCBpbiB0aGUgJ2JlZm9yZScgb3IgJ2FmdGVyJyBkaXJlY3Rpb24gKHRvd2FyZHMgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGlzdCBvclxuICAgKiB0aGUgZW5kIG9mIHRoZSBsaXN0LCByZXNwZWN0aXZlbHkpLiBUaGUgZGlzdGFuY2UgdG8gc2Nyb2xsIGlzIGNvbXB1dGVkIHRvIGJlIGEgdGhpcmQgb2YgdGhlXG4gICAqIGxlbmd0aCBvZiB0aGUgdGFiIGxpc3QgdmlldyB3aW5kb3cuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfc2Nyb2xsSGVhZGVyKGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uKSB7XG4gICAgY29uc3Qgdmlld0xlbmd0aCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcblxuICAgIC8vIE1vdmUgdGhlIHNjcm9sbCBkaXN0YW5jZSBvbmUtdGhpcmQgdGhlIGxlbmd0aCBvZiB0aGUgdGFiIGxpc3QncyB2aWV3cG9ydC5cbiAgICBjb25zdCBzY3JvbGxBbW91bnQgPSAoZGlyZWN0aW9uID09ICdiZWZvcmUnID8gLTEgOiAxKSAqIHZpZXdMZW5ndGggLyAzO1xuXG4gICAgcmV0dXJuIHRoaXMuX3Njcm9sbFRvKHRoaXMuX3Njcm9sbERpc3RhbmNlICsgc2Nyb2xsQW1vdW50KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgcGFnaW5hdGlvbiBhcnJvd3MuICovXG4gIF9oYW5kbGVQYWdpbmF0b3JDbGljayhkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbikge1xuICAgIHRoaXMuX3N0b3BJbnRlcnZhbCgpO1xuICAgIHRoaXMuX3Njcm9sbEhlYWRlcihkaXJlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSB0YWIgbGlzdCBzdWNoIHRoYXQgdGhlIGRlc2lyZWQgdGFiIGxhYmVsIChtYXJrZWQgYnkgaW5kZXgpIGlzIG1vdmVkIGludG8gdmlldy5cbiAgICpcbiAgICogVGhpcyBpcyBhbiBleHBlbnNpdmUgY2FsbCB0aGF0IGZvcmNlcyBhIGxheW91dCByZWZsb3cgdG8gY29tcHV0ZSBib3ggYW5kIHNjcm9sbCBtZXRyaWNzIGFuZFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIHNwYXJpbmdseS5cbiAgICovXG4gIF9zY3JvbGxUb0xhYmVsKGxhYmVsSW5kZXg6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmRpc2FibGVQYWdpbmF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IHRoaXMuX2l0ZW1zID8gdGhpcy5faXRlbXMudG9BcnJheSgpW2xhYmVsSW5kZXhdIDogbnVsbDtcblxuICAgIGlmICghc2VsZWN0ZWRMYWJlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSB2aWV3IGxlbmd0aCBpcyB0aGUgdmlzaWJsZSB3aWR0aCBvZiB0aGUgdGFiIGxhYmVscy5cbiAgICBjb25zdCB2aWV3TGVuZ3RoID0gdGhpcy5fdGFiTGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IHtvZmZzZXRMZWZ0LCBvZmZzZXRXaWR0aH0gPSBzZWxlY3RlZExhYmVsLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGxldCBsYWJlbEJlZm9yZVBvczogbnVtYmVyLCBsYWJlbEFmdGVyUG9zOiBudW1iZXI7XG4gICAgaWYgKHRoaXMuX2dldExheW91dERpcmVjdGlvbigpID09ICdsdHInKSB7XG4gICAgICBsYWJlbEJlZm9yZVBvcyA9IG9mZnNldExlZnQ7XG4gICAgICBsYWJlbEFmdGVyUG9zID0gbGFiZWxCZWZvcmVQb3MgKyBvZmZzZXRXaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFiZWxBZnRlclBvcyA9IHRoaXMuX3RhYkxpc3QubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCAtIG9mZnNldExlZnQ7XG4gICAgICBsYWJlbEJlZm9yZVBvcyA9IGxhYmVsQWZ0ZXJQb3MgLSBvZmZzZXRXaWR0aDtcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmVWaXNpYmxlUG9zID0gdGhpcy5zY3JvbGxEaXN0YW5jZTtcbiAgICBjb25zdCBhZnRlclZpc2libGVQb3MgPSB0aGlzLnNjcm9sbERpc3RhbmNlICsgdmlld0xlbmd0aDtcblxuICAgIGlmIChsYWJlbEJlZm9yZVBvcyA8IGJlZm9yZVZpc2libGVQb3MpIHtcbiAgICAgIC8vIFNjcm9sbCBoZWFkZXIgdG8gbW92ZSBsYWJlbCB0byB0aGUgYmVmb3JlIGRpcmVjdGlvblxuICAgICAgdGhpcy5zY3JvbGxEaXN0YW5jZSAtPSBiZWZvcmVWaXNpYmxlUG9zIC0gbGFiZWxCZWZvcmVQb3MgKyBFWEFHR0VSQVRFRF9PVkVSU0NST0xMO1xuICAgIH0gZWxzZSBpZiAobGFiZWxBZnRlclBvcyA+IGFmdGVyVmlzaWJsZVBvcykge1xuICAgICAgLy8gU2Nyb2xsIGhlYWRlciB0byBtb3ZlIGxhYmVsIHRvIHRoZSBhZnRlciBkaXJlY3Rpb25cbiAgICAgIHRoaXMuc2Nyb2xsRGlzdGFuY2UgKz0gbGFiZWxBZnRlclBvcyAtIGFmdGVyVmlzaWJsZVBvcyArIEVYQUdHRVJBVEVEX09WRVJTQ1JPTEw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIHdoZXRoZXIgdGhlIHBhZ2luYXRpb24gY29udHJvbHMgc2hvdWxkIGJlIGRpc3BsYXllZC4gSWYgdGhlIHNjcm9sbCB3aWR0aCBvZiB0aGVcbiAgICogdGFiIGxpc3QgaXMgd2lkZXIgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgaGVhZGVyIGNvbnRhaW5lciwgdGhlbiB0aGUgcGFnaW5hdGlvbiBjb250cm9scyBzaG91bGRcbiAgICogYmUgc2hvd24uXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfY2hlY2tQYWdpbmF0aW9uRW5hYmxlZCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUGFnaW5hdGlvbikge1xuICAgICAgdGhpcy5fc2hvd1BhZ2luYXRpb25Db250cm9scyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpc0VuYWJsZWQgPVxuICAgICAgICAgIHRoaXMuX3RhYkxpc3QubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aCA+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcblxuICAgICAgaWYgKCFpc0VuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxEaXN0YW5jZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0VuYWJsZWQgIT09IHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMpIHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMgPSBpc0VuYWJsZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIHdoZXRoZXIgdGhlIGJlZm9yZSBhbmQgYWZ0ZXIgY29udHJvbHMgc2hvdWxkIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWQuXG4gICAqIElmIHRoZSBoZWFkZXIgaXMgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGlzdCAoc2Nyb2xsIGRpc3RhbmNlIGlzIGVxdWFsIHRvIDApIHRoZW4gZGlzYWJsZSB0aGVcbiAgICogYmVmb3JlIGJ1dHRvbi4gSWYgdGhlIGhlYWRlciBpcyBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0IChzY3JvbGwgZGlzdGFuY2UgaXMgZXF1YWwgdG8gdGhlXG4gICAqIG1heGltdW0gZGlzdGFuY2Ugd2UgY2FuIHNjcm9sbCksIHRoZW4gZGlzYWJsZSB0aGUgYWZ0ZXIgYnV0dG9uLlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVTY3JvbGxBZnRlciA9IHRoaXMuX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcGFnaW5hdGlvbiBhcnJvd3Mgc2hvdWxkIGJlIGFjdGl2YXRlZC5cbiAgICAgIHRoaXMuX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0aGlzLnNjcm9sbERpc3RhbmNlID09IDA7XG4gICAgICB0aGlzLl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgPSB0aGlzLnNjcm9sbERpc3RhbmNlID09IHRoaXMuX2dldE1heFNjcm9sbERpc3RhbmNlKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGF0IGlzIHRoZSBtYXhpbXVtIGxlbmd0aCBpbiBwaXhlbHMgdGhhdCBjYW4gYmUgc2V0IGZvciB0aGUgc2Nyb2xsIGRpc3RhbmNlLiBUaGlzXG4gICAqIGlzIGVxdWFsIHRvIHRoZSBkaWZmZXJlbmNlIGluIHdpZHRoIGJldHdlZW4gdGhlIHRhYiBsaXN0IGNvbnRhaW5lciBhbmQgdGFiIGhlYWRlciBjb250YWluZXIuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfZ2V0TWF4U2Nyb2xsRGlzdGFuY2UoKTogbnVtYmVyIHtcbiAgICBjb25zdCBsZW5ndGhPZlRhYkxpc3QgPSB0aGlzLl90YWJMaXN0Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGg7XG4gICAgY29uc3Qgdmlld0xlbmd0aCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gKGxlbmd0aE9mVGFiTGlzdCAtIHZpZXdMZW5ndGgpIHx8IDA7XG4gIH1cblxuICAvKiogVGVsbHMgdGhlIGluay1iYXIgdG8gYWxpZ24gaXRzZWxmIHRvIHRoZSBjdXJyZW50IGxhYmVsIHdyYXBwZXIgKi9cbiAgX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLl9pdGVtcyAmJiB0aGlzLl9pdGVtcy5sZW5ndGggP1xuICAgICAgICB0aGlzLl9pdGVtcy50b0FycmF5KClbdGhpcy5zZWxlY3RlZEluZGV4XSA6IG51bGw7XG4gICAgY29uc3Qgc2VsZWN0ZWRMYWJlbFdyYXBwZXIgPSBzZWxlY3RlZEl0ZW0gPyBzZWxlY3RlZEl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgIGlmIChzZWxlY3RlZExhYmVsV3JhcHBlcikge1xuICAgICAgdGhpcy5faW5rQmFyLmFsaWduVG9FbGVtZW50KHNlbGVjdGVkTGFiZWxXcmFwcGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5rQmFyLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3RvcHMgdGhlIGN1cnJlbnRseS1ydW5uaW5nIHBhZ2luYXRvciBpbnRlcnZhbC4gICovXG4gIF9zdG9wSW50ZXJ2YWwoKSB7XG4gICAgdGhpcy5fc3RvcFNjcm9sbGluZy5uZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgdXNlciBwcmVzc2luZyBkb3duIG9uIG9uZSBvZiB0aGUgcGFnaW5hdG9ycy5cbiAgICogU3RhcnRzIHNjcm9sbGluZyB0aGUgaGVhZGVyIGFmdGVyIGEgY2VydGFpbiBhbW91bnQgb2YgdGltZS5cbiAgICogQHBhcmFtIGRpcmVjdGlvbiBJbiB3aGljaCBkaXJlY3Rpb24gdGhlIHBhZ2luYXRvciBzaG91bGQgYmUgc2Nyb2xsZWQuXG4gICAqL1xuICBfaGFuZGxlUGFnaW5hdG9yUHJlc3MoZGlyZWN0aW9uOiBTY3JvbGxEaXJlY3Rpb24sIG1vdXNlRXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gRG9uJ3Qgc3RhcnQgYXV0byBzY3JvbGxpbmcgZm9yIHJpZ2h0IG1vdXNlIGJ1dHRvbiBjbGlja3MuIE5vdGUgdGhhdCB3ZSBzaG91bGRuJ3QgaGF2ZSB0b1xuICAgIC8vIG51bGwgY2hlY2sgdGhlIGBidXR0b25gLCBidXQgd2UgZG8gaXQgc28gd2UgZG9uJ3QgYnJlYWsgdGVzdHMgdGhhdCB1c2UgZmFrZSBldmVudHMuXG4gICAgaWYgKG1vdXNlRXZlbnQgJiYgbW91c2VFdmVudC5idXR0b24gIT0gbnVsbCAmJiBtb3VzZUV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEF2b2lkIG92ZXJsYXBwaW5nIHRpbWVycy5cbiAgICB0aGlzLl9zdG9wSW50ZXJ2YWwoKTtcblxuICAgIC8vIFN0YXJ0IGEgdGltZXIgYWZ0ZXIgdGhlIGRlbGF5IGFuZCBrZWVwIGZpcmluZyBiYXNlZCBvbiB0aGUgaW50ZXJ2YWwuXG4gICAgdGltZXIoSEVBREVSX1NDUk9MTF9ERUxBWSwgSEVBREVSX1NDUk9MTF9JTlRFUlZBTClcbiAgICAgIC8vIEtlZXAgdGhlIHRpbWVyIGdvaW5nIHVudGlsIHNvbWV0aGluZyB0ZWxscyBpdCB0byBzdG9wIG9yIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMuX3N0b3BTY3JvbGxpbmcsIHRoaXMuX2Rlc3Ryb3llZCkpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHttYXhTY3JvbGxEaXN0YW5jZSwgZGlzdGFuY2V9ID0gdGhpcy5fc2Nyb2xsSGVhZGVyKGRpcmVjdGlvbik7XG5cbiAgICAgICAgLy8gU3RvcCB0aGUgdGltZXIgaWYgd2UndmUgcmVhY2hlZCB0aGUgc3RhcnQgb3IgdGhlIGVuZC5cbiAgICAgICAgaWYgKGRpc3RhbmNlID09PSAwIHx8IGRpc3RhbmNlID49IG1heFNjcm9sbERpc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fc3RvcEludGVydmFsKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdGhlIGhlYWRlciB0byBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zaXRpb24gUG9zaXRpb24gdG8gd2hpY2ggdG8gc2Nyb2xsLlxuICAgKiBAcmV0dXJucyBJbmZvcm1hdGlvbiBvbiB0aGUgY3VycmVudCBzY3JvbGwgZGlzdGFuY2UgYW5kIHRoZSBtYXhpbXVtLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsVG8ocG9zaXRpb246IG51bWJlcikge1xuICAgIGlmICh0aGlzLmRpc2FibGVQYWdpbmF0aW9uKSB7XG4gICAgICByZXR1cm4ge21heFNjcm9sbERpc3RhbmNlOiAwLCBkaXN0YW5jZTogMH07XG4gICAgfVxuXG4gICAgY29uc3QgbWF4U2Nyb2xsRGlzdGFuY2UgPSB0aGlzLl9nZXRNYXhTY3JvbGxEaXN0YW5jZSgpO1xuICAgIHRoaXMuX3Njcm9sbERpc3RhbmNlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obWF4U2Nyb2xsRGlzdGFuY2UsIHBvc2l0aW9uKSk7XG5cbiAgICAvLyBNYXJrIHRoYXQgdGhlIHNjcm9sbCBkaXN0YW5jZSBoYXMgY2hhbmdlZCBzbyB0aGF0IGFmdGVyIHRoZSB2aWV3IGlzIGNoZWNrZWQsIHRoZSBDU1NcbiAgICAvLyB0cmFuc2Zvcm1hdGlvbiBjYW4gbW92ZSB0aGUgaGVhZGVyLlxuICAgIHRoaXMuX3Njcm9sbERpc3RhbmNlQ2hhbmdlZCA9IHRydWU7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxpbmdDb250cm9scygpO1xuXG4gICAgcmV0dXJuIHttYXhTY3JvbGxEaXN0YW5jZSwgZGlzdGFuY2U6IHRoaXMuX3Njcm9sbERpc3RhbmNlfTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RlZEluZGV4OiBOdW1iZXJJbnB1dDtcbn1cbiJdfQ==
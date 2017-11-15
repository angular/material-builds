/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/cdk/observers';
import { CdkPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import '@angular/cdk/scrolling';
import '@angular/common';
import '@angular/core';
import { MatRipple, mixinColor, mixinDisableRipple, mixinDisabled } from '@angular/material/core';
import 'rxjs/Subject';
import '@angular/animations';
import '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import { startWith } from 'rxjs/operators/startWith';
import { of } from 'rxjs/observable/of';
import '@angular/cdk/platform';
import { takeUntil } from 'rxjs/operators/takeUntil';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * \@docs-private
 */
class MatInkBar {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _ngZone
     */
    constructor(_renderer, _elementRef, _ngZone) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
    }
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * Shows the ink bar if previously set as hidden.
     * @param {?} element
     * @return {?}
     */
    alignToElement(element) {
        this.show();
        if (typeof requestAnimationFrame !== 'undefined') {
            this._ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => this._setStyles(element));
            });
        }
        else {
            this._setStyles(element);
        }
    }
    /**
     * Shows the ink bar.
     * @return {?}
     */
    show() {
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'visible');
    }
    /**
     * Hides the ink bar.
     * @return {?}
     */
    hide() {
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    }
    /**
     * Sets the proper styles to the ink bar element.
     * @param {?} element
     * @return {?}
     */
    _setStyles(element) {
        const /** @type {?} */ left = element ? (element.offsetLeft || 0) + 'px' : '0';
        const /** @type {?} */ width = element ? (element.offsetWidth || 0) + 'px' : '0';
        this._renderer.setStyle(this._elementRef.nativeElement, 'left', left);
        this._renderer.setStyle(this._elementRef.nativeElement, 'width', width);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatTabLabelBaseClass = CdkPortal;
/**
 * Used to flag tab labels for use with the portal directive
 */
class MatTabLabel extends _MatTabLabelBaseClass {
    /**
     * @param {?} templateRef
     * @param {?} viewContainerRef
     */
    constructor(templateRef, viewContainerRef) {
        super(templateRef, viewContainerRef);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatTabBase {
}
const _MatTabMixinBase = mixinDisabled(MatTabBase);
class MatTab extends _MatTabMixinBase {
    /**
     * @param {?} _viewContainerRef
     */
    constructor(_viewContainerRef) {
        super();
        this._viewContainerRef = _viewContainerRef;
    }
    /**
     * @return {?}
     */
    get content() { return this._contentPortal; }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.hasOwnProperty('textLabel')) {
            this._labelChange.next();
        }
        if (changes.hasOwnProperty('disabled')) {
            this._disableChange.next();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._disableChange.complete();
        this._labelChange.complete();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._contentPortal = new TemplatePortal(this._content, this._viewContainerRef);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatTabBodyPortalBaseClass = CdkPortalOutlet;
/**
 * The portal host directive for the contents of the tab.
 * \@docs-private
 */
class MatTabBodyPortal extends _MatTabBodyPortalBaseClass {
    /**
     * @param {?} _componentFactoryResolver
     * @param {?} _viewContainerRef
     * @param {?} _host
     */
    constructor(_componentFactoryResolver, _viewContainerRef, _host) {
        super(_componentFactoryResolver, _viewContainerRef);
        this._host = _host;
    }
    /**
     * Set initial visibility or set up subscription for changing visibility.
     * @return {?}
     */
    ngOnInit() {
        if (this._host._isCenterPosition(this._host._position)) {
            this.attach(this._host._content);
        }
        else {
            this._centeringSub = this._host._beforeCentering.subscribe(() => {
                this.attach(this._host._content);
                this._centeringSub.unsubscribe();
            });
        }
    }
    /**
     * Clean up subscription if necessary.
     * @return {?}
     */
    ngOnDestroy() {
        if (this._centeringSub && !this._centeringSub.closed) {
            this._centeringSub.unsubscribe();
        }
    }
}
/**
 * Wrapper for the contents of a tab.
 * \@docs-private
 */
class MatTabBody {
    /**
     * @param {?} _elementRef
     * @param {?} _dir
     */
    constructor(_elementRef, _dir) {
        this._elementRef = _elementRef;
        this._dir = _dir;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    set position(position) {
        if (position < 0) {
            this._position = this._getLayoutDirection() == 'ltr' ? 'left' : 'right';
        }
        else if (position > 0) {
            this._position = this._getLayoutDirection() == 'ltr' ? 'right' : 'left';
        }
        else {
            this._position = 'center';
        }
    }
    /**
     * The origin position from which this tab should appear when it is centered into view.
     * @param {?} origin
     * @return {?}
     */
    set origin(origin) {
        if (origin == null) {
            return;
        }
        const /** @type {?} */ dir = this._getLayoutDirection();
        if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
            this._origin = 'left';
        }
        else {
            this._origin = 'right';
        }
    }
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     * @return {?}
     */
    ngOnInit() {
        if (this._position == 'center' && this._origin) {
            this._position = this._origin == 'left' ? 'left-origin-center' : 'right-origin-center';
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    _onTranslateTabStarted(e) {
        if (this._isCenterPosition(e.toState)) {
            this._beforeCentering.emit();
            this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    _onTranslateTabComplete(e) {
        // If the transition to the center is complete, emit an event.
        if (this._isCenterPosition(e.toState) && this._isCenterPosition(this._position)) {
            this._onCentered.emit();
        }
    }
    /**
     * The text direction of the containing app.
     * @return {?}
     */
    _getLayoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /**
     * Whether the provided position state is considered center, regardless of origin.
     * @param {?} position
     * @return {?}
     */
    _isCenterPosition(position) {
        return position == 'center' ||
            position == 'left-origin-center' ||
            position == 'right-origin-center';
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Used to generate unique ID's for each tab component
 */
let nextId = 0;
/**
 * A simple change event emitted on focus or selection changes.
 */
class MatTabChangeEvent {
}
/**
 * \@docs-private
 */
class MatTabGroupBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MatTabGroupMixinBase = mixinColor(mixinDisableRipple(MatTabGroupBase), 'primary');
/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
class MatTabGroup extends _MatTabGroupMixinBase {
    /**
     * @param {?} _renderer
     * @param {?} elementRef
     * @param {?} _changeDetectorRef
     */
    constructor(_renderer, elementRef, _changeDetectorRef) {
        super(_renderer, elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._groupId = nextId++;
    }
    /**
     * Whether the tab group should grow to the size of the active tab.
     * @return {?}
     */
    get dynamicHeight() { return this._dynamicHeight; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dynamicHeight(value) { this._dynamicHeight = coerceBooleanProperty(value); }
    /**
     * @deprecated
     * @return {?}
     */
    get _dynamicHeightDeprecated() { return this._dynamicHeight; }
    /**
     * @param {?} value
     * @return {?}
     */
    set _dynamicHeightDeprecated(value) { this._dynamicHeight = value; }
    /**
     * The index of the active tab.
     * @param {?} value
     * @return {?}
     */
    set selectedIndex(value) {
        this._indexToSelect = coerceNumberProperty(value, null);
    }
    /**
     * @return {?}
     */
    get selectedIndex() { return this._selectedIndex; }
    /**
     * Background color of the tab group.
     * @return {?}
     */
    get backgroundColor() { return this._backgroundColor; }
    /**
     * @param {?} value
     * @return {?}
     */
    set backgroundColor(value) {
        let /** @type {?} */ nativeElement = this._elementRef.nativeElement;
        this._renderer.removeClass(nativeElement, `mat-background-${this.backgroundColor}`);
        if (value) {
            this._renderer.addClass(nativeElement, `mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     * @return {?}
     */
    ngAfterContentChecked() {
        // Clamp the next selected index to the boundsof 0 and the tabs length.
        // Note the `|| 0`, which ensures that values like NaN can't get through
        // and which would otherwise throw the component into an infinite loop
        // (since Math.max(NaN, 0) === NaN).
        let /** @type {?} */ indexToSelect = this._indexToSelect =
            Math.min(this._tabs.length - 1, Math.max(this._indexToSelect || 0, 0));
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != indexToSelect && this._selectedIndex != null) {
            const /** @type {?} */ tabChangeEvent = this._createChangeEvent(indexToSelect);
            this.selectedTabChange.emit(tabChangeEvent);
            // Emitting this value after change detection has run
            // since the checked content may contain this variable'
            Promise.resolve().then(() => this.selectedIndexChange.emit(indexToSelect));
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach((tab, index) => {
            tab.position = index - indexToSelect;
            tab.isActive = index === indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = indexToSelect - this._selectedIndex;
            }
        });
        if (this._selectedIndex !== indexToSelect) {
            this._selectedIndex = indexToSelect;
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._subscribeToTabLabels();
        // Subscribe to changes in the amount of tabs, in order to be
        // able to re-render the content as new tabs are added or removed.
        this._tabsSubscription = this._tabs.changes.subscribe(() => {
            this._subscribeToTabLabels();
            this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._tabsSubscription.unsubscribe();
        this._tabLabelSubscription.unsubscribe();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    _focusChanged(index) {
        this.focusChange.emit(this._createChangeEvent(index));
    }
    /**
     * @param {?} index
     * @return {?}
     */
    _createChangeEvent(index) {
        const /** @type {?} */ event = new MatTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    }
    /**
     * Subscribes to changes in the tab labels. This is needed, because the \@Input for the label is
     * on the MatTab component, whereas the data binding is inside the MatTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     * @return {?}
     */
    _subscribeToTabLabels() {
        if (this._tabLabelSubscription) {
            this._tabLabelSubscription.unsubscribe();
        }
        this._tabLabelSubscription = merge(...this._tabs.map(tab => tab._disableChange), ...this._tabs.map(tab => tab._labelChange)).subscribe(() => {
            this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * Returns a unique id for each tab label element
     * @param {?} i
     * @return {?}
     */
    _getTabLabelId(i) {
        return `mat-tab-label-${this._groupId}-${i}`;
    }
    /**
     * Returns a unique id for each tab content element
     * @param {?} i
     * @return {?}
     */
    _getTabContentId(i) {
        return `mat-tab-content-${this._groupId}-${i}`;
    }
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     * @param {?} tabHeight
     * @return {?}
     */
    _setTabBodyWrapperHeight(tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', this._tabBodyWrapperHeight + 'px');
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', tabHeight + 'px');
        }
    }
    /**
     * Removes the height of the tab body wrapper.
     * @return {?}
     */
    _removeTabBodyWrapperHeight() {
        this._tabBodyWrapperHeight = this._tabBodyWrapper.nativeElement.clientHeight;
        this._renderer.setStyle(this._tabBodyWrapper.nativeElement, 'height', '');
    }
    /**
     * Handle click events, setting new selected index if appropriate.
     * @param {?} tab
     * @param {?} tabHeader
     * @param {?} idx
     * @return {?}
     */
    _handleClick(tab, tabHeader, idx) {
        if (!tab.disabled) {
            this.selectedIndex = tabHeader.focusIndex = idx;
        }
    }
    /**
     * Retrieves the tabindex for the tab.
     * @param {?} tab
     * @param {?} idx
     * @return {?}
     */
    _getTabIndex(tab, idx) {
        if (tab.disabled) {
            return null;
        }
        return this.selectedIndex === idx ? 0 : -1;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatTabLabelWrapperBase {
}
const _MatTabLabelWrapperMixinBase = mixinDisabled(MatTabLabelWrapperBase);
/**
 * Used in the `mat-tab-group` view to display tab labels.
 * \@docs-private
 */
class MatTabLabelWrapper extends _MatTabLabelWrapperMixinBase {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        super();
        this.elementRef = elementRef;
    }
    /**
     * Sets focus on the wrapper element
     * @return {?}
     */
    focus() {
        this.elementRef.nativeElement.focus();
    }
    /**
     * @return {?}
     */
    getOffsetLeft() {
        return this.elementRef.nativeElement.offsetLeft;
    }
    /**
     * @return {?}
     */
    getOffsetWidth() {
        return this.elementRef.nativeElement.offsetWidth;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
const EXAGGERATED_OVERSCROLL = 60;
/**
 * \@docs-private
 */
class MatTabHeaderBase {
}
const _MatTabHeaderMixinBase = mixinDisableRipple(MatTabHeaderBase);
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * \@docs-private
 */
class MatTabHeader extends _MatTabHeaderMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _changeDetectorRef
     * @param {?} _viewportRuler
     * @param {?} _dir
     */
    constructor(_elementRef, _renderer, _changeDetectorRef, _viewportRuler, _dir) {
        super();
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._changeDetectorRef = _changeDetectorRef;
        this._viewportRuler = _viewportRuler;
        this._dir = _dir;
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
        this._selectedIndexChanged = this._selectedIndex != value;
        this._selectedIndex = value;
        this._focusIndex = value;
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // If the number of tab labels have changed, check if scrolling should be enabled
        if (this._tabLabelCount != this._labelWrappers.length) {
            this._updatePagination();
            this._tabLabelCount = this._labelWrappers.length;
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
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        switch (event.keyCode) {
            case RIGHT_ARROW:
                this._focusNextTab();
                break;
            case LEFT_ARROW:
                this._focusPreviousTab();
                break;
            case ENTER:
            case SPACE:
                this.selectFocusedIndex.emit(this.focusIndex);
                event.preventDefault();
                break;
        }
    }
    /**
     * Aligns the ink bar to the selected tab on load.
     * @return {?}
     */
    ngAfterContentInit() {
        const /** @type {?} */ dirChange = this._dir ? this._dir.change : of(null);
        const /** @type {?} */ resize = this._viewportRuler.change(150);
        this._realignInkBar = merge(dirChange, resize).pipe(startWith(null)).subscribe(() => {
            this._updatePagination();
            this._alignInkBarToSelectedTab();
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._realignInkBar.unsubscribe();
    }
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     * @return {?}
     */
    _onContentChanges() {
        this._updatePagination();
        this._alignInkBarToSelectedTab();
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Updating the view whether pagination should be enabled or not
     * @return {?}
     */
    _updatePagination() {
        this._checkPaginationEnabled();
        this._checkScrollingControls();
        this._updateTabScrollPosition();
    }
    /**
     * When the focus index is set, we must manually send focus to the correct label
     * @param {?} value
     * @return {?}
     */
    set focusIndex(value) {
        if (!this._isValidIndex(value) || this._focusIndex == value) {
            return;
        }
        this._focusIndex = value;
        this.indexFocused.emit(value);
        this._setTabFocus(value);
    }
    /**
     * Tracks which element has focus; used for keyboard navigation
     * @return {?}
     */
    get focusIndex() { return this._focusIndex; }
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     * @param {?} index
     * @return {?}
     */
    _isValidIndex(index) {
        if (!this._labelWrappers) {
            return true;
        }
        const /** @type {?} */ tab = this._labelWrappers ? this._labelWrappers.toArray()[index] : null;
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
        if (this._labelWrappers && this._labelWrappers.length) {
            this._labelWrappers.toArray()[tabIndex].focus();
            // Do not let the browser manage scrolling to focus the element, this will be handled
            // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
            // should be the full width minus the offset width.
            const /** @type {?} */ containerEl = this._tabListContainer.nativeElement;
            const /** @type {?} */ dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    }
    /**
     * Moves the focus towards the beginning or the end of the list depending on the offset provided.
     * Valid offsets are 1 and -1.
     * @param {?} offset
     * @return {?}
     */
    _moveFocus(offset) {
        if (this._labelWrappers) {
            const /** @type {?} */ tabs = this._labelWrappers.toArray();
            for (let /** @type {?} */ i = this.focusIndex + offset; i < tabs.length && i >= 0; i += offset) {
                if (this._isValidIndex(i)) {
                    this.focusIndex = i;
                    return;
                }
            }
        }
    }
    /**
     * Increment the focus index by 1 until a valid tab is found.
     * @return {?}
     */
    _focusNextTab() {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? 1 : -1);
    }
    /**
     * Decrement the focus index by 1 until a valid tab is found.
     * @return {?}
     */
    _focusPreviousTab() {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? -1 : 1);
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
        const /** @type {?} */ scrollDistance = this.scrollDistance;
        const /** @type {?} */ translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
        this._renderer.setStyle(this._tabList.nativeElement, 'transform', `translate3d(${translateX}px, 0, 0)`);
    }
    /**
     * Sets the distance in pixels that the tab header should be transformed in the X-axis.
     * @param {?} v
     * @return {?}
     */
    set scrollDistance(v) {
        this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), v));
        // Mark that the scroll distance has changed so that after the view is checked, the CSS
        // transformation can move the header.
        this._scrollDistanceChanged = true;
        this._checkScrollingControls();
    }
    /**
     * @return {?}
     */
    get scrollDistance() { return this._scrollDistance; }
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     * @param {?} scrollDir
     * @return {?}
     */
    _scrollHeader(scrollDir) {
        const /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        this.scrollDistance += (scrollDir == 'before' ? -1 : 1) * viewLength / 3;
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
        const /** @type {?} */ selectedLabel = this._labelWrappers ? this._labelWrappers.toArray()[labelIndex] : null;
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        const /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        let /** @type {?} */ labelBeforePos, /** @type {?} */ labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = selectedLabel.getOffsetLeft();
            labelAfterPos = labelBeforePos + selectedLabel.getOffsetWidth();
        }
        else {
            labelAfterPos = this._tabList.nativeElement.offsetWidth - selectedLabel.getOffsetLeft();
            labelBeforePos = labelAfterPos - selectedLabel.getOffsetWidth();
        }
        const /** @type {?} */ beforeVisiblePos = this.scrollDistance;
        const /** @type {?} */ afterVisiblePos = this.scrollDistance + viewLength;
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
        const /** @type {?} */ isEnabled = this._tabList.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
        if (!isEnabled) {
            this.scrollDistance = 0;
        }
        if (isEnabled !== this._showPaginationControls) {
            this._changeDetectorRef.markForCheck();
        }
        this._showPaginationControls = isEnabled;
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
        // Check if the pagination arrows should be activated.
        this._disableScrollBefore = this.scrollDistance == 0;
        this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
        this._changeDetectorRef.markForCheck();
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
        const /** @type {?} */ lengthOfTabList = this._tabList.nativeElement.scrollWidth;
        const /** @type {?} */ viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return (lengthOfTabList - viewLength) || 0;
    }
    /**
     * Tells the ink-bar to align itself to the current label wrapper
     * @return {?}
     */
    _alignInkBarToSelectedTab() {
        const /** @type {?} */ selectedLabelWrapper = this._labelWrappers && this._labelWrappers.length ?
            this._labelWrappers.toArray()[this.selectedIndex].elementRef.nativeElement :
            null;
        this._inkBar.alignToElement(selectedLabelWrapper);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatTabNavBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MatTabNavMixinBase = mixinDisableRipple(mixinColor(MatTabNavBase, 'primary'));
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
class MatTabNav extends _MatTabNavMixinBase {
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _dir
     * @param {?} _ngZone
     * @param {?} _changeDetectorRef
     * @param {?} _viewportRuler
     */
    constructor(renderer, elementRef, _dir, _ngZone, _changeDetectorRef, _viewportRuler) {
        super(renderer, elementRef);
        this._dir = _dir;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        this._viewportRuler = _viewportRuler;
    }
    /**
     * Background color of the tab nav.
     * @return {?}
     */
    get backgroundColor() { return this._backgroundColor; }
    /**
     * @param {?} value
     * @return {?}
     */
    set backgroundColor(value) {
        let /** @type {?} */ nativeElement = this._elementRef.nativeElement;
        this._renderer.removeClass(nativeElement, `mat-background-${this.backgroundColor}`);
        if (value) {
            this._renderer.addClass(nativeElement, `mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /**
     * Whether ripples should be disabled for all links or not.
     * @return {?}
     */
    get disableRipple() { return this._disableRipple; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
        this._setLinkDisableRipple();
    }
    /**
     * Notifies the component that the active link has been changed.
     * @param {?} element
     * @return {?}
     */
    updateActiveLink(element) {
        this._activeLinkChanged = this._activeLinkElement != element;
        this._activeLinkElement = element;
        if (this._activeLinkChanged) {
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._ngZone.runOutsideAngular(() => {
            const /** @type {?} */ dirChange = this._dir ? this._dir.change : of(null);
            return merge(dirChange, this._viewportRuler.change(10)).pipe(takeUntil(this._onDestroy))
                .subscribe(() => this._alignInkBar());
        });
        this._setLinkDisableRipple();
    }
    /**
     * Checks if the active link has been changed and, if so, will update the ink bar.
     * @return {?}
     */
    ngAfterContentChecked() {
        if (this._activeLinkChanged) {
            this._alignInkBar();
            this._activeLinkChanged = false;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    /**
     * Aligns the ink bar to the active link.
     * @return {?}
     */
    _alignInkBar() {
        if (this._activeLinkElement) {
            this._inkBar.alignToElement(this._activeLinkElement.nativeElement);
        }
    }
    /**
     * Sets the `disableRipple` property on each link of the navigation bar.
     * @return {?}
     */
    _setLinkDisableRipple() {
        if (this._tabLinks) {
            this._tabLinks.forEach(link => link.disableRipple = this.disableRipple);
        }
    }
}
class MatTabLinkBase {
}
const _MatTabLinkMixinBase = mixinDisabled(MatTabLinkBase);
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
class MatTabLink extends _MatTabLinkMixinBase {
    /**
     * @param {?} _tabNavBar
     * @param {?} _elementRef
     * @param {?} ngZone
     * @param {?} platform
     * @param {?} globalOptions
     */
    constructor(_tabNavBar, _elementRef, ngZone, platform, globalOptions) {
        super();
        this._tabNavBar = _tabNavBar;
        this._elementRef = _elementRef;
        // Manually create a ripple instance that uses the tab link element as trigger element.
        // Notice that the lifecycle hooks for the ripple config won't be called anymore.
        this._tabLinkRipple = new MatRipple(_elementRef, ngZone, platform, globalOptions);
    }
    /**
     * Whether the link is active.
     * @return {?}
     */
    get active() { return this._isActive; }
    /**
     * @param {?} value
     * @return {?}
     */
    set active(value) {
        this._isActive = value;
        if (value) {
            this._tabNavBar.updateActiveLink(this._elementRef);
        }
    }
    /**
     * Whether ripples should be disabled or not.
     * @return {?}
     */
    get disableRipple() { return this.disabled || this._disableRipple; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disableRipple(value) {
        this._disableRipple = value;
        this._tabLinkRipple.disabled = this.disableRipple;
        this._tabLinkRipple._updateRippleRenderer();
    }
    /**
     * \@docs-private
     * @return {?}
     */
    get tabIndex() {
        return this.disabled ? null : 0;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // Manually call the ngOnDestroy lifecycle hook of the ripple instance because it won't be
        // called automatically since its instance is not created by Angular.
        this._tabLinkRipple.ngOnDestroy();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatTabsModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatInkBar, MatTabBody, MatTabBodyPortal, MatTabHeader, MatTabLabelWrapper, MatTab, MatTabLabel, MatTabNav, MatTabLink, MatTabsModule, MatTabChangeEvent, MatTabGroupBase, _MatTabGroupMixinBase, MatTabGroup, MatTabBase as ɵe22, _MatTabMixinBase as ɵf22, MatTabHeaderBase as ɵa22, _MatTabHeaderMixinBase as ɵb22, MatTabLabelWrapperBase as ɵc22, _MatTabLabelWrapperMixinBase as ɵd22, MatTabLinkBase as ɵi22, MatTabNavBase as ɵg22, _MatTabLinkMixinBase as ɵj22, _MatTabNavMixinBase as ɵh22 };
//# sourceMappingURL=tabs.js.map

import { FocusTrapFactory, FocusMonitor, InteractivityChecker } from '@angular/cdk/a11y';
import { Directionality, BidiModule } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler, CdkScrollableModule } from '@angular/cdk/scrolling';
import * as i0 from '@angular/core';
import { InjectionToken, inject, ChangeDetectorRef, ElementRef, NgZone, Component, ChangeDetectionStrategy, ViewEncapsulation, Renderer2, DOCUMENT, signal, EventEmitter, Injector, afterNextRender, Input, Output, ViewChild, QueryList, ContentChildren, ContentChild, NgModule } from '@angular/core';
import { Subject, fromEvent, merge } from 'rxjs';
import { filter, map, mapTo, takeUntil, take, startWith, debounceTime } from 'rxjs/operators';
import { _animationsDisabled } from './_animation-chunk.mjs';
import '@angular/cdk/layout';

function throwMatDuplicatedDrawerError(position) {
  throw Error(`A drawer was already declared for 'position="${position}"'`);
}
const MAT_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken('MAT_DRAWER_DEFAULT_AUTOSIZE', {
  providedIn: 'root',
  factory: () => false
});
const MAT_DRAWER_CONTAINER = new InjectionToken('MAT_DRAWER_CONTAINER');
class MatDrawerContent extends CdkScrollable {
  _platform = inject(Platform);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _container = inject(MatDrawerContainer);
  constructor() {
    const elementRef = inject(ElementRef);
    const scrollDispatcher = inject(ScrollDispatcher);
    const ngZone = inject(NgZone);
    super(elementRef, scrollDispatcher, ngZone);
  }
  ngAfterContentInit() {
    this._container._contentMarginChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
  _shouldBeHidden() {
    if (this._platform.isBrowser) {
      return false;
    }
    const {
      start,
      end
    } = this._container;
    return start != null && start.mode !== 'over' && start.opened || end != null && end.mode !== 'over' && end.opened;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDrawerContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDrawerContent,
    isStandalone: true,
    selector: "mat-drawer-content",
    host: {
      properties: {
        "style.margin-left.px": "_container._contentMargins.left",
        "style.margin-right.px": "_container._contentMargins.right",
        "class.mat-drawer-content-hidden": "_shouldBeHidden()"
      },
      classAttribute: "mat-drawer-content"
    },
    providers: [{
      provide: CdkScrollable,
      useExisting: MatDrawerContent
    }],
    usesInheritance: true,
    ngImport: i0,
    template: '<ng-content></ng-content>',
    isInline: true,
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDrawerContent,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-drawer-content',
      template: '<ng-content></ng-content>',
      host: {
        'class': 'mat-drawer-content',
        '[style.margin-left.px]': '_container._contentMargins.left',
        '[style.margin-right.px]': '_container._contentMargins.right',
        '[class.mat-drawer-content-hidden]': '_shouldBeHidden()'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: CdkScrollable,
        useExisting: MatDrawerContent
      }]
    }]
  }],
  ctorParameters: () => []
});
class MatDrawer {
  _elementRef = inject(ElementRef);
  _focusTrapFactory = inject(FocusTrapFactory);
  _focusMonitor = inject(FocusMonitor);
  _platform = inject(Platform);
  _ngZone = inject(NgZone);
  _renderer = inject(Renderer2);
  _interactivityChecker = inject(InteractivityChecker);
  _doc = inject(DOCUMENT);
  _container = inject(MAT_DRAWER_CONTAINER, {
    optional: true
  });
  _focusTrap = null;
  _elementFocusedBeforeDrawerWasOpened = null;
  _eventCleanups;
  _isAttached;
  _anchor;
  get position() {
    return this._position;
  }
  set position(value) {
    value = value === 'end' ? 'end' : 'start';
    if (value !== this._position) {
      if (this._isAttached) {
        this._updatePositionInParent(value);
      }
      this._position = value;
      this.onPositionChanged.emit();
    }
  }
  _position = 'start';
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }
  _mode = 'over';
  get disableClose() {
    return this._disableClose;
  }
  set disableClose(value) {
    this._disableClose = coerceBooleanProperty(value);
  }
  _disableClose = false;
  get autoFocus() {
    const value = this._autoFocus;
    if (value == null) {
      if (this.mode === 'side') {
        return 'dialog';
      } else {
        return 'first-tabbable';
      }
    }
    return value;
  }
  set autoFocus(value) {
    if (value === 'true' || value === 'false' || value == null) {
      value = coerceBooleanProperty(value);
    }
    this._autoFocus = value;
  }
  _autoFocus;
  get opened() {
    return this._opened();
  }
  set opened(value) {
    this.toggle(coerceBooleanProperty(value));
  }
  _opened = signal(false, ...(ngDevMode ? [{
    debugName: "_opened"
  }] : []));
  _openedVia;
  _animationStarted = new Subject();
  _animationEnd = new Subject();
  openedChange = new EventEmitter(true);
  _openedStream = this.openedChange.pipe(filter(o => o), map(() => {}));
  openedStart = this._animationStarted.pipe(filter(() => this.opened), mapTo(undefined));
  _closedStream = this.openedChange.pipe(filter(o => !o), map(() => {}));
  closedStart = this._animationStarted.pipe(filter(() => !this.opened), mapTo(undefined));
  _destroyed = new Subject();
  onPositionChanged = new EventEmitter();
  _content;
  _modeChanged = new Subject();
  _injector = inject(Injector);
  _changeDetectorRef = inject(ChangeDetectorRef);
  constructor() {
    this.openedChange.pipe(takeUntil(this._destroyed)).subscribe(opened => {
      if (opened) {
        this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement;
        this._takeFocus();
      } else if (this._isFocusWithinDrawer()) {
        this._restoreFocus(this._openedVia || 'program');
      }
    });
    this._ngZone.runOutsideAngular(() => {
      const element = this._elementRef.nativeElement;
      fromEvent(element, 'keydown').pipe(filter(event => {
        return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
      }), takeUntil(this._destroyed)).subscribe(event => this._ngZone.run(() => {
        this.close();
        event.stopPropagation();
        event.preventDefault();
      }));
      this._eventCleanups = [this._renderer.listen(element, 'transitionrun', this._handleTransitionEvent), this._renderer.listen(element, 'transitionend', this._handleTransitionEvent), this._renderer.listen(element, 'transitioncancel', this._handleTransitionEvent)];
    });
    this._animationEnd.subscribe(() => {
      this.openedChange.emit(this.opened);
    });
  }
  _forceFocus(element, options) {
    if (!this._interactivityChecker.isFocusable(element)) {
      element.tabIndex = -1;
      this._ngZone.runOutsideAngular(() => {
        const callback = () => {
          cleanupBlur();
          cleanupMousedown();
          element.removeAttribute('tabindex');
        };
        const cleanupBlur = this._renderer.listen(element, 'blur', callback);
        const cleanupMousedown = this._renderer.listen(element, 'mousedown', callback);
      });
    }
    element.focus(options);
  }
  _focusByCssSelector(selector, options) {
    let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
    if (elementToFocus) {
      this._forceFocus(elementToFocus, options);
    }
  }
  _takeFocus() {
    if (!this._focusTrap) {
      return;
    }
    const element = this._elementRef.nativeElement;
    switch (this.autoFocus) {
      case false:
      case 'dialog':
        return;
      case true:
      case 'first-tabbable':
        afterNextRender(() => {
          const hasMovedFocus = this._focusTrap.focusInitialElement();
          if (!hasMovedFocus && typeof element.focus === 'function') {
            element.focus();
          }
        }, {
          injector: this._injector
        });
        break;
      case 'first-heading':
        this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
        break;
      default:
        this._focusByCssSelector(this.autoFocus);
        break;
    }
  }
  _restoreFocus(focusOrigin) {
    if (this.autoFocus === 'dialog') {
      return;
    }
    if (this._elementFocusedBeforeDrawerWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, focusOrigin);
    } else {
      this._elementRef.nativeElement.blur();
    }
    this._elementFocusedBeforeDrawerWasOpened = null;
  }
  _isFocusWithinDrawer() {
    const activeEl = this._doc.activeElement;
    return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
  }
  ngAfterViewInit() {
    this._isAttached = true;
    if (this._position === 'end') {
      this._updatePositionInParent('end');
    }
    if (this._platform.isBrowser) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
      this._updateFocusTrapState();
    }
  }
  ngOnDestroy() {
    this._eventCleanups.forEach(cleanup => cleanup());
    this._focusTrap?.destroy();
    this._anchor?.remove();
    this._anchor = null;
    this._animationStarted.complete();
    this._animationEnd.complete();
    this._modeChanged.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }
  open(openedVia) {
    return this.toggle(true, openedVia);
  }
  close() {
    return this.toggle(false);
  }
  _closeViaBackdropClick() {
    return this._setOpen(false, true, 'mouse');
  }
  toggle(isOpen = !this.opened, openedVia) {
    if (isOpen && openedVia) {
      this._openedVia = openedVia;
    }
    const result = this._setOpen(isOpen, !isOpen && this._isFocusWithinDrawer(), this._openedVia || 'program');
    if (!isOpen) {
      this._openedVia = null;
    }
    return result;
  }
  _setOpen(isOpen, restoreFocus, focusOrigin) {
    if (isOpen === this.opened) {
      return Promise.resolve(isOpen ? 'open' : 'close');
    }
    this._opened.set(isOpen);
    if (this._container?._transitionsEnabled) {
      this._setIsAnimating(true);
    } else {
      setTimeout(() => {
        this._animationStarted.next();
        this._animationEnd.next();
      });
    }
    this._elementRef.nativeElement.classList.toggle('mat-drawer-opened', isOpen);
    if (!isOpen && restoreFocus) {
      this._restoreFocus(focusOrigin);
    }
    this._changeDetectorRef.markForCheck();
    this._updateFocusTrapState();
    return new Promise(resolve => {
      this.openedChange.pipe(take(1)).subscribe(open => resolve(open ? 'open' : 'close'));
    });
  }
  _setIsAnimating(isAnimating) {
    this._elementRef.nativeElement.classList.toggle('mat-drawer-animating', isAnimating);
  }
  _getWidth() {
    return this._elementRef.nativeElement.offsetWidth || 0;
  }
  _updateFocusTrapState() {
    if (this._focusTrap) {
      this._focusTrap.enabled = !!this._container?.hasBackdrop && this.opened;
    }
  }
  _updatePositionInParent(newPosition) {
    if (!this._platform.isBrowser) {
      return;
    }
    const element = this._elementRef.nativeElement;
    const parent = element.parentNode;
    if (newPosition === 'end') {
      if (!this._anchor) {
        this._anchor = this._doc.createComment('mat-drawer-anchor');
        parent.insertBefore(this._anchor, element);
      }
      parent.appendChild(element);
    } else if (this._anchor) {
      this._anchor.parentNode.insertBefore(element, this._anchor);
    }
  }
  _handleTransitionEvent = event => {
    const element = this._elementRef.nativeElement;
    if (event.target === element) {
      this._ngZone.run(() => {
        if (event.type === 'transitionrun') {
          this._animationStarted.next(event);
        } else {
          if (event.type === 'transitionend') {
            this._setIsAnimating(false);
          }
          this._animationEnd.next(event);
        }
      });
    }
  };
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDrawer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDrawer,
    isStandalone: true,
    selector: "mat-drawer",
    inputs: {
      position: "position",
      mode: "mode",
      disableClose: "disableClose",
      autoFocus: "autoFocus",
      opened: "opened"
    },
    outputs: {
      openedChange: "openedChange",
      _openedStream: "opened",
      openedStart: "openedStart",
      _closedStream: "closed",
      closedStart: "closedStart",
      onPositionChanged: "positionChanged"
    },
    host: {
      properties: {
        "attr.align": "null",
        "class.mat-drawer-end": "position === \"end\"",
        "class.mat-drawer-over": "mode === \"over\"",
        "class.mat-drawer-push": "mode === \"push\"",
        "class.mat-drawer-side": "mode === \"side\"",
        "style.visibility": "(!_container && !opened) ? \"hidden\" : null",
        "attr.tabIndex": "(mode !== \"side\") ? \"-1\" : null"
      },
      classAttribute: "mat-drawer"
    },
    viewQueries: [{
      propertyName: "_content",
      first: true,
      predicate: ["content"],
      descendants: true
    }],
    exportAs: ["matDrawer"],
    ngImport: i0,
    template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n",
    dependencies: [{
      kind: "directive",
      type: CdkScrollable,
      selector: "[cdk-scrollable], [cdkScrollable]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDrawer,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-drawer',
      exportAs: 'matDrawer',
      host: {
        'class': 'mat-drawer',
        '[attr.align]': 'null',
        '[class.mat-drawer-end]': 'position === "end"',
        '[class.mat-drawer-over]': 'mode === "over"',
        '[class.mat-drawer-push]': 'mode === "push"',
        '[class.mat-drawer-side]': 'mode === "side"',
        '[style.visibility]': '(!_container && !opened) ? "hidden" : null',
        '[attr.tabIndex]': '(mode !== "side") ? "-1" : null'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [CdkScrollable],
      template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n"
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    position: [{
      type: Input
    }],
    mode: [{
      type: Input
    }],
    disableClose: [{
      type: Input
    }],
    autoFocus: [{
      type: Input
    }],
    opened: [{
      type: Input
    }],
    openedChange: [{
      type: Output
    }],
    _openedStream: [{
      type: Output,
      args: ['opened']
    }],
    openedStart: [{
      type: Output
    }],
    _closedStream: [{
      type: Output,
      args: ['closed']
    }],
    closedStart: [{
      type: Output
    }],
    onPositionChanged: [{
      type: Output,
      args: ['positionChanged']
    }],
    _content: [{
      type: ViewChild,
      args: ['content']
    }]
  }
});
class MatDrawerContainer {
  _dir = inject(Directionality, {
    optional: true
  });
  _element = inject(ElementRef);
  _ngZone = inject(NgZone);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _animationDisabled = _animationsDisabled();
  _transitionsEnabled = false;
  _allDrawers;
  _drawers = new QueryList();
  _content;
  _userContent;
  get start() {
    return this._start;
  }
  get end() {
    return this._end;
  }
  get autosize() {
    return this._autosize;
  }
  set autosize(value) {
    this._autosize = coerceBooleanProperty(value);
  }
  _autosize = inject(MAT_DRAWER_DEFAULT_AUTOSIZE);
  get hasBackdrop() {
    return this._drawerHasBackdrop(this._start) || this._drawerHasBackdrop(this._end);
  }
  set hasBackdrop(value) {
    this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
  }
  _backdropOverride;
  backdropClick = new EventEmitter();
  _start;
  _end;
  _left;
  _right;
  _destroyed = new Subject();
  _doCheckSubject = new Subject();
  _contentMargins = {
    left: null,
    right: null
  };
  _contentMarginChanges = new Subject();
  get scrollable() {
    return this._userContent || this._content;
  }
  _injector = inject(Injector);
  constructor() {
    const platform = inject(Platform);
    const viewportRuler = inject(ViewportRuler);
    this._dir?.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._validateDrawers();
      this.updateContentMargins();
    });
    viewportRuler.change().pipe(takeUntil(this._destroyed)).subscribe(() => this.updateContentMargins());
    if (!this._animationDisabled && platform.isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._element.nativeElement.classList.add('mat-drawer-transition');
          this._transitionsEnabled = true;
        }, 200);
      });
    }
  }
  ngAfterContentInit() {
    this._allDrawers.changes.pipe(startWith(this._allDrawers), takeUntil(this._destroyed)).subscribe(drawer => {
      this._drawers.reset(drawer.filter(item => !item._container || item._container === this));
      this._drawers.notifyOnChanges();
    });
    this._drawers.changes.pipe(startWith(null)).subscribe(() => {
      this._validateDrawers();
      this._drawers.forEach(drawer => {
        this._watchDrawerToggle(drawer);
        this._watchDrawerPosition(drawer);
        this._watchDrawerMode(drawer);
      });
      if (!this._drawers.length || this._isDrawerOpen(this._start) || this._isDrawerOpen(this._end)) {
        this.updateContentMargins();
      }
      this._changeDetectorRef.markForCheck();
    });
    this._ngZone.runOutsideAngular(() => {
      this._doCheckSubject.pipe(debounceTime(10), takeUntil(this._destroyed)).subscribe(() => this.updateContentMargins());
    });
  }
  ngOnDestroy() {
    this._contentMarginChanges.complete();
    this._doCheckSubject.complete();
    this._drawers.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
  open() {
    this._drawers.forEach(drawer => drawer.open());
  }
  close() {
    this._drawers.forEach(drawer => drawer.close());
  }
  updateContentMargins() {
    let left = 0;
    let right = 0;
    if (this._left && this._left.opened) {
      if (this._left.mode == 'side') {
        left += this._left._getWidth();
      } else if (this._left.mode == 'push') {
        const width = this._left._getWidth();
        left += width;
        right -= width;
      }
    }
    if (this._right && this._right.opened) {
      if (this._right.mode == 'side') {
        right += this._right._getWidth();
      } else if (this._right.mode == 'push') {
        const width = this._right._getWidth();
        right += width;
        left -= width;
      }
    }
    left = left || null;
    right = right || null;
    if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
      this._contentMargins = {
        left,
        right
      };
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }
  ngDoCheck() {
    if (this._autosize && this._isPushed()) {
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
    }
  }
  _watchDrawerToggle(drawer) {
    drawer._animationStarted.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });
    if (drawer.mode !== 'side') {
      drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe(() => this._setContainerClass(drawer.opened));
    }
  }
  _watchDrawerPosition(drawer) {
    drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      afterNextRender({
        read: () => this._validateDrawers()
      }, {
        injector: this._injector
      });
    });
  }
  _watchDrawerMode(drawer) {
    drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed))).subscribe(() => {
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });
  }
  _setContainerClass(isAdd) {
    const classList = this._element.nativeElement.classList;
    const className = 'mat-drawer-container-has-open';
    if (isAdd) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }
  _validateDrawers() {
    this._start = this._end = null;
    this._drawers.forEach(drawer => {
      if (drawer.position == 'end') {
        if (this._end != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
          throwMatDuplicatedDrawerError('end');
        }
        this._end = drawer;
      } else {
        if (this._start != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
          throwMatDuplicatedDrawerError('start');
        }
        this._start = drawer;
      }
    });
    this._right = this._left = null;
    if (this._dir && this._dir.value === 'rtl') {
      this._left = this._end;
      this._right = this._start;
    } else {
      this._left = this._start;
      this._right = this._end;
    }
  }
  _isPushed() {
    return this._isDrawerOpen(this._start) && this._start.mode != 'over' || this._isDrawerOpen(this._end) && this._end.mode != 'over';
  }
  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalDrawersViaBackdrop();
  }
  _closeModalDrawersViaBackdrop() {
    [this._start, this._end].filter(drawer => drawer && !drawer.disableClose && this._drawerHasBackdrop(drawer)).forEach(drawer => drawer._closeViaBackdropClick());
  }
  _isShowingBackdrop() {
    return this._isDrawerOpen(this._start) && this._drawerHasBackdrop(this._start) || this._isDrawerOpen(this._end) && this._drawerHasBackdrop(this._end);
  }
  _isDrawerOpen(drawer) {
    return drawer != null && drawer.opened;
  }
  _drawerHasBackdrop(drawer) {
    if (this._backdropOverride == null) {
      return !!drawer && drawer.mode !== 'side';
    }
    return this._backdropOverride;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDrawerContainer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatDrawerContainer,
    isStandalone: true,
    selector: "mat-drawer-container",
    inputs: {
      autosize: "autosize",
      hasBackdrop: "hasBackdrop"
    },
    outputs: {
      backdropClick: "backdropClick"
    },
    host: {
      properties: {
        "class.mat-drawer-container-explicit-backdrop": "_backdropOverride"
      },
      classAttribute: "mat-drawer-container"
    },
    providers: [{
      provide: MAT_DRAWER_CONTAINER,
      useExisting: MatDrawerContainer
    }],
    queries: [{
      propertyName: "_content",
      first: true,
      predicate: MatDrawerContent,
      descendants: true
    }, {
      propertyName: "_allDrawers",
      predicate: MatDrawer,
      descendants: true
    }],
    viewQueries: [{
      propertyName: "_userContent",
      first: true,
      predicate: MatDrawerContent,
      descendants: true
    }],
    exportAs: ["matDrawerContainer"],
    ngImport: i0,
    template: "@if (hasBackdrop) {\n  <div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\"\n       [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n}\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n\n@if (!_content) {\n  <mat-drawer-content>\n    <ng-content></ng-content>\n  </mat-drawer-content>\n}\n",
    styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n"],
    dependencies: [{
      kind: "component",
      type: MatDrawerContent,
      selector: "mat-drawer-content"
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDrawerContainer,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-drawer-container',
      exportAs: 'matDrawerContainer',
      host: {
        'class': 'mat-drawer-container',
        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: MatDrawerContainer
      }],
      imports: [MatDrawerContent],
      template: "@if (hasBackdrop) {\n  <div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\"\n       [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n}\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n\n@if (!_content) {\n  <mat-drawer-content>\n    <ng-content></ng-content>\n  </mat-drawer-content>\n}\n",
      styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _allDrawers: [{
      type: ContentChildren,
      args: [MatDrawer, {
        descendants: true
      }]
    }],
    _content: [{
      type: ContentChild,
      args: [MatDrawerContent]
    }],
    _userContent: [{
      type: ViewChild,
      args: [MatDrawerContent]
    }],
    autosize: [{
      type: Input
    }],
    hasBackdrop: [{
      type: Input
    }],
    backdropClick: [{
      type: Output
    }]
  }
});

class MatSidenavContent extends MatDrawerContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSidenavContent,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatSidenavContent,
    isStandalone: true,
    selector: "mat-sidenav-content",
    host: {
      classAttribute: "mat-drawer-content mat-sidenav-content"
    },
    providers: [{
      provide: CdkScrollable,
      useExisting: MatSidenavContent
    }],
    usesInheritance: true,
    ngImport: i0,
    template: '<ng-content></ng-content>',
    isInline: true,
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatSidenavContent,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-sidenav-content',
      template: '<ng-content></ng-content>',
      host: {
        'class': 'mat-drawer-content mat-sidenav-content'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: CdkScrollable,
        useExisting: MatSidenavContent
      }]
    }]
  }]
});
class MatSidenav extends MatDrawer {
  get fixedInViewport() {
    return this._fixedInViewport;
  }
  set fixedInViewport(value) {
    this._fixedInViewport = coerceBooleanProperty(value);
  }
  _fixedInViewport = false;
  get fixedTopGap() {
    return this._fixedTopGap;
  }
  set fixedTopGap(value) {
    this._fixedTopGap = coerceNumberProperty(value);
  }
  _fixedTopGap = 0;
  get fixedBottomGap() {
    return this._fixedBottomGap;
  }
  set fixedBottomGap(value) {
    this._fixedBottomGap = coerceNumberProperty(value);
  }
  _fixedBottomGap = 0;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSidenav,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatSidenav,
    isStandalone: true,
    selector: "mat-sidenav",
    inputs: {
      fixedInViewport: "fixedInViewport",
      fixedTopGap: "fixedTopGap",
      fixedBottomGap: "fixedBottomGap"
    },
    host: {
      properties: {
        "attr.tabIndex": "(mode !== \"side\") ? \"-1\" : null",
        "attr.align": "null",
        "class.mat-drawer-end": "position === \"end\"",
        "class.mat-drawer-over": "mode === \"over\"",
        "class.mat-drawer-push": "mode === \"push\"",
        "class.mat-drawer-side": "mode === \"side\"",
        "class.mat-sidenav-fixed": "fixedInViewport",
        "style.top.px": "fixedInViewport ? fixedTopGap : null",
        "style.bottom.px": "fixedInViewport ? fixedBottomGap : null"
      },
      classAttribute: "mat-drawer mat-sidenav"
    },
    providers: [{
      provide: MatDrawer,
      useExisting: MatSidenav
    }],
    exportAs: ["matSidenav"],
    usesInheritance: true,
    ngImport: i0,
    template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n",
    dependencies: [{
      kind: "directive",
      type: CdkScrollable,
      selector: "[cdk-scrollable], [cdkScrollable]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatSidenav,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-sidenav',
      exportAs: 'matSidenav',
      host: {
        'class': 'mat-drawer mat-sidenav',
        '[attr.tabIndex]': '(mode !== "side") ? "-1" : null',
        '[attr.align]': 'null',
        '[class.mat-drawer-end]': 'position === "end"',
        '[class.mat-drawer-over]': 'mode === "over"',
        '[class.mat-drawer-push]': 'mode === "push"',
        '[class.mat-drawer-side]': 'mode === "side"',
        '[class.mat-sidenav-fixed]': 'fixedInViewport',
        '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
        '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [CdkScrollable],
      providers: [{
        provide: MatDrawer,
        useExisting: MatSidenav
      }],
      template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n"
    }]
  }],
  propDecorators: {
    fixedInViewport: [{
      type: Input
    }],
    fixedTopGap: [{
      type: Input
    }],
    fixedBottomGap: [{
      type: Input
    }]
  }
});
class MatSidenavContainer extends MatDrawerContainer {
  _allDrawers = undefined;
  _content = undefined;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSidenavContainer,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatSidenavContainer,
    isStandalone: true,
    selector: "mat-sidenav-container",
    host: {
      properties: {
        "class.mat-drawer-container-explicit-backdrop": "_backdropOverride"
      },
      classAttribute: "mat-drawer-container mat-sidenav-container"
    },
    providers: [{
      provide: MAT_DRAWER_CONTAINER,
      useExisting: MatSidenavContainer
    }, {
      provide: MatDrawerContainer,
      useExisting: MatSidenavContainer
    }],
    queries: [{
      propertyName: "_content",
      first: true,
      predicate: MatSidenavContent,
      descendants: true
    }, {
      propertyName: "_allDrawers",
      predicate: MatSidenav,
      descendants: true
    }],
    exportAs: ["matSidenavContainer"],
    usesInheritance: true,
    ngImport: i0,
    template: "@if (hasBackdrop) {\n  <div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\"\n       [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n}\n\n<ng-content select=\"mat-sidenav\"></ng-content>\n\n<ng-content select=\"mat-sidenav-content\">\n</ng-content>\n\n@if (!_content) {\n  <mat-sidenav-content>\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n}\n",
    styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n"],
    dependencies: [{
      kind: "component",
      type: MatSidenavContent,
      selector: "mat-sidenav-content"
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatSidenavContainer,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-sidenav-container',
      exportAs: 'matSidenavContainer',
      host: {
        'class': 'mat-drawer-container mat-sidenav-container',
        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: MatSidenavContainer
      }, {
        provide: MatDrawerContainer,
        useExisting: MatSidenavContainer
      }],
      imports: [MatSidenavContent],
      template: "@if (hasBackdrop) {\n  <div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\"\n       [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n}\n\n<ng-content select=\"mat-sidenav\"></ng-content>\n\n<ng-content select=\"mat-sidenav-content\">\n</ng-content>\n\n@if (!_content) {\n  <mat-sidenav-content>\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n}\n",
      styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n"]
    }]
  }],
  propDecorators: {
    _allDrawers: [{
      type: ContentChildren,
      args: [MatSidenav, {
        descendants: true
      }]
    }],
    _content: [{
      type: ContentChild,
      args: [MatSidenavContent]
    }]
  }
});

class MatSidenavModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSidenavModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSidenavModule,
    imports: [CdkScrollableModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent],
    exports: [BidiModule, CdkScrollableModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSidenavModule,
    imports: [CdkScrollableModule, BidiModule, CdkScrollableModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatSidenavModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [CdkScrollableModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent],
      exports: [BidiModule, CdkScrollableModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent]
    }]
  }]
});

export { MAT_DRAWER_DEFAULT_AUTOSIZE, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule, throwMatDuplicatedDrawerError };
//# sourceMappingURL=sidenav.mjs.map

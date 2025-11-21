import { CdkDialogContainer, Dialog, DialogModule } from '@angular/cdk/dialog';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import * as i0 from '@angular/core';
import { EventEmitter, inject, Component, ChangeDetectionStrategy, ViewEncapsulation, InjectionToken, Injector, Injectable, NgModule } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { _animationsDisabled } from './_animation-chunk.mjs';
import { createBlockScrollStrategy, createGlobalPositionStrategy } from '@angular/cdk/overlay';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Subject, merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';

const ENTER_ANIMATION = '_mat-bottom-sheet-enter';
const EXIT_ANIMATION = '_mat-bottom-sheet-exit';
class MatBottomSheetContainer extends CdkDialogContainer {
  _breakpointSubscription;
  _animationsDisabled = _animationsDisabled();
  _animationState = 'void';
  _animationStateChanged = new EventEmitter();
  _destroyed;
  constructor() {
    super();
    const breakpointObserver = inject(BreakpointObserver);
    this._breakpointSubscription = breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe(() => {
      const classList = this._elementRef.nativeElement.classList;
      classList.toggle('mat-bottom-sheet-container-medium', breakpointObserver.isMatched(Breakpoints.Medium));
      classList.toggle('mat-bottom-sheet-container-large', breakpointObserver.isMatched(Breakpoints.Large));
      classList.toggle('mat-bottom-sheet-container-xlarge', breakpointObserver.isMatched(Breakpoints.XLarge));
    });
  }
  enter() {
    if (!this._destroyed) {
      this._animationState = 'visible';
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
      if (this._animationsDisabled) {
        this._simulateAnimation(ENTER_ANIMATION);
      }
    }
  }
  exit() {
    if (!this._destroyed) {
      this._elementRef.nativeElement.setAttribute('mat-exit', '');
      this._animationState = 'hidden';
      this._changeDetectorRef.markForCheck();
      if (this._animationsDisabled) {
        this._simulateAnimation(EXIT_ANIMATION);
      }
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._breakpointSubscription.unsubscribe();
    this._destroyed = true;
  }
  _simulateAnimation(name) {
    this._ngZone.run(() => {
      this._handleAnimationEvent(true, name);
      setTimeout(() => this._handleAnimationEvent(false, name));
    });
  }
  _trapFocus() {
    super._trapFocus({
      preventScroll: true
    });
  }
  _handleAnimationEvent(isStart, animationName) {
    const isEnter = animationName === ENTER_ANIMATION;
    const isExit = animationName === EXIT_ANIMATION;
    if (isEnter || isExit) {
      this._animationStateChanged.emit({
        toState: isEnter ? 'visible' : 'hidden',
        phase: isStart ? 'start' : 'done'
      });
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatBottomSheetContainer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatBottomSheetContainer,
    isStandalone: true,
    selector: "mat-bottom-sheet-container",
    host: {
      attributes: {
        "tabindex": "-1"
      },
      listeners: {
        "animationstart": "_handleAnimationEvent(true, $event.animationName)",
        "animationend": "_handleAnimationEvent(false, $event.animationName)",
        "animationcancel": "_handleAnimationEvent(false, $event.animationName)"
      },
      properties: {
        "class.mat-bottom-sheet-container-animations-enabled": "!_animationsDisabled",
        "class.mat-bottom-sheet-container-enter": "_animationState === \"visible\"",
        "class.mat-bottom-sheet-container-exit": "_animationState === \"hidden\"",
        "attr.role": "_config.role",
        "attr.aria-modal": "_config.ariaModal",
        "attr.aria-label": "_config.ariaLabel"
      },
      classAttribute: "mat-bottom-sheet-container"
    },
    usesInheritance: true,
    ngImport: i0,
    template: "<ng-template cdkPortalOutlet></ng-template>\r\n",
    styles: ["@keyframes _mat-bottom-sheet-enter{from{transform:translateY(100%)}to{transform:none}}@keyframes _mat-bottom-sheet-exit{from{transform:none}to{transform:translateY(100%)}}.mat-bottom-sheet-container{box-shadow:0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto;position:relative;background:var(--mat-bottom-sheet-container-background-color, var(--mat-sys-surface-container-low));color:var(--mat-bottom-sheet-container-text-color, var(--mat-sys-on-surface));font-family:var(--mat-bottom-sheet-container-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-bottom-sheet-container-text-size, var(--mat-sys-body-large-size));line-height:var(--mat-bottom-sheet-container-text-line-height, var(--mat-sys-body-large-line-height));font-weight:var(--mat-bottom-sheet-container-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-bottom-sheet-container-text-tracking, var(--mat-sys-body-large-tracking))}@media(forced-colors: active){.mat-bottom-sheet-container{outline:1px solid}}.mat-bottom-sheet-container-animations-enabled{transform:translateY(100%)}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-enter{animation:_mat-bottom-sheet-enter 195ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-exit{animation:_mat-bottom-sheet-exit 375ms cubic-bezier(0.4, 0, 1, 1) backwards}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:var(--mat-bottom-sheet-container-shape, 28px);border-top-right-radius:var(--mat-bottom-sheet-container-shape, 28px)}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}\n"],
    dependencies: [{
      kind: "directive",
      type: CdkPortalOutlet,
      selector: "[cdkPortalOutlet]",
      inputs: ["cdkPortalOutlet"],
      outputs: ["attached"],
      exportAs: ["cdkPortalOutlet"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.Default,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatBottomSheetContainer,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-bottom-sheet-container',
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      host: {
        'class': 'mat-bottom-sheet-container',
        '[class.mat-bottom-sheet-container-animations-enabled]': '!_animationsDisabled',
        '[class.mat-bottom-sheet-container-enter]': '_animationState === "visible"',
        '[class.mat-bottom-sheet-container-exit]': '_animationState === "hidden"',
        'tabindex': '-1',
        '[attr.role]': '_config.role',
        '[attr.aria-modal]': '_config.ariaModal',
        '[attr.aria-label]': '_config.ariaLabel',
        '(animationstart)': '_handleAnimationEvent(true, $event.animationName)',
        '(animationend)': '_handleAnimationEvent(false, $event.animationName)',
        '(animationcancel)': '_handleAnimationEvent(false, $event.animationName)'
      },
      imports: [CdkPortalOutlet],
      template: "<ng-template cdkPortalOutlet></ng-template>\r\n",
      styles: ["@keyframes _mat-bottom-sheet-enter{from{transform:translateY(100%)}to{transform:none}}@keyframes _mat-bottom-sheet-exit{from{transform:none}to{transform:translateY(100%)}}.mat-bottom-sheet-container{box-shadow:0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto;position:relative;background:var(--mat-bottom-sheet-container-background-color, var(--mat-sys-surface-container-low));color:var(--mat-bottom-sheet-container-text-color, var(--mat-sys-on-surface));font-family:var(--mat-bottom-sheet-container-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-bottom-sheet-container-text-size, var(--mat-sys-body-large-size));line-height:var(--mat-bottom-sheet-container-text-line-height, var(--mat-sys-body-large-line-height));font-weight:var(--mat-bottom-sheet-container-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-bottom-sheet-container-text-tracking, var(--mat-sys-body-large-tracking))}@media(forced-colors: active){.mat-bottom-sheet-container{outline:1px solid}}.mat-bottom-sheet-container-animations-enabled{transform:translateY(100%)}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-enter{animation:_mat-bottom-sheet-enter 195ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-exit{animation:_mat-bottom-sheet-exit 375ms cubic-bezier(0.4, 0, 1, 1) backwards}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:var(--mat-bottom-sheet-container-shape, 28px);border-top-right-radius:var(--mat-bottom-sheet-container-shape, 28px)}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}\n"]
    }]
  }],
  ctorParameters: () => []
});

const MAT_BOTTOM_SHEET_DATA = new InjectionToken('MatBottomSheetData');
class MatBottomSheetConfig {
  viewContainerRef;
  injector;
  panelClass;
  direction;
  data = null;
  hasBackdrop = true;
  backdropClass;
  disableClose = false;
  ariaLabel = null;
  ariaModal = false;
  closeOnNavigation = true;
  autoFocus = 'first-tabbable';
  restoreFocus = true;
  scrollStrategy;
  height = '';
  minHeight;
  maxHeight;
}

class MatBottomSheetRef {
  _ref;
  get instance() {
    return this._ref.componentInstance;
  }
  get componentRef() {
    return this._ref.componentRef;
  }
  containerInstance;
  disableClose;
  _afterOpened = new Subject();
  _result;
  _closeFallbackTimeout;
  constructor(_ref, config, containerInstance) {
    this._ref = _ref;
    this.containerInstance = containerInstance;
    this.disableClose = config.disableClose;
    containerInstance._animationStateChanged.pipe(filter(event => event.phase === 'done' && event.toState === 'visible'), take(1)).subscribe(() => {
      this._afterOpened.next();
      this._afterOpened.complete();
    });
    containerInstance._animationStateChanged.pipe(filter(event => event.phase === 'done' && event.toState === 'hidden'), take(1)).subscribe(() => {
      clearTimeout(this._closeFallbackTimeout);
      this._ref.close(this._result);
    });
    _ref.overlayRef.detachments().subscribe(() => {
      this._ref.close(this._result);
    });
    merge(this.backdropClick(), this.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))).subscribe(event => {
      if (!this.disableClose && (event.type !== 'keydown' || !hasModifierKey(event))) {
        event.preventDefault();
        this.dismiss();
      }
    });
  }
  dismiss(result) {
    if (!this.containerInstance) {
      return;
    }
    this.containerInstance._animationStateChanged.pipe(filter(event => event.phase === 'start'), take(1)).subscribe(() => {
      this._closeFallbackTimeout = setTimeout(() => this._ref.close(this._result), 500);
      this._ref.overlayRef.detachBackdrop();
    });
    this._result = result;
    this.containerInstance.exit();
    this.containerInstance = null;
  }
  afterDismissed() {
    return this._ref.closed;
  }
  afterOpened() {
    return this._afterOpened;
  }
  backdropClick() {
    return this._ref.backdropClick;
  }
  keydownEvents() {
    return this._ref.keydownEvents;
  }
}

const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken('mat-bottom-sheet-default-options');
class MatBottomSheet {
  _injector = inject(Injector);
  _parentBottomSheet = inject(MatBottomSheet, {
    optional: true,
    skipSelf: true
  });
  _animationsDisabled = _animationsDisabled();
  _defaultOptions = inject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, {
    optional: true
  });
  _bottomSheetRefAtThisLevel = null;
  _dialog = inject(Dialog);
  get _openedBottomSheetRef() {
    const parent = this._parentBottomSheet;
    return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
  }
  set _openedBottomSheetRef(value) {
    if (this._parentBottomSheet) {
      this._parentBottomSheet._openedBottomSheetRef = value;
    } else {
      this._bottomSheetRefAtThisLevel = value;
    }
  }
  constructor() {}
  open(componentOrTemplateRef, config) {
    const _config = {
      ...(this._defaultOptions || new MatBottomSheetConfig()),
      ...config
    };
    let ref;
    this._dialog.open(componentOrTemplateRef, {
      ..._config,
      disableClose: true,
      closeOnOverlayDetachments: false,
      maxWidth: '100%',
      container: MatBottomSheetContainer,
      scrollStrategy: _config.scrollStrategy || createBlockScrollStrategy(this._injector),
      positionStrategy: createGlobalPositionStrategy(this._injector).centerHorizontally().bottom('0'),
      disableAnimations: this._animationsDisabled,
      templateContext: () => ({
        bottomSheetRef: ref
      }),
      providers: (cdkRef, _cdkConfig, container) => {
        ref = new MatBottomSheetRef(cdkRef, _config, container);
        return [{
          provide: MatBottomSheetRef,
          useValue: ref
        }, {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: _config.data
        }];
      }
    });
    ref.afterDismissed().subscribe(() => {
      if (this._openedBottomSheetRef === ref) {
        this._openedBottomSheetRef = null;
      }
    });
    if (this._openedBottomSheetRef) {
      this._openedBottomSheetRef.afterDismissed().subscribe(() => ref.containerInstance?.enter());
      this._openedBottomSheetRef.dismiss();
    } else {
      ref.containerInstance.enter();
    }
    this._openedBottomSheetRef = ref;
    return ref;
  }
  dismiss(result) {
    if (this._openedBottomSheetRef) {
      this._openedBottomSheetRef.dismiss(result);
    }
  }
  ngOnDestroy() {
    if (this._bottomSheetRefAtThisLevel) {
      this._bottomSheetRefAtThisLevel.dismiss();
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatBottomSheet,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatBottomSheet,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatBottomSheet,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }],
  ctorParameters: () => []
});

class MatBottomSheetModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatBottomSheetModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatBottomSheetModule,
    imports: [DialogModule, PortalModule, MatBottomSheetContainer],
    exports: [MatBottomSheetContainer, BidiModule]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatBottomSheetModule,
    providers: [MatBottomSheet],
    imports: [DialogModule, PortalModule, BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatBottomSheetModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [DialogModule, PortalModule, MatBottomSheetContainer],
      exports: [MatBottomSheetContainer, BidiModule],
      providers: [MatBottomSheet]
    }]
  }]
});

export { MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheet, MatBottomSheetConfig, MatBottomSheetContainer, MatBottomSheetModule, MatBottomSheetRef };
//# sourceMappingURL=bottom-sheet.mjs.map

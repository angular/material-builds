import { AriaDescriber, _IdGenerator, InteractivityChecker, A11yModule } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject, NgZone, ElementRef, Renderer2, DOCUMENT, HOST_TAG_NAME, booleanAttribute, Directive, Input, NgModule } from '@angular/core';
import { _CdkPrivateStyleLoader, _VisuallyHiddenLoader } from '@angular/cdk/private';
import { _animationsDisabled } from './_animation-chunk.mjs';
import { BidiModule } from '@angular/cdk/bidi';
import '@angular/cdk/layout';

const BADGE_CONTENT_CLASS = 'mat-badge-content';
class _MatBadgeStyleLoader {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: _MatBadgeStyleLoader,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: _MatBadgeStyleLoader,
    isStandalone: true,
    selector: "ng-component",
    ngImport: i0,
    template: '',
    isInline: true,
    styles: [".mat-badge{position:relative}.mat-badge.mat-badge{overflow:visible}.mat-badge-content{position:absolute;text-align:center;display:inline-block;transition:transform 200ms ease-in-out;transform:scale(0.6);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;pointer-events:none;background-color:var(--mat-badge-background-color, var(--mat-sys-error));color:var(--mat-badge-text-color, var(--mat-sys-on-error));font-family:var(--mat-badge-text-font, var(--mat-sys-label-small-font));font-weight:var(--mat-badge-text-weight, var(--mat-sys-label-small-weight));border-radius:var(--mat-badge-container-shape, var(--mat-sys-corner-full))}.mat-badge-above .mat-badge-content{bottom:100%}.mat-badge-below .mat-badge-content{top:100%}.mat-badge-before .mat-badge-content{right:100%}[dir=rtl] .mat-badge-before .mat-badge-content{right:auto;left:100%}.mat-badge-after .mat-badge-content{left:100%}[dir=rtl] .mat-badge-after .mat-badge-content{left:auto;right:100%}@media(forced-colors: active){.mat-badge-content{outline:solid 1px;border-radius:0}}.mat-badge-disabled .mat-badge-content{background-color:var(--mat-badge-disabled-state-background-color, color-mix(in srgb, var(--mat-sys-error) 38%, transparent));color:var(--mat-badge-disabled-state-text-color, var(--mat-sys-on-error))}.mat-badge-hidden .mat-badge-content{display:none}.ng-animate-disabled .mat-badge-content,.mat-badge-content._mat-animation-noopable{transition:none}.mat-badge-content.mat-badge-active{transform:none}.mat-badge-small .mat-badge-content{width:var(--mat-badge-legacy-small-size-container-size, unset);height:var(--mat-badge-legacy-small-size-container-size, unset);min-width:var(--mat-badge-small-size-container-size, 6px);min-height:var(--mat-badge-small-size-container-size, 6px);line-height:var(--mat-badge-small-size-line-height, 6px);padding:var(--mat-badge-small-size-container-padding, 0);font-size:var(--mat-badge-small-size-text-size, 0);margin:var(--mat-badge-small-size-container-offset, -6px 0)}.mat-badge-small.mat-badge-overlap .mat-badge-content{margin:var(--mat-badge-small-size-container-overlap-offset, -6px)}.mat-badge-medium .mat-badge-content{width:var(--mat-badge-legacy-container-size, unset);height:var(--mat-badge-legacy-container-size, unset);min-width:var(--mat-badge-container-size, 16px);min-height:var(--mat-badge-container-size, 16px);line-height:var(--mat-badge-line-height, 16px);padding:var(--mat-badge-container-padding, 0 4px);font-size:var(--mat-badge-text-size, var(--mat-sys-label-small-size));margin:var(--mat-badge-container-offset, -12px 0)}.mat-badge-medium.mat-badge-overlap .mat-badge-content{margin:var(--mat-badge-container-overlap-offset, -12px)}.mat-badge-large .mat-badge-content{width:var(--mat-badge-legacy-large-size-container-size, unset);height:var(--mat-badge-legacy-large-size-container-size, unset);min-width:var(--mat-badge-large-size-container-size, 16px);min-height:var(--mat-badge-large-size-container-size, 16px);line-height:var(--mat-badge-large-size-line-height, 16px);padding:var(--mat-badge-large-size-container-padding, 0 4px);font-size:var(--mat-badge-large-size-text-size, var(--mat-sys-label-small-size));margin:var(--mat-badge-large-size-container-offset, -12px 0)}.mat-badge-large.mat-badge-overlap .mat-badge-content{margin:var(--mat-badge-large-size-container-overlap-offset, -12px)}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: _MatBadgeStyleLoader,
  decorators: [{
    type: Component,
    args: [{
      encapsulation: ViewEncapsulation.None,
      template: '',
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".mat-badge{position:relative}.mat-badge.mat-badge{overflow:visible}.mat-badge-content{position:absolute;text-align:center;display:inline-block;transition:transform 200ms ease-in-out;transform:scale(0.6);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;pointer-events:none;background-color:var(--mat-badge-background-color, var(--mat-sys-error));color:var(--mat-badge-text-color, var(--mat-sys-on-error));font-family:var(--mat-badge-text-font, var(--mat-sys-label-small-font));font-weight:var(--mat-badge-text-weight, var(--mat-sys-label-small-weight));border-radius:var(--mat-badge-container-shape, var(--mat-sys-corner-full))}.mat-badge-above .mat-badge-content{bottom:100%}.mat-badge-below .mat-badge-content{top:100%}.mat-badge-before .mat-badge-content{right:100%}[dir=rtl] .mat-badge-before .mat-badge-content{right:auto;left:100%}.mat-badge-after .mat-badge-content{left:100%}[dir=rtl] .mat-badge-after .mat-badge-content{left:auto;right:100%}@media(forced-colors: active){.mat-badge-content{outline:solid 1px;border-radius:0}}.mat-badge-disabled .mat-badge-content{background-color:var(--mat-badge-disabled-state-background-color, color-mix(in srgb, var(--mat-sys-error) 38%, transparent));color:var(--mat-badge-disabled-state-text-color, var(--mat-sys-on-error))}.mat-badge-hidden .mat-badge-content{display:none}.ng-animate-disabled .mat-badge-content,.mat-badge-content._mat-animation-noopable{transition:none}.mat-badge-content.mat-badge-active{transform:none}.mat-badge-small .mat-badge-content{width:var(--mat-badge-legacy-small-size-container-size, unset);height:var(--mat-badge-legacy-small-size-container-size, unset);min-width:var(--mat-badge-small-size-container-size, 6px);min-height:var(--mat-badge-small-size-container-size, 6px);line-height:var(--mat-badge-small-size-line-height, 6px);padding:var(--mat-badge-small-size-container-padding, 0);font-size:var(--mat-badge-small-size-text-size, 0);margin:var(--mat-badge-small-size-container-offset, -6px 0)}.mat-badge-small.mat-badge-overlap .mat-badge-content{margin:var(--mat-badge-small-size-container-overlap-offset, -6px)}.mat-badge-medium .mat-badge-content{width:var(--mat-badge-legacy-container-size, unset);height:var(--mat-badge-legacy-container-size, unset);min-width:var(--mat-badge-container-size, 16px);min-height:var(--mat-badge-container-size, 16px);line-height:var(--mat-badge-line-height, 16px);padding:var(--mat-badge-container-padding, 0 4px);font-size:var(--mat-badge-text-size, var(--mat-sys-label-small-size));margin:var(--mat-badge-container-offset, -12px 0)}.mat-badge-medium.mat-badge-overlap .mat-badge-content{margin:var(--mat-badge-container-overlap-offset, -12px)}.mat-badge-large .mat-badge-content{width:var(--mat-badge-legacy-large-size-container-size, unset);height:var(--mat-badge-legacy-large-size-container-size, unset);min-width:var(--mat-badge-large-size-container-size, 16px);min-height:var(--mat-badge-large-size-container-size, 16px);line-height:var(--mat-badge-large-size-line-height, 16px);padding:var(--mat-badge-large-size-container-padding, 0 4px);font-size:var(--mat-badge-large-size-text-size, var(--mat-sys-label-small-size));margin:var(--mat-badge-large-size-container-offset, -12px 0)}.mat-badge-large.mat-badge-overlap .mat-badge-content{margin:var(--mat-badge-large-size-container-overlap-offset, -12px)}\n"]
    }]
  }]
});
class MatBadge {
  _ngZone = inject(NgZone);
  _elementRef = inject(ElementRef);
  _ariaDescriber = inject(AriaDescriber);
  _renderer = inject(Renderer2);
  _animationsDisabled = _animationsDisabled();
  _idGenerator = inject(_IdGenerator);
  get color() {
    return this._color;
  }
  set color(value) {
    this._setColor(value);
    this._color = value;
  }
  _color = 'primary';
  overlap = true;
  disabled = false;
  position = 'above after';
  get content() {
    return this._content;
  }
  set content(newContent) {
    this._updateRenderedContent(newContent);
  }
  _content;
  get description() {
    return this._description;
  }
  set description(newDescription) {
    this._updateDescription(newDescription);
  }
  _description;
  size = 'medium';
  hidden = false;
  _badgeElement;
  _inlineBadgeDescription;
  _isInitialized = false;
  _interactivityChecker = inject(InteractivityChecker);
  _document = inject(DOCUMENT);
  constructor() {
    const styleLoader = inject(_CdkPrivateStyleLoader);
    styleLoader.load(_MatBadgeStyleLoader);
    styleLoader.load(_VisuallyHiddenLoader);
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      const nativeElement = this._elementRef.nativeElement;
      if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
        throw Error('matBadge must be attached to an element node.');
      }
      const tagName = inject(HOST_TAG_NAME);
      if (tagName.toLowerCase() === 'mat-icon' && nativeElement.getAttribute('aria-hidden') === 'true') {
        console.warn(`Detected a matBadge on an "aria-hidden" "<mat-icon>". ` + `Consider setting aria-hidden="false" in order to surface the information assistive technology.` + `\n${nativeElement.outerHTML}`);
      }
    }
  }
  isAbove() {
    return this.position.indexOf('below') === -1;
  }
  isAfter() {
    return this.position.indexOf('before') === -1;
  }
  getBadgeElement() {
    return this._badgeElement;
  }
  ngOnInit() {
    this._clearExistingBadges();
    if (this.content && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
      this._updateRenderedContent(this.content);
    }
    this._isInitialized = true;
  }
  ngOnDestroy() {
    if (this._renderer.destroyNode) {
      this._renderer.destroyNode(this._badgeElement);
      this._inlineBadgeDescription?.remove();
    }
    this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
  }
  _isHostInteractive() {
    return this._interactivityChecker.isFocusable(this._elementRef.nativeElement, {
      ignoreVisibility: true
    });
  }
  _createBadgeElement() {
    const badgeElement = this._renderer.createElement('span');
    const activeClass = 'mat-badge-active';
    badgeElement.setAttribute('id', this._idGenerator.getId('mat-badge-content-'));
    badgeElement.setAttribute('aria-hidden', 'true');
    badgeElement.classList.add(BADGE_CONTENT_CLASS);
    if (this._animationsDisabled) {
      badgeElement.classList.add('_mat-animation-noopable');
    }
    this._elementRef.nativeElement.appendChild(badgeElement);
    if (typeof requestAnimationFrame === 'function' && !this._animationsDisabled) {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          badgeElement.classList.add(activeClass);
        });
      });
    } else {
      badgeElement.classList.add(activeClass);
    }
    return badgeElement;
  }
  _updateRenderedContent(newContent) {
    const newContentNormalized = `${newContent ?? ''}`.trim();
    if (this._isInitialized && newContentNormalized && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
    }
    if (this._badgeElement) {
      this._badgeElement.textContent = newContentNormalized;
    }
    this._content = newContentNormalized;
  }
  _updateDescription(newDescription) {
    this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
    if (!newDescription || this._isHostInteractive()) {
      this._removeInlineDescription();
    }
    this._description = newDescription;
    if (this._isHostInteractive()) {
      this._ariaDescriber.describe(this._elementRef.nativeElement, newDescription);
    } else {
      this._updateInlineDescription();
    }
  }
  _updateInlineDescription() {
    if (!this._inlineBadgeDescription) {
      this._inlineBadgeDescription = this._document.createElement('span');
      this._inlineBadgeDescription.classList.add('cdk-visually-hidden');
    }
    this._inlineBadgeDescription.textContent = this.description;
    this._badgeElement?.appendChild(this._inlineBadgeDescription);
  }
  _removeInlineDescription() {
    this._inlineBadgeDescription?.remove();
    this._inlineBadgeDescription = undefined;
  }
  _setColor(colorPalette) {
    const classList = this._elementRef.nativeElement.classList;
    classList.remove(`mat-badge-${this._color}`);
    if (colorPalette) {
      classList.add(`mat-badge-${colorPalette}`);
    }
  }
  _clearExistingBadges() {
    const badges = this._elementRef.nativeElement.querySelectorAll(`:scope > .${BADGE_CONTENT_CLASS}`);
    for (const badgeElement of Array.from(badges)) {
      if (badgeElement !== this._badgeElement) {
        badgeElement.remove();
      }
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatBadge,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.3",
    type: MatBadge,
    isStandalone: true,
    selector: "[matBadge]",
    inputs: {
      color: ["matBadgeColor", "color"],
      overlap: ["matBadgeOverlap", "overlap", booleanAttribute],
      disabled: ["matBadgeDisabled", "disabled", booleanAttribute],
      position: ["matBadgePosition", "position"],
      content: ["matBadge", "content"],
      description: ["matBadgeDescription", "description"],
      size: ["matBadgeSize", "size"],
      hidden: ["matBadgeHidden", "hidden", booleanAttribute]
    },
    host: {
      properties: {
        "class.mat-badge-overlap": "overlap",
        "class.mat-badge-above": "isAbove()",
        "class.mat-badge-below": "!isAbove()",
        "class.mat-badge-before": "!isAfter()",
        "class.mat-badge-after": "isAfter()",
        "class.mat-badge-small": "size === \"small\"",
        "class.mat-badge-medium": "size === \"medium\"",
        "class.mat-badge-large": "size === \"large\"",
        "class.mat-badge-hidden": "hidden || !content",
        "class.mat-badge-disabled": "disabled"
      },
      classAttribute: "mat-badge"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatBadge,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matBadge]',
      host: {
        'class': 'mat-badge',
        '[class.mat-badge-overlap]': 'overlap',
        '[class.mat-badge-above]': 'isAbove()',
        '[class.mat-badge-below]': '!isAbove()',
        '[class.mat-badge-before]': '!isAfter()',
        '[class.mat-badge-after]': 'isAfter()',
        '[class.mat-badge-small]': 'size === "small"',
        '[class.mat-badge-medium]': 'size === "medium"',
        '[class.mat-badge-large]': 'size === "large"',
        '[class.mat-badge-hidden]': 'hidden || !content',
        '[class.mat-badge-disabled]': 'disabled'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    color: [{
      type: Input,
      args: ['matBadgeColor']
    }],
    overlap: [{
      type: Input,
      args: [{
        alias: 'matBadgeOverlap',
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        alias: 'matBadgeDisabled',
        transform: booleanAttribute
      }]
    }],
    position: [{
      type: Input,
      args: ['matBadgePosition']
    }],
    content: [{
      type: Input,
      args: ['matBadge']
    }],
    description: [{
      type: Input,
      args: ['matBadgeDescription']
    }],
    size: [{
      type: Input,
      args: ['matBadgeSize']
    }],
    hidden: [{
      type: Input,
      args: [{
        alias: 'matBadgeHidden',
        transform: booleanAttribute
      }]
    }]
  }
});

class MatBadgeModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatBadgeModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatBadgeModule,
    imports: [A11yModule, MatBadge, _MatBadgeStyleLoader],
    exports: [MatBadge, BidiModule]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatBadgeModule,
    imports: [A11yModule, BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatBadgeModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [A11yModule, MatBadge, _MatBadgeStyleLoader],
      exports: [MatBadge, BidiModule]
    }]
  }]
});

export { MatBadge, MatBadgeModule };
//# sourceMappingURL=badge.mjs.map

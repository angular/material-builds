import * as i0 from '@angular/core';
import { InjectionToken, inject, Input, ChangeDetectionStrategy, ViewEncapsulation, Component, Directive, NgModule } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';

const MAT_CARD_CONFIG = new InjectionToken('MAT_CARD_CONFIG');
class MatCard {
  appearance;
  constructor() {
    const config = inject(MAT_CARD_CONFIG, {
      optional: true
    });
    this.appearance = config?.appearance || 'raised';
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCard,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCard,
    isStandalone: true,
    selector: "mat-card",
    inputs: {
      appearance: "appearance"
    },
    host: {
      properties: {
        "class.mat-mdc-card-outlined": "appearance === \"outlined\"",
        "class.mdc-card--outlined": "appearance === \"outlined\"",
        "class.mat-mdc-card-filled": "appearance === \"filled\"",
        "class.mdc-card--filled": "appearance === \"filled\""
      },
      classAttribute: "mat-mdc-card mdc-card"
    },
    exportAs: ["matCard"],
    ngImport: i0,
    template: "<ng-content></ng-content>\n",
    styles: [".mat-mdc-card {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  position: relative;\n  border-style: solid;\n  border-width: 0;\n  background-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));\n  border-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));\n  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));\n  box-shadow: var(--mat-card-elevated-container-elevation, var(--mat-sys-level1));\n}\n.mat-mdc-card::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: solid 1px transparent;\n  content: \"\";\n  display: block;\n  pointer-events: none;\n  box-sizing: border-box;\n  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));\n}\n\n.mat-mdc-card-outlined {\n  background-color: var(--mat-card-outlined-container-color, var(--mat-sys-surface));\n  border-radius: var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));\n  border-width: var(--mat-card-outlined-outline-width, 1px);\n  border-color: var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));\n  box-shadow: var(--mat-card-outlined-container-elevation, var(--mat-sys-level0));\n}\n.mat-mdc-card-outlined::after {\n  border: none;\n}\n\n.mat-mdc-card-filled {\n  background-color: var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));\n  border-radius: var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));\n  box-shadow: var(--mat-card-filled-container-elevation, var(--mat-sys-level0));\n}\n\n.mdc-card__media {\n  position: relative;\n  box-sizing: border-box;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n}\n.mdc-card__media::before {\n  display: block;\n  content: \"\";\n}\n.mdc-card__media:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.mdc-card__media:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n\n.mat-mdc-card-actions {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  min-height: 52px;\n  padding: 8px;\n}\n\n.mat-mdc-card-title {\n  font-family: var(--mat-card-title-text-font, var(--mat-sys-title-large-font));\n  line-height: var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));\n  font-size: var(--mat-card-title-text-size, var(--mat-sys-title-large-size));\n  letter-spacing: var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));\n  font-weight: var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight));\n}\n\n.mat-mdc-card-subtitle {\n  color: var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));\n  line-height: var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));\n  font-size: var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));\n  letter-spacing: var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));\n  font-weight: var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight));\n}\n\n.mat-mdc-card-title,\n.mat-mdc-card-subtitle {\n  display: block;\n  margin: 0;\n}\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title,\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle {\n  padding: 16px 16px 0;\n}\n\n.mat-mdc-card-header {\n  display: flex;\n  padding: 16px 16px 0;\n}\n\n.mat-mdc-card-content {\n  display: block;\n  padding: 0 16px;\n}\n.mat-mdc-card-content:first-child {\n  padding-top: 16px;\n}\n.mat-mdc-card-content:last-child {\n  padding-bottom: 16px;\n}\n\n.mat-mdc-card-title-group {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n}\n\n.mat-mdc-card-avatar {\n  height: 40px;\n  width: 40px;\n  border-radius: 50%;\n  flex-shrink: 0;\n  margin-bottom: 16px;\n  object-fit: cover;\n}\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle,\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title {\n  line-height: normal;\n}\n\n.mat-mdc-card-sm-image {\n  width: 80px;\n  height: 80px;\n}\n\n.mat-mdc-card-md-image {\n  width: 112px;\n  height: 112px;\n}\n\n.mat-mdc-card-lg-image {\n  width: 152px;\n  height: 152px;\n}\n\n.mat-mdc-card-xl-image {\n  width: 240px;\n  height: 240px;\n}\n\n.mat-mdc-card-subtitle ~ .mat-mdc-card-title,\n.mat-mdc-card-title ~ .mat-mdc-card-subtitle,\n.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,\n.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,\n.mat-mdc-card-title-group .mat-mdc-card-title,\n.mat-mdc-card-title-group .mat-mdc-card-subtitle {\n  padding-top: 0;\n}\n\n.mat-mdc-card-content > :last-child:not(.mat-mdc-card-footer) {\n  margin-bottom: 0;\n}\n\n.mat-mdc-card-actions-align-end {\n  justify-content: flex-end;\n}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCard,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-card',
      host: {
        'class': 'mat-mdc-card mdc-card',
        '[class.mat-mdc-card-outlined]': 'appearance === "outlined"',
        '[class.mdc-card--outlined]': 'appearance === "outlined"',
        '[class.mat-mdc-card-filled]': 'appearance === "filled"',
        '[class.mdc-card--filled]': 'appearance === "filled"'
      },
      exportAs: 'matCard',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: "<ng-content></ng-content>\n",
      styles: [".mat-mdc-card {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  position: relative;\n  border-style: solid;\n  border-width: 0;\n  background-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));\n  border-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));\n  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));\n  box-shadow: var(--mat-card-elevated-container-elevation, var(--mat-sys-level1));\n}\n.mat-mdc-card::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: solid 1px transparent;\n  content: \"\";\n  display: block;\n  pointer-events: none;\n  box-sizing: border-box;\n  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));\n}\n\n.mat-mdc-card-outlined {\n  background-color: var(--mat-card-outlined-container-color, var(--mat-sys-surface));\n  border-radius: var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));\n  border-width: var(--mat-card-outlined-outline-width, 1px);\n  border-color: var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));\n  box-shadow: var(--mat-card-outlined-container-elevation, var(--mat-sys-level0));\n}\n.mat-mdc-card-outlined::after {\n  border: none;\n}\n\n.mat-mdc-card-filled {\n  background-color: var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));\n  border-radius: var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));\n  box-shadow: var(--mat-card-filled-container-elevation, var(--mat-sys-level0));\n}\n\n.mdc-card__media {\n  position: relative;\n  box-sizing: border-box;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: cover;\n}\n.mdc-card__media::before {\n  display: block;\n  content: \"\";\n}\n.mdc-card__media:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.mdc-card__media:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n\n.mat-mdc-card-actions {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  min-height: 52px;\n  padding: 8px;\n}\n\n.mat-mdc-card-title {\n  font-family: var(--mat-card-title-text-font, var(--mat-sys-title-large-font));\n  line-height: var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));\n  font-size: var(--mat-card-title-text-size, var(--mat-sys-title-large-size));\n  letter-spacing: var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));\n  font-weight: var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight));\n}\n\n.mat-mdc-card-subtitle {\n  color: var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));\n  line-height: var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));\n  font-size: var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));\n  letter-spacing: var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));\n  font-weight: var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight));\n}\n\n.mat-mdc-card-title,\n.mat-mdc-card-subtitle {\n  display: block;\n  margin: 0;\n}\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title,\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle {\n  padding: 16px 16px 0;\n}\n\n.mat-mdc-card-header {\n  display: flex;\n  padding: 16px 16px 0;\n}\n\n.mat-mdc-card-content {\n  display: block;\n  padding: 0 16px;\n}\n.mat-mdc-card-content:first-child {\n  padding-top: 16px;\n}\n.mat-mdc-card-content:last-child {\n  padding-bottom: 16px;\n}\n\n.mat-mdc-card-title-group {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n}\n\n.mat-mdc-card-avatar {\n  height: 40px;\n  width: 40px;\n  border-radius: 50%;\n  flex-shrink: 0;\n  margin-bottom: 16px;\n  object-fit: cover;\n}\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle,\n.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title {\n  line-height: normal;\n}\n\n.mat-mdc-card-sm-image {\n  width: 80px;\n  height: 80px;\n}\n\n.mat-mdc-card-md-image {\n  width: 112px;\n  height: 112px;\n}\n\n.mat-mdc-card-lg-image {\n  width: 152px;\n  height: 152px;\n}\n\n.mat-mdc-card-xl-image {\n  width: 240px;\n  height: 240px;\n}\n\n.mat-mdc-card-subtitle ~ .mat-mdc-card-title,\n.mat-mdc-card-title ~ .mat-mdc-card-subtitle,\n.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,\n.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,\n.mat-mdc-card-title-group .mat-mdc-card-title,\n.mat-mdc-card-title-group .mat-mdc-card-subtitle {\n  padding-top: 0;\n}\n\n.mat-mdc-card-content > :last-child:not(.mat-mdc-card-footer) {\n  margin-bottom: 0;\n}\n\n.mat-mdc-card-actions-align-end {\n  justify-content: flex-end;\n}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    appearance: [{
      type: Input
    }]
  }
});
class MatCardTitle {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardTitle,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardTitle,
    isStandalone: true,
    selector: "mat-card-title, [mat-card-title], [matCardTitle]",
    host: {
      classAttribute: "mat-mdc-card-title"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardTitle,
  decorators: [{
    type: Directive,
    args: [{
      selector: `mat-card-title, [mat-card-title], [matCardTitle]`,
      host: {
        'class': 'mat-mdc-card-title'
      }
    }]
  }]
});
class MatCardTitleGroup {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardTitleGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardTitleGroup,
    isStandalone: true,
    selector: "mat-card-title-group",
    host: {
      classAttribute: "mat-mdc-card-title-group"
    },
    ngImport: i0,
    template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"[mat-card-image], [matCardImage],\n                    [mat-card-sm-image], [matCardImageSmall],\n                    [mat-card-md-image], [matCardImageMedium],\n                    [mat-card-lg-image], [matCardImageLarge],\n                    [mat-card-xl-image], [matCardImageXLarge]\"></ng-content>\n<ng-content></ng-content>\n",
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardTitleGroup,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-card-title-group',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        'class': 'mat-mdc-card-title-group'
      },
      template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"[mat-card-image], [matCardImage],\n                    [mat-card-sm-image], [matCardImageSmall],\n                    [mat-card-md-image], [matCardImageMedium],\n                    [mat-card-lg-image], [matCardImageLarge],\n                    [mat-card-xl-image], [matCardImageXLarge]\"></ng-content>\n<ng-content></ng-content>\n"
    }]
  }]
});
class MatCardContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardContent,
    isStandalone: true,
    selector: "mat-card-content",
    host: {
      classAttribute: "mat-mdc-card-content"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-card-content',
      host: {
        'class': 'mat-mdc-card-content'
      }
    }]
  }]
});
class MatCardSubtitle {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardSubtitle,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardSubtitle,
    isStandalone: true,
    selector: "mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]",
    host: {
      classAttribute: "mat-mdc-card-subtitle"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardSubtitle,
  decorators: [{
    type: Directive,
    args: [{
      selector: `mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]`,
      host: {
        'class': 'mat-mdc-card-subtitle'
      }
    }]
  }]
});
class MatCardActions {
  align = 'start';
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardActions,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardActions,
    isStandalone: true,
    selector: "mat-card-actions",
    inputs: {
      align: "align"
    },
    host: {
      properties: {
        "class.mat-mdc-card-actions-align-end": "align === \"end\""
      },
      classAttribute: "mat-mdc-card-actions mdc-card__actions"
    },
    exportAs: ["matCardActions"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardActions,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-card-actions',
      exportAs: 'matCardActions',
      host: {
        'class': 'mat-mdc-card-actions mdc-card__actions',
        '[class.mat-mdc-card-actions-align-end]': 'align === "end"'
      }
    }]
  }],
  propDecorators: {
    align: [{
      type: Input
    }]
  }
});
class MatCardHeader {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardHeader,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardHeader,
    isStandalone: true,
    selector: "mat-card-header",
    host: {
      classAttribute: "mat-mdc-card-header"
    },
    ngImport: i0,
    template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-mdc-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n",
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardHeader,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-card-header',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        'class': 'mat-mdc-card-header'
      },
      template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-mdc-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n"
    }]
  }]
});
class MatCardFooter {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardFooter,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardFooter,
    isStandalone: true,
    selector: "mat-card-footer",
    host: {
      classAttribute: "mat-mdc-card-footer"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardFooter,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-card-footer',
      host: {
        'class': 'mat-mdc-card-footer'
      }
    }]
  }]
});
class MatCardImage {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardImage,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardImage,
    isStandalone: true,
    selector: "[mat-card-image], [matCardImage]",
    host: {
      classAttribute: "mat-mdc-card-image mdc-card__media"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardImage,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-card-image], [matCardImage]',
      host: {
        'class': 'mat-mdc-card-image mdc-card__media'
      }
    }]
  }]
});
class MatCardSmImage {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardSmImage,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardSmImage,
    isStandalone: true,
    selector: "[mat-card-sm-image], [matCardImageSmall]",
    host: {
      classAttribute: "mat-mdc-card-sm-image mdc-card__media"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardSmImage,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-card-sm-image], [matCardImageSmall]',
      host: {
        'class': 'mat-mdc-card-sm-image mdc-card__media'
      }
    }]
  }]
});
class MatCardMdImage {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardMdImage,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardMdImage,
    isStandalone: true,
    selector: "[mat-card-md-image], [matCardImageMedium]",
    host: {
      classAttribute: "mat-mdc-card-md-image mdc-card__media"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardMdImage,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-card-md-image], [matCardImageMedium]',
      host: {
        'class': 'mat-mdc-card-md-image mdc-card__media'
      }
    }]
  }]
});
class MatCardLgImage {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardLgImage,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardLgImage,
    isStandalone: true,
    selector: "[mat-card-lg-image], [matCardImageLarge]",
    host: {
      classAttribute: "mat-mdc-card-lg-image mdc-card__media"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardLgImage,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-card-lg-image], [matCardImageLarge]',
      host: {
        'class': 'mat-mdc-card-lg-image mdc-card__media'
      }
    }]
  }]
});
class MatCardXlImage {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardXlImage,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardXlImage,
    isStandalone: true,
    selector: "[mat-card-xl-image], [matCardImageXLarge]",
    host: {
      classAttribute: "mat-mdc-card-xl-image mdc-card__media"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardXlImage,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-card-xl-image], [matCardImageXLarge]',
      host: {
        'class': 'mat-mdc-card-xl-image mdc-card__media'
      }
    }]
  }]
});
class MatCardAvatar {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardAvatar,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatCardAvatar,
    isStandalone: true,
    selector: "[mat-card-avatar], [matCardAvatar]",
    host: {
      classAttribute: "mat-mdc-card-avatar"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardAvatar,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-card-avatar], [matCardAvatar]',
      host: {
        'class': 'mat-mdc-card-avatar'
      }
    }]
  }]
});

const CARD_DIRECTIVES = [MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage];
class MatCardModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardModule,
    imports: [MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage],
    exports: [MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage, BidiModule]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatCardModule,
    imports: [BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatCardModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: CARD_DIRECTIVES,
      exports: [CARD_DIRECTIVES, BidiModule]
    }]
  }]
});

export { MAT_CARD_CONFIG, MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardModule, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage };
//# sourceMappingURL=card.mjs.map

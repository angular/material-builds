import { HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';

class MatDrawerHarnessBase extends ContentContainerComponentHarness {
  async isOpen() {
    return (await this.host()).hasClass('mat-drawer-opened');
  }
  async getPosition() {
    const host = await this.host();
    return (await host.hasClass('mat-drawer-end')) ? 'end' : 'start';
  }
  async getMode() {
    const host = await this.host();
    if (await host.hasClass('mat-drawer-push')) {
      return 'push';
    }
    if (await host.hasClass('mat-drawer-side')) {
      return 'side';
    }
    return 'over';
  }
}
class MatDrawerHarness extends MatDrawerHarnessBase {
  static hostSelector = '.mat-drawer';
  static with(options = {}) {
    return new HarnessPredicate(MatDrawerHarness, options).addOption('position', options.position, async (harness, position) => (await harness.getPosition()) === position);
  }
}

class MatDrawerContentHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-drawer-content';
  static with(options = {}) {
    return new HarnessPredicate(MatDrawerContentHarness, options);
  }
}

class MatDrawerContainerHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-drawer-container';
  static with(options = {}) {
    return new HarnessPredicate(MatDrawerContainerHarness, options);
  }
  async getDrawers(filter = {}) {
    return this.locatorForAll(MatDrawerHarness.with(filter))();
  }
  async getContent() {
    return this.locatorFor(MatDrawerContentHarness)();
  }
}

class MatSidenavContentHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-sidenav-content';
  static with(options = {}) {
    return new HarnessPredicate(MatSidenavContentHarness, options);
  }
}

class MatSidenavHarness extends MatDrawerHarnessBase {
  static hostSelector = '.mat-sidenav';
  static with(options = {}) {
    return new HarnessPredicate(MatSidenavHarness, options).addOption('position', options.position, async (harness, position) => (await harness.getPosition()) === position);
  }
  async isFixedInViewport() {
    return (await this.host()).hasClass('mat-sidenav-fixed');
  }
}

class MatSidenavContainerHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-sidenav-container';
  static with(options = {}) {
    return new HarnessPredicate(MatSidenavContainerHarness, options);
  }
  async getSidenavs(filter = {}) {
    return this.locatorForAll(MatSidenavHarness.with(filter))();
  }
  async getContent() {
    return this.locatorFor(MatSidenavContentHarness)();
  }
}

export { MatDrawerContainerHarness, MatDrawerContentHarness, MatDrawerHarness, MatSidenavContainerHarness, MatSidenavContentHarness, MatSidenavHarness };
//# sourceMappingURL=sidenav-testing.mjs.map

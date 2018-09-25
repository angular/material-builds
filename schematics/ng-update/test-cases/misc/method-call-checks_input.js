"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FocusMonitor {
    monitor(_htmlElement, _renderer, _checkChildren) { }
}
class A {
    constructor(focusMonitor, elementRef, renderer) {
        this.focusMonitor = focusMonitor;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.self = { a: this.focusMonitor };
    }
    ngAfterViewInit() {
        this.focusMonitor.monitor(this.elementRef.nativeElement, this.renderer, true);
        this.self.a.monitor(this.elementRef.nativeElement, this.renderer, true);
    }
}
//# sourceMappingURL=method-call-checks_input.js.map
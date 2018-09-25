/*
 * Fake definitions because the property name rules can only determine the host type
 * properly by using type checking.
 */
class Platform {
}
class NativeDateAdapter {
    constructor(_locale, _platform) { }
}
class MatAutocomplete {
    constructor(_changeDetector, _elementRef, _defaults) { }
}
class NonMaterialClass {
}
const _t1 = new NativeDateAdapter('b', 'invalid-argument');
const _t2 = new NativeDateAdapter('a', { IOS: true });
const _t3 = new NonMaterialClass('invalid-argument');
class MatTooltip {
    constructor(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _focusMonitor, _scrollStrategy, _dir, _defaultOptions) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
        this._platform = _platform;
        this._ariaDescriber = _ariaDescriber;
        this._focusMonitor = _focusMonitor;
        this._scrollStrategy = _scrollStrategy;
        this._dir = _dir;
        this._defaultOptions = _defaultOptions;
    }
}
class MatIconRegistry {
    constructor(_httpClient, _sanitizer, _document) { }
}
class MatCalendar {
    constructor(_intl, _adapter, _formats, _changeDetector) { }
}
class MatDrawerContent {
    constructor(_cd, _container, _elementRef, _scrollDispatcher, _ngZone) { }
}
class MatSidenavContent {
    constructor(_cd, _container, _elementRef, _scrollDispatcher, _ngZone) { }
}
class ExtendedDateAdapter extends NativeDateAdapter {
}
/* Actual test case using the previously defined definitions. */
class A extends NativeDateAdapter {
    constructor() {
        super('hardCodedLocale');
    }
}
const _A = new NativeDateAdapter('myLocale');
class B extends MatAutocomplete {
    constructor(cd, elementRef) {
        super(cd, elementRef);
    }
}
const _B = new MatAutocomplete({}, {});
class C extends MatTooltip {
    constructor(a, b, c, d, e, f, g, h, i, j) {
        super(a, b, c, d, e, f, g, h, i, j);
    }
}
const _C = new MatTooltip({}, {}, {}, {}, {}, {}, {}, {}, {}, {});
class D extends MatIconRegistry {
    constructor(httpClient, sanitizer) {
        super(httpClient, sanitizer);
    }
}
const _D = new MatIconRegistry({}, {});
class E extends MatCalendar {
    constructor(elementRef, intl, zone, adapter, formats, cd, dir) {
        super(elementRef, intl, zone, adapter, formats, cd, dir);
    }
}
const _E = new MatCalendar({}, {}, {}, {}, {}, {}, {});
class F extends MatDrawerContent {
    constructor(changeDetectorRef, container) {
        super(changeDetectorRef, container);
    }
}
const _F = new MatDrawerContent({}, 'container');
class G extends MatSidenavContent {
    constructor(changeDetectorRef, container) {
        super(changeDetectorRef, container);
    }
}
const _G = new MatSidenavContent({}, 'container');
class H extends ExtendedDateAdapter {
    constructor() {
        super('myLocale');
    }
}
const _H = new ExtendedDateAdapter('myLocale');
//# sourceMappingURL=constructor-checks_input.js.map
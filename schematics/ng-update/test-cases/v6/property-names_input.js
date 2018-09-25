/*
 * Fake definitions because the property name rules can only determine the host type
 * properly by using type checking.
 */
class MatSelect {
}
class MatRadioGroup {
}
class MatSnackBarConfig {
}
class MatDrawer {
}
/* Actual test case using the previously defined definitions. */
class A {
    constructor(a, c, e) {
        this.a = a;
        this.c = c;
        this.e = e;
        this.self = { me: this };
    }
    onClick() {
        this.a.change.subscribe(() => console.log('On Change'));
        this.a.onOpen.subscribe(() => console.log('On Open'));
        this.a.onClose.subscribe(() => console.log('On Close'));
        this.b.align = 'end';
        this.c.extraClasses = ['x', 'y', 'z'];
        this.e.align = 'end';
        this.e.onAlignChanged.subscribe(() => console.log('Align Changed'));
        this.e.onOpen.subscribe(() => console.log('Open'));
        this.e.onClose.subscribe(() => console.log('Close'));
    }
}
//# sourceMappingURL=property-names_input.js.map
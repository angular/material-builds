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
        this.a.selectionChange.subscribe(() => console.log('On Change'));
        this.a.openedChange.pipe(filter(isOpen => isOpen)).subscribe(() => console.log('On Open'));
        this.a.openedChange.pipe(filter(isOpen => !isOpen)).subscribe(() => console.log('On Close'));
        this.b.labelPosition = 'end';
        this.c.panelClass = ['x', 'y', 'z'];
        this.e.position = 'end';
        this.e.onPositionChanged.subscribe(() => console.log('Align Changed'));
        this.e.openedChange.pipe(filter(isOpen => isOpen)).subscribe(() => console.log('Open'));
        this.e.openedChange.pipe(filter(isOpen => !isOpen)).subscribe(() => console.log('Close'));
    }
}
//# sourceMappingURL=property-names_expected_output.js.map
;
/**
 * Configuration for opening a modal dialog with the MdDialog service.
 */
export var MdDialogConfig = (function () {
    function MdDialogConfig() {
        /** The ARIA role of the dialog element. */
        this.role = 'dialog';
        /** Whether the user can use escape or clicking outside to close a modal. */
        this.disableClose = false;
        /** Width of the dialog. */
        this.width = '';
        /** Height of the dialog. */
        this.height = '';
    }
    return MdDialogConfig;
}());
//# sourceMappingURL=dialog-config.js.map
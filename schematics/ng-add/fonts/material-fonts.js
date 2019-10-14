/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-add/fonts/material-fonts", ["require", "exports", "@angular-devkit/schematics", "@angular/cdk/schematics", "@schematics/angular/utility/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    const config_1 = require("@schematics/angular/utility/config");
    /** Adds the Material Design fonts to the index HTML file. */
    function addFontsToIndex(options) {
        return (host) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            const projectIndexFiles = schematics_2.getProjectIndexFiles(project);
            if (!projectIndexFiles.length) {
                throw new schematics_1.SchematicsException('No project index HTML file could be found.');
            }
            const fonts = [
                'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
            ];
            fonts.forEach(f => {
                projectIndexFiles.forEach(indexFilePath => {
                    schematics_2.appendHtmlElementToHead(host, indexFilePath, `<link href="${f}" rel="stylesheet">`);
                });
            });
            return host;
        };
    }
    exports.addFontsToIndex = addFontsToIndex;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZm9udHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvZm9udHMvbWF0ZXJpYWwtZm9udHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwyREFBcUU7SUFDckUsd0RBSWlDO0lBQ2pDLCtEQUFnRTtJQUdoRSw2REFBNkQ7SUFDN0QsU0FBZ0IsZUFBZSxDQUFDLE9BQWU7UUFDN0MsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLGlCQUFpQixHQUFHLGlDQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXhELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO2FBQzdFO1lBRUQsTUFBTSxLQUFLLEdBQUc7Z0JBQ1oseUVBQXlFO2dCQUN6RSx5REFBeUQ7YUFDMUQsQ0FBQztZQUVGLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hCLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDeEMsb0NBQXVCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDdEYsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQXZCRCwwQ0F1QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhcHBlbmRIdG1sRWxlbWVudFRvSGVhZCxcbiAgZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2UsXG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NvbmZpZyc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcblxuLyoqIEFkZHMgdGhlIE1hdGVyaWFsIERlc2lnbiBmb250cyB0byB0aGUgaW5kZXggSFRNTCBmaWxlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEZvbnRzVG9JbmRleChvcHRpb25zOiBTY2hlbWEpOiAoaG9zdDogVHJlZSkgPT4gVHJlZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHByb2plY3RJbmRleEZpbGVzID0gZ2V0UHJvamVjdEluZGV4RmlsZXMocHJvamVjdCk7XG5cbiAgICBpZiAoIXByb2plY3RJbmRleEZpbGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ05vIHByb2plY3QgaW5kZXggSFRNTCBmaWxlIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvbnRzID0gW1xuICAgICAgJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Sb2JvdG86MzAwLDQwMCw1MDAmZGlzcGxheT1zd2FwJyxcbiAgICAgICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2ljb24/ZmFtaWx5PU1hdGVyaWFsK0ljb25zJyxcbiAgICBdO1xuXG4gICAgZm9udHMuZm9yRWFjaChmID0+IHtcbiAgICAgIHByb2plY3RJbmRleEZpbGVzLmZvckVhY2goaW5kZXhGaWxlUGF0aCA9PiB7XG4gICAgICAgIGFwcGVuZEh0bWxFbGVtZW50VG9IZWFkKGhvc3QsIGluZGV4RmlsZVBhdGgsIGA8bGluayBocmVmPVwiJHtmfVwiIHJlbD1cInN0eWxlc2hlZXRcIj5gKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG4iXX0=
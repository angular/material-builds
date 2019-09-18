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
        define("@angular/material/schematics/ng-add/package-config", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Sorts the keys of the given object.
     * @returns A new object instance with sorted keys
     */
    function sortObjectByKeys(obj) {
        return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {});
    }
    /** Adds a package to the package.json in the given host tree. */
    function addPackageToPackageJson(host, pkg, version) {
        if (host.exists('package.json')) {
            const sourceText = host.read('package.json').toString('utf-8');
            const json = JSON.parse(sourceText);
            if (!json.dependencies) {
                json.dependencies = {};
            }
            if (!json.dependencies[pkg]) {
                json.dependencies[pkg] = version;
                json.dependencies = sortObjectByKeys(json.dependencies);
            }
            host.overwrite('package.json', JSON.stringify(json, null, 2));
        }
        return host;
    }
    exports.addPackageToPackageJson = addPackageToPackageJson;
    /** Gets the version of the specified package by looking at the package.json in the given tree. */
    function getPackageVersionFromPackageJson(tree, name) {
        if (!tree.exists('package.json')) {
            return null;
        }
        const packageJson = JSON.parse(tree.read('package.json').toString('utf8'));
        if (packageJson.dependencies && packageJson.dependencies[name]) {
            return packageJson.dependencies[name];
        }
        return null;
    }
    exports.getPackageVersionFromPackageJson = getPackageVersionFromPackageJson;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvcGFja2FnZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFJSDs7O09BR0c7SUFDSCxTQUFTLGdCQUFnQixDQUFDLEdBQVc7UUFDbkMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRUQsaUVBQWlFO0lBQ2pFLFNBQWdCLHVCQUF1QixDQUFDLElBQVUsRUFBRSxHQUFXLEVBQUUsT0FBZTtRQUU5RSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7YUFDeEI7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3pEO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFuQkQsMERBbUJDO0lBRUQsa0dBQWtHO0lBQ2xHLFNBQWdCLGdDQUFnQyxDQUFDLElBQVUsRUFBRSxJQUFZO1FBQ3ZFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFNUUsSUFBSSxXQUFXLENBQUMsWUFBWSxJQUFJLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUQsT0FBTyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBWkQsNEVBWUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5cbi8qKlxuICogU29ydHMgdGhlIGtleXMgb2YgdGhlIGdpdmVuIG9iamVjdC5cbiAqIEByZXR1cm5zIEEgbmV3IG9iamVjdCBpbnN0YW5jZSB3aXRoIHNvcnRlZCBrZXlzXG4gKi9cbmZ1bmN0aW9uIHNvcnRPYmplY3RCeUtleXMob2JqOiBvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuc29ydCgpLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IChyZXN1bHRba2V5XSA9IG9ialtrZXldKSAmJiByZXN1bHQsIHt9KTtcbn1cblxuLyoqIEFkZHMgYSBwYWNrYWdlIHRvIHRoZSBwYWNrYWdlLmpzb24gaW4gdGhlIGdpdmVuIGhvc3QgdHJlZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihob3N0OiBUcmVlLCBwa2c6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nKTogVHJlZSB7XG5cbiAgaWYgKGhvc3QuZXhpc3RzKCdwYWNrYWdlLmpzb24nKSkge1xuICAgIGNvbnN0IHNvdXJjZVRleHQgPSBob3N0LnJlYWQoJ3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmLTgnKTtcbiAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZShzb3VyY2VUZXh0KTtcblxuICAgIGlmICghanNvbi5kZXBlbmRlbmNpZXMpIHtcbiAgICAgIGpzb24uZGVwZW5kZW5jaWVzID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFqc29uLmRlcGVuZGVuY2llc1twa2ddKSB7XG4gICAgICBqc29uLmRlcGVuZGVuY2llc1twa2ddID0gdmVyc2lvbjtcbiAgICAgIGpzb24uZGVwZW5kZW5jaWVzID0gc29ydE9iamVjdEJ5S2V5cyhqc29uLmRlcGVuZGVuY2llcyk7XG4gICAgfVxuXG4gICAgaG9zdC5vdmVyd3JpdGUoJ3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDIpKTtcbiAgfVxuXG4gIHJldHVybiBob3N0O1xufVxuXG4vKiogR2V0cyB0aGUgdmVyc2lvbiBvZiB0aGUgc3BlY2lmaWVkIHBhY2thZ2UgYnkgbG9va2luZyBhdCB0aGUgcGFja2FnZS5qc29uIGluIHRoZSBnaXZlbiB0cmVlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBhY2thZ2VWZXJzaW9uRnJvbVBhY2thZ2VKc29uKHRyZWU6IFRyZWUsIG5hbWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXRyZWUuZXhpc3RzKCdwYWNrYWdlLmpzb24nKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZCgncGFja2FnZS5qc29uJykhLnRvU3RyaW5nKCd1dGY4JykpO1xuXG4gIGlmIChwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgJiYgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW25hbWVdKSB7XG4gICAgcmV0dXJuIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tuYW1lXTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIl19
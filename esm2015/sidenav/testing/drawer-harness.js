/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-drawer in tests. */
export class MatDrawerHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a drawer with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options)
            .addOption('position', options.position, (harness, position) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getPosition()) === position; }));
    }
    /** Gets whether the drawer is open. */
    isOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-drawer-opened');
        });
    }
    /** Gets the position of the drawer inside its container. */
    getPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.hasClass('mat-drawer-end')) ? 'end' : 'start';
        });
    }
    /** Gets the mode that the drawer is in. */
    getMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            if (yield host.hasClass('mat-drawer-push')) {
                return 'push';
            }
            if (yield host.hasClass('mat-drawer-side')) {
                return 'side';
            }
            return 'over';
        });
    }
}
MatDrawerHarness.hostSelector = '.mat-drawer';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi90ZXN0aW5nL2RyYXdlci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUd4RSxtRUFBbUU7QUFDbkUsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdCQUFnQjtJQUdwRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDO2FBQ2pELFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFDbkMsQ0FBTyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsZ0RBQUMsT0FBQSxDQUFDLE1BQU0sT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssUUFBUSxDQUFBLEdBQUEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCx1Q0FBdUM7SUFDakMsTUFBTTs7WUFDVixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUMzRCxDQUFDO0tBQUE7SUFFRCw0REFBNEQ7SUFDdEQsV0FBVzs7WUFDZixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDbkUsQ0FBQztLQUFBO0lBRUQsMkNBQTJDO0lBQ3JDLE9BQU87O1lBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFL0IsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDMUMsT0FBTyxNQUFNLENBQUM7YUFDZjtZQUVELElBQUksTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQzFDLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFFRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO0tBQUE7O0FBdENNLDZCQUFZLEdBQUcsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtEcmF3ZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kcmF3ZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtZHJhd2VyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdERyYXdlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWRyYXdlcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgZHJhd2VyIHdpdGhcbiAgICogc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2guXG4gICAqIEByZXR1cm4gYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IERyYXdlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdERyYXdlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0RHJhd2VySGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbigncG9zaXRpb24nLCBvcHRpb25zLnBvc2l0aW9uLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIHBvc2l0aW9uKSA9PiAoYXdhaXQgaGFybmVzcy5nZXRQb3NpdGlvbigpKSA9PT0gcG9zaXRpb24pO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgZHJhd2VyIGlzIG9wZW4uICovXG4gIGFzeW5jIGlzT3BlbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWRyYXdlci1vcGVuZWQnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgZHJhd2VyIGluc2lkZSBpdHMgY29udGFpbmVyLiAqL1xuICBhc3luYyBnZXRQb3NpdGlvbigpOiBQcm9taXNlPCdzdGFydCd8J2VuZCc+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtZHJhd2VyLWVuZCcpKSA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtb2RlIHRoYXQgdGhlIGRyYXdlciBpcyBpbi4gKi9cbiAgYXN5bmMgZ2V0TW9kZSgpOiBQcm9taXNlPCdvdmVyJ3wncHVzaCd8J3NpZGUnPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuXG4gICAgaWYgKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1kcmF3ZXItcHVzaCcpKSB7XG4gICAgICByZXR1cm4gJ3B1c2gnO1xuICAgIH1cblxuICAgIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtZHJhd2VyLXNpZGUnKSkge1xuICAgICAgcmV0dXJuICdzaWRlJztcbiAgICB9XG5cbiAgICByZXR1cm4gJ292ZXInO1xuICB9XG59XG4iXX0=
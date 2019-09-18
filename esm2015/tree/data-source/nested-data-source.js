/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Data source for nested tree.
 *
 * The data source for nested tree doesn't have to consider node flattener, or the way to expand
 * or collapse. The expansion/collapsion will be handled by TreeControl and each non-leaf node.
 * @template T
 */
export class MatTreeNestedDataSource extends DataSource {
    constructor() {
        super(...arguments);
        this._data = new BehaviorSubject([]);
    }
    /**
     * Data for the nested tree
     * @return {?}
     */
    get data() { return this._data.value; }
    /**
     * @param {?} value
     * @return {?}
     */
    set data(value) { this._data.next(value); }
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    connect(collectionViewer) {
        return merge(...[collectionViewer.viewChange, this._data])
            .pipe(map((/**
         * @return {?}
         */
        () => {
            return this.data;
        })));
    }
    /**
     * @return {?}
     */
    disconnect() {
        // no op
    }
}
if (false) {
    /** @type {?} */
    MatTreeNestedDataSource.prototype._data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLWRhdGEtc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvZGF0YS1zb3VyY2UvbmVzdGVkLWRhdGEtc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFtQixVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsZUFBZSxFQUFFLEtBQUssRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7O0FBU25DLE1BQU0sT0FBTyx1QkFBMkIsU0FBUSxVQUFhO0lBQTdEOztRQUNFLFVBQUssR0FBRyxJQUFJLGVBQWUsQ0FBTSxFQUFFLENBQUMsQ0FBQztJQWtCdkMsQ0FBQzs7Ozs7SUFiQyxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDdkMsSUFBSSxJQUFJLENBQUMsS0FBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFFaEQsT0FBTyxDQUFDLGdCQUFrQztRQUN4QyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN2RCxJQUFJLENBQUMsR0FBRzs7O1FBQUMsR0FBRyxFQUFFO1lBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDUixDQUFDOzs7O0lBRUQsVUFBVTtRQUNSLFFBQVE7SUFDVixDQUFDO0NBQ0Y7OztJQWxCQyx3Q0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb2xsZWN0aW9uVmlld2VyLCBEYXRhU291cmNlfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIG1lcmdlLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuLyoqXG4gKiBEYXRhIHNvdXJjZSBmb3IgbmVzdGVkIHRyZWUuXG4gKlxuICogVGhlIGRhdGEgc291cmNlIGZvciBuZXN0ZWQgdHJlZSBkb2Vzbid0IGhhdmUgdG8gY29uc2lkZXIgbm9kZSBmbGF0dGVuZXIsIG9yIHRoZSB3YXkgdG8gZXhwYW5kXG4gKiBvciBjb2xsYXBzZS4gVGhlIGV4cGFuc2lvbi9jb2xsYXBzaW9uIHdpbGwgYmUgaGFuZGxlZCBieSBUcmVlQ29udHJvbCBhbmQgZWFjaCBub24tbGVhZiBub2RlLlxuICovXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5lc3RlZERhdGFTb3VyY2U8VD4gZXh0ZW5kcyBEYXRhU291cmNlPFQ+IHtcbiAgX2RhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFRbXT4oW10pO1xuXG4gIC8qKlxuICAgKiBEYXRhIGZvciB0aGUgbmVzdGVkIHRyZWVcbiAgICovXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YS52YWx1ZTsgfVxuICBzZXQgZGF0YSh2YWx1ZTogVFtdKSB7IHRoaXMuX2RhdGEubmV4dCh2YWx1ZSk7IH1cblxuICBjb25uZWN0KGNvbGxlY3Rpb25WaWV3ZXI6IENvbGxlY3Rpb25WaWV3ZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xuICAgIHJldHVybiBtZXJnZSguLi5bY29sbGVjdGlvblZpZXdlci52aWV3Q2hhbmdlLCB0aGlzLl9kYXRhXSlcbiAgICAgIC5waXBlKG1hcCgoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICB9KSk7XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIC8vIG5vIG9wXG4gIH1cbn1cblxuIl19
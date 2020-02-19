<h2>
	For the latest Angular, added table service, use for the latest angular2 or above versions
</h2>

Angular service for simple data table with ngb-paginator. 

And add sort directive.
<a href="https://github.com/lmnguyenbt/sort-table-advance">Sort Table Advance</a>

First you need to create html:
```html
<table class="table table-bordered">
    <thead class="bg-grayish">
        <tr>
            <th class="sort" sortable-column [sortKey]="'sort key name'" [sortParams]="tableService.sortParams"
                (sortFunc)="tableService.sortAction($event)"
                [columnName]="column head name"></th>
        </tr>
    </thead>
</table>

<div class="row normal-pagination" *ngIf="list.items.length > 0">
    <div class="col-md-6 padding-lr-0">
        <div class="pagination-content">
            <div class="col-md-6">
                <span>
                    {{tableService.from}} - {{ tableService.to }} /{{tableService.totalRecord}} items
                </span>
                <select class="form-control pagination-item-select" [(ngModel)]="tableService.pageSize" (change)="tableService.changePageSize()">
                    <option *ngFor="let option of tableService.itemPerPageSizes" [ngValue]="option">{{option}}</option>
                </select>
            </div>
        </div>
    </div>
    <div class="col-md-6 padding-lr-0">
        <div class="text-right">
            <ngb-pagination class="d-flex justify-content-end" 
                            (pageChange)="tableService.changePage($event)"
                            [pageSize]="tableService.pageSize"
                            [collectionSize]="tableService.totalRecord"
                            [(page)]="tableService.currentPage" 
                            [maxSize]="tableService.maxSize"
                            [rotate]="true" [boundaryLinks]="true">          
            </ngb-pagination>
        </div>
    </div>
</div>

```ts
constructor(public tableService: TableService, private httpService: HttpService) {
        this.tableService.context = this;
        this.tableService.searchForm = this.searchForm;
        this.tableService.getFuncName = 'getList';
}

getList() {
    const params = this.tableService.getFilter();

    Object.keys(params).forEach((key) => {
        (params[key] === null || params[key] === '') && delete params[key];
    });

    this.httpService.get[Name]List(params).subscribe((res) => {
        try {
            this.tableService.matchPagingOption(res);
        } catch ( e ) {
            console.log(e);
        }
    });
}


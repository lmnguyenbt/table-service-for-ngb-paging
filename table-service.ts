import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable()
export class TableService {
	public context: any;
	public getFnDataLst: any;
	public searchForm: FormGroup;
	public itemPerPageSizes: number[];
	public pageSize: number;
	public maxSize: number;
	public totalRecord: number;
	public totalPage: number;
	public currentPage: number;
	public from: number;
	public to: number;

	// Keep Filter
	private routerActivated: any;
	private routerCurrent: any;

	constructor( private router: Router,
	             itemPerPageSizes: number[] = [ 15, 30, 50, 100 ],
	             pageSize: number = 15, maxSize: number = 5,
	             currentPage: number = 1, from: number = 0,
	             to: number = 0, totalRecord: number = 0, totalPage: number = 1 ) {
		this.itemPerPageSizes = itemPerPageSizes;
		this.pageSize = pageSize;
		this.maxSize = maxSize;
		this.currentPage = currentPage;
		this.from = from;
		this.to = to;
		this.totalRecord = totalRecord;
		this.totalPage = totalPage;
	}

	get params(): object {
		return {
			page: this.currentPage,
			size: this.pageSize
		};
	}

	get totalItems(): number {
		return this.totalRecord;
	}

	set totalItems( newValue: number ) {
		this.totalRecord = newValue;
		this.from = ( ( this.currentPage - 1 ) * this.pageSize ) + 1;
		this.to = this.totalItems <= ( this.pageSize * this.currentPage ) ? this.totalItems : ( this.pageSize * this.currentPage );
	}

	public changePage( index ) {
		this.currentPage = index;

		if ( this.searchForm ) {
			// If need code for case
		}

		this.saveFilter();

		return this.getFnDataLst();
	}

	public changePageSize() {
		this.currentPage = 1;

		if ( this.searchForm ) {
			// If need code for case
		}

		return this.getFnDataLst();
	}

	public searchAction() {
		this.currentPage = 1;
		this.saveFilter();

		return this.getFnDataLst();
	}

	public resestAction() {
		this.currentPage = 1;
		this.searchForm.reset();
		this.saveFilter();

		return this.getFnDataLst();
	}

	// Keep Filter
	private getRouter() {
		// Get current router
		return (this.router.url).split('/')[2]; // Can change with url for you
	}

	public saveRouter() {
		this.routerCurrent = this.getRouter();
		this.routerActivated = sessionStorage.getItem('router_activated');

		if ( this.routerActivated === 'null' || (this.routerActivated !== this.routerCurrent) ) {
			sessionStorage.setItem('router_activated', this.routerCurrent);
		}
	}

	private clearFilter() {
		this.routerCurrent = this.getRouter();
		this.routerActivated = sessionStorage.getItem('router_activated');

		if ( this.routerActivated !== this.routerCurrent ) {
			sessionStorage.setItem('filter', 'null');
		}
	}

	public getFilter() {
		this.clearFilter();
		this.saveRouter();

		const filter = sessionStorage.getItem('filter');

		if ( filter && filter !== 'null' ) {
			if ( this.routerActivated === this.routerCurrent ) {
				// update filter
				this.updateFilter();
			}

			const updateFilter = sessionStorage.getItem('filter');
			const params = JSON.parse(updateFilter);
			this.searchForm.patchValue(params);

			return params;
		} else {
			return { ...this.params, ...this.searchForm.value };
		}
	}

	private updateFilter() {
		if ( this.filterEmpty() ) {
			const params = { ...this.params, ...this.searchForm.value };
			sessionStorage.setItem('filter', JSON.stringify(params));
		}
	}

	private saveFilter() {
		if ( this.filterEmpty() ) {
			// Router
			this.saveRouter();

			const params = { ...this.params, ...this.searchForm.value };
			sessionStorage.setItem('filter', JSON.stringify(params));
		} else {
			sessionStorage.setItem('filter', 'null');
		}
	}

	private filterEmpty() {
		let flag = false;

		// Check case use for table have not search filter
		if ( this.searchForm ) {
			Object.keys( this.searchForm.value ).forEach( ( key ) => {
				if ( this.searchForm.value[key] && this.searchForm.value[key] !== 'null' ) {
					flag = true;
				}
			} );
		}

		return flag;
	}
}

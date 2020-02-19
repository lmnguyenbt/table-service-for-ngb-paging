import { Injectable } from '@angular/core';
import { FormGroup }  from '@angular/forms';
import { Router }     from '@angular/router';
import { BrowserService } from './browser.service';

@Injectable()
export class TableServiceBK {
	public context: any;
	public getFuncName: string;
	public searchForm: FormGroup;
	public itemPerPageSizes: number[];
	public pageSize: number;
	public maxSize: number;
	public totalRecord: number;
	public totalPage: number;
	public currentPage: number;
	public from: number;
	public to: number;
	public sort_key: string;
	public sort_direction: string;

	// Keep Filter
	private routerActivated: any;
	private routerCurrent: any;

	constructor( private router: Router, private browserService: BrowserService ) {
		this.itemPerPageSizes = [ 15, 30, 50, 100 ];
		this.pageSize = 15;
		this.maxSize = 5;
		this.currentPage = 1;
		this.from = 0;
		this.to = 0;
		this.totalRecord = 0;
		this.totalPage = 1;
		this.sort_key = 'created_at';
		this.sort_direction = 'desc';
	}

	get params(): object {
		return {
			currentPage: this.currentPage,
			pageSize: this.pageSize
		};
	}

	get sortParams(): object {
		return {
			sort_key: this.sort_key,
			sort_direction: this.sort_direction
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

	// Mapping object paging option from DB
	public matchPagingOption(options) {
		try {
			this.totalItems = parseInt(options['total_record']);
			this.pageSize = parseInt(options['length']);
			this.totalPage = parseInt(options['total_page']);
			this.totalRecord = parseInt(options['total_record']);
			this.currentPage = parseInt(options['page']);
		} catch ( e ) {
			console.log('pagination', e);
		}
	}

	public changePage( index ) {
		this.currentPage = index;

		if ( this.searchForm ) {
			// If need code for case
		}

		this.saveFilter();

		return this.context[this.getFuncName]();
	}

	public changePageSize() {
		this.currentPage = 1;

		if ( this.searchForm ) {
			// If need code for case
		}

		return this.context[this.getFuncName]();
	}

	public searchAction() {
		this.currentPage = 1;
		this.saveFilter();

		return this.context[this.getFuncName]();
	}

	public resetAction() {
		this.currentPage = 1;
		this.searchForm.reset();
		this.saveFilter();

		return this.context[this.getFuncName]();
	}

	public sortAction(newValue) {
		this.sort_key = newValue['sort_key'];
		this.sort_direction = newValue['sort_direction'];

		return this.context[this.getFuncName]();
	}

	// Keep Filter
	private getRouter() {
		// Get current router
		return ( this.router.url ).split( '/' )[2]; // Can change with url for you
	}

	public saveRouter() {
		this.routerCurrent = this.getRouter();
		this.routerActivated = sessionStorage.getItem( 'router_activated' );

		if ( this.routerActivated === 'null' || ( this.routerActivated !== this.routerCurrent ) ) {
			sessionStorage.setItem( 'router_activated', this.routerCurrent );
		}
	}

	private clearFilter() {
		this.routerCurrent = this.getRouter();
		this.routerActivated = sessionStorage.getItem( 'router_activated' );

		if ( this.routerActivated !== this.routerCurrent ) {
			sessionStorage.setItem( 'filter', 'null' );
		}

		const browserRefresh = this.browserService.boolBrowser;
		if ( browserRefresh ) {
			sessionStorage.setItem('filter', 'null');
			this.browserService.boolBrowser = false;
		}
	}

	public getFilter() {
		this.clearFilter();
		this.saveRouter();

		const filter = sessionStorage.getItem( 'filter' );

		if ( filter && filter !== 'null' ) {
			if ( this.routerActivated === this.routerCurrent ) {
				// update filter
				this.updateFilter();
			}

			const updateFilter = sessionStorage.getItem( 'filter' );
			const params = JSON.parse( updateFilter );
			this.searchForm.patchValue( params );

			return params;
		} else {
			return { ...this.params, ...this.searchForm.value, ...this.sortParams };
		}
	}

	private updateFilter() {
		if ( this.filterEmpty() ) {
			const params = { ...this.params, ...this.searchForm.value };
			sessionStorage.setItem( 'filter', JSON.stringify( params ) );
		}
	}

	private saveFilter() {
		if ( this.filterEmpty() ) {
			// Router
			this.saveRouter();

			const params = { ...this.params, ...this.searchForm.value };
			sessionStorage.setItem( 'filter', JSON.stringify( params ) );
		} else {
			sessionStorage.setItem( 'filter', 'null' );
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

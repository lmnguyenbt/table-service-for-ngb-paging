import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

	constructor( itemPerPageSizes: number[] = [ 15, 30, 50, 100 ],
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

		return this.getFnDataLst();
	}

	public resestAction() {
		this.currentPage = 1;
		this.searchForm.reset();

		return this.getFnDataLst();
	}
}

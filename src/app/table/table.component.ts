import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { TableService} from './table.service';

@Component({
  selector: 'app-table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableRowListUrl: string;
  @Input() withCheckBox: boolean;
  @Input() userRemoved;
  @Input() userAdded;
  @Input() updateTableList;
  @Output() sentToParent: EventEmitter<any> = new EventEmitter();
  @Output() forceRender: EventEmitter<any> = new EventEmitter();

  oldUserRemoved: boolean = false;
  thList: string[];
  tableRowList: object [];
  page: number;
  totalCount: number;
  search: string;
  sort: string;
  order: boolean;
  countPerPageSize: number;
  newSearchValue: string;
  checkedListItems: object [] = [];
  userAddedOld: any;
  userRemovedOld: any;



  constructor(private tableService: TableService) { }

  onSentToParent() {
    const param = {
      id: this.tableRowListUrl,
      value: this.checkedListItems
    };
    return this.sentToParent.emit(param);
  }

  ngOnChanges() {
      if (this.updateTableList) {
        this.loadList();
      }
  }
  changePage() {
    this.loadList();
  }

  sortTable(key) {
    this.sort = key;
    this.order = !this.order;
    this.page = 1;
    this.loadList();
  }
  updateTable() {
    this.page = 1;
    this.loadList();
  }
  updateFilter() {
    this.newSearchValue = this.newSearchValue.toLowerCase();
    if (this.search === this.newSearchValue) {
      return;
    }
    setTimeout(() => {
      if (this.newSearchValue && this.newSearchValue.length > 2) {
        this.search = this.newSearchValue;
        console.log(this.search);
        this.loadList();
        this.page = 1;
      } else {
        this.search = '';
        this.loadList();
        this.page = 1;
      }
    }, 1000);
  }
  ngOnInit() {
    this.setDefaultSettigs();
    console.log(this.tableRowListUrl);
    this.loadList(true, true);
  }

  addListItemToChecked(listItem) {
    const index = this.checkedListItems.indexOf(listItem);
    if (index === -1) {
      this.checkedListItems.push(listItem);
    }
    if (index > -1) {
      this.checkedListItems.splice(index, 1);
    }
    this.onSentToParent();
  }
  addListArr() {
    // this.tableService.addItemToTable('some-url', this.checkedListItems)
    //   .subscribe(addedListArr => {
    //    this.tableRowList = [...this.tableRowList, this.checkedListItems];
    // });
    this.tableRowList = [...this.tableRowList, this.checkedListItems];
  }
  // helpers
  loadList(headerUpdate: boolean = false, countUpdate: boolean = false) {
    this.tableService.getTableList(
      this.tableRowListUrl,
      this.search,
      this.countPerPageSize,
      (this.page - 1) * this.countPerPageSize,
      this.sort,
      this.order ? 'asc' : 'desc').subscribe(res => {
      console.log(res);
      this.tableRowList = res.data;

      // set headerUpdate or countUpdate to better perform
      if (headerUpdate) {
        this.thList = this.tableService.getTableHeaders(this.tableRowList[0]);
      }
      if (countUpdate) {
        this.totalCount = res.count;
      }
    });
  }
  setDefaultSettigs() {
    this.page = 1;
    this.countPerPageSize = 10;
    this.sort = 'id';
    this.order = false;
  }
}

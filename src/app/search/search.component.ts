import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { GithubSearchService } from './github.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // Raw Data list
  rawData: string[];

  // Search Result
  searchObserver: Subject<string[]>;

  // Form
  searchForm: FormGroup;

  // searched started
  searched: boolean;
  // user message
  message: string;

  // field value (search value)
  fieldValue: string;

  // index of found value
  foundIndex: number;

  // if serach is in progress (to avoid multi search)
  searchInProgress: boolean;

  // should start github search
  searchInGithub: boolean;

  // Git Search in Process
  searchInProgress$: BehaviorSubject<boolean>;

  constructor(private githubService: GithubSearchService,
    public snackBar: MatSnackBar) {
    this.rawData = [
      'JavaScript', 'TypeScript', 'Java', 'C', 'C++'
    ];

    // serached started once?
    this.searched = false;

    // simple user message
    this.message = '';

    // field value
    this.fieldValue = '';

    // index for editing
    this.foundIndex = -1;

    // github search in progress
    this.searchInProgress = false;

    // if they should search in github
    this.searchInGithub = false;

    this.searchObserver = new Subject();
  }

  ngOnInit() {
    // creating reactive form group
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
      searchInGithub: new FormControl(false)
    });

    // reactive handlig if github search is in progress
    this.githubService.searching.subscribe((searchInProgress: boolean) => {
      this.searchInProgress = searchInProgress;
    });
    this.searchInProgress$ = this.githubService.searching;
  }

  search(searchValue: string) {
    // handing searched
    this.searched = true;
    // starting if we are not in edit mode
    if (this.foundIndex > -1) { return; }
    // starting after 2 characters
    if (searchValue.length < 2 && searchValue !== '*') { return; }
    // showing all values
    if (searchValue === '*') { searchValue = ''; }

    // Filtering values
    console.log('Search Value', searchValue);
    const value = this.rawData.filter(value => value.toUpperCase().indexOf(searchValue.toUpperCase()) >= 0);
    this.searchObserver.next(value);

    try {
      // Starting search in github
      this.searchInGit(searchValue, value);
    } catch (e) {
      this.showMessage('Timeout');
    }
  }

  /**
   * adding given value into the rawData field
   */
  addValue(searchValue: string) {
    // adding value to list
    this.rawData.push(searchValue);
    // clear up
    this.clearAdd();

    // show all
    this.showAll();

    // show message
    this.message = `${searchValue} hinzugefügt`;
    this.showMessage();
  }

  /**
   * editing given value
   * @param value
   */
  edit(value: string) {
    // notice which entry it will be move inside rawData Array
    this.foundIndex = this.rawData.findIndex(v => v === value);

    // setting fieldValue to the edit - value and showing message
    this.foundIndex >= 0 ? this.fieldValue = value : this.showMessage('Eintrag nicht gefunden');
  }

  /**
   * Searching given value insisde our raw-data and deleting it
   * @param value
   */
  delete(value: string) {
    // find index
    const index = this.rawData.findIndex(v => v === value);
    // removing value
    this.rawData.splice(index, 1);
    // updating resutl lsit
    this.showAll();
  }

  /**
   * Updating exist value inside the raw array
   */
  save() {
    // replace value
    this.rawData[this.foundIndex] = this.fieldValue;
    // update of search list
    this.showAll();

    // Showing message
    this.showMessage('Eintrage geändert');

    // clear up
    this.clearAdd();
  }

  /**
   * aborting editing
   */
  abort() {
    this.clearAdd();
  }

  /**
   * show all values
   */
  showAll(result: string[] = null) {
    this.searchObserver.next(result !== null ? result : this.rawData);
  }

  /**
   * clearing foundIndex and fieldValue
   */
  private clearAdd() {
    this.foundIndex = -1;
    this.fieldValue = '';
  }

  /**
   * showing user message. Message will removed after 2 seconds
   */
  private showMessage(msg: string = '') {
    this.message = msg;

    this.snackBar.open(msg, '', {
      duration: 2000,
    });
  }

  /**
   * starting search on github, if searchGit is stelected
   * @param searchValue
   */
  private searchInGit(searchValue: string, resultList: string[]) {
    // starting github search if its checked
    if (!this.searchInGithub) { return; }

    // Starting search if searchString is more then 2 character and search is not in progress
    if (searchValue.length > 2 && !this.searchInProgress) {

      // staring search
      return this.githubService.search(searchValue).then((result: any) => {
        const githubResult = _.map(result.items, 'name');
        const githubSearchResult = resultList.concat(githubResult);
        this.showAll(githubSearchResult);
      }).catch((error: any) => {
        this.showMessage(`Github request error message ${error.statusText}`);
        throw new Error(error.statusText);
      });
    }
  }

}

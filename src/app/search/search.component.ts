import { GithubSearchService } from './github.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  rawData: string[];
  resultList: string[];
  searchForm: FormGroup;

  searched: boolean;
  message: string;

  fieldValue: string;
  index: number;

  searchInProgress: boolean;
  searchInGithub: boolean;

  constructor(private githubService: GithubSearchService) {
    this.rawData = [
      'Abc', 'Def', 'ghi',
    ];

    this.resultList = [];
    this.searched = false;
    this.message = '';
    this.fieldValue = '';
    this.index = -1;
    this.searchInProgress = false;
    this.searchInGithub = false;
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
      searchInGithub: new FormControl(false)
    });
  }

  search(searchValue: string) {
    this.searched = true;
    if (this.index > -1) { return; }
    if (searchValue.length === 0) { return; }
    if (searchValue === '*') { return searchValue = ''; }
    console.log('Search Value', searchValue);
    this.resultList = this.rawData.filter(value => value.toUpperCase().indexOf(searchValue.toUpperCase()) >= 0);
    console.dir('results ', this.resultList);

    this.searchInGit(searchValue);
  }

  addValue(searchValue: string) {
    this.rawData.push(searchValue);
    searchValue = '';
    this.showAll();
    this.message = `${searchValue} hinzugefügt`;
    this.showMessage();
  }

  edit(value: string) {
    const index = this.rawData.findIndex(v => v === value);
    if (index >= 0) {
      this.index = index;
      this.fieldValue = value;
    } else {
      this.message = 'Eintrag nicht gefunden';
      this.showMessage();
    }
  }

  delete(value: string) {
    const index = this.rawData.findIndex(v => v === value);
    this.rawData.splice(index, 1);
    this.resultList = this.rawData;
  }

  save() {
    this.rawData[this.index] = this.fieldValue;
    this.message = 'Eintrage geändert';
    this.resultList = this.rawData;
    this.showMessage();
    this.clearAdd();
  }

  abort() {
    this.clearAdd();
  }

  showAll() {
    this.resultList = this.rawData;
  }

  private clearAdd() {
    this.index = -1;
    this.fieldValue = '';
  }

  private showMessage() {
    setTimeout(() => {
      this.message = '';
    }, 2000);
  }

  private searchInGit(searchValue: string) {
    if (!this.searchInGithub) return;
    if (searchValue.length > 2 && !this.searchInProgress) {
      this.searchInProgress = true;
      this.githubService.search(searchValue).then((result: any) => {
        this.searchInProgress = false;
        result.items.forEach(element => {
          this.rawData.push(element.name);
          this.resultList = this.rawData;
        });
      }).catch((error: any) => {
        throw new Error(error);
      });
    }
  }

}

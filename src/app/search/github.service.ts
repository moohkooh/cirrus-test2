import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GithubSearchService {

    githubUrl = "https://api.github.com/search/repositories?";
    searching:Subject<boolean>

    /**
     * creating subject
     * @param http 
     */
    constructor(private http: Http) {
        this.searching = new Subject();
    }

    /**
     * searching in github
     * @param query 
     */
    search(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.searching.next(true);
            this.http.get(`${this.githubUrl}q=${query}`).subscribe((data: any) => {
                const result = data.json();
                this.searching.next(false);
                resolve(result);
            }); 
        });
    }
}
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GithubSearchService {

    githubUrl = 'https://api.github.com/search/repositories?';
    searching: BehaviorSubject<boolean>;

    /**
     * creating subject
     * @param http Http
     */
    constructor(private http: Http) {
        this.searching = new BehaviorSubject(false);
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
            }, (error: any) => {
                this.searching.next(false);
                reject(error);
            });
        });
    }
}

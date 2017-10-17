import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GithubSearchService {

    githubUrl = "https://api.github.com/search/repositories?";

    constructor(private http: Http) {

    }

    /**
     * 
     * @param query 
     */
    search(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.githubUrl}q=${query}`).subscribe((data: any) => {
                const result = data.json();
                resolve(result);
            }); 
        });
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../models/user/user.model';
import { catchError, Observable, of } from 'rxjs';

const API_URL = "http://127.0.0.1:8081/auth";

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error); // log to console instead  
            return of(result as T);
        };
    }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    register(user: User) {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
        const lengthOfCode = 40;
        var token = this.makeRandom(lengthOfCode, possible);
        user.token = token;
        const url = `${API_URL}/register.php?apikey=1`;
        return this.http
            .post(url, user).pipe(catchError(this.handleError('register', [])))
    }

    delete(id: number) {
        return this.http.delete(`/users/${id}`);
    }

    //------------------------------------------------------

    makeRandom(lengthOfCode: number, possible: string) {
        let text = "";
        for (let i = 0; i < lengthOfCode; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
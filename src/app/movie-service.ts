import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

 private baseUrl = 'http://localhost:8080/movies';
 

  constructor(private http: HttpClient) {}

  // GET ALL MOVIES
  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ADD MOVIE
  addMovie(movie: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, movie);
  }

  // UPDATE MOVIE
  updateMovie(id: string, movie: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, movie);
  }
//DELETE MOVIE
  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}






































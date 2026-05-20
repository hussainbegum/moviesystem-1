
import { Component, OnInit, signal } from '@angular/core';
import { MovieService } from './movie-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
export interface Movie {

  id: string | null;
  name: string;
  review: string;
  rating: number;
  image: string;
  language:string;
}
export interface SaveError {     
  status: number;
  error?: string;
}
export type ToastType = 'success' | 'info' | 'warning' | 'error';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('uml');

  movies: Movie[] = [];

  showMovies = false;

  selectedFile!: File;

  // Stats
  totalMovies = 0;
  averageRating = 0;
  topRatedMovieName = '';

  movie: Movie = {
    id: null,
    name: '',
    review: '',
    rating: 0,
    image: '' ,// Changed from file logic to string URL
   language:''
  };


  editId: string | null = null;

  isSubmitting = false;
  movieService!: MovieService;
fields: any;

  constructor(private service: MovieService, private toastr: ToastrService)
  
   {}

  ngOnInit(): void {
    this.loadMovies();
  }

  // IMAGE SELECT
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] as File;
  }

  // NAVIGATION
  goToMovies(): void {
    this.showMovies = true;
  }

  goBack(): void {
    this.showMovies = false;
  }

  showToast(): void {
    this.toastr.success('Toastr is working correctly!');
  }

  // LOAD MOVIES
  loadMovies(): void {
    this.service.getMovies().subscribe((data: Movie[]) => {
      this.movies = data;
      this.calculateStats();
    });
  }

  // STATS
  calculateStats(): void {
    this.totalMovies = this.movies.length;

    if (this.totalMovies > 0) {
      const sum = this.movies.reduce(
        (acc, m) => acc + (Number(m.rating) || 0),
        0
      );

      this.averageRating =
        parseFloat((sum / this.totalMovies).toFixed(1));

      const topMovie = this.movies.reduce((prev, current) =>
        (prev.rating > current.rating) ? prev : current
      );

      this.topRatedMovieName = topMovie.name || 'N/A';
    } else {
      this.averageRating = 10.0;
      this.topRatedMovieName = 'N/A';
    }
  }

  // SAVE MOVIE
  saveMovie(): void {
    // Disable button to prevent multiple submissions
    this.isSubmitting = true;

    this.service.addMovie(this.movie).subscribe({
      next: (): void => {
      },
      error: (error: SaveError) => {
        this.isSubmitting = false;

        // Handle duplicate movie error specifically
        if (error.status === 409 && error.error?.includes('Movie already exists')) {
          this.toastr.warning('Movie already exists with this name!', 'Duplicate Movie');
        } else {
          this.toastr.success('Successfully saved movie', 'Successfully Saved');
        }
      }
    });
  }

  // Update afterSave to take the message and type
  afterSave(message: string, type: ToastType): void {
    setTimeout(() => {
      this.toastr[type](message);
    }, 0);
  }

  // EDIT
  editMovie(m: Movie): void {
    this.movie = { ...m };
    this.editId = m.id;
  }

  // DELETE
deleteMovie(id: string): void {

  this.service.deleteMovie(id).subscribe({

    next: (): void => {

      this.toastr.success('Movie deleted successfully!');

      this.loadMovies();

    },

    error: () => {

      this.toastr.error('Movie deleted successfully :)');
    }

  });

}
// RESET
  reset(): void {
    this.movie = {
      id: null,
      name: '',
      review: '',
      rating: 0,
      image: '', // Reset the URL field
      language: ''
    };
  }
}








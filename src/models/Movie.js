export default class Movie {
    constructor(movie) {
        if(movie === null)
        {
            this.name = '';
            this.timestamp = '';
            this.addedBy = ''
            this.likes = [];
            this.id = -1;
        }
        else 
        {
            this.name = movie.name;
            this.timestamp = movie.timestamp;
            this.addedBy = movie.addedBy;
            this.likes = movie.likes;
            this.id = movie.id;
        }
    }
}
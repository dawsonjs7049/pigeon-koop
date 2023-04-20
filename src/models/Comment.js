export default class Comment {
    constructor(comment) {
        if(comment === null)
        {
            this.author = '';
            this.comment = '';
            this.date = '';
            this.timestamp = '';
            this.photoId = -1;
            this.likes = [];
            this.id = -1;
        }
        else 
        {
            this.author = comment.author;
            this.comment = comment.comment;
            this.date = comment.date;
            this.timestamp = comment.timestamp;
            this.photoId = comment.photoId;
            this.likes = comment.likes;
            this.id = comment.id;
        }
    }
}
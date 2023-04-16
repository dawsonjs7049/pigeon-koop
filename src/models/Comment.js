export default class Comment {
    constructor(comment) {
        if(comment === null)
        {
            this.author = '';
            this.comment = '';
            this.date = '';
            this.timestamp = '';
            this.pictureId = -1;
            this.likes = 0;
            this.id = -1;
        }
        else 
        {
            this.author = comment.author;
            this.comment = comment.comment;
            this.date = comment.date;
            this.timestamp = comment.timestamp;
            this.pictureId = comment.pictureId;
            this.likes = comment.likes;
            this.id = comment.id;
        }
    }
}
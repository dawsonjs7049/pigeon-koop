export default class Photo {
    constructor(event)
    {
        if(event === null)
        {
            this.comment = '';
            this.date = 0;
            this.timestamp = '';
            this.filename = '';
            this.url = '';
            this.owner = '';
            this.id = -1;
        }
        else 
        {
            this.comment = event.comment;
            this.date = event.date;
            this.timestamp = event.timestamp;
            this.filename = event.filename;
            this.url = event.url;
            this.owner = event.owner
            this.id = event.id
        }
    }
}
export default class Event {
    constructor(event)
    {
        if(event === null)
        {
            this.title = '';
            this.people = 0;
            this.fullDate = '';
            this.date = '';
            this.niceDate = '';
            this.timestamp = '';
            this.user = '';
            this.id = -1;
        }
        else 
        {
            this.title = event.title;
            this.people = event.people;
            this.fullDate = event.fullDate;
            this.date = event.date;
            this.niceDate = event.niceDate;
            this.timestamp = event.timestamp;
            this.user = event.user;
            this.id = event.id;
        }
    }
}
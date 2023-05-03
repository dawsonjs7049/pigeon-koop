export default class Todo {
    constructor(todo)
    {
        if(todo === null) 
        {
            this.description = '';
            this.completed = 0;
            this.date = '';
            this.timestamp = '';
            this.author = '';
            this.id = -1;
        } 
        else 
        {
            this.description = todo.description;
            this.completed = todo.completed;
            this.date = todo.date;
            this.timestamp = todo.timestamp;
            this.author = todo.author;
            this.id = todo.id;
        }
    }
}
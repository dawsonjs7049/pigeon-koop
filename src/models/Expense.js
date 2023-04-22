export default class Expense {
    constructor(expense) {
        if(expense == null)
        {
            this.description = '';
            this.type = '';
            this.date = '';
            this.timestamp = '';
            this.amount = 0;
            this.id = -1;
        }
        else 
        {
            this.description = expense.description;
            this.type = expense.type;
            this.date = expense.date;
            this.timestamp = expense.timestamp;
            this.amount = expense.amount;
            this.id = expense.id;
        }
    }
}
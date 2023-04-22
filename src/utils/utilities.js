export function getDateRange(start, end) {
        
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }

    arr.pop();

    return arr;
}

export function checkPeopleInput(people) {
    let regex = /[A-Za-z]/
    return regex.test(people)
}

export function formatDate(date) {
    
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day, year].join('-');
}

export function getTimestamp(months) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);

    return (date.getTime() / 1000);
}

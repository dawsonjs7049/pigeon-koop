const getDateRange = (start, end) => {
        
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }

    arr.pop();

    return arr;
}

const checkPeopleInput = (people) => {
    let regex = /[A-Za-z]/
    return regex.test(people)
}

const formatDate = (date) => {
    
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

export default {
    getDateRange,
    checkPeopleInput,
    formatDate,
};
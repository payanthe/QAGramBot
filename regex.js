var regex="cow(.*)milk"
var str = "شناسه سوال: #question961q\n" +
    "شناسه سوال: #question957q\n" +
    "شناسه سوال: #question954$\n" +
    "شناسه سوال: #question935\n" +
    "#سوال سلام\n" +
    " نویسنده\n" +
    " نویسنده\n" +
    " نویسنده";
var regex='/#question(.*)q/g'
// var res = regex.exec(str);
var res = str.match(/#question(.*)q/g);
res=res[0]
res = res.replace(/#question/g,"");
var question=res.substr(0,(res.length)-1)
console.log(question)


// var res = str.match("string(?s)(.*)string2");
// console.log(res)
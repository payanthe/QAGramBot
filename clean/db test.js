var mysql  = require('mysql');
//
// function insertQuestionToDB(id_i,question_text_i,question_image_i,creator_id_i) {
//
//     var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : '',
//         database : 'gpae'
//     });
//
//     connection.connect();
//
//     connection.query("INSERT INTO questions (id, question_text,question_image,creator_id) VALUES (?, ?,?,?)",[id_i,question_text_i,question_image_i,creator_id_i], function (error, results, fields) {
//         if (error) throw error;
//         console.log('The solution is: ', results);
//     });
//
//     connection.end();
//
// }
// insertQuestionToDB(23132,"teste soal",324324,324324)




async function getQuestionsScore(question_id) {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'gpae'
    });

    connection.connect();

     connection.query("SELECT question_rate FROM questions WHERE id = ?",question_id, function (error, results, fields) {
        if (error) throw error;
        // console.log('The solution is: ', results[0].question_rate);
    });

    connection.end();
    return results[0].question_rate;




}

console.log(getQuestionsScore(143).then(function (x) {
    console.log(x)
}))
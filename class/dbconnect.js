var mysql = require('mysql');

class DBConnect{
    async getRuleState(userid){

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT rule FROM users WHERE id = ?", userid, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].rule;

    }

    async getQuestionsScore(question_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT question_rate FROM questions WHERE id = ?", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].question_rate;

    }
    async getAnswersScore(question_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT question_rate FROM answers WHERE id = ?", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].question_rate;

    }

    async insertQuestionToDB(id_i, question_text_i, question_image_i, creator_id_i) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("INSERT INTO questions (id, question_text,question_image,creator_id) VALUES (?, ?,?,?)", [id_i, question_text_i, question_image_i, creator_id_i], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }
    async insertAnswerToDB(id_i, question_text_i, question_image_i, creator_id_i,to_question) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("INSERT INTO answers (id, answer_text,answer_image,to_question,creator_id) VALUES (?, ?,?,?,?)", [id_i, question_text_i, question_image_i, to_question,creator_id_i], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }

    // async increaseQuestionScore(question_id) {
    //
    //     var connection = mysql.createConnection({
    //         host: 'localhost',
    //         user: 'root',
    //         password: '',
    //         database: 'gpae'
    //     });
    //
    //     connection.connect();
    //
    //
    //
    //
    //     const queryResult=new Promise((resolve, reject) => {
    //         connection.query("UPDATE questions SET `question_rate`=(`question_rate`+1) WHERE `id` = (?)", [question_id], function (error, results, fields) {
    //             if (error) reject(error);
    //             else resolve(results)
    //         })
    //     })
    //
    //     connection.end();
    //     let results = await queryResult;
    //     return results;
    //
    // }


    async increaseQuestionVoteUp(question_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE questions SET `vote_up`=(`vote_up`+1) WHERE `id` = (?)", [question_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }
    async decreaseQuestionVoteUp(question_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE questions SET `vote_up`=(`vote_up`-1) WHERE `id` = (?)", [question_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }

    async decreaseQuestionVoteDown(question_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE questions SET `vote_down`=(`vote_down`-1) WHERE `id` = (?)", [question_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }
    async increaseQuestionVoteDown(question_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE questions SET `vote_down`=(`vote_down`+1) WHERE `id` = (?)", [question_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }



    ////

    async increaseAnswerVoteUp(answer_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE answers SET `vote_up`=(`vote_up`+1) WHERE `id` = (?)", [answer_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }
    async decreaseAnswerVoteUp(answer_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE answers SET `vote_up`=(`vote_up`-1) WHERE `id` = (?)", [answer_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }

    async decreaseAnswerVoteDown(answer_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE answers SET `vote_down`=(`vote_down`-1) WHERE `id` = (?)", [answer_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }
    async increaseAnswerVoteDown(answer_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE answers SET `vote_down`=(`vote_down`+1) WHERE `id` = (?)", [answer_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }

    ////


    async getQuestionVoteUp(question_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT vote_up FROM questions WHERE id = ?", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].vote_up;

    }
    async getAnswerVoteUp(question_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT vote_up FROM answers WHERE id = ?", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].vote_up;

    }
    async getQuestionVoteDown(question_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT vote_down FROM questions WHERE id = ?", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].vote_down;

    }
    async getAnswerVoteDown(question_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT vote_down FROM answers WHERE id = ?", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].vote_down;

    }

    async repeatedQuestionVote(question_id, user_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT vote FROM questions_vote WHERE question_id = ? AND user_id= ?", [question_id,user_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results;

    }
    async registerQuestionVote(question_id,user_id,vote){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("INSERT INTO questions_vote (question_id,user_id,vote) VALUES (?, ?,?)", [question_id,user_id,vote], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;
    }

    ///
    async repeatedAnswerVote(answer_id, user_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT vote FROM answers_vote WHERE answer_id = ? AND user_id= ?", [answer_id,user_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results;

    }
    async registerAnswerVote(answer_id,user_id,vote){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("INSERT INTO answers_vote (answer_id,user_id,vote) VALUES (?, ?,?)", [answer_id,user_id,vote], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;
    }
    ///
    async registerUsers(id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("INSERT INTO users (id) VALUES (?)", [id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;
    }
    async isRegister(id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT id FROM users WHERE id = ?", id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        if (results.length){
            console.log(results)
            return 1
        }else {
            return 0
        }



    }

    async updateQuestionVote(question_id,user_id,vote){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE questions_vote SET `vote`=(?) WHERE `question_id` = (?) AND `user_id`=(?)", [vote,question_id,user_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;
    }
    async updateAnswerVote(answer_id,user_id,vote){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE answers_vote SET `vote`=(?) WHERE `answer_id` = (?) AND `user_id`=(?)", [vote,answer_id,user_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;
    }

    async acceptRule(id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE users SET `rule`=(1) WHERE `id` = (?)", [id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }


    async spamInsert(user_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE users SET `spam`=(`spam`+1) WHERE `id` = (?)", [user_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }

    async getUserSpam(user_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT spam FROM users WHERE id = ?", user_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results[0].spam;

    }


    async unSetRule(user_id){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE users SET `rule`=(?) WHERE `id` = (?)", [0,user_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;


    }


    async addMessageIdToQuestion(question_id,message_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE questions SET `message_id`=(?) WHERE `id` = (?)", [message_id,question_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }


    async addMessageIdToAnswer(answer_id,message_id) {

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();




        const queryResult=new Promise((resolve, reject) => {
            connection.query("UPDATE answers SET `message_id`=(?) WHERE `id` = (?)", [message_id,answer_id], function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        return results;

    }

    async getAllAnswers(question_id){

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT message_id FROM answers WHERE to_question = ? ORDER BY vote_up", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results;

    }


    async getLastQ(limit){

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT message_id FROM questions ORDER BY time DESC LIMIT 5", function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results;

    }

    async getMessageIdOfQuestion(question_id){

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'gpae'
        });

        connection.connect();
        const queryResult=new Promise((resolve, reject) => {
            connection.query("SELECT message_id FROM questions WHERE id = ? ", question_id, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results)
            })
        })

        connection.end();
        let results = await queryResult;
        console.log(results)
        return results;

    }





}
module.exports = DBConnect
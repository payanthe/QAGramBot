async function textToQuestion(ctx, text, inEnts) {

    var message_id = ctx.update.message.message_id;
    var id = ctx.update.message.from.id;
    if (isQuestion(inEnts, text)) {
        var unique = message_id;
        text = "شناسه سوال: " + "#question" + unique + "\n" + text
        text += "\n [نویسنده](tg://user?id=" + id + ")"
        // insertQuestionToDB(unique,text,"",id)
        let score = await getQuestionsScore(151);
        console.log("======>", score);
        ctx.reply(text, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [[{
                    text: "➕" + unique + score,
                    callback_data: "mosbat" + "-" + id + "-" + message_id
                }, {text: "➖ ", callback_data: "manfi" + "-" + id + "-" + message_id}, {
                    text: "❗️",
                    callback_data: "spam" + "-" + id + "-" + message_id
                }]]
            }
        })

    }

    console.log(ctx.update.message.message_id)
    console.log(ctx.update.message.from.id)

    // ctx.reply(text)


}

function answerToQuestion(ctx, text, inEnts) {

    var message_id = ctx.update.message.message_id;
    var id = ctx.update.message.from.id;
    if (isAnswer(inEnts, text)) {
        ctx.reply(text, {
            reply_markup: {
                inline_keyboard: [[{
                    text: "➕",
                    callback_data: "mosbat" + "-" + id + "-" + message_id
                }, {text: "➖", callback_data: "manfi" + "-" + id + "-" + message_id}, {
                    text: "❗️",
                    callback_data: "spam" + "-" + id + "-" + message_id
                }]]
            }
        })

    }

    console.log(ctx.update.message.message_id)
    console.log(ctx.update.message.from.id)

    // ctx.reply(text)


}

function insertQuestionToDB(id_i, question_text_i, question_image_i, creator_id_i) {

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gpae'
    });

    connection.connect();

    connection.query("INSERT INTO questions (id, question_text,question_image,creator_id) VALUES (?, ?,?,?)", [id_i, question_text_i, question_image_i, creator_id_i], function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
    });

    connection.end();

}

function isQuestion(inEnts, text) {
    var ents = inEnts || [];
    var hasharray = [];
    var question = 0;
    for (var ent of ents) {
        if (ent.type && ent.type == 'hashtag') {
            console.log("yeeeeee")
            var hashtag = text.toString().substr(ent.offset, ent.length);
            console.log(hashtag)
            hasharray.push(hashtag)
        }
        if (hashtag == "#سوال") {
            question += 1;
            return 1;
        }
    }
    return 0;


}

function isAnswer(inEnts, text) {
    var ents = inEnts || [];
    var hasharray = [];
    var question = 0;
    for (var ent of ents) {
        if (ent.type && ent.type == 'hashtag') {
            console.log("yeeeeee")
            var hashtag = text.toString().substr(ent.offset, ent.length);
            console.log(hashtag)
            hasharray.push(hashtag)
        }
        if (hashtag == "#پاسخ") {
            question += 1;
            return 1;
        }
    }
    return 0;


}


async function getQuestionsScore(question_id) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gpae'
    });

    connection.connect();

    const myFirstPromise = new Promise((resolve, reject) => {
        connection.query("SELECT question_rate FROM questions WHERE id = ?", question_id, function (error, results, fields) {
            if (error) reject(error);
            else resolve(results)
            // console.log('The solution is: ', results[0].question_rate);
        })
    })
    connection.end();
    let results = await myFirstPromise;
    console.log("======>", results);
    return results[0].question_rate;
}
function deleteAtNightModeTime(ctx) {
    if (nightModeTime()) {
        deleteIt(ctx.message)
    }

}
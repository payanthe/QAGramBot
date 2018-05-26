const DBConnect = require('./dbconnect.js')
let dbConnect = new DBConnect();
global.gpChatId="-1001337508396"

class MessageHandler {
    noHashtag(inEnts,text) {
        var standard_hashtags=["#توجه","#اخبار","#پاسخ","#سوال"]
        var ents = inEnts || [];
        var hasharray = [];
        for (var ent of ents) {
            if (ent.type && ent.type == 'hashtag') {
                var hashtag_text = text.toString().substr(ent.offset, ent.length);
                if(standard_hashtags.indexOf(hashtag_text)>0){
                    var hashtag = "hashtag"
                    hasharray.push(hashtag)
                }

            }
        }
        return hasharray.length;
    }

    acceptRuleText(ctx,text,type){
        if (type == 'private') {
            if((text).indexOf("rule") > -1) {
                ctx.reply("ghaboole ghavanin", {
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [[{
                            text: "ghaboole ghavanin",
                            callback_data: "acceptrule"
                        }]]
                    }
                })
            }
            // console.log(ctx.update.message)


        }
    }

    async ruleCheck(ctx, id) {
        let state = await dbConnect.getRuleState(id);
        if (state){

        }else {
            ctx.reply("برای فعالیت در این گروه باید ابتدا قوانین رو مطالعه و قبول کنید! ", {
                disable_notification:true,reply_markup: {inline_keyboard: [[{text: "قبول قوانین", url: "https://telegram.me/myGManagerbot?start=rule"}]]}
            ,reply_to_message_id:ctx.message.message_id}).then((sent) => {
                console.log("inajaaaa",sent)
                setTimeout(() => {
                    ctx.telegram.deleteMessage(sent.chat.id, sent.message_id);
                    console.log("paak she")
                    ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                }, 10000);


            });
        }


    }

    isQuestion(inEnts, text) {
        var ents = inEnts || [];
        var hasharray = [];
        var question = 0;
        for (var ent of ents) {
            if (ent.type && ent.type == 'hashtag') {

                var hashtag = text.toString().substr(ent.offset, ent.length);

                hasharray.push(hashtag)
            }
            if (hashtag == "#سوال") {
                question += 1;
                return 1;
            }
        }
        return 0;


    }

    isAnswer(inEnts, text) {
        var ents = inEnts || [];
        var hasharray = [];
        var question = 0;
        for (var ent of ents) {
            if (ent.type && ent.type == 'hashtag') {
                var hashtag = text.toString().substr(ent.offset, ent.length);
                hasharray.push(hashtag)
            }
            if (hashtag == "#پاسخ") {
                question += 1;
                return 1;
            }
        }
        return 0;


    }


    textCorrector(message, inEnts) {
        var correctText = message;
        var preArray = [];
        for (var ent of inEnts) {

            if (ent.type && ent.type == 'pre') {
                var preInText = message.substr(ent.offset, ent.length);
                preArray.push(preInText)

            }
        }

        for (var pre of preArray) {
            var preReplace = "```" + pre + "```";
            correctText = correctText.replace(pre, preReplace)
        }
        return correctText;
    }

    answer(){
        //reply bashe
        // vasl be pasokh too database
        //tarmime


    }

    async textToQuestion(ctx, id, message_id, text, inEnts) {
        var unique = 5*message_id;

        if (this.isQuestion(inEnts, text)) {
            var correctText = this.textCorrector(text, inEnts);
            var headerText = "شناسه سوال: " + "#question" + unique.toString() +"q"+ "\n";
            var author = "\n [نویسنده](tg://user?id=" + id + ")";
            var finalText = headerText + correctText + author;
            console.log(finalText)
            // insertQuestionToDB(unique,text,"",id)

            try {
                await dbConnect.insertQuestionToDB(unique, finalText, "", id)
            } catch (e) {
                console.log(e)
            }
            let questionScore = await dbConnect.getQuestionsScore(unique)
            let voteUp = await dbConnect.getQuestionVoteUp(unique)
            let voteDown = await dbConnect.getQuestionVoteDown(unique)




            ctx.reply(finalText, {
                chat_id:gpChatId,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [[{
                        text: "➕" /* + score*/,
                        callback_data: "mosbatq" + "-" + id + "-" + unique
                    }, {text: "➖ ", callback_data: "manfiq" + "-" + id + "-" + unique}, {
                        text: "❗️",
                        callback_data: "spamq" + "-" + id + "-" + unique
                    }],[{
                        text: "ارسال تمام پاسخ ها" /* + score*/,
                        callback_data: "SAA-" + unique
                    }]]
                }
            })
                .then(e => {
                    dbConnect.addMessageIdToQuestion(unique,e.message_id)
                    // ctx.reply("سوال شما در گروه ارسال شد"
                    //     ,{chat_id:id})
                    try {
                        ctx.telegram.deleteMessage(gpChatId,message_id);

                    }catch (e){}
                    console.log("natayej====\n", e)
                })


            // var messcop=ctx.message;
            // var chat_id=ctx.message.chat.id;
            // messcop.text=finalText;
            // ctx.telegram.sendCopy(chat_id,messcop,{
            //     parse_mode: "Markdown",
            //     reply_markup: {
            //         inline_keyboard: [[{
            //             text: "➕" + unique + "q " + "emtiaz" + voteUp /* + score*/,
            //             callback_data: "mosbatq" + "-" + id + "-" + message_id
            //         }, {text: "➖ " + "emtiaz" + voteDown, callback_data: "manfiq" + "-" + id + "-" + message_id}, {
            //             text: "❗️",
            //             callback_data: "spam" + "-" + id + "-" + message_id
            //         }]]
            //     }
            // })

        }


    }

    async textToAnswer(ctx, id, message_id, text, inEnts,question){


        var unique = message_id;


        if (this.isAnswer(inEnts, text)) {

            if (question==undefined){
                ctx.reply("باید ریپلای کنید")
                return
            }


            var questionId=this.findQuestioId(question.text)
            if (questionId==false){
                ctx.reply("bayad be soal bashe")
                return
            }
            var correctText = this.textCorrector(text, inEnts);
            var headerText = "شناسه پاسخ: " + "#answer" + unique.toString() + "\n";
            var author = "\n [نویسنده](tg://user?id=" + id + ")"+"\n";
            var toQuestionId="پاسخ به"+" #question"+ questionId+"q"
            var finalText = headerText + correctText + author+toQuestionId;
            //
            // console.log(finalText)
            //
            try {
                await dbConnect.insertAnswerToDB(unique, finalText, "", id,questionId)
            } catch (e) {
                console.log(e)
            }
            let answerScore = await dbConnect.getAnswersScore(unique)
            let voteUp = await dbConnect.getAnswerVoteUp(unique)
            let voteDown = await dbConnect.getAnswerVoteDown(unique)
            let questionMessageId= await dbConnect.getMessageIdOfQuestion(questionId)
            questionMessageId=questionMessageId[0].message_id;
            console.log(questionMessageId,"eyyyyyyyyyyy")

            ctx.reply(finalText, {
                chat_id:gpChatId,
                parse_mode: "Markdown",
                reply_to_message_id:questionMessageId,
                // reply_to_message_id:question.message_id,
                reply_markup: {
                    inline_keyboard: [[{
                        text: "➕" ,
                        callback_data: "mosbata" + "-" + id + "-" + message_id
                    }, {text: "➖ " , callback_data: "manfia" + "-" + id + "-" + message_id}, {
                        text: "❗️",
                        callback_data: "spama" + "-" + id + "-" + message_id
                    }]]
                }
            })
                .then(e => {
                    console.log("natayej====\n", e)
                    dbConnect.addMessageIdToAnswer(unique,e.message_id)
                    try {
                        ctx.telegram.deleteMessage(gpChatId,message_id);

                    }catch (e){}

                })

        }

    }
   findQuestioId(text){
       var res = text.match(/#question(.*)q/g);
       if (res!=null){
           res=res[0]
           res = res.replace(/#question/g,"");
           var question=res.substr(0,(res.length)-1)
           return question
       }else {
           return false;
       }

   }

   async sendLastQuestionToUser(ctx,user_id){
       var answers= await dbConnect.getLastQ(3)
       console.log("salam")

       for (var i=0;i<answers.length;i++){
           // console.log(answers[i])
           // console.log("salam")
          await ctx.telegram.forwardMessage(user_id,gpChatId,answers[i].message_id)

       }

   }
    // async getQuestionsScore(question_id) {
    //     var connection = mysql.createConnection({
    //         host: 'localhost',
    //         user: 'root',
    //         password: '',
    //         database: 'gpae'
    //     });
    //
    //     connection.connect();
    //
    //     const myFirstPromise = new Promise((resolve, reject) => {
    //         connection.query("SELECT question_rate FROM questions WHERE id = ?", question_id, function (error, results, fields) {
    //             if (error) reject(error);
    //             else resolve(results)
    //             // console.log('The solution is: ', results[0].question_rate);
    //         })
    //     })
    //     connection.end();
    //     let results = await myFirstPromise;
    //     console.log("======>", results);
    //     return results[0].question_rate;
    // }

}

module.exports = MessageHandler;
const DBConnect = require('./dbconnect.js')
let dbConnect = new DBConnect();
global.bot_id="595693896";
global.gpChatId="-1001337508396"


class CallBackHandler {



    async mosbatQuestionCBQuery(ctx, data, chat_id, message_id, user_id) {
        if (data.indexOf("mosbatq") > -1) {

            var indexOfQuestion_id = data.lastIndexOf("-") + 1;
            var question_id = data.slice(indexOfQuestion_id, data.length)

            if (await this.isRepeatedQuestionVote(question_id, user_id)) {
                this.changeQuestionVote(ctx, data, chat_id, message_id, user_id, question_id)

            } else {
                await dbConnect.increaseQuestionVoteUp(question_id);
                await dbConnect.registerQuestionVote(question_id, user_id, '+');
                var voteUp = await dbConnect.getQuestionVoteUp(question_id)
                var voteDown = await dbConnect.getQuestionVoteDown(question_id)
                var manfiData = data.replace("mosbatq", "manfiq");
                var spamData = manfiData.replace("manfiq", "spamq")

                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: data
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: manfiData}, {
                        text: "❗️",
                        callback_data: spamData
                    }],[{
                        text: "ارسال تمام پاسخ ها",
                        callback_data: "SAA-" + question_id
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery('mosbat', ctx.update.callback_query.id, {show_alert: true})


            }

        }

    }

    async manfiQuestionCBQuery(ctx, data, chat_id, message_id, user_id) {
        if (data.indexOf("manfiq") > -1) {

            var indexOfQuestion_id = data.lastIndexOf("-") + 1;
            var question_id = data.slice(indexOfQuestion_id, data.length)
            if (await this.isRepeatedQuestionVote(question_id, user_id)) {
                this.changeQuestionVote(ctx, data, chat_id, message_id, user_id, question_id)
            } else {
                await dbConnect.decreaseQuestionVoteDown(question_id);
                await dbConnect.registerQuestionVote(question_id, user_id, '-');

                var voteUp = await dbConnect.getQuestionVoteUp(question_id)
                var voteDown = await dbConnect.getQuestionVoteDown(question_id)
                var mosbatData = data.replace("manfiq", "mosbatq")
                var spamData = data.replace("manfiq", "spamq")
                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: mosbatData
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: data}, {
                        text: "❗️",
                        callback_data: spamData
                    }],[{
                        text: "ارسال تمام پاسخ ها",
                        callback_data: "SAA-" + question_id
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery("manfi shoma sabt shod", ctx.update.callback_query.id, 'true', '')

            }

        }

    }

    async isRepeatedQuestionVote(question_id, user_id) {
        var isRepeat = await dbConnect.repeatedQuestionVote(question_id, user_id)
        if (isRepeat.length == 0) {
            return 0;
        } else {
            return 1
        }
    }

    async changeQuestionVote(ctx, data, chat_id, message_id, user_id, question_id) {
        var vote = await dbConnect.repeatedQuestionVote(question_id, user_id);
        if (vote[0].vote == '+') {
            if (data.indexOf("mosbatq") > -1) {

                ctx.answerCbQuery('امتیاز مثبت شما قبلا ثبت شده است!', ctx.update.callback_query.id, {show_alert: true})
            } else {
                await dbConnect.decreaseQuestionVoteUp(question_id)
                await dbConnect.decreaseQuestionVoteDown(question_id)
                await dbConnect.updateQuestionVote(question_id, user_id, '-')

                var voteUp = await dbConnect.getQuestionVoteUp(question_id)
                var voteDown = await dbConnect.getQuestionVoteDown(question_id)
                var mosbatData = data.replace("manfiq", "mosbatq")
                var spamData = data.replace("manfiq", "spamq")

                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: mosbatData
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: data}, {
                        text: "❗️",
                        callback_data: spamData
                    }],[{
                        text: "ارسال تمام پاسخ ها",
                        callback_data: "SAA-" + question_id
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery("امتیاز شما عوض شد!", ctx.update.callback_query.id, 'true', '')


            }


        }
        if (vote[0].vote == '-') {
            if (data.indexOf("manfi") > -1) {
                ctx.answerCbQuery('امتیاز قبل شما منفی ثبت شده است!', ctx.update.callback_query.id, {show_alert: true})
            } else {
                console.log("too else")
                await dbConnect.increaseQuestionVoteDown(question_id)
                await dbConnect.increaseQuestionVoteUp(question_id)
                await dbConnect.updateQuestionVote(question_id, user_id, '+')
                var voteUp = await dbConnect.getQuestionVoteUp(question_id)
                var voteDown = await dbConnect.getQuestionVoteDown(question_id)
                var manfiData = data.replace("mosbatq", "manfiq")
                var spamData = data.replace("manfiq", "spamq")

                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: data
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: manfiData}, {
                        text: "❗️",
                        callback_data: spamData
                    }],[{
                        text: "ارسال تمام پاسخ ها",
                        callback_data: "SAA-" + question_id
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery("امتیاز شما عوض شد!", ctx.update.callback_query.id, 'true', '')

            }

        }


    }

///

    async mosbatAnswerCBQuery(ctx, data, chat_id, message_id, user_id) {
        if (data.indexOf("mosbata") > -1) {

            var indexOfAnswer_id = data.lastIndexOf("-") + 1;
            var answer_id = data.slice(indexOfAnswer_id, data.length)

            if (await this.isRepeatedAnswerVote(answer_id, user_id)) {
                this.changeAnswerVote(ctx, data, chat_id, message_id, user_id, answer_id)

            } else {
                await dbConnect.increaseAnswerVoteUp(answer_id);
                await dbConnect.registerAnswerVote(answer_id, user_id, '+');
                var voteUp = await dbConnect.getAnswerVoteUp(answer_id)
                var voteDown = await dbConnect.getAnswerVoteDown(answer_id)
                var manfiData = data.replace("mosbata", "manfia");
                var spamData = data.replace("manfia", "spama")

                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: data
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: manfiData}, {
                        text: "❗️",
                        callback_data: spamData
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery('mosbat', ctx.update.callback_query.id, {show_alert: true})


            }

        }

    }

    async manfiAnswerCBQuery(ctx, data, chat_id, message_id, user_id) {
        if (data.indexOf("manfia") > -1) {

            var indexOfAnswer_id = data.lastIndexOf("-") + 1;
            var answer_id = data.slice(indexOfAnswer_id, data.length)
            if (await this.isRepeatedAnswerVote(answer_id, user_id)) {
                this.changeAnswerVote(ctx, data, chat_id, message_id, user_id, answer_id)
            } else {
                await dbConnect.decreaseAnswerVoteDown(answer_id);
                await dbConnect.registerAnswerVote(answer_id, user_id, '-');

                var voteUp = await dbConnect.getAnswerVoteUp(answer_id)
                var voteDown = await dbConnect.getAnswerVoteDown(answer_id)
                var mosbatData = data.replace("manfia", "mosbata")
                var spamData = data.replace("manfia", "spama")

                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: mosbatData
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: data}, {
                        text: "❗️",
                        callback_data: spamData
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery("manfi shoma sabt shod", ctx.update.callback_query.id, 'true', '')

            }

        }

    }

    async isRepeatedAnswerVote(answer_id, user_id) {
        var isRepeat = await dbConnect.repeatedAnswerVote(answer_id, user_id)
        if (isRepeat.length == 0) {
            return 0;
        } else {
            return 1
        }
    }

    async changeAnswerVote(ctx, data, chat_id, message_id, user_id, answer_id) {
        var vote = await dbConnect.repeatedAnswerVote(answer_id, user_id);
        if (vote[0].vote == '+') {
            if (data.indexOf("mosbata") > -1) {

                ctx.answerCbQuery('امتیاز قبل شما مثبت ثبت شده است!', ctx.update.callback_query.id, {show_alert: true})
            } else {
                await dbConnect.decreaseAnswerVoteUp(answer_id)
                await dbConnect.decreaseAnswerVoteDown(answer_id)
                await dbConnect.updateAnswerVote(answer_id, user_id, '-')

                var voteUp = await dbConnect.getAnswerVoteUp(answer_id)
                var voteDown = await dbConnect.getAnswerVoteDown(answer_id)
                var mosbatData = data.replace("manfia", "mosbata")
                var spamData = data.replace("manfia", "spama")

                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: mosbatData
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: data}, {
                        text: "❗️",
                        callback_data: spamData
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery("امتیاز شما عوض شد!", ctx.update.callback_query.id, 'true', '')


            }


        }
        if (vote[0].vote == '-') {
            if (data.indexOf("manfia") > -1) {
                ctx.answerCbQuery('امتیاز قبل شما منفی ثبت شده است!', ctx.update.callback_query.id, {show_alert: true})
            } else {
                console.log("too else")
                await dbConnect.increaseAnswerVoteDown(answer_id)
                await dbConnect.increaseAnswerVoteUp(answer_id)
                await dbConnect.updateAnswerVote(answer_id, user_id, '+')
                var voteUp = await dbConnect.getAnswerVoteUp(answer_id)
                var voteDown = await dbConnect.getAnswerVoteDown(answer_id)
                var manfiData = data.replace("mosbata", "manfia");
                var spamData = data.replace("manfia", "spama")

                var reply_markup = {
                    inline_keyboard: [[{
                        text: "➕ " + voteUp  /* + score*/,
                        callback_data: data
                    }, {text: "➖ " + Math.abs(voteDown), callback_data: manfiData}, {
                        text: "❗️",
                        callback_data: spamData
                    }]]
                }
                ctx.telegram.editMessageReplyMarkup(chat_id, message_id, '', reply_markup)
                ctx.answerCbQuery("امتیاز شما عوض شد!", ctx.update.callback_query.id, 'true', '')

            }

        }


    }


    // async spamCBQuery

    async spamCBQuery(ctx, data, chat_id, message_id, user_id) {
        if (data.indexOf("spama") > -1) {
            var indexOfuser_id = data.lastIndexOf("-")
            var user_id = data.slice(6, indexOfuser_id)
            await dbConnect.spamInsert(user_id)
            var spams = await dbConnect.getUserSpam(user_id)
            if (spams % 3 == 0) {
                await dbConnect.unSetRule(user_id);
                ctx.reply("به علت تعداد زیاد اخطار ها باید قوانین را دوباره تایید کنید!", {chat_id: user_id})
            }
            ctx.answerCbQuery('spam shoma sabt shod ' + spams, ctx.update.callback_query.id, {show_alert: true})


        }
        if (data.indexOf("spamq") > -1) {
            var indexOfuser_id = data.lastIndexOf("-")
            var user_id = data.slice(6, indexOfuser_id)
            await dbConnect.spamInsert(user_id)
            var spams = await dbConnect.getUserSpam(user_id)
            if (spams % 3 == 0) {
                await dbConnect.unSetRule(user_id)
                ctx.reply("به علت تعداد زیاد اخطار ها باید قوانین را دوباره تایید کنید!", {chat_id: user_id})

            }

            ctx.answerCbQuery('spam shoma sabt shod ' + user_id + "spam" + spams, ctx.update.callback_query.id, {show_alert: true})


        }

    }


///

    async ruleAccept(ctx, data, chat_id) {
        if (data.indexOf("acceptrule") > -1) {
            // await
            dbConnect.acceptRule(chat_id)
            ctx.reply("شما قوانین را پذیرفتید شما می‌توانید در گروه از الان فعالیت کنید\n" +
                "در صورت نقض قوانین دسترسی شما به گروه مسدود می‌شود.")
            ctx.answerCbQuery("شما قوانین را پذیرفتید و موظف به انجام آن می‌باشید در صورت نقص قوانین امکان مسدود شدن دسترسی شما به گروه وجود دارد!", ctx.update.callback_query.id, {show_alert: true})


        }
    }

    async sendAllAnswers(ctx, data, chat_id,user_id,message_id) {
        console.log(data)
        if (data.indexOf("SAA") > -1) {
            // await

            var answers=await dbConnect.getAllAnswers(data.replace("SAA-",""))
            // console.log("injaaaaaaaaaaaaa",answers)
            if (answers.length==0){
                ctx.answerCbQuery("تا به حال به این سوال پاسخی داده نشده است. ", ctx.update.callback_query.id, {show_alert: true})

            }else {
                ctx.answerCbQuery("تعداد "+answers.length +" پاسخ برای شما ارسال شد." , ctx.update.callback_query.id, {show_alert: true})
                await ctx.telegram.forwardMessage(user_id,gpChatId,message_id)
                await ctx.reply("🔻🔻🔻🔻🔻🔻🔻",{chat_id:user_id})
            }


            for (var i=0;i<answers.length;i++){
                console.log(answers[i])
                await ctx.telegram.forwardMessage(user_id,gpChatId,answers[i].message_id)

            }



        }
    }


}

module.exports = CallBackHandler;
var crypto = require('crypto');
var mysql = require('mysql');
const InlineSearch = require('./class/inlinesearch.js')
const MessageHandler = require('./class/messagehandler.js')
const DBConnect = require('./class/dbconnect.js')
const CallBackHandler = require('./class/callbackhandler.js')
const HNNews = require('./class/hnnews.js')
let inlineSearch = new InlineSearch();
let messageHandler = new MessageHandler();
let dbConnect = new DBConnect();
let callBackHandler = new CallBackHandler();
let hnNews = new HNNews();
global.nightMode = "off";
global.gpChatId="-1001337508396"

const Telegraf = require('telegraf'),
    Token = process.env.BOT_TOKEN || '595693896:AAELDNl1N93pUd9btE1f12RKneaEO1AaQDs',
    fs = require('fs'),
    Bot = new Telegraf(Token);
const TelegrafBotanio = require('./lib/botanio.js')



const rateLimit = require('telegraf-ratelimit')

// Set limit to 1 message per 3 seconds
const limitConfig = {
    window: 3000,
    limit: 3,
    onLimitExceeded: (ctx, next) => {
        var until = Math.floor(new Date() / 1000) + ( 5 * 60 );
        ctx.telegram.restrictChatMember(ctx.chat.id, ctx.message.from.id, {
            can_send_messages: false,
            until_date: until
        });
        ctx.reply('شما به علت اسپم کردن در گروه به مدت 5 دقیقه از فعالیت محروم شدید!',{chat_id:ctx.message.from.id})
    }
}
Bot.use(rateLimit(limitConfig));

const botanio = new TelegrafBotanio(process.env.BOTANIO_TOKEN || "d6e895cb-a040-44cd-8e13-eaab5b71b560")

Bot.use(botanio.middleware())
const deleteIt = (msg) => {
    Bot.telegram.deleteMessage(msg.chat.id, msg.message_id);
};

const isAdmin = async (chat, user) => {
    try {
        var status = await Bot.telegram.getChatMember(chat, user);
        if (!status) return false;
        if (status.status == 'creator' || status.status == 'administrator') return true;
        return false;
    } catch (e) {
        return false;
    }
};

const escapeHTML = (str) => {
    var out = str.replace(/</g, '&lt;');
    out = out.replace(/>/g, '&gt;');
    out = out.replace(/&/g, '&amp;');
    out = out.replace(/"/g, '&quot;');
    return out;
};

const buildName = (from) => {
    if (from.username)
        return `<a href="https://t.me/${from.username}">${escapeHTML(from.first_name)}</a>`;
    else
        return from.first_name;
};

Bot.telegram.getMe().then((profile) => {
    global.my_id = profile.id;
});

Bot.command('start', (ctx) => {
    var text = ctx.update.message.text;
    var type = ctx.chat.type;
    // messageHandler.acceptRuleText(ctx,text,type)
    if (ctx.chat.type == 'private') {
        if ((text).indexOf("rule") > -1) {
            ctx.reply("مقررات مرتبط با عضویت در گروه جامعه کاربران لینوکس  دانشگاه صنعتی شریف،\n" +
                "\n" +
                "با سلام و عرض ادب و احترام بر عزیزان گرامی،\n" +
                "\n" +
                "ضمن خوش آمد گوئی به عزیزانی که جدیدا وارد گروه شده اند  به اطلاع می رسانم که تداوم عضویت در این گروه شرایط بسیار بسیار سختی !!!  را دارد که عبارتند از:\n" +
                "\n" +
                "\n" +
                "۱-انشای روان و درست\n" +
                "۲-عدم استفاده از لغات عامیانه مانند (آره - آخه - آهان -مچکرم -یِهو-نمیشه - مگه - نیس و ده ها لغت عامیانه دیگر)\n" +
                "۳-عدم درج آگهی نامرتبط با اهداف گروه \n" +
                "( آگهی استخدام و اگهی برای معرفی لینک های مرتبط با لینوکس منعی ندارد)\n" +
                "۴-عدم درج مطالب نامربوط به لینوکس\n" +
                "۵- پرسیدن سوال تا آنجائی که مقدور است دقیق و گویا\n" +
                "۶- تا آنجائی که مقدور است پاسخ ها مستدل و کامل باشد\n" +
                "۷-نوشتن پینگلیش مجاز نمی باشد\n" +
                "۸-عدم بحث های دو به دو.", {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [[{
                        text: "قوانین را میپذیرم",
                        callback_data: "acceptrule"
                    }]]
                }
            }).then((sent) => {
                setTimeout(() => {
                    // deleteIt(sent);
                }, 30000);
            });
        }
        console.log(ctx.update.message)


    } else
        deleteIt(ctx.message);
});
Bot.command('nightmodeon', async (ctx) => {
    if (!await isAdmin(ctx.chat.id, ctx.from.id)) return deleteIt(ctx.message);

    nightModeOn()
    ctx.reply("ساعت شبانه فعال شد" + " در این ساعات امکان فعالیت در گروه وجود ندارد")

    setTimeout(() => {
        deleteIt(ctx.message);
    }, 3000);


});
Bot.command('nightmodeoff', async(ctx) => {
    if (!await isAdmin(ctx.chat.id, ctx.from.id)) return deleteIt(ctx.message);

    nightModeOff()
    ctx.reply("ساعت شبانه غیر فعال"+ " شد !").then((sent) => {
        setTimeout(() => {
            deleteIt(ctx.message);
            deleteIt(sent);

        }, 30000);
    })


});
Bot.command('nightmodestate', (ctx) => {

    ctx.reply(" وضعیت ساعت شبانه : " + nightMode).then((sent) => {
        setTimeout(() => {
            deleteIt(ctx.message);
            deleteIt(sent);

        }, 30000);
    })


});
Bot.command('HN24', (ctx) => {
    ctx.reply('در حال ارسال #خبر . . .', {}).then((sent) => {
        setTimeout(() => {
            deleteIt(sent);
        }, 30000);
    });
    setTimeout(() => {
        deleteIt(ctx.message);
    }, 3000);
    hnNews.last24(ctx);


});
Bot.on('channel_post', (ctx) => {
    ctx.leaveChat();
});

// Bot.use( ( ctx, next ) => {
//     if ( ctx.chat.type == 'supergroup' ) {
//     let chats = require( './chats.json' );
//
//     if ( ! chats.chats[ ctx.chat.id ] )
//         chats.chats[ ctx.chat.id ] = ctx.chat;
//
//     chats = JSON.stringify( chats );
//     fs.writeFile( './chats.json', chats, 'utf-8', () => {} );
// }
// next();
// } );

Bot.hears('!flood', (ctx) => {
    if (!ctx.message.reply_to_message)
        return deleteIt(ctx.message);

    ctx.botanio.track('!flood');

    ctx.reply('لطفا از پخش‌کردن پیام‌ها بپرهیزید و موضوع را در قالب یک پیام ارسال کنید. 🙂', {
        reply_to_message_id: ctx.message.reply_to_message.message_id
    }).then((sent) => {
        setTimeout(() => {
            deleteIt(sent);
            deleteIt(ctx.message);
        }, 10000);
    });
});

Bot.hears('!smart', (ctx) => {
    if (!ctx.message.reply_to_message)
        deleteIt(ctx.message);

    ctx.replyWithHTML('لطفا پیش از پرسش سوال، مقاله‌ی <a href="https://wiki.ubuntu.ir/wiki/Smart_Questions">چگونه هوشمندانه سوال کنیم</a> را مطالعه کنید. 🙂', {
        reply_to_message_id: ctx.message.reply_to_message.message_id
    }).then((sent) => {
        setTimeout(() => {
            deleteIt(sent);
            deleteIt(ctx.message);
        }, 10000);
    });
});

Bot.hears('!ask', (ctx) => {
    if (!ctx.message.reply_to_message)
        deleteIt(ctx.message);

    ctx.reply('لطفا از پرسش سوالاتی از قبیل «کسی هست» یا «کسی با X کار کرده» بپرهیزید و مستقیما سوال خود را مطرح کنید. 🙂', {
        reply_to_message_id: ctx.message.reply_to_message.message_id
    }).then((sent) => {
        setTimeout(() => {
            deleteIt(sent);
            deleteIt(ctx.message);
        }, 10000);
    });
});


Bot.hears('gl5q', (ctx) => {
    var user_id = ctx.update.message.from.id;

    var last=  dbConnect.getLastQ(3)
    messageHandler.sendLastQuestionToUser(ctx,user_id)
 ctx.reply(last)
});

Bot.hears(/\/gag(.*)/, async (ctx) => {
    if (!await isAdmin(ctx.chat.id, ctx.from.id)) return deleteIt(ctx.message);

    var mins = +ctx.match[1].trim();
    if (!mins || mins < 0 || mins > 60) mins = 5;

    var target = ctx.message.reply_to_message;
    if (!target) return deleteIt(ctx.message);
    if (target.from.id == ctx.from.id) return deleteIt(ctx.message);
    if (await isAdmin(ctx.chat.id, target.from.id)) return deleteIt(ctx.message);

    var until = Math.floor(new Date() / 1000) + ( mins * 60 );
    Bot.telegram.restrictChatMember(ctx.chat.id, target.from.id, {
        can_send_messages: false,
        until_date: until
    });

    deleteIt(ctx.message);
    ctx.replyWithHTML(`کاربر ${buildName(target.from)} به مدت <b>${mins}</b> دقیقه از ارسال هر گونه پیام توسط ادمین ${buildName(ctx.from)} منع گردید.`, {
        disable_web_page_preview: true
    });
});

Bot.hears('لینک گروه', async (ctx) => {
    try {
        ctx.botanio.track('لینک گروه');

        var chatLink = await ctx.exportChatInviteLink();
        var thisChat = await ctx.telegram.getChat(ctx.chat.id);

        ctx.replyWithHTML(`گروه <b>${thisChat.title}</b>
<a href="${chatLink}">عضویت در این گروه</a>`, {
            reply_to_message_id: ctx.message.message_id
        }).then((sent) => {
            setTimeout(() => {
                deleteIt(sent);
                deleteIt(ctx.message);
            }, 30000);
        });
    } catch (e) {
        //...
    }
});

Bot.hears(/#موقت/, async (ctx) => {
    if (!await isAdmin(ctx.chat.id, ctx.from.id)) return deleteIt(ctx.message);

    setTimeout(() => {
        deleteIt(ctx.message);
    }, 30000);
});

// RESTRICT CONTENTS & USERS
// Bot.use( async ( ctx, next ) => {
//     var chat_id = ctx.chat.id, user_id = ctx.from.id;
// try {
//     if ( await isAdmin( chat_id, user_id ) ) return;
//     if ( user_id == my_id ) return;
//     ctx.telegram.restrictChatMember( chat_id, user_id, {
//         can_send_messages:                      true,
//         can_send_media_messages:                true,
//         can_send_other_messages:                false,
//         can_add_web_page_previews:              false
//     } );
// } catch( e ) {
//     console.log( e );
// }
// next();
// } );

Bot.on('message', async (ctx, next) => {
    console.log(ctx.update.message)
    var chat_id=ctx.message.chat.id;

    var id = ctx.update.message.from.id;
    // ctx.telegram.sendCopy(id,ctx.message)

    var new_members = ctx.message.new_chat_members;

    if (nightModeTime()) {
        deleteIt(ctx.message)
        ctx.telegram.sendCopy(id,ctx.message)

        ctx.reply("به دلیل ساعت شبانه امکان ارسال پیام نیست!").then((sent) => {
            setTimeout(() => {
                deleteIt(sent);
                deleteIt(ctx.message);
            }, 10000);
        });

        return
    }
    if (await dbConnect.isRegister(id) == 1) {
        // ctx.reply("shoma hasty")
        await messageHandler.ruleCheck(ctx, id)
    } else {
        // await messageHandler.ruleCheck(ctx,id)
        // ctx.reply("shoma nisty")
        if (!new_members) {
            await dbConnect.registerUsers(id);
            // ctx.reply("sabtenamet kardim")

        }
    }
    var left_chat = ctx.message.left_chat_member
    if (!new_members) return next();
    dbConnect.registerUsers(id);
    console.log("ooooomaddddd")
    console.log(new_members)

    deleteIt(ctx.message);
    for (var member of new_members) {
        if (member.id == my_id) continue;
        if (member.username && member.username.toLowerCase().substr(-3, 3) == 'bot') {
            ctx.telegram.kickChatMember(ctx.chat.id, member.id);
        }
    }
});

Bot.on(['sticker', 'video_note', 'voice'], (ctx) => {
    deleteIt(ctx.message);
});

Bot.on('document', (ctx) => {
    if (ctx.message.document.mime_type == 'video/mp4')
        deleteIt(ctx.message);
});

Bot.hears([/t\.me/, /telegram\.me/], (ctx) => {
    deleteIt(ctx.message);
});
Bot.on('text', async (ctx) => {
    const message_id = (ctx.update.message.message_id).toString();
    var id = ctx.update.message.from.id;
    var chat_id=ctx.message.chat.id;
    var text = ctx.message.text;
    var inEnts = ctx.message.entities;
    var chatType=ctx.message.chat.type;

    await messageHandler.textToQuestion(ctx, id, message_id, text, inEnts)

    if (chatType=='private'){
        await messageHandler.textToAnswer(ctx, id, message_id, text, inEnts,ctx.message.reply_to_message)
        ctx.reply("be grouh ersaal shod");
    }else {
        await messageHandler.textToAnswer(ctx, id, message_id, text, inEnts,ctx.message.reply_to_message)

    }


    if (await dbConnect.getRuleState(id) && !messageHandler.noHashtag(inEnts,text)) {
        console.log("inaaaaaaaaa", dbConnect.getRuleState(id))


        ctx.reply('لطفا با توجه به قوانین از هشتگ های مناسب برای پیام خود استفاده کنید', {
            reply_to_message_id: ctx.message.message_id,disable_notification:true
        }).then((sent) => {
            ctx.telegram.forwardMessage(id,chat_id,message_id).then((fs)=>{
                ctx.reply("لیست هشتگ های قابل قبول در گروه \n #اخبار,#پاسخ,#سوال",{chat_id:id,reply_to_message_id:fs.message_id})

            })
            // ctx.telegram.sendCopy(chat_id,ctx.message)
            setTimeout(() => {
                deleteIt(sent);
                deleteIt(ctx.message);
            }, 10000);
        });


    }


});
Bot.on('callback_query', async (ctx) => {
    var data = ctx.update.callback_query.data;
    var chat_id = ctx.update.callback_query.message.chat.id;
    var user_id = ctx.update.callback_query.from.id;
    var message_id = ctx.update.callback_query.message.message_id;
    await callBackHandler.mosbatQuestionCBQuery(ctx, data, chat_id, message_id, user_id)
    await callBackHandler.manfiQuestionCBQuery(ctx, data, chat_id, message_id, user_id)
    await callBackHandler.mosbatAnswerCBQuery(ctx, data, chat_id, message_id, user_id)
    await callBackHandler.manfiAnswerCBQuery(ctx, data, chat_id, message_id, user_id)
    await callBackHandler.ruleAccept(ctx, data, chat_id)
    await callBackHandler.spamCBQuery(ctx, data, chat_id)
    await callBackHandler.sendAllAnswers(ctx,data,chat_id,user_id,message_id)


});

// Bot.on( 'message', async ( ctx, next ) => {
//     if ( ctx.message.forward_from_chat && ctx.message.forward_from_message_id )
//     return deleteIt( ctx.message );
//
// if ( ctx.message.caption ) {
//     var caption = ctx.message.caption;
//     if ( /t(?:elegram)?\.me/.test( caption ) ) return deleteIt( ctx.message );
//
//     var regex = /(@[A-Z]*[a-z]*[0-9]*[_]*)/g;
//     var usernames = caption.match( regex );
//
//     for ( var username of usernames ) {
//         try {
//             var chat = await ctx.telegram.getChat( username );
//         } catch( e ) {
//             continue;
//         }
//
//         if ( chat && chat.type == 'channel' ) {
//             deleteIt( ctx.message );
//             break;
//         }
//     }
// }
// } );

Bot.on('edited_message', async (ctx, next) => {
    var msg = ctx.update.edited_message,
        text = msg.caption || msg.text || '';

    if (/t(?:elegram)?\.me/.test(text)) return deleteIt(msg);

    var regex = /(@[A-Z]*[a-z]*[0-9]*[_]*)/g;
    var usernames = text.match(regex);

    for (var username of usernames) {
        try {
            var chat = await ctx.telegram.getChat(username);
        } catch (e) {
            continue;
        }

        if (chat && chat.type == 'channel') {
            deleteIt(msg);
            break;
        }
    }
});

Bot.on('inline_query', (ctx) => {
    const query = ctx.inlineQuery.query;
    const queryId = ctx.inlineQuery.id;
    inlineSearch.search(ctx, query, queryId);

})

Bot.startPolling();


function noHashtag(inEnts) {
    var ents = inEnts || [];
    var hasharray = [];
    for (var ent of ents) {
        if (ent.type && ent.type == 'hashtag') {
            console.log("yeeeeee")
            var hashtag = "hashtag"
            console.log(hashtag)
            hasharray.push(hashtag)
        }
    }
    return hasharray.length;
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

function nightModeOff() {
    nightMode = "off";
}

function nightModeOn() {
    nightMode = "on";
}

function nightModeTime() {
    if (nightMode == "on") {
        return 1
    } else {
        return 0
    }

}

function deleteAtNightModeTime(ctx) {
    if (nightModeTime()) {
        deleteIt(ctx.message)
    }

}

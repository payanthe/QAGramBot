var crypto = require('crypto');
var mysql = require('mysql');
const InlineSearch=require('./class/inlinesearch.js')
let inlineSearch = new InlineSearch();
global.nightMode = "ye chizi";

const Telegraf = require('telegraf'),
    Token = process.env.BOT_TOKEN || '595693896:AAELDNl1N93pUd9btE1f12RKneaEO1AaQDs',
    fs = require('fs'),
    Bot = new Telegraf(Token);
const TelegrafBotanio = require('./lib/botanio.js')

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
    if (ctx.chat.type == 'private')
        ctx.replyWithHTML('ربات <b>Micro Drone</b>. از @ehsaan_me');
    else
        deleteIt(ctx.message);
});
Bot.command('nightmodeon', (ctx) => {
    nightModeOn()
    ctx.reply("ساعت شبانه فعال شد" + nightMode + " در این ساعات امکان فعالیت در گروه وجود ندارد")

    setTimeout(() => {
        deleteIt(ctx.message);
    }, 3000);


});
Bot.command('nightmodeoff', (ctx) => {
    nightModeOff()
    ctx.reply("ساعت شبانه غیر فعال" + nightMode + " شد !").then((sent) => {
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

// Bot.hears()

Bot.hears('لینک گروه', async (ctx) => {
    try {
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

Bot.on('message', (ctx, next) => {
    if (nightModeTime()) {
        deleteIt(ctx.message)
        ctx.reply("به دلیل ساعت شبانه امکان ارسال پیام نیست!").then((sent) => {
            setTimeout(() => {
                deleteIt(sent);
                deleteIt(ctx.message);
            }, 30000);
        });

        return
    }
    var new_members = ctx.message.new_chat_members;
    if (!new_members) return next();

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
    console.log(ctx)
    console.log(ctx.message.entities)
    console.log(ctx.message)
    console.log("injaaaaaaaaaaaa " + noHashtag(ctx.message.entities))
    console.log("aya soal hast" + isQuestion(ctx.message.entities, ctx.message.text))
    await textToQuestion(ctx, ctx.message.text, ctx.message.entities)
    var ents = ctx.message.entities || [];
    var hasharray = [];
    for (var ent of ents) {
        if (ent.type && ent.type == 'hashtag') {
            console.log("yeeeeee")
            var hashtag = ctx.message.text.substr(ent.offset, ent.length);
            console.log(hashtag)
            hasharray.push(hashtag)

            if (hashtag == "#سوال") {
                ctx.botanio.track('#سوال');
                console.log("aree")
                ctx.reply('soale shoma sabt shod ', {
                    reply_to_message_id: ctx.message.message_id
                }).then((sent) => {
                    setTimeout(() => {
                        deleteIt(sent);
                        deleteIt(ctx.message);
                        // ctx.reply( ctx.message.text )
                    }, 10000);
                });
            }

        }

        if (ent.type && ent.type == 'mention') {
            var mentioned = ctx.message.text.substr(ent.offset, ent.length);
            try {
                var chat = await ctx.telegram.getChat(mentioned);
                if (chat && chat.type == 'channel') {
                    deleteIt(ctx.message);
                    break;
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    console.log("hash array" + hasharray.length)
    if (hasharray.length == 0) {
        console.log("aree")
        ctx.reply('hashtag bezanid  ', {
            reply_to_message_id: ctx.message.message_id
        }).then((sent) => {
            setTimeout(() => {
                deleteIt(sent);
                deleteIt(ctx.message);
            }, 10000);
        });

    }
});
Bot.on('text', async (ctx) => {
    console.log(ctx)
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
    var query = ctx.inlineQuery.query;
    var queryId=ctx.inlineQuery.id;
    inlineSearch.search(ctx,query,queryId);
    // console.log(ctx.inlineQuery.query)
    // var query = ctx.inlineQuery.query;
    // var search = query.search(/search/i);
    // var searchMe = ctx.inlineQuery.query;
    //
    //
    // if (search == 0) {
    //     console.log('yessssss ')
    //     searchMe = query.replace('search', '')
    //     result = [{
    //         type: 'article',
    //         id: crypto.createHash('sha1').update(query).digest('base64'),
    //         title: "Google Search",
    //         description: searchMe,
    //         thumb_url: "https://www.infostructures.com/wordpress/wp-content/uploads/2016/02/Google.G..jpg",
    //         reply_markup: {inline_keyboard: [[{text: "Go To Google", url: "http://google.com/search?q=" + searchMe}]]}
    //         ,
    //         input_message_content: {
    //             message_text: "#پاسخ" + " \n *Search Google:" + searchMe + "*",
    //             parse_mode: 'Markdown'
    //         }
    //     },
    //
    //
    //         {
    //             type: 'article',
    //             id: crypto.createHash('sha1').update(query).digest('base64') + "G",
    //             title: "StackOverFlow Search",
    //             description: searchMe,
    //             thumb_url: "https://www.cluedin.net/images/providers/stackoverflow.png",
    //             reply_markup: {
    //                 inline_keyboard: [[{
    //                     text: "Go To StackOverFlow",
    //                     url: "https://stackoverflow.com/search?q=" + searchMe
    //                 }]]
    //             }
    //             ,
    //             input_message_content: {
    //                 message_text: "#پاسخ" + " \n *Search StackOverFlow:" + searchMe + "*",
    //                 parse_mode: 'Markdown'
    //             }
    //         }
    //
    //
    //         ,
    //         {
    //             type: 'article',
    //             id: crypto.createHash('sha1').update(query).digest('base64') + "WH",
    //             title: "WikiHow Search",
    //             description: searchMe,
    //             thumb_url: "https://www.wikihow.com/images/7/71/Wh-logo.jpg",
    //             reply_markup: {
    //                 inline_keyboard: [[{
    //                     text: "Go To StackOverFlow",
    //                     url: "https://www.wikihow.com/wikiHowTo?search=" + searchMe
    //                 }]]
    //             }
    //             ,
    //             input_message_content: {
    //                 message_text: "#پاسخ" + " \n *Search WikiHow:" + searchMe + "*",
    //                 parse_mode: 'Markdown'
    //             }
    //         }
    //         ,
    //
    //
    //         {
    //             type: 'article',
    //             id: crypto.createHash('sha1').update(query).digest('base64') + "Q",
    //             title: "Quora Search",
    //             description: searchMe,
    //             thumb_url: "https://cdn2.iconfinder.com/data/icons/Quora-Icons/256/Quora-2.png",
    //             reply_markup: {
    //                 inline_keyboard: [[{
    //                     text: "Go To Quora",
    //                     url: "https://www.quora.com/search?q=" + searchMe
    //                 }]]
    //             }
    //             ,
    //             input_message_content: {
    //                 message_text: "#پاسخ" + " \n *Search Quora:" + searchMe + "*",
    //                 parse_mode: 'Markdown'
    //             }
    //         }
    //     ]
    //     // Explicit usage
    //     ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)
    // }
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

var crypto = require('crypto');

class InlineSearch {


    search(ctx,query,query_id){

        let searchMe;
        if (this.isSearch(query)) {
            searchMe = query.replace('search', '')
            var result = [
                {
                type: 'article',
                id: crypto.createHash('sha1').update(query).digest('base64'),
                title: "Google Search",
                description: searchMe,
                thumb_url: "https://www.infostructures.com/wordpress/wp-content/uploads/2016/02/Google.G..jpg",
                reply_markup: {inline_keyboard: [[{text: "Go To Google", url: "http://google.com/search?q=" + searchMe}]]}
                ,
                input_message_content: {
                    message_text: "#پاسخ" + " \n *Search Google:" + searchMe + "*",
                    parse_mode: 'Markdown'
                }
            },


                {
                    type: 'article',
                    id: crypto.createHash('sha1').update(query).digest('base64') + "G",
                    title: "StackOverFlow Search",
                    description: searchMe,
                    thumb_url: "https://www.cluedin.net/images/providers/stackoverflow.png",
                    reply_markup: {
                        inline_keyboard: [[{
                            text: "Go To StackOverFlow",
                            url: "https://stackoverflow.com/search?q=" + searchMe
                        }]]
                    }
                    ,
                    input_message_content: {
                        message_text: "#پاسخ" + " \n *Search StackOverFlow:" + searchMe + "*",
                        parse_mode: 'Markdown'
                    }
                }


                ,
                {
                    type: 'article',
                    id: crypto.createHash('sha1').update(query).digest('base64') + "WH",
                    title: "WikiHow Search",
                    description: searchMe,
                    thumb_url: "https://www.wikihow.com/images/7/71/Wh-logo.jpg",
                    reply_markup: {
                        inline_keyboard: [[{
                            text: "Go To StackOverFlow",
                            url: "https://www.wikihow.com/wikiHowTo?search=" + searchMe
                        }]]
                    }
                    ,
                    input_message_content: {
                        message_text: "#پاسخ" + " \n *Search WikiHow:" + searchMe + "*",
                        parse_mode: 'Markdown'
                    }
                }
                ,


                {
                    type: 'article',
                    id: crypto.createHash('sha1').update(query).digest('base64') + "Q",
                    title: "Quora Search",
                    description: searchMe,
                    thumb_url: "https://cdn2.iconfinder.com/data/icons/Quora-Icons/256/Quora-2.png",
                    reply_markup: {
                        inline_keyboard: [[{
                            text: "Go To Quora",
                            url: "https://www.quora.com/search?q=" + searchMe
                        }]]
                    }
                    ,
                    input_message_content: {
                        message_text: "#پاسخ" + " \n *Search Quora:" + searchMe + "*",
                        parse_mode: 'Markdown'
                    }
                }
            ]
            ctx.telegram.answerInlineQuery(query_id, result)
        }

    }
    isSearch(string){
        if(string.search(/search/i)==0){
            return true;
        }else {
            return false
        }
    }
};

module.exports = InlineSearch;
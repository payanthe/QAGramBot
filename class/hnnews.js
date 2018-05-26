var hn = require('hacker-news-api');
class HNNews{
    last24(ctx){
        hn.story().show_hn().since('past_24h',function (error, data) {
            if (error)
                console.log("ridim too news")
                // throw error;

            for (var i=0;i<10;i++){
                var message= "#اخبار \n"+" * HN NEWS * \n";

                if ((data.hits[i]).title) {
                    if (((data.hits[i]).title).indexOf("Ask HN")>0){
                        continue;
                    }
                    message+="*";
                    message +=(data.hits[i]).title;
                    message+="*";
                }
                if ((data.hits[i]).url) {
                    message +="\n"+(data.hits[i]).url;
                }
                if ((data.hits[i]).story_text) {
                    message +="\n"+(data.hits[i]).story_text;
                }
                // console.log(message)


                    ctx.reply(message, {
                        parse_mode: "Markdown",
                    })




            }
            // console.log(data);

        });
    }

}
module.exports = HNNews
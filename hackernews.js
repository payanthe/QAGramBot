var hn = require('hacker-news-api');

hn.story().show_hn().since('past_24h',function (error, data) {
    if (error) throw error;

    for (i=0;i<10;i++){
        var message=" * HN NEWS * \n";

        if ((data.hits[i]).title) {
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

    }
    console.log(data);

});
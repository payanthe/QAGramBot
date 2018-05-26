const telegraph = require('telegraph-node')
const ph = new telegraph()
ph.createAccount('hi', {short_name: 'Sandbox', author_name: 'Fonov Sergei'}).then((result) => {
    console.log(result)
    // console.log(result)
    var resultesh=result.access_token

    ph.createPage(result.access_token, 'test', [{tag: 'h1', children: ['Hello world!']},{tag: 'h3', children: ['Hareed!']}], {
        return_content: true
    }).then((result) => {
        console.log(result)
    })
})
function test(token,ph) {
    ph.getAccountInfo(token, {}).then((result) => {
        console.log(result)
        return result
    })


}

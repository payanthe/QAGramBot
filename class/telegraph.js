const telegraph = require('telegraph-node')
const ph = new telegraph()
var token= "fd32ba30b7b607a6ed39e5e3a541df0326ed5253013dd81e79bb54d38f69"
// ph.createAccount('hi', {short_name: 'Sandbox', author_name: 'Fonov Sergei'}).then((result) => {
//     console.log(result)
// })

ph.createPage(token, 'Fonov Sergei', [{tag: 'h1', children: ['سلام']}], {
    return_content: true
}).then((result) => {
    console.log(result)
})
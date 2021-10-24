import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"SETUP":{"key":"SETUP","next":[],"prev":null,"level":0,"type":"root"},"AGE[PARAMS]":{"key":"AGE[PARAMS]","next":["AGE[WORK]"],"prev":null,"level":0,"type":"root"},"AGE[WORK]":{"key":"AGE[WORK]","next":["AGE[SEND]"],"prev":"AGE[PARAMS]","level":1,"type":"branch"},"AGE[SEND]":{"key":"AGE[SEND]","next":[],"prev":"AGE[WORK]","level":2,"type":"leaf"},"INFO[PARAMS]":{"key":"INFO[PARAMS]","next":["INFO[SEND]"],"prev":null,"level":0,"type":"root"},"INFO[SEND]":{"key":"INFO[SEND]","next":[],"prev":"INFO[PARAMS]","level":1,"type":"leaf"},"REQUEST":{"key":"REQUEST","next":["INFO","AGE"],"prev":null,"level":0,"type":"root"},"INFO":{"key":"INFO","next":[],"prev":"REQUEST","level":1,"type":"leaf"},"AGE":{"key":"AGE","next":[],"prev":"REQUEST","level":1,"type":"leaf"},"SERVER":{"key":"SERVER","next":["HANDLER"],"prev":null,"level":0,"type":"root"},"HANDLER":{"key":"HANDLER","next":["LISTENER"],"prev":"SERVER","level":1,"type":"branch"},"LISTENER":{"key":"LISTENER","next":[],"prev":"HANDLER","level":2,"type":"leaf"},"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"type":"root"}});
import URL from "url"
import http from "http"

quiv.tokens["SETUP"] = []
quiv.arrows["SETUP"] = (value, key, prev, next) => {
const SETTINGS = {
ROUTES: {
"/age": { node: "AGE", protected: false }
},
PORT: 8075,
match: {
url: (args, url) => args.split("?")[0] === url,
method: (args, method) => args === method
},
end: (res) => ({
status: (status) => res.writeHead(status,
{ "Content-Type": "application/json" }) &&
{ send: (data) => void(res.end(JSON.stringify(data))) }
}),
toJSON: (json,...args) => JSON.parse(json,...args),
toString: (json,...args) => JSON.stringify(json,...args),
tryCatch: (trier, catcher) => {
let output
try { output = trier() } catch(err){
output = catcher(err.message) }
return output
},
CODES: {
SUCCESS: 200,
INVALID: 403,
NOT_EXIST: 404
}
}
return quiv.go("TEST")({ SETTINGS })
};

quiv.tokens["AGE[PARAMS]"] = ["::","{","url","res","body","match","method","end","routes","toJSON","tryCatch","toString","CODES","}"]
quiv.arrows["AGE[PARAMS]"] = (value, key, prev, next) => {
const {url,res,body,match,method,end,routes,toJSON,tryCatch,toString,CODES} = value;

const data = toJSON(body)
if (!data) return void (end(res).status(CODES.INVALID).send({ message: "No data provided"}))
const date = new Date(data.date)
if (!(date.getTime() === date.getTime())) return void(end(res).status(CODES.INVALID).send({ message: "Invalid date!"}))
return { date, end, res, CODES }

}
quiv.tokens["AGE[WORK]"] = ["::","{","date","end","res","CODES","}"]
quiv.arrows["AGE[WORK]"] = (value, key, prev, next) => {
const {date,end,res,CODES} = value;

const today = new Date()
const birthDate = date
let age = today.getFullYear() - birthDate.getFullYear()
const month = today.getMonth() - birthDate.getMonth()
if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
age--
}
return { end, res, age, CODES }

}
quiv.tokens["AGE[SEND]"] = ["::","{","end","res","age","CODES","}"]
quiv.arrows["AGE[SEND]"] = (value, key, prev, next) => {
const {end,res,age,CODES} = value;
return end(res).status(CODES.SUCCESS).send(age) ?? age
};

quiv.tokens["INFO[PARAMS]"] = ["::","{","end","res","age","CODES","}"]
quiv.arrows["INFO[PARAMS]"] = (value, key, prev, next) => {
const {end,res,age,CODES} = value;

const info = 'Lorem ispum dolor bla bla'
return {...value, info}
}
quiv.tokens["INFO[SEND]"] = ["::","{","info","end","res","age","CODES","}"]
quiv.arrows["INFO[SEND]"] = (value, key, prev, next) => {
const {info,end,res,age,CODES} = value;
return end(res).status(CODES.SUCCESS).send(info) ?? info
};

quiv.tokens["REQUEST"] = ["::","{","method","req","res","SETTINGS","}"]
quiv.arrows["REQUEST"] = (value, key, prev, next) => {
const {method,req,res,SETTINGS} = value;

const { body, query, url } = req
const { ROUTES } = SETTINGS
const queries = query?.split("&").map(q => {
const [key, value] = q.split("=")
return { [key]: value }
}).reduce((acc,item) => ({...acc,...item}),{}) || {}
return { method, body, query: queries, res, url, ...SETTINGS }

}
quiv.tokens["INFO"] = ["*","::","{","match","url","method","}"]
quiv.arrows["INFO"] = async (value, key, prev, next) => {
const {match,url,method} = value;
return (
!match.url(url, "/info") ||
!match.method(method, "GET")
) ?
void 0
: ( await quiv.go("INFO[PARAMS]")(value))["INFO[SEND]"]

}
quiv.tokens["AGE"] = ["*","::","{","match","url","method","}"]
quiv.arrows["AGE"] = async (value, key, prev, next) => {
const {match,url,method} = value;
return (
!match.url(url, "/age") ||
!match.method(method, "POST")
) ?
void 0
: ( await quiv.go("AGE[PARAMS]")(value))["AGE[SEND]"]
};

quiv.tokens["SERVER"] = ["*","!","::","{","SETTINGS","}"]
quiv.arrows["SERVER"] = async (value, key, prev, next) => {
const {SETTINGS} = value;
quiv.visit("SERVER");

quiv.setRoot("REQUEST")
return { SETTINGS }

}
quiv.tokens["HANDLER"] = ["::","{","SETTINGS","}"]
quiv.arrows["HANDLER"] = (value, key, prev, next) => {
const {SETTINGS} = value;

const start = (req, res) => {
const method = req.method
const urlParsed = URL.parse(req.url)
const query = urlParsed.query
if (req.url === "/favicon.ico") {
res.writeHead(CODES.SUCCESS, { "Content-Type": "image/x-icon" })
return res.end()
}

let body = ""
req.on("data", chunk => body += chunk)
req.on("end", () => {
if (method !== "GET" && body) {
req.body = body
}
req.query = query
quiv.go(quiv.getRoot())({ method, req, res, SETTINGS })
})
}
return { PORT: SETTINGS.PORT, start, SETTINGS }

}
quiv.tokens["LISTENER"] = ["::","{","PORT","start","SETTINGS","}"]
quiv.arrows["LISTENER"] = (value, key, prev, next) => {
const {PORT,start,SETTINGS} = value;

const server = http.createServer()
server.listen(PORT, () => quiv.log("Server started!\nListening at http://localhost:" + PORT))
server.on("request", start)
const port = server.address().port;
return { stop: () => server.close() }
};

quiv.tokens["TEST"] = ["*","!","::","{","SETTINGS","}"]
quiv.arrows["TEST"] = async (value, key, prev, next) => {
const {SETTINGS} = value;
quiv.visit("TEST");

const { tree, root } = quiv.test
const mockRes = {
SETTINGS: {...SETTINGS, end: (res) => ({
status: (status) => ({ send: (data) => void(JSON.stringify(data)) })
})
},
res: { writeHead: () => {} },
}
const server =  await  quiv.go("SERVER")({ SETTINGS })
const URL = 'http://localhost:' + SETTINGS.PORT
const suites = {}

suites["TREE_INFO_GET_0"] =  await  tree("REQUEST")
.input({
...mockRes,
method: 'GET',
req: {
query: '',
url: '/info'
}
})
.output({ "INFO": "Lorem ispum dolor bla bla" })
.should('Tree - Send result from INFO leaf')

suites["TREE_AGE_POST_0"] =  await  tree("REQUEST")
.input({
...mockRes,
method: 'POST',
req: {
body: JSON.stringify({
"date": "06.29.1990"
}),
query: '',
url: '/age'
}
})
.output({ "AGE": 31 })
.should('Tree - Send result from AGE leaf')



suites["R2L_AGE_POST_0"] =  await  root("REQUEST")
.input({
...mockRes,
method: 'POST',
req: {
body: JSON.stringify({
"date": "06.29.1990"
}),
query: '',
url: '/age'
}
})
.leaf("AGE")
.output(31)
.should("Path - Send correct age")

suites["R2L_AGE_POST_1"] =  await  root("REQUEST")
.input({
...mockRes,
method: 'POST',
req: {
body: JSON.stringify({
"date": "03.29.1999"
}),
query: '',
url: '/age'
}
})
.leaf("AGE")
.output(22)
.should("Path - Send correct age")

server["LISTENER"].stop()

quiv.leave('SERVER')
/*
after tests passed start the server
*/
Object.values(suites).every(test => test) ?
quiv.go("SERVER")({ SETTINGS }) : console.log('Not all test have passed, server is not started!')
};
export default (value) => {
quiv.setRoot(quiv.nodes["SETUP"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}
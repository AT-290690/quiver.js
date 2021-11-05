import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"SETUP":{"key":"SETUP","next":[],"prev":null,"level":0,"group":0,"type":"root"},"AGE[PARAMS]":{"key":"AGE[PARAMS]","next":["AGE[WORK]"],"prev":null,"level":0,"group":1,"type":"root"},"AGE[WORK]":{"key":"AGE[WORK]","next":["AGE[SEND]"],"prev":"AGE[PARAMS]","level":1,"group":1,"type":"branch"},"AGE[SEND]":{"key":"AGE[SEND]","next":[],"prev":"AGE[WORK]","level":2,"group":1,"type":"leaf"},"INFO[PARAMS]":{"key":"INFO[PARAMS]","next":["INFO[SEND]"],"prev":null,"level":0,"group":2,"type":"root"},"INFO[SEND]":{"key":"INFO[SEND]","next":[],"prev":"INFO[PARAMS]","level":1,"group":2,"type":"leaf"},"REQUEST":{"key":"REQUEST","next":["INFO","AGE"],"prev":null,"level":0,"group":3,"type":"root"},"INFO":{"key":"INFO","next":[],"prev":"REQUEST","level":1,"group":3,"type":"leaf"},"AGE":{"key":"AGE","next":[],"prev":"REQUEST","level":1,"group":3,"type":"leaf"},"SERVER":{"key":"SERVER","next":["HANDLER"],"prev":null,"level":0,"group":4,"type":"root"},"HANDLER":{"key":"HANDLER","next":["LISTENER"],"prev":"SERVER","level":1,"group":4,"type":"branch"},"LISTENER":{"key":"LISTENER","next":[],"prev":"HANDLER","level":2,"group":4,"type":"leaf"},"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"group":5,"type":"root"}});
import URL from "url"
import http from "http"

quiv.fn["SETUP"] = (value, key, prev, next) => {
const SETTINGS = {
PORT: 8075,
match: {
url: (args, url) => args.split("?")[0] === url,
method: (args, method) => args === method
},
end: (res) => ({
status: (status) => res.writeHead(status,
{ "Content-Type": "application/json" }) &&
{ send: (data) => {
res.end(JSON.stringify(data))
return data
}
}
}),
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

quiv.fn["AGE[PARAMS]"] = (value, key, prev, next) => {
const {res,body,end,CODES} = value;

const data = JSON.parse(body)
if (!data) return void (end(res).status(CODES.INVALID).send({ message: "No data provided"}))
const date = new Date(data.date)
if (!(date.getTime() === date.getTime())) return void(end(res).status(CODES.INVALID).send({ message: "Invalid date!"}))
return { date, end, res, CODES }

}
quiv.fn["AGE[WORK]"] = (value, key, prev, next) => {
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
quiv.fn["AGE[SEND]"] = (value, key, prev, next) => {
const {end,res,age,CODES} = value;
return end(res).status(CODES.SUCCESS).send(age)
};

quiv.fn["INFO[PARAMS]"] = (value, key, prev, next) => {
const {end,res,age,CODES} = value;

const info = 'Lorem ispum dolor bla bla'
return {...value, info}
}
quiv.fn["INFO[SEND]"] = (value, key, prev, next) => {
const {info,end,res,age,CODES} = value;
return end(res).status(CODES.SUCCESS).send(info)
};

quiv.fn["REQUEST"] = (value, key, prev, next) => {
const {method,req,res,SETTINGS} = value;

const { body, query, url } = req
const queries = query?.split("&").map(q => {
const [key, value] = q.split("=")
return { [key]: value }
}).reduce((acc,item) => ({...acc,...item}),{}) || {}
return { method, body, query: queries, res, url, ...SETTINGS }

}
quiv.fn["INFO"] = async (value, key, prev, next) => {
const {match,url,method} = value;
return (
!match.url(url, "/info") ||
!match.method(method, "GET")
) ?
void 0
: ( await quiv.go("INFO[PARAMS]")(value))

}
quiv.fn["AGE"] = async (value, key, prev, next) => {
const {match,url,method} = value;
return (
!match.url(url, "/age") ||
!match.method(method, "POST")
) ?
void 0
: ( await quiv.go("AGE[PARAMS]")(value))
};

quiv.fn["SERVER"] = async (value, key, prev, next) => {
const {SETTINGS} = value;
quiv.visit("SERVER");

quiv.setRoot("REQUEST")
return { SETTINGS }

}
quiv.fn["HANDLER"] = (value, key, prev, next) => {
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
quiv.fn["LISTENER"] = (value, key, prev, next) => {
const {PORT,start,SETTINGS} = value;

const server = http.createServer()
server.listen(PORT, () => quiv.log("Server started!\nListening at http://localhost:" + PORT))
server.on("request", start)
const port = server.address().port;
return { stop: () => server.close() }
};

quiv.fn["TEST"] = async (value, key, prev, next) => {
const {SETTINGS} = value;
quiv.visit("TEST");

const { tree, root, isEqual, fail, success } = quiv.test
const mockRes = {
SETTINGS: {
...SETTINGS,
res: { writeHead: () => true, end: () => true },
}
}
const server =  await  quiv.go("SERVER")({ SETTINGS })
const URL = 'http://localhost:' + SETTINGS.PORT
const suites = {}

const endUtilResult = mockRes.SETTINGS.end(mockRes.SETTINGS.res).status(200).send(1);
suites["SETTINGS_END_0"] = isEqual(1, endUtilResult) ?
success('Equal - End util returns the correct result', 1, endUtilResult) : fail('end utility returns the correct result', 1, endUtilResult)


suites["TREE_INFO_GET_0"] =  await  tree("REQUEST")
.input({
...mockRes,
method: 'GET',
req: {
query: '',
url: '/info'
}
})
.output({ "INFO": {"INFO[SEND]": "Lorem ispum dolor bla bla" }})
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
.output({ "AGE": { "AGE[SEND]": 31 }})
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
.output({ "AGE[SEND]": 31 })
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
.output({ "AGE[SEND]": 22 })
.should("Path - Send correct age")


suites["R2L_AGE_POST_1"] =  await  root("REQUEST")
.input({
...mockRes,
method: 'POST',
req: {
body: JSON.stringify({
"date": "03.129.1999"
}),
query: '',
url: '/age'
}
})
.leaf("AGE")
.fail("Path - Short circuit if invalid date")

suites["R2L_AGE_SERVICE_0"] =  await  root("AGE[PARAMS]")
.input({
...mockRes.SETTINGS,
body: JSON.stringify({
"date": "03.29.1999"
}),
})
.leaf("AGE[SEND]")
.output(22)
.should("Path - Age Service")


server["LISTENER"].stop()

quiv.leave('SERVER')
/*
after tests passed start the server
*/
Object.values(suites).every(test => test) ?
quiv.go("SERVER")({ SETTINGS }) :
console.log('Not all test have passed, server is not started!')
};
export default (value) => {
quiv.setRoot(quiv.nodes["SETUP"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}
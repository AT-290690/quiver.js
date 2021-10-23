import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":["SETUP"],"prev":null,"level":0,"type":"root"},"SETUP":{"key":"SETUP","next":["SERVER"],"prev":"TEST","level":1,"type":"branch"},"SERVER":{"key":"SERVER","next":["HANDLER"],"prev":"SETUP","level":2,"type":"branch"},"HANDLER":{"key":"HANDLER","next":["LISTENER"],"prev":"SERVER","level":3,"type":"branch"},"LISTENER":{"key":"LISTENER","next":[],"prev":"HANDLER","level":4,"type":"leaf"},"REQUEST":{"key":"REQUEST","next":["AGE"],"prev":null,"level":0,"type":"root"},"AGE":{"key":"AGE","next":["AGE[WORK]"],"prev":"REQUEST","level":1,"type":"branch"},"AGE[WORK]":{"key":"AGE[WORK]","next":["AGE[SEND]"],"prev":"AGE","level":2,"type":"branch"},"AGE[SEND]":{"key":"AGE[SEND]","next":[],"prev":"AGE[WORK]","level":3,"type":"leaf"}});
import URL from "url"
import http from "http"

quiv.tokens["TEST"] = ["*","!"]
quiv.arrows["TEST"] = async (value, key, prev, next) => {
quiv.visit("TEST");

const { e2e, root } = quiv.test

const SETTINGS = {
ROUTES: {
"/age": { node: "AGE", protected: false }
},
PORT: 8075,
match: {
url: (args, url) => (args.split("?")[0] === url) || void 0,
method: (args, method) => (args === method) || void 0
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
const server =  await  quiv.go("SETUP")(SETTINGS)
 await  root("REQUEST")
.input({
method: 'POST',
init: {... SETTINGS, end: (res) => ({
status: (status) => ({ send: (data) => void(JSON.stringify(data)) })
})
},
res: { writeHead: () => {} },
req: {
body: JSON.stringify({
"date": "06.29.1990"
}),
query: '',
url: 'http://localhost:8000'
}
})
.leaf("AGE[SEND]")
.output(31)
.should("Send correct age")

 await  root("REQUEST")
.input({
method: 'POST',
init: {... SETTINGS, end: (res) => ({
status: (status) => ({ send: (data) => void(JSON.stringify(data)) })
})
},
res: { writeHead: () => {} },
req: {
body: JSON.stringify({
"date": "03.29.1999"
}),
query: '',
url: 'http://localhost:8000'
}
})
.leaf("AGE[SEND]")
.output(22)
.should("Send correct age")

server["LISTENER"].stop()

quiv.leave('SETUP')


return SETTINGS
}
quiv.tokens["SETUP"] = ["!"]
quiv.arrows["SETUP"] = (value, key, prev, next) => {
quiv.visit("SETUP");
return value
}
quiv.tokens["SERVER"] = ["*"]
quiv.arrows["SERVER"] = async (value, key, prev, next) => {
quiv.setRoot("REQUEST")
return { init: value }

}
quiv.tokens["HANDLER"] = ["::","{","init","}"]
quiv.arrows["HANDLER"] = (value, key, prev, next) => {
const {init} = value;

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
quiv.go(quiv.getRoot())({ method, req, res, init })
})
}
return { PORT: init.PORT, start, init }

}
quiv.tokens["LISTENER"] = ["::","{","PORT","start","init","}"]
quiv.arrows["LISTENER"] = (value, key, prev, next) => {
const {PORT,start,init} = value;

const server = http.createServer()
server.listen(PORT, () => quiv.log("http://localhost:" + PORT))
server.on("request", start)
const port = server.address().port;
return { output: "http://localhost:" + PORT, stop: () => server.close() }
};

quiv.tokens["REQUEST"] = ["::","{","method","req","res","init","}"]
quiv.arrows["REQUEST"] = (value, key, prev, next) => {
const {method,req,res,init} = value;

const { body, query, url } = req
const { ROUTES } = init
const queries = query?.split("&").map(q => {
const [key, value] = q.split("=")
return { [key]: value }
}).reduce((acc,item) => ({...acc,...item}),{}) || {}
const service = { method, body, query: queries, res, url, ...init }
return service

}
quiv.tokens["AGE"] = ["::","{","url","res","body","match","method","end","routes","toJSON","tryCatch","toString","CODES","}"]
quiv.arrows["AGE"] = (value, key, prev, next) => {
const {url,res,body,match,method,end,routes,toJSON,tryCatch,toString,CODES} = value;

match.url(url, "/age")
match.method(method, "POST")
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
export default (value) => {
quiv.setRoot(quiv.nodes["TEST"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}
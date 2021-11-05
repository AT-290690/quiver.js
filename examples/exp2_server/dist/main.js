import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"SERVER":{"key":"SERVER","next":[],"prev":null,"level":0,"group":0,"type":"root"},"AGE":{"key":"AGE","next":["AGE[POST]"],"prev":null,"level":0,"group":1,"type":"root"},"AGE[POST]":{"key":"AGE[POST]","next":["AGE[POST](validate)"],"prev":"AGE","level":1,"group":1,"type":"branch"},"AGE[POST](validate)":{"key":"AGE[POST](validate)","next":["AGE[POST](send)"],"prev":"AGE[POST]","level":2,"group":1,"type":"branch"},"AGE[POST](send)":{"key":"AGE[POST](send)","next":[],"prev":"AGE[POST](validate)","level":3,"group":1,"type":"leaf"},"CAT":{"key":"CAT","next":["CAT[GET]","CAT[POST]","CAT[PUT]","CAT[DELETE]"],"prev":null,"level":0,"group":2,"type":"root"},"CAT[GET]":{"key":"CAT[GET]","next":["CAT[GET][all](validate)","CAT[GET][id](validate)"],"prev":"CAT","level":1,"group":2,"type":"branch"},"CAT[GET][all](validate)":{"key":"CAT[GET][all](validate)","next":["CAT[GET][all](send)"],"prev":"CAT[GET]","level":2,"group":2,"type":"branch"},"CAT[GET][all](send)":{"key":"CAT[GET][all](send)","next":[],"prev":"CAT[GET][all](validate)","level":3,"group":2,"type":"leaf"},"CAT[GET][id](validate)":{"key":"CAT[GET][id](validate)","next":["CAT[GET][id](send)"],"prev":"CAT[GET]","level":2,"group":2,"type":"branch"},"CAT[GET][id](send)":{"key":"CAT[GET][id](send)","next":[],"prev":"CAT[GET][id](validate)","level":3,"group":2,"type":"leaf"},"CAT[POST]":{"key":"CAT[POST]","next":["CAT[POST](validate)"],"prev":"CAT","level":1,"group":2,"type":"branch"},"CAT[POST](validate)":{"key":"CAT[POST](validate)","next":["CAT[POST](send)"],"prev":"CAT[POST]","level":2,"group":2,"type":"branch"},"CAT[POST](send)":{"key":"CAT[POST](send)","next":[],"prev":"CAT[POST](validate)","level":3,"group":2,"type":"leaf"},"CAT[PUT]":{"key":"CAT[PUT]","next":["CAT[PUT](validate)"],"prev":"CAT","level":1,"group":2,"type":"branch"},"CAT[PUT](validate)":{"key":"CAT[PUT](validate)","next":["CAT[PUT](send)"],"prev":"CAT[PUT]","level":2,"group":2,"type":"branch"},"CAT[PUT](send)":{"key":"CAT[PUT](send)","next":[],"prev":"CAT[PUT](validate)","level":3,"group":2,"type":"leaf"},"CAT[DELETE]":{"key":"CAT[DELETE]","next":["CAT[DELETE](validate)"],"prev":"CAT","level":1,"group":2,"type":"branch"},"CAT[DELETE](validate)":{"key":"CAT[DELETE](validate)","next":["CAT[DELETE](send)"],"prev":"CAT[DELETE]","level":2,"group":2,"type":"branch"},"CAT[DELETE](send)":{"key":"CAT[DELETE](send)","next":[],"prev":"CAT[DELETE](validate)","level":3,"group":2,"type":"leaf"},"REQUEST":{"key":"REQUEST","next":[],"prev":null,"level":0,"group":3,"type":"root"}});
import FS from "fs"
const { mkdir, writeFile, access, readFile } = FS.promises
import URL from "url"
import http from "http"

quiv.fn["SERVER"] = async (value, key, prev, next) => {
const init = {
routes: {
"/cat": "CAT",
"/age": "AGE"
},
match: {
url: (args, url) => (args.url.split("?")[0] === url) || void 0,
method: (args, method) => (args.method === method) || void 0
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
DB_DIR: "./examples/exp2_server/dist/db/",
DB_FILE: "cats.json",
}

const PORT = 8075

const start = (req, res) => {
const method = req.method
const urlParsed = URL.parse(req.url)
const query = urlParsed.query
if (req.url === "/favicon.ico") {
res.writeHead(200, { "Content-Type": "image/x-icon" })
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

const server = http.createServer()
server.listen(PORT, () => quiv.log("http://localhost:" + PORT))
server.on("request", start)

 await  access(init.DB_DIR + init.DB_FILE).catch(async () => {
await mkdir(init.DB_DIR, { recursive: true } )
await writeFile(init.DB_DIR + init.DB_FILE,
`{"0": { "breed": "Siamese", "age": 3, "name": "Purr Mclaw" }}`)
})
quiv.setRoot("REQUEST")
};

quiv.fn["AGE"] = (value, key, prev, next) => {
return value.match.url(value, "/age") && value || void 0
}
quiv.fn["AGE[POST]"] = (value, key, prev, next) => {
return value.match.method(value, "POST") && value || void 0
}
quiv.fn["AGE[POST](validate)"] = (value, key, prev, next) => {
value.body = value.toJSON(value.body)
if (!value.body) return void (value.end(value.res).status(403).send({ message: "No data provided"}))
const date = new Date(value.body.date)
if (!(date.getTime() === date.getTime())) return void(value.end(value.res).status(403).send({ message: "Invalid date!"}))
return { ...value, date }
}
quiv.fn["AGE[POST](send)"] = (value, key, prev, next) => {
const today = new Date()
const birthDate = value.date
let age = today.getFullYear() - birthDate.getFullYear()
const month = today.getMonth() - birthDate.getMonth()
if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
age--
}
return value.end(value.res).status(200).send(age)
};

quiv.fn["CAT"] = (value, key, prev, next) => {
return value.match.url(value, "/cat") && value || void 0
}
quiv.fn["CAT[GET]"] = (value, key, prev, next) => {
return value.match.method(value, "GET") && value || void 0
}
quiv.fn["CAT[GET][all](validate)"] = (value, key, prev, next) => {
return !("id" in value.query) && value || void 0
}
quiv.fn["CAT[GET][all](send)"] = async (value, key, prev, next) => {
return value.end(value.res).status(200).send(value.toJSON( await  readFile(value.DB_PATH, "utf8")))
}
quiv.fn["CAT[GET][id](validate)"] = (value, key, prev, next) => {
return ("id" in value.query) && value || void 0
}
quiv.fn["CAT[GET][id](send)"] = async (value, key, prev, next) => {
const data =  await  readFile(value.DB_PATH, "utf8")
const json = value.toJSON(data)
value.tryCatch(()=> {
if(!json[value.query.id]) {
throw new Error("Cat not found")
} else {
value.end(value.res).status(200).send(json[value.query.id])
}
}, (message) => value.end(value.res).status(404).send({message}))

}
quiv.fn["CAT[POST]"] = (value, key, prev, next) => {
return value.match.method(value, "POST") && value || void 0
}
quiv.fn["CAT[POST](validate)"] = (value, key, prev, next) => {
if (!value.body) return void (value.end(value.res).status(403).send({ message: "No data provided!"}))
value.body = value.toJSON(value.body)
if (!value.body.name || !value.body.age || !value.body.breed) return void (value.end(value.res).status(403).send({ message: "Missing some or all fields."}))
return value
}
quiv.fn["CAT[POST](send)"] = async (value, key, prev, next) => {
const data =  await  readFile(value.DB_PATH, "utf8")
const json = value.toJSON(data)
const id = Object.keys(json).length
json[id] = { ...value.body, id }
 await  writeFile(value.DB_PATH, value.toString(json))
value.end(value.res).status(200).send({ message: "Cat added!" })

}
quiv.fn["CAT[PUT]"] = (value, key, prev, next) => {
return value.match.method(value, "PUT") && ("id" in value.query) && value || void 0
}
quiv.fn["CAT[PUT](validate)"] = (value, key, prev, next) => {
if (!value.body) return void (value.end(value.res).status(403).send({ message: "No data provided!"}))
value.body = value.toJSON(value.body)
if (!value.body.age) return void (value.end(value.res).status(403).send({ message: "Missing some or all fields."}))
return value
}
quiv.fn["CAT[PUT](send)"] = async (value, key, prev, next) => {
const data =  await  readFile(value.DB_PATH, "utf8")
const { id } = value.query
const json = value.toJSON(data)
if (!json[id]) return void(value.end(value.res).status(404).send({ message: "Cat not found!"}))
json[id] = { ...json[id], age: value.body.age }
 await  writeFile(value.DB_PATH, value.toString(json))
value.end(value.res).status(200).send({ message: "Cat updated!" })

}
quiv.fn["CAT[DELETE]"] = (value, key, prev, next) => {
return value.match.method(value, "DELETE") && value || void 0
}
quiv.fn["CAT[DELETE](validate)"] = (value, key, prev, next) => {
return ("id" in value.query) && value || void(value.end(value.res).status(403).send({ message: "No id provided!"}))
}
quiv.fn["CAT[DELETE](send)"] = async (value, key, prev, next) => {
const data =  await  readFile(value.DB_PATH, "utf8")
const json = value.toJSON(data)
const { id } = value.query
if (!json[id]) return value.end(value.res).status(403).send({ message: "Cat not found!"})
delete json[id]
 await  writeFile(value.DB_PATH, value.toString(json))
value.end(value.res).status(200).send({ message: "Cat deleted!" })
};

quiv.fn["REQUEST"] = (value, key, prev, next) => {
const { method, req, res, init } = value
const { match, end, routes, toJSON, tryCatch, toString, DB_DIR, DB_FILE } = init
const { body, query, url } = req
const queries = query?.split("&").map(q => {
const [key, value] = q.split("=")
return { [key]: value }
}).reduce((acc,item) => ({...acc,...item}),{}) || {}
const service = {
method, body, query: queries, res, url,
match, end, toJSON, toString, tryCatch, DB_PATH: DB_DIR + DB_FILE
}
quiv.go(routes[url.split("?")[0]])(service)
};
export default (value) => {
quiv.setRoot(quiv.nodes["SERVER"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}
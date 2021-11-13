import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"SERVER":{"key":"SERVER","next":[],"prev":null,"level":0,"group":0,"type":"root"},"REQUEST":{"key":"REQUEST","next":["ROUTER"],"prev":null,"level":0,"group":1,"type":"root"},"ROUTER":{"key":"ROUTER","next":["AGE","CAT"],"prev":"REQUEST","level":1,"group":1,"type":"branch"},"AGE":{"key":"AGE","next":["AGE[POST]"],"prev":"ROUTER","level":2,"group":1,"type":"branch"},"AGE[POST]":{"key":"AGE[POST]","next":["fn[0]"],"prev":"AGE","level":3,"group":1,"type":"branch"},"fn[0]":{"key":"fn[0]","next":["fn[1]"],"prev":"AGE[POST]","level":4,"group":1,"type":"branch"},"fn[1]":{"key":"fn[1]","next":[],"prev":"fn[0]","level":5,"group":1,"type":"leaf"},"CAT":{"key":"CAT","next":["CAT[GET]","CAT[POST]","CAT[PUT]","CAT[DELETE]"],"prev":"ROUTER","level":2,"group":1,"type":"branch"},"CAT[GET]":{"key":"CAT[GET]","next":["fn[2]"],"prev":"CAT","level":3,"group":1,"type":"branch"},"fn[2]":{"key":"fn[2]","next":["fn[3]","fn[4]"],"prev":"CAT[GET]","level":4,"group":1,"type":"branch"},"fn[3]":{"key":"fn[3]","next":[],"prev":"fn[2]","level":5,"group":1,"type":"leaf"},"fn[4]":{"key":"fn[4]","next":[],"prev":"fn[2]","level":5,"group":1,"type":"leaf"},"CAT[POST]":{"key":"CAT[POST]","next":["fn[5]"],"prev":"CAT","level":3,"group":1,"type":"branch"},"fn[5]":{"key":"fn[5]","next":["fn[6]"],"prev":"CAT[POST]","level":4,"group":1,"type":"branch"},"fn[6]":{"key":"fn[6]","next":[],"prev":"fn[5]","level":5,"group":1,"type":"leaf"},"CAT[PUT]":{"key":"CAT[PUT]","next":["fn[7]"],"prev":"CAT","level":3,"group":1,"type":"branch"},"fn[7]":{"key":"fn[7]","next":["fn[8]"],"prev":"CAT[PUT]","level":4,"group":1,"type":"branch"},"fn[8]":{"key":"fn[8]","next":[],"prev":"fn[7]","level":5,"group":1,"type":"leaf"},"CAT[DELETE]":{"key":"CAT[DELETE]","next":["fn[9]"],"prev":"CAT","level":3,"group":1,"type":"branch"},"fn[9]":{"key":"fn[9]","next":["fn[10]"],"prev":"CAT[DELETE]","level":4,"group":1,"type":"branch"},"fn[10]":{"key":"fn[10]","next":[],"prev":"fn[9]","level":5,"group":1,"type":"leaf"}});
import FS from "fs"
const { mkdir, writeFile, access, readFile } = FS.promises
import URL from "url"
import http from "http"

quiv.fn["SERVER"] = async (value, key, prev, next) => {
const init = {
match: {
url: (args, url) => (args.url.split("?")[0] === url) && url || void 0,
method: (args, method) => ((args.method === method) && method) || void 0
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
server.listen(PORT, (err) => err ? setTimeout(()=> {
quiv.log("Restarting due to error!")
quiv.leave("SERVER")
quiv.setRoot("SERVER")
quiv.go("SERVER")()
}, 3000) : quiv.log("http://localhost:" + PORT))
server.on("request", start)

 await  access(init.DB_DIR + init.DB_FILE).catch(async () => {
await mkdir(init.DB_DIR, { recursive: true } )
await writeFile(init.DB_DIR + init.DB_FILE,
`{"0": { "breed": "Siamese", "age": 3, "name": "Purr Mclaw" }}`)
})
quiv.setRoot("REQUEST")

}
quiv.fn["REQUEST"] = (value, key, prev, next) => {
const { method, req: { body, query, url }, res, init: { match, end, toJSON, tryCatch, toString, DB_DIR, DB_FILE } } = value;

const queries = query?.split("&").map(q => {
const [key, value] = q.split("=")
return { [key]: value }
}).reduce((acc,item) => ({...acc,...item}),{}) || {}
const service = {
method, body, query: queries, res, url,
match, end, toJSON, toString, tryCatch, DB_PATH: DB_DIR + DB_FILE
}
return service

}
quiv.fn["ROUTER"] = (value, key, prev, next) => {
const { match } = value;
return { data: value, "match": match.url(value, "/age") ?? match.url(value, "/cat") }

}
quiv.fn["AGE"] = (value, key, prev, next) => {
const { data } = value;
if(![{"match":"/age"}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;

const { match } = data
return {
data,
"match":
match.method(data, "POST")
}
}
quiv.fn["AGE[POST]"] = (value, key, prev, next) => {
const { data } = value;
if(![{"match":"POST"}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return data
}
quiv.fn["fn[0]"] = (value, key, prev, next) => {
value.body = value.toJSON(value.body)
if (!value.body) return void (value.end(value.res).status(403).send({ message: "No data provided"}))
const date = new Date(value.body.date)
if (!(date.getTime() === date.getTime())) return void(value.end(value.res).status(403).send({ message: "Invalid date!"}))
return { ...value, date }
}
quiv.fn["fn[1]"] = (value, key, prev, next) => {
const today = new Date()
const birthDate = value.date
let age = today.getFullYear() - birthDate.getFullYear()
const month = today.getMonth() - birthDate.getMonth()
if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
age--
}
return value.end(value.res).status(200).send(age)

}
quiv.fn["CAT"] = (value, key, prev, next) => {
const { data } = value;
if(![{"match":"/cat"}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;

const { match } = data
return {
data,
"match":
match.method(data, "GET") ??
match.method(data, "POST") ??
match.method(data, "PUT") ??
match.method(data, "DELETE")
}

}
quiv.fn["CAT[GET]"] = (value, key, prev, next) => {
const { data } = value;
if(![{"match":"GET"}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return data
}
quiv.fn["fn[2]"] = (value, key, prev, next) => {
return { "id": "id" in value.query, data: value }
}
quiv.fn["fn[3]"] = async (value, key, prev, next) => {
const { data } = value;
if(![{"id":false}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return data.end(data.res).status(200).send(data.toJSON( await  readFile(data.DB_PATH, "utf8")))
}
quiv.fn["fn[4]"] = async (value, key, prev, next) => {
const { data } = value;
if(![{"id":true}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;

const raw =  await  readFile(data.DB_PATH, "utf8")
const json = data.toJSON(raw)
data.tryCatch(() => {
if (!json[data.query.id]) throw new Error("Cat not found")
else data.end(data.res).status(200).send(json[data.query.id])
}, (message) => data.end(data.res).status(404).send({message}))

}
quiv.fn["CAT[POST]"] = (value, key, prev, next) => {
const { data } = value;
if(![{"match":"POST"}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return data
}
quiv.fn["fn[5]"] = (value, key, prev, next) => {
const { body, end, res, toJSON } = value;

if (!body) return void (end(res).status(403).send({ message: "No data provided!"}))
const json = toJSON(body)
if (!json.name || !json.age || !json.breed) return void (end(res).status(403).send({ message: "Missing some or all fields."}))
return { ...value, body: json }
}
quiv.fn["fn[6]"] = async (value, key, prev, next) => {
const { DB_PATH, toJSON, toString,  body, res, end  } = value;

const data =  await  readFile(DB_PATH, "utf8")
const json = toJSON(data)
const id = Object.keys(json).length
json[id] = { ...body, id }
 await  writeFile(DB_PATH, toString(json))
end(res).status(200).send({ message: "Cat added!" })

}
quiv.fn["CAT[PUT]"] = (value, key, prev, next) => {
const { data } = value;
if(![{"match":"PUT"}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return data
}
quiv.fn["fn[7]"] = (value, key, prev, next) => {
const { body, end, res, toJSON } = value;

if (!body) return void (end(res).status(403).send({ message: "No data provided!"}))
const json = toJSON(body)
if (!json.age) return void (end(res).status(403).send({ message: "Missing some or all fields."}))
return { ...value, body: json}
}
quiv.fn["fn[8]"] = async (value, key, prev, next) => {
const { DB_PATH, toJSON, toString, query, body, res, end } = value;

const data =  await  readFile(DB_PATH, "utf8")
const { id } = query
const json = toJSON(data)
if (!json[id]) return void(end(res).status(404).send({ message: "Cat not found!"}))
json[id] = { ...json[id], age: body.age }
 await  writeFile(DB_PATH, toString(json))
end(value.res).status(200).send({ message: "Cat updated!" })

}
quiv.fn["CAT[DELETE]"] = (value, key, prev, next) => {
const { data } = value;
if(![{"match":"DELETE"}].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return data
}
quiv.fn["fn[9]"] = (value, key, prev, next) => {
return ("id" in value.query) && value || void(value.end(value.res).status(403).send({ message: "No id provided!"}))
}
quiv.fn["fn[10]"] = async (value, key, prev, next) => {
const { DB_PATH, toJSON, toString, query, body, res, end } = value;

const data =  await  readFile(DB_PATH, "utf8")
const json = toJSON(data)
const { id } = query
if (!json[id]) return end(res).status(403).send({ message: "Cat not found!"})
delete json[id]
 await  writeFile(DB_PATH, toString(json))
end(res).status(200).send({ message: "Cat deleted!" })
};
export default (value) => {
quiv.setRoot(quiv.nodes["SERVER"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}

    const _qvr = { 
    memo: {}, 
    func: {}, 
    dfs: async (node, prev, nodes, parent, memo = _qvr.memo) => {
      if (!node) return;
      let result;
      if (typeof _qvr.func[node.key] === 'function')
          result = await _qvr.func[node.key](
          prev,
          node.key,
          parent,
          nodes,
          memo,
          _qvr.dfs);
      if (result !== undefined && node.next) {
        node.next.forEach(n => {
          _qvr.dfs(nodes[n], result, nodes, node.key, memo, _qvr.func);
        });
      }
    },
    wrap: (callback = res => res) =>
    _qvr.func.forEach((fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args))))
   }

  const nodes = {"SERVER":{"key":"SERVER","next":["REQUEST"],"level":0,"type":"root","prev":null},"REQUEST":{"key":"REQUEST","next":["HELLO","ABOUT","AGE","CAT"],"level":1,"type":"branch","prev":"SERVER"},"HELLO":{"key":"HELLO","next":["HELLO[GET]"],"level":2,"type":"branch","prev":"REQUEST"},"HELLO[GET]":{"key":"HELLO[GET]","next":[],"level":3,"type":"leaf","prev":"HELLO"},"ABOUT":{"key":"ABOUT","next":[],"level":2,"type":"leaf","prev":"REQUEST"},"AGE":{"key":"AGE","next":["AGE[POST]"],"level":2,"type":"branch","prev":"REQUEST"},"AGE[POST]":{"key":"AGE[POST]","next":["AGE[POST](validate)"],"level":3,"type":"branch","prev":"AGE"},"AGE[POST](validate)":{"key":"AGE[POST](validate)","next":["AGE[POST](send)"],"level":4,"type":"branch","prev":"AGE[POST]"},"AGE[POST](send)":{"key":"AGE[POST](send)","next":[],"level":5,"type":"leaf","prev":"AGE[POST](validate)"},"CAT":{"key":"CAT","next":["CAT[GET]","CAT[POST]","CAT[PUT]","CAT[DELETE]"],"level":2,"type":"branch","prev":"REQUEST"},"CAT[GET]":{"key":"CAT[GET]","next":["CAT[GET][all](validate)","CAT[GET][id](validate)"],"level":3,"type":"branch","prev":"CAT"},"CAT[GET][all](validate)":{"key":"CAT[GET][all](validate)","next":["CAT[GET][all](send)"],"level":4,"type":"branch","prev":"CAT[GET]"},"CAT[GET][all](send)":{"key":"CAT[GET][all](send)","next":[],"level":5,"type":"leaf","prev":"CAT[GET][all](validate)"},"CAT[GET][id](validate)":{"key":"CAT[GET][id](validate)","next":["CAT[GET][id](send)"],"level":4,"type":"branch","prev":"CAT[GET]"},"CAT[GET][id](send)":{"key":"CAT[GET][id](send)","next":[],"level":5,"type":"leaf","prev":"CAT[GET][id](validate)"},"CAT[POST]":{"key":"CAT[POST]","next":["CAT[POST](validate)"],"level":3,"type":"branch","prev":"CAT"},"CAT[POST](validate)":{"key":"CAT[POST](validate)","next":["CAT[POST](send)"],"level":4,"type":"branch","prev":"CAT[POST]"},"CAT[POST](send)":{"key":"CAT[POST](send)","next":[],"level":5,"type":"leaf","prev":"CAT[POST](validate)"},"CAT[PUT]":{"key":"CAT[PUT]","next":["CAT[PUT](validate)"],"level":3,"type":"branch","prev":"CAT"},"CAT[PUT](validate)":{"key":"CAT[PUT](validate)","next":["CAT[PUT](send)"],"level":4,"type":"branch","prev":"CAT[PUT]"},"CAT[PUT](send)":{"key":"CAT[PUT](send)","next":[],"level":5,"type":"leaf","prev":"CAT[PUT](validate)"},"CAT[DELETE]":{"key":"CAT[DELETE]","next":["CAT[DELETE](validate)"],"level":3,"type":"branch","prev":"CAT"},"CAT[DELETE](validate)":{"key":"CAT[DELETE](validate)","next":["CAT[DELETE](send)"],"level":4,"type":"branch","prev":"CAT[DELETE]"},"CAT[DELETE](send)":{"key":"CAT[DELETE](send)","next":[],"level":5,"type":"leaf","prev":"CAT[DELETE](validate)"}};
  const root = Object.values(nodes).find(node => node.type === 'root');
  const run = (method, req,res) => {
    _qvr.dfs(root, { req, res, method, quiver: _qvr }, nodes);
  };
  _qvr.func["SERVER"] = async (prev, current, parent, nodes, memo, dfs) => {
if (memo.init) return prev
memo.init = Object.freeze({
imports: {
fs: await import("fs"),
URL: await import("url"),
http: await import("http")
},
match: {
url: (prev, url) => (prev.url.split("?")[0] === url) || void 0,
method: (prev, method) => (prev.method === method) || void 0
},
end: (res) => ({
status: (status) => res.writeHead(status,
{ "Content-Type": "application/json" }) &&
{ send: (data) => res.end(JSON.stringify(data)) }
}),
toJSON: (json,...args) => JSON.parse(json,...args),
toString: (json,...args) => JSON.stringify(json,...args)
})
const PORT = 8075
const start = (req, res) => {
const method = req.method
const urlParsed = memo.init.imports.URL.parse(req.url)
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
run(method, req, res)
})
}

const server = memo.init.imports.http.createServer()
server.listen(PORT, () => console.log("http://localhost:" + PORT))
server.on("request", start)

const { mkdir, writeFile, access } = memo.init.imports.fs.promises

await access("./example/cats/dist/db/cats.json").catch(async () => {
await mkdir("./example/cats/dist/db", { recursive: true } )
await writeFile("./example/cats/dist/db/cats.json",
`{"0": { "breed": "Siamese", "age": 3, "name": "Purr Mclaw" }}`)
})
return void 0 // short circuit server init

}
_qvr.func["REQUEST"] = async (prev, current, parent, nodes, memo, dfs) => {
const { method, req, res, quiver } = prev
const { match, end, imports, toJSON, toString } = memo.init
const { fs } = imports
const { body, query, url } = req
const queries = query?.split("&").map(q => {
const [key, value] = q.split("=")
return { [key]: value }
}).reduce((acc,item) => ({...acc,...item}),{}) || {}

return { method, body, query: queries, res, url, fs: fs.promises, match, end, toJSON, toString }

}
_qvr.func["HELLO"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.url(prev, "/hello") && prev || void 0
}
_qvr.func["HELLO[GET]"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.method(prev, "GET") && prev.end(prev.res).status(200).send({ message: "Hello, do you like cats?" })

}
_qvr.func["ABOUT"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.url(prev, "/about") &&
prev.match.method(prev, "GET") &&
prev.end(prev.res).status(200).send({ message: "This is a demo for service code generation using a graph" })

}
_qvr.func["AGE"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.url(prev, "/age") && prev || void 0
}
_qvr.func["AGE[POST]"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.method(prev, "POST") && prev || void 0
}
_qvr.func["AGE[POST](validate)"] = async (prev, current, parent, nodes, memo, dfs) => {
prev.body = prev.toJSON(prev.body);
if (!prev.body) return void (prev.end(prev.res).status(403).send({ message: "No data provided"}))
const date = new Date(prev.body.date);
if (!(date.getTime() === date.getTime())) return void(prev.end(prev.res).status(403).send({ message: "Invalid date!"}))
return { ...prev, date }
}
_qvr.func["AGE[POST](send)"] = async (prev, current, parent, nodes, memo, dfs) => {
const today = new Date();
const birthDate = prev.date;
let age = today.getFullYear() - birthDate.getFullYear();
const month = today.getMonth() - birthDate.getMonth();
if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
age--;
}
return prev.end(prev.res).status(200).send(age);

}
_qvr.func["CAT"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.url(prev, "/cat") && prev || void 0
}
_qvr.func["CAT[GET]"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.method(prev, "GET") && prev || void 0
}
_qvr.func["CAT[GET][all](validate)"] = async (prev, current, parent, nodes, memo, dfs) => {
return !("id" in prev.query) && prev || void 0
}
_qvr.func["CAT[GET][all](send)"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.end(prev.res).status(200).send(prev.toJSON(await prev.fs.readFile("./example/cats/dist/db/cats.json", "utf8")))
}
_qvr.func["CAT[GET][id](validate)"] = async (prev, current, parent, nodes, memo, dfs) => {
return ("id" in prev.query) && prev || void 0
}
_qvr.func["CAT[GET][id](send)"] = async (prev, current, parent, nodes, memo, dfs) => {
const data = await prev.fs.readFile("./example/cats/dist/db/cats.json", "utf8")
const json = prev.toJSON(data)
if (json[prev.query.id]) {
prev.end(prev.res).status(200).send(json[prev.query.id])
} else {
prev.end(prev.res).status(404).send({ message: "Cat not found!"})
}

}
_qvr.func["CAT[POST]"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.method(prev, "POST") && prev || void 0
}
_qvr.func["CAT[POST](validate)"] = async (prev, current, parent, nodes, memo, dfs) => {
if (!prev.body) return void (prev.end(prev.res).status(403).send({ message: "No data provided!"}))
prev.body = prev.toJSON(prev.body)
if (!prev.body.name || !prev.body.age || !prev.body.breed) return void (prev.end(prev.res).status(403).send({ message: "Missing some or all fields."}))
return prev
}
_qvr.func["CAT[POST](send)"] = async (prev, current, parent, nodes, memo, dfs) => {
const data = await prev.fs.readFile("./example/cats/dist/db/cats.json", "utf8")
const json = prev.toJSON(data)
const id = Object.keys(json).length
json[id] = { ...prev.body, id }
await prev.fs.writeFile("./example/cats/dist/db/cats.json", prev.toString(json))
prev.end(prev.res).status(200).send({ message: "Cat added!" })

}
_qvr.func["CAT[PUT]"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.method(prev, "PUT") && ("id" in prev.query) && prev || void 0
}
_qvr.func["CAT[PUT](validate)"] = async (prev, current, parent, nodes, memo, dfs) => {
if (!prev.body) return void (prev.end(prev.res).status(403).send({ message: "No data provided!"}))
prev.body = prev.toJSON(prev.body)
if (!prev.body.age) return void (prev.end(prev.res).status(403).send({ message: "Missing some or all fields."}))
return prev
}
_qvr.func["CAT[PUT](send)"] = async (prev, current, parent, nodes, memo, dfs) => {
const data = await prev.fs.readFile("./example/cats/dist/db/cats.json", "utf8")
const { id } = prev.query
const json = prev.toJSON(data)
if (!json[id]) return void(prev.end(prev.res).status(404).send({ message: "Cat not found!"}))
json[id] = { ...json[id], age: prev.body.age }
await prev.fs.writeFile("./example/cats/dist/db/cats.json", prev.toString(json))
prev.end(prev.res).status(200).send({ message: "Cat updated!" })

}
_qvr.func["CAT[DELETE]"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev.match.method(prev, "DELETE") && prev || void 0
}
_qvr.func["CAT[DELETE](validate)"] = async (prev, current, parent, nodes, memo, dfs) => {
return ("id" in prev.query) && prev || void(prev.end(prev.res).status(403).send({ message: "No id provided!"}))
}
_qvr.func["CAT[DELETE](send)"] = async (prev, current, parent, nodes, memo, dfs) => {
const data = await prev.fs.readFile("./example/cats/dist/db/cats.json", "utf8")
const json = prev.toJSON(data)
const { id } = prev.query
if (!json[id]) return prev.end(prev.res).status(403).send({ message: "Cat not found!"})
delete json[id]
await prev.fs.writeFile("./example/cats/dist/db/cats.json", prev.toString(json))
prev.end(prev.res).status(200).send({ message: "Cat deleted!" })
};
  _qvr.dfs(root, undefined, nodes);
  
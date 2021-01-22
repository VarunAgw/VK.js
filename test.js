require("./VK.js");

VK.DEBUG = true;

let url, parsedUrl, expected, actual;

url = "https://user213name:pass323word@host.name.com:8080/subpath/sub2path?argname=arg33value&argname2[]=arg32value#hash32string";
parsedUrl = VK.parseURL(url);
actual = JSON.stringify(parsedUrl, null, 2);

expected = `{
  "protocol": "https",
  "username": "user213name",
  "password": "pass323word",
  "hostname": "host.name.com",
  "port": "8080",
  "pathname": "/subpath/sub2path",
  "args": "argname=arg33value&argname2[]=arg32value",
  "hash": "hash32string",
  "host": [
    "host",
    "name",
    "com"
  ],
  "hostrev": [
    "com",
    "name",
    "host"
  ],
  "hostlen": 3,
  "path": [
    "subpath",
    "sub2path"
  ],
  "pathrev": [
    "sub2path",
    "subpath"
  ],
  "pathlen": 2,
  "pathnow": "sub2path",
  "filename": "sub2path",
  "extension": "",
  "argname": "argname=arg33value&argname2[]=arg32value",
  "arglen": 2,
  "arg": {
    "argname": "arg33value",
    "argname2[]": "arg32value"
  },
  "argE": {
    "argname": "arg33value",
    "argname2[]": "arg32value"
  },
  "href": "https://user213name:pass323word@host.name.com:8080/subpath/sub2path?argname=arg33value&argname2[]=arg32value#hash32string"
}`

console.assert(actual === expected, "Unexpected results");

url = "https://d";
VK.DEBUG = false;
parsedUrl = VK.parseURL(url);
VK.DEBUG = true;
console.assert("https://d/" === parsedUrl.href, parsedUrl.href);
actual = JSON.stringify(parsedUrl, null, 2);
expected = `{
  "protocol": "https",
  "username": "",
  "password": "",
  "hostname": "d",
  "pathname": "/",
  "args": "",
  "hash": "",
  "host": [
    "d"
  ],
  "hostrev": [
    "d"
  ],
  "hostlen": 1,
  "path": [
    ""
  ],
  "pathrev": [
    ""
  ],
  "pathlen": 1,
  "pathnow": "",
  "filename": "",
  "extension": "",
  "argname": "",
  "arglen": 1,
  "arg": {},
  "argE": {},
  "href": "https://d/"
}`;
console.assert(actual === expected, "Unexpected results");


url = "E:\\Embed\\Mix\\15";
VK.DEBUG = false;
parsedUrl = VK.parseURL(url);
VK.DEBUG = true;
console.assert("file:///E:/Embed/Mix/15" === parsedUrl.href, parsedUrl.href);

url = "file:///D:/www/_/watch/watch.htm?url=E%3A%5CEmbed%5CMix%5C15";
parsedUrl = VK.parseURL(url);
console.assert(url === parsedUrl.href, parsedUrl.href);
console.assert("/D:/www/_/watch/watch.htm" === parsedUrl.pathname, parsedUrl.pathname);
console.assert(5 === parsedUrl.path.length, parsedUrl.path);


console.log("Finished");

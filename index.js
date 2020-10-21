const express = require('express');
const app = express();
const fs = require('fs');
const { title } = require('process');

var root = __dirname.substring(0, __dirname.lastIndexOf('/'));

fs.readdir(root, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        if(file !== 'server') {
            root = root + "/" + file;
            app.use("/", express.static(root));
        }
    });
});

app.get('/', (req,res) => {
    let loc = req.query.loc;
    let tempRoot = root + (loc ? loc:"");
    let dirs = [];
    let ndirs = [];
    fs.readdir(tempRoot, function (err, files) {
        if (err) {
            res.send('<label style=\'font-family:monospace;\'>ayeet holup young man that\'s illegal</label>');
            return;
        } 
        files.forEach(function (file) {
            let path = tempRoot + "/" + file;
            if(fs.lstatSync(path).isDirectory()) {
                dirs.push(path.substring(path.lastIndexOf('/')+1));
            } else if(fs.lstatSync(path).isFile()){
                ndirs.push(path.substring(path.lastIndexOf('/')+1));
            }
        });
        let html = "<html>\
            <head>\
                <title>File Server</title>\
            </head>\
            <body>"
        html += tempRoot.replace(root, "root") + "<hr>";
        if(loc) {
            html += "<a href='?loc="+(loc.substring(0, loc.lastIndexOf('/')))+"'>../</a><br>"
        }
        dirs.forEach(dir=> {
            html += "<a href='?loc="+(tempRoot.replace(root,"") + "/" + dir)+"'>"+dir+"/</a><br>"
        });
        ndirs.forEach(file=> {
            html += "<a href='"+(tempRoot.replace(root,"") + "/" + file)+"'>"+file+"</a><br>"
        });
        html += "</body>\
        </html>\
        <style>\
            * {\
                font-family: monospace;\
                font-size: large;\
            }\
        </style>"
        res.send(html);
    });
})

app.listen(666);
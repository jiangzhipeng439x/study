const express = require('express')
const http = require('http');
const fs = require('fs');
const url = require('url');
const marked = require('marked');
const path = require('path');
const bodyParser = require('body-parser');
const child_process = require("child_process")

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(8088, () => {
    console.log('服务启动:locahost:8088');
    let url = "http://127.0.0.1",
        port = 8088,
        cmd = 'start';
    switch (process.platform) {
        case 'wind32':
            cmd = 'start';
            break;

        case 'linux':
            cmd = 'xdg-open';
            break;

        case 'darwin':
            cmd = 'open';
            break;
    }
    child_process.exec(cmd + ' ' + url + ':' + port);
})

app.get('/getFileList', (req, res) => {
    res.json({
        code: 0,
        data: getFileList(path.join(__dirname, 'md') + '/')
    })
})
app.post('/getFile', (req, res) => {
    let pathname = req.body.fileName;
    fs.readFile('./md/' + pathname, function (err, data) {
        if (err) {
            res.json({
                code: 1,
                data: err
            });
        } else {
            str = marked(data.toString());
            res.json({
                code: 0,
                data: str
            });
        }
    });
})

function getFileList(path) {
    var filesList = [];
    readFileList(path, filesList);
    return filesList;
}
function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {
            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }

    })
}

//创建服务器
/**
http.createServer(function (request, response) {
    //解析请求，包括文件名
    var pathname = iconv.decode(url.parse(request.url).pathname, 'gb2312');
    //输出请求的文件名
    // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    fs.readFile(pathname.substr(1), function(err, data){
        if(err){
            response.end(err);
        }else{
            str = marked(data.toString());
            str = str.replace(/<code(.*?)>/g, function(match, path) {
                return '<code style="display:block;width:500px;background-color:#000;color:#fff;padding:10px;line-height:2;word-break:break-all;"'+path+'>';
            })
            response.end(str);
        }
    });

}).listen(8081);
 */

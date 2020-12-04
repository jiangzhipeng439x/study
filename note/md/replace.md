### 一、replace match 匹配

示例：
```
let str = 'abscddcfccevvefefefefefefefe'
str = str.replace(/a(.*?)c/g, function (match, path) {
    return '这是替换的内容' + path + '这是后面的内容';
})
console.log(str);
PS：str不能有换行，不能匹配不到换行符之后的内容
！其中 (a.*?) 表示任意字符，如果需要换行，的加入换行符(待定)
```

### 二、replace 单个匹配

示例：
```
let str = 'abscddcfccevvefefefefefefefe'
str = str.replace('ab','替换的内容')
console.log(str);
```

### 三、replace 全局匹配

示例：
```
let str = 'abscddcfccevvefefefefefefefe'
str = str.replace(/ab/g,'替换的内容')
console.log(str);
PS：如果有需要转义的字符，需要使用\转义，比如 \"\"\/
```
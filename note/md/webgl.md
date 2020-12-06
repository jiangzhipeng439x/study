### 一、webgl初始化

webgl实际上完成的是程序的光栅化，“光栅化”其实就是“用像素画出来” 的花哨叫法

1、首先需要创建两个函数：
```
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
function createShader(gl, type, source) {
  var shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
```
```
//将着色器链接到一个着色程序在GPU上创建
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
```

2、这些是前置条件，接下来，需要创建一个canvas对象
```
let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
```

3、继续，我们需要初始化webgl的上下文环境，就好比我们用H5的canvas，需要初始化一个2D环境
```
let gl = canvas.getContext("webgl"); //webgl2自身包含初始化时的那两个函叔，但是存在浏览器兼容问题
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);  //这个是让webgl的渲染范围和canvas的大小保持一致
gl.clearColor(0, 0, 0, 0); //将颜色设置成透明
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  //清理canvas、清除深度缓冲为 1.0 
```

4、这个时候，我们需要设置两个着色器
顶点着色器
```
let vertex = `// 一个属性值，将会从缓冲中获取数据
attribute vec4 a_position;
 
// 所有着色器都有一个main方法
void main() {
 
  // gl_Position 是一个顶点着色器主要设置的变量
  gl_Position = a_position;
}`
```
片段着色器
```

let fragment = `// 片断着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;
 
void main() {
  // gl_FragColor是一个片断着色器主要设置的变量
  gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“红紫色”
}`
```

设置着色器有多种方式，其中包括使用script标签的方式
```
<script id="vertex-shader-2d" type="notjs">
 
  // 一个属性变量，将会从缓冲中获取数据
  attribute vec4 a_position;
 
  // 所有着色器都有一个main方法
  void main() {
 
    // gl_Position 是一个顶点着色器主要设置的变量
    gl_Position = a_position;
  }
 
</script>
 
<script id="fragment-shader-2d" type="notjs">
 
  // 片断着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;
 
  void main() {
    // gl_FragColor是一个片断着色器主要设置的变量
    gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“瑞迪施紫色”
  }
 
</script>
```

5、着色器设置好了之后，我们需要初始化着色器，这个时候就用到了最初我们定义的两个函数
```
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);

```

6、着色器初始化完成之后，我们就需要把初始化完成的着色器链接到着色程序之中，告诉CPU，这就是我要使用的着色程序
```
let program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program); //告诉webgl，我们需要使用这个着色程序
```

7、我们已经把需要使用的程序告诉CPU，但是现在着色程序还不能运行，我们还差数据和调用
我们之前在顶点着色器之中定义了一个变量，我们在运行程序的时候，得告诉CPU，改变的是这个变量，所有我们需要把变量拿出来
```
let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation); //告诉webgl，我们需要启用这个属性
```

8、因为这个变量定义的是缓冲类型，所以我们需要创建一个缓冲
```
let positionBuffer = gl.createBuffer();
```

9、光是创建缓冲还不够，还得把缓冲绑定给webgl，这个绑定的对象可以理解成webgl内的一个全局变量
```
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //其实有点类似于JS中的赋值操作
```

10、经过两步操作，缓冲就创建完毕，接下来就是定义缓冲里面的数据了
```
// 三个二维点坐标
var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); 
var size = 2;          // 每次迭代运行提取两个单位数据
var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型，这是因为webgl是强类型语言，而且必须是浮点型的数据
var normalize = false; // 不需要归一化数据
var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                       // 每次迭代运行运动多少内存到下一个数据开始点
var offset = 0;        // 从缓冲起始位置开始读取
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

//bufferData的作用就是将数据存到需要的缓冲之中
//vertexAttribPointer的作用就是告诉webgl，应该以哪种方式获取缓冲数据
```

11、终于到了最后一步，这一步就是调用webgl，去告诉CPU，你可以开始渲染了
```
var primitiveType = gl.TRIANGLES;   //告诉CPU以哪种形式渲染
var offset = 0;                     //从缓冲之中的第几条数据开始渲染
var count = 3;                      //渲染几次
gl.enable(gl.CULL_FACE);            //只画正面三角形
gl.enable(gl.DEPTH_TEST); 
gl.drawArrays(primitiveType, offset, count);
```

### 二、顶点着色器获取变量的几种方式
1、属性（Attributes）和缓冲

缓冲是发送到GPU的一些二进制数据序列，通常情况下缓冲数据包括位置，法向量，纹理坐标，顶点颜色值等。 你可以存储任何数据。

属性用来指明怎么从缓冲中获取所需数据并将它提供给顶点着色器。 例如你可能在缓冲中用三个32位的浮点型数据存储一个位置值。 对于一个确切的属性你需要告诉它从哪个缓冲中获取数据，获取什么类型的数据（三个32位的浮点数据）， 起始偏移值是多少，到下一个位置的字节数是多少。

缓冲不是随意读取的。事实上顶点着色器运行的次数是一个指定的确切数字， 每一次运行属性会从指定的缓冲中按照指定规则依次获取下一个值。

float, vec2, vec3, vec4, mat2, mat3 和 mat4 这是属性可以定义的类型，被定义为属性的变量都需要从缓存中取值
```
attribute vec4 a_position
void main() {
   gl_Position = a_position
}
```
```
let buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
// 三个二维点坐标
var positions = [
  0, 0,0,
  0, 0.5,1,
  0.7, 0,1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
// 开启从缓冲中获取数据
var positionLoc = gl.getAttribLocation(someShaderProgram, "a_position");
gl.enableVertexAttribArray(positionLoc);
 
var numComponents = 3;  // (x, y, z)
var type = gl.FLOAT;    // 32位浮点数据
var normalize = false;  // 不标准化
var offset = 0;         // 从缓冲起始位置开始获取
var stride = 0;         // 到下一个数据跳多少位内存
                        // 0 = 使用当前的单位个数和单位长度 （ 3 * Float32Array.BYTES_PER_ELEMENT ）
gl.vertexAttribPointer(positionLoc, numComponents, type, false, stride, offset);
```

bufferData这里完成了一系列事情，第一件事是我们有了一个JavaScript序列positions 。 然而WebGL需要强类型数据，所以new Float32Array(positions)创建了32位浮点型数据序列， 并从positions中复制数据到序列中，然后gl.bufferData复制这些数据到GPU的positionBuffer对象上。 它最终传递到positionBuffer上是因为在前一步中我们我们将它绑定到了ARRAY_BUFFER（也就是绑定点）上。

最后一个参数gl.STATIC_DRAW是提示WebGL我们将怎么使用这些数据。WebGL会根据提示做出一些优化。 gl.STATIC_DRAW提示WebGL我们不会经常改变这些数据。

在此之上的代码是 初始化代码。这些代码在页面加载时只会运行一次。 接下来的代码是渲染代码，而这些代码将在我们每次要渲染或者绘制时执行。

2、全局变量（Uniforms）

全局变量在着色程序运行前赋值，在运行过程中全局有效。

定义：
```
attribute vec4 a_position;
uniform vec4 u_offset;
 
void main() {
   gl_Position = a_position + u_offset;
}
```
改变：
```
var offsetLoc = gl.getUniformLocation(someProgram, "u_offset");
gl.uniform4fv(offsetLoc, [1, 0, 0, 0]);  // 向右偏移一半屏幕宽度
```
要注意的是全局变量属于单个着色程序，如果多个着色程序有同名全局变量，需要找到每个全局变量并设置自己的值。 我们调用gl.uniform???的时候只是设置了当前程序的全局变量，当前程序是传递给gl.useProgram 的最后一个程序。

全局变量有很多类型，对应的类型有对应的设置方法。
```
gl.uniform1f (floatUniformLoc, v);                 // float
gl.uniform1fv(floatUniformLoc, [v]);               // float 或 float array
gl.uniform2f (vec2UniformLoc,  v0, v1);            // vec2
gl.uniform2fv(vec2UniformLoc,  [v0, v1]);          // vec2 或 vec2 array
gl.uniform3f (vec3UniformLoc,  v0, v1, v2);        // vec3
gl.uniform3fv(vec3UniformLoc,  [v0, v1, v2]);      // vec3 或 vec3 array
gl.uniform4f (vec4UniformLoc,  v0, v1, v2, v4);    // vec4
gl.uniform4fv(vec4UniformLoc,  [v0, v1, v2, v4]);  // vec4 或 vec4 array
 
gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // mat2 或 mat2 array
gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // mat3 或 mat3 array
gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // mat4 或 mat4 array
 
gl.uniform1i (intUniformLoc,   v);                 // int
gl.uniform1iv(intUniformLoc, [v]);                 // int 或 int array
gl.uniform2i (ivec2UniformLoc, v0, v1);            // ivec2
gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // ivec2 或 ivec2 array
gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // ivec3
gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // ivec3 or ivec3 array
gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // ivec4
gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // ivec4 或 ivec4 array
 
gl.uniform1i (sampler2DUniformLoc,   v);           // sampler2D (textures)
gl.uniform1iv(sampler2DUniformLoc, [v]);           // sampler2D 或 sampler2D array
 
gl.uniform1i (samplerCubeUniformLoc,   v);         // samplerCube (textures)
gl.uniform1iv(samplerCubeUniformLoc, [v]);         // samplerCube 或 samplerCube array
```
还有一些类型 bool, bvec2, bvec3, and bvec4。它们可用gl.uniform?f?或gl.uniform?i?。

一个数组可以一次设置所有的全局变量，例如
```
// 着色器里
uniform vec2 u_someVec2[3];
 
// JavaScript 初始化时
var someVec2Loc = gl.getUniformLocation(someProgram, "u_someVec2");
 
// 渲染的时候
gl.uniform2fv(someVec2Loc, [1, 2, 3, 4, 5, 6]);  // 设置数组 u_someVec2
```
如果你想单独设置数组中的某个值，就要单独找到该值的地址。

```
// JavaScript 初始化时
var someVec2Element0Loc = gl.getUniformLocation(someProgram, "u_someVec2[0]");
var someVec2Element1Loc = gl.getUniformLocation(someProgram, "u_someVec2[1]");
var someVec2Element2Loc = gl.getUniformLocation(someProgram, "u_someVec2[2]");
 
// 渲染的时候
gl.uniform2fv(someVec2Element0Loc, [1, 2]);  // set element 0
gl.uniform2fv(someVec2Element1Loc, [3, 4]);  // set element 1
gl.uniform2fv(someVec2Element2Loc, [5, 6]);  // set element 2
```
同样的，如果你创建了一个结构体
```
struct SomeStruct {
  bool active;
  vec2 someVec2;
};
uniform SomeStruct u_someThing;
```
你需要找到每个元素的地址  
```
var someThingActiveLoc = gl.getUniformLocation(someProgram, "u_someThing.active");
var someThingSomeVec2Loc = gl.getUniformLocation(someProgram, "u_someThing.someVec2");
```

3、纹理（Textures）

纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。 大多数情况存放的是图像数据，但是纹理仅仅是数据序列， 你也可以随意存放除了颜色数据以外的其它数据。

4、可变量（Varyings）

可变量是一种顶点着色器给片断着色器传值的方式，依照渲染的图元是点， 线还是三角形，顶点着色器中设置的可变量会在片断着色器运行中获取不同的插值。

顶点着色器
```
attribute vec4 a_position;
 
uniform vec4 u_offset;
 
varying vec4 v_positionWithOffset; //定义
 
void main() {
  gl_Position = a_position + u_offset;
  v_positionWithOffset = a_position + u_offset;  //改变
}
```
片段着色器
```
precision mediump float;
 
varying vec4 v_positionWithOffset; //定义
 
void main() {
  // 从裁剪空间 (-1 <-> +1) 转换到颜色空间 (0 -> 1).
  vec4 color = v_positionWithOffset * 0.5 + 0.5  //使用
  gl_FragColor = color;
}
```



### 四、片断着色器

指定精确度的precision
这一次的片段着色器中的第一行，出现了一个陌生的precision，这个precision是用来指定数值的精确度的关键字，紧接着跟在precision后面的是精确度修饰符。
这个修饰符有三种，简单点说就是指定精确度为上，中，下。其实，变量中使用的小数发生变化时（也就是说，处理的数值的位数增加或是减少），根据运行的环境不同得到的结果是不太统一的。
lowp   ：精确度低
mediump：精确度中
highp  ：精确度高
上面的片段着色器代码中，precision后面紧接着写的是mediump float，这是说，让片段着色器中的float类型的数值的精确度都按照mediump来用。
不管在片段着色器中有没有做什么特殊的处理，首先要将precision相关的设定写上，否则在编译着色器的时候会出错。这就像魔法的咒语一样，逃不掉的

一个片断着色器的工作是为当前光栅化的像素提供颜色值，通常是以下的形式
```
precision mediump float;
 
void main() {
   gl_FragColor = doMathToMakeAColor;
}
```
1、Uniform 全局变量（片断着色器中）
   同顶点着色器

2、Textures 纹理
在着色器中获取纹理信息，可以先创建一个sampler2D类型全局变量，然后用GLSL方法texture2D 从纹理中提取信息。
```
precision mediump float;
 
uniform sampler2D u_texture;
 
void main() {
   vec2 texcoord = vec2(0.5, 0.5)  // 获取纹理中心的值
   gl_FragColor = texture2D(u_texture, texcoord);
}
```
从纹理中获取的数据取决于很多设置。 至少要创建并给纹理填充数据，例如
```
var tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
var level = 0;
var width = 2;
var height = 1;
var data = new Uint8Array([
   255, 0, 0, 255,   // 一个红色的像素
   0, 255, 0, 255,   // 一个绿色的像素
]);
gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
```
在初始化时找到全局变量的地址
```
var someSamplerLoc = gl.getUniformLocation(someProgram, "u_texture");
```
在渲染的时候WebGL要求纹理必须绑定到一个纹理单元上
```
var unit = 5;  // 挑选一个纹理单元
gl.activeTexture(gl.TEXTURE0 + unit);
gl.bindTexture(gl.TEXTURE_2D, tex);
```
然后告诉着色器你要使用的纹理在那个纹理单元
```
gl.uniform1i(someSamplerLoc, unit);
```
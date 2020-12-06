function _createShader(gl, type, source) {
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
function _createProgram(gl, vertexShader, fragmentShader) {
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
function _init(ele, width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ele.appendChild(canvas);
    let gl = canvas.getContext("webgl");
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.CULL_FACE);            //开启背面剔除
    gl.enable(gl.DEPTH_TEST);           //开启深度测试，背面的不渲染

    //当我们需要绘制透明图像时，就需要关闭它
    //gl.Disable(gl.DEPTH_TEST);
    //gl.Enable(gl.BLEND); 并且打开混合
    //gl.Color4f(1.0,1.0,1.0,0.5);
    //gl.BlendFunc(gl.SRC_ALPHA,gl.ONE);

    return gl;
}
class Graphic {

    //构造函数，直接进行初始化
    constructor(params) {
        this.params = params;
        this.gl = _init(params.ele, params.width, params.height);
        params.vs && params.fs && this.programInit(params.vs,params.fs);
        params.position && this.attributeInit(params.position);
        params.position && params.positions && params.size && this.setPositionBuffer(params.position,params.positions,params.size);
        params.indexData && this.setIndexBuffer(params.indexData);
    }

    //进行绘制，使用drawElements 会节约内存
    draw(type,count,offset){
        let gl = this.gl;
        if(this.isIndex){
            gl.drawElements(gl[type],count,this.indexType,offset);
        }else{
            gl.drawArrays(gl[type], offset, count);   
        }
    }

    //改变公用变量
    changeUniform(name,type,data,dataType){
        let gl = this.gl;
        let u_name = gl.getUniformLocation(this.program, name);
        if(dataType && dataType == 'array'){
            gl[type](u_name,data);
        }else{
            gl[type](u_name,...data);
        }
    }

    //着色项目初始化
    programInit(vs, fs) {
        let gl = this.gl;
        let vertexShader = _createShader(gl, gl.VERTEX_SHADER, vs);
        let fragmentShader = _createShader(gl, gl.FRAGMENT_SHADER, fs);
        let program = _createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);
        this.program = program;
        this.indexTypeInit();
        this.clearIndexBuffer();
    }

    //顶点属性和缓冲初始化
    attributeInit(position){
        let [gl,program] = [this.gl,this.program];
        let positionAttributeLocation = gl.getAttribLocation(program, position);
        gl.enableVertexAttribArray(positionAttributeLocation);
        this[position] = positionAttributeLocation;
    }

    //设置顶点缓冲buffer
    setPositionBuffer(position,positions,size){
        let gl =this.gl;
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this[position], size, gl.FLOAT, false, 0, 0);
    }

    //设置索引buffer
    setIndexBuffer(iData){
        let gl = this.gl;
        let indexData = new Uint16Array(iData);
        let indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STREAM_DRAW);
        this.isIndex = true;
    }

    //索引扩展初始化
    indexTypeInit(){
        let gl = this.gl;
        let indexType = gl.UNSIGNED_SHORT;
        const ext = gl.getExtension('OES_element_index_uint');  //大小是4294967296
        if (ext) {
            // 回退使用 gl.UNSIGNED_SHORT 或者告诉用户
            //indexType = gl.UNSIGNED_INT;  会报Insufficient buffer size
        }
        this.indexType = indexType;
    }

    //清楚画布
    clear() {
        let gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.clearIndexBuffer();
    }

    //清楚索引Buffer
    clearIndexBuffer(){
        this.isIndex && (this.isIndex = null);
    }

    //销毁画布
    destroy() {
        this.gl.canvas.remove();
    }

    //获取canvas对象
    getCanvas() {
        return this.gl.canvas;
    }

    
}

class D2 extends Graphic {
    constructor(params) {
        params.size = 2;
        super(params)
    }

    //获取矩形数据
    get2DRectData(point,width,height){
        let [x,y] = point;
        let _arr = [x,y,x+width,y,x+width,y+height,x,y+height];
        let _brr = [0,3,1,3,2,1];
        return [_arr,_brr]
    }
}

class D3 extends Graphic {
    constructor(params) {
        params.size = 3;
        super(params)
    }
}


let init = function (params) {
    return params.type == '2D' ? new D2(params) : new D3(params);
}

export default init
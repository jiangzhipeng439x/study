import ZD from './global/base.js'
let gl = new ZD({  
    ele: document.getElementById('app'),
    vs:document.getElementById("VERTEX_SHADER").innerText,
    fs:document.getElementById("FRAGMENT_SHADER").innerText,
    type: '2D',   // 2D or 3D
    width: '500',
    height: '500',
    position:'a_position',
    positions:new Float32Array([
        0,0,
        100,100,
        100,300,
        400,400,
        300,300,
        300,400
    ]),
    indexData:new Int16Array([
        2,1,0,
        3,4,5
    ])
})  //new ZD 和 直接使用ZD 是一个效果，这个涉及到new关键字的返回问题
let canvas = gl.getCanvas();
gl.changeUniform('u_resolution','uniform2f',[canvas.width,canvas.height])
gl.changeUniform('u_color','uniform4f',[1, 0, 0.5, 1])
gl.draw('TRIANGLES',6,0);


let [positions,indexData] = gl.get2DRectData([10,10],100,200);
gl.setPositionBuffer('a_position',positions,2);
gl.setIndexBuffer(indexData);
gl.draw('TRIANGLES',6,0);
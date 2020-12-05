class Graphic {
    constructor(params) {
        this.params = params;
        const defaultShaderType = ["VERTEX_SHADER", "FRAGMENT_SHADER"];
        const vs = `// an attribute will receive data from a buffer
                    attribute vec4 a_position;

                    // all shaders have a main function
                    void main() {

                    // gl_Position is a special variable a vertex shader
                    // is responsible for setting
                    gl_Position = a_position;
                    gl_PointSize = 10.0;
                    }`;
        const fs = `precision highp float;
                    void main() {
                    // gl_FragColor is a special variable a fragment shader
                    // is responsible for setting

                    gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
                    }`;

        function init(ele, width, height) {
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            ele.appendChild(canvas);
            let gl = canvas.getContext("webg2") || canvas.getContext("webgl") || canvas.getContext("webgl");
            return gl;
        }
        function error(err) {
            console.warn(err)
        }
        function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
            let errFn = opt_errorCallback || error;
            // Create the shader object
            let shader = gl.createShader(shaderType);

            // Load the shader source
            gl.shaderSource(shader, shaderSource);

            // Compile the shader
            gl.compileShader(shader);

            // Check the compile status
            let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                // Something went wrong during compilation; get the error
                let lastError = gl.getShaderInfoLog(shader);
                errFn("*** Error compiling shader '" + shader + "':" + lastError);
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }
        function loadProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
            let errFn = opt_errorCallback || error;
            let program = gl.createProgram();
            for (let ii = 0; ii < shaders.length; ++ii) {
                gl.attachShader(program, shaders[ii]);
            }
            if (opt_attribs) {
                for (let ii = 0; ii < opt_attribs.length; ++ii) {
                    gl.bindAttribLocation(
                        program,
                        opt_locations ? opt_locations[ii] : ii,
                        opt_attribs[ii]);
                }
            }
            gl.linkProgram(program);

            // Check the link status
            let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                // something went wrong with the link
                let lastError = gl.getProgramInfoLog(program);
                errFn("Error in program linking:" + lastError);

                gl.deleteProgram(program);
                return null;
            }
            return program;
        }
        this.createProgramFromSources = (gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) => {
            let shaders = [];
            for (let ii = 0; ii < shaderSources.length; ++ii) {
                shaders.push(loadShader(gl, shaderSources[ii], gl[defaultShaderType[ii]], opt_errorCallback));
            }
            return loadProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
        }
        this.gl = init(params.ele, params.width, params.height);
        this.draw(vs, fs, new Float32Array([
            0, 0, 0,
            0.5, 0, 0,
            0.5, 0, 0.5,
            0, 0, 0.5,
            0, 0, 0,

            0, 0.5, 0,
            0, 0.5, 0.5,
            0, 0, 0.5




        ]));
    }

    draw(vs, fs, matrix) {
        let gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        let program = this.createProgramFromSources(gl, [vs, fs])
        gl.useProgram(program);
        let positionLocation = gl.getAttribLocation(program, "a_position")
        let buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            matrix,
            gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        // draw
        gl.drawArrays(gl.LINE_STRIP, 0, 20);
    }

    destroy() {

    }

    getCanvas() {
        return this.canvas;
    }
}

class D2 extends Graphic {
    constructor(params) {
        super(params)
    }
}

class D3 extends Graphic {
    constructor(params) {
        super(params)
    }
}


let init = function (params) {
    return params.type == '2D' ? new D2(params) : new D3(params);
}

export default init;
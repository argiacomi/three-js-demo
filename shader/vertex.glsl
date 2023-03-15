precision highp float;

uniform float time;
varying vec3 v_position;
varying vec3 v_color;
float PI = 3.141592653589793238;

void main() {

  v_color = vec3 (uv, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
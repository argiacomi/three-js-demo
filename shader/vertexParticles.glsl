uniform float time;
varying vec2 v_color;
varying vec3 vPosition;
uniform sampler2D texture1;
float PI = 3.141592653589793238;

void main() {
  v_color = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
  gl_PointSize = 1000. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
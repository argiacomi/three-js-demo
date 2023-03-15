uniform float time;
varying vec3 v_color;
float PI = 3.141592653589793238;

void main()	{
	vec3 color = v_color;
  gl_FragColor = vec4(color, 1.0);
}
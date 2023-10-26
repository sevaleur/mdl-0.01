#define PI 3.1415926535897932384626433832795

uniform float u_time;

varying vec2 v_uv;
varying float v_ele;

void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  v_uv = uv;
}

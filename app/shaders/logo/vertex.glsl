#define PI 3.1415926535897932384626433832795

uniform float u_time;

varying vec2 v_uv; 

void main()
{
  vec3 new_pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(new_pos, 1.0);

  v_uv = uv;
}

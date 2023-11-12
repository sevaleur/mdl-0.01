#define PI 3.1415926535897932384626433832795

uniform vec2 u_viewportSize;

varying vec2 v_uv;

void main()
{
  vec4 new_pos = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * new_pos;

  v_uv = uv;
}

#define PI 3.1415926535897932384626433832795

uniform float u_scroll;
uniform vec2 u_viewportSize;

varying vec3 v_position;
varying vec2 v_uv;

void main()
{
  vec4 new_pos = modelViewMatrix * vec4(position, 1.0);

  new_pos.y -= sin(new_pos.x / u_viewportSize.x * PI + PI / 2.0) * (u_scroll);
  new_pos.z -= sin(new_pos.y / u_viewportSize.y * PI + PI / 2.0) * abs(u_scroll);

  gl_Position = projectionMatrix * new_pos;

  v_uv = uv;
  v_position = position;
}

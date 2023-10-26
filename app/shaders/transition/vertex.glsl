#define PI 3.1415926535897932384626433832795

attribute vec2 uv;
attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform vec2 u_viewportSize;

varying vec2 v_uv;

void main()
{
  vec4 new_pos = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * new_pos;

  v_uv = uv;
}

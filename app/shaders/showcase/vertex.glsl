#define PI 3.1415926535897932384626433832795

uniform float u_state;

uniform vec2 u_viewportSize;
uniform vec2 u_planeSize;
uniform vec2 u_hover;

varying vec2 v_uv;
varying vec3 v_position;
varying float v_dist; 

void main()
{
  vec3 new_pos = position; 
  float dist = distance(uv, u_hover + vec2(0.5)); 

  float k = 0.0;  
  if(dist < 0.2)
  {
    k = (1.0 - (dist / 0.2)) * (u_hover.x + u_hover.y);
  }

  new_pos.z += k * 0.05;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(new_pos, 1.0);

  v_uv = uv;
  v_dist = k; 
}

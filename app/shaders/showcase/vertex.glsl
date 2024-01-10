#define PI 3.1415926535897932384626433832795

uniform float u_state;

uniform vec2 u_deformation;
uniform vec2 u_viewportSize;
uniform vec2 u_planeSize;
uniform vec2 u_hover;

varying vec2 v_uv;
varying float v_dist; 

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset)
{
  position.x = position.x + (sin(uv.y * PI) * offset.x);
  position.y = position.y + (sin(uv.x * PI) * offset.y);
  return position;
}

void main()
{
  vec3 new_pos = position; 

  float dist = distance(uv, vec2(u_hover + vec2(0.5))); 

  float k = 0.0;  
  if(dist < 0.2)
  {
    k = (1.0 - (dist / 0.2)) * (u_hover.x + u_hover.y);
  }

  new_pos.z += k * 0.05;

  vec3 newPosition = deformationCurve(new_pos, uv, u_deformation);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  v_uv = uv;
  v_dist = k; 
}

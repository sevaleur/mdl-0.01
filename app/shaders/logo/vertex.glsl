#define PI 3.1415926535897932384626433832795

uniform vec2 u_hover; 

varying float v_dist; 
varying vec2 v_uv; 

void main()
{
  vec3 new_pos = position;

  float dist = distance(uv, u_hover + vec2(0.5)); 

  float k = 0.0;  
  if(dist < 0.5)
  {
    k = (1.0 - (dist / 0.5)) * (u_hover.x + u_hover.y);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(new_pos, 1.0);

  v_dist = k; 
  v_uv = uv;
}

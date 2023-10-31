varying float vNoise; 
varying vec2 v_uv; 
varying vec3 vPosition; 

void main()
{

  float dist = distance(uv, vec2(0.5));
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  

  vNoise = dist;
  vPosition = position;
  v_uv = uv; 
}
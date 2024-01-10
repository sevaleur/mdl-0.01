#define PI 3.1415926535897932384626433832795

uniform vec2 u_imageSize;
uniform vec2 u_planeSize;
uniform float u_alpha;
uniform float u_scroll;
uniform float u_intensity;
uniform float u_state;

uniform sampler2D tMap;

varying vec2 v_uv;

float rand(vec2 co)
{
  return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
  vec2 ratio = vec2(
    min((u_planeSize.x / u_planeSize.y) / (u_imageSize.x / u_imageSize.y), 1.0),
    min((u_planeSize.y / u_planeSize.x) / (u_imageSize.y / u_imageSize.x), 1.0)
  );

  vec2 uv = vec2(
    v_uv.x * ratio.x + (1. - ratio.x) * .5,
    v_uv.y * ratio.y + (1. - ratio.y) * .5
  );

  float resolution = 10.0;

  vec2 lowresxy = vec2(
    floor(gl_FragCoord.x / resolution),
    floor(gl_FragCoord.y / resolution)
  );

  vec4 t = texture2D(tMap, uv); 

  gl_FragColor = t; 
  
  if(u_state > rand(lowresxy))
  {
    gl_FragColor.a = 1.0;
  }
  else
  {
    gl_FragColor.a = 0.0; 
  }
}

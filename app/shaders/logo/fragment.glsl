#define PI 3.1415926535897932384626433832795

uniform vec2 u_imageSize;
uniform vec2 u_planeSize;
uniform vec2 u_hover; 

uniform float u_alpha;
uniform float u_state;
uniform float u_intensity;
uniform float u_scroll;
uniform float u_time;

uniform sampler2D tMap;

varying vec2 v_uv;
varying float v_dist; 

mat2 rotate(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

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
    v_uv.x * ratio.x + (1.0 - ratio.x) * .5,
    v_uv.y * ratio.y + (1.0 - ratio.y) * .5
  );

  float dist = distance(v_uv, vec2(0.5));
  float sqr = v_dist; 

  vec2 uv_divided = fract(uv * vec2(u_intensity / dist));

  vec2 uv_disp = uv + rotate(PI / dist) * uv_divided * (1. - (1.0 + sqr + u_scroll)) * 0.1;

  float resolution = 5.0;

  vec2 lowresxy = vec2(
    floor(gl_FragCoord.x / resolution),
    floor(gl_FragCoord.y / resolution)
  );

  vec4 t = texture2D(tMap, uv_disp); 

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
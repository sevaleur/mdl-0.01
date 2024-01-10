#define PI 3.1415926535897932384626433832795

uniform float u_alpha;
uniform float u_state;
uniform float u_intensity;
uniform float u_offset;

uniform vec2 u_hover; 
uniform vec2 u_imageSize;
uniform vec2 u_planeSize;
uniform vec2 u_viewportSize;

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
    v_uv.x * ratio.x + (1. - ratio.x) * .5,
    v_uv.y * ratio.y + (1. - ratio.y) * .5 + u_offset
  );

  float resolution = 10.0;

  vec2 lowresxy = vec2(
    floor(gl_FragCoord.x / resolution),
    floor(gl_FragCoord.y / resolution)
  );
  
  vec2 uv_divided = fract(uv * vec2(u_intensity));
  vec2 uv_disp = uv + PI / 4.0 * uv_divided * (1.0 - ( 1.0 + v_dist)) * 0.1;

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
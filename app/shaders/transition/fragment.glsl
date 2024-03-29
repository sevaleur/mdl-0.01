#define PI 3.1415926535897932384626433832795

uniform float u_alpha;
uniform vec2 u_planeSize;
uniform vec2 u_imageSize;
uniform float u_offset;
uniform float u_state;
uniform float u_intensity;

uniform sampler2D tMap;

varying vec2 v_uv;

mat2 rotate(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
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

  vec2 uv_divided = fract(uv * vec2(u_intensity));

  vec2 uv_disp = vec2(uv + rotate(PI / 4.) * uv_divided * (1. - u_state) * 0.1);

  vec4 t = texture2D(tMap, uv_disp);

  gl_FragColor = t;
  gl_FragColor.a = u_alpha;
}

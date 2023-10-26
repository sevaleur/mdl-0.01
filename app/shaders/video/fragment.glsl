uniform sampler2D tMap;

uniform vec2 u_imageSize;
uniform vec2 u_planeSize;
uniform vec2 u_viewportSize;

uniform float u_offset;
uniform float u_alpha;

varying vec2 v_uv;

void main()
{
  vec2 ratio = vec2(
    min((u_planeSize.x / u_planeSize.y) / (u_imageSize.x / u_imageSize.y), 1.0),
    min((u_planeSize.y / u_planeSize.x) / (u_imageSize.y / u_imageSize.x), 1.0)
  );

  vec2 uv = vec2(
    v_uv.x * ratio.x + (1.0 - ratio.x) * .5 + u_offset,
    v_uv.y * ratio.y + (1.0 - ratio.y) * .5
  );

  vec4 texture = texture2D(tMap, uv);

  gl_FragColor = texture;
  gl_FragColor.a = u_alpha;
}

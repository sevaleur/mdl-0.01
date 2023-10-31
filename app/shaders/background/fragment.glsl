#define PI 3.1415926535897932384626433832795

uniform vec2 u_imageSize;
uniform vec2 u_planeSize;
uniform vec2 u_hover; 

uniform float u_alpha;
uniform float u_state;
uniform float u_intensity;
uniform float u_scroll;
uniform float u_time;

uniform sampler2D tData;
uniform sampler2D tMap;

varying float vNoise; 
varying vec2 v_uv;
varying vec3 vPosition;

float map(float value, float min1, float max1, float min2, float max2) 
{
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
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

  vec2 direction = normalize(vPosition.xy - u_hover);
	float dist = distance(vPosition.xy, u_hover);

	float prox = 1. - map(dist, 0.0, 0.1, 0.0, 1.0);
	prox = clamp( prox, 0.0, 0.5 );

  vec4 uData = texture2D(tData, uv); 

	vec2 new_uv = mix(uv, u_hover + vec2(0.5), prox * uData.rg);

	vec4 color = texture2D( tMap, new_uv);

	gl_FragColor = color;
}
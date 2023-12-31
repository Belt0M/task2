varying vec3 vPosition;
varying vec3 vNormal;

void main(){
		//Fresnel effect

		vec3 viewDirection = normalize(cameraPosition - vPosition);
		float fresnel = 1.0 - dot(viewDirection, vNormal);
    gl_FragColor = vec4(vec3(fresnel), 1.0);
}
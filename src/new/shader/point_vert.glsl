// uniform float size;
//     uniform float scale;
//     attribute vec2 test2;
//     varying vec2 test3;
//     #include <common>
//     #include <color_pars_vertex>
//     #include <fog_pars_vertex>
//     #include <morphtarget_pars_vertex>
//     #include <logdepthbuf_pars_vertex>
//     #include <clipping_planes_pars_vertex>
//     void main() {
//         test3 = test2;
//         #include <color_vertex>
//         #include <begin_vertex>
//         #include <morphtarget_vertex>
//         #include <project_vertex>
//         gl_PointSize = size;
//         #ifdef USE_SIZEATTENUATION
//             bool isPerspective = isPerspectiveMatrix( projectionMatrix );
//             if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
//         #endif
//         #include <logdepthbuf_vertex>
//         #include <clipping_planes_vertex>
//         #include <worldpos_vertex>
//         #include <fog_vertex>
//     }

uniform float size;
uniform float scale;
attribute vec2 block;
varying vec2 block2;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
    block2 = block;
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}
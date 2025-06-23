var Sphere=Function.extend(Mesh2, function() {
	var _=this(Sphere);
	var m_factory=new MeshFactory(Sphere, 'models/quad-sphere.obj');

	_['private'].InternalOnMouseWheel=_['public'].OnMouseWheel;
	'@@override'
	_['public'].OnMouseWheel=function(e) {
		(_(this).InternalOnMouseWheel).apply(this, arguments);
		this.position.z-=.1*e.deltaY;
	};

	function Sphere(args) {
		_['base'].apply(this, arguments);
	}
});

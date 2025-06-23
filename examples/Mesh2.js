var Mesh2=Function.extend(THREE.Mesh, function() {
	var _=this(Mesh2);

	_['public'].dispose=function() {
		with(_(this)) {
			if(m_camera) {
				m_camera.renderTarget.texture.dispose();
			}

			if(material) {
				for(var key in ['envMap', 'map']) {
					if(material[key]) {
						material[key].dispose();
					}
				}

				// Dispose materials early may impact performance
				// material.dispose();
			}

			if(geometry) {
				geometry.dispose();
			}
		}

		with(_(this)) {
			if(this.children instanceof Array) {
				for(var i=this.children.length; i-->0;) {
					var child=this.children[i];

					// // Don't remove children if dispose early
					// this.remove(child);

					if(child.dispose instanceof Function) {
						child.dispose();
					}
				}
			}
		}
	};

	'@@virtual'
	_['public'].OnMouseWheel=function(e) {
		// console.log('OnMouseWheel', e);
	};

	'@@virtual'
	_['public'].OnMouseOut=function(e) {
		// console.log('OnMouseOut', e);
	};

	'@@virtual'
	_['public'].OnMouseEnter=function(e) {
		// console.log('OnMouseEnter', e);
	};

	'@@virtual'
	_['public'].OnMouseMove=function(e) {
		// console.log('OnMouseMove', e);
	};

	'@@virtual'
	_['public'].OnMouseUp=function(e) {
		// console.log('OnMouseUp', e);
	};

	'@@virtual'
	_['public'].OnMouseDown=function(e) {
		// console.log('OnMouseDown', e);
	};

	'@@virtual'
	_['public'].OnDoubleClick=function(e) {
		// console.log('OnDoubleClick', e);
	};

	'@@virtual'
	_['public'].OnClick=function(e) {
		// console.log('OnClick', e);
	};

	'@@virtual'
	_['public'].OnCreateAsync=async function() {
	};

	'@@virtual'
	_['public'].Refresh=function() {
		with(_(this)) {
			var scene=GetScene();

			if((null===m_camera)||(null===scene)) {
				return;
			}

			scene.ExecuteRenderer(UpdateCamera.bind(this));
		}
	};

	_['public'].ShowEdgedFaces=function() {
		if(_(this).m_wired) {
			return;
		}

		_(this).m_wired=true;
		var geometry=new THREE.WireframeGeometry(this.geometry);
		var material=new THREE.LineBasicMaterial({ 'color': 'red', 'linewidth': 2 });
		this.add(new THREE.LineSegments(geometry, material));
	};

	_['protected'].GetScene=function() {
		with(_(this)) {
			if(null===m_scene) {
				m_scene=Utility3d.FindScene(this);
			}

			return m_scene;
		}
	};

	_['protected'].UpdateCamera=function(renderer, scene) {
		with(_(this)) {
			this.visible=false;
			m_camera.update(renderer, scene);
			this.visible=true;
		}
	};

	function Mesh2(args) {
		var geometry=args['geometry'];
		var material=args['material'];
		_['base'].call(this, geometry, material);

		with(_(this)) {
			if(args['IsReflective']) {
				m_camera=new THREE.CubeCamera(.1, 1000, 64);
				this.material['envMap']=m_camera.renderTarget.texture;
				this.add(m_camera);
			}

			if(args['scale']) {
				var x=args['scale'];
				this.scale.set(x, x, x);
			}

			if(args['wired']) {
				this.ShowEdgedFaces();
			}
		}

		// dispose early
		this.dispose();
	}

	_['private'].m_wired=false;

	_['protected'].m_camera=null;
	_['protected'].m_scene=null;

	_['public'].Data=null;
	_['public'].IsInteractive=null;
});

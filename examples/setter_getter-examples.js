var Posture=Function.extend(Object, function() {
	var _=this(Posture);

	function Posture(position, rotation) {
		_['base'].apply(this, arguments);

		with(_(this)) {
			m_position=new THREE.Vector3();
			m_rotation=new THREE.Quaternion();

			m_position.copy(position);
			m_rotation.copy(rotation);
		}
	}

	Object.defineProperty(_['protected'], 'Rotation', {
		set: function(value) {
			// _(this).m_rotation=value;
		}
		, get: function() {
			return _(this).m_rotation;
		}
	});

	Object.defineProperty(_['protected'], 'Position', {
		set: function(value) {
			// _(this).m_position=value;
		}
		, get: function() {
			return _(this).m_position;
		}
	});

	_['protected'].m_rotation=null;
	_['protected'].m_position=null;
});

var DerivedPosture=Function.extend(Posture, function() {
	var _=this(DerivedPosture);

	_['public'].GetRotation=function() {
		return _(this).Rotation;
	};

	_['public'].GetPosition=function() {
		return _(this).Position;
	};

	function DerivedPosture(position, rotation) {
		_['base'].apply(this, arguments);
	}
});

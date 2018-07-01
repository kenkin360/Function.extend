Function.extend = function (base, factory) {
	factory.call(initializeClass);
	updateStaticMembersOfDerivedInnerClasses(y['public'].constructor);
	transfer(y['protected'], y['public']);
	return y['public'].constructor;

	function y($this) {
		return $this[''](y);
	}

	function transfer(target, source, descriptor) {
		if (target !== source ?
			'undefined' !== typeof target ?
			'undefined' !== typeof source :
			false : false) {
			var keys = 'undefined' !== typeof descriptor ? descriptor : source;

			for (var key in keys) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
	}

	function updateStaticMembersOfDerivedInnerClasses(outer) {
		var member, inner;

		for (var key in outer) {
			if (Object.prototype.hasOwnProperty.call(outer, key) ?
				(member = outer[key]) instanceof outer ?
				outer !== (inner = member.constructor) :
				false : false) {
				transfer(inner, outer);
			}
		}
	}

	function initializeInstance() {
		var $this = Object.create(y['private']);
		var derivedGet = this[''];
		var recent = $this;

		this[''] = function (x) {
			var value = y !== x ? derivedGet.call(this, x) : $this;

			if (value !== recent) {
				transfer(value, recent, x['protected']);
				recent = value;
			}

			return value;
		};

		base.apply(this, arguments);
		$this[''] = this[''];
	}

	function initializeClass(derived) {
		y['public'] = Object.create(base.prototype);
		y['public'].constructor = derived;

		if (Object.prototype.hasOwnProperty.call(base, 'transmit')) {
			base.transmit(y);
		}
		else {
			y['protected'] = Object.create(y['public']);
		}

		derived.transmit = function (x) {
			if (x['public'] instanceof derived) {
				x['protected'] = Object.create(y['protected']);
				x['protected'].constructor = x['public'].constructor;
			}
		};

		y['private'] = Object.create(y['protected']);
		y['base'] = initializeInstance;
		transfer(derived, base);
		derived.prototype = y['public'];
		return y;
	}
};

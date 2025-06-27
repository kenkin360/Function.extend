Function.extend=function(base, factory) {
	use(factory).call(initializeClass);
	updateStaticMembersOfDerivedInnerClasses(y['public'].constructor);
	transfer(y['protected'], y['public']);
	return y['public'].constructor;

	function y($this) {
		return $this[''](y);
	}

	function transfer(target, source, descriptor) {
		if(target!==source?
			'undefined'!==typeof target?
				'undefined'!==typeof source:
				false:false) {
			var keys='undefined'!==typeof descriptor? descriptor:source;

			for(var key in keys) {
				if(Object.prototype.hasOwnProperty.call(source, key)) {
					target[key]=source[key];
				}
			}
		}
	}

	function updateStaticMembersOfDerivedInnerClasses(outer) {
		var member, inner;

		for(var key in outer) {
			if(Object.prototype.hasOwnProperty.call(outer, key)?
				(member=outer[key]) instanceof outer?
					outer!==(inner=member.constructor):
					false:false) {
				transfer(inner, outer);
			}
		}
	}

	function initializeInstance() {
		var $this=es6() in use?createProxy(this):Object.create(y['private']);
		var derivedGet=this[''];
		var recent=$this;

		this['']=function(x) {
			var value=y!==x? derivedGet.call(this, x):$this;

			if(value!==recent) {
				transfer(value, recent, x['protected']);
				recent=value;
			}

			transfer(value, this);
			return value;
		};

		es6() in use?void(0):base.apply(this, arguments);
		$this['']=this[''];
	}

	function initializeClass(extended) {
		var derived=es6() in use?createClass(use(extended)):createConstructor(use(extended));
		y['public']=es6() in use?derived.prototype:Object.create(base.prototype);
		y['public'].constructor=derived;

		if(Object.prototype.hasOwnProperty.call(base, 'transmit')) {
			base.transmit(y);
		}
		else {
			y['protected']=Object.create(y['public']);
		}

		y['private']=Object.create(y['protected']);
		y['base']=es6() in use?(function() {}):initializeInstance;
		transfer(derived, base);

		derived.transmit=function(x) {
			if(x['public'] instanceof derived) {
				x['protected']=Object.create(y['protected']);
				x['protected'].constructor=x['public'].constructor;
			}
		};

		derived.prototype=y['public'];
		return y;
	}

	function createProxy(instance) {		
		return new Proxy(Object.create(y['private']), { get: function (target, key) {
			try {
				return target[key];
			}
			catch(err) {
				return instance[key];
			}
		}});		
	}

	function createClass(extended) {
		return class extends base {
			constructor(...args) {
				super(...args);
				initializeInstance.apply(this, args);
				extended.apply(this, args);
			}
		};
	}

	function createConstructor(extended) {
		return function() {
			base.apply(this, arguments);
			initializeInstance.apply(this, arguments);
			extended.apply(this, arguments);
		};
	}
	
	function use(what) {
		if(factory!==what) {
			return (y['.constructor']=what);
		}

		return function() {
			factory.call(this);
			transfer(y['public'].constructor, y['.constructor']);
		};
	}

	function es6() {
		if('es6' in use) {
			return 'es6';
		}
		
		if('function'===typeof base){
			var f=Object.getOwnPropertyDescriptor;

			if((Object===base)||(f(base, 'prototype')['writable'])){
				return 'es5';
			}

			return (use['es6']='es6');
		}
	}
};

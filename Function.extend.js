Function.extend=function(base, factory) {
	factory.call(initializeClass);
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
		var derived=es6() in use?createClass(extended):createConstructor(extended);
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
		return (new Function('extended', 'base', 'initializeInstance', '\
return class extends base {\
	constructor(...args) {\
		super(...args);\
		initializeInstance.apply(this, args);\
		extended.apply(this, args);\
	}\
}'))(extended, base, initializeInstance);
	}
	
	function createConstructor(extended) {
		return (new Function('extended', 'base', 'initializeInstance', '\
return function() {\
	base.apply(this, arguments);\
	initializeInstance.apply(this, arguments);\
	extended.apply(this, arguments);\
}'))(extended, base, initializeInstance);
	}
	
	function use() {
	}

	function es6() {
		var t='es6' in use;
		var u=Object===base;
		var v='function'===typeof base;
		var w=Object.getOwnPropertyDescriptor;		
		return (!t&&(u||v&&w(base,'prototype')['writable']))?'es5':(use['es6']='es6');
	}
};

Function.extend=function(base, $factory) {
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
		var $this=useES6()?createProxy(this):Object.create(y['private']);
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

		//base.apply(this, arguments);
		$this['']=this[''];
	}

	function initializeClass(extended) {
		var derived=y[extended]=createConstructor(extended);
		y['public']=useES6()?derived.prototype:Object.create(base.prototype);
		y['public'].constructor=derived;

		if(Object.prototype.hasOwnProperty.call(base, 'transmit')) {
			base.transmit(y);
		}
		else {
			y['protected']=Object.create(y['public']);
		}

		y['private']=Object.create(y['protected']);
		y['base']=$base;
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

	function createConstructor(extended) {
		y['.constructor']=extended;
		
		if(useES6()) {
			return createClass(extended);
		}

		if(!Function.extend['.useRegular']) {
			return createLegacyConstructor(extended);
		}		
		
		return function() {
			var $this=Object.create(y['private']);
			extended.apply($this, arguments);
			var args=$this['.arguments'];
			base.apply(this, arguments);
			initializeInstance.apply(this, arguments);
			
			if('function'===typeof $this['.after']) {
				$this['.after'].apply(this, arguments);
			}
		};
	}

	function createClass(extended) {
		return class extends base {
			constructor(...params) {
				var $this=Object.create(y['private']);
				extended.apply($this, ...params);
				var args=$this['.arguments'];
				super(...args);
				initializeInstance.apply(this, args);

				if('function'===typeof $this['.after']) {
					$this['.after'].apply(this, arguments);
				}
			}
		};
	}

	function createLegacyConstructor(extended) {
		return function() {
			base.apply(this, arguments);
			initializeInstance.apply(this, arguments);
			extended.apply(this, arguments);
		};
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
	
	function $base() {
		var $this=this;
		$this['.arguments']=arguments;

		return function(after) {
			$this['.after']=after;
		};
	}

	function factory() {
		$factory.call(initializeClass);
		transfer(y['public'].constructor, y['.constructor']);		
	}
	
	function useES6() {
		if(y['.useES6']) {
			return true;
		}

		if('function'===typeof base){
			var f=Object.getOwnPropertyDescriptor;

			if((Object===base)||(f(base, 'prototype')['writable'])){
				return false;
			}

			return (y['.useES6']=true);
		}
	}
};

Function.extend['.useRegular']=false;

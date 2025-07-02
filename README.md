# Function.extend.js
This is the code of my question on stackoverflow.com:

* https://stackoverflow.com/questions/21126505/how-to-implement-c-sharp-access-modifiers-in-javascript

I was looking for a better way to write JavaScript as if it were a class-based language. Since no existing solution meets both the desired simplicity and feature set, I believe this code currently offers a feasible alternative.

# Getting Started
The following is a comprehensive example including nested and derived class declaration:
```js
'use strict;'
Function.extend['.useRegular']=true;

var BaseClass=Function.extend(Object, function () {
	var _=this(BaseClass);
	BaseClass=_[BaseClass];

	var NestedClass=Function.extend(BaseClass, function () {
		var _=this(NestedClass);
		NestedClass=_[NestedClass];

		function NestedClass(x, y, z) {
			_['base'].call(this, x, y, z)(function() {
			_(this).Z=z;
			_(this).Y=y;
			_(this).X=x;
			});
		}

		_['public'].SetX=function (x) {
			_(this).InternalSetX(x);
		};

		_['public'].GetX=function () {
			return _(this).InternalGetX();
		};

		_['public'].GetY=function () {
			return _(this).Y;
		};

		_['public'].SetZ=function (z) {
			_(this).Z=z;
		};

		_['public'].GetZ=function () {
			return _(this).Z;
		};

		_['private'].Y=0;
	});

	function BaseClass(x) {
		_['base'].apply(this, arguments)(function() {
		_(this).X=x;
		});
	}

	_['protected'].InternalSetX=function (x) {
		_(this).X=x;
	};

	_['protected'].InternalGetX=function () {
		return _(this).X;
	};

	_['private'].X=0;
	_['protected'].Z=0;

	BaseClass.Sample=new NestedClass(1, 2, 3);
});

var DerivedClass=Function.extend(BaseClass, function () {
	var _=this(DerivedClass);
	DerivedClass=_[DerivedClass];

	function DerivedClass(x, y, z) {
		_['base'].apply(this, arguments);//(function() {});
	}
});

var o=DerivedClass.Sample;

console.log('o →', o);
console.log('o.GetX() →', o.GetX());
console.log('o.GetY() →', o.GetY());
console.log('o.GetZ() →', o.GetZ());
o.SetX(3);
o.SetZ(1);
console.log('o.GetX() →', o.GetX());
console.log('o.GetY() →', o.GetY());
console.log('o.GetZ() →', o.GetZ());
```
# Requirements

1. **Each class must have a constructor declaration that matches the name of the class.**  

   In Function.extend.js, the constructor must be explicitly declared using the `function` keyword.

2. **Each constructor must invoke its base constructor before before using `this`**  

   In Function.extend.js, this is typically done via `_['base'].apply(this, arguments)`, or using `.call(...)` for custom arguments.

3. **Class member methods must be declared using `function () {}` syntax rather than arrow functions.**  

   Arrow functions capture the surrounding lexical `this` and cannot access the `_` context correctly.  
   This will break access to `private` and `protected` scopes, and may lead to unexpected behavior.

4. **`_` must be declared and initialized as `this(ClassName)` at the beginning of the class body.**

5. **When inheriting from a `class`, `_[ClassName]` must be assigned back to `ClassName` and `_['base']` must be invoked with the rest of the constructor logic passed as a function.**

   For inheritance from a `function`, this rule is optional and takes effect only if `Function.extend['.useRegular']` is set to `true` (default is `false`).

The following is a minimal example that satisfies all of the above requirements:

```js
var MyClass=Function.extend(Object, function () {
	var _=this(MyClass);
	MyClass=_[MyClass];

	function MyClass(x) {
		_['base'].call(this, x)(function () {
			_(this).X=x;
		});
	}

	_['private'].X=0;
});

```

While `Function.extend['.useRegular']` is not set, the legacy style remains supported:

```js
var MyClass=Function.extend(Object, function () {
	var _=this(MyClass);

	function MyClass(x) {
		_['base'].call(this, x);
		_(this).X=x;
	}

	_['private'].X=0;
});
```

# Limitations

1. The only access modifiers are `_['public']`, `_['protected']`, and `_['private']`. Public static members should be defined directly on the class object. `protected static` and `private static` are not supported.

2. Interfaces are not supported. Should such a feature ever exist, I would likely place it under `implement`, rather than `Function.extend`.

3. Abstract classes are not natively supported, but may be emulated by throwing an error in the constructor.

# Overloading and Overriding

JavaScript does not support method overloading, as function signatures do not include parameter lists — only one method per name can exist in a given scope. 

Overriding, however, is a natural behavior of the language: later declarations with the same name will replace earlier ones. 

In Function.extend.js, this override behavior applies within the same access level (e.g., `public`, `protected`, or `private`). 
To simulate `base.method(...)` calls, a common pattern is to preserve the original method in another access level before overriding it. 
For example:

```js
_['private'].InternalOnMouseWheel = _['public'].OnMouseWheel;
'@@override'
_['public'].OnMouseWheel = function (e) {
	_(this).InternalOnMouseWheel.apply(this, arguments);
	this.position.z -= 0.1 * e.deltaY;
};
```

# Conventions

1. Members should be accessed using `_(this).memberName`, while `this.memberName` also works for public members. 

2. To declare a static class, inherit from `Function`. Instantiation is naturally blocked -- as it should be. 

3. Custom annotations like `@@override` may be used to indicate intent. They are not interpreted or executed in any way, but serve as a convention to clarify the purpose of certain declarations. Examples can be found [HERE](https://github.com/kenkin360/Function.extend/tree/master/examples). 

# Reliability

Function.extend.js embraces the philosophy of fail-fast. Like when you violate the rules or misuse features of a class-based language and the compiler reports an error -- runtime errors will be triggered in such cases under JavaScript, typically in the browser console -- unless the debugger is silenced, as it is an interpreted language.

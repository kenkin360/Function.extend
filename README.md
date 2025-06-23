# Function.extend.js
This is the code of my question on stackoverflow.com:

* https://stackoverflow.com/questions/21126505/how-to-implement-c-sharp-access-modifiers-in-javascript

I was looking for a better way to write JavaScript as if it were a class-based language. Since no existing solution meets both the desired simplicity and feature set, I believe this code currently offers a feasible alternative.

# Getting Started
The following is a comprehensive example including nested and derived class declaration:
```js
'use strict';

var BaseClass=Function.extend(Object, function () {
	var _=this(BaseClass);

	var NestedClass=Function.extend(BaseClass, function () {
		var _=this(NestedClass);

		function NestedClass(x, y, z) {
			_['base'].apply(this, arguments);
			_(this).Y=y;
			_(this).Z=z;
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
		_['base'].apply(this, arguments);
		_(this).X=x;
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

	function DerivedClass(x, y, z) {
		_['base'].apply(this, arguments);
	}
});

var o=DerivedClass.Sample;
alert(o.GetX());
alert(o.GetY());
alert(o.GetZ());
o.SetX(3);
o.SetZ(1);
alert(o.GetX());
alert(o.GetY());
alert(o.GetZ());
```
# Requirements

1. **Each class must have a constructor.**  
   *(Related — C# Language Specification, §10.11.4)*  
   In Function.extend.js, the constructor must be explicitly declared using the `function` keyword.

2. **The constructor declaration name shall match the name of the class.**  
   *(Related — C# Language Specification, §10.11.2)*

3. **Each constructor must invoke its base constructor.**  
   *(Related — C# Language Specification, §10.11.4)*  
   In Function.extend.js, this is typically done via `_['base'].apply(this, arguments)`, or using `.call(...)` for custom arguments.

4. **Class member methods must be declared using `function () {}` syntax rather than arrow functions.**  
   Arrow functions capture the surrounding lexical `this` and cannot access the `_` context correctly.  
   This will break access to `private` and `protected` scopes, and may lead to unexpected behavior.

5. **A variable named `_` must be declared and initialized as `this(ConstructorName)` at the beginning of the class body.**

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

3. Custom annotations like `@@override` may be used to indicate intent. They are not interpreted or executed in any way, but serve as a convention to clarify the purpose of certain declarations. Examples can be found in the `examples` folder.

# Reliability

Function.extend.js embraces the philosophy of fail-fast. Like when you violate the rules or misuse features of a class-based language and the compiler reports an error -- runtime errors will be triggered in such cases under JavaScript, typically in the browser console -- unless the debugger is silenced, as it is an interpreted language.

# Function.extend.js
This is the code of my question on stackoverflow.com:

* https://stackoverflow.com/questions/21126505/how-to-implement-c-sharp-access-modifiers-in-javascript

I was looking for a better way to write JavaScript as if it were a class-based language. Since no existing solution meets both the desired simplicity and feature set, I believe this code currently offers a feasible alternative.

# Getting Started
The following is a comprehensive example including nested and derived class declaration:

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

# Requirements

1. **Each class must have a constructor.**  
   *(Related — C# Language Specification, §10.11.4)*  
   In Function.extend.js, the constructor must be explicitly declared using the `function` keyword.

2. **The constructor declaration name shall match the name of the class.**  
   *(Related — C# Language Specification, §10.11.2)*

3. **Each constructor must invoke its base constructor.**  
   *(Related — C# Language Specification, §10.11.4)*  
   In Function.extend.js, this is typically done via `_['base'].apply(this, arguments)`, or using `.call(...)` for custom arguments.

4. **A class member declaration shall not have the same name as another member declared in the same access level.**  
   *(Related — C# Language Specification, §10.6.3)*  
   In Function.extend.js, an overridden member replaces the inherited one in the current class context and cannot be accessed once redefined.

5. **A variable named `_` must be declared and initialized as `this(ConstructorName)` at the beginning of the class body.**

These requirements are generally consistent with class-based object-oriented languages, except for rule 5, which is specific to the Function.extend model.

# Limitations

1. Method overloading is unsupported, including constructor overloading.

2. The only access modifiers are `_['public']`, `_['protected']`, and `_['private']`. Public static members should be defined directly on the class object. `protected static` and `private static` are not supported.

3. Abstract classes may be emulated by throwing an error in the constructor.

4. Interfaces are not supported. JavaScript offers no semantic or structural basis for them. Should such a feature ever exist, it would likely be named `Function.implement`.

These are mostly limitations of JavaScript itself.

# Conventions

1. Members should be accessed using `_(this).memberName`, while `this.memberName` also works for public members. 

2. To declare a static class, inherit from `Function`. Instantiation is naturally blocked -- as it should be.

# Reliability

Function.extend.js embraces the philosophy of fail-fast.  
Like when you violate the rules or misuse features of a class-based language and the compiler reports an error -- runtime errors will be triggered in such cases under JavaScript, typically in the browser console -- unless the debugger is silenced, as it is an interpreted language.

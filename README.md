# Function.extend.js
This is the code of my question on stackoverflow.com:

* https://stackoverflow.com/questions/21126505/how-to-implement-c-sharp-access-modifiers-in-javascript

I was looking for a better way to write JavaScript as if it were a class-based language. Since no existing solution meets both the desired simplicity and feature set, I believe this code currently offers a feasible alternative.

# Requirements
1. Every class must have a constructor.
2. A constructor must have the same name as its class name.
3. Every constructor must call its base constructor. (Prefer `_['base'].apply(this, arguments);`)
4. Member names must not duplicate, even if they are in different access levels.
5. `_` must be declared in each class declaration and initialized with `this(ConstructorName)`.

These are generally the same requirements as a real class-based language, except for rule 5.

# Limitations
1. There's no method overloading. This also means constructor overloading is not supported.
2. There's no support for `protected static` or `private static` members; for `public static` members, you can define them directly on the class using its name.
3. `_` can only be used to access private or protected members; for public members, you should access them directly on the instance, as is typical in JavaScript.

These are mostly the limitations of JavaScript itself, except for rule 3.

# Reliability
Normally, if you violate the rules or misuse features of a class-based language, the compiler will report an error. But since JavaScript is an interpreted language, the interpreter will throw a runtime error — typically in the browser, unless the debugger is silenced.

Things I tried, like accessing undeclared members or using `_` to access public members, will throw errors as expected.

If you want to declare a static class, extend your class from Function. Attempting to instantiate it in consuming code will also throw an error.

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

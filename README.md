# Function.extend.js
---
This is the code of my question on stackoverflow.com: 

* https://stackoverflow.com/questions/21126505/how-to-implement-c-sharp-access-modifiers-in-javascript

I was looking for a better solution to enable the feasibility of writing javascript like it was a class-based language but there's not yet a solution that satisfies the simplicity and the features requested thus I suppose the code itself is a currently feasible solution. 

# Requirements
---
1. Every class must have a constructor. 
2. A constructor must have the same name as its class name. 
3. Every constructor must call its base constructor. 
4. Member names must not duplicate, even if they were in different access
5. _ must be declared in each class declaration and initialized with this(ConstructorName)

It's pretty much the requirements of a real class-based language requires except law 5. 

# Limitations
--- 
1. There's no method overloading. So there's no constructor overloading, too. 
2. There's no support for `protected static` or `private static` members; for `public static` members, just qualify member names with the class name. 
3. _ can only be used to access private or protected members; for public members, just qualify with the instance like its nature in javascript. 

It's pretty much the limitations of javascript per se except law 3. 

# Reliability
--- 
Normally if you broke the requirements or do something wrong of a class-base language, the complier complaints, but for javascript is a imperative language, the interpreter throws, that is, in general, your browser -- if you didn't silence the debugger. 

Things I tried like accessing a undeclared member, accessing public members with _, etc., it will throw as excepted. 

# Special Notes
If you want to declare a static class, extend your class with Function, then it will throw when the consuming code trying to instantiate it. 


# Getting Started
---
The follow is a comprehensive example including nested and derived class declaration: 

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

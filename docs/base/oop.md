---
sidebarDepth: 2
---

### 面向对象的javascript

## 鸭子类型

javascript是弱类型语言，也就是说，在代码编译前不需要定义变量类型，编译器会根据环境自动转换类型，这其中有个典型的类型就是鸭子类型，简单的来说就是，
不关注对象本身，只关注对象行为，比如下面这个案例。

```javascript
var duck = {
	duckSinging: function(){
		console.log('ga ga ga!');
	}
};

var chicken = {
	duckSinging: function(){
		console.log('ga ga ga!');
	}
};

var choir = []; //合唱团

var joinChoir = function(animal){
	if(animal && typeof animal.duckSinging === 'function'){
		choir.push(animal);
		console.log('恭喜加入合唱团！');
	}
};

joinChoir(duck); //恭喜加入合唱团！
joinChoir(chicken); //恭喜加入合唱团！
```

这种类型我们称之为“面向接口的编程”，利用这种思想在js中可以轻松的实现一个原则：“面向接口编程，而不是面向实现编程”。我们由此也可以推出，
一个对象若有push 和pop 方法，并且这些方法提供了正确的实现，它就可以被当作栈来使用。一个对象如果有length 属性，也可以依照下标来存取属性（最好还要拥
有slice 和splice 等方法），这个对象就可以被当作数组来使用。

## 多态

多态的含义是：同一操作作用于不同的对象上，会产生不同的解释和执行结果。简单的理解为，给不同的对象发送相同的指令时，这些对象会做出不同的反馈。比如说，当你对一条狗
发出“叫”的命令时，狗会发出“汪汪”的反馈，当你对一只猫发出“叫”的命令时，猫会发出“喵喵”的反馈，我们来看下面案例。

```javascript
var makeSound = function(animal){
	if(animal instanceof Dog){
		console.log('汪汪汪');
	}else if(animal instanceof Cat){
		console.log('喵喵喵');
	}
};
var Dog = function(){};
var Cat = functon(){};

makeSound(new Dog()); // 汪汪汪
makeSound(new Cat()); // 喵喵喵
```

这个案例体现了多态性，但这并不是我们想要的“多态”，多态更精准的思想把“做什么”和“谁去做”分离开来，比如上面的案例，发出“叫”的指令是不变的，对“叫”指令作出反馈的对象
是可变的。而上面案例，假如我们需要添加一个动物，makeSound函数也要做更改，案例代码可以如下优化。

```javascript
var makeSound = function(animal){
	animal.sound();
};

var Dog = functino(){};
Dog.prototype.sound = function(){
	console.log('汪汪汪');
};

var Cat = function(){};
Cat.prototype.sound = function(){
	console.log('喵喵喵');
};

makeSound(new Dog()); // 汪汪汪
makeSound(new Cat()); // 喵喵喵
```

此时，如果我们需要添加另一个动物，我们只需要添加一些代码，而核心“做什么”函数`makeSound`是不变的。

```javascript
var Pig = function(){};

Pig.prototype.sound = function(){
	console.log('吼吼吼');
};

makeSound(new Pig()); // 吼吼吼
```

而在javascript中，对象的多态是与生俱来的，例如上面的案例中，函数的参数变量既可以是`Dog`类型，也可以是`Cat`类型，由此可见，在javascript多态中，某种指令是否得到反馈，
不在于是否是某种对象，而在于它有没有某个方法，这也是上节提到的鸭子类型的思想。这种思想很好的体现在下面的案例中。

假设我们要编写一个地图应用，目前有两家地图API供应商提供我们接入，地图中提供show方法复负责启动地图。

```javascript
var googleMap = {
	show: function(){
		console.log('开始启动谷歌地图！');
	}
};
var baiduMap = {
	show: function(){
		console.log('开始启动百度地图！');
	}
};

var renderMap = function(type){
	if(type === 'google'){
		googleMap.show();
	}else if(type === 'baidu'){
		baiduMap.show();
	}
};

renderMap('google'); //输出：开始启动谷歌地图！
renderMap('baidu'); //输出：开始启动百度地图！
```

可以看到，虽然这种效果看似多态，但是不符合多态的原则，如果需要添加另外一种类型的地图，必须改变rebderMap函数，我们可以把程序中的相同
部分抽象出来，代码改进如下。

```javascript
var renderMap = function(map){
	if(map.show instanceof Function){
		map.show();
	}
};

renderMap(googleMap); //输出：开始启动谷歌地图！
renderMap(baiduMap); //输出：开始启动百度地图！
```

我们来看这段代码的多样性，当我们分别向谷歌地图对象和报读地图对象发出展示地图命令时，会分别调用他们的show方法，就会产生不同的执行效果。对象的多态告诉我们，
“做什么”和“怎么做”是分开的，即使增加腾讯地图，`renderMap`函数仍然不需要做出改变。

```javascript
var tencentMap = {
	show: function(){
		console.log('启动腾讯地图！');
	}
};

renderMap(tencentMap); //输出：开始启动腾讯地图！
```

## 封装

封装的目的是将信息隐藏。一般来说，我们讨论的封装是封装数据和封装实现，这里我们不仅讨论这两个，还包括封装类型和封装变化。

**封装数据**

在面向对象的语言中，封装数据是由语法解析来实现的，这些语言提供private、public等关键字来提供不同的访问权限。

但是javascript并没有提供这类关键字的支持，我们只能依赖变量的作用域来实现封装特性，而且只能模拟出public和private这两种特性。

```javascript
var myObject = (function(){
	var __name = 'sven'; //私有变量
	return {
		getName: function(){ // 公共方法
			return __name;
		}
	}
})();

console.log(myObject.getName()); //输出：sven
console.log(myObject.__name); //输出：undefined
```

**封装实现**

封装的实现指的是封装使得对象内部的变化对其他对象而言是透明的，也就是不可见的，对象对它自己的行为负责，其他对象或者用户都不关心它的内部实现，封装使得对象之间的耦合变松散，对象之间只通过暴露的API 接口来通信。当我们修改一个对象时，可以随意地修改它的
内部实现，只要对外的接口没有变化，就不会影响到程序的其他功能。

## 继承

在面向对象的语言中，继承是通过类来实现的，而javascript是基于原型的面向对象的语言，所以javascript中的继承，也是基于原型的继承。

在javascript中，一切皆对象，对象又是通过某个对象作为原型克隆出来的，这样不断地克隆，这样就形成了一条原型链，任何对象最终都指向Object.prototype，而继续往上查找返回的是null，让我们在浏览器的console窗口运行下面代码：

```javascript
var s = new String('lisa'); 
console.log(s);  // String {"lisa"}
var o = s.__proto__;
console.log(o);  // String {"", constructor: ƒ, anchor: ƒ, big: ƒ, blink: ƒ, …}
var m = o.__proto__; 
console.log(m);  // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
console.log(m.__proto__); // null
```

我们先看这个__proto__属性，这是在chrome和firefox等现代浏览器环境下向外暴露的一个属性，它显示的指向原型链的上游，同时，它也等同于对象构造函数的原型。在浏览器的console窗口继续运行下面代码：

```javascript
console.log(o === s.constructor.prototype); // true
```

实际上，虽然javascript的对象最初都是由Object.prototype对象克隆而来的，但对象构造器的原型并不仅限于Object.prototype上，而是可以动态的指向其他对象，例如下面的代码：

```javascript
var obj = { name: 'Tony' };
var A = function(){};
A.prototype = obj; // 原型指向obj，也就继承了obj的属性和方法
var a = new a();
console.log(a.name); // 输出：Tony
```

我们看看这段代码执行的时候，js引擎做了哪些事情。

1. 首先，尝试遍历对象a中的所有属性，但没有找到name这个属性。
2. 查找name属性的这个请求被委托给对象a的构造器的原型，它被a.__proto__记录着并且指向A.prototype，而A.prototype被设置为对象obj。
3. 在对象obj中找到了name属性，并返回它的值。

当我们期望得到一个“类”，继承自另一个“类”的效果时，往往会用下面的代码来模拟实现：

```javascript
var A = function(){};
A.prototype = { name: 'Tony' };

var B = function(){};
B.prototype = new A();

var b = new B();
console.log(b.name); // 输出：Tony
```

再看看这段代码执行时，js引擎做了什么事。

1. 首先，尝试遍历对象b中的所有属性，但是没有找到name属性。
2. 查找name属性被委托给对象b构造器的原型，它被b.__proto__记录着并且指向B.prototype，而B.prototype被设置为一个通过new A()创建出来的对象。
3. 在该对象中依然没有找到name属性，于是请求被继续委托给这个对象构造器的原型A.prototype。
4. 在A.prototype中找到name属性，并返回它。

实际上，如果在A.prototype上面没有找到某个属性，请求就会继续委托给Object.prototype，如果Obejct.prototype中也没有某个属性，而Object.prototype的原型为null，此时返回undefined。

在ECMAScript6中提供了更加直观的Class语法，这让javascript看起来像一门基于类的语言，但其背后仍是通过原型机制来创建对象，下面代码通过Class语法创建对象：

```javascript
class Animal{
	constructor(name){
		this.name = name;
	}
	getName(){
		return this.name;
	}
}

class Dog extends Animal{
	constructor(name){
		super(name);
	}
	speak(){
		return "woof";
	}
}

var dog = new Dog("wangcai");
console.log(dog.getName + 'syas' + dog.speak());
```

## this、call和apply

在javascript中，this的指向有多种，具体情况由它执行的环境决定的。

1. 作为对象的方法调用时，this指向被调用的对象。
2. 作为普通函数调用，this指向window全局对象。
3. 构造器调用，通过new操作符实例化调用，this指向new实例化的对象。
4. 通过call或apply方法调用，详见下面的案例。

```javascript
var func = function(a, b, c){
	console.log([a, b, c]); // 输出[1, 2, 3]
};
func.apply(null, [1, 2, 3]);

var funct = function(a, b, c){
	console.log([a, b, c]); // 输出： [1, 2, 3]
};
funct.call(null, 1, 2, 3);
```

实际上，call和apply方法作用都是改变一个对象的this指向，只是它们接收的参数形式不同，在javascript参数的内部就是通过一个数组来表示的，从这个意义上讲，apply比call使用率更高，而call
只是包装在apply上面的一颗语法糖。

在使用call和apply的时候，如果我们传入第一个参数为null，函数体内的this会指向默认的宿主对象，在js严格模式下又不同。

```javascript
var func = function(a, b, c){
	console.log(this); // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
};
func.apply(null, [1, 2, 3]);

var funct = function(a, b, c){
	'use strict';
	console.log(this); // null
};
func.apply(null, [1, 2, 3]);
```

**call和apply用途**

1. 改变this的指向

假设我们给DOM事件回调函数内部调用一个函数体，此时函数内部的this指向就不是我们预期的。

```javascript
document.getElementById('button').onclick = function(){
	console.log(this.id); // 输出：button
	var func = function(){
		console.log(this.id) // 输出：undefined 因为此时this指向Window对象
	};
	func();
};
```

这时候我们可以使用call方法来修正this的指向，使其依然指向某DOM元素。

```javascript
document.getElementById('button').onclick = function(){
	console.log(this.id); // 输出：button
	var func = function(){
		console.log(this.id) // 输出：button
	};
	func.call(this);
};
```

2. 实现Function.prototype.bind

bind()方法创建一个新的函数，在调用时设置this关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。

```javascript
Function.prototype.bind = function(context){
	var self = this;
	return function(){
		return self.apply(context, arguments);
	}
};

var obj = { name: 'sven' };

var func = function(){
	console.log(this.name); //输出：sven
}.bind(obj);

func();
```

3. 借用其他对象的方法

借用方法的第一种场景就是“借用构造函数”，即通过这种方法，实现类似继承的效果：

```javascript
var A = function(name){
	this.name = name;
}
var B = function(){
	A.apply(this, arguments);
}

B.prototype.getName = function(){
	return this.name;
};

var b = new B('sven');
console.log(b.getName()); // 输出：'sven'
```

借用方法的第二种场景是用于处理函数的参数对象arguments，函数的参数对象arguments是一个类数组对象，虽然它也有下标，但并非真正的数组，无法使用数组的某些方法。这种情况下，我们常常会借用Array.prototype对象上的方法。比如，想往arguments中添加一个元素：

```javascript
(function(){
	Array.prototype.push.call(arguments, 3);
	console.log(arguments); // 输出：[1, 2, 3]
})(1, 2)
```

在操作arguments的时候，我们经常非常频繁地找Array.prototype对象借用方法，想把arguments转成真正的数组的时候，可以借用Array.prototype.slice方法；想
截去列表中的头一个元素时，又可以借用Array.prototype.shift方法。


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

在javascript中，一切皆对象，对象又是通过某个对象作为原型克隆出来的，这样不断地克隆，这样就形成了一条原型链，任何对象最终都指向Object，而继续往上查找返回的是null，让我们在浏览器的console窗口运行下面代码：

```javascript

```

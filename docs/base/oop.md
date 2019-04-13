---
sidebarDepth: 2
---

### 面向对象的javascript

## 只关注行为的鸭子类型

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
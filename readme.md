
## 项目背景

在很久之前，就想通过`scip`这本书，深入了解解释器、执行器的原理，来加深对计算机语言底层的理解， 但总是在看到书本的前几章，而没有坚持下来， 半途而废。
在工作中，接触的语言越来越多PHP、Java、Python、Golang等， 对于语言背后， AST解析的原理愈发好奇。

且最近对于<从零实现xxx>各种造轮子系列，也是十分感兴趣， 然后在B站上恰好看到<从零实现解释器>, 其是搬运的Udemy公开课， 粗略看下来，整个系列视频耗时3小时左右

于是决定根据该视频，将该项目，敲下来， 加深对计算机的理解。

## 环境准备

### node开发环境


### 额外安装词法分析工具， 该工具能将LALR1语法翻译成Javascript语言

```
sudo npm install -g syntax-cli
```

使用方式1：

```
syntax-cli --grammar parser/eva-grammar.bnf --mode LALR1 --parse '(- 2 foo)' --tokenize
syntax-cli --grammar parser/eva-grammar.bnf --mode LALR1 --parse '(begin (var x 10) (var y 10) (+ x y))' --tokenize
```

使用方式2， 输出到特定js文件：

```
syntax-cli --grammar parser/eva-grammar.bnf --mode LALR1 --output parser/evaParser.js
```

### 可执行程序使用

### 可执行bin 打印

```
 ./bin/eva.js -e '(var x 10) (print x)'
```
 
 #### 简单打印
 ```
 ./bin/eva.js -e '(var x 10) (print (* x 15))'
[ 150 ]

```

#### lamnda打印

```
 ./bin/eva.js -e '(print ((lambda (x) (* x x)) 2))'

[ 4 ]
```
#### 执行指定文件

```
./bin/eva.js -f "./test.eva"

[ 10 ]
```
 
## TODO

倒数第二章节， 需要自己实现`export`功能， 该功能暂时未实现。

## 整体学习总结

跟随老师将全部代码敲完，对语言有了跟深入的理解， 比如 对于解释器， 编译器的概念

1. 编译器： 将一种语言编译成另一种语言， 比如Golang语言编译成二进制程序
2. 解释器: 边读取程序内容， 边执行

那么CPU是那种呢？

我理解要归属于， 解释器， 因为CPU是在执行程序。 自然是解释器

## 参考链接

1. 课程Udemy地址: https://www.udemy.com/course/essentials-of-interpretation/
2. 课程github地址: https://github.com/DmitrySoshnikov/eva-source
3. 文档地址: http://dmitrysoshnikov.com/courses/essentials-of-interpretation/
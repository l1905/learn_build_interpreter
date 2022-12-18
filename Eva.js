const assert = require("assert")
const Environment = require("./Environment");
const Transformer = require("./transform/TransFormer");
const evalParser = require("./parser/evaParser");
const fs = require('fs');

class Eva {
    /**
     * creates  an Eva instance with the global environment
     */
    constructor(global = GlobalEnvironment) {
        this.global = global;
        this._transformer = new Transformer();
    }

    /**
     * Evaluates global code wrapping into a block
     */
    evalGlobal(expressions) {
        // return this._evalBlock(
        //     ["block", expressions],
        //     this.global,
        // );
        return this._evalBody(expressions, this.global);
    }

    /**
     * Evaluation  an expression in the given environment
     * @param exp
     * @param env
     * @returns {void|number|*}
     */
    eval(exp, env = this.global) {

        // self-evaluation expr
        if( this._isNumber(exp)) {
            return exp;
        }
        if(this._isString(exp)) {
            return exp.slice(1, -1);
        }

        // Math operations
        // if(exp[0] === "+") {
        //     return this.eval(exp[1], env) + this.eval(exp[2], env);
        // }
        // if(exp[0] === "-") {
        //     return this.eval(exp[1], env) - this.eval(exp[2], env);
        // }
        // if(exp[0] === "*") {
        //     return this.eval(exp[1], env) * this.eval(exp[2], env);
        // }
        // if(exp[0] === "/") {
        //     return this.eval(exp[1], env) / this.eval(exp[2], env);
        // }

        // compare operators
        // if(exp[0] === ">") {
        //     return this.eval(exp[1], env) > this.eval(exp[2], env);
        // }
        // if(exp[0] === ">=") {
        //     return this.eval(exp[1], env) >= this.eval(exp[2], env);
        // }
        // if(exp[0] === "<") {
        //     return this.eval(exp[1], env) < this.eval(exp[2], env);
        // }
        // if(exp[0] === "<=") {
        //     return this.eval(exp[1], env) <= this.eval(exp[2], env);
        // }
        // if(exp[0] === "==") {
        //     return this.eval(exp[1], env) == this.eval(exp[2], env);
        // }


        // Block: sequence of expressions
        if(exp[0] === "begin") {
            const blockEnv = new Environment({}, env);
            return this._evalBlock(exp, blockEnv)
        }

        // Varaible declaration (var foo 10)
        if(exp[0] === "var") {
            const [_, name, value] = exp;
            return env.define(name, this.eval(value, env));
        }
        // Variable update: (set foo 10)
        if(exp[0] === "set") {
            // const [_, name, value] = exp;
            const [_, ref, value] = exp;

            //Assignment to a property
            if(ref[0] === "prop") {
                const [_tag, instance, propName] = ref;
                const instanceEnv = this.eval(instance, env);

                return instanceEnv.define(
                    propName,
                    this.eval(value, env),
                );
            }

            // simple assignment
            return env.assign(ref, this.eval(value, env));
        }

        // Variable access: foo
        if(this._isVariableName(exp)) {
            return env.lookup(exp);
        }

        if(exp[0] == "if") {
            const [_tag, condition, consequent, alternate] = exp;
            if(this.eval(condition, env)) {
                return this.eval(consequent, env);
            }
            return this.eval(alternate, env);
        }

        // while-expression:
        if(exp[0] === "while") {
            const [_tag, condition, body] = exp;
            let result;
            while(this.eval(condition, env)) {
                result = this.eval(body, env);
            }
            return result;
        }

        // Function  declaration : (def square (x) (* x x))
        // Syntactic sugar for: (var square (lambda (x) (* x x)))
        if(exp[0] === "def") {
            // 常规写法
            // const [_tag, name, params, body] = exp;
            // const fn = {
            //     params,
            //     body,
            //     env, // Closure;
            // };
            // return env.define(name, fn);
            // same lamda 写法
            // const varExp = ['var', name, ['lambda', params, body]];
            // 将表达式 翻译成lambda， 统一放到一个类中管理
            const varExp = this._transformer.transformDefToVarLambda(exp);
            return this.eval(varExp, env);
        }
        /**
         * For-loop:(for init condition modifier body)
         * Syntacic sugar for: (begin init while condition  (begin body modifier)))
         */
        if(exp[0] === "switch") {
            const ifExp = this._transformer.transformSwitchToIf(exp);
            return this.eval(ifExp, env);
        }
        if(exp[0] === "for") {
            const whileExp = this._transformer.transformForToWhile(exp);
            return this.eval(whileExp, env);
        }
        if(exp[0] === "++") {
            const setExp = this._transformer.transformIncrToSet(exp);
            return this.eval(setExp, env);
        }
        if(exp[0] === "--") {
            const setExp = this._transformer.transformDecrToSet(exp);
            return this.eval(setExp, env);
        }


        // Lambda function : (def square (x) (* x x))
        if(exp[0] === "lambda") {
            const [_tag, params, body] = exp;
            return {
                params,
                body,
                env,
            }
        }

        // Class declaration : (class <Name>  <Parent> <Body>)
        if(exp[0] === "class") {
            const [_tag, name, parent, body] = exp;
            const parentEnv = this.eval(parent, env) || env;
            const classEnv = new Environment({}, parentEnv);
            this._evalBody(body, classEnv);

            // 将class 组册到全局管理
            this.global.define(name, classEnv);

            return env.define(name, classEnv);
        }

        if(exp[0] === "super") {
            const [_tag, className] = exp;
            return this.eval(className, env).parent;
        }

        if(exp[0] === "new") {
            const classEnv = this.eval(exp[1], env);
            const instanceEnv = new Environment({}, classEnv);

            const args = exp.slice(2).map(arg => this.eval(arg, env));

            this._callUserDefinedFunction(
                classEnv.lookup("constructor"),
                [instanceEnv, ...args],
            );
            return instanceEnv;
        }

        // Property access: (prop <instance> <name>)
        if(exp[0] === "prop") {
            const [_tag, instance, name] = exp;
            const instanceEnv = this.eval(instance, env);
            return instanceEnv.lookup(name);
        }

        // Module declaration: (module <body>)
        if(exp[0] === "module") {
            const [_tag, name, body] = exp;
            const moduleEnv = new Environment({}, env);
            this._evalBody(body, moduleEnv);

            // 将class 组册到全局管理
            this.global.define(name, moduleEnv);

            return env.define(name, moduleEnv);
        }

        if(exp[0] === "import") {
            const [_tag, name] = exp;

            // 先从缓存读取,module名字， 先查找是否已经家在过， 如果已经加载过，那么不需要继续再加载
            var cache = null
            try {
                cache = this.global.lookup(name);
            } catch (e) {
                if (e instanceof ReferenceError) {
                    cache = null;
                } else {
                    throw e; // let others bubble up
                }
            }
            if(cache != null) {
                return cache;
            }

            const moduleSrc = fs.readFileSync(
                `${__dirname}/modules/${name}.eva`,
                'utf-8',
            );
            const body = evalParser.parse(`(begin ${moduleSrc})`);
            const moduleExp = ["module", name, body];
            return this.eval(moduleExp, this.global);
        }

        // function calls
        // (print "hello World")
        // (+ x 5)
        // (> foo bar)
        if(Array.isArray(exp)) {
            const fn = this.eval(exp[0], env);
            const args = exp.slice(1).map(arg => this.eval(arg, env));

            // 1. Native function
            if(typeof fn === "function") {
                return fn(...args);
            }
            // 2. user -defined
            //TODO
            /*const activationRecord = {}
            fn.params.forEach((param, index) => {
                activationRecord[param] = args[index];
            })
            const acivationEnv = new Environment(activationRecord, fn.env);
            return this._evalBody(fn.body, acivationEnv)*/
            return this._callUserDefinedFunction(fn, args);

        }

        throw  `Unimplemented: ${JSON.stringify(exp)}`;
    }

    _callUserDefinedFunction(fn, args) {
        const activationRecord = {}
        fn.params.forEach((param, index) => {
            activationRecord[param] = args[index];
        })
        const acivationEnv = new Environment(activationRecord, fn.env);
        return this._evalBody(fn.body, acivationEnv)
    }

    _evalBody(body, env) {
        if(body[0] === "begin") {
            return this._evalBlock(body, env);
        }
        return this.eval(body, env);
    }

    _evalBlock(block, env) {
        let result;
        const [tag, ...expressions] = block;
        expressions.forEach(exp =>{
            result = this.eval(exp, env);
        })
        return result
    }

    _isNumber(exp) {
        return typeof exp === "number"
    }

    _isString(exp) {
        return typeof  exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
    }

    _isVariableName(exp) {
        return typeof exp === "string" && /^[\+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
    }
}

const GlobalEnvironment = new Environment({
    null : null,
    true: true,
    false: false,
    VERSION: "0.1",

    // math
    "+"(opt1, opt2) {
        return opt1 + opt2;
    },
    "-"(opt1, opt2 = null) {
        if(opt2 == null) {
            return -opt1;
        }
        return opt1 - opt2;
    },
    "*"(opt1, opt2) {
        return opt1 * opt2;
    },
    "/"(opt1, opt2) {
        return opt1 / opt2;
    },

    // compaire
    ">"(opt1, opt2) {
        return opt1 > opt2;
    },
    ">="(opt1, opt2) {
        return opt1 >= opt2;
    },
    "<"(opt1, opt2) {
        return opt1 < opt2;
    },
    "<="(opt1, opt2) {
        return opt1 <= opt2;
    },
    "=="(opt1, opt2) {
        return opt1 == opt2;
    },
    print(...args) {
        console.log(args);
    }

})



module.exports = Eva;
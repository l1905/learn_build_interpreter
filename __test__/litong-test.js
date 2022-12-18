a = {
    null: null,
    true: true,
    false: false,
    VERSION: "0.1",

    // math
    "+"(opt1, opt2) {
        return opt1 + opt2;
    },
    "-"(opt1, opt2 = null) {
        if (opt2 == null) {
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
}
console.log(a["+"](1,2))

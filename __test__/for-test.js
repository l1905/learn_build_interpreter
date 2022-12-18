const assert = require("assert")
const testUtil = require("./test-util");

module.exports = eva => {
    // math
    testUtil.test(eva, `
       (begin
         (var y 10)
        (for
            (var x 1)
            (< x 5)
            (set x (+ x 1))
            (begin 
                (set y (+ y x))
            )
        )
        y
        )
        `,
        20);

}
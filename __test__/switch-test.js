const assert = require("assert")
const testUtil = require("./test-util");

module.exports = eva => {

//     (begin
//     (var x 10)
//     (var y 20)
//     (+ (* x 10) y)
// )


    // (begin
    // (var x 10)
    // (switch ((== x 10) 100)
    //     ((> x 10) 200)
    //     (else 300))
    // )

    // math
    testUtil.test(eva, `
        (begin
            (var x 10)
            (switch ((== x 10) 100)
              ((> x 10) 200)
              (else 300))
        )
        `,
        100);

}
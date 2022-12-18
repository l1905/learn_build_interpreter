const assert = require("assert")
const testUtil = require("./test-util");


/**
 * (if <condition>
 *     <consequent>
 *     <alternate>
 *         )
 * @param eva
 */
module.exports = eva => {
    // math
    testUtil.test(eva, `
       (begin
         (var y 10)
         (-- y)
         y
        )
        `,
        9);
}
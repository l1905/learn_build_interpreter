const assert = require("assert")
const testUtil = require("./test-util");

module.exports = eva => {
    // math
    testUtil.test(eva, `
       (import Math)
       ((prop Math abs) (- 10))

        `,
        10);

    testUtil.test(eva, `
       (import Math)
       (var abs (prop Math abs))
       (abs (- 10))
        `,
        10);
    //
    testUtil.test(eva, `
       (prop Math MAX_VALUE)
        `,
        1000);
};
const assert = require("assert")

/**
 * (if <condition>
 *     <consequent>
 *     <alternate>
 *         )
 * @param eva
 */
module.exports = eva => {
    // Blocks
    assert.strictEqual(eva.eval([
        "begin",
        ['var', "counter", 0],
        ['var', "result", 0],
        ["while", ["<", 'counter', 10],
            ['begin',
                ["set", "result", ["+", "result" , 1]],
                ["set", "counter", ["+", "counter", 1]],
            ]
        ],
        'result',
    ]), 10);
}
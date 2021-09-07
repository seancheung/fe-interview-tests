// 14:24 - 15:02

/**
 * 多米诺排序
 * @param {string[]} input 输入值
 * @returns {string[][]}
 */
function sortDominoes(input) {
  const isMatch = (sorted, item) => {
    if (sorted.length === 0) {
      return 1;
    }
    const last = sorted[sorted.length - 1];
    if (last[1] === item[0]) {
      return 1;
    }
    if (last[1] === item[1]) {
      return -1;
    }
  };
  const isClose = (sorted) => sorted[0][0] === sorted[sorted.length - 1][1];
  const flip = (item) => item.split("").reverse().join("");

  function* match(sorted, unsorted, length) {
    for (let i = 0; i < unsorted.length; i++) {
      let item = unsorted[i];
      const list = [...sorted];
      const matched = isMatch(sorted, item);
      if (matched) {
        if (matched < 0) {
          item = flip(item);
        }
        list.push(item);
        if (list.length === length && isClose(list)) {
          yield list;
        }
        const filtered = unsorted.filter((_, j) => i !== j);
        yield* match(list, filtered, length);
      }
    }
  }

  return Array.from(match([], input, input.length));
}

console.log(sortDominoes(["21", "23", "13"]));
/**
 * 输出
 * [ [ '21', '13', '32' ], [ '23', '31', '12' ], [ '13', '32', '21' ] ]
 */
console.log(
  sortDominoes(["12", "53", "31", "12", "24", "16", "23", "34", "56"])
);
/**
 * 输出
[
  [
    '12', '21', '13',
    '32', '24', '43',
    '35', '56', '61'
  ],
  [
    '12', '21', '13',
    '34', '42', '23',
    '35', '56', '61'
  ],
  [
    '12', '21', '16',
    '65', '53', '32',
    '24', '43', '31'
  ],
  ...
]
*/

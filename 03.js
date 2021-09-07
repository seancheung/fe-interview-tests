// 15:37 - 15:54

/**
 * 将扁平化结构组装成树形(时间复杂度O(n))
 * @param {Array<{id: number; name: string; parentId?: number}>} list
 */
function compose(list) {
  const map = list.reduce((p, c) => {
    if (c.id == null) {
      throw new Error("missing id");
    }
    if (p.has(c.id)) {
      throw new Error("duplicated id");
    }
    p.set(c.id, { ...c });
    return p;
  }, new Map());
  let root;
  for (const item of map.values()) {
    if (item.parentId == null) {
      if (root) {
        throw new Error("duplicate root");
      }
      root = item;
    } else {
      const node = map.get(item.parentId);
      if (!node) {
        throw new Error(`node \`${item.parentId}\` not found`);
      }
      if (node === item) {
        throw new Error(`circular referenced node \`${item.parentId}\``);
      }
      if (!node.children) {
        node.children = [];
      }
      node.children.push(item);
      delete item.parentId;
    }
  }
  return root;
}

console.log(
  JSON.stringify(
    compose([
      { id: 1, name: "i1" },
      { id: 2, name: "i2", parentId: 1 },
      { id: 4, name: "i4", parentId: 3 },
      { id: 3, name: "i3", parentId: 2 },
      { id: 8, name: "i8", parentId: 4 },
    ]),
    null,
    2
  )
);
/**
 * 输出
{
  "id": 1,
  "name": "i1",
  "children": [
    {
      "id": 2,
      "name": "i2",
      "children": [
        {
          "id": 3,
          "name": "i3",
          "children": [
            {
              "id": 4,
              "name": "i4",
              "children": [
                {
                  "id": 8,
                  "name": "i8"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
*/

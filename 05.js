// 13:40 - 14:11

class Bus {
  _subs = new Map();
  _trigger(trace, event, ...args) {
    const sub = this._subs.get(event);
    if (!sub) {
      throw new Error("unknown event");
    }
    if (trace?._stack?.includes(event)) {
      throw new Error("infinite event loop");
    }
    const e = { type: "event", name: event, children: [] };
    const stack = [...(trace?._stack || []), event];
    sub.forEach((cb) => {
      const subtrace = { type: "callback", name: cb.name, _stack: stack };
      e.children.push(subtrace);
      cb.apply(
        {
          trigger: this._trigger.bind(this, subtrace),
        },
        args
      );
    });
    if (trace == null) {
      return e;
    }
    if (!trace.children) {
      trace.children = [];
    }
    trace.children.push(e);
  }
  /**
   * 监听事件
   * @param {string} event 事件名称
   * @param {(...args: any[]) => any} cb 回调
   */
  listen(event, cb) {
    if (!this._subs.has(event)) {
      this._subs.set(event, []);
    }
    const sub = this._subs.get(event);
    sub.push(cb);
  }
  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param  {...any} args 参数
   */
  trigger(event, ...args) {
    const trace = this._trigger(null, event, ...args);
    Bus.printTrace(trace);
  }
  /**
   * 打印调用链
   * @param {any} trace 调用链
   */
  static printTrace(trace) {
    const print = ({ type, name, children }, indent = 0) => {
      console.log(`${Array(indent).fill("--").join("")}${type}: ${name}`);
      if (children) {
        children.forEach((child) => print(child, indent + 1));
      }
    };
    print(trace);
  }
}

const bus = new Bus();
bus.listen("testEvent1", function callback1() {
  // do something
  // this.trigger("testEvent2"); //--> infinite loop test
});
bus.listen("testEvent", function callback1() {
  // do something
  this.trigger("testEvent2");
});
bus.listen("testEvent2", async function callback2() {
  // do something
  this.trigger("testEvent1");
});
bus.trigger("testEvent");
/**
 * 输出
event: testEvent
--callback: callback1
----event: testEvent2
------callback: callback2
--------event: testEvent1
----------callback: callback1
 */

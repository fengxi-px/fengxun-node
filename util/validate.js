class Validate {
  // 校验undefined
  async undefinedCheck(val, par) {
    if (val === undefined) {
      console.log("校验不通过");
      throw { msg: `${par}字段必填`, code: 400 };
    }
  }

  // 空值和字符串校验
  async emptyCheck(val, tips, par) {
    await this.undefinedCheck(val, par);
    if (typeof val !== "string") {
      throw { msg: `${par}字段必须为字符串类型`, code: 400 };
    }
    if (val.trim() === "") {
      throw { msg: tips, code: 422 };
    }
  }

  // 数组校验
  async arrayCheck(val, tips, par) {
    await this.undefinedCheck(val, par);
    if (!Array.isArray(val)) {
      throw { msg: `${par}字段必须为数组类型`, code: 400 };
    }
    if (val.length <= 0) {
      throw { msg: tips, code: 422 };
    }
  }
}

module.exports = new Validate();

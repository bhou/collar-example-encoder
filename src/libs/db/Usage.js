class Usage {
  constructor(username, type, timestamp) {
    this.username = username;
    this.type = type;
    this.timestamp = timestamp || new Date().getTime()
  }

  save() {
    if (!Usage.DB.has(this.username)) {
      Usage.DB.set(this.username, new Array());
    }

    let history = Usage.DB.get(this.username);

    history.push({
      username: this.username,
      type: this.type,
      timestamp: this.timestamp
    });
  }

  static findUsageByUserName(username) {
    if (!Usage.DB.has(username)) {
      return null;
    }
    let history = Usage.DB.get(username);
    let ret = [];
    for (let usage of history) {
      ret.push(new Usage(usage.username, usage.type, usage.timestamp));
    }
    return ret;
  }

  static findDailyUsageByUserName(username, date) {
    if (!Usage.DB.has(username)) {
      return null;
    }
    let history = Usage.DB.get(username);
    let now = date || new Date();
    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    let end = start + 24 * 60 * 60 * 1000;

    let ret = [];
    for (let usage of history) {
      if (usage.timestamp >= start && usage.timestamp < end) {
        ret.push(new Usage(usage.username, usage.type, usage.timestamp));
      }
    }
    return ret;
  }

}

Usage.DB = new Map();

module.exports = Usage;

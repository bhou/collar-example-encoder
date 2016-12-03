class Subscription {
  constructor(username, type, capacity) {
    this.username = username;
    this.type = type;

    if (type === 'trial') {
      this.capacity = 5;
    } else if (type === 'individual') {
      this.capacity = 10;
    } else if (type === 'enterprise') {
      this.capacity = 1000;
    }

    // override capacity, if specified in parameter
    if (capacity) this.capacity = capacity;
  }

  save() {
    Subscription.DB.set(this.username, {
      username: this.username,
      type: this.type,
      capacity: this.capacity,  // daily 
      createDate: this.createDate,
    });
  }

  toJSON() {
    return {
      type: this.type,
      username: this.username,
      capacity: this.capacity
    }
  }

  static findSubscriptionByUserName(name) {
    if (!Subscription.DB.has(name)) {
      return null;
    }

    let sub = Subscription.DB.get(name);
    return new Subscription(sub.username, sub.type, sub.capacity);
  }
}

Subscription.DB = new Map();

module.exports = Subscription;

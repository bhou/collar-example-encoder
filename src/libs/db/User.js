class User {
  constructor (username, password) {
    this.username = username;
    this.password = password;
  }

  save() {
    User.UserDB[this.username] = {
      username: this.username, 
      password: this.password
    };
  }

  toJSON() {
    return {
      username: this.username,
      password: this.password
    }
  }

  static findUserByName(name) {
    if (!User.UserDB.hasOwnProperty(name)) {
      return null;
    }
    return new User(User.UserDB[name].username, User.UserDB[name].password);
  }
}

User.UserDB = {
  "test@collarjs.com": {
    username: 'test@collarjs.com',
    password: '123'
  }
};

module.exports = User;

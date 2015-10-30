var passwordHash = require('password-hash');

module.exports = [
  {
    model: 'User',
    data: {
      firstName: 'Bob',
      lastName: 'Anderson',
      email: 'bob@anderson.foo',
      userName: 'bob@anderson.foo',
      role: 'subscriber',
      password: passwordHash.generate('secret')
    }
  },
  {
    model: 'User',
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@smith.foo',
      userName: 'john@smith.foo',
      role: 'admin',
      password: passwordHash.generate('p@$$w0rd')
    }
  },
  {
    model: 'SurveyQuestion',
    data: {
      type: 'select',
      options: 'apples,oranges,bananas',
      question: 'What is a Monkey\s Favorite?'
    }
  }
];

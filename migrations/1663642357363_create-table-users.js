/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'varchar(100)',
      notNull: true
    },
    password: {
      type: 'text',
      notNull: true
    },
    fullname: {
      type: 'text',
      notNull: true
    },
  });

  pgm.addConstraint('users', 'unique_username', 'UNIQUE(username)');
};

exports.down = pgm => {
  pgm.dropTable('users');
};

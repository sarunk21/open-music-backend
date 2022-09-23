/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.addColumns('albums', {
    coverUrl: {
      type: 'varchar(1000)',
      notNull: false,
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns('albums', ['coverUrl']);
};

const mapDBToModelAll = ({
  id, title, performer
}) => ({
  id, title, performer
});

const mapDBToModelDetail = ({
  id, title, year, performer, genre, duration, album_id
}) => ({
  id, title, year, performer, genre, duration, album_id
});

module.exports = { mapDBToModelAll, mapDBToModelDetail };
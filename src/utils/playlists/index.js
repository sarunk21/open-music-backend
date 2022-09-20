const mapDBToModelAll = ({
  id, name, username
}) => ({
  id, name, username
});

const mapDBToModelDetail = ({
  id, name, username, songs
}) => ({
  id, name, username, songs
});

module.exports = { mapDBToModelAll, mapDBToModelDetail };
module.exports = function(sequelize, DataTypes) {
  var Author = sequelize.define("Author", {
    // Giving the Author model a name of type STRING
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    cell: DataTypes.STRING
  });

  Author.associate = function(models) {
    // Associating Author with Items
    Author.hasMany(models.Item);
  };

  return Author;
};

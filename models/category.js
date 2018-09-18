module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    // Giving the Category model a name of type STRING
    name: DataTypes.STRING
  });

  Category.associate = function(models) {
    // Associating Category with Items
    Category.hasMany(models.Item);
  };

  return Category;
};

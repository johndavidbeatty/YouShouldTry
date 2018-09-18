module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    text: DataTypes.STRING,
    note: DataTypes.STRING,
    googleMap: DataTypes.STRING,
    yelpURL: DataTypes.STRING
  });

  Item.associate = function(models) {
    // We're saying that a Item should belong to an Author
    // A Item can't be created without an Author due to the foreign key constraint
    Item.belongsTo(models.Author, {
      foreignKey: {
        allowNull: false
      }
    });
    //An Item can belong to a category but isn't required to make it easier on users

    Item.belongsTo(models.Category, {
      foreignKey: {
        allowNull: true
      }
    });
    // an item may have multiple reviews.comments
    Item.hasMany(models.Review);
  };

  return Item;
};

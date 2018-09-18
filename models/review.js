module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define("Review", {
    // Giving the Review model a name of type STRING
    comment: DataTypes.STRING
  });
  Review.associate = function(models) {
    // We're saying that a Review should belong to an Item
    // A review can't be created without an Item due to the foreign key constraint
    Review.belongsTo(models.Item, {
      foreignKey: {
        allowNull: false
      }
    });
    // A Review should also have an Author
    Review.belongsTo(models.Author, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Review;
};

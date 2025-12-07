const mongoose = require('mongoose');

const identificationTypeSchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const IdentificationType = mongoose.model('IdentificationType', identificationTypeSchema);

module.exports = IdentificationType;

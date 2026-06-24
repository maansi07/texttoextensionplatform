import mongoose from 'mongoose';

const ExtensionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an extension name'],
      trim: true,
    },
    description: String,
    templateType: {
      type: String,
      enum: ['actionMenu', 'sidepanel', 'popup'],
      required: true,
    },
    code: {
      html: String,
      css: String,
      js: String,
    },
    generatedBy: {
      type: String,
      enum: ['template', 'ai'],
      default: 'template',
    },
    aiPrompt: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ExtensionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Extension', ExtensionSchema);
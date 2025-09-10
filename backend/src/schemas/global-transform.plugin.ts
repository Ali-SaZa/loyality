import { Schema } from "mongoose";

// Global transform plugin to convert _id to id
export const globalTransformPlugin = (schema: Schema) => {
  // Transform for toJSON (when sending to client)
  schema.set("toJSON", {
    transform: function (doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  });

  // Transform for toObject (when converting to plain object)
  schema.set("toObject", {
    transform: function (doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  });
};

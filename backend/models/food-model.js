const mongoose = require("mongoose");
const slugify = require("slugify");

// SCHEMA OPTION - Modelling of the Data [type, validation and more]
const foodSchema = new mongoose.Schema(
  {
    _foodName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxLength: [40, "Food Name should not have more than 40 characters"],
      minLength: [8, "Food Name should contain atleast 8 characters"],
    },
    _summary: {
      type: String,
      trim: true,
      required: [true, "Food should have a summary data."],
    },
    _description: {
      type: String,
      trim: true,
      required: [true, "Food description is needed"],
    },
    _numReviews: {
      type: Number,
      default: 0,
    },
    _price: {
      type: Number,
      required: [true, "Must have a Price."],
    },
    _ingredients: [String],
    _cookingTime: {
      type: Number,
      required: [true, "A Food must have a duration."],
    },
    _ratings: {
      type: Number,
      default: 4.0,
      min: [1, "Rating should be atleast 1.0"],
      max: [5, "Rating should not exceed a value 5.0"],
    },
    _category: {
      type: String,
      required: [
        true,
        "Category of the  Food must be any one of the following, Main course[M], Starter[S] and Beverages[B]",
      ],
      enum: {
        values: ["M", "S", "B"],
        message:
          "The Possible values of this property is [M] Main, [S] Starter and [B] Beverages.",
      },
    },
    _isNonVeg: {
      type: Boolean,
    },
    _ratingsAverage: {
      type: Number,
      default: 4.0,
    },
    _slug: { type: String },
    _discount: { type: Number, default: 0, validate: function (val) {} },
    _imageCover: {
      type: [String],
      required: [true, "A tour must have a multiple number of Images."],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    _magicalDesert: { type: Boolean, default: false },
  },
  // Schema Options
  {
    // NOTE: toJSON property is to set the options for the result data that come up in the JSON format.
    // NOTE: toObject property is to set the options for the result data that come up in the Object format.
    // NOTE: Also, the virtuals set to be true can be used for getting the virtuals of true.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// NOTE: Virtual properties are keys that added to our schema but not to be stored in our DB. Such as conversions of already existing data in our document.
// NOTE: .get() method is used to set a functionality on every get request which in turn need to be a regular function because of we need here to access the "this" keyword where in arrow function we cannot.
// NOTE: we cannot able to query the virtuals, since technical they are not part of the DB.
foodSchema.virtual("_durationInHrs").get(function () {
  return this._cookingTime / 60;
});

// DOCUMENT MIDDLEWARE
// NOTE: DOCUMENT MIDDLEWARE: runs on the request such as save() and create()
// NOTE: But not in insertMany() or insertOne()
// NOTE: A middleware need to be mentioned that when should it get execute, Schema.prototype.pre()/post()
// NOTE: pre() stands before and post() stands for after
// NOTE: Since the "this" keyword here points out the document it is called as the "Document middleware"
foodSchema.pre("save", function (next) {
  this._slug = slugify(this._foodName, { lower: true });
  next();
});

// foodSchema.pre("save", function (next) {
//   console.log("The Middlewares are working fine.");
//   next();
// });

// NOTE: post middlewares only get worked when the all the pre middlewares get done.
// foodSchema.post("save", function (doc, next) {
// NOTE: Here in the post() middleware we have access for data as a first parameter over the callback function and next as second.
//   console.log(this == doc);
//   doc._newProperty = "Property Added";
//   console.log(doc);
//   console.log("Post Middleware");
//   next();
// });

// QUERY MIDDLEWARE
// NOTE: QUERY MIDDLEWARE: runs on the request such as save() and create()
// NOTE: Since the "this" keyword here points out the query it is called as the "Query middleware"
// NOTE: This "find" method middleware only works for the find method but not for findOne() or anything like this so this should be either done with a separate middleware or modifying the method string using regex || regular expression
// foodSchema.pre("find", function (next) {
foodSchema.pre(/^find/, function (next) {
  // this.where({_magicalDesert: {$ne: true}})
  // this.where("_magicalDesert").ne(true);
  this.find({ _magicalDesert: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE
// NOTE: Aggregation Middleware will be executed once before or after the aggregation takes place.
foodSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { _price: { $lte: 150 } } });
  // console.log(this.pipeline());
  next();
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;

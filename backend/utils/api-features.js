// REFACTORING
class APIFeatures {
  // constructor method
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // TODO: FILTERING
    const queryObj = { ...this.queryString };
    ["sort", "limit", "page", "field"].forEach((ele) => delete queryObj[ele]);

    // TODO: ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|and|or)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    // TODO: SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // DEFAULT: Sorting
      this.query = this.query.sort("_createdAt");
    }
    return this;
  }

  limitingFields() {
    // TODO: FIELD LIMITING
    if (this.queryString.field) {
      const limitBy = this.queryString.field.split(",").join(" ");
      this.query = this.query.select(limitBy);
    }

    return this;
  }

  pagination() {
    // TODO: PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

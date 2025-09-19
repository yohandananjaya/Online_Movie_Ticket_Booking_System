import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: { type: String, required: true, ref: "Movie" }, 
    showDateTime: { type: Date, required: true },         
    showPrice: { type: Number, required: true },           // ticket price
    occupiedSeats: { type: Object, default: {} },          // seat booking info
  },
  { minimize: false } // ensures empty objects are saved instead of removed
);

const Show = mongoose.model("Show", showSchema);

export default Show;
import mongoose from 'mongoose'

export interface IFeedback extends mongoose.Document {
    feedback: string;
}

const FeebackSchema = new mongoose.Schema({
    feedback: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model<IFeedback>('Feedback', FeebackSchema);
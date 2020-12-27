import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string;
  githubID: number;
  githubURL: string;
  avatarURL: string;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  githubID: {
    type: Number,
    required: true,
    unique: true
  },
  githubURL: {
    type: String,
    required: true
  },
  avatarURL: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true,
    default: []
  }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;

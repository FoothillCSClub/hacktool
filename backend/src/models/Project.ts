import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  githubID: {
    type: Number,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  projectURL: {
    type: String,
    required: true
  },
  leader: {
    type: { type: Schema.Types.ObjectId, ref: 'User' },
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true,
    default: []
  }
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

export default Project;

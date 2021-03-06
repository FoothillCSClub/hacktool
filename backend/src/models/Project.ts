import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  projectURL: {
    type: String,
  },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  leaderID: {
    type: Schema.Types.ObjectId,
  },
  skills: {
    type: [String],
    required: true
  },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: []
  }
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

export default Project;

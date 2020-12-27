import config from './config';
import { LiteralUnion } from './util-types'

type TargetPath = LiteralUnion<'/debug-feedback' | '/project' | '/project/my-projects' | '/github/login' | '/github/callback' | '/me'>

type GeneratedAPIURI = Readonly<string>

function generateAPIURI(path: TargetPath): GeneratedAPIURI {
    return config.APP_API_URL + path;
}

export default generateAPIURI;
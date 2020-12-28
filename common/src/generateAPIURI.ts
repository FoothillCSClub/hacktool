import config from './config';
import { LiteralUnion } from './util-types'

type TargetPath = LiteralUnion<
    '/project/withUser' |
    '/me/dashboard' |
    '/debug-feedback' |
    '/project' |
    '/github/login'
    | '/github/callback'
    | '/me'>

type GeneratedAPIURI = Readonly<string>

function generateAPIURI(path: TargetPath): GeneratedAPIURI {
    return config.APP_API_URL + path;
}

export default generateAPIURI;
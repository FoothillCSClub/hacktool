import jwt from 'jsonwebtoken'

type GithubID = number;

export interface JWTPayloadType {
    githubID: GithubID;
    _id: string;
}

export async function generateJsonWebToken({ githubID, _id }: JWTPayloadType) {
    try {
        return await jwt.sign({ githubID, _id }, process.env.JSON_WEB_SECRET!, { expiresIn: '15 days' })
    } catch (error) {
        throw new Error(error)
    }
}

export async function generateDecodedJsonWebToken(token: string): Promise<JWTPayloadType | null> {
    try {

        if (!token || token.length <= 0) {
            throw new Error('No Token!')
        }

        const decoded = await jwt.verify(token, process.env.JSON_WEB_SECRET!) as JWTPayloadType

        return {
            githubID: decoded.githubID,
            _id: decoded._id,
        }
    } catch (error) {
        console.error(error)
        return null
    }
}




import axios from 'axios'
import { basename } from 'path'


const client = axios.create({
  baseURL: 'https://api.sirv.com/v2',
  headers: {
    'content-type': 'application/json'
  }
})

const SIRV_CONFIG = {
  clientAdminId: process.env.SIRV_CLIENT_ADMIN_ID ?? null,
  clientAdminSecret: process.env.SIRV_CLIENT_ADMIN_SECRET ?? null,
  clientId: process.env.SIRV_CLIENT_ID ?? null,
  clientSecret: process.env.SIRV_CLIENT_SECRET ?? null,
  baseURL: process.env.SIRV_BASE_URL ?? null
}

interface TokenParamsType {
  clientId: string | null
  clientSecret: string | null
}

const _validateTokenParams = ({ clientId, clientSecret }: TokenParamsType): boolean =>
  clientId != null && clientSecret != null


/**
 * Get Sirv access token
 * @param isAdmin determines if we should get admin token
 * @returns access token string
 */
export const getToken = async (isAdmin: boolean = false): Promise<string|undefined> => {
  const params: TokenParamsType = isAdmin
    ? {
      clientId: SIRV_CONFIG.clientAdminId,
        clientSecret: SIRV_CONFIG.clientAdminSecret
      }
    : {
        clientId: SIRV_CONFIG.clientId,
        clientSecret: SIRV_CONFIG.clientSecret
      }

  if (!_validateTokenParams(params)) {
    console.log('Missing client token/secret')
    return undefined
  }
  const res = await client.post(
    '/token',
    params)

  if (res.status === 200) {
    return res.data.token
  }
  throw new Error('Sirv API.getToken() error' + res.statusText)
}

/**
 * Delete a photo from Sirv
 * @param filename name of file to be removed
 * @param adminToken
 * @returns deleted filename
 */
export const remove = async (filename: string, adminToken: string): Promise<string> => {
  const res = await client.post(
    `/files/delete?filename=${filename}`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${adminToken}`
      }
    }
  )
  if (res.status >= 200 && res.status <= 204) { return filename }
  throw new Error(`Image API delete() failed.  Status: ${res.status}`)
}

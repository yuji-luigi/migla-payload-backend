export const http = {
  get: async (url: string) => {
    const response = await fetch(url)
    return response.json()
  },
  post: async (
    url: string,
    {
      body,
      headers,
      otherOptions,
    }: {
      body?: Record<string, string> | FormData
      headers?: HeadersInit
      otherOptions?: any // specify all other params from fetchx
    },
  ) => {
    console.log({ body })
    const response = await fetch(url, {
      method: 'POST',
      body: body && JSON.stringify(body),
      headers,
      ...otherOptions,
    })
    return response.json()
  },
  put: async (url: string, body: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    return response.json()
  },
  delete: async (url: string) => {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    return response.json()
  },
  patch: async (url: string, body: any) => {
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    return response.json()
  },
  upload: async (url: string, body: any) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return response.json()
  },
  download: async (url: string) => {
    const response = await fetch(url)
    return response.json()
  },
}

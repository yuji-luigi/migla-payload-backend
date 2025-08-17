export const http = {
  get: async (url: string) => {
    const response = await fetch(url)
    return response.json()
  },
  post: async <ResponseData = unknown>(
    url: string,
    {
      body,
      headers,
      otherOptions,
    }: {
      body?: Record<string, string> | FormData
      headers?: HeadersInit
      otherOptions?: any // specify all other params from fetchx
    } = {},
  ) => {
    const response = await fetch(url, {
      method: 'POST',
      body: body && body instanceof FormData ? body : body && JSON.stringify(body),
      headers,
      credentials: 'include',
      ...otherOptions,
    })
    if (response.ok) {
      return (await response.json()) as ResponseData
    }
    const data = await response.json()
    if (data.errors && Array.isArray(data.errors)) {
      throw new Error(
        data.errors.map((error: any) =>
          Object.entries(error).map(([key, value]) => `${key}: ${value}`),
        ),
      )
    }
    throw new Error(response.statusText)
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

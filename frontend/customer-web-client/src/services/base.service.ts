import { filter, map } from 'rxjs';
import { ajax } from 'rxjs/ajax';

interface GetHttpClientParams {
  body?: any;
  url: string;
  headers?: any;
  queries?: any;
  method: string;
}

export class BaseService {
  private httpClient = {
    timeout: 20000,
    includeUploadProgress: true,
    includeDownloadProgress: true,
  };

  protected getHttpClient<TData>({
    method,
    body,
    headers,
    queries,
    url,
  }: GetHttpClientParams) {
    return ajax<TData>({
      body,
      method,
      ...this.httpClient,
      url,
      queryParams: queries,
      headers: {
        ...headers,
      },
    }).pipe(
      map(({ response }) => response),
      filter((response) => response !== null && response !== undefined)
    );
  }

  protected getAuthenticatedHttpClient<TData>(
    { method, body, headers, queries, url }: GetHttpClientParams,
    accessToken: string
  ) {
    return ajax<TData>({
      body,
      method,
      ...this.httpClient,
      url,
      queryParams: queries,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    }).pipe(
      map(({ response }) => response),
      filter((response) => response !== null && response !== undefined)
    );
  }
}

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrorResponse {
  /** Error message */
  error?: string;
  /** Optional fallback response message */
  response?: string;
}

export interface Session {
  /**
   * Unique session UUID
   * @format uuid
   */
  id: string;
  /** Client-provided session identifier */
  sessionId: string;
  /**
   * Session expiration timestamp
   * @format date-time
   */
  expiresAt: string;
  /** Client IP address */
  ipAddress?: string;
  /** Client user agent */
  userAgent?: string;
  /**
   * Last activity timestamp
   * @format date-time
   */
  lastActivityAt: string;
  /** Total message count in session */
  messageCount: number;
  /**
   * Session creation timestamp
   * @format date-time
   */
  createdAt: string;
}

export interface CreateSessionRequest {
  /** Client-generated session identifier */
  sessionId: string;
}

export interface CreateSessionResponse {
  session?: Session;
}

export interface ChatHistory {
  /** Unique chat ID */
  id: string;
  /** Associated session UUID */
  sessionId: string;
  /** Chat title/summary */
  title: string;
  /**
   * Chat creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
}

export interface GetChatsResponse {
  chatHistories?: ChatHistory[];
}

export interface CreateChatRequest {
  /** Session identifier */
  sessionId: string;
  /** Client-generated chat ID */
  chatId: string;
  /**
   * Initial chat title
   * @default "Percakapan Baru"
   */
  title?: string;
}

export interface CreateChatResponse {
  chat?: ChatHistory;
}

export interface RenameChatRequest {
  /** Chat ID to rename */
  chatId: string;
  /** New chat title */
  title: string;
}

export interface DeleteChatResponse {
  /** Whether deletion was successful */
  success?: boolean;
}

export interface Message {
  /** Unique message ID */
  id: string;
  /** Associated session UUID */
  sessionId: string;
  /** Message sender role */
  role: MessageRoleEnum;
  /** Message content */
  content: string;
  /**
   * Message creation timestamp
   * @format date-time
   */
  createdAt: string;
}

export interface GetMessagesResponse {
  messages?: Message[];
}

export interface CreateMessageRequest {
  /** Session/Chat identifier */
  sessionId: string;
  /** Message sender role */
  role: CreateMessageRequestRoleEnum;
  /** Message content */
  content: string;
}

export interface CreateMessageResponse {
  message?: Message;
}

export interface SendMessageRequest {
  /** User message to send to AI */
  message: string;
  /** Session identifier */
  sessionId?: string;
  /** Chat ID for message context */
  chatId?: string;
}

export interface SendMessageResponse {
  /** AI-generated response */
  response?: string;
  /** Session identifier */
  sessionId?: string;
  /** Chat ID */
  chatId?: string;
  /** Whether response was from cache */
  cached?: boolean;
}

export interface BackgroundMusic {
  /** Unique music track ID */
  id: string;
  /** Track title */
  title: string;
  /** Artist name */
  artist: string;
  /**
   * Audio file URL
   * @format uri
   */
  url: string;
  /** Song lyrics (optional) */
  lyrics?: string;
  /** Whether track is active in playlist */
  isActive: boolean;
  /** Track order in playlist */
  order: number;
  /**
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
}

export interface GetPlaylistResponse {
  playlist?: BackgroundMusic[];
}

/** Message sender role */
export type MessageRoleEnum = "user" | "assistant";

/** Message sender role */
export type CreateMessageRequestRoleEnum = "user" | "assistant";

export interface GetChatsParams {
  /** The session identifier */
  sessionId: string;
}

export interface DeleteChatParams {
  /** The chat ID to delete */
  chatId: string;
}

export interface GetMessagesParams {
  /** The chat ID to get messages for (preferred) */
  chatId?: string;
  /** The session ID (fallback if chatId not provided) */
  sessionId?: string;
}

export namespace Chat {
  /**
   * @description Send a user message and receive an AI-generated response. Responses may be cached for performance.
   * @tags Chat
   * @name SendMessage
   * @summary Send message to AI
   * @request POST:/chat
   * @response `200` `SendMessageResponse` Successful response from AI
   * @response `400` `ErrorResponse` Bad request - message is required
   * @response `500` `ErrorResponse` Server error
   */
  export namespace SendMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendMessageRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SendMessageResponse;
  }
}

export namespace Chats {
  /**
   * @description Retrieve all chat histories for a given session
   * @tags Chats
   * @name GetChats
   * @summary Get all chat histories
   * @request GET:/chats
   * @response `200` `GetChatsResponse` List of chat histories
   */
  export namespace GetChats {
    export type RequestParams = {};
    export type RequestQuery = {
      /** The session identifier */
      sessionId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetChatsResponse;
  }

  /**
   * @description Create a new chat conversation
   * @tags Chats
   * @name CreateChat
   * @summary Create a new chat
   * @request POST:/chats
   * @response `200` `CreateChatResponse` Chat created successfully
   * @response `400` `ErrorResponse` Bad request - sessionId and chatId required
   * @response `500` `ErrorResponse` Server error
   */
  export namespace CreateChat {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateChatRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateChatResponse;
  }

  /**
   * @description Update the title of an existing chat
   * @tags Chats
   * @name RenameChat
   * @summary Rename a chat
   * @request PATCH:/chats
   * @response `200` `CreateChatResponse` Chat renamed successfully
   * @response `400` `ErrorResponse` Bad request - chatId and title required
   * @response `500` `ErrorResponse` Server error
   */
  export namespace RenameChat {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RenameChatRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateChatResponse;
  }

  /**
   * @description Delete a chat and all its messages
   * @tags Chats
   * @name DeleteChat
   * @summary Delete a chat
   * @request DELETE:/chats
   * @response `200` `DeleteChatResponse` Chat deleted successfully
   * @response `400` `ErrorResponse` Bad request - chatId required
   * @response `500` `ErrorResponse` Server error
   */
  export namespace DeleteChat {
    export type RequestParams = {};
    export type RequestQuery = {
      /** The chat ID to delete */
      chatId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteChatResponse;
  }
}

export namespace Messages {
  /**
   * @description Retrieve all messages for a specific chat or session
   * @tags Messages
   * @name GetMessages
   * @summary Get messages for a chat
   * @request GET:/messages
   * @response `200` `GetMessagesResponse` List of messages
   */
  export namespace GetMessages {
    export type RequestParams = {};
    export type RequestQuery = {
      /** The chat ID to get messages for (preferred) */
      chatId?: string;
      /** The session ID (fallback if chatId not provided) */
      sessionId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMessagesResponse;
  }

  /**
   * @description Create a new message in a chat session
   * @tags Messages
   * @name CreateMessage
   * @summary Create a new message
   * @request POST:/messages
   * @response `200` `CreateMessageResponse` Message created successfully
   * @response `400` `ErrorResponse` Bad request - role and content required
   * @response `500` `ErrorResponse` Server error
   */
  export namespace CreateMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMessageRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateMessageResponse;
  }
}

export namespace Music {
  /**
   * @description Retrieve the background music playlist
   * @tags Music
   * @name GetPlaylist
   * @summary Get music playlist
   * @request GET:/music
   * @response `200` `GetPlaylistResponse` Music playlist
   */
  export namespace GetPlaylist {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPlaylistResponse;
  }
}

export namespace Sessions {
  /**
   * @description Create a new session or retrieve an existing one
   * @tags Sessions
   * @name CreateOrGetSession
   * @summary Create or get session
   * @request POST:/sessions
   * @response `200` `CreateSessionResponse` Session created or retrieved
   * @response `400` `ErrorResponse` Bad request - sessionId required
   * @response `500` `ErrorResponse` Server error
   */
  export namespace CreateOrGetSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateSessionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateSessionResponse;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title AI SmartChat API
 * @version 1.0.0
 * @baseUrl /api
 * @contact AI SmartChat Team
 *
 * API for AI SmartChat application - A smart chat application with AI responses,
 * session management, chat history, and background music features.
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  chat = {
    /**
     * @description Send a user message and receive an AI-generated response. Responses may be cached for performance.
     *
     * @tags Chat
     * @name SendMessage
     * @summary Send message to AI
     * @request POST:/chat
     * @response `200` `SendMessageResponse` Successful response from AI
     * @response `400` `ErrorResponse` Bad request - message is required
     * @response `500` `ErrorResponse` Server error
     */
    sendMessage: (data: SendMessageRequest, params: RequestParams = {}) =>
      this.http.request<SendMessageResponse, ErrorResponse>({
        path: `/chat`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  chats = {
    /**
     * @description Retrieve all chat histories for a given session
     *
     * @tags Chats
     * @name GetChats
     * @summary Get all chat histories
     * @request GET:/chats
     * @response `200` `GetChatsResponse` List of chat histories
     */
    getChats: (query: GetChatsParams, params: RequestParams = {}) =>
      this.http.request<GetChatsResponse, any>({
        path: `/chats`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new chat conversation
     *
     * @tags Chats
     * @name CreateChat
     * @summary Create a new chat
     * @request POST:/chats
     * @response `200` `CreateChatResponse` Chat created successfully
     * @response `400` `ErrorResponse` Bad request - sessionId and chatId required
     * @response `500` `ErrorResponse` Server error
     */
    createChat: (data: CreateChatRequest, params: RequestParams = {}) =>
      this.http.request<CreateChatResponse, ErrorResponse>({
        path: `/chats`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the title of an existing chat
     *
     * @tags Chats
     * @name RenameChat
     * @summary Rename a chat
     * @request PATCH:/chats
     * @response `200` `CreateChatResponse` Chat renamed successfully
     * @response `400` `ErrorResponse` Bad request - chatId and title required
     * @response `500` `ErrorResponse` Server error
     */
    renameChat: (data: RenameChatRequest, params: RequestParams = {}) =>
      this.http.request<CreateChatResponse, ErrorResponse>({
        path: `/chats`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a chat and all its messages
     *
     * @tags Chats
     * @name DeleteChat
     * @summary Delete a chat
     * @request DELETE:/chats
     * @response `200` `DeleteChatResponse` Chat deleted successfully
     * @response `400` `ErrorResponse` Bad request - chatId required
     * @response `500` `ErrorResponse` Server error
     */
    deleteChat: (query: DeleteChatParams, params: RequestParams = {}) =>
      this.http.request<DeleteChatResponse, ErrorResponse>({
        path: `/chats`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),
  };
  messages = {
    /**
     * @description Retrieve all messages for a specific chat or session
     *
     * @tags Messages
     * @name GetMessages
     * @summary Get messages for a chat
     * @request GET:/messages
     * @response `200` `GetMessagesResponse` List of messages
     */
    getMessages: (query: GetMessagesParams, params: RequestParams = {}) =>
      this.http.request<GetMessagesResponse, any>({
        path: `/messages`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new message in a chat session
     *
     * @tags Messages
     * @name CreateMessage
     * @summary Create a new message
     * @request POST:/messages
     * @response `200` `CreateMessageResponse` Message created successfully
     * @response `400` `ErrorResponse` Bad request - role and content required
     * @response `500` `ErrorResponse` Server error
     */
    createMessage: (data: CreateMessageRequest, params: RequestParams = {}) =>
      this.http.request<CreateMessageResponse, ErrorResponse>({
        path: `/messages`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  music = {
    /**
     * @description Retrieve the background music playlist
     *
     * @tags Music
     * @name GetPlaylist
     * @summary Get music playlist
     * @request GET:/music
     * @response `200` `GetPlaylistResponse` Music playlist
     */
    getPlaylist: (params: RequestParams = {}) =>
      this.http.request<GetPlaylistResponse, any>({
        path: `/music`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  sessions = {
    /**
     * @description Create a new session or retrieve an existing one
     *
     * @tags Sessions
     * @name CreateOrGetSession
     * @summary Create or get session
     * @request POST:/sessions
     * @response `200` `CreateSessionResponse` Session created or retrieved
     * @response `400` `ErrorResponse` Bad request - sessionId required
     * @response `500` `ErrorResponse` Server error
     */
    createOrGetSession: (
      data: CreateSessionRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<CreateSessionResponse, ErrorResponse>({
        path: `/sessions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}

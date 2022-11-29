import axios, { AxiosInstance } from "axios";

export interface MinifluxOptions {
  token: string;
  url: string;
}

export interface GetEntriesOptions {
  limit?: number;
  direction?: 'asc' | 'desc';
  status?: "unread" | "read",
  offset?: number;
  order?: string;
  before?: number;
  after?: number;
  before_entry_id?: number;
  after_entry_id?: number;
  starred?: boolean;
  search?: string;
  category_id?: number;
}

export interface GetEntriesResult {
  total: number;
  entries: Entry[];
}

export interface Entry {
  id: number;
  user_id: number;
  feed_id: number;
  status: string;
  hash: string;
  title: string;
  url: string;
  comments_url: string;
  published_at: Date;
  created_at: Date;
  changed_at: Date;
  content: string;
  author: string;
  share_code: string;
  starred: boolean;
  reading_time: number;
  enclosures: null;
  feed: Feed;
}

export interface Feed {
  id: number;
  user_id: number;
  feed_url: string;
  site_url: string;
  title: string;
  checked_at: Date;
  next_check_at: Date;
  etag_header: string;
  last_modified_header: string;
  parsing_error_message: string;
  parsing_error_count: number;
  scraper_rules: string;
  rewrite_rules: string;
  crawler: boolean;
  blocklist_rules: string;
  keeplist_rules: string;
  urlrewrite_rules: string;
  user_agent: string;
  cookie: string;
  username: string;
  password: string;
  disabled: boolean;
  ignore_http_cache: boolean;
  allow_self_signed_certificates: boolean;
  fetch_via_proxy: boolean;
  category: Category;
  icon: Icon;
  hide_globally: boolean;
}

export interface Category {
  id: number;
  title: string;
  user_id: number;
  hide_globally: boolean;
}

export interface Icon {
  feed_id: number;
  icon_id: number;
}

export interface UpdateEntriesOptions {
  entry_ids: Array<number>;
  status: "read" | "unread"
}


export class MinifluxClient {

  private _options: MinifluxOptions;
  private _client: AxiosInstance;

  constructor(options: MinifluxOptions) {
    this._options = options
    this._client = axios.create({
      baseURL: this._options.url,
      headers: {
        'x-auth-token': this._options.token
      }
    })
  }

  /**
   * validate 
   * 
   * @returns 
   */
  public async validate() {
    await this._client.get(`/v1/feeds/counters`)
    return true
  }

  /**
   * get entries
   * 
   * @param options 
   * @returns 
   */
  public async entires(options?: GetEntriesOptions) {
    const response = await this._client.get("/v1/entries", {
      params: options
    })
    return response.data as GetEntriesResult
  }

  public async update(options: UpdateEntriesOptions) {
    await this._client.put("/v1/entries", options)
  }

  /**
   * Toggle Entry Bookmark
   *      
   * https://miniflux.app/docs/api.html#endpoint-toggle-bookmark
   */
  public async toggleBookmark(entryId: number) {
    await this._client.put(`/v1/entries/${entryId}/bookmark`)
  }

}
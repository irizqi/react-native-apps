/**
 * Route configuration types
 */
export type RouteConfig = 
  | string 
  | {
      path: string;
      params?: string[];
    };

export type RouteDefinitions = Record<string, RouteConfig>;

/**
 * Extract parameter names from route config
 */
type ExtractParams<T extends RouteConfig> = T extends { params: infer P }
  ? P extends string[]
    ? Record<P[number], string | number>
    : never
  : never;

/**
 * Map route definitions to their parameter types
 */
type RouteParams<T extends RouteDefinitions> = {
  [K in keyof T]: T[K] extends { params: infer P }
    ? P extends string[]
      ? Record<P[number], string | number>
      : Record<string, never>
    : Record<string, never>;
};

/**
 * Enhanced ApiRoute with typed parameters
 * 
 * @example
 * ```typescript
 * const routes = new ApiRoute({
 *   getUsers: '/users',
 *   getUser: { path: '/users/:id', params: ['id'] },
 *   updateUser: { path: '/users/:id', params: ['id'] },
 *   getUserPosts: { path: '/users/:userId/posts/:postId', params: ['userId', 'postId'] },
 * });
 * 
 * // Type-safe usage
 * routes.route('getUser', { id: '123' }); // ✓ OK
 * routes.route('getUserPosts', { userId: '1', postId: '2' }); // ✓ OK
 * routes.route('getUsers'); // ✓ OK (no params needed)
 * ```
 */
class ApiRoute<T extends RouteDefinitions = RouteDefinitions> {
  constructor(
    private routes: T,
    private baseApi: string = ''
  ) {}

  /**
   * Type-safe route generation with named parameters
   */
  route<K extends keyof T>(
    key: K,
    ...args: keyof RouteParams<T>[K] extends never
      ? []
      : [params: RouteParams<T>[K]]
  ): string;
  
  /**
   * Legacy positional parameters (backward compatible)
   */
  route<K extends keyof T>(key: K, ...params: (string | number)[]): string;
  
  route<K extends keyof T>(
    key: K,
    ...args: any[]
  ): string {
    const routeConfig = this.routes[key];
    
    if (!routeConfig) {
      throw new Error(`Route not found: ${String(key)}`);
    }

    const config = this.normalizeConfig(routeConfig);
    
    // Handle named parameters (object)
    if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
      return this.generateRouteWithNamedParams(config, args[0]);
    }
    
    // Handle positional parameters (backward compatible)
    return this.generateRouteWithPositionalParams(config, args);
  }

  /**
   * Generate route with query parameters
   */
  withQuery<K extends keyof T>(
    key: K,
    params?: RouteParams<T>[K] extends never ? undefined : RouteParams<T>[K],
    query?: Record<string, string | number | boolean | null | undefined>
  ): string {
    let url = params ? this.route(key, params as any) : this.route(key as any);
    
    if (query && Object.keys(query).length > 0) {
      const queryString = Object.entries(query)
        .filter(([_, value]) => value != null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      
      url += `?${queryString}`;
    }
    
    return url;
  }

  /**
   * Get base API URL
   */
  getBaseApi(): string {
    return this.baseApi;
  }

  /**
   * Get all route keys
   */
  getRouteKeys(): (keyof T)[] {
    return Object.keys(this.routes) as (keyof T)[];
  }

  private normalizeConfig(routeConfig: RouteConfig): { path: string; params?: string[] } {
    if (typeof routeConfig === 'string') {
      return { path: routeConfig };
    }
    return routeConfig;
  }

  private generateRouteWithNamedParams(
    config: { path: string; params?: string[] },
    params: Record<string, string | number>
  ): string {
    let path = config.path;

    // Replace :paramName syntax
    if (config.params) {
      config.params.forEach((paramName) => {
        const value = params[paramName];
        if (value === undefined) {
          throw new Error(`Missing required parameter: ${paramName}`);
        }
        path = path.replace(`:${paramName}`, String(value));
        path = path.replace(`{${paramName}}`, String(value));
      });
    }

    // Replace any remaining :param or {param} patterns
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
      path = path.replace(`{${key}}`, String(value));
    });

    return this.baseApi + path;
  }

  private generateRouteWithPositionalParams(
    config: { path: string; params?: string[] },
    params: (string | number)[]
  ): string {
    let path = config.path;

    // Replace $0, $1, $2 syntax (backward compatible)
    const placeholders = path.match(/\$[0-9]+/g);
    if (placeholders && placeholders.length > 0) {
      placeholders.forEach((placeholder, index) => {
        if (params[index] !== undefined) {
          path = path.replace(placeholder, String(params[index]));
        }
      });
      return this.baseApi + path;
    }

    // Replace :paramName or {paramName} with positional params
    if (config.params && params.length > 0) {
      config.params.forEach((paramName, index) => {
        if (params[index] !== undefined) {
          path = path.replace(`:${paramName}`, String(params[index]));
          path = path.replace(`{${paramName}}`, String(params[index]));
        }
      });
    }

    return this.baseApi + path;
  }
}

export { ApiRoute };

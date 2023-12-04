export declare const SUCCESS_MESSAGE = "Success";
export declare const SUCCESS_CODE = "OK";
export declare const INTERNAL_ERROR_MESSAGE = "Internal Error";
export declare const INTERNAL_ERROR_CODE = "ERROR";
export interface Composable {
    compose: (options: {
        data?: unknown;
        message?: string;
    }) => Response;
}
export interface Response {
    success?: boolean;
    code?: string;
    message?: string;
    data?: unknown;
}
export declare class SuccessResponse implements  Composable {
    readonly code: string;
    readonly message: string;
    readonly success: boolean;
    constructor(message: string, code?: string);
    compose: (options?: {
        data?: unknown;
        message?: string;
    }) => Response;
    toJSON: () => unknown;
}
export declare class ErrorResponse extends Error implements  Composable {
    readonly code: string;
    readonly success: boolean;
    constructor(message: string, code?: string);
    compose: (options?: {
        data?: unknown;
        message?: string;
    }) => Response;
    toJSON: () => unknown;
    wrap: (options?: {
        data?: unknown;
        message?: string;
        showData?: boolean;
    }) => ErrorResponse;
}
export declare function getResponseBody(resp: Response, fallbackSuccess?: boolean): unknown;
export declare const OK: SuccessResponse;
export declare const ERROR_INTERNAL: ErrorResponse;
export declare const ERROR_BAD_REQUEST: ErrorResponse;
export declare const ERROR_UNAUTHORIZED: ErrorResponse;
export declare const ERROR_FORBIDDEN: ErrorResponse;
export declare const ERROR_NOT_FOUND: ErrorResponse;

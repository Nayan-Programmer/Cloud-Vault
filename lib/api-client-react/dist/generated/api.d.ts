import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ErrorEnvelope, FileInput, FileItem, FileUpdate, FolderInput, HealthStatus, ListFilesParams, StorageStats, UploadUrlRequest, UploadUrlResponse } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListFilesUrl: (params?: ListFilesParams) => string;
/**
 * Returns files and folders for the current user. Filter by parentId to list contents of a folder.
 * @summary List files and folders
 */
export declare const listFiles: (params?: ListFilesParams, options?: RequestInit) => Promise<FileItem[]>;
export declare const getListFilesQueryKey: (params?: ListFilesParams) => readonly ["/api/files", ...ListFilesParams[]];
export declare const getListFilesQueryOptions: <TData = Awaited<ReturnType<typeof listFiles>>, TError = ErrorType<ErrorEnvelope>>(params?: ListFilesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFiles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFilesQueryResult = NonNullable<Awaited<ReturnType<typeof listFiles>>>;
export type ListFilesQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary List files and folders
 */
export declare function useListFiles<TData = Awaited<ReturnType<typeof listFiles>>, TError = ErrorType<ErrorEnvelope>>(params?: ListFilesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateFileUrl: () => string;
/**
 * Creates a file record after the file has been uploaded to object storage.
 * @summary Register a file after upload
 */
export declare const createFile: (fileInput: FileInput, options?: RequestInit) => Promise<FileItem>;
export declare const getCreateFileMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFile>>, TError, {
        data: BodyType<FileInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFile>>, TError, {
    data: BodyType<FileInput>;
}, TContext>;
export type CreateFileMutationResult = NonNullable<Awaited<ReturnType<typeof createFile>>>;
export type CreateFileMutationBody = BodyType<FileInput>;
export type CreateFileMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Register a file after upload
*/
export declare const useCreateFile: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFile>>, TError, {
        data: BodyType<FileInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFile>>, TError, {
    data: BodyType<FileInput>;
}, TContext>;
export declare const getGetStorageStatsUrl: () => string;
/**
 * Returns total files count, total size used, and recent files.
 * @summary Get storage stats for the current user
 */
export declare const getStorageStats: (options?: RequestInit) => Promise<StorageStats>;
export declare const getGetStorageStatsQueryKey: () => readonly ["/api/files/stats"];
export declare const getGetStorageStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStorageStats>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStorageStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStorageStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStorageStats>>>;
export type GetStorageStatsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get storage stats for the current user
 */
export declare function useGetStorageStats<TData = Awaited<ReturnType<typeof getStorageStats>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetFileUrl: (id: number) => string;
/**
 * @summary Get a file or folder by ID
 */
export declare const getFile: (id: number, options?: RequestInit) => Promise<FileItem>;
export declare const getGetFileQueryKey: (id: number) => readonly [`/api/files/${number}`];
export declare const getGetFileQueryOptions: <TData = Awaited<ReturnType<typeof getFile>>, TError = ErrorType<ErrorEnvelope>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFileQueryResult = NonNullable<Awaited<ReturnType<typeof getFile>>>;
export type GetFileQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get a file or folder by ID
 */
export declare function useGetFile<TData = Awaited<ReturnType<typeof getFile>>, TError = ErrorType<ErrorEnvelope>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateFileUrl: (id: number) => string;
/**
 * @summary Rename or move a file/folder
 */
export declare const updateFile: (id: number, fileUpdate: FileUpdate, options?: RequestInit) => Promise<FileItem>;
export declare const getUpdateFileMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFile>>, TError, {
        id: number;
        data: BodyType<FileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFile>>, TError, {
    id: number;
    data: BodyType<FileUpdate>;
}, TContext>;
export type UpdateFileMutationResult = NonNullable<Awaited<ReturnType<typeof updateFile>>>;
export type UpdateFileMutationBody = BodyType<FileUpdate>;
export type UpdateFileMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Rename or move a file/folder
*/
export declare const useUpdateFile: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFile>>, TError, {
        id: number;
        data: BodyType<FileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateFile>>, TError, {
    id: number;
    data: BodyType<FileUpdate>;
}, TContext>;
export declare const getDeleteFileUrl: (id: number) => string;
/**
 * @summary Delete a file or folder
 */
export declare const deleteFile: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteFileMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFile>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteFile>>, TError, {
    id: number;
}, TContext>;
export type DeleteFileMutationResult = NonNullable<Awaited<ReturnType<typeof deleteFile>>>;
export type DeleteFileMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Delete a file or folder
*/
export declare const useDeleteFile: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFile>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteFile>>, TError, {
    id: number;
}, TContext>;
export declare const getCreateFolderUrl: () => string;
/**
 * @summary Create a folder
 */
export declare const createFolder: (folderInput: FolderInput, options?: RequestInit) => Promise<FileItem>;
export declare const getCreateFolderMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFolder>>, TError, {
        data: BodyType<FolderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFolder>>, TError, {
    data: BodyType<FolderInput>;
}, TContext>;
export type CreateFolderMutationResult = NonNullable<Awaited<ReturnType<typeof createFolder>>>;
export type CreateFolderMutationBody = BodyType<FolderInput>;
export type CreateFolderMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Create a folder
*/
export declare const useCreateFolder: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFolder>>, TError, {
        data: BodyType<FolderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFolder>>, TError, {
    data: BodyType<FolderInput>;
}, TContext>;
export declare const getRequestUploadUrlUrl: () => string;
/**
 * @summary Request a presigned URL for file upload
 */
export declare const requestUploadUrl: (uploadUrlRequest: UploadUrlRequest, options?: RequestInit) => Promise<UploadUrlResponse>;
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Request a presigned URL for file upload
*/
export declare const useRequestUploadUrl: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export declare const getGetPublicObjectUrl: (filePath: string) => string;
/**
 * @summary Serve a public asset
 */
export declare const getPublicObject: (filePath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetPublicObjectQueryKey: (filePath: string) => readonly [`/api/storage/public-objects/${string}`];
export declare const getGetPublicObjectQueryOptions: <TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPublicObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getPublicObject>>>;
export type GetPublicObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve a public asset
 */
export declare function useGetPublicObject<TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStorageObjectUrl: (objectPath: string) => string;
/**
 * @summary Serve an object entity
 */
export declare const getStorageObject: (objectPath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetStorageObjectQueryKey: (objectPath: string) => readonly [`/api/storage/objects/${string}`];
export declare const getGetStorageObjectQueryOptions: <TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStorageObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getStorageObject>>>;
export type GetStorageObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve an object entity
 */
export declare function useGetStorageObject<TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map
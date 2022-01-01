export interface UploadFilesForOwnerRequest {
  ownerId: string;
  files: Array<{
    filename: string;
    buffer: Buffer;
    mimetype: string;
  }>;
}
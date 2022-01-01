export interface FilesUploadRequestDto {
  ownerId: string;
  files: Array<{ filename: string; buffer: Buffer; mimetype: string }>;
}

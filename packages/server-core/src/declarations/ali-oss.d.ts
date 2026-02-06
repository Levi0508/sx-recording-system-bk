declare module 'ali-oss' {
  interface Options {
    region: string;
    bucket: string;
    accessKeyId: string;
    accessKeySecret: string;
  }

  interface SignatureUrlOptions {
    method?: string;
    expires?: number;
    'Content-Type'?: string;
  }

  class OSS {
    constructor(options: Options);
    signatureUrl(objectName: string, options?: SignatureUrlOptions): string;
  }

  export default OSS;
}

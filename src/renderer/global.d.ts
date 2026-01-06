export {};

declare global {
  interface Window {
    electronAPI: {
      getFilePath: (file: File) => string;
      createDrafts: (files: any[]) => Promise<string>;
    };
  }
}

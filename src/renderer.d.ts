import { EmailFile } from './types';

export interface IElectronAPI {
  createDrafts: (files: EmailFile[]) => Promise<string>;
  getFilePath: (file: File) => string; // Add this line
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
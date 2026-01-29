export interface IElectronAPI {
  login: () => Promise<string>;
  logout: () => Promise<boolean>;
  isLoggedIn: () => Promise<boolean>;
  getFilePath: (file: File) => string;
  createDrafts: (drafts: any[]) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

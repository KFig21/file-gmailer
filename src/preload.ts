// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { EmailFile } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  createDrafts: (files: EmailFile[]) => ipcRenderer.invoke('create-drafts', files),
  // New helper function to securely get the path
  getFilePath: (file: File) => webUtils.getPathForFile(file),
});
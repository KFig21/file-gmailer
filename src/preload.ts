// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  login: () => ipcRenderer.invoke('google-login'),
  logout: () => ipcRenderer.invoke('google-logout'),
  isLoggedIn: () => ipcRenderer.invoke('google-is-logged-in'),
  createDrafts: (drafts) => ipcRenderer.invoke('create-drafts', drafts),
  getFilePath: (file) => webUtils.getPathForFile(file),
});
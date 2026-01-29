export interface FileEmailDraft {
  file: File;
  path: string; // The file path on the computer
  to: string;
  cc: string;
  subject: string;
  body: string;
}
export interface EmailFile {
  id: string;
  name: string;
  path: string; // The file path on the computer
  recipient: string;
  cc: string;
  subject: string;
  body: string;
}
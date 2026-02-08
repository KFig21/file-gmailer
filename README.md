# File-Gmailer

File-Gmailer is a desktop power-tool built with **Electron**, **React**, and **TypeScript**. It allows users to turn local files into Gmail drafts instantly. Designed for professionals who send many individual attachments, it streamlines the repetitive process of uploading, addressing, and formatting separate emails.

---

## Features

- **Bulk File Processing**  
  Upload up to **50 files** simultaneously via an intuitive drag-and-drop zone.

- **One-at-a-Time Focus**  
  A CSS `scroll-snap` layout ensures you focus on one draft at a time without visual clutter.

- **Privacy-First Architecture**  
  **No database.** Your files never touch any server except Google’s.  
  All processing happens entirely in your browser’s memory (RAM).

- **Sidebar Navigator**  
  An intuitive sidebar that tracks your scroll position and allows you to jump between drafts instantly.

- **Bulk Editing**  
  Bulk editing that lets you apply a single recipient, subject, or body to all uploaded files.

- **Rich Text Support**  
  Full HTML formatting within email bodies.

- **Smart MIME Encoding**  
  Automatically handles the conversion of binary files into Base64-encoded `multipart/mixed` email messages compatible with Gmail.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Electron](https://www.electronjs.org/) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Editor** | [Tiptap](https://tiptap.dev/) (Headless WYSIWYG) |
| **API** | [Gmail API v1](https://developers.google.com/gmail/api) |
| **Styling** | SASS (SCSS) + CSS Variables |
| **Authentication** | Google OAuth 2.0 |
| **Build Tool** | [Electron Forge](https://www.electronforge.io/) + Webpack |

---

## How It Functions

### 1. Data Handling

When files are dropped into the app, Electron’s webUtils retrieves the actual path from the local disk. These references are stored in a React state. Because the app runs locally, the data is highly responsive and secure.

---

### 2. Drafting Experience

The app uses a combination of:

- `scroll-snap-type`
- scroll position detection

As you scroll through drafts, the sidebar automatically updates its **active state** to show which file you are currently editing.

---

### 3. Desktop Authentication

The app handles authentication via the Electron Main Process. On first login, it triggers a local auth flow; once successful, it stores a token.json in your app's local user-data folder. This keeps you logged in across app restarts, unlike a web-based session.

---

### 4. The Gmail Bridge

When draft creation is triggered:

1. The Main Process reads the file directly from your hard drive using Node.js fs.

2. It constructs a MIME (RFC 2822) compliant message, including the Base64-encoded attachment.

3. The message is sent directly to Gmail's users.drafts.create endpoint.

---

## Security & Privacy
- Scoped Access: The app requests only gmail.compose permissions. It can create drafts but cannot read, delete, or modify your existing emails.

- Local Storage: Your OAuth tokens are stored only on your local machine in the system's protected app-data directory.

- Direct Communication: There is no "middle-man" server. The application acts as a direct client between your computer and Google.

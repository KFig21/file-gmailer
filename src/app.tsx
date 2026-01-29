import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FileEmailDraft } from './types';
import DraftEmail from './components/DraftEmail/DraftEmail';
import DraftNavigator from './components/DraftNavigator/DraftNavigator';
import EmailOptions from './components/EmailOptions/EmailOptions';
import FileDropzone from './components/FileDropzone/FileDropzone';
import HeaderSignInButton from './components/HeaderSignInButton/HeaderSignInButton';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher';
import { ThemeProvider } from './context/ThemeContext';
import './index.scss';

const App = () => {

  const [drafts, setDrafts] = useState<FileEmailDraft[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const MAX_DRAFTS = 50;

  // Handle authentication: LOGIN/LOGOUT functionality
  const handleAuthAction = async () => {
    if (isAuthenticated) {
      // LOGOUT LOGIC
      await window.electronAPI.logout();
      setIsAuthenticated(false);
      // Optional: Clear drafts on logout?
      // setDrafts([]); 
    } else {
      // LOGIN LOGIC
      setLoading(true);
      try {
        await window.electronAPI.login();
        setIsAuthenticated(true);
      } catch (err) {
        alert('Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  // Check if user is logged in
  useEffect(() => {
    window.electronAPI.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  // Add files to drafts
  const addFiles = (files: File[]) => {
    // 1. Calculate how many slots are left
    const availableSlots = MAX_DRAFTS - drafts.length;

    if (availableSlots <= 0) {
      alert('Maximum draft limit reached.');
      return;
    }

    // 2. Slice the incoming files if they exceed the limit
    let filesPROCESSED = files;
    if (files.length > availableSlots) {
      alert(`Only adding ${availableSlots} files to stay within the ${MAX_DRAFTS} limit.`);
      filesPROCESSED = files.slice(0, availableSlots);
    }

    const newDrafts = filesPROCESSED.map((file) => ({
      file, 
      path: window.electronAPI.getFilePath(file),
      to: '',
      cc: '',
      subject: '',
      body: '',
    }));

    setDrafts((prev) => [...prev, ...newDrafts]);
  };

  // Create all drafts in Gmail
  const createAllDrafts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await window.electronAPI.createDrafts(drafts);

      const shouldClear = window.confirm(
        `${result}\n\nDo you want to clear the drafts now?`
      );

      if (shouldClear) {
        setDrafts([]);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to create drafts: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Update a single draft
  const updateDraft = (index: number, updated: FileEmailDraft) => {
    setDrafts((prev) => prev.map((d, i) => (i === index ? updated : d)));
  };

  // Apply bulk changes to all drafts
  const handleApplyBulk = (patch: any) => {
    try {
      setDrafts((prev) => prev.map((d) => ({ ...d, ...patch })));
      return true; // Return true to indicate state update started successfully
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  
  // Delete a single draft
  const deleteDraft = (index: number) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete ALL drafts
  const DeleteAllDrafts = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all drafts? This cannot be undone.',
    );

    if (!confirmed) return;

    setDrafts([]);
    setCurrentIndex(0);
    draftRefs.current = [];
  };

  // Sidebar scrolling functionality
  const draftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToDraft = (index: number) => {
    setCurrentIndex(index);
    draftRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const handleScroll = () => {
    const visibleIndex = draftRefs.current.findIndex((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight / 2;
    });

    if (visibleIndex !== -1 && visibleIndex !== currentIndex) {
      setCurrentIndex(visibleIndex);
    }
  };

  return (
    <div className="main">
      {/* Header */}
      <div className="header">
        {/* left */}
        <div className="header-left">
          {/* Google sign-in button */}
          <HeaderSignInButton onAuthAction={handleAuthAction} isAuthenticated={isAuthenticated} />
        </div>

        {/* center */}
        <div className="title-container">
          <div className="title">File-Gmailer</div>
        </div>

        {/* right */}
        <div className="header-right">
          <ThemeSwitcher />
        </div>
      </div>
      <div className="content-wrapper">
        {/* SIDEBAR NAVIGATOR */}
        {drafts.length > 0 && (
          <DraftNavigator
            drafts={drafts}
            maxDrafts={MAX_DRAFTS}
            onSelect={scrollToDraft}
            activeIndex={currentIndex}
            createAllDrafts={createAllDrafts}
            onFilesAdded={addFiles}
            loading={loading}
          />
        )}

        {/*  content */}
        <div className="content" onScroll={handleScroll}>
          {/* Email options */}
          {drafts.length > 0 && (
            <EmailOptions
              onApply={handleApplyBulk}
              onClearAll={DeleteAllDrafts}
            />
          )}

          {/* Draft emails */}
          {drafts.length > 0 && (
            <div className={`emails-container`}>
              {drafts.map((draft, index) => (
                <DraftEmail
                  key={`${draft.file.name}-${index}`}
                  index={index}
                  draft={draft}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  innerRef={(el) => (draftRefs.current[index] = el)}
                  onChange={(updated) => updateDraft(index, updated)}
                  onDelete={() => deleteDraft(index)}
                />
              ))}
            </div>
          )}

          {/* dropzone */}
          {drafts.length == 0 && (
            <FileDropzone onFilesAdded={addFiles} isDrafts={drafts.length > 0} />
          )}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        {/* We removed GoogleOAuthProvider because Electron handles Auth in the Main process now */}
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}

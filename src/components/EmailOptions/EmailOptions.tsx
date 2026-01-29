// src/components/EmailOptions/EmailOptions.tsx
import { useEffect, useState } from 'react';
import { EditorContent } from '@tiptap/react';
import { useTiptapConfig } from '../../hooks/useTiptapConfig';
import { MenuBar } from '../Shared/MenuBar';
import CollapseToggle from '../../elements/collapseToggle/CollapseToggle';
import './styles.scss';

type BulkPatch = {
  to?: string;
  cc?: string;
  subject?: string;
  body?: string;
};

type Props = {
  onApply: (patch: BulkPatch) => boolean;
  onClearAll: () => void;
};

export default function EmailOptions({ onApply, onClearAll }: Props) {
  const [useSingleTo, setUseSingleTo] = useState(false);
  const [useSingleCc, setUseSingleCc] = useState(false);
  const [useSingleSubject, setUseSingleSubject] = useState(false);
  const [useSingleBody, setUseSingleBody] = useState(false);

  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [open, setOpen] = useState(false);

  // Initialize Tiptap for Bulk Options
  const editor = useTiptapConfig(body, (html) => setBody(html));

  // Flag to track if any bulk option fields are selected
  const noneSelected = !useSingleTo && !useSingleCc && !useSingleSubject && !useSingleBody;

  // Helper function to reset the bulk editor fields
  const resetBulkEditor = () => {
    setUseSingleTo(false);
    setUseSingleCc(false);
    setUseSingleSubject(false);
    setUseSingleBody(false);
    setTo('');
    setCc('');
    setSubject('');
    setBody('');
    editor?.commands.setContent('');
  };

  const apply = () => {
    const success = onApply({
      ...(useSingleTo && { to }),
      ...(useSingleCc && { cc }),
      ...(useSingleSubject && { subject }),
      ...(useSingleBody && { body }),
    });

    if (success) {
      // 2. Success/Failure window + asking to clear
      const shouldClear = window.confirm(
        "Bulk changes applied successfully!\n\nWould you like to clear the Bulk Options editor now?"
      );
      
      if (shouldClear) {
        resetBulkEditor();
      }
    } else {
      alert("Failed to apply bulk changes.");
    }
  };

  useEffect(() => {
    if (editor && body !== editor.getHTML()) {
      editor.commands.setContent(body || '', { emitUpdate: false });
    }
  }, [body, editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Example: Trigger on Meta (Cmd) + B or Ctrl + B
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        // Prevent the browser's default "Bold" action if necessary
        // e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="email-options-wrapper">
      <div className="email-options-container">
        <div className="email-options-header">
          <CollapseToggle isOpen={open} onClick={() => setOpen(!open)} />
          <div className="email-options-title">Bulk Options</div>
        </div>
        {/* form */}
        <div className={`email-options-form ${!open && 'closed'}`}>
          {/* TO */}
          <label className="option-row">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={useSingleTo}
                onChange={(e) => setUseSingleTo(e.target.checked)}
              />
              <span className="checkbox" />
            </label>
            <span className={`checkbox-label ${useSingleTo ? 'active' : 'inactive'}`}>Single recipient</span>
            <input
              type="email"
              placeholder="to@example.com"
              // disabled={!useSingleTo}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>

          {/* CC */}
          <label className="option-row">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={useSingleCc}
                onChange={(e) => setUseSingleCc(e.target.checked)}
              />
              <span className="checkbox" />
            </label>
            <span className={`checkbox-label ${useSingleCc ? 'active' : 'inactive'}`}>Single CC</span>
            <input
              type="email"
              placeholder="cc@example.com"
              // disabled={!useSingleCc}
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </label>

          {/* SUBJECT */}
          <label className="option-row">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={useSingleSubject}
                onChange={(e) => setUseSingleSubject(e.target.checked)}
              />
              <span className="checkbox" />
            </label>
            <span className={`checkbox-label ${useSingleSubject ? 'active' : 'inactive'}`}>Single Subject</span>
            <input
              type="text"
              placeholder="Subject line"
              // disabled={!useSingleSubject}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </label>

          {/* BODY */}
          <div className="option-row option-body">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={useSingleBody}
                onChange={(e) => setUseSingleBody(e.target.checked)}
              />
              <span className="checkbox" />
            </label>
            <span className={`checkbox-label ${useSingleBody ? 'active' : 'inactive'}`}>Single body</span>

            {/* Moved the editor OUTSIDE the label */}
            <div className={`tiptap-editor-container bulk`}>
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className="tiptap-content" />
            </div>
          </div>

          {/* apply button */}
          <label className="option-row">
            <label className="checkbox-wrapper"></label>
            <span className={`checkbox-label`}></span>
            <div className="apply-button-container">
              <button className={`apply-button ${noneSelected && 'disabled'}`} onClick={apply} disabled={noneSelected}>
                {noneSelected ? 'Select an option to apply' : 'Apply to all emails'}
              </button>
            </div>
          </label>

          {/* DELETE ALL DRAFTS BUTTON */}
          <div className="delete-all-drafts-container">
            <button onClick={() => onClearAll()}>Delete all drafts</button>
          </div>
        </div>
      </div>
    </div>
  );
}

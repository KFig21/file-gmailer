import type { FileEmailDraft } from '../../types';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import './styles.scss';
import { useEffect } from 'react';
import { EditorContent } from '@tiptap/react';
import { MenuBar } from '../Shared/MenuBar';
import { useTiptapConfig } from '../../hooks/useTiptapConfig';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  draft: FileEmailDraft;
  onChange: (draft: FileEmailDraft) => void;
  onDelete: () => void;
  innerRef?: React.Ref<HTMLDivElement>;
  index: number;
};

export default function DraftEmail({ draft, onChange, onDelete, innerRef, index }: Props) {
  const editor = useTiptapConfig(draft.body ?? '', (html) => {
    onChange({ ...draft, body: html });
  });

  // The useEffect for syncing remains the same to handle the 'Apply All' updates
  useEffect(() => {
    if (editor && draft.body !== editor.getHTML()) {
      editor.commands.setContent(draft.body || '', { emitUpdate: false });
    }
  }, [draft.body, editor]);

  return (
    <div className="email-wrapper" ref={innerRef} id={`draft-${index}`}>
      <div className={`email-container`}>
        {/* attachment name */}
        <div className="draft-header">
          <div className="email-container-attachment">
            <AttachFileIcon className="attachment-icon" />
            <div className="email-container-attachmen-name">{draft.file.name}</div>
          </div>
          {/* delete draft */}
          <div
            className="delete-draft-container"
            onClick={onDelete}
            role="button"
            aria-label="Delete draft"
          >
            <DeleteIcon className="trash-icon" />
          </div>
        </div>
        <div className={`draft-content`}>
          {/* TO input */}
          <div className="draft-input-wrapper">
            <div className="draft-input-name">To:</div>
            <input
              placeholder="name@mail.com"
              value={draft.to ?? ''}
              onChange={(e) => onChange({ ...draft, to: e.target.value })}
            />
          </div>

          {/* CC input */}
          <div className="draft-input-wrapper">
            <div className="draft-input-name">CC:</div>
            <input
              placeholder="another-name@mail.com"
              value={draft.cc ?? ''}
              onChange={(e) => onChange({ ...draft, cc: e.target.value })}
            />
          </div>

          {/* SUBJECT input */}

          <div className="draft-input-wrapper">
            <div className="draft-input-name">Subject:</div>
            <input
              placeholder="Urgent"
              value={draft.subject ?? ''}
              onChange={(e) => onChange({ ...draft, subject: e.target.value })}
            />
          </div>

          {/* BODY input */}
          <div className="tiptap-editor-container">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="tiptap-content" />
          </div>
        </div>
      </div>
    </div>
  );
}

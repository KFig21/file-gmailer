import { Editor } from '@tiptap/react';
// Import MUI Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import HighlightIcon from '@mui/icons-material/Highlight';
import CheckIcon from '@mui/icons-material/Check'; 
import CloseIcon from '@mui/icons-material/Close';


import './styles.scss';
import { useState } from 'react';

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isLinking, setIsLinking] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  if (!editor) return null;

  const openLinkMenu = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setIsLinking(true);
  };

  const applyLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setIsLinking(false);
    setLinkUrl('');
  };

  return (
    <div className="editor-toolbar">
      {/* --- HISTORY --- */}
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="toolbar-btn"
          title="Undo"
        >
          <UndoIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="toolbar-btn"
          title="Redo"
        >
          <RedoIcon fontSize="small" />
        </button>
      </div>

      <div className="divider" />

      {/* --- TEXT FORMATTING --- */}
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          title="Bold"
        >
          <FormatBoldIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          title="Italic"
        >
          <FormatItalicIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
          title="Underline"
        >
          <FormatUnderlinedIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
          title="Strikethrough"
        >
          <StrikethroughSIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`toolbar-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
          title="Highlight"
        >
          <HighlightIcon fontSize="small" />
        </button>
      </div>

      <div className="divider" />

      {/* --- ALIGNMENT --- */}
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
          title="Align Left"
        >
          <FormatAlignLeftIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
          title="Align Center"
        >
          <FormatAlignCenterIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
          title="Align Right"
        >
          <FormatAlignRightIcon fontSize="small" />
        </button>
      </div>

      <div className="divider" />

      {/* --- LISTS --- */}
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          title="Bullet List"
        >
          <FormatListBulletedIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          title="Numbered List"
        >
          <FormatListNumberedIcon fontSize="small" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          title="Quote"
        >
          <FormatQuoteIcon fontSize="small" />
        </button>
      </div>

      <div className="divider" />

      {/* --- INPUTS --- */}
      <div className="inputs-group">

        {isLinking ? (
          <div className="link-input-container">
            <input 
              type="text" 
              value={linkUrl} 
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && applyLink()}
              className="link-input"
            />
            <button onClick={applyLink} className="toolbar-btn success"><CheckIcon fontSize="small" /></button>
            <button onClick={() => setIsLinking(false)} className="toolbar-btn danger"><CloseIcon fontSize="small" /></button>
          </div>
        ) : (
          <>
        {/* Color */}
        <div className="color-wrapper">
          <input
            type="color"
            onInput={(event) =>
              editor
                .chain()
                .focus()
                .setColor((event.target as HTMLInputElement).value)
                .run()
            }
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="color-picker"
            title="Text Color"
          />
        </div>

        {/* Font Size */}
        <select
          onChange={(e) =>
            editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()
          }
          value={editor.getAttributes('textStyle').fontSize || '16px'}
          className="size-select"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="30px">30px</option>
        </select>

        {/* Link Button */}
        <button
          onClick={openLinkMenu}
          className={`toolbar-btn ${editor.isActive('link') ? 'is-active' : ''}`}
          title="Link"
        >
          <LinkIcon fontSize="small" />
        </button>

        {/* Unlink (only show if active) */}
        {editor.isActive('link') && (
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="toolbar-btn"
            title="Remove Link"
          >
            <LinkOffIcon fontSize="small" />
          </button>
        )}
        </>
        )}
      </div>
    </div>
  );
};

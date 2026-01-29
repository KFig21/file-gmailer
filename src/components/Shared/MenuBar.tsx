/* eslint-disable @typescript-eslint/no-explicit-any */
export const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        type="button"
      >
        <b>B</b>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        type="button"
      >
        <i>I</i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        type="button"
      >
        S
      </button>

      <div className="toolbar-divider"></div>

      {/* COLOR PICKER */}
      <input
        type="color"
        onInput={(event) =>
          editor
            .chain()
            .focus()
            .setColor((event.target as HTMLInputElement).value)
            .run()
        }
        value={editor.getAttributes('textStyle').color || '#ffffff'}
        className="color-picker"
      />

      {/* SIMPLE FONT SIZE (Small/Normal/Large) */}
      <select
        onChange={(e) => {
          const size = e.target.value;
          // This now matches the attribute name we defined in .extend()
          editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
        }}
        // Optional: This makes the dropdown reflect the current selection's size
        value={editor.getAttributes('textStyle').fontSize || '16px'}
        className="size-select"
      >
        <option value="12px">Small</option>
        <option value="16px">Normal</option>
        <option value="24px">Large</option>
        <option value="32px">Huge</option>
      </select>
    </div>
  );
};

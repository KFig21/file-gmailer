import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';

export const useTiptapConfig = (initialContent: string, onUpdate: (html: string) => void) => {
  return useEditor({
    extensions: [
      StarterKit,
      Color,
      TextStyle.extend({
        addAttributes() {
          return {
            fontSize: {
              default: null,
              parseHTML: (element) => element.style.fontSize,
              renderHTML: (attributes) => {
                if (!attributes.fontSize) return {};
                return { style: `font-size: ${attributes.fontSize}` };
              },
            },
          };
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });
};

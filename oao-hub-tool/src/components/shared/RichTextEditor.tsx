import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
  placeholder?: string
}

const ToolbarBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick() }}
    title={title}
    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
      active
        ? 'bg-primary-100 text-primary-700'
        : 'text-ink-500 hover:bg-surface-100 hover:text-ink-700'
    }`}
  >
    {children}
  </button>
)

const Divider = () => <div className="w-px bg-surface-200 mx-0.5 self-stretch" />

export function RichTextEditor({ value, onChange, disabled, placeholder }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary-600 underline' } }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  const applyLink = () => {
    if (!editor) return
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }

  if (!editor) return null

  return (
    <div className={`border border-surface-300 rounded-md overflow-hidden ${disabled ? 'opacity-60' : ''}`}>
      {!disabled && (
        <>
          <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-surface-200 bg-surface-50">
            {/* Text format */}
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
              <strong>B</strong>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
              <em>I</em>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
              <u>U</u>
            </ToolbarBtn>
            <Divider />

            {/* Headings — H1, H2, H3 theo PRD §3.2.2 */}
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">
              H1
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
              H2
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
              H3
            </ToolbarBtn>
            <Divider />

            {/* Lists */}
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
              • List
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
              1. List
            </ToolbarBtn>
            <Divider />

            {/* Text Alignment theo PRD §3.2.2 */}
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
              ⬛︎L
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
              ⬛︎C
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
              ⬛︎R
            </ToolbarBtn>
            <Divider />

            {/* Link theo PRD §3.2.2 */}
            <ToolbarBtn
              onClick={() => {
                if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run()
                } else {
                  const current = editor.getAttributes('link').href ?? ''
                  setLinkUrl(current)
                  setShowLinkInput(true)
                }
              }}
              active={editor.isActive('link')}
              title={editor.isActive('link') ? 'Remove link' : 'Add link'}
            >
              🔗
            </ToolbarBtn>
          </div>

          {/* Link input popup */}
          {showLinkInput && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-surface-200 bg-blue-50">
              <span className="text-xs text-ink-500 shrink-0">URL:</span>
              <input
                autoFocus
                className="form-input text-xs flex-1 py-1"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyLink(); if (e.key === 'Escape') setShowLinkInput(false) }}
                placeholder="https://..."
              />
              <button type="button" className="btn-primary text-xs py-1 px-2" onClick={applyLink}>Apply</button>
              <button type="button" className="btn-secondary text-xs py-1 px-2" onClick={() => setShowLinkInput(false)}>Hủy</button>
            </div>
          )}
        </>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 min-h-[120px] focus:outline-none text-ink-900"
        placeholder={placeholder}
      />
    </div>
  )
}

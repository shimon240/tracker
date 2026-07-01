import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagsInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export function TagsInput({ tags, onChange, suggestions = [], placeholder = 'Добавить тег...' }: TagsInputProps) {
  const [input, setInput] = useState('')

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag || tags.includes(tag)) return
    onChange([...tags, tag])
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter(t => t !== tag))
  }

  const filteredSuggestions = suggestions
    .filter(s => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-input-bg px-2 py-1.5 min-h-9 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:ring-offset-1 ds-transition">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-semibold text-indigo-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-indigo-900 ds-transition"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); addTag(input) }
            if (e.key === 'Backspace' && !input && tags.length > 0) removeTag(tags[tags.length - 1])
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle"
        />
      </div>

      {(filteredSuggestions.length > 0 || input.trim()) && (
        <div className="flex flex-wrap gap-1.5">
          {input.trim() && !tags.includes(input.trim()) && (
            <button
              type="button"
              onClick={() => addTag(input)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 ds-transition"
            >
              <Plus className="h-3 w-3" />
              {input.trim()}
            </button>
          )}
          {filteredSuggestions.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 ds-transition'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

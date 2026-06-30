import { useState, type KeyboardEvent } from 'react'
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
    const value = raw.trim()
    if (!value) return
    if (tags.some(t => t.toLowerCase() === value.toLowerCase())) {
      setInput('')
      return
    }
    onChange([...tags, value])
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter(t => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const filteredSuggestions = suggestions.filter(
    s => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()) && input.length > 0
  )

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1.5 min-h-9 focus-within:ring-1 focus-within:ring-blue-500">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-blue-900"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filteredSuggestions.slice(0, 5).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors'
              )}
            >
              <Plus className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

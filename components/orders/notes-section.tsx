"use client"

import { useState } from "react"
import MaterialIcon from "@/components/ui/material-icon"
import { Button } from "@/components/ui/button"
type Note = { id: string; text: string; createdAt: string; author: string }

type Props = {
  notes: Note[]
  onAddNote: (text: string) => void
}

export function NotesSection({ notes, onAddNote }: Props) {
  const [noteText, setNoteText] = useState("")

  const handleSubmit = () => {
    if (!noteText.trim()) return
    onAddNote(noteText.trim())
    setNoteText("")
  }

  return (
    <div className="bg-popover rounded-xl p-8 border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MaterialIcon name="sticky_note_2" size={18} color="var(--muted-foreground)" />
          <h4 className="font-bold text-sm text-foreground">Internal Admin Notes</h4>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
      </div>
      {notes.length > 0 && (
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="bg-silver-two p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-muted-foreground">{note.author}</span>
                <span className="text-[9px] text-muted-foreground/60">{note.createdAt}</span>
              </div>
              <p className="text-sm text-foreground">{note.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex space-x-2">
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Add a note..."
          className="flex-1 bg-silver-two border-border rounded-lg px-4 py-2.5 text-sm focus-visible:ring-secondary/20 focus-visible:border-secondary outline-none"
        />
        <Button variant="default" size="default" onClick={handleSubmit} disabled={!noteText.trim()}>
          <MaterialIcon name="send" size={16} color="var(--primary-foreground)" />
        </Button>
      </div>
    </div>
  )
}

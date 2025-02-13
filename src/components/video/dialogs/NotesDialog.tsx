import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTime } from '@/utils/timeUtils';
import { Pencil, X } from 'lucide-react';

interface NotesDialogProps {
  notes: any[];
  noteContent: string;
  setNoteContent: (content: string) => void;
  handleAddNote: () => Promise<void>;
  handleDeleteNote: (noteId: string) => Promise<void>;
  loadNotes: () => Promise<void>;
}

export const NotesDialog = ({
  notes,
  noteContent,
  setNoteContent,
  handleAddNote,
  handleDeleteNote,
  loadNotes
}: NotesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => {
            loadNotes();
            setIsOpen(true);
          }}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notas del Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Escribe tu nota..."
              className="flex-1"
            />
            <Button onClick={handleAddNote}>
              Añadir
            </Button>
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {notes.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No hay notas aún
              </p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start justify-between gap-2 rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatTime(note.timestamp)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {note.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
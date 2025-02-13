import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTime } from '@/utils/timeUtils';
import { Bookmark, X } from 'lucide-react';

interface BookmarksDialogProps {
  bookmarks: any[];
  getCurrentTime: () => number;
  handleAddBookmark: () => Promise<void>;
  handleDeleteBookmark: (bookmarkId: string) => Promise<void>;
  loadBookmarks: () => Promise<void>;
}

export const BookmarksDialog = ({
  bookmarks,
  getCurrentTime,
  handleAddBookmark,
  handleDeleteBookmark,
  loadBookmarks
}: BookmarksDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => {
            loadBookmarks();
            setIsOpen(true);
          }}
        >
          <Bookmark className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Marcadores del Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={handleAddBookmark} className="w-full">
            Añadir Marcador en {formatTime(Math.floor(getCurrentTime()))}
          </Button>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {bookmarks.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No hay marcadores aún
              </p>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-center justify-between gap-2 rounded-lg border p-3"
                  >
                    <p className="text-sm font-medium">
                      {formatTime(bookmark.timestamp)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBookmark(bookmark.id)}
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
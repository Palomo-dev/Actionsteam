import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VideoEventType } from '@/types/video';
import { useState } from 'react';
import { NotesDialog } from './dialogs/NotesDialog';
import { BookmarksDialog } from './dialogs/BookmarksDialog';

interface VideoActionsProps {
  user: any;
  courseId?: string;
  sessionId?: string;
  getCurrentTime: () => number;
  duration: number;
  trackVideoEvent: (eventType: VideoEventType, videoTime: number, videoDuration: number, metadata?: any) => void;
}

export const useVideoActions = ({
  user,
  courseId,
  sessionId,
  getCurrentTime,
  duration,
  trackVideoEvent
}: VideoActionsProps) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [noteContent, setNoteContent] = useState('');

  const loadNotes = async () => {
    if (!user || !courseId || !sessionId) return;

    try {
      const { data, error } = await supabase
        .from('video_notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('No se pudieron cargar las notas');
    }
  };

  const loadBookmarks = async () => {
    if (!user || !courseId || !sessionId) return;

    try {
      const { data, error } = await supabase
        .from('video_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast.error('No se pudieron cargar los marcadores');
    }
  };

  const handleAddBookmark = async () => {
    if (!user || !courseId || !sessionId) {
      toast.error('Debes iniciar sesión para añadir marcadores');
      return;
    }

    const currentTime = Math.floor(getCurrentTime());

    try {
      const { error } = await supabase
        .from('video_bookmarks')
        .insert({
          user_id: user.id,
          course_id: courseId,
          session_id: sessionId,
          timestamp: currentTime,
        });

      if (error) throw error;

      toast.success('Marcador añadido correctamente');
      loadBookmarks();
      trackVideoEvent('bookmark_added', currentTime, duration, {
        action: 'bookmark_added',
        timestamp: currentTime
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error('No se pudo añadir el marcador');
    }
  };

  const handleAddNote = async () => {
    if (!user || !courseId || !sessionId || !noteContent.trim()) {
      toast.error('Debes escribir una nota');
      return;
    }

    const currentTime = Math.floor(getCurrentTime());

    try {
      const { error } = await supabase
        .from('video_notes')
        .insert({
          user_id: user.id,
          course_id: courseId,
          session_id: sessionId,
          timestamp: currentTime,
          content: noteContent.trim(),
        });

      if (error) throw error;

      setNoteContent('');
      toast.success('Nota añadida correctamente');
      loadNotes();
      trackVideoEvent('note_added', currentTime, duration, {
        action: 'note_added',
        timestamp: currentTime
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('No se pudo añadir la nota');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('video_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast.success('Nota eliminada correctamente');
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('No se pudo eliminar la nota');
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('video_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      toast.success('Marcador eliminado correctamente');
      loadBookmarks();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast.error('No se pudo eliminar el marcador');
    }
  };

  const handleQualityChange = (quality: string) => {
    const currentTime = getCurrentTime();
    trackVideoEvent('quality_change', currentTime, duration, {
      new_quality: quality
    });
  };

  return {
    NotesDialog: () => (
      <NotesDialog
        notes={notes}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        handleAddNote={handleAddNote}
        handleDeleteNote={handleDeleteNote}
        loadNotes={loadNotes}
      />
    ),
    BookmarksDialog: () => (
      <BookmarksDialog
        bookmarks={bookmarks}
        getCurrentTime={getCurrentTime}
        handleAddBookmark={handleAddBookmark}
        handleDeleteBookmark={handleDeleteBookmark}
        loadBookmarks={loadBookmarks}
      />
    ),
    handleAddBookmark,
    handleAddNote,
    handleQualityChange
  };
};
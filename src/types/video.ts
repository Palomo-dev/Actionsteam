export type VideoEventType = 
  | 'play' 
  | 'pause' 
  | 'seek' 
  | 'buffer' 
  | 'quality_change' 
  | 'error' 
  | 'complete'
  | 'bookmark_added'
  | 'note_added';

export interface VideoEvent {
  eventType: VideoEventType;
  videoTime: number;
  videoDuration: number;
  metadata?: Record<string, any>;
}
export type StudySession = {
  id: string;
  user_id: string;
  course_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  created_at?: string;
  course?: {
    title: string;
    slug: string;
    progress?: number;
  };
};

export type HeatmapDataPoint = {
  hour: number;
  day: number;
  value: number; // Duration in seconds
};

export type CourseTimeData = {
  [key: string]: number; // Duration in seconds
};
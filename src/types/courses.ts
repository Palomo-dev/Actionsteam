export type CourseSessionType = {
  id?: string;
  title: string;
  description: string;
  duration_seconds?: number;
  videoFile?: File | null;
  documentationFile?: File | null;
  video_url?: string | null;
  documentation_url?: string | null;
};

export type CourseEvaluationType = {
  id?: string;
  question: string;
  options: string[];
  correctOption: number;
};

export type CourseFormData = {
  title: string;
  description: string;
  duration?: number;
  launchDate?: Date;
  isPublished?: boolean;
  banner?: File | null;
  inductionVideo?: File | null;
  banner_url?: string;
  induction_video_url?: string;
  sessions?: CourseSessionType[];
  evaluations?: CourseEvaluationType[];
  level?: string;
  categories?: string[];
  tags?: string[];
  instructorId?: string;
  price_cop?: number;
  original_price_cop?: number;
  discount_percentage?: number;
};

export type CourseRatingType = {
  rating: number;
  comment?: string;
  user_id: string;
  created_at: string;
};

export type CourseType = {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  banner_url?: string;
  induction_video_url?: string;
  duration?: number;
  price_cop?: number;
  level?: string;
  instructor_id?: string;
  is_published?: boolean;
  launch_date?: string;
  course_ratings?: CourseRatingType[];
  course_sessions?: CourseSessionType[];
  course_evaluations?: CourseEvaluationType[];
  course_tag_relations?: any[];
  course_category_relations?: any[];
  stripe_price_id?: string;
  stripe_product_id?: string;
};
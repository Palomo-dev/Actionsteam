import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/utils/fileUpload";
import { CourseFormData, CourseSessionType, CourseEvaluationType } from "@/types/courses";

export const createCourse = async (data: CourseFormData) => {
  try {
    console.log("Creating course with data:", data);

    // Validate required fields
    if (!data.title?.trim()) {
      throw new Error('El título del curso es requerido');
    }

    let bannerUrl = null;
    let inductionVideoUrl = null;

    if (data.banner instanceof File) {
      bannerUrl = await uploadFile(data.banner, 'course-banner');
    }

    if (data.inductionVideo instanceof File) {
      inductionVideoUrl = await uploadFile(data.inductionVideo, 'course-induction');
    }

    // Create the product in Stripe with validated data
    console.log('Creating Stripe product with title:', data.title);
    const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-stripe-product', {
      body: {
        title: data.title.trim(),
        description: data.description?.trim() || data.title.trim(),
        price_cop: data.price_cop || 0,
      },
    });

    if (stripeError) {
      console.error('Error creating Stripe product:', stripeError);
      throw new Error('Error al crear el producto en Stripe: ' + stripeError.message);
    }

    if (!stripeData?.productId || !stripeData?.priceId) {
      console.error('Invalid Stripe response:', stripeData);
      throw new Error('Error al crear el producto en Stripe: respuesta inválida');
    }

    // Create the course in Supabase
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: data.title.trim(),
        description: data.description?.trim(),
        banner_url: bannerUrl,
        induction_video_url: inductionVideoUrl,
        duration: data.duration || 0,
        price_cop: data.price_cop || 0,
        original_price_cop: data.original_price_cop || 0,
        discount_percentage: data.discount_percentage || 0,
        launch_date: data.launchDate?.toISOString(),
        slug: data.title.toLowerCase().replace(/ /g, '-'),
        stripe_product_id: stripeData.productId,
        stripe_price_id: stripeData.priceId,
        is_published: data.isPublished || false,
        instructor_id: data.instructorId || null,
        level: data.level || 'beginner'
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error creating course in Supabase:', courseError);
      throw courseError;
    }

    console.log("Course created successfully:", course);

    // Create course sessions if they exist
    if (data.sessions && data.sessions.length > 0) {
      console.log("Creating course sessions:", data.sessions);
      
      for (let i = 0; i < data.sessions.length; i++) {
        const session = data.sessions[i];
        const sessionData: any = {
          course_id: course.id,
          title: session.title,
          description: session.description,
          order_index: i,
          duration_seconds: session.duration_seconds || 0,
        };

        // Handle video file upload
        if (session.videoFile instanceof File) {
          const videoPath = `${course.id}/sessions/${i}/video-${Date.now()}.${session.videoFile.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage
            .from("course_files")
            .upload(videoPath, session.videoFile);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl: videoUrl } } = supabase.storage
            .from("course_files")
            .getPublicUrl(videoPath);
            
          sessionData.video_url = videoUrl;
        }

        // Handle documentation file upload
        if (session.documentationFile instanceof File) {
          const docPath = `${course.id}/sessions/${i}/doc-${Date.now()}.${session.documentationFile.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage
            .from("course_files")
            .upload(docPath, session.documentationFile);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl: docUrl } } = supabase.storage
            .from("course_files")
            .getPublicUrl(docPath);
            
          sessionData.documentation_url = docUrl;
        }

        const { error: sessionError } = await supabase
          .from('course_sessions')
          .insert(sessionData);

        if (sessionError) {
          console.error('Error creating session:', sessionError);
          throw sessionError;
        }
      }
    }

    // Create course evaluations if they exist
    if (data.evaluations && data.evaluations.length > 0) {
      console.log("Creating course evaluations:", data.evaluations);
      
      const evaluationsToInsert = data.evaluations.map(evaluation => ({
        course_id: course.id,
        question: evaluation.question,
        options: evaluation.options || [],
        correct_option: evaluation.correctOption ?? 0
      }));

      const { error: evalError } = await supabase
        .from('course_evaluations')
        .insert(evaluationsToInsert);

      if (evalError) {
        console.error('Error creating evaluations:', evalError);
        throw evalError;
      }
    }

    // Create category relations if categories exist
    if (data.categories && data.categories.length > 0) {
      console.log("Creating category relations:", data.categories);
      
      const categoryRelations = data.categories.map(categoryId => ({
        course_id: course.id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('course_category_relations')
        .insert(categoryRelations);

      if (categoryError) {
        console.error('Error creating category relations:', categoryError);
        throw categoryError;
      }
    }

    // Create tag relations if tags exist
    if (data.tags && data.tags.length > 0) {
      console.log("Creating tag relations:", data.tags);
      
      const tagRelations = data.tags.map(tagId => ({
        course_id: course.id,
        tag_id: tagId
      }));

      const { error: tagError } = await supabase
        .from('course_tag_relations')
        .insert(tagRelations);

      if (tagError) {
        console.error('Error creating tag relations:', tagError);
        throw tagError;
      }
    }

    return course;
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
};
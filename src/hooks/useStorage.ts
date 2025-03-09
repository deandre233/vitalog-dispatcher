
import { supabase } from "@/integrations/supabase/client";

export const createBucketIfNotExists = async (bucketName: string, isPublic: boolean = true) => {
  // First check if the bucket exists
  const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
  
  if (getBucketsError) {
    console.error("Error listing buckets:", getBucketsError);
    return { success: false, error: getBucketsError };
  }
  
  // Check if our bucket exists
  const bucketExists = buckets.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
      return { success: false, error };
    }
    
    console.log(`Bucket ${bucketName} created successfully`);
    return { success: true, data };
  }
  
  return { success: true, message: `Bucket ${bucketName} already exists` };
};

// Invoke this function when your app loads
createBucketIfNotExists('documents').then((result) => {
  if (result.success) {
    console.log("Document storage is ready");
  } else {
    console.error("Failed to set up document storage:", result.error);
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmployeeData {
  id: string;
  first_name: string;
  last_name: string;
  shifts?: any[];
  certifications?: any[];
  achievements?: any[];
}

interface NotificationRequest {
  employeeId?: string;
  notificationType?: 'achievement' | 'shift' | 'certification' | 'ai_insight';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let requestData: NotificationRequest = {};
    
    // If it's a POST request, parse the request body
    if (req.method === 'POST') {
      requestData = await req.json();
    }
    
    const { employeeId, notificationType } = requestData;
    
    // If employeeId is provided, generate notifications for that employee
    // Otherwise generate for all employees
    const employeeQuery = supabaseClient
      .from('employees')
      .select('id, first_name, last_name');
      
    if (employeeId) {
      employeeQuery.eq('id', employeeId);
    }
    
    const { data: employees, error } = await employeeQuery;
    
    if (error) {
      throw error;
    }
    
    if (!employees || employees.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No employees found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const notificationsGenerated = [];
    
    // Generate notifications for each employee
    for (const employee of employees) {
      const employeeData = await fetchEmployeeData(supabaseClient, employee.id);
      
      // Generate different types of notifications based on the request or generate all types
      if (!notificationType || notificationType === 'achievement') {
        const achievementNotifications = await generateAchievementNotifications(supabaseClient, employeeData);
        notificationsGenerated.push(...achievementNotifications);
      }
      
      if (!notificationType || notificationType === 'shift') {
        const shiftNotifications = await generateShiftNotifications(supabaseClient, employeeData);
        notificationsGenerated.push(...shiftNotifications);
      }
      
      if (!notificationType || notificationType === 'certification') {
        const certificationNotifications = await generateCertificationNotifications(supabaseClient, employeeData);
        notificationsGenerated.push(...certificationNotifications);
      }
      
      if (!notificationType || notificationType === 'ai_insight') {
        const aiInsights = await generateAIInsights(supabaseClient, employeeData);
        notificationsGenerated.push(...aiInsights);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications: notificationsGenerated 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function fetchEmployeeData(supabaseClient: any, employeeId: string): Promise<EmployeeData> {
  // Fetch basic employee data
  const { data: employee, error } = await supabaseClient
    .from('employees')
    .select('id, first_name, last_name')
    .eq('id', employeeId)
    .single();
    
  if (error) {
    throw error;
  }
  
  // Fetch recent shifts
  const { data: shifts } = await supabaseClient
    .from('shift_records')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false })
    .limit(10);
  
  // Fetch certifications
  const { data: certifications } = await supabaseClient
    .from('employee_certifications')
    .select('*')
    .eq('employee_id', employeeId)
    .order('expiration_date', { ascending: true });
    
  // Fetch achievements
  const { data: achievements } = await supabaseClient
    .from('employee_achievements')
    .select('*')
    .eq('employee_id', employeeId);
    
  return {
    ...employee,
    shifts: shifts || [],
    certifications: certifications || [],
    achievements: achievements || []
  };
}

async function generateAchievementNotifications(supabaseClient: any, employee: EmployeeData) {
  const notifications = [];
  
  // Check if the employee is close to achieving something
  const { data: achievementProgress } = await supabaseClient
    .from('employee_achievement_progress')
    .select('*')
    .eq('employee_id', employee.id)
    .gte('progress_percentage', 80)
    .lt('progress_percentage', 100);
    
  if (achievementProgress && achievementProgress.length > 0) {
    for (const progress of achievementProgress) {
      // Check if we already sent a notification for this achievement recently
      const { data: existingNotifications } = await supabaseClient
        .from('employee_notifications')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('type', 'achievement')
        .ilike('title', `%${progress.achievement_name}%`)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        
      if (existingNotifications && existingNotifications.length > 0) {
        continue; // Skip if we already sent a notification recently
      }
      
      const notification = {
        employee_id: employee.id,
        title: 'Achievement Progress',
        message: `You're ${progress.progress_percentage}% of the way to earning the "${progress.achievement_name}" achievement!`,
        type: 'achievement',
        is_read: false,
        ai_metadata: {
          id: crypto.randomUUID(),
          type: 'achievement_progress',
          prediction: `At your current rate, you'll complete this achievement in approximately ${Math.ceil((100 - progress.progress_percentage) / 5)} days.`,
          confidence_score: 0.85,
          metadata: progress,
          created_at: new Date().toISOString(),
          recommendation: 'Keep up the good work and you\'ll earn this achievement soon!'
        }
      };
      
      const { error } = await supabaseClient
        .from('employee_notifications')
        .insert(notification);
        
      if (!error) {
        notifications.push(notification);
      }
    }
  }
  
  return notifications;
}

async function generateShiftNotifications(supabaseClient: any, employee: EmployeeData) {
  const notifications = [];
  
  // Check for upcoming shifts
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
  
  const { data: upcomingShifts } = await supabaseClient
    .from('shift_records')
    .select('*')
    .eq('employee_id', employee.id)
    .gte('shift_date', tomorrow.toISOString())
    .lt('shift_date', dayAfterTomorrow.toISOString());
    
  if (upcomingShifts && upcomingShifts.length > 0) {
    for (const shift of upcomingShifts) {
      // Check if we already sent a notification for this shift
      const { data: existingNotifications } = await supabaseClient
        .from('employee_notifications')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('type', 'info')
        .ilike('message', `%${new Date(shift.shift_date).toLocaleDateString()}%`)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
      if (existingNotifications && existingNotifications.length > 0) {
        continue; // Skip if we already sent a notification recently
      }
      
      const shiftTime = shift.start_time 
        ? new Date(shift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'scheduled time';
        
      const notification = {
        employee_id: employee.id,
        title: 'Upcoming Shift Reminder',
        message: `You have a shift tomorrow (${new Date(shift.shift_date).toLocaleDateString()}) at ${shiftTime}.`,
        type: 'info',
        is_read: false
      };
      
      const { error } = await supabaseClient
        .from('employee_notifications')
        .insert(notification);
        
      if (!error) {
        notifications.push(notification);
      }
    }
  }
  
  return notifications;
}

async function generateCertificationNotifications(supabaseClient: any, employee: EmployeeData) {
  const notifications = [];
  
  // Check for certifications expiring soon
  if (employee.certifications && employee.certifications.length > 0) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringCertifications = employee.certifications.filter(cert => {
      const expirationDate = new Date(cert.expiration_date);
      return expirationDate <= thirtyDaysFromNow && expirationDate >= new Date();
    });
    
    for (const cert of expiringCertifications) {
      // Check if we already sent a notification for this certification recently
      const { data: existingNotifications } = await supabaseClient
        .from('employee_notifications')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('type', 'warning')
        .ilike('message', `%${cert.certification_name}%`)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        
      if (existingNotifications && existingNotifications.length > 0) {
        continue; // Skip if we already sent a notification recently
      }
      
      const daysToExpiration = Math.ceil((new Date(cert.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      const notification = {
        employee_id: employee.id,
        title: 'Certification Expiring Soon',
        message: `Your ${cert.certification_name} certification expires in ${daysToExpiration} days.`,
        type: 'warning',
        is_read: false
      };
      
      const { error } = await supabaseClient
        .from('employee_notifications')
        .insert(notification);
        
      if (!error) {
        notifications.push(notification);
      }
    }
  }
  
  return notifications;
}

async function generateAIInsights(supabaseClient: any, employee: EmployeeData) {
  const notifications = [];
  
  // Generate AI insights based on employee data
  // This is a simplified example - in a real-world application, this could use more sophisticated AI analysis
  
  // Example: Performance pattern insights
  if (employee.shifts && employee.shifts.length >= 5) {
    // Calculate shift performance metrics
    let totalPerformance = 0;
    let hasPerformanceMetrics = false;
    
    for (const shift of employee.shifts) {
      if (shift.performance_metrics?.safety_score) {
        totalPerformance += shift.performance_metrics.safety_score;
        hasPerformanceMetrics = true;
      }
    }
    
    if (hasPerformanceMetrics) {
      const averagePerformance = totalPerformance / employee.shifts.length;
      
      if (averagePerformance > 85) {
        const notification = {
          employee_id: employee.id,
          title: 'AI Performance Insight',
          message: `Great job! Your average safety score of ${averagePerformance.toFixed(1)} is excellent.`,
          type: 'success',
          is_read: false,
          ai_metadata: {
            id: crypto.randomUUID(),
            type: 'performance_insight',
            prediction: 'Continued high performance may qualify you for additional recognition.',
            confidence_score: 0.9,
            metadata: { average_score: averagePerformance },
            created_at: new Date().toISOString(),
            recommendation: 'Consider mentoring colleagues to share your best practices.'
          }
        };
        
        const { error } = await supabaseClient
          .from('employee_notifications')
          .insert(notification);
          
        if (!error) {
          notifications.push(notification);
        }
      } else if (averagePerformance < 70) {
        const notification = {
          employee_id: employee.id,
          title: 'AI Performance Insight',
          message: 'Our AI has identified opportunities to improve your safety scores.',
          type: 'info',
          is_read: false,
          ai_metadata: {
            id: crypto.randomUUID(),
            type: 'performance_insight',
            prediction: 'Focused training could improve your scores by 15-20% within 2 months.',
            confidence_score: 0.8,
            metadata: { average_score: averagePerformance },
            created_at: new Date().toISOString(),
            recommendation: 'Schedule time to review safety protocols and consider additional training.'
          }
        };
        
        const { error } = await supabaseClient
          .from('employee_notifications')
          .insert(notification);
          
        if (!error) {
          notifications.push(notification);
        }
      }
    }
  }
  
  return notifications;
}

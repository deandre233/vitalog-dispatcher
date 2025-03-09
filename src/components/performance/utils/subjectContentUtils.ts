
import { SubjectSpecificContent } from "../types/performanceTypes";

export const getSubjectSpecificContent = (subject: string, score: number, category: string): SubjectSpecificContent => {
  const isBelowAvg = score < 80;
  const isAverage = score >= 80 && score < 90;
  const isAboveAvg = score >= 90;
  
  let content = {
    concern: `Your performance in ${category.toLowerCase()} is below expected standards.`,
    expectations: "1. Increase your score to at least 85 points within 60 days\n2. Review department protocols related to this area\n3. Bi-weekly check-ins with your supervisor",
    observation: `Your performance in ${category.toLowerCase()} meets minimum standards but has room for improvement.`,
    recommendations: "1. Target increasing your score to 90+ points\n2. Consider additional training opportunities\n3. Monthly review of your progress in this area",
    recognition: `Your performance in ${category.toLowerCase()} exceeds organizational standards.`,
    growthOpportunities: "1. Consider mentoring other team members in this area\n2. Explore advanced training to further enhance your skills\n3. Participate in developing department best practices"
  };
  
  switch (subject) {
    case "missed-punches":
      if (isBelowAvg) {
        content.concern = `You have had ${Math.floor(10 - score/10)} missed time clock punches in the past 30 days. This pattern of missed punches creates payroll inaccuracies and administrative burden.`;
        content.expectations = "1. Zero missed punches for the next 30 days\n2. Set reminders on your mobile device for shift start/end\n3. Contact supervisor immediately if you forget to punch in/out";
      } else if (isAverage) {
        content.observation = `You've had ${Math.floor(5 - score/20)} missed time clock punches in the past 30 days. While this is close to department average, there's room for improvement.`;
        content.recommendations = "1. Set up mobile alerts 5 minutes before shift start/end\n2. Practice consistent punch-in/out routine\n3. Review your timecard weekly to catch any issues";
      } else {
        content.recognition = "You've maintained excellent time clock punch compliance with perfect or near-perfect punch record.";
        content.growthOpportunities = "1. Share your time management strategies with new employees\n2. Consider helping with timecard auditing processes\n3. Maintain your excellent compliance record";
      }
      break;
      
    case "tardiness":
      if (isBelowAvg) {
        content.concern = `You've arrived late to ${Math.floor(10 - score/10)} shifts in the past 30 days. Tardiness impacts crew readiness, vehicle checkout procedures, and overall operational efficiency.`;
        content.expectations = "1. Arrive 10 minutes before shift start for the next 15 shifts\n2. Develop a backup transportation plan\n3. Notify supervisor in advance if delay is unavoidable";
      } else if (isAverage) {
        content.observation = `You've had ${Math.floor(4 - score/20)} late arrivals in the past 30 days. While occasional tardiness happens, consistent punctuality is important.`;
        content.recommendations = "1. Plan to arrive 15 minutes before shift start\n2. Identify factors that may contribute to delays\n3. Consider adjusting your pre-work routine";
      } else {
        content.recognition = "Your punctuality record is excellent with consistent on-time or early arrivals to shifts.";
        content.growthOpportunities = "1. Maintain your excellent punctuality record\n2. Consider mentoring others who struggle with time management\n3. Share your pre-shift preparation strategies";
      }
      break;
      
    case "inservice":
      if (isBelowAvg) {
        content.concern = `You've missed ${Math.floor(3 - score/30)} required inservice training sessions this quarter. This affects your continuing education requirements and department compliance.`;
        content.expectations = "1. Attend all remaining inservice sessions this quarter\n2. Complete make-up sessions for missed trainings\n3. Provide advance notice if unable to attend scheduled training";
      } else if (isAverage) {
        content.observation = `Your inservice attendance is generally good but you missed ${Math.floor(2 - score/45)} session this quarter. Consistent attendance ensures you stay current with protocols and education requirements.`;
        content.recommendations = "1. Review the quarterly inservice schedule and block time on your calendar\n2. Consider signing up for extra sessions when available\n3. Utilize online options when in-person attendance is difficult";
      } else {
        content.recognition = "Your inservice attendance is excellent with 100% attendance record this quarter.";
        content.growthOpportunities = "1. Consider pursuing additional certification opportunities\n2. Volunteer to help develop or present training materials\n3. Identify advanced education topics that interest you";
      }
      break;
      
    case "pcr-completion":
      if (isBelowAvg) {
        content.concern = `Your PCR completion rate within 24 hours is at ${score}%, significantly below department standard of 90%. Delayed documentation affects billing, QA processes, and continuity of care.`;
        content.expectations = "1. Complete all PCRs before end of shift when possible\n2. Achieve 90%+ on-time completion within 30 days\n3. Allocate specific time after each call for documentation";
      } else if (isAverage) {
        content.observation = `Your PCR completion rate of ${score}% is near department average but below our target of 95%. Timely documentation is crucial for billing and clinical continuity.`;
        content.recommendations = "1. Develop strategies to complete PCRs immediately after calls\n2. Set aside 10 minutes at end of shift for PCR review\n3. Utilize mobile documentation when appropriate";
      } else {
        content.recognition = `Your PCR completion rate of ${score}% exceeds department standards, demonstrating excellent documentation habits.`;
        content.growthOpportunities = "1. Share your documentation efficiency strategies with peers\n2. Consider participating in PCR quality improvement initiatives\n3. Explore advanced documentation techniques";
      }
      break;
      
    case "pcr-quality":
      if (isBelowAvg) {
        content.concern = `Your PCR quality score of ${score}% is below department standards. Recent QA reviews identified issues with narrative completeness, vital signs documentation, and medical decision making documentation.`;
        content.expectations = "1. Schedule a review session with the QA manager\n2. Review PCR writing guidelines and department templates\n3. Submit 5 PCRs for pre-review in the next 30 days";
      } else if (isAverage) {
        content.observation = `Your PCR quality score of ${score}% meets basic standards but has room for improvement in narrative detail, differential diagnosis documentation, and intervention rationale.`;
        content.recommendations = "1. Review examples of high-quality PCRs\n2. Focus on improving your narrative structure and detail\n3. Document clear medical decision making rationales";
      } else {
        content.recognition = `Your PCR quality score of ${score}% demonstrates excellent documentation practices, with thorough narratives and clear medical decision making.`;
        content.growthOpportunities = "1. Consider participating in documentation training for new employees\n2. Submit examples of your PCRs for teaching purposes\n3. Explore advanced medical narrative techniques";
      }
      break;
      
    case "protocol-adherence":
      if (isBelowAvg) {
        content.concern = `Your protocol adherence score of ${score}% indicates significant deviations from established clinical protocols. This creates patient safety risks and liability concerns.`;
        content.expectations = "1. Review all current clinical protocols within 14 days\n2. Complete protocol review session with medical director\n3. Document protocol justification for all treatments";
      } else if (isAverage) {
        content.observation = `Your protocol adherence score of ${score}% shows general compliance but occasional deviations. Consistent protocol adherence ensures standardized, evidence-based care.`;
        content.recommendations = "1. Review protocol updates from the last quarter\n2. Document clearly when deviating from protocols and why\n3. Participate in monthly protocol review sessions";
      } else {
        content.recognition = `Your protocol adherence score of ${score}% demonstrates excellent compliance with clinical guidelines while maintaining appropriate clinical judgment.`;
        content.growthOpportunities = "1. Participate in protocol development committees\n2. Help identify protocol improvements based on field experience\n3. Consider becoming a protocol trainer for new employees";
      }
      break;
      
    // Default case for general performance and other categories
    default:
      // Use the default messages defined above
      break;
  }
  
  return content;
};

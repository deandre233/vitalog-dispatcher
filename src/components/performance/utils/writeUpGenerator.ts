
import { getSubjectDisplayName } from "./performanceUtils";
import { getSubjectSpecificContent } from "./subjectContentUtils";
import { WriteUpGenerationProps } from "../types/performanceTypes";

export const generateWriteUp = (props: WriteUpGenerationProps): string => {
  const { employeeName, writeUpSubject, activeCategory, metric } = props;
  
  const subjectContent = getSubjectSpecificContent(writeUpSubject, metric.score, metric.category);
  
  let writeUpTemplate = "";
  
  if (metric.score < 70) {
    writeUpTemplate = `PERFORMANCE IMPROVEMENT PLAN\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nConcern:\n${subjectContent.concern}\n\nExpectations:\n${subjectContent.expectations}\n\nConsequences if not improved:\nFailure to show significant improvement may result in further disciplinary action up to and including termination of employment.`;
  } else if (metric.score < 80) {
    writeUpTemplate = `PERFORMANCE WARNING\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nConcern:\n${subjectContent.concern}\n\nExpectations:\n${subjectContent.expectations}\n\nThis warning will be placed in your employment file. Please take this opportunity to improve your performance.`;
  } else if (metric.score < 85) {
    writeUpTemplate = `PERFORMANCE ADVISORY\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nObservation:\n${subjectContent.observation}\n\nRecommendations:\n${subjectContent.recommendations}\n\nThis is not a disciplinary action but an opportunity for professional growth.`;
  } else {
    writeUpTemplate = `PERFORMANCE RECOGNITION\n\nEmployee: ${employeeName}\nSubject: ${getSubjectDisplayName(writeUpSubject)}\nCategory: ${metric.category}\nCurrent Score: ${metric.score}/100 (Grade: ${metric.grade})\nDepartment Average: ${metric.departmentAvg}/100\n\nRecognition:\n${subjectContent.recognition}\n\nContinued Growth Opportunities:\n${subjectContent.growthOpportunities}\n\nThank you for your outstanding contribution to our organization.`;
  }
  
  return writeUpTemplate;
};

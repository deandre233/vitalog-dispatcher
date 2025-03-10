
import { Employee } from "@/types/employee";
import { EmployeeListItem } from "./EmployeeListItem";
import { motion } from "framer-motion";

interface EmployeeListProps {
  employees: (Employee & {
    years_experience?: number;
    phone?: string;
  })[];
  getStatusBadgeColor: (role?: string) => string;
}

export function EmployeeList({ employees, getStatusBadgeColor }: EmployeeListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {employees.map((employee, index) => (
        <motion.div key={employee.id} variants={item} custom={index}>
          <EmployeeListItem 
            employee={employee}
            getStatusBadgeColor={getStatusBadgeColor}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

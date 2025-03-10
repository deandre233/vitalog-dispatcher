
import { Employee } from "@/types/employee";
import { EmployeeCard } from "./EmployeeCard";
import { motion } from "framer-motion";

interface EmployeeGridProps {
  employees: (Employee & {
    years_experience?: number;
    phone?: string;
  })[];
  getStatusBadgeColor: (role?: string) => string;
}

export function EmployeeGrid({ employees, getStatusBadgeColor }: EmployeeGridProps) {
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {employees.map((employee, index) => (
        <motion.div key={employee.id} variants={item} custom={index}>
          <EmployeeCard 
            employee={employee}
            getStatusBadgeColor={getStatusBadgeColor}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

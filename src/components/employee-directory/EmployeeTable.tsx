
import { Employee } from "@/types/employee";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface EmployeeTableProps {
  employees: (Employee & {
    years_experience?: number;
    phone?: string;
  })[];
  getStatusBadgeColor: (role?: string) => string;
}

export function EmployeeTable({ employees, getStatusBadgeColor }: EmployeeTableProps) {
  const navigate = useNavigate();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };

  const handleEmployeeClick = (id: string) => {
    navigate(`/employee/${id}`);
  };
  
  return (
    <div className="overflow-hidden rounded-md border border-[#E5DEFF]">
      <Table>
        <TableHeader className="bg-[#F9F8FF]">
          <TableRow>
            <TableHead className="w-[250px]">Employee</TableHead>
            <TableHead>Certification</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Experience</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody
          className="divide-y"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {employees.map((employee) => (
            <motion.tr 
              key={employee.id}
              variants={item}
              className="bg-white hover:bg-[#F9F8FF] cursor-pointer transition-colors"
              onClick={() => handleEmployeeClick(employee.id)}
            >
              <TableCell className="font-medium py-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`}
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white text-xs">
                      {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${getStatusBadgeColor(employee.certification_level)} border`}
                >
                  {employee.certification_level || 'Uncertified'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                  {employee.station || 'Unassigned'}
                </div>
              </TableCell>
              <TableCell>
                {employee.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    {employee.phone}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {employee.years_experience !== undefined && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-3 w-3 mr-1 text-gray-400" />
                    {employee.years_experience} years
                  </div>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </motion.tbody>
      </Table>
    </div>
  );
}

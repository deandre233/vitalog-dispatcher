
import React from 'react';
import { Partner } from '@/types/partner';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash, RefreshCw } from 'lucide-react';

interface PartnerTableProps {
  partners: Partner[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const PartnerTable: React.FC<PartnerTableProps> = ({ 
  partners, 
  isLoading, 
  onRefresh 
}) => {
  const columns: ColumnDef<Partner>[] = [
    {
      accessorKey: 'name',
      header: 'Partner Name',
    },
    {
      accessorKey: 'partnership_type',
      header: 'Type',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${
            row.original.status === 'active' ? 'bg-green-500' :
            row.original.status === 'inactive' ? 'bg-red-500' :
            row.original.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}></span>
          {row.original.status}
        </div>
      ),
    },
    {
      accessorKey: 'contact_name',
      header: 'Contact',
    },
    {
      accessorKey: 'last_interaction',
      header: 'Last Interaction',
      cell: ({ row }) => (
        <span>{new Date(row.original.last_interaction).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: 'partnership_score',
      header: 'Score',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="bg-gray-200 w-full h-2 rounded-full">
            <div 
              className="h-2 rounded-full"
              style={{ 
                width: `${row.original.partnership_score}%`,
                backgroundColor: 
                  row.original.partnership_score > 75 ? 'rgb(34, 197, 94)' :
                  row.original.partnership_score > 50 ? 'rgb(234, 179, 8)' :
                  'rgb(239, 68, 68)'
              }}
            />
          </div>
          <span className="ml-2">{row.original.partnership_score}%</span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-red-500">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Partners</h2>
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={partners}
        searchKey="name"
      />
    </div>
  );
};

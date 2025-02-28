
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Partner } from '@/types/partner';

interface PartnerAdvancedSearchProps {
  partners: Partner[];
  onSearch: (results: Partner[]) => void;
}

export const PartnerAdvancedSearch: React.FC<PartnerAdvancedSearchProps> = ({
  partners,
  onSearch
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const handleSearch = () => {
    const filtered = partners.filter(partner => {
      const nameMatch = !name || partner.name.toLowerCase().includes(name.toLowerCase());
      const typeMatch = !type || partner.partnership_type === type;
      const statusMatch = !status || partner.status === status;
      return nameMatch && typeMatch && statusMatch;
    });
    
    onSearch(filtered);
  };

  const handleReset = () => {
    setName('');
    setType('');
    setStatus('');
    onSearch(partners);
  };

  // Get unique partnership types for the select dropdown
  const partnershipTypes = [...new Set(partners.map(p => p.partnership_type))];
  // Get unique statuses for the select dropdown
  const statuses = [...new Set(partners.map(p => p.status))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Partner Name</label>
            <Input 
              placeholder="Search by name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Partnership Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {partnershipTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} className="flex-1">Search</Button>
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

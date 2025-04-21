'use client';

import { useState } from 'react';

interface StatusSelectProps {
  id: string;
  initialStatus: string;
}

export function StatusSelect({ id, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(initialStatus || 'Open');
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadgeClass = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'open') return 'bg-yellow-100 text-yellow-800';
    if (lowerStatus === 'in progress') return 'bg-blue-100 text-blue-800';
    if (lowerStatus === 'mitigated') return 'bg-green-100 text-green-800';
    if (lowerStatus === 'closed') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/vulnerabilities/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <select 
      className={`border-0 rounded px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(status)}`}
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isLoading}
    >
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Mitigated">Mitigated</option>
      <option value="Closed">Closed</option>
    </select>
  );
} 
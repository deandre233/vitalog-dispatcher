
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PatientDetails } from "./crew-assignment/PatientDetails";
import { CrewList } from "./crew-assignment/CrewList";
import { useCrewAssignment } from "./crew-assignment/useCrewAssignment";

interface CrewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transportId: string;
  patientName: string;
  patientId: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  warnings?: string[];
}

export function CrewAssignmentModal({
  isOpen,
  onClose,
  transportId,
  patientName,
  patientId,
  pickupLocation,
  dropoffLocation,
  scheduledTime,
  warnings = []
}: CrewAssignmentModalProps) {
  const {
    isLoading,
    availableCrews,
    selectedCrew,
    setSelectedCrew,
    handlePatientClick,
    handleAssignCrew
  } = useCrewAssignment(transportId, patientId, isOpen);

  const onAssignCrew = async () => {
    const success = await handleAssignCrew();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Assign Crew</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <PatientDetails
              patientName={patientName}
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
              scheduledTime={scheduledTime}
              warnings={warnings}
              onClick={handlePatientClick}
            />

            <CrewList
              crews={availableCrews}
              selectedCrew={selectedCrew}
              onCrewSelect={setSelectedCrew}
              isLoading={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onAssignCrew} disabled={!selectedCrew}>
              Confirm Assignment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

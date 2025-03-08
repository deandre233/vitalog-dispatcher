
export function TimeSlotVisualization() {
  const currentHour = new Date().getHours();
  const slots = Array.from({ length: 24 }).map((_, i) => ({
    hour: i,
    isCurrentHour: i === currentHour,
    isPeak: i >= 8 && i <= 18, // Peak hours between 8 AM and 6 PM
  }));

  return (
    <div className="mt-6 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Time Availability</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-medical-secondary/20 rounded-full"></div>
            <span className="text-xs text-gray-500">Off-Peak</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-medical-secondary rounded-full"></div>
            <span className="text-xs text-gray-500">Peak Hours</span>
          </div>
        </div>
      </div>
      <div className="h-12 bg-gray-50 rounded-lg flex overflow-hidden">
        {slots.map(({ hour, isCurrentHour, isPeak }) => (
          <div
            key={hour}
            className={`flex-1 flex flex-col justify-between relative ${
              isPeak ? 'bg-medical-secondary/20' : 'bg-medical-secondary/10'
            } ${isCurrentHour ? 'border-b-2 border-medical-secondary' : ''}`}
            title={`${hour}:00`}
          >
            {hour % 3 === 0 && (
              <>
                <div className="text-[10px] text-gray-500 text-center absolute top-1 w-full">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="w-px h-2 bg-gray-300 absolute bottom-0 left-1/2"></div>
              </>
            )}
            {isCurrentHour && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-medical-secondary rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


import { TabsContent } from "@/components/ui/tabs";

interface PlaceholderTabProps {
  value: string;
  title: string;
  description?: string;
}

export function PlaceholderTab({ value, title, description }: PlaceholderTabProps) {
  return (
    <TabsContent value={value} className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-600">{description || `This section contains ${title.toLowerCase()} information.`}</p>
        </div>
      </div>
    </TabsContent>
  );
}

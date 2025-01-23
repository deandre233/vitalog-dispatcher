import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toast } = useToast();
  return null; // The actual toast rendering is handled by the Sonner library
}
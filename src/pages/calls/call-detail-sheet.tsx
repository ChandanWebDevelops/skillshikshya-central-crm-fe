import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDateTime, formatDuration } from "@/lib/leads-format";

interface Props {
  call: any | null;
  onClose: () => void;
}

export function CallDetailSheet({ call, onClose }: Props) {
  return (
    <Sheet open={!!call} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Call Detail</SheetTitle>
        </SheetHeader>
        {call && (
          <div className="space-y-4 py-4">
            <div><strong>Lead:</strong> {call.lead_name} ({call.lead_reference_number})</div>
            <div><strong>Timestamp:</strong> {formatDateTime(call.call_timestamp)}</div>
            <div><strong>Direction:</strong> {call.direction}</div>
            <div><strong>Caller:</strong> {call.caller_name || call.caller}</div>
            <div><strong>Duration:</strong> {formatDuration(call.duration_seconds)}</div>
            <div><strong>Outcome:</strong> {call.outcome}</div>
            <div><strong>Notes:</strong> {call.notes}</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { useState } from "react";
import { CallDetailSheet } from "./call-detail-sheet";
import { useQuery } from "@tanstack/react-query";
import { leadsService } from "@/services/leads.service";
import { useCallSummary } from "@/hooks/use-leads";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime, formatDuration } from "@/lib/leads-format";

export default function CallsPage() {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [params, setParams] = useState({ page: 1, direction: "", search: "" });
  const { data: summary } = useCallSummary();
  const { data: callsData, isLoading } = useQuery({
    queryKey: ["calls", params],
    queryFn: () => leadsService.getGlobalCalls(params), // Note: Need a dummy ID or adjust service to support global calls
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Call Log</h1>
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded">Total Calls: {summary.total_calls}</div>
          <div className="p-4 border rounded">Total Duration: {formatDuration(summary.total_duration)}</div>
          <div className="p-4 border rounded">Avg Duration: {formatDuration(Math.round(summary.avg_duration))}</div>
        </div>
      )}

      <div className="flex gap-4">
        <Input placeholder="Search calls..." onChange={(e) => setParams({ ...params, search: e.target.value })} />
        <Select onValueChange={(v) => setParams({ ...params, direction: v })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outbound</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callsData?.results.map((c: any) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelectedCall(c)}>
                <TableCell>{c.lead_name}</TableCell>
                <TableCell>{formatDateTime(c.call_timestamp)}</TableCell>
                <TableCell>{c.direction}</TableCell>
                <TableCell>{formatDuration(c.duration_seconds)}</TableCell>
                <TableCell>{c.outcome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <CallDetailSheet call={selectedCall} onClose={() => setSelectedCall(null)} />
        </Table>
      )}
    </div>
  );
}

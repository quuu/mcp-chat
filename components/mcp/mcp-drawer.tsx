"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { RequestHeader } from "./mcp-actions";
import { MCPServerList } from "./mcp-server-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type TransportType = "sse" | "http";

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  transportType: TransportType;
  headers: RequestHeader[];
}

export const LOCAL_STORAGE_KEY = "mcp-servers";

export function MCPDrawer({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [mcpName, setMcpName] = useState("");
  const [mcpUrl, setMcpUrl] = useState("");
  const [transportType, setTransportType] = useState<TransportType>("sse");
  const [headers, setHeaders] = useState<RequestHeader[]>([
    { key: "", value: "" },
  ]);
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [editingServerId, setEditingServerId] = useState<string | null>(null);
  const [showHeaders, setShowHeaders] = useState(false);

  // Load MCP servers from local storage on initial render
  useEffect(() => {
    const savedServers = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedServers) {
      try {
        const parsed = JSON.parse(savedServers);
        // Handle migration from old format (without transportType)
        const migratedServers = parsed.map((server: any) => ({
          ...server,
          transportType: server.transportType || "sse",
        }));
        setMcpServers(migratedServers);
      } catch (error) {
        console.error("Failed to parse MCP servers from local storage:", error);
      }
    }
  }, []);

  // Save MCP servers to local storage whenever they change
  useEffect(() => {
    if (mcpServers.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mcpServers));
    }
  }, [mcpServers]);

  const resetForm = () => {
    setMcpName("");
    setMcpUrl("");
    setTransportType("sse");
    setHeaders([{ key: "", value: "" }]);
    setShowHeaders(false);
    setEditingServerId(null);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  // Update showHeaders when editing a server with headers
  useEffect(() => {
    if (editingServerId) {
      const server = mcpServers.find((s) => s.id === editingServerId);
      if (server && server.headers.length > 0) {
        setShowHeaders(true);
      }
    }
  }, [editingServerId, mcpServers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty headers
    const filteredHeaders = showHeaders
      ? headers.filter(
          (header) => header.key.trim() !== "" && header.value.trim() !== ""
        )
      : [];

    if (editingServerId) {
      // Update existing server
      const updatedServers = mcpServers.map((server) =>
        server.id === editingServerId
          ? {
              ...server,
              name: mcpName,
              url: mcpUrl,
              transportType,
              headers: filteredHeaders,
            }
          : server
      );
      setMcpServers(updatedServers);
      toast.success(`MCP server "${mcpName}" updated successfully`);
    } else {
      // Add new server
      const newServer: MCPServer = {
        id: Date.now().toString(),
        name: mcpName,
        url: mcpUrl,
        transportType,
        headers: filteredHeaders,
      };
      setMcpServers([...mcpServers, newServer]);
      toast.success(`MCP server "${mcpName}" registered successfully`);
    }

    // Reset form and continue showing dialog
    resetForm();
  };

  const handleDeleteServer = (id: string, name: string) => {
    const updatedServers = mcpServers.filter((server) => server.id !== id);
    setMcpServers(updatedServers);

    // If no servers left, remove from localStorage
    if (updatedServers.length === 0) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    toast.success(`MCP server "${name}" deleted successfully`);
  };

  const handleEditServer = (server: MCPServer) => {
    setMcpName(server.name);
    setMcpUrl(server.url);
    setTransportType(server.transportType || "sse");
    setHeaders(
      server.headers.length > 0 ? [...server.headers] : [{ key: "", value: "" }]
    );
    setShowHeaders(server.headers.length > 0);
    setEditingServerId(server.id);
  };

  const handleSheetOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          MCP
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editingServerId ? "Edit MCP Server" : "Add MCP Server"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mcp-name">MCP Name</Label>
              <Input
                id="mcp-name"
                placeholder="Enter MCP Name"
                value={mcpName}
                onChange={(e) => setMcpName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mcp-url">MCP URL</Label>
              <Input
                id="mcp-url"
                placeholder="https://example.com/mcp"
                value={mcpUrl}
                onChange={(e) => setMcpUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transport-type">Transport Type</Label>
              <Select
                value={transportType}
                onValueChange={(value) =>
                  setTransportType(value as TransportType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transport type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sse">SSE (Server-Sent Events)</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-headers"
                checked={showHeaders}
                onCheckedChange={setShowHeaders}
              />
              <Label htmlFor="show-headers">Use custom headers</Label>
            </div>

            {showHeaders && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label>Request Headers</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addHeader}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Header
                  </Button>
                </div>

                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Input
                        placeholder="Header key"
                        value={header.key}
                        onChange={(e) =>
                          updateHeader(index, "key", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e) =>
                          updateHeader(index, "value", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHeader(index)}
                        className="h-10 w-10"
                        disabled={headers.length === 1 && index === 0}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              {editingServerId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
              <Button type="submit">
                {editingServerId ? "Update" : "Register"}
              </Button>
            </div>
          </form>

          <MCPServerList
            servers={mcpServers}
            onEditServer={handleEditServer}
            onDeleteServer={handleDeleteServer}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

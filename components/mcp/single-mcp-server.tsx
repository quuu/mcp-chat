"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { MCPServer } from "./mcp-drawer";
import { MCPTool, fetchMCPTools } from "./mcp-actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Global cache to store tools by server URL
const toolsCache = new Map<string, { tools: MCPTool[]; timestamp: number }>();

// Cache expiration time (1 hour in milliseconds)
const CACHE_EXPIRATION = 60 * 60 * 1000;

interface SingleMCPServerProps {
  server: MCPServer;
  onEdit: (server: MCPServer) => void;
  onDelete: (id: string, name: string) => void;
}

export function SingleMCPServer({
  server,
  onEdit,
  onDelete,
}: SingleMCPServerProps) {
  const [expanded, setExpanded] = useState(false);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if we have cached tools for this server
  const getCachedTools = (url: string): MCPTool[] | null => {
    const cached = toolsCache.get(url);
    if (!cached) return null;

    // Invalidate cache if it's expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRATION) {
      toolsCache.delete(url);
      return null;
    }

    return cached.tools;
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      // Check cache first
      const cachedTools = getCachedTools(server.url);
      if (cachedTools) {
        setTools(cachedTools);
        setLoading(false);
        return;
      }

      // Otherwise fetch from server
      const result = await fetchMCPTools(
        server.url,
        server.headers,
        server.transportType || "sse"
      );
      if (result.success && result.tools) {
        setTools(result.tools);
        // Update cache
        toolsCache.set(server.url, {
          tools: result.tools,
          timestamp: Date.now(),
        });
      } else {
        toast.error(`Failed to fetch tools: ${result.error}`);
      }
    } catch (error) {
      toast.error("Failed to fetch MCP tools");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = async () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);

    if (newExpanded && tools.length === 0 && !loading) {
      fetchTools();
    }
  };

  // If the server URL or headers change, clear the tools so they'll be refetched
  useEffect(() => {
    setTools([]);
  }, [server.url, JSON.stringify(server.headers), server.transportType]);

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{server.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {server.transportType || "sse"}
          </Badge>
        </div>
        <CardDescription className="text-xs truncate">
          {server.url}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleExpand}
          className="mt-2 w-full flex justify-between items-center text-xs"
          disabled={loading}
        >
          {loading
            ? "Loading tools..."
            : expanded
            ? "Hide tools"
            : "Show tools"}
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>

        {expanded && tools.length > 0 && (
          <div className="mt-2 text-xs space-y-2">
            <div className="font-medium">Available Tools ({tools.length}):</div>
            <ul className="space-y-1 pl-2">
              {tools.map((tool) => (
                <li key={tool.name} className="flex flex-col">
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-muted-foreground text-[10px] line-clamp-2">
                    {tool.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(server)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(server.id, server.name)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

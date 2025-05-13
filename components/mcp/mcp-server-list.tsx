"use client";

import { Separator } from "@/components/ui/separator";
import { SingleMCPServer } from "./single-mcp-server";
import { MCPServer } from "./mcp-drawer";

interface MCPServerListProps {
  servers: MCPServer[];
  onEditServer: (server: MCPServer) => void;
  onDeleteServer: (id: string, name: string) => void;
}

export function MCPServerList({
  servers,
  onEditServer,
  onDeleteServer,
}: MCPServerListProps) {
  if (servers.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-6" />
      <div className="mb-4">
        <h3 className="text-sm font-medium">Registered MCP Servers</h3>
      </div>
      <div className="space-y-3">
        {servers.map((server) => (
          <SingleMCPServer
            key={server.id}
            server={server}
            onEdit={onEditServer}
            onDelete={onDeleteServer}
          />
        ))}
      </div>
    </>
  );
}

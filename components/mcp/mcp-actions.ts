"use server";

import { experimental_createMCPClient } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export interface RequestHeader {
  key: string;
  value: string;
}

export interface MCPTool {
  name: string;
  description: string;
}

export type TransportType = "sse" | "http";

export async function fetchMCPTools(
  url: string,
  headers: RequestHeader[],
  transportType: TransportType = "sse"
) {
  try {
    const headerMap = headers.reduce<Record<string, string>>((acc, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});

    let mcpClient;

    // Create the appropriate client based on transport type
    if (transportType === "sse") {
      mcpClient = await experimental_createMCPClient({
        transport: {
          type: "sse",
          url,
          headers: headerMap,
        },
      });
    } else {
      const transport = new StreamableHTTPClientTransport(new URL(url));
      // For HTTP transport
      mcpClient = await experimental_createMCPClient({
        transport,
      });
    }

    const tools = await mcpClient.tools();

    // Convert tools to a simpler format for display
    const toolsList: MCPTool[] = Object.entries(tools).map(([name, tool]) => ({
      name,
      description: tool.description || "No description available",
    }));

    return { success: true, tools: toolsList };
  } catch (error) {
    console.error("Error fetching MCP tools:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

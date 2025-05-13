import { useMcp } from "use-mcp/react";

export function UseMCPComponent() {
  const {
    state, // Connection state: 'discovering' | 'authenticating' | 'connecting' | 'loading' | 'ready' | 'failed'
    tools, // Available tools from MCP server
    error, // Error message if connection failed
    callTool, // Function to call tools on the MCP server
    retry, // Retry connection manually
    authenticate, // Manually trigger authentication
    clearStorage, // Clear stored tokens and credentials
  } = useMcp({
    url: "https://mcp-for-next-js.vercel.app/mcp",
    clientName: "My App",
    autoReconnect: true,
  });

  // Handle different states
  if (state === "failed") {
    return (
      <div>
        <p>Connection failed: {error}</p>
        <button onClick={retry}>Retry</button>
        <button onClick={authenticate}>Authenticate Manually</button>
      </div>
    );
  }

  if (state !== "ready") {
    return <div>Connecting to AI service...</div>;
  }

  // Use available tools
  const handleSearch = async () => {
    try {
      const result = await callTool("search", { query: "example search" });
      console.log("Search results:", result);
    } catch (err) {
      console.error("Tool call failed:", err);
    }
  };

  return (
    <div>
      <h2>Available Tools: {tools.length}</h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.name}>{tool.name}</li>
        ))}
      </ul>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

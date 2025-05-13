import { ToolInvocation } from "ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Props = {
  type: string;
  toolName: string;
  state: "call" | "result" | "partial-call";
  json: ToolInvocation;
};

export default function GenericToolCall({
  type,
  toolName,
  state,
  json,
}: Props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="tool-call" className="mb-2">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span className="font-medium">Tool Call</span>
            <Badge variant="outline" className="text-xs">
              {toolName}
            </Badge>
            <Badge
              variant={state === "result" ? "default" : "secondary"}
              className="text-xs"
            >
              {state}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium">Type: {type}</h2>
              <h2 className="text-sm font-medium">Tool Name: {toolName}</h2>
              <h2 className="text-sm font-medium">State: {state}</h2>
            </div>
            <div className="overflow-hidden bg-muted/50 rounded-lg">
              <div className="flex flex-col gap-2 overflow-auto p-4">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(json, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

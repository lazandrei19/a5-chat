import { type LLMOutputComponent } from "@llm-ui/react";

// Simple code block component for now - we can enhance this later
const CodeBlockComponent: LLMOutputComponent = ({ blockMatch }) => {
  // Extract the code content from the markdown code block
  const codeBlock = blockMatch.output;
  
  // Simple regex to extract language and code from markdown code blocks
  const match = codeBlock.match(/^```(\w+)?\n?([\s\S]*?)```$/);
  const language = match?.[1] || '';
  const code = match?.[2] || codeBlock;

  return (
    <div className="my-4">
      {language && (
        <div className="bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 rounded-t-lg border-b">
          {language}
        </div>
      )}
      <pre className="bg-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm border">
        <code className="text-gray-800 font-mono">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlockComponent; 
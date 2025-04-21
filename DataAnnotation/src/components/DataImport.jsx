import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const DataImport = ({ onImport }) => {
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError("请选择JSON文件");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        
        // 转换数据格式
        const formattedData = parsedData.map((item, index) => ({
          id: index + 1,
          question: item.question,
          answers: item.answer.map((content, i) => ({
            id: i + 1,
            content: content,
            annotations: [],
            rank: i + 1
          })),
          expertAnswer: ""
        }));

        onImport(formattedData);
        setError("");
      } catch (e) {
        setError("JSON格式错误，请检查文件内容");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">JSON文件格式要求：</h3>
        <pre className="text-sm whitespace-pre-wrap">
{`[
  {
    "question": "问题文本",
    "answer": [
      "答案1",
      "答案2"
    ]
  }
]`}
        </pre>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file-input">选择JSON文件</Label>
        <input
          id="file-input"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default DataImport;

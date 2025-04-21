import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExpertAnswer = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [isEditing, setIsEditing] = useState(!value);
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    setLocalValue(value || "");
    setIsEditing(!value);
  }, [value]);

  const handleCancel = () => {
    setLocalValue(value || "");
    setIsEditing(false);
    setActiveTab("preview");
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="expert-answer" className="text-lg font-semibold">专家答案</Label>
        {!isEditing && (
          <Button onClick={() => {
            setIsEditing(true);
            setActiveTab("edit");
          }} variant="outline">
            编辑答案
          </Button>
        )}
      </div>

      {isEditing ? (
        <>
          <Alert className="mb-4">
            <AlertDescription>
              请在此输入专家标准答案，作为评判其他答案质量的参考标准。支持Markdown格式。
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">编辑</TabsTrigger>
              <TabsTrigger value="preview">预览</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <Textarea
                id="expert-answer"
                value={localValue}
                onChange={handleChange}
                placeholder="请输入专家答案（支持Markdown格式）"
                className="min-h-[200px] mb-4 font-mono"
                required
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="min-h-[200px] mb-4 p-4 border rounded-lg bg-muted prose max-w-none">
                {localValue ? (
                  <ReactMarkdown>{localValue}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">预览内容将在此显示</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end">
            {value && (
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="bg-muted p-4 rounded-lg min-h-[100px] prose max-w-none">
          {value ? (
            <div>
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-muted-foreground">请点击"编辑答案"按钮添加专家答案</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertAnswer;

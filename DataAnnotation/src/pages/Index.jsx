
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DataImport from "@/components/DataImport";
import AnswerList from "@/components/AnswerList";
import ExpertAnswer from "@/components/ExpertAnswer";
import DataExport from "@/components/DataExport";
import ReactMarkdown from 'react-markdown';

const Index = () => {
  const [data, setData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  const handleDataImport = (importedData) => {
    setData(importedData);
    setCurrentQuestion(null);
  };

  const handleAnswerUpdate = (questionId, answers) => {
    setData(data.map(item => 
      item.id === questionId ? { ...item, answers } : item
    ));
  };

  const handleExpertAnswerUpdate = (questionId, expertAnswer) => {
    setData(data.map(item =>
      item.id === questionId ? { ...item, expertAnswer } : item
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">问答标注系统</h1>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">数据导入</h2>
            <DataImport onImport={handleDataImport} />
          </div>

          {data.length > 0 && (
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">问题列表</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {data.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentQuestion?.id === item.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setCurrentQuestion(item)}
                  >
                    <span className="truncate">
                      <div className="inline">
                        <ReactMarkdown>{item.question}</ReactMarkdown>
                      </div>
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {data.length > 0 && (
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">数据导出</h2>
              <DataExport data={data} />
            </div>
          )}
        </div>

        {currentQuestion && (
          <div className="col-span-12 lg:col-span-9 border rounded-lg p-4 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">问题详情</h2>
              <div className="bg-muted p-4 rounded prose max-w-none">
                <div>
                  <ReactMarkdown>{currentQuestion.question}</ReactMarkdown>
                </div>
              </div>
            </div>

            <AnswerList
              answers={currentQuestion.answers}
              onUpdate={(answers) => handleAnswerUpdate(currentQuestion.id, answers)}
              currentQuestion={currentQuestion}
            />

            <ExpertAnswer
              value={currentQuestion.expertAnswer}
              onChange={(expertAnswer) => handleExpertAnswerUpdate(currentQuestion.id, expertAnswer)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;


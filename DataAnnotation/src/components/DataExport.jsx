import { Button } from "@/components/ui/button";

const DataExport = ({ data }) => {
  const handleExport = () => {
    const exportData = data.map(item => ({
      question: item.question,
      answer: item.answers.map(a => a.content),
      annotations: item.answers.map(a => ({
        content: a.content,
        rank: a.rank,
        annotations: a.annotations
      })),
      expertAnswer: item.expertAnswer
    }));

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '标注结果.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport}>
      导出JSON
    </Button>
  );
};

export default DataExport;

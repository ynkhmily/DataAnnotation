import { useState, useEffect, useRef } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GripVertical, ArrowUpDown, X, ChevronDown, ChevronRight, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from 'react-markdown';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const annotationTypes = [
  { value: "事实错误", label: "事实错误" },
  { value: "逻辑不通", label: "逻辑不通" },
  { value: "分析结构混乱", label: "分析结构混乱" },
  { value: "与主题无关", label: "与主题无关" },
  { value: "信息过时", label: "信息过时" },
  { value: "模型幻觉", label: "模型幻觉" },
  { value: "建议不具备可行性", label: "建议不具备可行性" },
  { value: "深度行业洞察", label: "深度行业洞察" },
  { value: "数据洞察精准", label: "数据洞察精准" },
  { value: "创新分析思路", label: "创新分析思路" },
  { value: "关键机会识别", label: "关键机会识别" },
  { value: "关键风险提示", label: "关键风险提示" },
  { value: "本地化/案例佳", label: "本地化/案例佳" },
  { value: "建议可行性强", label: "建议可行性强" },
  { value: "逻辑链条清晰", label: "逻辑链条清晰" },
  { value: "结构化良好", label: "结构化良好" },
  { value: "表达专业精练", label: "表达专业精练" },
];

const AnswerItem = ({ answer, onAnnotate, currentQuestion }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: answer.id.toString()
  });
  const answerRef = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [annotationType, setAnnotationType] = useState([]);
  const [annotationNote, setAnnotationNote] = useState("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  useEffect(() => {
    handleClearSelection();
  }, [currentQuestion]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const existingAnnotation = answer.annotations.find(a => a.text === selectedText);
    if (existingAnnotation) {
      const annotationElements = document.querySelectorAll('.annotation-item');
      annotationElements.forEach((element, index) => {
        if (answer.annotations[index].text === selectedText) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-annotation');
          setTimeout(() => {
            element.classList.remove('highlight-annotation');
          }, 2000);
        }
      });
      return;
    }

    setSelectedText(selectedText);

    const existingHighlights = document.querySelectorAll('.temp-highlight');
    existingHighlights.forEach(el => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    });

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'bg-yellow-200 temp-highlight';
    
    try {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    } catch (error) {
      console.error('Failed to highlight text:', error);
      setSelectedText(selectedText);
    }
  };

  const handleClearSelection = () => {
    setSelectedText("");
    setAnnotationType([]);
    setAnnotationNote("");
    window.getSelection().removeAllRanges();
    
    const highlights = document.querySelectorAll('.bg-yellow-200');
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      while (highlight.firstChild) {
        parent.insertBefore(highlight.firstChild, highlight);
      }
      if (parent) {
         parent.removeChild(highlight);
      }
     
    });
  };

  const handleAnnotation = () => {
    if (selectedText && annotationType.length > 0) {
      onAnnotate(answer.id, {
        text: selectedText,
        type: annotationType,
        note: annotationNote,
        questionId: currentQuestion.id
      });
      handleClearSelection();
    }
  };

  const handleTextClick = (event) => {
    const clickedText = event.target.textContent;
    const existingAnnotation = answer.annotations.find(a => a.text === clickedText);
    
    if (existingAnnotation) {
      const annotationElements = document.querySelectorAll('.annotation-item');
      annotationElements.forEach((element, index) => {
        if (answer.annotations[index].text === clickedText) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-annotation');
          setTimeout(() => {
            element.classList.remove('highlight-annotation');
          }, 2000);
        }
      });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="border p-4 rounded-lg mb-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2 bg-muted p-2 rounded">
        <button {...attributes} {...listeners} className="hover:bg-accent rounded p-1">
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-primary">当前排序: {answer.rank}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4">
            <div 
              ref={answerRef} 
              onMouseUp={handleTextSelection}
              onClick={handleTextClick}
              className="prose max-w-none cursor-pointer"
            >
              <div>
                <ReactMarkdown>{answer.content}</ReactMarkdown>
              </div>
            </div>
          </div>

          {selectedText && (
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center justify-between">
                <Label>已选择文本:</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearSelection}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm bg-muted p-2 rounded">{selectedText}</p>

              <div>
                <Label>标注类型</Label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between h-auto min-h-10"
                    >
                      <div className="flex flex-wrap gap-1">
                        {annotationType.length === 0 && "选择标注类型..."}
                        {annotationTypes
                          .filter((type) => annotationType.includes(type.value))
                          .map((type) => (
                            <Badge
                              variant="secondary"
                              key={type.value}
                              className="mr-1 mb-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnnotationType(
                                  annotationType.filter((v) => v !== type.value)
                                );
                              }}
                            >
                              {type.label}
                              <X className="ml-1 h-3 w-3" />
                            </Badge>
                          ))}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="搜索类型..." />
                      <CommandList>
                        <CommandEmpty>未找到类型.</CommandEmpty>
                        <CommandGroup>
                          {annotationTypes.map((type) => {
                            const isSelected = annotationType.includes(type.value);
                            return (
                              <CommandItem
                                key={type.value}
                                value={type.value}
                                onSelect={(currentValue) => {
                                  if (isSelected) {
                                    setAnnotationType(
                                      annotationType.filter((v) => v !== currentValue)
                                    );
                                  } else {
                                    setAnnotationType([...annotationType, currentValue]);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {type.label}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>备注</Label>
                <Textarea
                  value={annotationNote}
                  onChange={(e) => setAnnotationNote(e.target.value)}
                  placeholder="输入备注"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClearSelection}>
                  取消选择
                </Button>
                <Button onClick={handleAnnotation}>
                  添加标注
                </Button>
              </div>
            </div>
          )}

          {answer.annotations.length > 0 && (
            <div className="mt-4">
              <Label>已添加的标注:</Label>
              <div className="space-y-2">
                {answer.annotations.map((annotation, index) => (
                  <div 
                    key={index} 
                    className="annotation-item bg-muted p-2 rounded text-sm transition-colors duration-300"
                  >
                    <p>文本: {annotation.text}</p>
                    <p>类型: {annotation.type.join(', ')}</p>
                    <p>备注: {annotation.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AnswerList = ({ answers, onUpdate, currentQuestion }) => {
  const [sortedAnswers, setSortedAnswers] = useState(answers);

  useEffect(() => {
    setSortedAnswers(answers);
  }, [answers]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = sortedAnswers.findIndex((a) => a.id.toString() === active.id);
      const newIndex = sortedAnswers.findIndex((a) => a.id.toString() === over.id);
      
      const newAnswers = [...sortedAnswers];
      const [movedItem] = newAnswers.splice(oldIndex, 1);
      newAnswers.splice(newIndex, 0, movedItem);
      
      const updatedAnswers = newAnswers.map((answer, index) => ({
        ...answer,
        rank: index + 1
      }));
      
      setSortedAnswers(updatedAnswers);
      onUpdate(updatedAnswers);
    }
  };

  const handleAnnotation = (answerId, annotation) => {
    const updatedAnswers = sortedAnswers.map(answer =>
      answer.id === answerId
        ? { ...answer, annotations: [...answer.annotations, annotation] }
        : answer
    );
    setSortedAnswers(updatedAnswers);
    onUpdate(updatedAnswers);
  };

  return (
    <div>
      <Alert className="mb-4">
        <AlertDescription className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>请通过拖拽对答案进行排序，排序越靠前表示答案质量越好。点击文本可快速定位到对应标注。</span>
        </AlertDescription>
      </Alert>
      
      <h3 className="text-lg font-semibold mb-4">答案列表（请对答案进行排序）</h3>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext 
          items={sortedAnswers.map(a => a.id.toString())} 
          strategy={verticalListSortingStrategy}
        >
          {sortedAnswers.map((answer) => (
            <AnswerItem
              key={answer.id}
              answer={answer}
              onAnnotate={handleAnnotation}
              currentQuestion={currentQuestion}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AnswerList;

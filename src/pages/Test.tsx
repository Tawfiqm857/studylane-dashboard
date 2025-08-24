import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useTest } from '@/contexts/TestContext';
import { useToast } from '@/hooks/use-toast';
import { Clock, ChevronLeft, ChevronRight, BookOpen, Send } from 'lucide-react';

const Test: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tests, startTest, currentTest, currentAnswers, submitAnswer, submitTest, resetCurrentTest } = useTest();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (testId) {
      const test = tests.find(t => t.id === testId);
      if (!test) {
        toast({
          title: 'Test not found',
          description: 'The requested test could not be found.',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }
      
      startTest(testId);
      setTimeRemaining(test.timeLimit * 60); // Convert minutes to seconds
    }

    return () => {
      resetCurrentTest();
    };
  }, [testId, tests, startTest, resetCurrentTest, navigate, toast]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentTest) {
      // Auto-submit when time runs out
      handleSubmitTest();
    }
  }, [timeRemaining, currentTest]);

  if (!currentTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const totalQuestions = currentTest.questions.length;
  const progressPercentage = Math.round((Object.keys(currentAnswers).length / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    submitAnswer(questionId, answerIndex);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitTest = async () => {
    const unansweredQuestions = currentTest.questions.filter(q => !(q.id in currentAnswers));
    
    if (unansweredQuestions.length > 0 && timeRemaining > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await submitTest();
      if (result) {
        toast({
          title: 'Test submitted!',
          description: `You scored ${result.score}% on this test.`,
        });
        navigate('/results', { state: { result } });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit test. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isQuestionAnswered = (questionId: string) => questionId in currentAnswers;
  const allQuestionsAnswered = Object.keys(currentAnswers).length === totalQuestions;

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Test Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{currentTest.title}</h1>
              <p className="text-muted-foreground">{currentTest.subject} • {totalQuestions} Questions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={`font-mono ${timeRemaining < 300 ? 'text-destructive' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Object.keys(currentAnswers).length} of {totalQuestions} answered</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </CardTitle>
                  {isQuestionAnswered(currentQuestion.id) && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                      Answered
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-base leading-relaxed">
                  {currentQuestion.question}
                </CardDescription>

                <RadioGroup
                  value={currentAnswers[currentQuestion.id]?.toString() || ''}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = currentAnswers[currentQuestion.id] === index;
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'hover:bg-muted/50 border-border'
                        }`}
                        onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      >
                        <RadioGroupItem 
                          value={index.toString()} 
                          id={`option-${index}`}
                          className={isSelected ? 'border-primary text-primary' : ''}
                        />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitTest}
                    disabled={isSubmitting}
                    className="bg-success hover:bg-success/90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Test'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-0 sticky top-8">
              <CardHeader>
                <CardTitle className="text-base">Question Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                  {currentTest.questions.map((question, index) => (
                    <Button
                      key={question.id}
                      variant={index === currentQuestionIndex ? 'default' : 'outline'}
                      size="sm"
                      className={`text-xs ${
                        isQuestionAnswered(question.id)
                          ? index === currentQuestionIndex
                            ? 'bg-primary'
                            : 'bg-success/10 border-success text-success hover:bg-success/20'
                          : ''
                      }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Answered:</span>
                    <span className="font-medium">{Object.keys(currentAnswers).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium">{totalQuestions - Object.keys(currentAnswers).length}</span>
                  </div>
                </div>

                {allQuestionsAnswered && (
                  <Button
                    onClick={handleSubmitTest}
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-success hover:bg-success/90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Test
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
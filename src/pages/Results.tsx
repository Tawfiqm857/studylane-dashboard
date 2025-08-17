import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTest, TestAttempt } from '@/contexts/TestContext';
import { Trophy, RotateCcw, Home, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const Results: React.FC = () => {
  const location = useLocation();
  const { tests } = useTest();
  const result = location.state?.result as TestAttempt;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">No test results found</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const test = tests.find(t => t.id === result.testId);
  const correctAnswers = Object.keys(result.answers).filter(questionId => {
    const question = test?.questions.find(q => q.id === questionId);
    return question && result.answers[questionId] === question.correctAnswer;
  }).length;

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: "Excellent work! 🎉", color: "text-success" };
    if (score >= 70) return { message: "Great job! 👏", color: "text-success" };
    if (score >= 50) return { message: "Good effort! 👍", color: "text-warning" };
    return { message: "Keep practicing! 💪", color: "text-destructive" };
  };

  const performance = getPerformanceMessage(result.score);

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
          <p className="text-muted-foreground">Here are your results for {test?.title}</p>
        </div>

        <Card className="shadow-soft border-0 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-primary">{result.score}%</div>
            <p className={`text-xl font-medium ${performance.color}`}>{performance.message}</p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-success">{correctAnswers}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{result.totalQuestions - correctAnswers}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{result.totalQuestions}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {test && (
          <Card className="shadow-card border-0 mb-8">
            <CardHeader>
              <CardTitle>Review Your Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {test.questions.map((question, index) => {
                const userAnswer = result.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">Q{index + 1}: {question.question}</p>
                        <p className="text-sm text-muted-foreground mb-1">
                          Your answer: <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                            {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-success">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                            💡 {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to={`/test/${result.testId}`}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Test
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
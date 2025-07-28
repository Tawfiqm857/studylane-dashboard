import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useTest } from '@/contexts/TestContext';
import { Play, Clock, Trophy, Target, BookOpen, Brain } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tests, getTestProgress } = useTest();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'HTML':
        return <BookOpen className="h-5 w-5 text-orange-500" />;
      case 'CSS':
        return <Brain className="h-5 w-5 text-blue-500" />;
      case 'JavaScript':
        return <Target className="h-5 w-5 text-yellow-500" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const calculateOverallProgress = () => {
    const completedTests = tests.filter(test => getTestProgress(test.id).status === 'completed').length;
    return Math.round((completedTests / tests.length) * 100);
  };

  const getAverageScore = () => {
    const completedTests = tests.filter(test => getTestProgress(test.id).status === 'completed');
    if (completedTests.length === 0) return 0;
    
    const totalScore = completedTests.reduce((sum, test) => sum + getTestProgress(test.id).bestScore, 0);
    return Math.round(totalScore / completedTests.length);
  };

  const overallProgress = calculateOverallProgress();
  const averageScore = getAverageScore();
  const totalAttempts = tests.reduce((sum, test) => sum + getTestProgress(test.id).attempts, 0);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Ready to continue your web development journey? Let's see how you're progressing.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-success/10">
                  <Target className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-warning/10">
                  <BookOpen className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tests Available</p>
                  <p className="text-2xl font-bold">{tests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <Brain className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                  <p className="text-2xl font-bold">{totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span>Your Learning Progress</span>
            </CardTitle>
            <CardDescription>
              Track your journey through web development fundamentals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-muted-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {tests.filter(test => getTestProgress(test.id).status === 'completed').length} of {tests.length} tests completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Available Tests */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Tests</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tests.map((test) => {
              const progress = getTestProgress(test.id);
              return (
                <Card key={test.id} className="hover:shadow-soft transition-all duration-300 shadow-card border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getSubjectIcon(test.subject)}
                        <div>
                          <CardTitle className="text-lg">{test.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {test.subject}
                            </Badge>
                            {getStatusBadge(progress.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {test.description}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.timeLimit} min</span>
                      </div>
                      <span>{test.questions.length} questions</span>
                    </div>

                    {progress.status === 'completed' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Best Score:</span>
                          <span className="font-semibold text-success">{progress.bestScore}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Attempts:</span>
                          <span className="font-semibold">{progress.attempts}</span>
                        </div>
                      </div>
                    )}

                    <Button asChild className="w-full">
                      <Link to={`/test/${test.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        {progress.status === 'completed' ? 'Retake Test' : 'Start Test'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>
              Make the most of your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">📚 Study Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Review incorrect answers and explanations to improve your understanding.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <h4 className="font-semibold text-success mb-2">🎯 Practice Regularly</h4>
                <p className="text-sm text-muted-foreground">
                  Take tests multiple times to reinforce your knowledge and track improvement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
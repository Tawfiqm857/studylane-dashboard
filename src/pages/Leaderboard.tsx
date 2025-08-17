import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award, Star, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTest } from '@/contexts/TestContext';

interface StudentData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  overallScore: number;
  completedTests: number;
  totalAttempts: number;
  htmlScore: number;
  cssScore: number;
  jsScore: number;
  rank: number;
  isPremium?: boolean;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const { testProgress, tests } = useTest();

  const calculateUserOverallScore = () => {
    const completedTests = Object.values(testProgress).filter(p => p.status === 'completed');
    if (completedTests.length === 0) return 0;
    const totalScore = completedTests.reduce((sum, test) => sum + test.bestScore, 0);
    return Math.round(totalScore / completedTests.length);
  };

  const mockStudents: StudentData[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      overallScore: 98,
      completedTests: 15,
      totalAttempts: 18,
      htmlScore: 96,
      cssScore: 98,
      jsScore: 100,
      rank: 1,
      isPremium: true
    },
    {
      id: '2',
      name: 'Bob Chen',
      email: 'bob@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      overallScore: 94,
      completedTests: 12,
      totalAttempts: 15,
      htmlScore: 92,
      cssScore: 95,
      jsScore: 96,
      rank: 2,
      isPremium: true
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      overallScore: 89,
      completedTests: 10,
      totalAttempts: 14,
      htmlScore: 88,
      cssScore: 90,
      jsScore: 89,
      rank: 3,
      isPremium: true
    },
    // Current user
    {
      id: user?.id || 'current',
      name: user?.name || 'You',
      email: user?.email || '',
      avatar: user?.avatar,
      overallScore: calculateUserOverallScore(),
      completedTests: Object.values(testProgress).filter(p => p.status === 'completed').length,
      totalAttempts: Object.values(testProgress).reduce((sum, p) => sum + p.attempts, 0),
      htmlScore: testProgress['html']?.bestScore || 0,
      cssScore: testProgress['css']?.bestScore || 0,
      jsScore: testProgress['javascript']?.bestScore || 0,
      rank: 4,
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      overallScore: 82,
      completedTests: 8,
      totalAttempts: 12,
      htmlScore: 80,
      cssScore: 84,
      jsScore: 82,
      rank: 5,
    },
    {
      id: '5',
      name: 'Emma Brown',
      email: 'emma@example.com',
      overallScore: 78,
      completedTests: 6,
      totalAttempts: 10,
      htmlScore: 75,
      cssScore: 80,
      jsScore: 79,
      rank: 6,
    }
  ];

  const sortedStudents = mockStudents.sort((a, b) => b.overallScore - a.overallScore)
    .map((student, index) => ({ ...student, rank: index + 1 }));

  const topStudents = sortedStudents.slice(0, 3);
  const currentUser = sortedStudents.find(s => s.id === user?.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'html': return <div className="w-4 h-4 bg-orange-500 rounded" />;
      case 'css': return <div className="w-4 h-4 bg-blue-500 rounded" />;
      case 'javascript': return <div className="w-4 h-4 bg-yellow-500 rounded" />;
      default: return <div className="w-4 h-4 bg-gray-500 rounded" />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank against other students</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top 3 Podium */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Performers
                </CardTitle>
                <CardDescription>Our highest achieving students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {topStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`relative p-6 rounded-lg border text-center ${
                        student.rank === 1 
                          ? 'bg-gradient-primary border-primary/20' 
                          : student.rank === 2
                          ? 'bg-muted/50 border-muted'
                          : 'bg-muted/30 border-muted'
                      }`}
                    >
                      {student.isPremium && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-gradient-primary text-white">
                            <Zap className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex justify-center mb-3">
                        {getRankIcon(student.rank)}
                      </div>
                      
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-semibold mb-1">{student.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">{student.overallScore}%</p>
                      <p className="text-sm text-muted-foreground">
                        {student.completedTests} tests completed
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Full Leaderboard */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Complete Rankings</CardTitle>
                <CardDescription>All students ranked by overall performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        student.id === user?.id 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-[50px]">
                          {getRankIcon(student.rank)}
                          <span className="font-bold text-lg">#{student.rank}</span>
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{student.name}</p>
                            {student.isPremium && (
                              <Badge variant="secondary" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {student.completedTests} tests • {student.totalAttempts} attempts
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{student.overallScore}%</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs">
                            {getSubjectIcon('html')}
                            <span>{student.htmlScore}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            {getSubjectIcon('css')}
                            <span>{student.cssScore}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            {getSubjectIcon('javascript')}
                            <span>{student.jsScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Your Stats */}
          <div className="space-y-6">
            {currentUser && (
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Your Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {getRankIcon(currentUser.rank)}
                    </div>
                    <p className="text-3xl font-bold text-primary">#{currentUser.rank}</p>
                    <p className="text-sm text-muted-foreground">Your current rank</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Score</span>
                        <span className="font-medium">{currentUser.overallScore}%</span>
                      </div>
                      <Progress value={currentUser.overallScore} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{currentUser.completedTests}</p>
                        <p className="text-xs text-muted-foreground">Tests Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{currentUser.totalAttempts}</p>
                        <p className="text-xs text-muted-foreground">Total Attempts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Premium Features */}
            <Card className="shadow-card border-0 bg-gradient-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Premium Features
                </CardTitle>
                <CardDescription>Unlock special features with top performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Detailed Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Custom Study Plans</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Advanced Test Features</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Achieve top 3 ranking to unlock premium features!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
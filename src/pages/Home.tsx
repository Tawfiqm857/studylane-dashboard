import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Code, Palette, Zap, Users, Trophy, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: 'HTML Mastery',
      description: 'Test your knowledge of HTML elements, attributes, and semantic markup.',
    },
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: 'CSS Styling',
      description: 'Evaluate your CSS skills including layout, animations, and responsive design.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'JavaScript Logic',
      description: 'Challenge yourself with JavaScript fundamentals, functions, and modern ES6+ features.',
    },
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, label: 'Active Students', value: '2,500+' },
    { icon: <BookOpen className="h-6 w-6" />, label: 'Practice Tests', value: '50+' },
    { icon: <Trophy className="h-6 w-6" />, label: 'Completed Tests', value: '10,000+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Master Web Development with
              <span className="bg-gradient-primary bg-clip-text text-transparent"> StudyLane</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Test your HTML, CSS, and JavaScript skills with our comprehensive assessment platform. 
              Track your progress and become a better web developer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              {isAuthenticated ? (
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link to="/signup">
                      Start Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform covers all essential web development technologies with interactive tests and instant feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-soft transition-all duration-300 border-0 shadow-card">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-accent/10 text-accent">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Test Your Skills?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of students improving their web development skills every day.
            </p>
            {!isAuthenticated && (
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
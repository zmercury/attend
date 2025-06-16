import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const router = useRouter();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-8 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">The Future of Attendance Management</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient bg-300% inline-block">
              Attendance Made
            </span>
            <br />
            <span className="text-foreground">Simple & Smart</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            Transform how you track attendance with our intelligent platform. Designed for modern
            schools, built for efficiency.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push('/login')}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary/10 transition-all duration-300"
              onClick={() => router.push('/docs')}
            >
              Watch Demo
              <PlayCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-r from-purple-400 to-pink-500"
                  />
                ))}
              </div>
              <span className="ml-3">Trusted by 1000+ schools</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2">4.9/5 Rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


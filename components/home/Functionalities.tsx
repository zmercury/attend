import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, Users, Calendar, ChartBar, Shield, Clock, Zap, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: 'Smart Attendance',
        description: 'AI-powered attendance tracking that adapts to your needs. Mark attendance with a single click or use our advanced facial recognition.'
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: 'Student Management',
        description: 'Comprehensive student profiles with attendance history, performance metrics, and personalized insights.'
    },
    {
        icon: <Calendar className="h-8 w-8 text-primary" />,
        title: 'Smart Calendar',
        description: 'Intelligent calendar that highlights attendance patterns, upcoming events, and important dates.'
    },
    {
        icon: <ChartBar className="h-8 w-8 text-primary" />,
        title: 'Advanced Analytics',
        description: 'Get detailed insights with beautiful charts and reports. Track trends and make data-driven decisions.'
    },
    {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: 'Secure & Private',
        description: 'Enterprise-grade security with end-to-end encryption. Your data is always protected and private.'
    },
    {
        icon: <Clock className="h-8 w-8 text-primary" />,
        title: 'Time-Saving',
        description: 'Automate routine tasks and save hours every week. Focus on what matters most - your students.'
    },
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: 'Lightning Fast',
        description: 'Optimized for speed and performance. Mark attendance for hundreds of students in seconds.'
    },
    {
        icon: <Bell className="h-8 w-8 text-primary" />,
        title: 'Smart Notifications',
        description: 'Get instant alerts for attendance issues, upcoming events, and important updates.'
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Functionalities: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-background/95">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                        Powerful Features
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Everything you need to manage attendance efficiently and effectively
                    </motion.p>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={item}>
                            <Card className="h-full bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-border/50">
                                <CardHeader>
                                    <div className="mb-4 p-2 rounded-lg bg-primary/10 w-fit">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Functionalities;
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    Users, 
    Calendar, 
    BarChart3, 
    Search, 
    ArrowRight,
    Book,
    Settings,
    HelpCircle,
    FileText,
    Code,
    Database,
    Shield,
    Zap
} from 'lucide-react';
import Footer from '../components/Footer';

const sections = [
    {
        title: "Getting Started",
        icon: <BookOpen className="h-5 w-5" />,
        items: [
            { title: "Introduction", href: "#introduction" },
            { title: "Quick Start Guide", href: "#quick-start" },
            { title: "Installation", href: "#installation" },
            { title: "Configuration", href: "#configuration" },
        ]
    },
    {
        title: "Core Features",
        icon: <Zap className="h-5 w-5" />,
        items: [
            { title: "Attendance Tracking", href: "#attendance" },
            { title: "Student Management", href: "#students" },
            { title: "Calendar View", href: "#calendar" },
            { title: "Reports & Analytics", href: "#reports" },
        ]
    },
    {
        title: "Advanced",
        icon: <Settings className="h-5 w-5" />,
        items: [
            { title: "API Reference", href: "#api" },
            { title: "Customization", href: "#customization" },
            { title: "Integrations", href: "#integrations" },
            { title: "Security", href: "#security" },
        ]
    },
    {
        title: "Resources",
        icon: <HelpCircle className="h-5 w-5" />,
        items: [
            { title: "Tutorials", href: "#tutorials" },
            { title: "Best Practices", href: "#best-practices" },
            { title: "FAQ", href: "#faq" },
            { title: "Support", href: "#support" },
        ]
    }
];

const features = [
    {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: "Student Management",
        description: "Easily manage student profiles, track attendance history, and maintain comprehensive records."
    },
    {
        icon: <Calendar className="h-6 w-6 text-primary" />,
        title: "Smart Calendar",
        description: "Intuitive calendar interface for viewing and managing attendance across multiple classes."
    },
    {
        icon: <BarChart3 className="h-6 w-6 text-primary" />,
        title: "Advanced Analytics",
        description: "Generate detailed reports and insights to track attendance patterns and trends."
    },
    {
        icon: <Shield className="h-6 w-6 text-primary" />,
        title: "Security & Privacy",
        description: "Enterprise-grade security with end-to-end encryption and role-based access control."
    }
];

const technologies = [
    { name: "Next.js", description: "React framework for production", icon: <Code className="h-6 w-6" /> },
    { name: "TypeScript", description: "Type-safe JavaScript", icon: <FileText className="h-6 w-6" /> },
    { name: "Tailwind CSS", description: "Utility-first CSS framework", icon: <Code className="h-6 w-6" /> },
    { name: "Supabase", description: "Open source Firebase alternative", icon: <Database className="h-6 w-6" /> },
    { name: "Framer Motion", description: "Animation library for React", icon: <Zap className="h-6 w-6" /> },
    { name: "Shadcn UI", description: "Re-usable components", icon: <Book className="h-6 w-6" /> }
];

const DocsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                            Documentation
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Everything you need to know about our attendance management system
                        </p>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search documentation..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </motion.div>

                    {/* Navigation Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
                    >
                        {sections.map((section) => (
                            <Card key={section.title} className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            {section.icon}
                                        </div>
                                        <CardTitle className="text-lg">{section.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {section.items.map((item) => (
                                            <a
                                                key={item.title}
                                                href={item.href}
                                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.title}
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="bg-card/50 backdrop-blur-sm border border-border/50">
                                    <CardHeader>
                                        <div className="flex items-center space-x-2">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                {feature.icon}
                                            </div>
                                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-semibold mb-6">Technologies</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {technologies.map((tech) => (
                                <Card key={tech.name} className="bg-card/50 backdrop-blur-sm border border-border/50">
                                    <CardHeader>
                                        <div className="flex items-center space-x-2">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                {tech.icon}
                                            </div>
                                            <CardTitle className="text-lg">{tech.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-semibold mb-6">Getting Started</h2>
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
                            <CardContent className="p-6">
                                <ol className="space-y-4">
                                    <li className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">1</span>
                                        <div>
                                            <h3 className="font-semibold mb-1">Create an Account</h3>
                                            <p className="text-muted-foreground">Sign up for a new account or log in to your existing one.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">2</span>
                                        <div>
                                            <h3 className="font-semibold mb-1">Set Up Your Classes</h3>
                                            <p className="text-muted-foreground">Create your classes and add students to get started.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">3</span>
                                        <div>
                                            <h3 className="font-semibold mb-1">Start Tracking Attendance</h3>
                                            <p className="text-muted-foreground">Begin marking attendance and generating reports.</p>
                                        </div>
                                    </li>
                                </ol>
                                <Button className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DocsPage;
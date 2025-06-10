import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const faqs = [
    {
        question: "How does the attendance tracking work?",
        answer: "Our system offers multiple ways to track attendance. You can mark attendance manually, use QR codes, or implement facial recognition. The system automatically records timestamps and generates reports for your review."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and regular security audits to ensure your information is always protected."
    },
    {
        question: "Can I customize the attendance reports?",
        answer: "Absolutely! You can customize reports based on various parameters like date ranges, classes, or individual students. Export them in multiple formats including PDF, Excel, or CSV for your convenience."
    },
    {
        question: "What if I need technical support?",
        answer: "We offer 24/7 technical support through our help center. You can access documentation, video tutorials, or contact our support team directly through the platform."
    },
    {
        question: "Can I integrate with other school systems?",
        answer: "Yes, our platform offers seamless integration with popular school management systems, learning management systems (LMS), and other educational tools through our robust API."
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    return (
        <section className="py-24 bg-background/95">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Everything you need to know about our attendance management system
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-4"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className={cn(
                                    "w-full flex items-center justify-between p-6 rounded-lg transition-all duration-300",
                                    openIndex === index
                                        ? "bg-primary/10 border-primary/20"
                                        : "bg-card/50 hover:bg-card/80 border-border/50"
                                )}
                            >
                                <span className="text-lg font-semibold text-left">{faq.question}</span>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 text-muted-foreground transition-transform duration-300",
                                        openIndex === index && "transform rotate-180"
                                    )}
                                />
                            </button>
                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? "auto" : 0,
                                    opacity: openIndex === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-4 text-muted-foreground">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-muted-foreground">
                        Still have questions?{" "}
                        <a href="/docs" className="text-primary hover:underline">
                            Check our documentation
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
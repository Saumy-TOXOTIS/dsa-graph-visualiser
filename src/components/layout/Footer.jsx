// src/components/layout/Footer.jsx

import React from 'react';
import { motion } from 'framer-motion';

// Enhanced SocialIcon component with animations
const SocialIcon = ({ href, children }) => (
    <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="relative p-2 group"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.9 }}
    >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        <div className="relative z-10 text-gray-400 group-hover:text-white transition-colors duration-300">
            {children}
        </div>
    </motion.a>
);

const Footer = () => {
    return (
        <footer className="relative mt-16 py-12 px-4 text-center bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50 dark:to-transparent border-t border-gray-100 dark:border-gray-800">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
            
            <motion.div 
                className="text-sm text-gray-500 dark:text-gray-400 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Created by <motion.a 
                    href="https://github.com/Saumy-TOXOTIS" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 relative group"
                    whileHover={{ scale: 1.05 }}
                >
                    Saumy Tiwari
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.a>
            </motion.div>
            
            <motion.div 
                className="flex justify-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, staggerChildren: 0.1 }}
            >
                <SocialIcon href="https://github.com/Saumy-TOXOTIS">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                </SocialIcon>
                
                <SocialIcon href="https://linkedin.com/in/saumy-tiwari-170b33252">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                </SocialIcon>
            </motion.div>
            
            <motion.p 
                className="mt-8 text-xs text-gray-400 dark:text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                {new Date().getFullYear()} DSA Graph Visualizer.
            </motion.p>
        </footer>
    );
};

export default Footer;
"use client"
import React from 'react'

function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Decorative wave pattern at the top */}
            <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
                <svg className="w-full h-8 fill-current text-blue-400 dark:text-gray-700" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>



            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
                <div className="lg:flex lg:items-start lg:gap-8">
                    <div className="text-teal-600 dark:text-teal-300 w-[100px] md:w-[150px] lg:w-[200px] bg-white rounded-full p-3">
                        <img src="../images/Bloggy.png" alt="Bloggy" className="drop-shadow-lg " />
                    </div>


                    <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16">
                        <div className="col-span-1 lg:col-span-2">
                            <div>
                                <h2 className="text-2xl font-bold text-white dark:text-white">Stay Updated!</h2>
                                <p className="mt-4 text-white/90 dark:text-gray-300">
                                    Keep up with the latest articles and insights on various topics. Our blog is a place for ideas, inspiration, and learning.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/20 pt-8 dark:border-gray-700">
                    <div className="sm:flex sm:justify-between flex-col-reverse sm:flex-row">
                        <p className="text-sm text-white/80 dark:text-gray-400">
                            © {new Date().getFullYear()} Bloggy. All rights reserved.

                        </p>

                        <p className="text-sm text-white/80 dark:text-gray-400">
                            Crafted with passion by the Bloggy Team.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom decorative line with gradient */}
            <div className="w-full h-2 bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300"></div>
        </footer>
    )
}

export default Footer
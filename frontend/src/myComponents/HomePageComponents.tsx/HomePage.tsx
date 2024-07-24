import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import { useUser } from "@clerk/clerk-react";
import NewRoomPageModal from "./NewRoomPageModal";
import ExistingRoomPageModal from "./ExistingRoomPageModal";
import { CiGlobe } from 'react-icons/ci';

export default function HomePage() {
  const { user } = useUser();
  const isUserLoggedIn = !!user;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900 text-gray-800 dark:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col justify-between overflow-hidden">
        <motion.div
          className="text-center py-8 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-7">
            Code every line<br />live with your team!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Take your codebase and transform it into a live session with us.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center flex-wrap space-x-0 space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <NewRoomPageModal isUserLoggedIn={isUserLoggedIn} className="mb-12"/>
            <ExistingRoomPageModal isUserLoggedIn={isUserLoggedIn} className="mb-12" />
          </motion.div>
        
          <motion.div variants={itemVariants} className="flex justify-center flex-wrap space-y-4 sm:space-y-0 sm:space-x-4 mb-3 mt-1 text-sm">
            <span className="flex items-center text-lg font-semibold space-y-4 sm:space-y-0 sm:space-x-4">
              <img src="/code.png" alt="Code" className="h-12 mr-2" />
              <span>Code and Collaborate</span>
            </span>
            <span className="flex items-center text-lg font-semibold space-y-4 sm:space-y-0 sm:space-x-4">
              <img src="/dragdrop.png" alt="Drag & drop" className="h-12 mr-2" />
              <span>Drag & drop builder</span>
            </span>
            <span className="flex items-center text-lg font-semibold space-y-4 sm:space-y-0 sm:space-x-4">
              <img src="/live.png" alt="Cross-platform" className="h-12 mr-2" />
              <span>Code Live</span>
            </span>
          </motion.div>
        </motion.div>
        
        <motion.div variants={containerVariants} className="px-4">
          <h2 className="text-2xl font-bold text-center mb-8">LANGUAGES POWERED BY CodeSync</h2>
          <div className="grid mb-20 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            <motion.img src="/javascript.png" alt="JavaScript" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/c.png" alt="C" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/csharp.png" alt="C#" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/cpp.png" alt="C++" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/ruby.png" alt="Ruby" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/rust.png" alt="Rust" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/python.png" alt="Python" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/typescript.png" alt="TypeScript" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/sql.png" alt="SQL" className="h-24 mx-auto" variants={itemVariants} />
            <motion.img src="/java.png" alt="Java" className="h-24 mx-auto" variants={itemVariants} />
          </div>
        </motion.div>
        <motion.div>
        <footer className="bg-gray-900 text-gray-400 py-6">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              &copy; 2024 Code Sync Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="flex items-center hover:text-white">
                <CiGlobe className="mr-2" />
                English (US)
              </a>
            </div>
          </div>
        </footer>
        </motion.div>
      </main>
    </div>
  );
}

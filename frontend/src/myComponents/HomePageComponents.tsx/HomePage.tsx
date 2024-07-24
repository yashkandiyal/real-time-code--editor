import React from "react";
import { motion } from "framer-motion";
import { FiCode, FiUsers, FiLock } from "react-icons/fi";
import Navbar from "../Navbar/Navbar";
import CompanyLogo from "../../shadcn/components/ui/CompanyLogo";
import ExistingRoomPageModal from "./ExistingRoomPageModal";
import NewRoomPageModal from "./NewRoomPageModal";
import { Card } from "../../shadcn/components/ui/card";
import { useUser } from "@clerk/clerk-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 text-gray-800 dark:text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12 md:py-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                Welcome to 
              </h1>
              <CompanyLogo className="h-14 md:h-16" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400">
              Coding Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Create live rooms & connect with multiple collaborators to code in real-time.
            </p>
            <motion.div
              className="flex flex-col gap-4"
              variants={containerVariants}
            >
              <Feature
                icon={<FiCode className="w-6 h-6" />}
                title="Live Coding"
                description="Code together in real-time with your team"
              />
              <Feature
                icon={<FiUsers className="w-6 h-6" />}
                title="Collaboration"
                description="Connect with multiple collaborators seamlessly"
              />
              <Feature
                icon={<FiLock className="w-6 h-6" />}
                title="Secure"
                description="Your code and conversations are always protected"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Start Coding Now
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                Jump into an instant room or join an existing one to begin collaborating.
              </p>
              <div className="flex flex-col gap-4">
                <NewRoomPageModal isUserLoggedIn={isUserLoggedIn} />
                <ExistingRoomPageModal isUserLoggedIn={isUserLoggedIn} />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  return (
    <motion.div
      className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-xs"
      variants={itemVariants}
    >
      <div className="flex-shrink-0 text-indigo-500">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}

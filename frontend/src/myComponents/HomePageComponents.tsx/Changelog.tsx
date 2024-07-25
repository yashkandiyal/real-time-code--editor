import { motion } from "framer-motion";
import { MdErrorOutline } from "react-icons/md";
import { Badge } from "../../shadcn/components/ui/badge";  
import { Link } from "react-router-dom"; 
import Navbar from "../Navbar/Navbar";
export default function Changelog() {
  const changelogData = [
    {
      date: "July 25, 2024",
      version: "1.1",
      changes: [
        "Added several new pages to the application",
        "Fixed CodeMirror editor bug",
        "Fixed technical problems that led to failures"
      ]
    },
    {
      date: "July 20, 2024",
      version: "1.0",
      changes: [
        "Added the initial set of features",
        "Developed the first version of the application",
      ]
    }
  ];

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         
      <div className="text-center mb-12">
        <motion.img
          src="/bannerNew.png"
          alt="What's new?"
          className="w-full max-h-48 object-cover rounded-lg shadow-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          A changelog of the latest <strong>CodeSync</strong> feature releases, product updates and important bug fixes.
        </p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Changelog in 2024
        </Link>
      </div>

      {changelogData.map((log, index) => (
        <motion.div
          key={index}
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className="flex items-center mb-4">
            <MdErrorOutline className="text-gray-400 dark:text-gray-500 mr-2" />
            <time className="text-gray-600 dark:text-gray-300">{log.date}</time>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-indigo-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Version {log.version}</h2>
              <Badge className="">New</Badge>
            </div>
            <ul className="space-y-2">
              {log.changes.map((change, i) => (
                <li key={i} className="">
                  - {change}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
    </>
  );
}
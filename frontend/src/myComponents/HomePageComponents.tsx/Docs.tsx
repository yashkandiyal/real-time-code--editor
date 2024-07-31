//@ts-nocheck
import { useState } from 'react';
import Alert, { AlertTitle, AlertDescription } from '../../shadcn/components/ui/Alert';
// import { Collapsible } from '../../shadcn/components/ui/collapsible';
import Navbar from "../Navbar/Navbar";

const Docs = () => {
  const [darkMode] = useState(false);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
     
     <Navbar />

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="col-span-1 lg:col-span-1">
          <nav>
            <ul>
              <li className="my-2">
                <a href="#getting-started" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Getting Started</a>
                <ul className="ml-4">
                  <li><a href="#introduction" className="block py-1 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Introduction</a></li>
                  <li><a href="#installation" className="block py-1 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Installation</a></li>
                  <li><a href="#theming" className="block py-1 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Theming</a></li>
                </ul>
              </li>
              <li className="my-2">
                <a href="#components" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Components</a>
              </li>
              <li className="my-2">
                <a href="#faq" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">FAQ</a>
              </li>
            </ul>
          </nav>
        </aside>
        
        <section className="col-span-1 lg:col-span-3">
          <div id="getting-started">
            <h1 className="text-3xl font-bold mb-4">Introduction</h1>
            <p className="mb-4">Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.</p>
            <Alert isOpen={true} onConfirm={() => {}} onCancel={() => {}} action="copy">
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>This is NOT a component library. It's a collection of re-usable components that you can copy and paste into your apps.</AlertDescription>
            </Alert>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Docs;

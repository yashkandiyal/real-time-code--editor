import React from 'react';

interface TabProps {
  title: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

const Tab: React.FC<TabProps> = ({ title, active, onClick }) => (
  <button
    className={`px-4 py-2 ${active ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'} rounded-lg`}
    onClick={onClick}
  >
    {title}
  </button>
);

interface TabsProps {
  tabs: { title: string; content: React.ReactNode }[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            title={tab.title}
            active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default Tabs;
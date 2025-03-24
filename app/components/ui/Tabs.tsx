'use client';

import React, { useState, ReactNode, useEffect } from 'react';

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: 'underline' | 'pills' | 'enclosed';
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  onChange?: (tabId: string) => void;
};

export function Tabs({
  tabs,
  defaultTab,
  variant = 'underline',
  className = '',
  tabClassName = '',
  contentClassName = '',
  onChange
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || (tabs.length > 0 ? tabs[0].id : ''));

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const variantStyles = {
    underline: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-2 border-b-2 -mb-px',
      active: 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400',
      inactive: 'border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
    },
    pills: {
      container: 'flex space-x-2',
      tab: 'px-4 py-2 rounded-full',
      active: 'bg-blue-600 text-white',
      inactive: 'hover:bg-gray-100 dark:hover:bg-gray-700'
    },
    enclosed: {
      container: 'flex',
      tab: 'px-4 py-2 border-t border-l border-r',
      active: 'rounded-t-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
      inactive: 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
    }
  };
  
  const styles = variantStyles[variant];

  return (
    <div className={`w-full ${className}`}>
      <div className={`flex flex-wrap ${styles.container}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`
              ${styles.tab}
              ${activeTab === tab.id ? styles.active : styles.inactive}
              font-medium text-sm transition-colors
              ${tabClassName}
            `}
            onClick={() => handleTabClick(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <div className="flex items-center space-x-2">
              {tab.icon && <div>{tab.icon}</div>}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
      <div className={`py-4 ${contentClassName}`}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
} 
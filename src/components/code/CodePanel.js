import React, { useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { generateHTML, generateCSS } from '../../core/utils/generator';
import { componentLibrary } from '../../config/componentLibrary'; // Needed for generator context
import { Clipboard, Check } from 'lucide-react';

const CodePanel = () => {
  const { canvasState } = useCanvas();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('html'); // 'html' or 'css'
  const [copied, setCopied] = useState(false);

  const htmlCode = React.useMemo(() => generateHTML(canvasState, componentLibrary), [canvasState]);
  const cssCode = React.useMemo(() => generateCSS(canvasState, componentLibrary), [canvasState]);

  const handleCopyToClipboard = () => {
    const codeToCopy = activeTab === 'html' ? htmlCode : cssCode;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const tabButtonClass = (tabName) =>
    `px-4 py-2 text-sm font-medium focus:outline-none ` +
    `${activeTab === tabName
      ? (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-blue-600')
      : (theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700')}`;

  const codeBlockClass = `whitespace-pre-wrap p-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-green-400' : 'bg-gray-50 text-purple-700'} font-mono`;

  return (
    <div className={`h-64 flex flex-col ${theme === 'dark' ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
      <div className="flex justify-between items-center p-1 border-b_">
        <div>
          <button
            onClick={() => setActiveTab('html')}
            className={tabButtonClass('html')}
          >
            {t('htmlTab')}
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={tabButtonClass('css')}
          >
            {t('cssTab')}
          </button>
        </div>
        <button
            onClick={handleCopyToClipboard}
            title="Copy to clipboard"
            className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} mr-2`}
        >
            {copied ? <Check size={18} className="text-green-500" /> : <Clipboard size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />}
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        {activeTab === 'html' && (
          <pre className={codeBlockClass}>
            <code>{htmlCode}</code>
          </pre>
        )}
        {activeTab === 'css' && (
          <pre className={codeBlockClass}>
            <code>{cssCode}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodePanel;

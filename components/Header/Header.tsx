import { FC } from 'react';
import { Button } from '../ui/button';

const Header: FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            EO
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Easy Onboarding</h1>
            <p className="text-sm text-gray-500">Customer Onboarding Portal</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <Button variant="outline">Help</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

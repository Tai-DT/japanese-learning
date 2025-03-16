import React from 'react';
import Link from 'next/link';
const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800">Japanese Learning App</h1>
        <nav className="mt-2">
          <ul className="flex space-x-4">
            <li><Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
            <li><Link href="/lessons" className="text-blue-600 hover:text-blue-800">Lessons</Link></li>
            <li><Link href="/practice" className="text-blue-600 hover:text-blue-800">Practice</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
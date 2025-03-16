// components/shared/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <p className="text-center">© {new Date().getFullYear()} Japanese Learning App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
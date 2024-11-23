import Link from 'next/link';

const footerLinks = {
  'Product': [
    { label: 'Feature', href: '#' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '#' },
  ],
  'Resources': [
    { label: 'Tutorial', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Documentation', href: '#' },
  ],
  'About': [
    { label: 'About Us', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <Link href="/" className="font-bold text-2xl">
              picstack
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              AI-driven image processing tool, making creation easier
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-medium mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>© 2024 picstack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 
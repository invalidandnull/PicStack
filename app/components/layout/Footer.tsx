import Link from 'next/link';

const footerLinks = {
  '产品': [
    { label: '功能介绍', href: '#' },
    { label: '价格方案', href: '/pricing' },
    { label: '更新日志', href: '#' },
  ],
  '资源': [
    { label: '使用教程', href: '#' },
    { label: '帮助中心', href: '#' },
    { label: 'API 文档', href: '#' },
  ],
  '关于': [
    { label: '关于我们', href: '#' },
    { label: '联系我们', href: '#' },
    { label: '用户协议', href: '#' },
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
              AI 驱动的图片处理工具，让创作更简单
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
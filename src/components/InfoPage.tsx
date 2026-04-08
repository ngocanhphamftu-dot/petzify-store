import Link from "next/link";

export default function InfoPage({
  title,
  breadcrumb,
  children,
}: {
  title: string;
  breadcrumb?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#F36621]">Home</Link>
        <span>/</span>
        <span className="text-gray-700">{breadcrumb || title}</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b">{title}</h1>
      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

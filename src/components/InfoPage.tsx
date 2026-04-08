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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[#F36621] transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600">{breadcrumb || title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{title}</h1>
      <div className="h-1 w-16 bg-[#F36621] rounded-full mb-10" />

      {/* Content */}
      <div
        className="
          text-gray-600
          text-[15px]
          leading-[1.9]
          space-y-6
          [&>p]:text-gray-600
          [&>p]:leading-[1.9]
          [&>h2]:text-lg
          [&>h2]:font-bold
          [&>h2]:text-gray-800
          [&>h2]:mt-10
          [&>h2]:mb-3
          [&>h2]:pb-2
          [&>h2]:border-b
          [&>h2]:border-gray-100
          [&>h3]:text-base
          [&>h3]:font-semibold
          [&>h3]:text-gray-700
          [&>h3]:mt-6
          [&>h3]:mb-2
          [&>ul]:space-y-2
          [&>ul]:pl-5
          [&>ul>li]:relative
          [&>ul>li]:pl-1
          [&>ul>li]:list-disc
          [&>ul>li]:marker:text-[#F36621]
          [&>ol]:space-y-2
          [&>ol]:pl-5
          [&>ol>li]:list-decimal
          [&>ol>li]:marker:text-[#F36621]
          [&>strong]:text-gray-800
          [&_a]:text-[#F36621]
          [&_a]:underline
          [&_a:hover]:text-[#d4551a]
          [&>table]:w-full
          [&>table]:text-sm
          [&>table]:border-collapse
          [&>table_th]:bg-[#F36621]
          [&>table_th]:text-white
          [&>table_th]:px-4
          [&>table_th]:py-3
          [&>table_th]:text-left
          [&>table_td]:px-4
          [&>table_td]:py-3
          [&>table_td]:border-b
          [&>table_td]:border-gray-100
        "
      >
        {children}
      </div>
    </div>
  );
}

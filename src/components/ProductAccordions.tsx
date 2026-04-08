"use client";

import { useState } from "react";

interface AccordionItem {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

function Accordion({ title, icon, content, defaultOpen = false }: AccordionItem & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="flex items-center gap-2.5 font-semibold text-gray-800 text-sm">
          {icon}
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm text-gray-600 leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}

export default function ProductAccordions({ description }: { description: string }) {
  return (
    <div className="border border-gray-200 rounded-2xl px-5 divide-y-0">
      <Accordion
        defaultOpen={true}
        title="Description"
        icon={
          <svg className="w-4 h-4 text-[#F36621]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        content={
          <div
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: description || "<p>No description available.</p>" }}
          />
        }
      />
      <Accordion
        title="Shipping & Returns"
        icon={
          <svg className="w-4 h-4 text-[#F36621]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
        content={
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🚚</span>
              <div>
                <p className="font-semibold text-gray-800">Free US Shipping</p>
                <p className="text-gray-500">Free standard shipping on all US orders. Estimated delivery: 10–17 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">⏱️</span>
              <div>
                <p className="font-semibold text-gray-800">Production Time</p>
                <p className="text-gray-500">Each item is custom-made. Please allow 3–5 business days for production before shipping.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">↩️</span>
              <div>
                <p className="font-semibold text-gray-800">Returns & Exchanges</p>
                <p className="text-gray-500">Since all products are personalized, we do not accept returns unless the item is defective or damaged. Contact us within 30 days of delivery for assistance.</p>
              </div>
            </div>
          </div>
        }
      />
      <Accordion
        title="Personalization"
        icon={
          <svg className="w-4 h-4 text-[#F36621]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        content={
          <div className="space-y-2">
            <p className="text-gray-600">This product can be personalized with a name, photo, or custom text. To personalize:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-gray-500 ml-1">
              <li>Add the item to your cart</li>
              <li>During checkout, fill in the personalization details in the order notes</li>
              <li>Our team will reach out if we need any clarification</li>
            </ol>
            <p className="text-orange-600 text-xs font-medium mt-2">📝 Please double-check all names and details before submitting your order.</p>
          </div>
        }
      />
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery({
    queryKey: ["search", q],
    queryFn: () => productsApi.list({ search: q, is_active: true }),
    enabled: q.length > 1,
  });

  const results: Product[] = data?.data?.results ?? data?.data ?? [];

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
    else setQ("");
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      <div className="border-b border-[#E2DDD8] px-6 lg:px-12 py-5 flex items-center gap-6">
        <Search size={18} strokeWidth={1.5} className="text-[#8A8A8A] shrink-0" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, categories…"
          className="flex-1 font-serif text-xl font-light focus:outline-none placeholder:text-[#C0B8B0]"
        />
        <button onClick={onClose} className="hover:text-[#C9A96E] transition-colors">
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
        {q.length < 2 ? (
          <div className="text-center text-[#8A8A8A] text-sm mt-20">
            <p className="font-serif text-2xl text-[#C0B8B0] font-light mb-2">Start typing to search</p>
          </div>
        ) : results.length === 0 ? (
          <p className="text-[#8A8A8A] font-light text-center mt-20">No results for "{q}"</p>
        ) : (
          <div className="max-w-2xl mx-auto">
            <p className="text-label text-[#8A8A8A] mb-6">{results.length} result{results.length !== 1 ? "s" : ""}</p>
            <div className="space-y-4">
              {results.map((p) => {
                const img = p.images?.find((i) => i.is_primary) ?? p.images?.[0];
                return (
                  <Link
                    key={p.id}
                    href={`/shop/${p.slug}`}
                    onClick={onClose}
                    className="flex gap-4 items-center p-3 hover:bg-[#F7F4F0] transition-colors group"
                  >
                    <div className="w-16 h-16 bg-[#F0ECE6] relative shrink-0 overflow-hidden">
                      {img && (
                        <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-[#C9A96E] transition-colors">{p.name}</p>
                      <p className="text-[#8A8A8A] text-sm font-light">{p.category_detail?.name}</p>
                    </div>
                    <p className="text-sm font-medium shrink-0">
                      {p.currency_detail?.symbol}{parseFloat(p.price).toLocaleString()}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

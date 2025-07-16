"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export function FilterSheet() {
  return (
    <div className="mb-8 flex justify-center md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="lg" className="flex items-center gap-2 rounded-full py-2 font-semibold shadow-md">
            <SlidersHorizontal />
            <span>Filter & Sort</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter & Sort</SheetTitle>
            <SheetDescription>
              Refine your search to find the perfect item.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[var(--neutral-dark)]">Filter by:</h3>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 py-3 pl-5 pr-12 text-base font-medium text-[var(--neutral-dark)] transition-colors hover:bg-gray-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option>Category</option>
                  <option>Candles</option>
                  <option>Crafts</option>
                  <option>Kits</option>
                </select>
                <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-6 pr-3 text-gray-700" />
              </div>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 py-3 pl-5 pr-12 text-base font-medium text-[var(--neutral-dark)] transition-colors hover:bg-gray-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option>Price Range</option>
                  <option>$0 - $15</option>
                  <option>$15 - $25</option>
                  <option>$25+</option>
                </select>
                <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-6 pr-3 text-gray-700" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[var(--neutral-dark)]">Sort by:</h3>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 py-3 pl-5 pr-12 text-base font-medium text-[var(--neutral-dark)] transition-colors hover:bg-gray-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option>Popularity</option>
                  <option>New Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-6 pr-3 text-gray-700" />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 
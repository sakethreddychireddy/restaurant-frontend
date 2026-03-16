import { useState, useMemo } from "react";
import { MenuCard } from "@/components/features/menu/MenuCard";
import { CategoryFilter } from "@/components/features/menu/CategoryFilter";
import { MenuItemModal } from "@/components/features/menu/MenuItemModal";
import { MenuCardSkeleton } from "@/components/ui/Skeleton";
import { useAvailableMenu, useMenuByCategory } from "@/hooks/useMenu";

export const MenuPage = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: allItems = [], isLoading: allLoading } = useAvailableMenu();
  const { data: categoryItems = [], isLoading: categoryLoading } =
    useMenuByCategory(category);

  const baseItems = category === "all" ? allItems : categoryItems;
  const isLoading = category === "all" ? allLoading : categoryLoading;

  const categories = useMemo(
    () => [...new Set(allItems.map((i) => i.category))],
    [allItems],
  );

  const filtered = useMemo(
    () =>
      search.trim()
        ? baseItems.filter(
            (i) =>
              i.name.toLowerCase().includes(search.toLowerCase()) ||
              i.description.toLowerCase().includes(search.toLowerCase()),
          )
        : baseItems,
    [baseItems, search],
  );

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="hero-warm grain relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-terra-300 font-body font-700 text-sm tracking-widest mb-4">
              TODAY'S SELECTION
            </p>
            <h1 className="font-display font-700 text-6xl sm:text-7xl text-white mb-4 leading-none">
              Crafted with
              <br />
              <span className="text-cream-400 italic">Passion</span>
            </h1>
            <p className="text-cream-300 text-lg font-body max-w-lg leading-relaxed">
              Fresh ingredients, bold flavors, perfected over generations.
            </p>
          </div>
          <div className="mt-10 max-w-lg animate-fade-up-d2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-400">
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-terra-400 transition-all font-body text-sm"
              />
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute top-10 right-20 w-72 h-72 bg-terra-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 text-8xl opacity-10 select-none">
            🌿
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selected={category}
            onChange={(cat) => {
              setCategory(cat);
              setSearch("");
            }}
          />
        </div>

        {/* Results */}
        {!isLoading && (
          <p className="text-sm text-warm-400 font-body mb-6">
            {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}
            {category !== "all" && ` in "${category}"`}
            {search && ` matching "${search}"`}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="animate-fade-up"
                style={{
                  animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
                  animationFillMode: "both",
                }}
              >
                <MenuCard
                  item={item}
                  onViewDetail={(id) => setSelectedItemId(id)}
                />
              </div>
            ))}
          </div>
        ) : (
          // Replace the empty state section
          <div className="text-center py-24 animate-fade-up">
            <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🍽️</span>
            </div>
            <h3 className="font-display text-2xl font-700 text-charcoal mb-2">
              No dishes found
            </h3>
            <p className="text-warm-400 font-body">
              Try a different search or category
            </p>
          </div>
        )}
      </div>

      {selectedItemId && (
        <MenuItemModal
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </div>
  );
};

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

const CategoryFilter = ({ categories, active, onChange }: CategoryFilterProps) => (
  <div className="flex flex-wrap gap-3">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={`px-5 py-2 rounded-full text-sm font-sans tracking-wide transition-all duration-200 ${
          active === cat
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:text-foreground border border-border"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;


import { Link } from 'react-router-dom';
import { Camera, Building2, Utensils, Flower2, ShoppingBag, Music, Users, Sparkles } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'Photography',
    icon: Camera,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 842
  },
  {
    id: 2,
    title: 'Venues',
    icon: Building2,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 517
  },
  {
    id: 3,
    title: 'Catering',
    icon: Utensils,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 635
  },
  {
    id: 4,
    title: 'Decor & Design',
    icon: Flower2,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 428
  },
  {
    id: 5,
    title: 'Attire & Accessories',
    icon: ShoppingBag,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 372
  },
  {
    id: 6,
    title: 'Music & Entertainment',
    icon: Music,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 295
  },
  {
    id: 7,
    title: 'Planning & Coordination',
    icon: Users,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 184
  },
  {
    id: 8,
    title: 'Beauty & Health',
    icon: Sparkles,
    color: 'bg-wedding-orange-light',
    iconColor: 'text-wedding-orange',
    count: 246
  }
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-wedding-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-wedding-navy mb-4">Browse by Category</h2>
          <p className="text-wedding-gray max-w-2xl mx-auto">Find the perfect vendors for every aspect of your wedding day.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group rounded-2xl border border-wedding-orange/10 bg-white p-6 text-center transition-all hover:shadow-card overflow-hidden relative animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${category.color} transition-all duration-300 group-hover:scale-110`}>
                <category.icon className={`h-7 w-7 ${category.iconColor}`} />
              </div>
              <h3 className="mb-1 font-semibold text-wedding-navy group-hover:text-wedding-orange transition-custom">{category.title}</h3>
              <p className="text-sm text-wedding-gray">{category.count} vendors</p>

              {/* Background hover effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-wedding-orange/0 to-wedding-orange/0 opacity-0 group-hover:opacity-5 transition-all duration-300"></div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/categories" className="text-wedding-orange hover:text-wedding-orange-hover font-medium inline-flex items-center transition-custom text-lg">
            View all categories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

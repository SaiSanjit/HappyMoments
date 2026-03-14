export interface Vendor {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    price: number;
    location: string;
    images: string[];
    isVerified: boolean;
    isFavorite?: boolean;
}

export const CATEGORIES = [
    { id: "all", name: "All", icon: "LayoutGrid" },
    { id: "photography", name: "Photography", icon: "Camera" },
    { id: "decor", name: "Decor", icon: "Flower2" },
    { id: "venues", name: "Venues", icon: "Home" },
    { id: "makeup", name: "Makeup", icon: "Sparkles" },
    { id: "catering", name: "Catering", icon: "Utensils" },
    { id: "music", name: "Music", icon: "Music" },
];

export const MOCK_VENDORS: Vendor[] = [
    {
        id: "1",
        name: "Golden Hour Photography",
        category: "Photography",
        rating: 4.9,
        reviewCount: 128,
        price: 45000,
        location: "Jubilee Hills, Hyderabad",
        images: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
        ],
        isVerified: true,
    },
    {
        id: "2",
        name: "Bloom & Bliss Decor",
        category: "Decor",
        rating: 4.8,
        reviewCount: 85,
        price: 30000,
        location: "Banjara Hills, Hyderabad",
        images: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
            "https://images.unsplash.com/photo-1522158634458-a5dc326f4e07?w=800&q=80",
        ],
        isVerified: true,
    },
    {
        id: "3",
        name: "Grand Palace Mandapa",
        category: "Venues",
        rating: 4.7,
        reviewCount: 210,
        price: 150000,
        location: "Gachibowli, Hyderabad",
        images: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
        ],
        isVerified: false,
    },
    {
        id: "4",
        name: "Starlight Music & Lights",
        category: "Music",
        rating: 5.0,
        reviewCount: 42,
        price: 25000,
        location: "Secunderabad",
        images: [
            "https://images.unsplash.com/photo-1459749411177-042180ce673b?w=800&q=80",
            "https://images.unsplash.com/photo-1501612780327-4504349ed95f?w=800&q=80",
        ],
        isVerified: true,
    },
];

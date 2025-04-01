
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "WedFinder helped us find the perfect photographer for our traditional ceremony. Couldn't be happier!",
    author: "Priya & Arjun",
    location: "Mumbai, Maharashtra",
    rating: 5,
    image: "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    text: "We found our dream venue for our destination wedding through this platform. The process was seamless!",
    author: "Meera & Rahul",
    location: "Jaipur, Rajasthan",
    rating: 5,
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    text: "The catering vendors we connected with served authentic cuisine that impressed all our wedding guests.",
    author: "Ananya & Vivek",
    location: "Bangalore, Karnataka",
    rating: 4,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-wedding-navy mb-4">What Couples Say</h2>
          <p className="text-wedding-gray max-w-2xl mx-auto">Real experiences from couples who found their perfect wedding vendors.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-wedding-light rounded-2xl p-6 shadow-subtle hover:shadow-card transition-all duration-300 animate-fade-up border border-wedding-orange/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-wedding-orange fill-wedding-orange' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <p className="text-wedding-navy mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-wedding-navy">{testimonial.author}</h4>
                  <p className="text-sm text-wedding-gray">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

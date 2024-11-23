import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Mr. Zhang',
    role: 'Seller',
    content: 'Using picstack, my product image quality has been improved, and sales have increased.',
    avatar: '/avatars/1.png'
  },
  {
    name: 'Ms. Li',
    role: 'Designer',
    content: 'The AI functions are very powerful, saving me a lot of time on image processing, and the results are also professional.',
    avatar: '/avatars/2.png'
  },
  {
    name: 'Mr. Wang',
    role: 'Content Creator',
    content: 'A one-stop image processing tool, no longer switching between multiple software.',
    avatar: '/avatars/3.png'
  }
];

export default function Testimonials() {
  return (
    <div className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          User Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="text-center">
              <CardHeader>
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 
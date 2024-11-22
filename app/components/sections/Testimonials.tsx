import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const testimonials = [
  {
    name: '张先生',
    role: '电商卖家',
    content: '使用 picstack 让我的产品图片质量提升了一个档次，销量明显提升。',
    avatar: '/avatars/1.png'
  },
  {
    name: '李女士',
    role: '设计师',
    content: 'AI 功能非常强大，节省了我大量的图片处理时间，效果也很专业。',
    avatar: '/avatars/2.png'
  },
  {
    name: '王先生',
    role: '自媒体创作者',
    content: '一站式的图片处理工具，再也不用在多个软件之间切换了。',
    avatar: '/avatars/3.png'
  }
];

export default function Testimonials() {
  return (
    <div className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          用户评价
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
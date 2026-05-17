import { RevealSection } from '@/components/RevealSection';
import { ParallaxOrb } from '@/components/ParallaxOrb';
import { Mail, Github, Linkedin, Instagram, ArrowUpRight, Send, Copy, Check, MessageCircle, Loader2, Youtube } from 'lucide-react';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/naveen672', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/naveen-r-mys/', icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/techvibe.ka?igsh=engzaDVscDFrcWQ0&utm_source=qr', icon: Instagram },
  { label: 'WhatsApp', href: 'https://wa.me/919611391210', icon: MessageCircle },
  { label: 'YouTube', href: 'https://www.youtube.com/@TechVibeKA', icon: Youtube },
];

// EmailJS Configuration - Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_7aijlt3';
const EMAILJS_TEMPLATE_ID = 'template_a0wiz6k';
const EMAILJS_PUBLIC_KEY = '2Psm_VKXWVtUVwOUN';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const email = 'naveenravi.ch@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: email,
        },
        EMAILJS_PUBLIC_KEY
      );

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });

      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      toast({
        title: "Failed to send",
        description: "Something went wrong. Please try again or email me directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-section px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* iOS 26 Orbs with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <ParallaxOrb variant="primary" speed={0.05} className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bottom-[-100px] md:bottom-[-200px] left-1/2 -translate-x-1/2" />
        <ParallaxOrb variant="secondary" speed={0.08} className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] top-20 right-[-50px] md:right-[-100px] hidden sm:block" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto relative">
        <RevealSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 liquid-glass-badge mb-4 md:mb-6">
            <Send className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-caption font-medium text-primary">Get in Touch</span>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <h2 className="text-3xl sm:text-4xl md:text-display font-display mb-4 md:mb-6">
            Let's <span className="gradient-text">connect</span>
          </h2>
        </RevealSection>

        <RevealSection delay={200}>
          <p className="text-base md:text-subheading text-muted-foreground max-w-xl mb-8 md:mb-12">
            Always interested in hearing about new projects, collaborations, 
            or just chatting about tech.
          </p>
        </RevealSection>

        {/* Contact Form */}
        <RevealSection delay={250}>
          <form ref={formRef} onSubmit={handleSubmit} className="mb-8 md:mb-12 p-4 md:p-6 rounded-2xl md:rounded-3xl liquid-glass-card">
            <div className="grid gap-4 md:gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Hi Naveen, I'd like to discuss..."
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </RevealSection>

        <RevealSection delay={300}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl liquid-glass-card"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="text-base md:text-xl font-display font-semibold group-hover:text-primary transition-colors break-all">
                {email}
              </span>
            </a>
            
            <button
              onClick={copyEmail}
              className="p-3 md:p-4 rounded-xl md:rounded-2xl liquid-glass-button self-start sm:self-auto"
            >
              {copied ? (
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </RevealSection>

        <RevealSection delay={400}>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 md:gap-3 px-4 py-3 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl liquid-glass-card"
              >
                <link.icon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                <span className="font-medium text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {link.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
              </a>
            ))}
          </div>
        </RevealSection>

        {/* Code snippet */}
        <RevealSection delay={500}>
          <div className="mt-12 md:mt-16 p-4 md:p-6 rounded-2xl md:rounded-3xl liquid-glass-card overflow-hidden">
            <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400" />
              <span className="ml-2 md:ml-3 text-[10px] md:text-xs text-muted-foreground font-mono">contact.ts</span>
            </div>
            <pre className="font-mono text-xs md:text-sm overflow-x-auto">
              <code className="text-muted-foreground">
                <span className="text-primary">const</span> developer = {'{\n'}
                {'  '}name: <span className="text-green-500">"Naveen R"</span>,{'\n'}
                {'  '}available: <span className="text-accent">true</span>,{'\n'}
                {'  '}location: <span className="text-green-500">"Mysore / Bangalore"</span>,{'\n'}
                {'  '}interests: [<span className="text-green-500">"AI"</span>, <span className="text-green-500">"Web"</span>, <span className="text-green-500">"Systems"</span>]{'\n'}
                {'}'};
              </code>
            </pre>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

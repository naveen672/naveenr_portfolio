import { RevealSection } from '@/components/RevealSection';
import { Github, Linkedin, Instagram, ArrowUpRight, Copy, Check, MessageCircle, Youtube } from 'lucide-react';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { SlideButton } from '@/components/ui/slide-button';

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
  const [sliderStatus, setSliderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const email = 'naveenravi.ch@gmail.com';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy", description: `Email me at ${email}`, variant: "destructive" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const canSend = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before sending.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const sendEmail = async () => {
    setSliderStatus('loading');
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
      setSliderStatus('success');
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setSliderStatus('error');
      toast({
        title: "Failed to send",
        description: "Something went wrong. Please try again or email me directly.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const inputClass =
    'w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-foreground placeholder:text-white/35 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-colors';

  return (
    // `dark` scopes the dark tokens to this finale, whatever the site theme is.
    <section id="contact" data-nav-tone="dark" className="dark relative overflow-hidden bg-[#07080b] text-foreground px-5 sm:px-8 md:px-12 pt-4 md:pt-8 pb-20">
      <div className="relative mx-auto max-w-6xl 2xl:max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <RevealSection delay={150} className="lg:col-span-7">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-[28px] bg-white/[0.03] p-5 md:p-8 ring-1 ring-white/10"
            >
              <div className="grid gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm text-muted-foreground">Your name</label>
                    <input type="text" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">Your email</label>
                    <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm text-muted-foreground">Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder="Hi Naveen, I’d like to discuss…" className={`${inputClass} resize-none`} />
                </div>
                <div className="pt-1">
                  <SlideButton canComplete={canSend} onSlide={sendEmail} sliderStatus={sliderStatus} />
                </div>
              </div>
            </form>
          </RevealSection>

          {/* Direct lines */}
          <RevealSection delay={250} className="lg:col-span-5">
            <p className="text-sm text-muted-foreground">Email</p>
            <div className="mt-2 flex items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="min-w-0 truncate font-display text-xl md:text-2xl font-medium tracking-[-0.02em] underline decoration-white/20 underline-offset-8 transition-colors hover:decoration-primary"
              >
                {email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? 'Email copied' : 'Copy email address'}
                className="shrink-0 rounded-full p-2.5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>

            <p className="mt-10 text-sm text-muted-foreground">Elsewhere</p>
            <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 py-4"
                  >
                    <link.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                    <span className="flex-1 text-lg font-medium">{link.label}</span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Based in Mysore / Bangalore · Available for projects
            </p>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

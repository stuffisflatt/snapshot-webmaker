"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Share2, Star } from "lucide-react"
// `motion` is the current package name of Framer Motion (same API), already in this project.
import { motion, useAnimation, useInView, type Variants } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

export interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  content: string
  rating: number
  avatar?: string
  /** Placeholder content: shows a visible "sample" tag so it is never mistaken for a real review. */
  sample?: boolean
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  /** Replaces the company row, e.g. with a real rating link. */
  footer?: ReactNode
  /** Shown at the top of the left column, above the headline (e.g. an overall rating). */
  header?: ReactNode
  shareLabel?: string
  shareUrl?: string
  sampleLabel?: string
  dotLabel?: (index: number) => string
  className?: string
  id?: string
}

export function AnimatedTestimonials({
  title = "Loved by the community",
  subtitle = "Don't just take our word for it. See what developers and companies have to say about our starter template.",
  badgeText = "Trusted by developers",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted by developers from companies worldwide",
  footer,
  header,
  shareLabel = "Share",
  shareUrl,
  sampleLabel = "Sample",
  dotLabel = index => `View testimonial ${index + 1}`,
  className,
  id = "testimonials",
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Refs for scroll animations
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Auto rotate testimonials
  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} id={id} className={`py-24 overflow-hidden bg-muted/30 ${className || ""}`}>
      <div className="px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-16 w-full md:grid-cols-2 lg:gap-24"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="space-y-6">
              {badgeText && (
                <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary">
                  <Star className="mr-1 h-3.5 w-3.5 fill-primary" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 className="clinic-section-title">{title}</h2>

              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">{subtitle}</p>

              <div className="flex items-center gap-3 pt-4">
                {testimonials.map((_, index) => (
                  <Button
                    variant="ghost"
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 p-0 rounded-[3px] transition-all duration-300 ${
                      activeIndex === index ? "w-10 bg-primary" : "w-2.5 bg-muted-foreground/30"
                    }`}
                    aria-label={dotLabel(index)}
                    aria-pressed={activeIndex === index}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div variants={itemVariants} className="min-w-0 flex flex-col gap-5">
            {header}
            <div className={header ? "testimonial-window relative min-h-[280px]" : "testimonial-window relative h-full min-h-[300px] md:min-h-[400px]"}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  scale: activeIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
                aria-hidden={activeIndex !== index}
              >
                <div className="testimonial-card bg-card text-card-foreground rounded-lg px-7 py-6 h-full flex flex-col shadow-card">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      {testimonial.avatar && <AvatarImage src={testimonial.avatar} alt={testimonial.name} />}
                      <AvatarFallback className="text-lg font-semibold">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                        {testimonial.name}
                        {testimonial.sample && <span className="rounded-sm border px-2 py-0.5 text-xs font-medium text-muted-foreground">{sampleLabel}</span>}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{testimonial.company ? `${testimonial.role}, ${testimonial.company}` : testimonial.role}</p>
                    </div>
                <div className="ml-auto self-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    aria-label={shareLabel}
                    className="text-muted-foreground hover:text-foreground"
                    tabIndex={activeIndex === index ? 0 : -1}
                    onClick={() => {
                      const url = shareUrl ?? window.location.href
                      if (navigator.share) navigator.share({ url, text: testimonial.content }).catch(() => {})
                      else navigator.clipboard?.writeText(url)
                    }}
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
                  </div>

                  <div className="mt-4 flex gap-1" aria-label={`${testimonial.rating} / 5`}>
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                  </div>

                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{testimonial.content}</p>

                </div>
              </motion.div>
            ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer slot (e.g. rating) or logo cloud */}
        {footer ? (
          <motion.div variants={itemVariants} initial="hidden" animate={controls} className="mt-24 text-center">
            {footer}
          </motion.div>
        ) : trustedCompanies.length > 0 && (
          <motion.div variants={itemVariants} initial="hidden" animate={controls} className="mt-24 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-8">{trustedCompaniesTitle}</h3>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {trustedCompanies.map((company) => (
                <div key={company} className="text-2xl font-semibold text-muted-foreground/50">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

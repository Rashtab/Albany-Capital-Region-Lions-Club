import { motion } from "framer-motion";
import { Camera, Info } from "lucide-react";
import { galleryImages } from "@/data/clubData";
import gallery1 from "@/assets/images/gallery-1.png";
import gallery2 from "@/assets/images/gallery-2.png";
import gallery3 from "@/assets/images/gallery-3.png";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" },
  }),
};

const generatedImages = [gallery1, gallery2, gallery3];

export default function Gallery() {
  const galleryWithImages = galleryImages.map((img, i) => ({
    ...img,
    src: img.src ?? (i < generatedImages.length ? generatedImages[i] : null),
  }));

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Our Community</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Photo Gallery</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-xl mx-auto">
              A glimpse into our service projects, events, and community moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryWithImages.map((image, i) => (
              <motion.div
                key={image.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`gallery-item-${image.id}`}
                className="break-inside-avoid rounded-xl overflow-hidden border border-card-border hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                {image.src ? (
                  <div className="relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-muted/50 aspect-video flex flex-col items-center justify-center gap-3 p-8">
                    <Camera className="h-12 w-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm text-center font-medium">{image.caption}</p>
                    <span className="text-xs text-muted-foreground/60 italic">Photo coming soon</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Note */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={galleryWithImages.length}
            className="mt-14 bg-muted/50 border border-border rounded-xl p-6 flex gap-4 items-start max-w-2xl mx-auto"
            data-testid="gallery-note"
          >
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Photos are added as events are photographed and approved by club leadership. Contact us to submit event photos or request permission to use existing photos.
              {/* UPDATE: Replace placeholder images above with real club photos as they become available */}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

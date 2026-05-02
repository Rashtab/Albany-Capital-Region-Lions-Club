import { motion } from "framer-motion";
import { Camera, Calendar, FolderOpen, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import iftarPhoto1 from "@assets/647084174_27055032814086761_5907395881288517276_n_1777736424850.jpg";
import iftarPhoto2 from "@assets/648101133_27055032100753499_8094953426604179726_n_1777736424851.jpg";
import iftarPhoto3 from "@assets/649531670_27055033367420039_3542110652252670645_n_1777736424851.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5 },
  }),
};

// ── Albums — add photo imports to `photos` array when ready ──────────────────
// To add photos: import the image file and push it into the album's photos array
// Example: import charterPhoto1 from "@assets/charter-1.jpg";
//          then add `{ src: charterPhoto1, caption: "..." }` to photos array

const albums = [
  {
    id: 1,
    title: "Charter Night & Installation Ceremony",
    date: "April 26, 2026",
    category: "Milestone",
    description: "The historic founding and installation ceremony of the Albany Capital Region Lions Club.",
    photos: [
      // Add photos here when available
      // { src: charterPhoto1, caption: "Installation ceremony" },
    ],
  },
  {
    id: 2,
    title: "District 2nd Annual Meeting",
    date: "February 2026",
    category: "District Event",
    description: "Lions Club International District 20-R2 second annual meeting attended by our club members.",
    photos: [],
  },
  {
    id: 3,
    title: "Iftar Get Together",
    date: "March 7, 2026",
    category: "Community",
    description: "A warm Iftar gathering bringing our Lions family and community together during Ramadan.",
    photos: [
      { src: iftarPhoto1, caption: "Lions members at Iftar gathering" },
      { src: iftarPhoto2, caption: "Iftar Get Together — March 7, 2026" },
      { src: iftarPhoto3, caption: "Club members celebrating Iftar together" },
    ],
  },
  {
    id: 4,
    title: "Spring Convention",
    date: "March 22, 2026",
    category: "Convention",
    description: "District 20-R2 Spring Convention — Lions leaders from across the district united for service.",
    photos: [],
  },
  {
    id: 5,
    title: "Bangladesh Day 2026 at Albany Capitol",
    date: "March 24, 2026",
    category: "Cultural",
    description: "Celebrating Bangladesh Independence Day at the Albany State Capitol — a proud moment for our community.",
    photos: [],
  },
  {
    id: 6,
    title: "Eid Get Together",
    date: "March 27, 2026",
    category: "Community",
    description: "Eid celebrations with our Lions family — food, joy, and community spirit.",
    photos: [],
  },
];

const categoryColors: Record<string, string> = {
  Milestone: "bg-secondary text-secondary-foreground",
  "District Event": "bg-primary/10 text-primary",
  Community: "bg-green-100 text-green-800",
  Convention: "bg-purple-100 text-purple-800",
  Cultural: "bg-orange-100 text-orange-800",
  Health: "bg-blue-100 text-blue-800",
};

export default function Gallery() {
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
              Moments from our events, service projects, and community gatherings throughout the year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Albums */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Event Albums</span>
            <h2 className="text-4xl font-black text-primary mt-2">
              {albums.length} Events &amp; Growing
            </h2>
          </motion.div>

          <div className="space-y-10">
            {albums.map((album, i) => (
              <motion.div
                key={album.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                data-testid={`album-${album.id}`}
                className="bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
              >
                {/* Album Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{album.title}</h3>
                        <Badge className={`text-xs font-semibold ${categoryColors[album.category] ?? "bg-muted text-muted-foreground"}`}>
                          {album.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-3.5 w-3.5 text-secondary shrink-0" />
                        {album.date}
                      </div>
                      <p className="text-sm text-muted-foreground">{album.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-xs font-medium text-muted-foreground">
                      {album.photos.length} {album.photos.length === 1 ? "photo" : "photos"}
                    </span>
                  </div>
                </div>

                {/* Photos or Placeholder */}
                {album.photos.length > 0 ? (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {album.photos.map((photo: { src: string; caption?: string }, pi: number) => (
                      <div key={pi} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                        <img
                          src={photo.src}
                          alt={photo.caption ?? `${album.title} photo ${pi + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                        />
                        {photo.caption && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <p className="text-white text-xs">{photo.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center gap-3 text-center bg-muted/30">
                    <div className="flex gap-2 opacity-25">
                      {[...Array(5)].map((_, pi) => (
                        <div key={pi} className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg bg-muted-foreground/40" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm font-medium">Photos coming soon</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">
                      Send your photos to <span className="font-medium">lionsclubalbanycapitalregion@gmail.com</span>
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Submit photos CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={albums.length}
            className="mt-14 bg-muted/50 border border-border rounded-xl p-6 flex gap-4 items-start max-w-2xl mx-auto"
            data-testid="gallery-note"
          >
            <ImageOff className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have photos from a club event? Send them to{" "}
              <a href="mailto:lionsclubalbanycapitalregion@gmail.com" className="text-primary font-medium hover:underline">
                lionsclubalbanycapitalregion@gmail.com
              </a>{" "}
              and we'll add them to the album. Photos are reviewed and approved by club leadership before publishing.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { Camera, Calendar, FolderOpen, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import bangladeshPhoto1 from "@assets/654920156_27236604242596283_4619469104950022459_n_1777737014658.jpg";
import bangladeshPhoto2 from "@assets/655647114_27236602609263113_4884393155647146208_n_1777737014659.jpg";
import bangladeshPhoto3 from "@assets/655921593_27236601795929861_2995428896969278720_n_1777737014659.jpg";
import bangladeshPhoto4 from "@assets/656439556_27236603982596309_2283481694874313580_n_1777737014659.jpg";
import bangladeshPhoto5 from "@assets/656977872_27236604639262910_4883503647491506412_n_1777737014659.jpg";
import bangladeshPhoto6 from "@assets/657518596_27236602432596464_3393425326490924330_n_1777737014660.jpg";
import bangladeshPhoto7 from "@assets/657677275_27236602002596507_5436907802804670794_n_1777737014660.jpg";
import bangladeshPhoto8 from "@assets/DSC_0027_1777737014660.jpg";
import bangladeshPhoto9 from "@assets/DSC_0035_1777737014661.jpg";
import bangladeshPhoto10 from "@assets/DSC_0036_1777737014661.jpg";
import bangladeshPhoto11 from "@assets/DSC_0061_1777737014661.jpg";
import bangladeshPhoto12 from "@assets/IMG_0176~photo_1777737014661.JPG";
import springPhoto1 from "@assets/657170638_27329824959940877_7160008379873549711_n_1777736796621.jpg";
import springPhoto15 from "@assets/660532668_27329815713275135_8307670286658515926_n_1777736906026.jpg";
import springPhoto16 from "@assets/660970208_27329815199941853_5232342538291491060_n_1777736906026.jpg";
import springPhoto17 from "@assets/661047750_27342935765296463_6855499252572700307_n_1777736906026.jpg";
import springPhoto18 from "@assets/661213735_27329821953274511_2613966495426069028_n_1777736906027.jpg";
import springPhoto19 from "@assets/662403874_27329811583275548_6050078312485094749_n_1777736906027.jpg";
import springPhoto20 from "@assets/662509903_27329817939941579_7055871740958051907_n_1777736906027.jpg";
import springPhoto21 from "@assets/663042370_27329814116608628_8525675026473977089_n_1777736906028.jpg";
import springPhoto22 from "@assets/DSC_0784_1777736906028.jpg";
import springPhoto23 from "@assets/DSC_0805_1777736906028.jpg";
import springPhoto24 from "@assets/WhatsApp_Image_2026-04-18_at_4.51.41_AM_1777736906029.jpeg";
import springPhoto2 from "@assets/658138737_27329818183274888_5144718517033310575_n_1777736796622.jpg";
import springPhoto3 from "@assets/658368733_27329813153275391_7675333575341318947_n_1777736796622.jpg";
import springPhoto4 from "@assets/658953008_27329812339942139_6719885944769756001_n_1777736796622.jpg";
import springPhoto5 from "@assets/659080083_27329814346608605_345116296583840873_n_1777736796622.jpg";
import springPhoto6 from "@assets/659080083_27329819236608116_8403862632037547446_n_1777736796622.jpg";
import springPhoto7 from "@assets/659142810_27329814616608578_7127971519937103089_n_1777736796623.jpg";
import springPhoto8 from "@assets/659142988_27329831493273557_8666769162277819709_n_1777736805936.jpg";
import springPhoto9 from "@assets/659190846_27338065105783529_5936683302501544713_n_1777736805936.jpg";
import springPhoto10 from "@assets/659634467_27329829429940430_2589865739915104268_n_1777736805937.jpg";
import springPhoto11 from "@assets/659827450_27338064329116940_7936053785895768580_n_1777736805937.jpg";
import springPhoto12 from "@assets/659829676_27338067249116648_1986983784978650012_n_1777736805937.jpg";
import springPhoto13 from "@assets/659838771_27329812919942081_5536429888456845101_n_1777736805937.jpg";
import springPhoto14 from "@assets/660159449_27329829713273735_2326270760096400055_n_1777736805938.jpg";
import districtPhoto1 from "@assets/_DSC4848_1777736679657.JPG";
import districtPhoto2 from "@assets/651138768_27123701403886568_1823916708111424254_n_1777736679657.jpg";
import districtPhoto3 from "@assets/WhatsApp_Image_2026-04-24_at_1.31.09_AM_1777736679657.jpeg";
import districtPhoto4 from "@assets/WhatsApp_Image_2026-04-24_at_1.31.21_AM_(3)_1777736679657.jpeg";
import districtPhoto5 from "@assets/WhatsApp_Image_2026-04-24_at_10.01.55_AM_1777736679658.jpeg";
import districtPhoto6 from "@assets/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(1)_1777736679658.jpeg";
import districtPhoto7 from "@assets/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(2)_1777736679658.jpeg";
import districtPhoto8 from "@assets/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(3)_1777736679658.jpeg";
import districtPhoto9 from "@assets/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(4)_1777736679659.jpeg";
import districtPhoto10 from "@assets/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(5)_1777736679659.jpeg";
import districtPhoto11 from "@assets/WhatsApp_Image_2026-04-24_at_10.01.56_AM_1777736679659.jpeg";
import districtPhoto12 from "@assets/WhatsApp_Image_2026-04-24_at_11.32.02_AM_(1)_1777736679659.jpeg";
import districtPhoto13 from "@assets/WhatsApp_Image_2026-04-24_at_11.32.02_AM_1777736679660.jpeg";
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
    photos: [
      { src: districtPhoto6, caption: "Second District 20-R2 General Meeting" },
      { src: districtPhoto7, caption: "District leadership at the head table" },
      { src: districtPhoto8, caption: "Address at the District General Meeting" },
      { src: districtPhoto5, caption: "Pin presentation ceremony" },
      { src: districtPhoto1, caption: "Pin presentation at District 20-R2 Annual Meeting" },
      { src: districtPhoto4, caption: "District Governor pins a member" },
      { src: districtPhoto3, caption: "Pin ceremony — District 20-R2 Meeting" },
      { src: districtPhoto9, caption: "Presentation at the podium" },
      { src: districtPhoto10, caption: "Pin presentation and recognition" },
      { src: districtPhoto11, caption: "Members with the District flag display" },
      { src: districtPhoto12, caption: "Pin ceremony — District 20-R2 Meeting" },
      { src: districtPhoto2, caption: "Club members at the District meeting" },
      { src: districtPhoto13, caption: "Albany Lions members at the District Annual Meeting" },
    ],
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
    photos: [
      { src: springPhoto9, caption: "Lion Sonia Mahtab at the Spring Convention step-and-repeat" },
      { src: springPhoto12, caption: "President Sonia Mahtab at District 20-R2 Spring Convention" },
      { src: springPhoto4, caption: "Lion Sonia Mahtab receives Award of Excellence" },
      { src: springPhoto3, caption: "Charter presentation — Albany Capital Region Lions Club" },
      { src: springPhoto5, caption: "Charter reading ceremony — Spring Convention" },
      { src: springPhoto7, caption: "Albany Lions members at the Spring Convention" },
      { src: springPhoto1, caption: "Albany Lions delegation at the District 20-R2 Spring Convention" },
      { src: springPhoto6, caption: "Gift presentation — Spring Convention" },
      { src: springPhoto10, caption: "Award presentation — Spring Convention" },
      { src: springPhoto2, caption: "International Director Nazmul Haque recognition ceremony" },
      { src: springPhoto8, caption: "Presentation with International Director" },
      { src: springPhoto13, caption: "Recognition ceremony — Spring Convention" },
      { src: springPhoto14, caption: "Club charter and award presentation" },
      { src: springPhoto11, caption: "President Sonia Mahtab with the Lions flag display" },
      { src: springPhoto15, caption: "Albany Lions officers at the Spring Convention step-and-repeat" },
      { src: springPhoto16, caption: "With International Director Nazmul Haque — Spring Convention" },
      { src: springPhoto17, caption: "President Sonia Mahtab and 1st VP Ahsan Habib — Spring Convention" },
      { src: springPhoto18, caption: "Albany Lions members at District 20-R2 Spring Convention" },
      { src: springPhoto19, caption: "President Sonia Mahtab at the Spring Convention step-and-repeat" },
      { src: springPhoto20, caption: "Albany Lions officers — Spring Convention" },
      { src: springPhoto21, caption: "Recognition ceremony with International Director" },
      { src: springPhoto22, caption: "President Sonia Mahtab with fellow Lions at Leonard's Palazzo" },
      { src: springPhoto23, caption: "Albany Lions officers at Leonard's Palazzo" },
      { src: springPhoto24, caption: "Albany Lions members at the Spring Convention" },
    ],
  },
  {
    id: 5,
    title: "Bangladesh Day 2026 at Albany Capitol",
    date: "March 24, 2026",
    category: "Cultural",
    description: "Celebrating Bangladesh Independence Day at the Albany State Capitol — a proud moment for our community.",
    photos: [
      { src: bangladeshPhoto12, caption: "56th Bangladesh Independence Day Celebration in Albany — March 24, 2026" },
      { src: bangladeshPhoto8, caption: "Community delegation at the Albany State Capitol staircase" },
      { src: bangladeshPhoto3, caption: "56th Bangladesh Independence Day — Albany Capitol" },
      { src: bangladeshPhoto9, caption: "Bangladesh Day delegation at the Capitol entrance" },
      { src: bangladeshPhoto10, caption: "Community members at the Albany State Capitol" },
      { src: bangladeshPhoto4, caption: "Albany Lions members on the NY Senate floor" },
      { src: bangladeshPhoto1, caption: "President Sonia Mahtab at the Capitol ceremony" },
      { src: bangladeshPhoto11, caption: "Bangladesh Day delegation in the Capitol gallery" },
      { src: bangladeshPhoto2, caption: "Albany Lions officers with community leaders — Bangladesh Day" },
      { src: bangladeshPhoto5, caption: "Albany Lions members at the Bangladesh Day celebration" },
      { src: bangladeshPhoto6, caption: "With elected officials at the Albany State Capitol" },
      { src: bangladeshPhoto7, caption: "Albany Lions members at the 56th Bangladesh Independence Day" },
    ],
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

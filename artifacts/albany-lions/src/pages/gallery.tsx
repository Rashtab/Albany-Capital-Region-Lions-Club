import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageMeta } from "@/components/PageMeta";
import { Camera, Calendar, FolderOpen, ImageOff, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ── Full-resolution originals (used only in the lightbox) ────────────────────
import eidPhoto1 from "@assets/660302350_27351706501086056_6964347259712242193_n_1777737102946.jpg";
import eidPhoto2 from "@assets/660312857_27351712484418791_1133339746705830951_n_1777737102946.jpg";
import eidPhoto3 from "@assets/661679011_27351706741086032_2203451379640769336_n_1777737102947.jpg";
import eidPhoto4 from "@assets/661940042_27351705901086116_3208867297445150570_n_1777737102947.jpg";
import eidPhoto5 from "@assets/661999974_27351710474418992_7778557972642127946_n_1777737102947.jpg";
import eidPhoto6 from "@assets/662299240_27351713694418670_3924625390615541126_n_1777737102947.jpg";
import eidPhoto7 from "@assets/662557547_27351706257752747_654196626627361434_n_1777737102948.jpg";
import eidPhoto8 from "@assets/662651788_27351705661086140_1970818503690945375_n_1777737102948.jpg";
import eidPhoto9 from "@assets/663392265_27351718824418157_1639878535471500215_n_1777737102948.jpg";
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

// ── WebP thumbnails — 480 px wide, used in the grid (explicit static imports
//    so Vite fingerprints them correctly in production builds) ─────────────────
import eidPhoto1Thumb from "@assets/thumbnails/660302350_27351706501086056_6964347259712242193_n_1777737102946.webp";
import eidPhoto2Thumb from "@assets/thumbnails/660312857_27351712484418791_1133339746705830951_n_1777737102946.webp";
import eidPhoto3Thumb from "@assets/thumbnails/661679011_27351706741086032_2203451379640769336_n_1777737102947.webp";
import eidPhoto4Thumb from "@assets/thumbnails/661940042_27351705901086116_3208867297445150570_n_1777737102947.webp";
import eidPhoto5Thumb from "@assets/thumbnails/661999974_27351710474418992_7778557972642127946_n_1777737102947.webp";
import eidPhoto6Thumb from "@assets/thumbnails/662299240_27351713694418670_3924625390615541126_n_1777737102947.webp";
import eidPhoto7Thumb from "@assets/thumbnails/662557547_27351706257752747_654196626627361434_n_1777737102948.webp";
import eidPhoto8Thumb from "@assets/thumbnails/662651788_27351705661086140_1970818503690945375_n_1777737102948.webp";
import eidPhoto9Thumb from "@assets/thumbnails/663392265_27351718824418157_1639878535471500215_n_1777737102948.webp";
import bangladeshPhoto1Thumb from "@assets/thumbnails/654920156_27236604242596283_4619469104950022459_n_1777737014658.webp";
import bangladeshPhoto2Thumb from "@assets/thumbnails/655647114_27236602609263113_4884393155647146208_n_1777737014659.webp";
import bangladeshPhoto3Thumb from "@assets/thumbnails/655921593_27236601795929861_2995428896969278720_n_1777737014659.webp";
import bangladeshPhoto4Thumb from "@assets/thumbnails/656439556_27236603982596309_2283481694874313580_n_1777737014659.webp";
import bangladeshPhoto5Thumb from "@assets/thumbnails/656977872_27236604639262910_4883503647491506412_n_1777737014659.webp";
import bangladeshPhoto6Thumb from "@assets/thumbnails/657518596_27236602432596464_3393425326490924330_n_1777737014660.webp";
import bangladeshPhoto7Thumb from "@assets/thumbnails/657677275_27236602002596507_5436907802804670794_n_1777737014660.webp";
import bangladeshPhoto8Thumb from "@assets/thumbnails/DSC_0027_1777737014660.webp";
import bangladeshPhoto9Thumb from "@assets/thumbnails/DSC_0035_1777737014661.webp";
import bangladeshPhoto10Thumb from "@assets/thumbnails/DSC_0036_1777737014661.webp";
import bangladeshPhoto11Thumb from "@assets/thumbnails/DSC_0061_1777737014661.webp";
import bangladeshPhoto12Thumb from "@assets/thumbnails/IMG_0176~photo_1777737014661.webp";
import springPhoto1Thumb from "@assets/thumbnails/657170638_27329824959940877_7160008379873549711_n_1777736796621.webp";
import springPhoto2Thumb from "@assets/thumbnails/658138737_27329818183274888_5144718517033310575_n_1777736796622.webp";
import springPhoto3Thumb from "@assets/thumbnails/658368733_27329813153275391_7675333575341318947_n_1777736796622.webp";
import springPhoto4Thumb from "@assets/thumbnails/658953008_27329812339942139_6719885944769756001_n_1777736796622.webp";
import springPhoto5Thumb from "@assets/thumbnails/659080083_27329814346608605_345116296583840873_n_1777736796622.webp";
import springPhoto6Thumb from "@assets/thumbnails/659080083_27329819236608116_8403862632037547446_n_1777736796622.webp";
import springPhoto7Thumb from "@assets/thumbnails/659142810_27329814616608578_7127971519937103089_n_1777736796623.webp";
import springPhoto8Thumb from "@assets/thumbnails/659142988_27329831493273557_8666769162277819709_n_1777736805936.webp";
import springPhoto9Thumb from "@assets/thumbnails/659190846_27338065105783529_5936683302501544713_n_1777736805936.webp";
import springPhoto10Thumb from "@assets/thumbnails/659634467_27329829429940430_2589865739915104268_n_1777736805937.webp";
import springPhoto11Thumb from "@assets/thumbnails/659827450_27338064329116940_7936053785895768580_n_1777736805937.webp";
import springPhoto12Thumb from "@assets/thumbnails/659829676_27338067249116648_1986983784978650012_n_1777736805937.webp";
import springPhoto13Thumb from "@assets/thumbnails/659838771_27329812919942081_5536429888456845101_n_1777736805937.webp";
import springPhoto14Thumb from "@assets/thumbnails/660159449_27329829713273735_2326270760096400055_n_1777736805938.webp";
import springPhoto15Thumb from "@assets/thumbnails/660532668_27329815713275135_8307670286658515926_n_1777736906026.webp";
import springPhoto16Thumb from "@assets/thumbnails/660970208_27329815199941853_5232342538291491060_n_1777736906026.webp";
import springPhoto17Thumb from "@assets/thumbnails/661047750_27342935765296463_6855499252572700307_n_1777736906026.webp";
import springPhoto18Thumb from "@assets/thumbnails/661213735_27329821953274511_2613966495426069028_n_1777736906027.webp";
import springPhoto19Thumb from "@assets/thumbnails/662403874_27329811583275548_6050078312485094749_n_1777736906027.webp";
import springPhoto20Thumb from "@assets/thumbnails/662509903_27329817939941579_7055871740958051907_n_1777736906027.webp";
import springPhoto21Thumb from "@assets/thumbnails/663042370_27329814116608628_8525675026473977089_n_1777736906028.webp";
import springPhoto22Thumb from "@assets/thumbnails/DSC_0784_1777736906028.webp";
import springPhoto23Thumb from "@assets/thumbnails/DSC_0805_1777736906028.webp";
import springPhoto24Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-18_at_4.51.41_AM_1777736906029.webp";
import districtPhoto1Thumb from "@assets/thumbnails/_DSC4848_1777736679657.webp";
import districtPhoto2Thumb from "@assets/thumbnails/651138768_27123701403886568_1823916708111424254_n_1777736679657.webp";
import districtPhoto3Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_1.31.09_AM_1777736679657.webp";
import districtPhoto4Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_1.31.21_AM_(3)_1777736679657.webp";
import districtPhoto5Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_10.01.55_AM_1777736679658.webp";
import districtPhoto6Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(1)_1777736679658.webp";
import districtPhoto7Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(2)_1777736679658.webp";
import districtPhoto8Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(3)_1777736679658.webp";
import districtPhoto9Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(4)_1777736679659.webp";
import districtPhoto10Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_10.01.56_AM_(5)_1777736679659.webp";
import districtPhoto11Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_10.01.56_AM_1777736679659.webp";
import districtPhoto12Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_11.32.02_AM_(1)_1777736679659.webp";
import districtPhoto13Thumb from "@assets/thumbnails/WhatsApp_Image_2026-04-24_at_11.32.02_AM_1777736679660.webp";
import iftarPhoto1Thumb from "@assets/thumbnails/647084174_27055032814086761_5907395881288517276_n_1777736424850.webp";
import iftarPhoto2Thumb from "@assets/thumbnails/648101133_27055032100753499_8094953426604179726_n_1777736424851.webp";
import iftarPhoto3Thumb from "@assets/thumbnails/649531670_27055033367420039_3542110652252670645_n_1777736424851.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5 },
  }),
};

// ── Albums ────────────────────────────────────────────────────────────────────
// Each photo has:
//   src         — full-resolution original (loaded on-demand by the lightbox)
//   thumbnailSrc — 480 px WebP thumbnail (used in the grid, lazy-loaded)
//   caption     — optional alt/caption text

const albums = [
  {
    id: 1,
    title: "Charter Night & Installation Ceremony",
    date: "April 26, 2026",
    category: "Milestone",
    description: "The historic founding and installation ceremony of the Albany Capital Region Lions Club.",
    photos: [] as Array<{ src: string; thumbnailSrc: string; caption?: string }>,
  },
  {
    id: 2,
    title: "District 2nd Annual Meeting",
    date: "February 2026",
    category: "District Event",
    description: "Lions Club International District 20-R2 second annual meeting attended by our club members.",
    photos: [
      { src: districtPhoto6, thumbnailSrc: districtPhoto6Thumb, caption: "Second District 20-R2 General Meeting" },
      { src: districtPhoto7, thumbnailSrc: districtPhoto7Thumb, caption: "District leadership at the head table" },
      { src: districtPhoto8, thumbnailSrc: districtPhoto8Thumb, caption: "Address at the District General Meeting" },
      { src: districtPhoto5, thumbnailSrc: districtPhoto5Thumb, caption: "Pin presentation ceremony" },
      { src: districtPhoto1, thumbnailSrc: districtPhoto1Thumb, caption: "Pin presentation at District 20-R2 Annual Meeting" },
      { src: districtPhoto4, thumbnailSrc: districtPhoto4Thumb, caption: "District Governor pins a member" },
      { src: districtPhoto3, thumbnailSrc: districtPhoto3Thumb, caption: "Pin ceremony — District 20-R2 Meeting" },
      { src: districtPhoto9, thumbnailSrc: districtPhoto9Thumb, caption: "Presentation at the podium" },
      { src: districtPhoto10, thumbnailSrc: districtPhoto10Thumb, caption: "Pin presentation and recognition" },
      { src: districtPhoto11, thumbnailSrc: districtPhoto11Thumb, caption: "Members with the District flag display" },
      { src: districtPhoto12, thumbnailSrc: districtPhoto12Thumb, caption: "Pin ceremony — District 20-R2 Meeting" },
      { src: districtPhoto2, thumbnailSrc: districtPhoto2Thumb, caption: "Club members at the District meeting" },
      { src: districtPhoto13, thumbnailSrc: districtPhoto13Thumb, caption: "Albany Lions members at the District Annual Meeting" },
    ],
  },
  {
    id: 3,
    title: "Iftar Get Together",
    date: "March 7, 2026",
    category: "Community",
    description: "A warm Iftar gathering bringing our Lions family and community together during Ramadan.",
    photos: [
      { src: iftarPhoto1, thumbnailSrc: iftarPhoto1Thumb, caption: "Lions members at Iftar gathering" },
      { src: iftarPhoto2, thumbnailSrc: iftarPhoto2Thumb, caption: "Iftar Get Together — March 7, 2026" },
      { src: iftarPhoto3, thumbnailSrc: iftarPhoto3Thumb, caption: "Club members celebrating Iftar together" },
    ],
  },
  {
    id: 4,
    title: "Spring Convention",
    date: "March 22, 2026",
    category: "Convention",
    description: "District 20-R2 Spring Convention — Lions leaders from across the district united for service.",
    photos: [
      { src: springPhoto9,  thumbnailSrc: springPhoto9Thumb,  caption: "Lion Sonia Mahtab at the Spring Convention step-and-repeat" },
      { src: springPhoto12, thumbnailSrc: springPhoto12Thumb, caption: "President Sonia Mahtab at District 20-R2 Spring Convention" },
      { src: springPhoto4,  thumbnailSrc: springPhoto4Thumb,  caption: "Lion Sonia Mahtab receives Award of Excellence" },
      { src: springPhoto3,  thumbnailSrc: springPhoto3Thumb,  caption: "Charter presentation — Albany Capital Region Lions Club" },
      { src: springPhoto5,  thumbnailSrc: springPhoto5Thumb,  caption: "Charter reading ceremony — Spring Convention" },
      { src: springPhoto7,  thumbnailSrc: springPhoto7Thumb,  caption: "Albany Lions members at the Spring Convention" },
      { src: springPhoto1,  thumbnailSrc: springPhoto1Thumb,  caption: "Albany Lions delegation at the District 20-R2 Spring Convention" },
      { src: springPhoto6,  thumbnailSrc: springPhoto6Thumb,  caption: "Gift presentation — Spring Convention" },
      { src: springPhoto10, thumbnailSrc: springPhoto10Thumb, caption: "Award presentation — Spring Convention" },
      { src: springPhoto2,  thumbnailSrc: springPhoto2Thumb,  caption: "International Director Nazmul Haque recognition ceremony" },
      { src: springPhoto8,  thumbnailSrc: springPhoto8Thumb,  caption: "Presentation with International Director" },
      { src: springPhoto13, thumbnailSrc: springPhoto13Thumb, caption: "Recognition ceremony — Spring Convention" },
      { src: springPhoto14, thumbnailSrc: springPhoto14Thumb, caption: "Club charter and award presentation" },
      { src: springPhoto11, thumbnailSrc: springPhoto11Thumb, caption: "President Sonia Mahtab with the Lions flag display" },
      { src: springPhoto15, thumbnailSrc: springPhoto15Thumb, caption: "Albany Lions officers at the Spring Convention step-and-repeat" },
      { src: springPhoto16, thumbnailSrc: springPhoto16Thumb, caption: "With International Director Nazmul Haque — Spring Convention" },
      { src: springPhoto17, thumbnailSrc: springPhoto17Thumb, caption: "President Sonia Mahtab and 1st VP Ahsan Habib — Spring Convention" },
      { src: springPhoto18, thumbnailSrc: springPhoto18Thumb, caption: "Albany Lions members at District 20-R2 Spring Convention" },
      { src: springPhoto19, thumbnailSrc: springPhoto19Thumb, caption: "President Sonia Mahtab at the Spring Convention step-and-repeat" },
      { src: springPhoto20, thumbnailSrc: springPhoto20Thumb, caption: "Albany Lions officers — Spring Convention" },
      { src: springPhoto21, thumbnailSrc: springPhoto21Thumb, caption: "Recognition ceremony with International Director" },
      { src: springPhoto22, thumbnailSrc: springPhoto22Thumb, caption: "President Sonia Mahtab with fellow Lions at Leonard's Palazzo" },
      { src: springPhoto23, thumbnailSrc: springPhoto23Thumb, caption: "Albany Lions officers at Leonard's Palazzo" },
      { src: springPhoto24, thumbnailSrc: springPhoto24Thumb, caption: "Albany Lions members at the Spring Convention" },
    ],
  },
  {
    id: 5,
    title: "Bangladesh Day 2026 at Albany Capitol",
    date: "March 24, 2026",
    category: "Cultural",
    description: "Celebrating Bangladesh Independence Day at the Albany State Capitol — a proud moment for our community.",
    photos: [
      { src: bangladeshPhoto12, thumbnailSrc: bangladeshPhoto12Thumb, caption: "56th Bangladesh Independence Day Celebration in Albany — March 24, 2026" },
      { src: bangladeshPhoto8,  thumbnailSrc: bangladeshPhoto8Thumb,  caption: "Community delegation at the Albany State Capitol staircase" },
      { src: bangladeshPhoto3,  thumbnailSrc: bangladeshPhoto3Thumb,  caption: "56th Bangladesh Independence Day — Albany Capitol" },
      { src: bangladeshPhoto9,  thumbnailSrc: bangladeshPhoto9Thumb,  caption: "Bangladesh Day delegation at the Capitol entrance" },
      { src: bangladeshPhoto10, thumbnailSrc: bangladeshPhoto10Thumb, caption: "Community members at the Albany State Capitol" },
      { src: bangladeshPhoto4,  thumbnailSrc: bangladeshPhoto4Thumb,  caption: "Albany Lions members on the NY Senate floor" },
      { src: bangladeshPhoto1,  thumbnailSrc: bangladeshPhoto1Thumb,  caption: "President Sonia Mahtab at the Capitol ceremony" },
      { src: bangladeshPhoto11, thumbnailSrc: bangladeshPhoto11Thumb, caption: "Bangladesh Day delegation in the Capitol gallery" },
      { src: bangladeshPhoto2,  thumbnailSrc: bangladeshPhoto2Thumb,  caption: "Albany Lions officers with community leaders — Bangladesh Day" },
      { src: bangladeshPhoto5,  thumbnailSrc: bangladeshPhoto5Thumb,  caption: "Albany Lions members at the Bangladesh Day celebration" },
      { src: bangladeshPhoto6,  thumbnailSrc: bangladeshPhoto6Thumb,  caption: "With elected officials at the Albany State Capitol" },
      { src: bangladeshPhoto7,  thumbnailSrc: bangladeshPhoto7Thumb,  caption: "Albany Lions members at the 56th Bangladesh Independence Day" },
    ],
  },
  {
    id: 6,
    title: "Eid Get Together",
    date: "March 27, 2026",
    category: "Community",
    description: "Eid celebrations with our Lions family — food, joy, and community spirit.",
    photos: [
      { src: eidPhoto8, thumbnailSrc: eidPhoto8Thumb, caption: "Albany Capital Region Lions Club members at the Eid Get Together — March 27, 2026" },
      { src: eidPhoto2, thumbnailSrc: eidPhoto2Thumb, caption: "Club members with the Lions Club charter at the Eid celebration" },
      { src: eidPhoto4, thumbnailSrc: eidPhoto4Thumb, caption: "Lions members with the club charter — Eid Mubarak gathering" },
      { src: eidPhoto9, thumbnailSrc: eidPhoto9Thumb, caption: "Ladies of the Albany Lions Club at the Eid Get Together" },
      { src: eidPhoto7, thumbnailSrc: eidPhoto7Thumb, caption: "President Sonia Mahtab displaying the Lions Club International Charter" },
      { src: eidPhoto5, thumbnailSrc: eidPhoto5Thumb, caption: "Lions members with club materials at the Eid gathering" },
      { src: eidPhoto1, thumbnailSrc: eidPhoto1Thumb, caption: "Lady members of Albany Lions Club at the festive Eid table" },
      { src: eidPhoto3, thumbnailSrc: eidPhoto3Thumb, caption: "Celebrating Eid with a beautifully decorated table — Lions family gathering" },
      { src: eidPhoto6, thumbnailSrc: eidPhoto6Thumb, caption: "Lady Lions members at the Eid Mubarak celebration" },
    ],
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

type LightboxState = { albumId: number; photoIndex: number } | null;

export default function Gallery() {
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const openLightbox = (albumId: number, photoIndex: number) => {
    setLightbox({ albumId, photoIndex });
  };

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigate = useCallback((dir: 1 | -1) => {
    setLightbox((prev) => {
      if (!prev) return null;
      const album = albums.find((a) => a.id === prev.albumId);
      if (!album) return null;
      const count = album.photos.length;
      return { albumId: prev.albumId, photoIndex: (prev.photoIndex + dir + count) % count };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox, navigate]);

  const activeAlbum = lightbox ? albums.find((a) => a.id === lightbox.albumId) : null;
  const activePhoto = activeAlbum ? activeAlbum.photos[lightbox!.photoIndex] : null;

  return (
    <div className="flex flex-col">
      <PageMeta
        title="Photo Gallery"
        path="/gallery"
        description="Photo gallery from Albany Capital Region Lions Club events — charter night, community service projects, Eid celebrations, fundraisers, and more moments from our club community."
      />
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
                    {album.photos.map((photo, pi) => (
                      <button
                        key={pi}
                        onClick={() => openLightbox(album.id, pi)}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <img
                          src={photo.thumbnailSrc}
                          alt={photo.caption ?? `${album.title} photo ${pi + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          {photo.caption && <p className="text-white text-xs line-clamp-2">{photo.caption}</p>}
                        </div>
                      </button>
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

      {/* Lightbox — full-resolution image loaded on demand when opened */}
      <AnimatePresence>
        {lightbox && activeAlbum && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div>
                  <p className="text-white font-semibold text-sm">{activeAlbum.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{lightbox.photoIndex + 1} / {activeAlbum.photos.length}</p>
                </div>
                <button
                  onClick={closeLightbox}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Full-resolution image area */}
              <div className="relative flex items-center justify-center bg-black" style={{ minHeight: "420px", maxHeight: "70vh" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${lightbox.albumId}-${lightbox.photoIndex}`}
                    src={activePhoto.src}
                    alt={activePhoto.caption ?? `Photo ${lightbox.photoIndex + 1}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.18 }}
                    className="max-w-full max-h-full object-contain"
                    style={{ maxHeight: "70vh" }}
                  />
                </AnimatePresence>

                {/* Prev / Next */}
                {activeAlbum.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => navigate(-1)}
                      className="absolute left-3 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => navigate(1)}
                      className="absolute right-3 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Caption */}
              {activePhoto.caption && (
                <div className="px-5 py-3 border-t border-white/10">
                  <p className="text-white/80 text-sm text-center">{activePhoto.caption}</p>
                </div>
              )}

              {/* Thumbnail strip — WebP thumbnails, lazy-loaded */}
              {activeAlbum.photos.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto px-4 py-3 border-t border-white/10 scrollbar-thin">
                  {activeAlbum.photos.map((p, pi) => (
                    <button
                      key={pi}
                      onClick={() => setLightbox({ albumId: lightbox.albumId, photoIndex: pi })}
                      className={`shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                        pi === lightbox.photoIndex ? "border-secondary scale-105" : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img
                        src={p.thumbnailSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

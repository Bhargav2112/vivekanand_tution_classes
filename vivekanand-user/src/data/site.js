export const SITE = {
  name: "વિવેકાનંદ ટ્યુશન ક્લાસીસ",
  shortName: "VTC",
  tagline: "વિદ્યાર્થીના ભવિષ્ય માટે શ્રેષ્ઠ માર્ગદર્શન",
  phone: "+91 9054 88 33 88",
  phoneRaw: "919054883388",
  whatsapp: "919054883388",
  email: "vivekanandclasses@gmail.com",
  address: "3, ગ્રીનપાર્ક રેસિ., રોયલ સોસાયટી સામે, કેનાલ રોડ, કામરેજ, સુરત",
  city: "સુરત, ગુજરાત",
  mapQuery: "Kamrej, Surat, Gujarat",
  established: "2010",
};

export const SOCIAL = [
  { name: "Instagram", url: "https://www.instagram.com/vivekanand_tution_classes", icon: "Instagram" },
  { name: "YouTube", url: "https://www.youtube.com/@vivekanand_classes", icon: "Youtube" },
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61579365471353", icon: "Facebook" },
];

export const NAV_ITEMS = [
  { label: "nav.home", path: "/" },
  { label: "nav.about", path: "/about" },
  { 
    label: "nav.courses", 
    path: "/courses",
    dropdown: [
      { label: "courses.std_1_5", path: "/courses#std-1-5" },
      { label: "courses.std_6_8", path: "/courses#std-6-8" },
      { label: "courses.std_9_10", path: "/courses#std-9-10" },
      { label: "courses.science", path: "/courses#science" },
      { label: "courses.commerce", path: "/courses#commerce" }
    ]
  },
  { 
    label: "nav.results", 
    path: "/results",
    dropdown: [
      { label: "results_menu.board", path: "/results?type=board" },
      { label: "results_menu.competitive", path: "/results?type=competitive" }
    ]
  },
  { 
    label: "nav.gallery", 
    path: "/gallery",
    dropdown: [
      { label: "gallery_menu.photos", path: "/gallery#photos" },
      { label: "gallery_menu.videos", path: "/gallery#videos" },
      { label: "gallery_menu.shorts", path: "/gallery#shorts" }
    ]
  },
  { label: "nav.contact", path: "/contact" },
];

export const COURSES = [
  {
    id: "navodaya",
    name: "જવાહર નવોદય પ્રવેશ પરીક્ષા",
    short: "JNVST",
    badge: "સૌથી લોકપ્રિય",
    description: "ધોરણ 5 ના વિદ્યાર્થીઓ માટે જવાહર નવોદય વિદ્યાલય પ્રવેશ પરીક્ષાની સંપૂર્ણ તૈયારી.",
    features: [
      "સંપૂર્ણ અભ્યાસક્રમ આવરી લેવાયેલ",
      "સાપ્તાહિક પરીક્ષા વ્યવસ્થા",
      "OMR પ્રેક્ટિસ",
      "જૂના પ્રશ્નપત્રોનો અભ્યાસ",
      "મેરિટ માર્ગદર્શન",
      "વ્યક્તિગત ધ્યાન",
    ],
    duration: "1 વર્ષ",
    classes: "અઠવાડિયામાં 5 દિવસ",
    grade: "ધોરણ 5",
    icon: "GraduationCap",
  },
  {
    id: "gyanshakti",
    name: "જ્ઞાન શક્તિ",
    short: "Gyan Shakti",
    badge: "પ્રતિભા પરીક્ષા",
    description: "રાજ્ય સ્તરની પ્રતિભા પરીક્ષામાં સફળતા માટે વિશેષ માર્ગદર્શન.",
    features: [
      "Weekly Tests",
      "Printed Notes",
      "Practice Papers",
      "Scholarship Guidance",
      "Doubt Solving",
      "મેરિટ તૈયારી",
    ],
    duration: "1 વર્ષ",
    classes: "અઠવાડિયામાં 6 દિવસ",
    grade: "ધોરણ 5-8",
    icon: "Lightbulb",
  },
  {
    id: "cet",
    name: "CET તૈયારી",
    short: "CET",
    badge: "કોમન એન્ટ્રન્સ ટેસ્ટ",
    description: "ગુજરાત કોમન એન્ટ્રન્સ ટેસ્ટ માટે મજબૂત અને સંપૂર્ણ તૈયારી.",
    features: [
      "સંપૂર્ણ સિલેબસ",
      "મોક ટેસ્ટ શ્રેણી",
      "વિષયવાર માર્ગદર્શન",
      "જૂના પ્રશ્નપત્રો",
      "ઝડપ વધારવાની તાલીમ",
      "પરિણામ વિશ્લેષણ",
    ],
    duration: "1 વર્ષ",
    classes: "અઠવાડિયામાં 6 દિવસ",
    grade: "ધોરણ 11-12",
    icon: "Brain",
  },
  {
    id: "school",
    name: "ધોરણ 6 થી 10",
    short: "School Tuition",
    badge: "નિયમિત અભ્યાસ",
    description: "ગુજરાત બોર્ડ, NCERT, Foundation, Olympiad અને School Support માર્ગદર્શન.",
    features: [
      "ગુજરાત બોર્ડ સિલેબસ",
      "NCERT આધારિત",
      "Foundation તૈયારી",
      "Olympiad માર્ગદર્શન",
      "School Exam સપોર્ટ",
      "વિષયવાર શિક્ષકો",
    ],
    duration: "સંપૂર્ણ વર્ષ",
    classes: "અઠવાડિયામાં 6 દિવસ",
    grade: "ધોરણ 6-10",
    icon: "BookOpen",
  },
];

export const STATS = [
  { value: 5000, suffix: "+", label: "વિદ્યાર્થીઓ", icon: "Users" },
  { value: 98, suffix: "%", label: "પરિણામ", icon: "TrendingUp" },
  { value: 15, suffix: "+", label: "વર્ષનો અનુભવ", icon: "Award" },
  { value: 500, suffix: "+", label: "મેરિટ વિદ્યાર્થીઓ", icon: "Star" },
];

export const WHY_CHOOSE_US = [
  { num: "01", title: "અનુભવી શિક્ષકો", desc: "વિષય નિષ્ણાત અને અનુભવી શિક્ષક મંડળ.", icon: "Users" },
  { num: "02", title: "નિયમિત પરીક્ષા", desc: "સાપ્તાહિક અને માસિક પરીક્ષા વ્યવસ્થા.", icon: "ClipboardCheck" },
  { num: "03", title: "વ્યક્તિગત માર્ગદર્શન", desc: "દરેક વિદ્યાર્થી પર ખાસ ધ્યાન.", icon: "UserCheck" },
  { num: "04", title: "નાના બેચ", desc: "ગુણવત્તાસભર શિક્ષણ માટે નાના બેચ.", icon: "Users2" },
  { num: "05", title: "આધુનિક ક્લાસરૂમ", desc: "આધુનિક સુવિધાઓ સભર ક્લાસરૂમ.", icon: "Building2" },
  { num: "06", title: "અભ્યાસ સામગ્રી", desc: "પ્રિન્ટેડ નોંધપોથી અને પ્રેક્ટિસ બુક.", icon: "BookMarked" },
  { num: "07", title: "વાલી મીટિંગ", desc: "વાલીઓ સાથે નિયમિત સંપર્ક.", icon: "MessageSquare" },
  { num: "08", title: "100% પરિણામ કેન્દ્રિત અભ્યાસ", desc: "પરિણામ પર સંપૂર્ણ ધ્યાન.", icon: "Target" },
];

export const FAQS = [
  { q: "જવાહર નવોદય માટે કોણ અરજી કરી શકે?", a: "ધોરણ 5 માં અભ્યાસ કરતા તમામ વિદ્યાર્થીઓ જવાહર નવોદય પ્રવેશ પરીક્ષા માટે અરજી કરી શકે છે." },
  { q: "ફી કેટલી છે?", a: "ફી કોર્સ અને ધોરણ અનુસાર અલગ અલગ છે. વિગતવાર માહિતી માટે અમારો સંપર્ક કરો અથવા પ્રવેશ ફોર્મ ભરો." },
  { q: "શું મફત ડેમો ક્લાસ મળે છે?", a: "હા, પસંદ કરેલા કોર્સ માટે મફત ડેમો ક્લાસ ઉપલબ્ધ છે. અમારો સંપર્ક કરીને ડેમો ક્લાસ બુક કરો." },
  { q: "બેચ ક્યારે શરૂ થાય છે?", a: "નવો બેચ એપ્રિલ અને જૂન માસમાં શરૂ થાય છે. જાન્યુઆરીમાં પણ વિશેષ બેચ શરૂ થાય છે." },
  { q: "શું નોંધપોથી મળે છે?", a: "હા, દરેક કોર્સ માટે પ્રિન્ટેડ નોંધપોથી, પ્રેક્ટિસ બુક અને પ્રશ્નબેંક ઉપલબ્ધ છે." },
  { q: "શું Online Class છે?", a: "હા, અમુક કોર્સ માટે ઓનલાઈન ક્લાસની સુવિધા ઉપલબ્ધ છે. વિગત માટે સંપર્ક કરો." },
];

export const BATCH_TIMINGS = [
  { name: "સવારનો બેચ", time: "સવારે 7:00 — 10:00", desc: "તાજગી મન સાથે અભ્યાસ", icon: "Sunrise" },
  { name: "બપોરનો બેચ", time: "બપોરે 2:00 — 5:00", desc: "શાળા પછીનો અભ્યાસ", icon: "Sun" },
  { name: "સાંજનો બેચ", time: "સાંજે 5:00 — 8:00", desc: "પ્રવૃત્તિપૂર્ણ સત્ર", icon: "Sunset" },
  { name: "વીકએન્ડ બેચ", time: "શનિ-રવિ 9:00 — 12:00", desc: "વિશેષ તૈયારી", icon: "Calendar" },
];

export const VALUES = [
  { title: "પ્રામાણિકતા", desc: "દરેક વિદ્યાર્થી સાથે પ્રામાણિક અને પારદર્શક વ્યવહાર.", icon: "Heart" },
  { title: "શિસ્ત", desc: "શિસ્ત એ સફળતાનો પાયો છે.", icon: "ShieldCheck" },
  { title: "જ્ઞાન", desc: "ગુણવત્તાસભર જ્ઞાનની પ્રાપ્તિ.", icon: "BookOpen" },
  { title: "નવીનતા", desc: "આધુનિક શિક્ષણ પદ્ધતિઓનો સ્વીકાર.", icon: "Lightbulb" },
  { title: "નેતૃત્વ", desc: "વિદ્યાર્થીઓમાં નેતૃત્વ ગુણોનો વિકાસ.", icon: "Flag" },
  { title: "દેશભક્તિ", desc: "રાષ્ટ્ર પ્રત્યે પ્રેમ અને જવાબદારી.", icon: "Flag" },
];
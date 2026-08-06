const fs = require('fs');

const enPath = './src/locales/en/translation.json';
const guPath = './src/locales/gu/translation.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

// Inject new namespaces for pages
const enAdditions = {
  "about": {
    "hero_subtitle": "Vivekanand Tuition Classes — An educational family committed to the holistic development of students.",
    "mission_desc_2": "Our main purpose is not just to pass exams, but to develop self-confidence, discipline, thinking ability, and the capacity to succeed in life.",
    "shorts_label": "Shorts Video",
    "shorts_title": "Our Shorts Videos",
    "shorts_desc": "Watch short videos of education and inspiration.",
    "faculty_label": "Faculty",
    "faculty_title": "Our Teaching Staff",
    "faculty_desc": "Subject experts and experienced teachers.",
    "loading": "Loading...",
    "no_teachers": "No teacher details are currently available.",
    "msg_label": "Message",
    "msg_title": "Founder's Message",
    "founder_msg": "\"Our institution's main goal is not just to prepare students for marks but to give them good values, self-confidence, and preparation for success in life.\"",
    "founder_name": "— Founder, Vivekanand Tuition Classes",
    "values_label": "Our Values",
    "values_title": "Our Principles",
    "values_desc": "The values that guide us in every decision.",
    "cta_title": "Start your child's bright future today."
  },
  "courses_page": {
    "hero_subtitle": "Find the perfect course for your child's bright future.",
    "timings_label": "Timings",
    "timings_title": "Batch Timings",
    "timings_desc": "Convenient batch timings for every student.",
    "view_schedule": "View Schedule",
    "cta_title": "Ready to take admission?"
  },
  "admission": {
    "hero_subtitle": "Join Vivekanand Tuition Classes and step towards success.",
    "steps_label": "Process",
    "steps_title": "Admission Process",
    "steps_desc": "Simple and transparent admission process.",
    "form_label": "Admission Form",
    "form_title": "Apply for Admission",
    "form_desc": "Fill out the form below to secure your admission.",
    "s1_title": "Inquiry",
    "s1_desc": "Contact us to learn about courses.",
    "s2_title": "Counseling",
    "s2_desc": "Proper guidance for the student.",
    "s3_title": "Form Fillup",
    "s3_desc": "Fill out the admission form with documents.",
    "s4_title": "Confirmation",
    "s4_desc": "Admission confirmed after fee payment.",
    "fname": "Student Full Name",
    "pname": "Parent Name",
    "phone": "WhatsApp Number",
    "alt_phone": "Alternate Mobile Number",
    "course": "Select Course",
    "school": "Current School Name",
    "address": "Full Address",
    "submit": "Submit Application",
    "submitting": "Submitting...",
    "success": "Application submitted successfully! We will contact you soon.",
    "error": "Failed to submit application. Please try again."
  },
  "contact": {
    "hero_subtitle": "We are always ready to help you.",
    "info_label": "Contact Info",
    "info_title": "Get in Touch",
    "info_desc": "Visit our branch or contact us via phone/email.",
    "form_label": "Inquiry",
    "form_title": "Send a Message",
    "form_desc": "Fill out the form below to ask any questions.",
    "name": "Your Name",
    "email": "Email Address (Optional)",
    "phone": "Mobile Number",
    "subject": "Subject",
    "message": "Your Message",
    "submit": "Send Message",
    "submitting": "Sending...",
    "success": "Message sent successfully! We will contact you soon.",
    "error": "Failed to send message. Please try again."
  },
  "gallery_page": {
    "hero_subtitle": "Glimpses of activities, celebrations, and educational journey at our institute."
  },
  "results_page": {
    "hero_subtitle": "Proud results of our brilliant students.",
    "board": "Board Exam Results",
    "competitive": "Competitive Exam Results",
    "filter_all": "All Years",
    "filter_exam": "All Exams"
  },
  "header_misc": {
    "dark_mode": "Dark Mode",
    "light_mode": "Light Mode",
    "call_us": "Call Us",
    "admin_login": "Admin Login"
  }
};

const guAdditions = {
  "about": {
    "hero_subtitle": "વિવેકાનંદ ટ્યુશન ક્લાસીસ — વિદ્યાર્થીઓના સર્વાંગી વિકાસ માટે પ્રતિબદ્ધ શૈક્ષણિક પરિવાર.",
    "mission_desc_2": "અમારો મુખ્ય હેતુ માત્ર પરીક્ષા પાસ કરાવવાનો નથી, પરંતુ વિદ્યાર્થીઓમાં આત્મવિશ્વાસ, શિસ્ત, વિચારશક્તિ અને જીવનમાં સફળ થવા માટેની ક્ષમતાનો વિકાસ કરવાનો છે.",
    "shorts_label": "શોર્ટ્સ વિડિઓ",
    "shorts_title": "અમારા શોર્ટ્સ વિડિઓ",
    "shorts_desc": "શિક્ષણ અને પ્રેરણાના ટૂંકા વિડિઓઝ નિહાળો.",
    "faculty_label": "શિક્ષક મંડળ",
    "faculty_title": "અમારી શિક્ષક મંડળી",
    "faculty_desc": "વિષય નિષ્ણાત અને અનુભવી શિક્ષકો.",
    "loading": "લોડ થઈ રહ્યું છે...",
    "no_teachers": "કોઈ શિક્ષકની વિગત હાલ ઉપલબ્ધ નથી.",
    "msg_label": "સંદેશ",
    "msg_title": "સ્થાપકનો સંદેશ",
    "founder_msg": "\"વિદ્યાર્થીઓમાં માત્ર ગુણ જ નહીં પરંતુ સારા સંસ્કાર, આત્મવિશ્વાસ અને જીવનમાં સફળતા માટેની તૈયારી કરાવવી એ અમારી સંસ્થાનો મુખ્ય ધ્યેય છે.\"",
    "founder_name": "— સ્થાપક, વિવેકાનંદ ટ્યુશન ક્લાસીસ",
    "values_label": "અમારા મૂલ્યો",
    "values_title": "અમારા સિદ્ધાંતો",
    "values_desc": "જે મૂલ્યો અમને દરેક નિર્ણયમાં માર્ગદર્શન આપે છે.",
    "cta_title": "આજે જ તમારા બાળકના ભવિષ્યની શરૂઆત કરો."
  },
  "courses_page": {
    "hero_subtitle": "તમારા બાળકના ઉજ્જવળ ભવિષ્ય માટે યોગ્ય કોર્સ પસંદ કરો.",
    "timings_label": "સમયપત્રક",
    "timings_title": "બેચના સમય",
    "timings_desc": "દરેક વિદ્યાર્થી માટે અનુકૂળ બેચ સમય.",
    "view_schedule": "શેડ્યૂલ જુઓ",
    "cta_title": "શું તમે પ્રવેશ લેવા માટે તૈયાર છો?"
  },
  "admission": {
    "hero_subtitle": "વિવેકાનંદ ટ્યુશન ક્લાસીસમાં જોડાઈને સફળતા તરફ કદમ માંડો.",
    "steps_label": "પ્રક્રિયા",
    "steps_title": "પ્રવેશ પ્રક્રિયા",
    "steps_desc": "સરળ અને પારદર્શક પ્રવેશ પ્રક્રિયા.",
    "form_label": "પ્રવેશ ફોર્મ",
    "form_title": "એડમિશન માટે અરજી કરો",
    "form_desc": "પ્રવેશ મેળવવા માટે નીચેનું ફોર્મ ભરો.",
    "s1_title": "પૂછપરછ",
    "s1_desc": "કોર્સ વિશે જાણવા અમારો સંપર્ક કરો.",
    "s2_title": "કાઉન્સેલિંગ",
    "s2_desc": "વિદ્યાર્થી માટે યોગ્ય માર્ગદર્શન.",
    "s3_title": "ફોર્મ ભરવું",
    "s3_desc": "જરૂરી દસ્તાવેજો સાથે પ્રવેશ ફોર્મ ભરો.",
    "s4_title": "કન્ફર્મેશન",
    "s4_desc": "ફી ભર્યા બાદ પ્રવેશ કન્ફર્મ થશે.",
    "fname": "વિદ્યાર્થીનું પૂરું નામ",
    "pname": "વાલીનું નામ",
    "phone": "વોટ્સએપ નંબર",
    "alt_phone": "વૈકલ્પિક મોબાઈલ નંબર",
    "course": "કોર્સ પસંદ કરો",
    "school": "હાલની શાળાનું નામ",
    "address": "પૂરું સરનામું",
    "submit": "અરજી જમા કરો",
    "submitting": "જમા થઈ રહ્યું છે...",
    "success": "અરજી સફળતાપૂર્વક જમા થઈ ગઈ છે! અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.",
    "error": "અરજી જમા કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો."
  },
  "contact": {
    "hero_subtitle": "અમે તમારી મદદ માટે હંમેશા તત્પર છીએ.",
    "info_label": "સંપર્ક માહિતી",
    "info_title": "અમારો સંપર્ક કરો",
    "info_desc": "રૂબરૂ મુલાકાત માટે અમારી બ્રાન્ચ પર આવો અથવા ફોન/ઇમેઇલ દ્વારા સંપર્ક કરો.",
    "form_label": "પૂછપરછ",
    "form_title": "સંદેશ મોકલો",
    "form_desc": "કોઈપણ પ્રશ્ન કે માહિતી માટે નીચેનું ફોર્મ ભરો.",
    "name": "તમારું નામ",
    "email": "ઇમેઇલ એડ્રેસ (વૈકલ્પિક)",
    "phone": "મોબાઈલ નંબર",
    "subject": "વિષય",
    "message": "તમારો સંદેશ",
    "submit": "સંદેશ મોકલો",
    "submitting": "મોકલાઈ રહ્યું છે...",
    "success": "સંદેશ સફળતાપૂર્વક મોકલાઈ ગયો છે! અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.",
    "error": "સંદેશ મોકલવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો."
  },
  "gallery_page": {
    "hero_subtitle": "અમારી સંસ્થામાં થતી પ્રવૃત્તિઓ, ઉત્સવો અને શૈક્ષણિક સફરની ઝલક."
  },
  "results_page": {
    "hero_subtitle": "અમારા તેજસ્વી વિદ્યાર્થીઓના ગૌરવપૂર્ણ પરિણામો.",
    "board": "બોર્ડ પરીક્ષાના પરિણામો",
    "competitive": "સ્પર્ધાત્મક પરીક્ષાના પરિણામો",
    "filter_all": "બધા વર્ષ",
    "filter_exam": "બધી પરીક્ષાઓ"
  },
  "header_misc": {
    "dark_mode": "ડાર્ક મોડ",
    "light_mode": "લાઇટ મોડ",
    "call_us": "અમને કૉલ કરો",
    "admin_login": "એડમિન લૉગિન"
  }
};

Object.assign(enData, enAdditions);
Object.assign(guData, guAdditions);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(guPath, JSON.stringify(guData, null, 2));

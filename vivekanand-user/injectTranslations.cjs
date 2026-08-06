const fs = require('fs');

const enPath = './src/locales/en/translation.json';
const guPath = './src/locales/gu/translation.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

// Common UI elements
const enAdditions = {
  "footer": {
    "watermark": "Vivekanand Tuition Classes",
    "desc": "Quality education and trusted guidance for students' bright future.",
    "quick_links": "Quick Links",
    "our_courses": "Our Courses",
    "contact": "Contact",
    "email_placeholder": "Your email address",
    "rights": "All rights reserved.",
    "made_with": "Made with ❤ for students' success",
    "privacy": "Privacy Policy",
    "terms": "Terms & Conditions"
  }
};

const guAdditions = {
  "footer": {
    "watermark": "વિવેકાનંદ ટ્યુશન ક્લાસીસ",
    "desc": "વિદ્યાર્થીઓના ઉજ્જવળ ભવિષ્ય માટે ગુણવત્તાસભર શિક્ષણ અને વિશ્વાસપાત્ર માર્ગદર્શન.",
    "quick_links": "ઝડપી લિંક્સ",
    "our_courses": "અમારા કોર્સ",
    "contact": "સંપર્ક",
    "email_placeholder": "તમારું ઇમેઇલ સરનામું",
    "rights": "સર્વાધિકાર સુરક્ષિત.",
    "made_with": "વિદ્યાર્થીઓની સફળતા માટે ❤ સાથે બનાવેલ",
    "privacy": "ગોપનીયતા નીતિ",
    "terms": "નિયમો અને શરતો"
  }
};

Object.assign(enData, enAdditions);
Object.assign(guData, guAdditions);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(guPath, JSON.stringify(guData, null, 2));

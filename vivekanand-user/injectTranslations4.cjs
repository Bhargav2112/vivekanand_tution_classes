const fs = require('fs');

const enPath = './src/locales/en/translation.json';
const guPath = './src/locales/gu/translation.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

// Results Page
enData.results_page.toppers_label = "Toppers";
enData.results_page.toppers_title = "Our Merit Students";
enData.results_page.toppers_desc = "A tradition of excellent results every year.";
enData.results_page.no_years = "No results available for any year.";
enData.results_page.no_results = "No results found for";
enData.results_page.students = "Students";
enData.results_page.student_img = "Student Image";
enData.results_page.marks = "Marks";
enData.results_page.merit_student = "Merit Student";
enData.results_page.cta_title = "Take your child to the peak of success.";

guData.results_page.toppers_label = "ટોપર્સ";
guData.results_page.toppers_title = "અમારા મેરિટ વિદ્યાર્થીઓ";
guData.results_page.toppers_desc = "દર વર્ષે ઉત્તમ પરિણામોની પરંપરા.";
guData.results_page.no_years = "કોઈ વર્ષના પરિણામો ઉપલબ્ધ નથી.";
guData.results_page.no_results = "ના કોઈ પરિણામ મળ્યું નથી.";
guData.results_page.students = "વિદ્યાર્થીઓ";
guData.results_page.student_img = "વિદ્યાર્થી છબી";
guData.results_page.marks = "માર્ક્સ";
guData.results_page.merit_student = "મેરિટ સ્ટુડન્ટ";
guData.results_page.cta_title = "તમારા બાળકને પણ સફળતાના શિખરે પહોંચાડો.";

// Gallery Page
enData.gallery_page.all_photos = "All Photos";
enData.gallery_page.no_photos = "No photos available.";
enData.gallery_page.pictures = "Pictures";
enData.gallery_page.pictures_desc = "A glimpse of the educational journey.";

guData.gallery_page.all_photos = "બધા ફોટા";
guData.gallery_page.no_photos = "કોઈ ફોટા ઉપલબ્ધ નથી.";
guData.gallery_page.pictures = "ચિત્રો";
guData.gallery_page.pictures_desc = "શૈક્ષણિક સફરની ઝલક.";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(guPath, JSON.stringify(guData, null, 2));

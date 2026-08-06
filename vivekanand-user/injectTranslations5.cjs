const fs = require('fs');

const enPath = './src/locales/en/translation.json';
const guPath = './src/locales/gu/translation.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

// Gallery Page
enData.gallery_page.hero_title = "Our Activities";
enData.gallery_page.hero_subtitle = "Memorable moments from classrooms to success.";
enData.gallery_page.video_label = "Video Gallery";
enData.gallery_page.video_title = "Watch Videos";
enData.gallery_page.video_desc = "Experiences of students and parents and special classroom videos.";
enData.gallery_page.no_videos = "No videos available.";
enData.gallery_page.shorts_label = "Shorts";
enData.gallery_page.shorts_title = "Watch Shorts";
enData.gallery_page.shorts_desc = "Short and informative videos.";
enData.gallery_page.no_shorts = "No shorts available.";
enData.gallery_page.photo_label = "Photo Gallery";
enData.gallery_page.photo_title = "Memorable Moments";

guData.gallery_page.hero_title = "અમારી પ્રવૃત્તિઓ";
guData.gallery_page.hero_subtitle = "વર્ગખંડથી લઈને સફળતા સુધીની યાદગાર ક્ષણો.";
guData.gallery_page.video_label = "વિડિયો ગેલેરી";
guData.gallery_page.video_title = "વિડિયો જુઓ";
guData.gallery_page.video_desc = "વિદ્યાર્થીઓ અને વાલીઓના અનુભવો અને વિશેષ ક્લાસરૂમ વિડિઓઝ.";
guData.gallery_page.no_videos = "કોઈ વિડિયો ઉપલબ્ધ નથી.";
guData.gallery_page.shorts_label = "શોર્ટ્સ";
guData.gallery_page.shorts_title = "શોર્ટ્સ જુઓ";
guData.gallery_page.shorts_desc = "ટૂંકા અને માહિતીસભર વિડિઓઝ.";
guData.gallery_page.no_shorts = "કોઈ શોર્ટ્સ ઉપલબ્ધ નથી.";
guData.gallery_page.photo_label = "ફોટો ગેલેરી";
guData.gallery_page.photo_title = "યાદગાર ક્ષણો";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(guPath, JSON.stringify(guData, null, 2));

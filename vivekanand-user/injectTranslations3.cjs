const fs = require('fs');

const enPath = './src/locales/en/translation.json';
const guPath = './src/locales/gu/translation.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

enData.contact.quick_contact = "Quick Contact";
enData.contact.quick_desc = "Use the options below for immediate information.";
enData.contact.call_now = "Call Now";
enData.contact.whatsapp_now = "WhatsApp Us";
enData.contact.time = "Hours";
enData.contact.mon_fri = "Mon - Fri";
enData.contact.sat = "Sat";
enData.contact.sun = "Sun";
enData.contact.closed = "Closed";
enData.contact.follow_us = "Follow Us";
enData.contact.follow_desc = "Connect with us on social media.";
enData.contact.address_label = "Address";
enData.contact.phone_label = "Phone";

guData.contact.quick_contact = "ઝડપી સંપર્ક";
guData.contact.quick_desc = "તાત્કાલિક માહિતી માટે નીચેના વિકલ્પો વાપરો.";
guData.contact.call_now = "હમણાં કોલ કરો";
guData.contact.whatsapp_now = "WhatsApp કરો";
guData.contact.time = "સમય";
guData.contact.mon_fri = "સોમ - શુક્ર";
guData.contact.sat = "શનિ";
guData.contact.sun = "રવિ";
guData.contact.closed = "રજા";
guData.contact.follow_us = "અમને અનુસરો";
guData.contact.follow_desc = "સોશિયલ મીડિયા પર અમે જોડાઓ.";
guData.contact.address_label = "સરનામું";
guData.contact.phone_label = "ફોન";

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(guPath, JSON.stringify(guData, null, 2));

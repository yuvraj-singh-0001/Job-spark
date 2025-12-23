import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, Edit2, Save, X } from 'lucide-react';
import { useToast } from "../../../components/toast";
import api from "../../../components/apiconfig/apiconfig.jsx";

export default function ProfilePage() {
  const { showSuccess, showError } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    full_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    city: "",
    state: "",
    country: "India",
    highest_qualification: "",
    trade_stream: "",
    job_type: "Full-Time",
    availability: "Immediately",
    expected_salary: "",
    id_proof_available: "",
    experience_years: "0",
    linkedin_url: "",
    github_url: "",
    resume_path: "",
  });

  const [selectedResumeFile, setSelectedResumeFile] = useState(null);

  const genderOptions = ["Select", "Male", "Female", "Other"];
  const qualificationOptions = ["Select", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Student"];

  // Indian states
  const stateOptions = [
    "Select State", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
    "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
    "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep"
  ];

  // Cities grouped by state (comprehensive list)
  const citiesByState = {
    "Maharashtra": [
      "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded",
      "Sangli", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Jalna", "Bhusawal",
      "Navi Mumbai", "Kalyan", "Vasai-Virar", "Bhiwandi", "Ulhasnagar", "Panvel", "Satara", "Beed", "Yavatmal", "Osmanabad",
      "Nandurbar", "Wardha", "Gondia", "Hingoli", "Washim", "Buldhana", "Raigad", "Ratnagiri", "Sindhudurg", "Palghar"
    ],
    "Delhi": [
      "Delhi", "New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "North East Delhi",
      "North West Delhi", "South East Delhi", "South West Delhi", "Karol Bagh", "Connaught Place", "Lajpat Nagar", "Dwarka",
      "Rohini", "Pitampura", "Shahdara", "Seelampur", "Yamuna Vihar", "Karawal Nagar", "Nangloi Jat", "Rajouri Garden",
      "Tilak Nagar", "Janakpuri", "Uttam Nagar", "Vikas Puri", "Punjabi Bagh", "Paschim Vihar", "Moti Nagar"
    ],
    "Karnataka": [
      "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Shimoga",
      "Tumkur", "Raichur", "Bidar", "Hospet", "Hassan", "Gadag", "Robertsonpet", "Udupi", "Chitradurga", "Kolar",
      "Mandya", "Chikmagalur", "Gangavati", "Bagalkot", "Ranebennuru", "Haveri", "Byadgi", "Sirsi", "Sindhnur", "Karwar",
      "Yelahanka", "Channapatna", "Ramanagaram", "Kanakapura", "Dod Ballapur", "Nelamangala", "Anekal", "Hosur", "Krishnagiri"
    ],
    "Tamil Nadu": [
      "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Ranipet", "Nagercoil",
      "Thanjavur", "Vellore", "Kancheepuram", "Erode", "Tiruvannamalai", "Pollachi", "Rajapalayam", "Sivakasi", "Pudukkottai",
      "Neyveli", "Nagapattinam", "Viluppuram", "Tiruchengode", "Vaniyambadi", "Theni", "Udhagamandalam", "Arakkonam",
      "Paramakudi", "Ariyalur", "Tenkasi", "Sankarankoil", "Tirupathur", "Mayiladuthurai", "Sivaganga", "Virudhunagar"
    ],
    "Uttar Pradesh": [
      "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly", "Aligarh", "Moradabad",
      "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Shahjahanpur", "Rampur",
      "Mau", "Hapur", "Etawah", "Pilibhit", "Bahraich", "Unnao", "Rae Bareli", "Lakhimpur", "Sitapur", "Lakhnau",
      "Hardoi", "Azamgarh", "Jaunpur", "Basti", "Deoria", "Ballia", "Sultanpur", "Pratapgarh", "Fatehpur", "Faizabad"
    ],
    "Gujarat": [
      "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Nadiad", "Morvi",
      "Surendranagar", "Gondal", "Veraval", "Porbandar", "Godhra", "Dahod", "Palanpur", "Valsad", "Vapi", "Navsari",
      "Bardoli", "Vyara", "Songadh", "Udhna", "Jalalpore", "Katargam", "Utran", "Olpad", "Kosamba", "Mangrol", "Amreli",
      "Babarpur", "Botad", "Dhandhuka", "Dholka", "Gadhada", "Halvad", "Jasdan", "Jetpur", "Limbdi"
    ],
    "West Bengal": [
      "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Maheshtala", "Rajpur Sonarpur", "South Dum Dum", "Rajarhat Gopalpur",
      "Bhatpara", "Panihati", "Kamarhati", "Bardhaman", "Kulti", "Barasat", "Krishnanagar", "Sonarpur", "Titagarh", "Habra",
      "Uluberia", "Bally", "Jalpaiguri", "Naihati", "Bangaon", "Kharagpur", "Haldia", "Raiganj", "Balurghat", "Basirhat",
      "Bankura", "Purulia", "Midnapore", "Contai", "Tamluk", "Diamond Harbour", "Jaynagar Mazilpur", "Mathabhanga"
    ],
    "Rajasthan": [
      "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sri Ganganagar",
      "Pali", "Sikar", "Chittorgarh", "Tonk", "Kishangarh", "Beawar", "Gangapur", "Dausa", "Hindaun", "Bundi", "Churu",
      "Jhunjhunun", "Sawai Madhopur", "Nagaur", "Makrana", "Sujangarh", "Sardarshahar", "Ladnun", "Didwana", "Ratangarh",
      "Nokha", "Nimbahera", "Mandalgarh", "Chhoti Sadri", "Bhim", "Merta", "Phalodi", "Pokaran"
    ],
    "Andhra Pradesh": [
      "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Anantapur",
      "Vizianagaram", "Eluru", "Proddatur", "Nandyal", "Adoni", "Madanapalle", "Machilipatnam", "Tenali", "Chirala",
      "Bhimavaram", "Tadepalligudem", "Gudivada", "Srikakulam", "Dharmavaram", "Guntakal", "Hindupur", "Tadipatri",
      "Anakapalle", "Tuni", "Samalkot", "Jaggayyapeta", "Piduguralla", "Ponnur", "Markapur", "Kandukur", "Vinukonda"
    ],
    "Telangana": [
      "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahabubnagar", "Nalgonda", "Adilabad",
      "Suryapet", "Miryalaguda", "Jagtial", "Mancherial", "Bellampalli", "Kothagudem", "Bodhan", "Sircilla", "Tandur",
      "Vikarabad", "Medak", "Wanaparthy", "Gadwal", "Kamareddy", "Palwancha", "Mandamarri", "Asifabad", "Bellampur",
      "Chennur", "Choutuppal", "Devarkonda", "Ghanpur", "Huzurabad", "Jangaon", "Kalwakurthy", "Kodad", "Koratla"
    ],
    "Kerala": [
      "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kottayam", "Kannur",
      "Malappuram", "Ernakulam", "Idukki", "Kasaragod", "Pathanamthitta", "Wayanad", "Thirssur", "Kozhikode", "Kollam",
      "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
      "Kannur", "Kasaragod", "Pathanamthitta", "Thiruvananthapuram", "Kochi", "Kollam", "Kottayam", "Alappuzha"
    ],
    "Punjab": [
      "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Batala", "Pathankot", "Moga",
      "Abohar", "Malerkotla", "Khanna", "Phagwara", "Barnala", "Rajpura", "Sangrur", "Fazilka", "Ferozepur", "Muktsar",
      "Faridkot", "Kapurthala", "Zirakpur", "Ropar", "Nabha", "Talwandi Bhai", "Nakodar", "Phillaur", "Patti", "Rahon",
      "Jagraon", "Raikot", "Dhanaula", "Rampura Phul", "Bhawanigarh", "Maur", "Longowal", "Morinda", "Nangal"
    ],
    "Haryana": [
      "Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula",
      "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Palwal", "Rewari", "Hansi", "Narnaul",
      "Fatehabad", "Gohana", "Tohana", "Narwana", "Mewat", "Gurgaon Rural", "Pataudi", "Hathin", "Loharu", "Charkhi Dadri",
      "Badhra", "Dabwali", "Ellenabad", "Nohar", "Sadulpur", "Rajgarh", "Ratia", "Fatehabad", "Adampur"
    ],
    "Madhya Pradesh": [
      "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Ratlam", "Satna", "Murwara", "Morena", "Singrauli",
      "Rewa", "Vidisha", "Ganj Basoda", "Shivpuri", "Mandsaur", "Neemuch", "Nagda", "Itarsi", "Sehore", "Mhow", "Seoni",
      "Balaghat", "Ashoknagar", "Tikamgarh", "Shahdol", "Panna", "Chhatarpur", "Damoh", "Mandasor", "Dewas", "Betul",
      "Harda", "Hoshangabad", "Raisen", "Rajgarh", "Shajapur", "Khandwa", "Khargone", "Burhanpur"
    ],
    "Bihar": [
      "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Arrah", "Begusarai", "Chhapra", "Katihar", "Munger",
      "Purnia", "Saharsa", "Sasaram", "Hajipur", "Dehri", "Bettiah", "Motihari", "Bagaha", "Siwan", "Gopalganj",
      "Sitamarhi", "Jamui", "Jehanabad", "Aurangabad", "Lakhisarai", "Nawada", "Jamalpur", "Hilsa", "Warisaliganj",
      "Rajgir", "Samastipur", "Dalsinghsarai", "Rosera", "Forbesganj", "Raxaul", "Jogbani", "Sonepur", "Islampur"
    ],
    "Odisha": [
      "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Baleshwar", "Bhadrak", "Baripada",
      "Jharsuguda", "Brajarajnagar", "Rayagada", "Koraput", "Kendujhar", "Talcher", "Sundargarh", "Subarnapur",
      "Malkangiri", "Phulbani", "Titlagarh", "Nabarangpur", "Umerkote", "Jatni", "Khurda", "Balugaon", "Jagatsinghpur",
      "Cuttack Sadar", "Nimapada", "Pipili", "Nischintakoili", "Paradip", "Athagarh", "Banki", "Asika", "Ganjam"
    ],
    "Chhattisgarh": [
      "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Raigarh", "Jagdalpur", "Ambikapur", "Rajnandgaon", "Chirmiri",
      "Dhamtari", "Mahasamund", "Kawardha", "Bijapur", "Narayanpur", "Dantewada", "Kanker", "Bastar", "Jagdalpur",
      "Kondagaon", "Uttar Bastar Kanker", "Bemetra", "Naila Janjgir", "Mungeli", "Lormi", "Pandariya", "Takhatpur",
      "Gharghoda", "Shivrinarayan", "Sakti", "Saraipali", "Basna", "Pithora", "Katghora", "Baloda", "Arang"
    ],
    "Jharkhand": [
      "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar",
      "Chirkunda", "Dumka", "Gumia", "Lohardaga", "Pakur", "Simdega", "Chatra", "Godda", "Sahibganj", "Latehar",
      "Palamu", "Garhwa", "Khunti", "Gumla", "West Singhbhum", "East Singhbhum", "Saraikela Kharsawan", "Jamtara",
      "Kodarma", "Bermo", "Bundu", "Manoharpur", "Kharsawan", "Chakradharpur", "Noamundi", "Chaibasa", "Jagannathpur"
    ],
    "Uttarakhand": [
      "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Almora",
      "Nainital", "Pantnagar", "Kichha", "Sitarganj", "Bazpur", "Khatima", "Maholi", "Laksar", "Manglaur", "Jaspur",
      "Kotdwara", "Najibabad", "Nagina", "Dhampur", "Nihtaur", "Sherkot", "Afzalgarh", "Jwalapur", "Bijnor", "Chandpur",
      "Haldaur", "Kiratpur", "Mandawar", "Najibabad", "Seohara", "Sultanpur", "Tanda", "Thakurdwara"
    ],
    "Himachal Pradesh": [
      "Shimla", "Mandi", "Dharamshala", "Solan", "Nahan", "Una", "Palampur", "Hamirpur", "Bilaspur", "Kangra",
      "Chamba", "Lahaul and Spiti", "Kinnaur", "Sirmaur", "Amb", "Banjar", "Bharmour", "Dalhousie", "Jogindernagar",
      "Karsog", "Rampur", "Sundernagar", "Theog", "Arki", "Baddi", "Nalagarh", "Parwanoo", "Kasauli", "Dagshai",
      "Sabathu", "Jutogh", "Tara Devi", "Summer Hill", "Chaura Maidan", "Fagu", "Kumarsain", "Rohru", "Narkanda"
    ],
    "Jammu and Kashmir": [
      "Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur", "Poonch", "Rajouri", "Pulwama", "Shopian",
      "Badgam", "Kulgam", "Doda", "Ramban", "Kishtwar", "Samba", "Reasi", "H Jammu", "Akhnoor", "Bishnah", "R S Pura",
      "Sunderbani", "Mendhar", "Katra", "Udhampur", "Chenani", "Ramban", "Banihal", "Gool Gulab Garh", "Surankote",
      "Mendhar", "Nowshera", "Kalakote", "Rajauri", "Thanamandi", "Sunderbani", "Hajin", "Bandipore", "Gurez"
    ],
    "Goa": [
      "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanguem", "Quepem", "Canacona",
      "Dharbandora", "Pernem", "Bardez", "Tiswadi", "Ponda", "Sattari", "Bicholim", "Dharbandora", "Sanguem", "Canacona",
      "Valpoi", "Anjuna", "Calangute", "Candolim", "Siolim", "Morjim", "Arambol", "Mandrem", "Tivim", "Mapusa",
      "Aldona", "Corlim", "Chimbel", "Jua", "Usgao", "Pale", "Moira", "Saligao", "Betim", "Latambarcem"
    ],
    "Assam": [
      "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Sibsagar",
      "North Lakhimpur", "Goalpara", "Barpeta", "Morigaon", "Kokrajhar", "Nalbari", "Rangia", "Mangaldoi", "Diphu",
      "Hailakandi", "Tihu", "Howli", "Barpeta Road", "Sarthebari", "Pathsala", "Sorbhog", "Bijni", "Chapar", "Hajo",
      "Palasbari", "Sualkuchi", "North Guwahati", "Gauripur", "Dhubri", "Bilasipara", "Mankachar", "Fakiragram"
    ],
    "Sikkim": [
      "Gangtok", "Namchi", "Gyalshing", "Mangan", "Ravangla", "Singtam", "Jorethang", "Rangpo", "Pakyong", "Soreng",
      "Geyzing", "Dentam", "Yuksom", "Rinchenpong", "Martam", "Bermiok", "Chungthang", "Dikchu", "Gangtok", "Mangan",
      "Namchi", "Gyalshing", "Soreng", "Singtam", "Rangpo", "Jorethang", "Pakyong", "Ravangla", "Dentam", "Geyzing"
    ],
    "Tripura": [
      "Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Ambassa", "Khowai", "Teliamura", "Bishalgarh",
      "Sonamura", "Melaghar", "Jirania", "Mohanpur", "Ranirbazar", "Sabroom", "Santirbazar", "Kumarghat", "Panisagar",
      "Kanchanpur", "Gakulnagar", "Radhakishorepur", "Boxanagar", "Palatana", "Manu", "Fatikroy", "Chandipur", "Kamalpur",
      "Surjyamaninagar", "Charipara", "Takaramile", "Narsingarh", "Bagafa", "Satchand", "Kamal Krishnabari"
    ],
    "Manipur": [
      "Imphal", "Thoubal", "Lilong", "Mayang Imphal", "Kakching", "Ukhrul", "Chandel", "Senapati", "Tamenglong", "Jiribam",
      "Bishnupur", "Noney", "Pherzawl", "Kangpokpi", "Tengnoupal", "Moreh", "Moirang", "Wangjing", "Yairipok", "Sugnu",
      "Kwakta", "Lamshang", "Patsoi", "Samurou", "Wangkhei", "Lairikyengbam Leikai", "Konthoujam", "Utlou", "Khurai",
      "Andro", "Lamlai", "Wangoi", "Sekmai", "Lamsang", "Keirao Bitra", "Lairikyengbam Leikai", "Konthoujam", "Utlou"
    ],
    "Meghalaya": [
      "Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Nongpoh", "Mairang", "Cherrapunjee",
      "Mawkyrwat", "Khliehriat", "Mawphlang", "Pynursla", "Sohra", "Mawlynnong", "Laitumkhrah", "Jowai", "Nongstoin",
      "Williamnagar", "Baghmara", "Resubelpara", "Nongpoh", "Mairang", "Khliehriat", "Mawkyrwat", "Mawphlang", "Pynursla",
      "Sohra", "Mawlynnong", "Laitumkhrah", "Baridua", "Dalu", "Mahendraganj", "Rongjeng", "Songsak", "Rongram"
    ],
    "Nagaland": [
      "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Kiphire", "Longleng",
      "Peren", "Chumukedima", "Pfutsero", "Chizami", "Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip",
      "Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Khawzawl", "Zawlnuam",
      "Hnahthial", "Saitual", "Ngopa", "Reiek", "Vairengte", "Kawnpui", "Darlawn", "Sialsuk", "Biate", "Thingsulthliah"
    ],
    "Mizoram": [
      "Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Khawzawl", "Zawlnuam",
      "Hnahthial", "Saitual", "Ngopa", "Reiek", "Vairengte", "Kawnpui", "Darlawn", "Sialsuk", "Biate", "Thingsulthliah",
      "Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Khawzawl", "Zawlnuam"
    ],
    "Arunachal Pradesh": [
      "Itanagar", "Naharlagun", "Pasighat", "Along", "Tawang", "Ziro", "Bomdila", "Aalo", "Tezu", "Roing", "Namsai",
      "Yingkiong", "Daporijo", "Koloriang", "Basar", "Anini", "Mechuka", "Hayuliang", "Chowkham", "Tuting", "Geku",
      "Mariyang", "Kamba", "L Kra Daadi", "Palin", "Raga", "Daporijo", "Bomdila", "Dirang", "Kalaktang", "Mukto"
    ],
    "Puducherry": [
      "Puducherry", "Karaikal", "Mahe", "Yanam", "Puducherry", "Karaikal", "Mahe", "Yanam", "Ariankuppam", "Manavely",
      "Ozhukarai", "Villianur", "Mudaliarpet", "Ariyankuppam", "Thirubuvanai", "Mannadipet", "Ossudu", "Vazhudavur",
      "Bahour", "Nettapakkam", "Pondicherry", "Karaikal", "Mahe", "Yanam", "Ariankuppam", "Manavely", "Ozhukarai"
    ],
    "Chandigarh": [
      "Chandigarh", "Chandigarh", "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Sector 7",
      "Sector 8", "Sector 9", "Sector 10", "Sector 11", "Sector 12", "Sector 13", "Sector 14", "Sector 15", "Sector 16",
      "Sector 17", "Sector 18", "Sector 19", "Sector 20", "Sector 21", "Sector 22", "Sector 23", "Sector 24", "Sector 25",
      "Sector 26", "Sector 27", "Sector 28", "Sector 29", "Sector 30", "Sector 31", "Sector 32", "Sector 33", "Sector 34",
      "Sector 35", "Sector 36", "Sector 37", "Sector 38", "Sector 39", "Sector 40", "Sector 41", "Sector 42", "Sector 43",
      "Sector 44", "Sector 45", "Sector 46", "Sector 47", "Sector 48", "Sector 49", "Sector 50", "Sector 51", "Sector 52",
      "Sector 53", "Sector 54", "Sector 55", "Sector 56", "Industrial Area Phase 1", "Industrial Area Phase 2"
    ],
    "Andaman and Nicobar Islands": [
      "Port Blair", "Car Nicobar", "Mayabunder", "Diglipur", "Rangat", "Little Andaman", "Hut Bay", "Aerial Bay",
      "Campbell Bay", "Nancowry", "Kamorta", "Trinket", "Long Island", "Cinque Island", "North Passage Island",
      "Maimyo", "Smith Island", "Stewart Island", "Ross Island", "Narcondam Island", "Landfall Island", "Interview Island",
      "Brothers Island", "Sister Island", "Bentinck Island", "Son Island", "Roper Island", "Harminder Bay", "Chidiya Tapu"
    ],
    "Dadra and Nagar Haveli and Daman and Diu": [
      "Daman", "Diu", "Silvassa", "Amli", "Naroli", "Vasona", "Magarwada", "Kherdi", "Morkhal", "Rakholi", "Pariali",
      "Samarvarni", "Masat", "Kachigam", "Saily", "Kharadpada", "Kilvani", "Sindoni", "Mandoni", "Bordi", "Kolak",
      "Randha", "Samarvarni", "Masat", "Kachigam", "Saily", "Kharadpada", "Kilvani", "Sindoni", "Mandoni"
    ],
    "Ladakh": [
      "Leh", "Kargil", "Padum", "Drass", "Leh", "Kargil", "Padum", "Drass", "Zanskar", "Nubra", "Changthang", "Sham",
      "Hemis", "Shey", "Thiksey", "Matho", "Stakna", "Spituk", "Choglamsar", "Sankoo", "Ney", "Phyang", "Temisgam",
      "Nimoo", "Bazgo", "Chuchot", "Khaltsi", "Skurbuchan", "Takmachik", "Tangtse", "Hunder", "Diskit", "Hundar"
    ]
  };

  // Trade/Stream options by qualification level
  const tradesByQualification = {
    "10th Pass": [
      "Select Trade/Stream", "Helper", "Delivery", "Security Guard", "Housekeeping", "Waiter",
      "Cook", "Driver", "Mason", "Painter", "Carpenter", "Mechanic", "Telecaller"
    ],
    "12th Pass": [
      "Select Trade/Stream", "Electrician", "Plumber", "Mechanic", "Carpenter", "Welder",
      "Painter", "Mason", "Driver", "Delivery", "Security Guard", "Housekeeping",
      "Cook", "Waiter", "Telecaller", "Data Entry"
    ],
    "ITI": [
      "Select Trade/Stream", "Electrician", "Plumber", "Mechanic", "Welder", "Carpenter",
      "Fitter", "Turner", "Machinist", "Draughtsman", "Refrigeration Technician",
      "AC Technician", "Motor Mechanic", "Diesel Mechanic", "Auto Electrician"
    ],
    "Diploma": [
      "Select Trade/Stream", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
      "Computer Engineering", "Electronics Engineering", "Automobile Engineering",
      "Chemical Engineering", "Instrumentation Engineering", "IT Support", "Network Administrator",
      "Hardware Technician", "Software Developer", "Web Developer", "Mobile App Developer"
    ],
    "Graduate": [
      "Select Trade/Stream", "Arts", "Science", "Commerce", "Engineering", "Computer / IT",
      "Management", "Medical", "Law", "Other"
    ],
    "Student": [
      "Select Trade/Stream", "Arts", "Science", "Commerce", "Engineering", "Computer / IT",
      "Management", "Medical", "Law", "Other"
    ]
  };

  // Function to get relevant trades based on qualification
  function getTradesForQualification(qualification) {
    return tradesByQualification[qualification] || ["Select Trade/Stream"];
  }

  // Salary ranges in INR
  const salaryOptions = [
    "Select Salary Range", "₹8,000–12,000", "₹12,000–18,000", "₹18,000–25,000", "₹25,000+"
  ];


  const jobTypeOptions = ["Full-Time", "Part-Time", "Internship", "Contract"];
  const availabilityOptions = ["Immediately", "15 Days", "30 Days"];
  const idProofOptions = ["Select", "Aadhaar", "PAN", "Driving License", "None"];

  useEffect(() => {
    loadProfile();
  }, []);

  // Clear trade_stream when qualification doesn't require it
  useEffect(() => {
    const qualificationsThatNeedTrade = ["Diploma", "Graduate", "Student"];
    if (form.highest_qualification && !qualificationsThatNeedTrade.includes(form.highest_qualification)) {
      setForm(prev => ({ ...prev, trade_stream: "" }));
    }
  }, [form.highest_qualification]);

  // Clear ID proof when qualification is not 10th Pass
  useEffect(() => {
    if (form.highest_qualification && form.highest_qualification !== "10th Pass") {
      setForm(prev => ({ ...prev, id_proof_available: "" }));
    }
  }, [form.highest_qualification]);

  // Clear LinkedIn URL when qualification is not Graduate, Student, or Diploma
  useEffect(() => {
    const allowedQualifications = ["Graduate", "Student", "Diploma"];
    if (form.highest_qualification && !allowedQualifications.includes(form.highest_qualification)) {
      setForm(prev => ({ ...prev, linkedin_url: "" }));
    }
  }, [form.highest_qualification]);

  // Clear GitHub URL when qualification is not Graduate/Student/Diploma or trade stream is not IT-related
  useEffect(() => {
    const allowedQualifications = ["Graduate", "Student", "Diploma"];
    const isAllowedQualification = allowedQualifications.includes(form.highest_qualification);
    const isITRelated = form.trade_stream && (form.trade_stream.toLowerCase().includes('computer') || form.trade_stream.toLowerCase().includes('it'));

    if (!isAllowedQualification || !isITRelated) {
      setForm(prev => ({ ...prev, github_url: "" }));
    }
  }, [form.highest_qualification, form.trade_stream]);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/profile/user");
      if (res?.data?.success && res.data.user) {
        setUser(res.data.user);
        setForm(mapUserToForm(res.data.user));
      }
    } catch (err) {
      // Error loading profile
    } finally {
      try {
        const auth = await api.get('/auth/session');
        const authUser = auth?.data?.user;
        if (authUser) {
          setForm((s) => ({
            ...s,
            user_id: s.user_id || authUser.id || authUser.sub,
            full_name: s.full_name || authUser.name || authUser.full_name || s.full_name
          }));
        }
      } catch (ignore) { }
      setLoading(false);
    }
  }

  function mapUserToForm(u) {
    // Helper function to format date for HTML date input (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    return {
      user_id: u.user_id || u.id || "",
      full_name: u.full_name || "",
      phone: u.phone || "",
      date_of_birth: formatDateForInput(u.date_of_birth),
      gender: u.gender || "",
      city: u.city || "",
      state: u.state || "",
      country: "India",
      highest_qualification: u.highest_qualification || "",
      trade_stream: Array.isArray(u.trade_stream) ? (u.trade_stream.length > 0 ? u.trade_stream[0] : "") : (u.trade_stream || ""),
      job_type: u.job_type || "",
      availability: u.availability || "",
      expected_salary: u.expected_salary || "",
      id_proof_available: u.id_proof_available || "",
      experience_years: u.experience_years !== undefined && u.experience_years !== null ? String(u.experience_years) : "",
      linkedin_url: u.linkedin_url || "",
      github_url: u.github_url || "",
      resume_path: u.resume_path || "",
    };
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // Get cities for selected state
  function getCitiesForState(state) {
    return citiesByState[state] || [];
  }


  // Check if professional links should be shown
  function shouldShowProfessionalLinks() {
    // Show section if LinkedIn field should be shown OR GitHub field should be shown
    return shouldShowLinkedIn() || shouldShowGitHub();
  }

  // Check if LinkedIn field should be shown (for Graduate, Student, Diploma)
  function shouldShowLinkedIn() {
    return ["Graduate", "Student", "Diploma"].includes(form.highest_qualification);
  }

  // Check if GitHub field should be shown (for Graduate, Student, Diploma with IT-related stream)
  function shouldShowGitHub() {
    const allowedQualifications = ["Graduate", "Student", "Diploma"];
    const isAllowedQualification = allowedQualifications.includes(form.highest_qualification);
    const isITRelated = form.trade_stream && (form.trade_stream.toLowerCase().includes('computer') || form.trade_stream.toLowerCase().includes('it'));
    return isAllowedQualification && isITRelated;
  }

  // Check if experience years should be shown
  function shouldShowExperienceYears() {
    return form.experience_years !== "0" && form.experience_years !== "";
  }

  // Check if documents section should be shown
  function shouldShowDocumentsSection() {
    const hasPersonalInfo = form.full_name && form.phone && form.date_of_birth && form.gender;
    const hasLocation = form.city && form.state && form.country;
    const hasEducation = form.highest_qualification;
    return hasPersonalInfo && hasLocation && hasEducation;
  }

  // Validation functions
  function validatePhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  function validateExperienceYears(years) {
    const num = parseInt(years);
    return !isNaN(num) && num >= 0 && num <= 40;
  }

  function validateTrades(trades) {
    return typeof trades === 'string' && trades.trim() !== "";
  }

  function validateDateOfBirth(dob) {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }

  function validateForm() {
    const errors = [];

    // Phone validation
    if (!form.phone || !validatePhoneNumber(form.phone)) {
      errors.push("Mobile number must be exactly 10 digits and start with 6-9");
    }

    // Date of birth validation
    if (!form.date_of_birth || !validateDateOfBirth(form.date_of_birth)) {
      errors.push("Date of birth is required and must be for someone 18 years or older");
    }

    // Trade validation (optional)
    // Removed - trade_stream is now optional

    // Experience years validation
    if (form.experience_years === "") {
      // If experience_years is empty string, it means user selected "No, I have experience" but didn't enter years
      errors.push("Please enter your years of experience");
    } else if (form.experience_years !== "0" && !validateExperienceYears(form.experience_years)) {
      errors.push("Experience years must be an integer between 1 and 40");
    }

    // ID proof validation - required for 10th Pass, 12th Pass, and ITI qualifications
    if (["10th Pass", "12th Pass", "ITI"].includes(form.highest_qualification) && !form.id_proof_available) {
      errors.push("ID proof is required for 10th pass qualification");
    }

    return errors;
  }

  // Section completion checkers
  function isPersonalInfoComplete() {
    return form.full_name && validatePhoneNumber(form.phone) && form.date_of_birth && form.gender;
  }

  function isLocationComplete() {
    return form.state && form.city && form.country;
  }

  function isEducationComplete() {
    return form.highest_qualification;
  }

  function isExperienceComplete() {
    // If fresher (experience_years === "0"), section is complete
    if (form.experience_years === "0") return true;
    // If has experience but no years entered, not complete
    if (form.experience_years === "") return false;
    // If has experience and years entered, validate the years
    return validateExperienceYears(form.experience_years);
  }

  function isJobPreferencesComplete() {
    return form.job_type && form.availability;
  }


  function handleFileSelect(e) {
    const file = e.target.files?.[0] || null;

    if (file && !file.name.toLowerCase().endsWith('.pdf')) {
      showError('Please select a PDF file only. Other formats are not accepted.');
      return;
    }

    setSelectedResumeFile(file);
    setForm((s) => ({ ...s, resume_path: file ? `${file.name}` : s.resume_path }));
  }

  async function uploadResume(file) {
    return file ? file.name : null;
  }

  async function handleSave(e) {
    e?.preventDefault();
    setSaving(true);
    setError(null);

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showError(validationErrors.join('. '));
      setSaving(false);
      return;
    }

    try {
      let payloadUserId = form.user_id;
      if (!payloadUserId) {
        try {
          const auth = await api.get('/auth/session');
          const authUser = auth?.data?.user;
          if (authUser) {
            payloadUserId = authUser.id || authUser.sub || payloadUserId;
            setForm((s) => ({ ...s, user_id: payloadUserId }));
          } else {
            showError('Cannot save profile: missing user session. Please sign in again.');
            setSaving(false);
            return;
          }
        } catch (err) {
          showError('Cannot save profile: missing user session. Please sign in again.');
          setSaving(false);
          return;
        }
      }

      // Resume upload is optional
      let resumePathToSend = null;

      if (selectedResumeFile) {
        // User uploaded a resume - send it to be renamed to <user_id>.pdf
        resumePathToSend = `/uploads/resumes/${payloadUserId}.pdf`;

        try {
          const formData = new FormData();
          formData.append('resume', selectedResumeFile);
          formData.append('user_id', payloadUserId);

          const uploadRes = await api.post('/profile/upload-resume', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (uploadRes?.data?.success) {
            resumePathToSend = uploadRes.data.resume_path;
          } else {
            showError('Failed to upload resume file');
            setSaving(false);
            return;
          }
        } catch (err) {
          showError('Failed to upload resume file');
          setSaving(false);
          return;
        }
      }


      const toNullIfEmpty = (value) => {
        if (value === undefined || value === null || value === '') return null;
        return value;
      };

      const payload = {
        user_id: payloadUserId || undefined,
        full_name: form.full_name || null,
        phone: toNullIfEmpty(form.phone),
        date_of_birth: toNullIfEmpty(form.date_of_birth),
        gender: toNullIfEmpty(form.gender),
        city: toNullIfEmpty(form.city),
        state: toNullIfEmpty(form.state),
        country: "India",
        highest_qualification: toNullIfEmpty(form.highest_qualification),
        trade_stream: toNullIfEmpty(form.trade_stream),
        job_type: toNullIfEmpty(form.job_type),
        availability: toNullIfEmpty(form.availability),
        expected_salary: toNullIfEmpty(form.expected_salary),
        id_proof_available: toNullIfEmpty(form.id_proof_available),
        experience_years: form.experience_years && form.experience_years !== '' ? parseFloat(form.experience_years) : null,
        resume_path: toNullIfEmpty(resumePathToSend),
        linkedin_url: toNullIfEmpty(form.linkedin_url),
        github_url: toNullIfEmpty(form.github_url),
      };

      const res = await api.put("/profile/user", payload);

      if (res?.data?.success) {
        setUser(res.data.user || payload);
        setForm(mapUserToForm(res.data.user || payload));
        setIsEditing(false);
        setSelectedResumeFile(null);

        const applyJobId = localStorage.getItem("postLoginApplyJobId");
        const redirectPath = localStorage.getItem("postLoginRedirect");

        if (applyJobId && redirectPath) {
          localStorage.removeItem("postLoginApplyJobId");
          localStorage.removeItem("postLoginRedirect");
          showSuccess("Profile saved successfully! You can now apply for the job.");
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1500);
          return;
        } else {
          showSuccess("Profile saved successfully!");
        }
      } else {
        const errorMsg = res?.data?.message || res?.data?.error || "Unknown server response";
        showError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Failed to save profile";
      showError(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  function handleEditClick() {
    setIsEditing(true);
    if (user) setForm(mapUserToForm(user));
  }

  function handleCancel() {
    setIsEditing(false);
    if (user) setForm(mapUserToForm(user));
    setSelectedResumeFile(null);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your professional information</p>
          </div>
          {!isEditing && user && (
            <button onClick={handleEditClick} className="btn btn-primary px-4 py-2 inline-flex items-center gap-2">
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <ProfileView user={user} onEdit={handleEditClick} />
        ) : (
          <form onSubmit={handleSave} className="space-y-6">

            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <User size={20} />
                  Personal Information

                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number *</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                          if (value.length <= 10) {
                            handleChange({ target: { name: 'phone', value } });
                          }
                        }}
                        required
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number starting with 6-9</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
                      <input
                        name="date_of_birth"
                        type="date"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        required
                        max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">Must be 18 years or older</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {genderOptions.map(opt => (
                          <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin size={20} />
                  Location
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {stateOptions.map(state => (
                        <option key={state} value={state === "Select State" ? "" : state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select City</option>
                      {getCitiesForState(form.state).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country *</label>
                    <select
                      name="country"
                      value={form.country}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Skills */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <GraduationCap size={20} />
                  Education & Skills

                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Highest Qualification *</label>
                    <select
                      name="highest_qualification"
                      value={form.highest_qualification}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {qualificationOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  {["Diploma", "Graduate", "Student"].includes(form.highest_qualification) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Trade / Stream
                      </label>
                      <select
                        name="trade_stream"
                        value={form.trade_stream}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Trade/Stream</option>
                        {getTradesForQualification(form.highest_qualification)
                          .filter(trade => trade !== "Select Trade/Stream")
                          .map(trade => (
                            <option key={trade} value={trade}>{trade}</option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Briefcase size={20} />
                  Experience

                </h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Are you a Fresher?</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, experience_years: "0" }))}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${form.experience_years === "0"
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Yes, I'm a Fresher
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, experience_years: "" }))}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${form.experience_years !== "0"
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      No, I have experience
                    </button>
                  </div>
                </div>

                {form.experience_years !== "0" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Years *</label>
                      <input
                        name="experience_years"
                        type="number"
                        step="1"
                        min="1"
                        max="40"
                        value={form.experience_years === "" ? "" : form.experience_years}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 40)) {
                            handleChange({ target: { name: 'experience_years', value } });
                          }
                        }}
                        required
                        placeholder="e.g., 2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Preferences */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  Job Preferences

                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Job Type *</label>
                    <div className="flex flex-wrap gap-2">
                      {jobTypeOptions.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, job_type: option }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${form.job_type === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Availability *</label>
                    <div className="flex flex-wrap gap-2">
                      {availabilityOptions.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, availability: option }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${form.availability === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Expected Salary</label>
                    <select
                      name="expected_salary"
                      value={form.expected_salary}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {salaryOptions.map(salary => (
                        <option key={salary} value={salary === "Select Salary Range" ? "" : salary}>{salary}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {shouldShowDocumentsSection() && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <FileText size={20} />
                    Documents
                  </h3>
                </div>
                <div className="p-6">

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume Upload (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText size={24} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedResumeFile ? selectedResumeFile.name : (form.resume_path ? 'Resume uploaded' : 'No resume selected')}
                            </p>
                            <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                          </div>
                        </div>
                        <label className="cursor-pointer">
                          <span className="btn btn-primary btn-sm">Choose PDF</span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {selectedResumeFile && !selectedResumeFile.name.toLowerCase().endsWith('.pdf') && (
                        <p className="text-xs text-red-600 mt-2">Please select a PDF file only</p>
                      )}
                    </div>
                  </div>


                  {["10th Pass", "12th Pass", "ITI"].includes(form.highest_qualification) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Proof Available *</label>
                      <select
                        name="id_proof_available"
                        value={form.id_proof_available}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {idProofOptions.map(opt => (
                          <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Professional Links */}
            {shouldShowProfessionalLinks() && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">Professional Links</h3>
                </div>
                <div className="p-6">
                  <div className={`grid grid-cols-1 ${(shouldShowLinkedIn() && shouldShowGitHub()) ? 'md:grid-cols-2' : ''} gap-4`}>
                    {shouldShowLinkedIn() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
                        <input
                          name="linkedin_url"
                          value={form.linkedin_url}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourprofile"
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    )}
                    {shouldShowGitHub() && (
                      <div className={(shouldShowLinkedIn() && shouldShowGitHub()) ? '' : 'md:col-span-2'}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub URL</label>
                        <input
                          name="github_url"
                          value={form.github_url}
                          onChange={handleChange}
                          placeholder="https://github.com/yourusername"
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ProfileView({ user, onEdit }) {
  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Found</h3>
          <p className="text-gray-600 mb-6">Create your professional profile to get started</p>
          <button onClick={onEdit} className="btn btn-primary p-2">
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.full_name}</h2>
              <p className="text-gray-600">{user.highest_qualification || "Add education"}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span>{user.experience_years ?? 0} years experience</span>
                <span>•</span>
                <span>{user.phone || "No phone"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <User size={20} />
              Personal Information
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <InfoItem label="Full Name" value={user.full_name} />
              <InfoItem label="Mobile" value={user.phone} />
              <InfoItem label="Date of Birth" value={user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-GB') : "—"} />
              <InfoItem label="Gender" value={user.gender} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <MapPin size={20} />
              Location
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <InfoItem label="City" value={user.city} />
              <InfoItem label="State" value={user.state} />
              <InfoItem label="Country" value={user.country} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap size={20} />
              Education & Skills
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <InfoItem label="Qualification" value={user.highest_qualification} />
              {["Diploma", "Graduate", "Student"].includes(user.highest_qualification) && (
                <InfoItem label="Trade/Stream" value={user.trade_stream} />
              )}
              <InfoItem label="Skill Level" value={user.skill_level} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase size={20} />
              Job Preferences
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <InfoItem label="Experience Type" value={user.experience_type} />
              <InfoItem label="Experience Years" value={user.experience_years !== undefined && user.experience_years !== null ? `${user.experience_years} years` : "—"} />
              <InfoItem label="Job Type" value={user.job_type} />
              <InfoItem label="Expected Salary" value={user.expected_salary} />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Links */}
      {(() => {
        const shouldShowLinkedIn = user.highest_qualification === "Graduate" && user.linkedin_url;
        const shouldShowGitHub = user.highest_qualification === "Graduate" &&
          user.trade_stream &&
          (user.trade_stream.toLowerCase().includes('computer') || user.trade_stream.toLowerCase().includes('it')) &&
          user.github_url;

        return (shouldShowLinkedIn || shouldShowGitHub) ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800">Professional Links</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {shouldShowLinkedIn && <LinkItem label="LinkedIn" url={user.linkedin_url} />}
                {shouldShowGitHub && <LinkItem label="GitHub" url={user.github_url} />}
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Resume */}
      {user.resume_path && (() => {
        let resumeUrl = user.resume_path;
        if (!resumeUrl.startsWith('http')) {
          const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
          const serverBase = apiBase.replace('/api', '');
          const resumePath = resumeUrl.startsWith('/') ? resumeUrl : `/${resumeUrl}`;
          resumeUrl = `${serverBase}${resumePath}`;
        }

        return (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <FileText size={18} />
                View Resume
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}

function LinkItem({ label, url }) {
  if (!url) return null;

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-blue-600 hover:text-blue-700 font-medium truncate max-w-xs"
      >
        {url}
      </a>
    </div>
  );
}

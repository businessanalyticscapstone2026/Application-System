(() => {
  "use strict";

  const STORAGE_KEY = "osca-language";
  const DEFAULT_LANGUAGE = "en";

  // English text -> Filipino (Tagalog) text.
  // This dictionary intentionally translates interface wording only.
  const TL = {
    "Home":"Home","About":"Tungkol sa OSCA","Stories":"Mga Kuwento","Contact":"Makipag-ugnayan",
    "Track Status":"Subaybayan ang Aplikasyon","Apply Now":"Mag-apply Ngayon",
    "Mabuhay!":"Mabuhay!","How can we help you today?":"Paano ka namin matutulungan ngayon?",
    "Start an application":"Magsimula ng Aplikasyon","Apply for your OSCA ID":"Mag-apply para sa iyong OSCA ID",
    "Track application status":"Subaybayan ang Aplikasyon","Check where your application is":"Tingnan ang estado ng iyong aplikasyon",
    "NEED HELP?":"KAILANGAN NG TULONG?","Call":"Tumawag","Message":"Magpadala ng Mensahe","Directions":"Mga Direksyon",
    "Care that honors":"Pag-aarugang nagbibigay-galang sa","a lifetime.":"habambuhay na karanasan.",
    "Dedicated to honoring and serving the vibrant senior citizen community of Bauan with dignity, respect, and accessible care.":"Nakatuon sa pagbibigay-galang at paglilingkod sa mga senior citizen ng Bauan sa pamamagitan ng marangal, magalang, at madaling maabot na serbisyo.",
    "A COMMUNITY THAT CARES":"ISANG PAMAYANANG NAGMAMALASAKIT","Good care begins with being seen.":"Nagsisimula ang mabuting pag-aaruga sa pagkilala sa bawat isa.",
    "The Office of Senior Citizens Affairs (OSCA) Bauan is committed to promoting the welfare, rights, and empowerment of senior citizens.":"Naninindigan ang Office of Senior Citizens Affairs (OSCA) Bauan sa pagtataguyod ng kapakanan, karapatan, at kakayahan ng mga senior citizen.",
    "Established under the Expanded Senior Citizens Act, we provide accessible services, social pension distribution, health programs, and community engagement initiatives.":"Alinsunod sa Expanded Senior Citizens Act, nagbibigay kami ng mga serbisyong madaling maabot, pamamahagi ng social pension, mga programang pangkalusugan, at mga gawaing pangkomunidad.",
    "We honor the wisdom and contributions of our elderly population, ensuring they live with dignity, security, and opportunities for active participation.":"Pinahahalagahan namin ang karunungan at ambag ng mga nakatatanda upang mamuhay sila nang may dignidad, seguridad, at pagkakataong aktibong makilahok sa komunidad.",
    "Visit Facebook":"Bisitahin ang Facebook","Dignity, always":"Dignidad sa lahat ng oras","Support within reach":"Serbisyong madaling maabot","Community, together":"Sama-sama sa komunidad",
    "SENIOR CITIZEN SUPPORT":"SUPORTA PARA SA MGA SENIOR CITIZEN","Benefits for Senior Citizens in Bauan, Batangas":"Mga Benepisyo para sa mga Senior Citizen sa Bauan, Batangas",
    "OSCA Bauan supports senior citizens through programs and services aligned with national law and tailored to local needs. These benefits include both cash assistance and community-based support through the municipal senior citizen office.":"Sinusuportahan ng OSCA Bauan ang mga senior citizen sa pamamagitan ng mga programang naaayon sa pambansang batas at pangangailangan ng lokal na komunidad. Kabilang dito ang tulong pinansyal at mga serbisyong pangkomunidad mula sa tanggapan ng senior citizen ng munisipyo.",
    "Social Pension":"Social Pension","Qualified senior citizens receive monthly cash assistance under the Social Pension Program. OSCA Bauan helps local elders claim their stipend and ensures timely disbursement from DSWD.":"Tumatanggap ng buwanang tulong pinansyal ang mga kwalipikadong senior citizen sa ilalim ng Social Pension Program. Tinutulungan ng OSCA Bauan ang mga nakatatanda sa pagkuha ng kanilang ayuda mula sa DSWD.",
    "Health and Welfare Services":"Mga Serbisyong Pangkalusugan at Kapakanan","Seniors in Bauan gain access to medical missions, free checkups, and referral support for hospital care through coordinated barangay and municipal health programs.":"Nakakakuha ang mga senior citizen sa Bauan ng serbisyong medikal, libreng pagsusuri, at tulong sa pagpunta sa ospital sa pamamagitan ng mga programang pangkalusugan ng barangay at munisipyo.",
    "Educational and Livelihood Activities":"Mga Gawaing Pang-edukasyon at Pangkabuhayan","OSCA offers seminars, livelihood workshops, and skills training designed for elderly residents so they can stay active and connected in the community.":"Nagbibigay ang OSCA ng mga seminar, pagsasanay sa kabuhayan, at pagpapaunlad ng kasanayan upang manatiling aktibo at konektado sa komunidad ang mga nakatatanda.",
    "Senior Citizen Discounts":"Mga Diskuwento para sa Senior Citizen","Senior citizens are entitled to local and national discounts on medicine, transportation, and other essential services when they present their valid OSCA ID.":"May karapatan ang mga senior citizen sa mga diskuwento sa gamot, transportasyon, at iba pang pangunahing serbisyo kapag ipinakita ang kanilang balidong OSCA ID.",
    "THE PEOPLE MAKE THE PLACE":"ANG MGA TAO ANG BUMUBUO SA PAMAYANAN","Life is better":"Mas masaya ang buhay","when we belong.":"kapag sama-sama tayo.",
    "Every shared meal, new friendship, and familiar smile is part of a stronger community.":"Bawat salu-salo, bagong pagkakaibigan, at pamilyar na ngiti ay bahagi ng mas matatag na pamayanan.",
    "OSCA Bauan community programs":"Mga programa ng OSCA Bauan para sa komunidad","COMMUNITY CARE":"PANGANGALAGA SA KOMUNIDAD","Care that comes closer":"Serbisyong mas malapit sa inyo",
    "PCSO ASSISTANCE":"TULONG MULA SA PCSO","Support reaching seniors":"Suportang umaabot sa mga nakatatanda","TOGETHER":"SAMA-SAMA","Good days, shared together":"Masayang mga araw na pinagsasaluhan","BAUAN SENIORS":"MGA SENIOR CITIZEN NG BAUAN","Celebrating a lifetime of stories":"Pagdiriwang sa mga kuwento ng buhay",
    "BEFORE YOU BEGIN":"BAGO KA MAGSIMULA","A few useful things to know.":"Ilang mahahalagang bagay na dapat malaman.",
    "Can't find what you're looking for? Our virtual assistant can help you find a starting point.":"Hindi mo makita ang hinahanap mo? Maaaring gabayan ka ng aming virtual assistant.",
    "Ask the OSCA assistant":"Magtanong sa OSCA assistant","Who can apply for a senior citizen ID?":"Sino ang maaaring mag-apply para sa Senior Citizen ID?",
    "The application is for residents who are 60 years old and above. OSCA Bauan can confirm the current requirements and accepted proof of age and residency before you visit.":"Maaaring mag-apply ang mga residenteng edad 60 pataas. Makipag-ugnayan sa OSCA Bauan upang kumpirmahin ang kasalukuyang mga kinakailangan at katibayan ng edad at paninirahan bago bumisita.",
    "What should I bring to the OSCA office?":"Ano ang dapat dalhin sa tanggapan ng OSCA?",
    "Please contact OSCA Bauan before visiting to confirm the current application requirements and supporting documents.":"Makipag-ugnayan muna sa OSCA Bauan bago bumisita upang kumpirmahin ang mga kinakailangan at dokumentong dapat dalhin.",
    "Can someone assist a senior who cannot travel?":"May maaaring tumulong ba sa senior citizen na hindi makabiyahe?",
    "Call the OSCA office to discuss available assistance and the documents a representative may need to bring.":"Tumawag sa tanggapan ng OSCA upang malaman ang maaaring tulong at mga dokumentong kailangang dalhin ng kinatawan.",
    "GET IN TOUCH":"MAKIPAG-UGNAYAN","Come say hello.":"Makipag-ugnayan sa amin.",
    "Tap a card for directions, to call, or to email us. We're here to help.":"Pumili ng card para makita ang direksyon, tumawag, o mag-email sa amin. Narito kami upang tumulong.",
    "VISIT THE OFFICE":"BISITAHIN ANG TANGGAPAN","Ground Floor, Municipal Hall":"Ground Floor, Munisipyo","GET DIRECTIONS":"TINGNAN ANG DIREKSYON",
    "CALL THE OFFICE":"TUMAWAG SA TANGGAPAN","Landline · Call OSCA Bauan":"Landline · Tawagan ang OSCA Bauan","CALL OFFICE":"TUMAWAG SA TANGGAPAN","CALL MOBILE":"TUMAWAG SA MOBILE",
    "Mobile · Call OSCA Bauan":"Mobile · Tawagan ang OSCA Bauan","SEND AN EMAIL":"MAGPADALA NG EMAIL","Contact us with your questions":"Makipag-ugnayan sa amin kung may mga katanungan","EMAIL OSCA":"I-EMAIL ANG OSCA",
    "Planning a visit?":"Nagpaplanong bumisita?","Call ahead to confirm office hours and any documents you may need.":"Tumawag muna upang kumpirmahin ang oras ng opisina at mga dokumentong maaaring kailanganin.",
    "Registration Disclaimer":"Paalala sa Pagpaparehistro","BEFORE YOU PROCEED":"BAGO MAGPATULOY",
    "Please read the notice below and confirm your consent — it’s quick.":"Basahin ang paunawa sa ibaba at kumpirmahin ang iyong pagsang-ayon.",
    "Apply now for your Senior Citizen ID.":"Mag-apply na para sa iyong Senior Citizen ID.",
    "This registration is for senior citizens or authorized representatives submitting accurate information for OSCA Bauan. All details should be true, complete, and supported by valid documents when required.":"Ang pagpaparehistrong ito ay para sa mga senior citizen o kanilang awtorisadong kinatawan na magsusumite ng tamang impormasyon sa OSCA Bauan. Dapat totoo at kumpleto ang lahat ng detalye at may kaukulang balidong dokumento kung kinakailangan.",
    "Please use this system responsibly — don’t submit misleading or unauthorized information.":"Gamitin nang responsable ang sistemang ito. Huwag magsumite ng mapanlinlang o hindi awtorisadong impormasyon.",
    "How to Apply":"Paano Mag-apply","— 6 quick steps":"— 6 na madaling hakbang",
    "Prepare documents":"Ihanda ang mga dokumento","Valid ID (front and back), 1×1 photo, birth certificate or barangay residency proof, and signature photo.":"Balidong ID (harap at likod), 1×1 na larawan, birth certificate o katibayan ng paninirahan mula sa barangay, at larawan ng lagda.",
    "Fill out the form":"Punan ang form","Complete your personal details, family information, and required document uploads.":"Kumpletuhin ang iyong personal na impormasyon, detalye ng pamilya, at pag-upload ng mga kinakailangang dokumento.",
    "Submit and wait":"Isumite at maghintay","Submit your application. OSCA will review your information and documents.":"Isumite ang iyong aplikasyon. Susuriin ng OSCA ang iyong impormasyon at mga dokumento.",
    "Remember your ID":"Tandaan ang iyong ID","Keep the Application ID shown after successful submission for future reference.":"Itago ang Application ID na lalabas pagkatapos ng matagumpay na pagsusumite.",
    "Track status":"Subaybayan ang status","Use Track Status and your Application ID to see your application’s progress.":"Gamitin ang Track Status at ang iyong Application ID upang makita ang progreso ng aplikasyon.",
    "Edit if needed":"Mag-edit kung kinakailangan","You can edit your application through Track Status while its status is Pending.":"Maaari mong i-edit ang iyong aplikasyon sa pamamagitan ng Track Status habang Pending pa ito.",
    "I confirm I’ve read the notice and certify all information I provide is true, complete, and accurate.":"Kinukumpirma kong nabasa ko ang paunawa at pinatutunayan kong totoo, kumpleto, at tama ang lahat ng impormasyong ibibigay ko.",
    "Complete the security check to continue":"Kumpletuhin ang pagsusuring pangseguridad upang magpatuloy","Back to Home":"Bumalik sa Home","Proceed to Application Form":"Magpatuloy sa Application Form",
    "OFFICE OF SENIOR CITIZENS AFFAIRS":"TANGGAPAN NG MGA SENIOR CITIZENS AFFAIRS","MUNICIPALITY OF BAUAN":"BAYAN NG BAUAN",
    "ONLINE SENIOR CITIZEN ID APPLICATION FORM":"ONLINE NA FORM NG APLIKASYON PARA SA SENIOR CITIZEN ID",
    "Personal details":"Personal na impormasyon","Personal":"Personal","details":"na impormasyon","Family":"Pamilya","composition":"komposisyon",
    "Association":"Samahan","membership":"pagiging miyembro","Income":"Kita","& living":"at tirahan","Health":"Kalusugan","& community":"at komunidad","Documents":"Mga Dokumento","& consent":"at pahintulot",
    "Draft saved":"Na-save ang draft","Application sections":"Mga seksyon ng aplikasyon",
    "Your application is sent to OSCA Bauan.":"Naipadala na ang iyong aplikasyon sa OSCA Bauan.",
    "Your information and uploaded documents are reviewed by OSCA. Keep your Application ID and bring original documents when requested.":"Susuriin ng OSCA ang iyong impormasyon at mga na-upload na dokumento. Itago ang iyong Application ID at dalhin ang mga orihinal na dokumento kapag hiniling.",
    "Surname":"Apelyido","Firstname":"Pangalan","Middlename":"Gitnang pangalan","Date of Birth":"Petsa ng kapanganakan","Age":"Edad","Sex":"Kasarian","Select sex":"Pumili ng kasarian",
    "Male":"Lalaki","Female":"Babae","Place of Birth":"Lugar ng kapanganakan","Civil Status":"Katayuang sibil","Select civil status":"Pumili ng katayuang sibil",
    "Single":"Walang asawa","Separated":"Hiwalay","Widower":"Balo","Married":"May asawa","Address":"Tirahan","House No. & Street Name":"Numero ng bahay at pangalan ng kalye",
    "Barangay / District":"Barangay / Distrito","Educational Attainment":"Natapos na pag-aaral","Select educational attainment":"Pumili ng natapos na pag-aaral",
    "Elementary Level":"Elementary level","Elementary Graduate":"Nakatapos ng elementarya","High School Level":"High school level","High School Graduate":"Nakatapos ng high school",
    "Vocational":"Bokasyonal","College Level":"College level","College Graduate":"Nakatapos ng kolehiyo","Post Graduate":"Postgraduate","Not Attended Any School":"Hindi nakapag-aral",
    "Religion":"Relihiyon","Select religion":"Pumili ng relihiyon","Roman Catholic":"Katoliko Romano","Iglesia Ni Cristo":"Iglesia Ni Cristo","Protestant":"Protestante","Others pls. specify":"Iba pa, tukuyin",
    "Occupation":"Trabaho","ID Number":"Numero ng ID","Contact Number":"Numero ng contact","Family Composition":"Komposisyon ng Pamilya",
    "NAME":"PANGALAN","RELATIONSHIP":"KAUGNAYAN","AGE":"EDAD","CIVIL STATUS":"KATAYUANG SIBIL","OCCUPATION":"TRABAHO","INCOME":"KITA","ACTION":"AKSIYON",
    "Select status":"Pumili ng status","Add Next Row":"Magdagdag ng susunod na hanay",
    "Membership to Senior Citizens Association":"Pagiging Miyembro ng Samahan ng mga Senior Citizen","Name of Association":"Pangalan ng Samahan","Address of Association":"Tirahan ng Samahan",
    "Date of Association":"Petsa ng pagsali sa samahan","Position":"Posisyon","Personal Background":"Personal na Kalagayan",
    "Source of Income and Assistance (Check all applicable)":"Pinagmumulan ng Kita at Tulong (Piliin ang lahat ng naaangkop)",
    "Own Earnings, Salaries, /Waves":"Sariling kita, suweldo / sahod","Own Pension":"Sariling pensiyon","Stocks/Dividends":"Stocks / dibidendo",
    "Dependent Of Children/Relatives":"Umaasa sa mga anak / kamag-anak","Spouse's Salary":"Suweldo ng asawa","Insurance":"Seguro",
    "Rentals/Sharecrops":"Paupahan / bahagi sa ani","Savings":"Impok","Livestock/Crop":"Alagang hayop / pananim","Others Specify":"Iba pa, tukuyin",
    "Assets and Properties (Check all applicable)":"Mga Ari-arian at Pag-aari (Piliin ang lahat ng naaangkop)",
    "House":"Bahay","Lot":"Lote","Farmland":"Sakahan","Fishponds/Resorts":"Palaisdaan / resort","Commercial Building":"Gusaling pangnegosyo",
    "Monthly Income (in the Philippine Peso)":"Buwanang Kita (sa piso ng Pilipinas)","Select monthly income":"Pumili ng buwanang kita",
    "10,000 & ABOVE":"₱10,000 pataas","999 AND BELOW":"₱999 pababa",
    "Living / Residing With (Check all applicable)":"Kasama sa Paninirahan (Piliin ang lahat ng naaangkop)",
    "Alone":"Mag-isa","Spouse":"Asawa","Care Institution":"Pasilidad ng pangangalaga","Children":"Mga anak","Friends":"Mga kaibigan",
    "Common Law Spouse":"Kinakasama","Grandchildren":"Mga apo","Households":"Kasambahay","Relatives":"Mga kamag-anak","In Laws":"Pamilya ng asawa",
    "Areas Specialization / Skills (Check all applicable)":"Mga Espesyalisasyon / Kasanayan (Piliin ang lahat ng naaangkop)",
    "Medical":"Medikal","Dental":"Dental","Farming":"Pagsasaka","Arts":"Sining","Teaching":"Pagtuturo","Counseling":"Pagpapayo",
    "Fishing":"Pangingisda","Engineering":"Inhinyeriya","Legal Services":"Serbisyong legal","Evangelization":"Pagpapalaganap ng pananampalataya","Cooking":"Pagluluto",
    "Religious":"Pangrelihiyon","Sportsmanship":"Palakasan","Resource Volunteer":"Boluntaryong tagapagbahagi ng kaalaman","Friendly Visits":"Pakikipagkapwa at pagbisita",
    "Counseling/Referral":"Pagpapayo / referral","Legal Spouse":"Legal na asawa","Community/Organization Leader":"Pinuno ng komunidad / organisasyon",
    "Problems / Needs Commonly Encountered (Check all applicable)":"Mga Karaniwang Suliranin / Pangangailangan (Piliin ang lahat ng naaangkop)",
    "a) Economic":"a) Pangkabuhayan","Lack of Income/Resource":"Kakulangan sa kita / mapagkukunan",
    "Skills/Capability Training (specify)":"Pagsasanay sa kasanayan (tukuyin)","Livelihood Opportunities (specify)":"Pagkakataong pangkabuhayan (tukuyin)",
    "b) Social / Emotional":"b) Panlipunan / Emosyonal","Feeling of Neglect & Rejection":"Pakiramdam ng pagpapabaya at pagtanggi",
    "Feeling of Helplessness & worthlessness":"Pakiramdam ng kawalan ng kakayahan at halaga","Feeling of Loneliness & Isolation":"Pakiramdam ng kalungkutan at pag-iisa",
    "Inadequate Leisure/Recreational Activities":"Kakulangan sa libangan at rekreasyon","Senior Citizens Friendly Environment":"Kapakanang kapaligiran para sa senior citizen",
    "c) Health":"c) Kalusugan","High Cost of Medicines":"Mataas na presyo ng gamot","Lack of Medical Professionals":"Kakulangan ng mga propesyonal sa medisina",
    "Lack/No Access of Sanitation":"Kakulangan sa serbisyong sanitasyon","Lack/No Health Insurance":"Walang segurong pangkalusugan",
    "Lack of Hospitals/Medical Facilities":"Kakulangan ng ospital / pasilidad medikal","Health problems/Ailments Specify":"Problema sa kalusugan / karamdaman, tukuyin",
    "d) Housing":"d) Pabahay","Overcrowding In Family Home":"Siksikan sa tahanan ng pamilya","No Permanent Housing":"Walang permanenteng tirahan",
    "Longing For Independent Living/Quiet Atmosphere":"Nais mamuhay nang mag-isa / sa tahimik na lugar","Lost Privacy":"Kawalan ng pribasiya",
    "Living In Squatter's Area":"Nakatira sa lugar na walang pormal na pabahay","High Cost of Rental":"Mataas na upa",
    "e) Community Service":"e) Serbisyo sa Komunidad","Desire To Participate":"Nais makilahok","Skills/Resource to Share":"Kasanayan / mapagkukunang maibabahagi",
    "f) Identify Other Specific Needs":"f) Tukuyin ang iba pang pangangailangan",
    "Upload Files":"Mag-upload ng mga File","Upload Front of ID":"I-upload ang Harap ng ID","No file selected":"Walang napiling file","Change":"Palitan",
    "Upload Back of ID":"I-upload ang Likod ng ID","Valid Government ID":"Balidong ID ng Pamahalaan",
    "Please upload clear images of both the":"Mag-upload ng malinaw na larawan ng","front":"harap","and":"at","back":"likod",
    "of your valid ID (SSS / PHILHEALTH / GSIS / TIN / NATIONAL ID).":"ng iyong balidong ID (SSS / PHILHEALTH / GSIS / TIN / NATIONAL ID).",
    "Upload Picture":"Mag-upload ng Larawan","Latest/Formal Photo":"Pinakabagong Pormal na Larawan",
    "Upload/Take a formal picture using a camera or your mobile phone.":"Mag-upload o kumuha ng pormal na larawan gamit ang camera o mobile phone.",
    "Birth Certificate":"Sertipiko ng Kapanganakan","Certificate of Barangay Residency":"Sertipiko ng Paninirahan mula sa Barangay",
    "Upload File":"Mag-upload ng File","Please upload your Birth Certificate. If you do not have one, you may select Certificate of Barangay Residency instead.":"I-upload ang iyong Sertipiko ng Kapanganakan. Kung wala nito, maaari mong piliin ang Sertipiko ng Paninirahan mula sa Barangay.",
    "Community Tax Certificate (Cedula)":"Community Tax Certificate (Cedula)","Please take an image or picture of your Community Tax Certificate (Cedula).":"Kumuha ng malinaw na larawan ng iyong Community Tax Certificate (Cedula).",
    "Scan Face":"I-scan ang Mukha","Tap to open camera":"Pindutin upang buksan ang camera","Verification":"Pagpapatunay",
    "Please take a scan of your face for verification.":"Kumuha ng scan ng iyong mukha para sa pagpapatunay.",
    "Face Verification Completed":"Nakumpleto ang Pagpapatunay ng Mukha","Your face was successfully verified against your uploaded ID.":"Matagumpay na naitugma ang iyong mukha sa na-upload mong ID.",
    "Signature":"Lagda","Please take an image or picture of your Signature.":"Kumuha ng larawan ng iyong lagda.",
    "Face Verification":"Pagpapatunay ng Mukha","Position your face clearly inside the camera.":"Iharap nang maayos ang iyong mukha sa camera.","Capture & Verify":"Kunan at Patunayan","Retake":"Kunan Muli",
    "Date of Application":"Petsa ng Aplikasyon","Confirmation to allow the Storage and Use of My Personal Data":"Pahintulot sa Pag-iimbak at Paggamit ng Aking Personal na Datos",
    "Under the Data Privacy Act of 2012 (RA 10173), your personal information is collected and used to process this senior citizen ID application.":"Alinsunod sa Data Privacy Act of 2012 (RA 10173), kinokolekta at ginagamit ang iyong personal na impormasyon upang maproseso ang aplikasyon para sa Senior Citizen ID.",
    "This is to certify that":"Ito ay nagpapatunay na","The information entered above is true and correct.":"Totoo at tama ang impormasyong inilagay sa itaas.",
    "I have the full knowledge in providing the above information.":"Nauunawaan ko ang impormasyong ibinigay ko sa itaas.",
    "I have personally given my consent to allow the use of the information contained in this form.":"Personal kong ipinagkaloob ang aking pahintulot sa paggamit ng impormasyong nakasaad sa form na ito.",
    "I understand that this form contains my personal information to be stored.":"Nauunawaan kong naglalaman ang form na ito ng aking personal na impormasyong itatago.",
    "I confirm and agree to all of the above.":"Kinukumpirma at sinasang-ayunan ko ang lahat ng nabanggit.",
    "Please confirm all required statements before submitting the application.":"Kumpirmahin ang lahat ng kinakailangang pahayag bago isumite ang aplikasyon.",
    "I have certified further that during the filling-out of this form, I was assisted by the person whose name is indicated below and that such person is personally known to me.":"Pinatutunayan ko rin na sa pagsagot sa form na ito ay tinulungan ako ng taong nakapangalan sa ibaba at personal ko siyang kilala.",
    "Assisted by":"Tinulungan ni","Relation to the registrant":"Relasyon sa aplikante",
    "Submit":"Isumite","Cancel":"Kanselahin","Complete the required fields to continue":"Kumpletuhin ang mga kinakailangang patlang upang magpatuloy",
    "Back":"Bumalik","Continue":"Magpatuloy","Family composition":"Komposisyon ng Pamilya","Cancel Application":"Kanselahin ang Aplikasyon",
    "Continue editing":"Ipagpatuloy ang pag-edit","Adjust your image":"Ayusin ang iyong larawan","Drag to reposition and use the handles to crop. Keep all important document details inside the frame.":"I-drag upang ilipat at gamitin ang mga hawakan upang i-crop. Panatilihin sa loob ng frame ang mahahalagang detalye ng dokumento.",
    "Keep Original":"Panatilihin ang Orihinal","Use Cropped Image":"Gamitin ang Na-crop na Larawan","File Preview":"Preview ng File","Download file":"I-download ang file",
    "Submission Successful":"Matagumpay ang Pagsusumite","Your application has been submitted successfully.":"Matagumpay na naisumite ang iyong aplikasyon.",
    "Existing Record Found":"May Nahanap na Umiiral na Rekord","A record with similar information already exists. For your security, choose how you would like to continue.":"May umiiral nang rekord na may katulad na impormasyon. Para sa iyong seguridad, piliin kung paano magpapatuloy.",
    "Your existing Application ID will not be shown until your identity has been verified.":"Hindi ipapakita ang iyong kasalukuyang Application ID hangga't hindi napapatunayan ang iyong pagkakakilanlan.",
    "Update Existing Record":"I-update ang Umiiral na Rekord","Recover Application ID":"I-recover ang Application ID",
    "Enter Application ID":"Ilagay ang Application ID","Enter the unique Application ID provided after your successful submission.":"Ilagay ang natatanging Application ID na ibinigay pagkatapos ng matagumpay na pagsusumite.",
    "Application ID":"Application ID","Check Status":"Tingnan ang Status","Applicant":"Aplikante","IN REVIEW":"SINUSURI",
    "Application progress":"Progreso ng Aplikasyon","Progress":"Progreso","Step 1 of 5":"Hakbang 1 sa 5",
    "Received":"Natanggap","We got your online details":"Natanggap na namin ang iyong impormasyon online","Next step":"Susunod na hakbang","Done":"Tapos na",
    "Under Review":"Sinusuri","Staff checks your documents":"Sinusuri ng kawani ang iyong mga dokumento",
    "In Process":"Pinoproseso","Your ID is being prepared":"Inihahanda na ang iyong ID",
    "Ready for Release":"Handa nang I-release","Ready for pickup at OSCA":"Maaari nang kunin sa OSCA",
    "Completed":"Nakumpleto","Your ID has been released":"Naibigay na ang iyong ID","Current status":"Kasalukuyang status",
    "Rejected":"Hindi Naaprubahan","Please contact OSCA for next steps":"Makipag-ugnayan sa OSCA para sa susunod na hakbang",
    "Edit Application":"I-edit ang Aplikasyon","Request for ID":"Kahilingan para sa ID","Close Tracking Page":"Isara ang Pahina ng Pagsubaybay",
    "Please select the reason for your ID request.":"Piliin ang dahilan ng iyong kahilingan para sa ID.","Reason for Request":"Dahilan ng Kahilingan",
    "Select a reason":"Pumili ng dahilan","Lost":"Nawala","Damage":"Nasira","Change Address":"Pagbabago ng Tirahan",
    "Other":"Iba pa","Please specify":"Pak tukuyin","Submit Request":"Isumite ang Kahilingan","Request Submitted Successfully":"Matagumpay na Naipasa ang Kahilingan",
    "Online":"Naka-online","Hello! I'm the OSCA Virtual Assistant.":"Kumusta! Ako ang OSCA Virtual Assistant.",
    "Hello! I'm the OSCA Virtual Assistant. How can I help you today?":"Kumusta! Ako ang OSCA Virtual Assistant. Paano kita matutulungan ngayon?",
    "Mga maaari mong itanong / You may ask:":"Mga maaari mong itanong:","Walang Birth Certificate":"Walang Birth Certificate",
    "Bayad sa Senior Citizen ID":"Bayad sa Senior Citizen ID","National ID para sa Bedridden":"National ID para sa mga bedridden",
    "Assistant is typing...":"Nagta-type ang assistant...","AI-generated responses may contain errors.":"Maaaring may pagkakamali ang mga sagot na binuo ng AI.",
    "Close":"Isara","Select":"Pumili","Select sex":"Pumili ng kasarian","Select civil status":"Pumili ng katayuang sibil",
    "Select educational attainment":"Pumili ng natapos na pag-aaral","Select religion":"Pumili ng relihiyon","Select monthly income":"Pumili ng buwanang kita",
    "No file selected":"Walang napiling file","Please specify":"Pak tukuyin"
  };

  const ATTRIBUTE_TRANSLATIONS = {
    "Enter the remaining ID":"Ilagay ang natitirang bahagi ng ID",
    "Open navigation menu":"Buksan ang menu ng nabigasyon",
    "Close navigation menu":"Isara ang menu ng nabigasyon",
    "Close menu":"Isara ang menu",
    "Close chatbot":"Isara ang chatbot",
    "Application ID":"Application ID"
  };

  function language() {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE; }
    catch (_) { return DEFAULT_LANGUAGE; }
  }

  function translateTextNode(node, lang) {
    if (!node || !node.nodeValue || !node.nodeValue.trim()) return;
    if (node.parentElement?.closest("script,style,noscript,textarea,input,[contenteditable='true'],#oscaLanguageToggle")) return;

    if (!node.__oscaOriginal) {
      Object.defineProperty(node, "__oscaOriginal", { value: node.nodeValue, writable: true });
    }
    const original = node.__oscaOriginal;
    const trimmed = original.trim();
    const translated = lang === "tl" ? TL[trimmed] : null;
    if (translated) {
      const start = original.match(/^\s*/)?.[0] || "";
      const end = original.match(/\s*$/)?.[0] || "";
      const nextValue = start + translated + end;
      if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    } else {
      if (node.nodeValue !== original) node.nodeValue = original;
    }
  }

  function translateAttributes(root, lang) {
    const elements = root.nodeType === 1 ? [root, ...root.querySelectorAll("*")] : [...document.querySelectorAll("*")];
    for (const el of elements) {
      for (const attr of ["placeholder", "aria-label", "title", "alt", "value"]) {
        if (!el.hasAttribute?.(attr)) continue;
        if (attr === "value" && !(el.tagName === "BUTTON" || (el.tagName === "INPUT" && ["button", "submit", "reset"].includes((el.type || "").toLowerCase())))) continue;
        const key = "__oscaOriginal_" + attr;
        if (!(key in el.dataset)) el.dataset[key] = el.getAttribute(attr) || "";
        const original = el.dataset[key];
        const translated = lang === "tl" ? (ATTRIBUTE_TRANSLATIONS[original] || TL[original]) : null;
        if (translated) el.setAttribute(attr, translated);
        else if (lang === "en") el.setAttribute(attr, original);
      }
    }
  }

  function translate(root = document) {
    const lang = language();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => translateTextNode(node, lang));
    translateAttributes(root, lang);
    document.documentElement.lang = lang === "tl" ? "fil" : "en";
    const button = document.getElementById("oscaLanguageToggle");
    if (button) {
      button.textContent = lang === "tl" ? "English" : "Tagalog";
      button.setAttribute("aria-label", lang === "tl" ? "Switch to English" : "Lumipat sa Tagalog");
    }
  }

  function addSwitcher() {
    if (document.getElementById("oscaLanguageToggle")) return;
    const button = document.createElement("button");
    button.id = "oscaLanguageToggle";
    button.type = "button";
    button.className = "osca-language-toggle";
    button.textContent = language() === "tl" ? "English" : "Tagalog";
    button.setAttribute("aria-label", "Lumipat sa Tagalog");
    button.addEventListener("click", () => {
      const next = language() === "en" ? "tl" : "en";
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
      translate(document);
    });
    document.body.appendChild(button);
  }

  function start() {
    addSwitcher();
    translate(document);
    // Translate text added later by menus, modals, validation messages, and other UI.
    const observer = new MutationObserver(records => {
      if (window.__oscaTranslationBusy) return;
      window.__oscaTranslationBusy = true;
      for (const record of records) {
        if (record.type === "childList") {
          record.addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, language());
            else if (node.nodeType === Node.ELEMENT_NODE) translate(node);
          });
        } else if (record.type === "characterData") {
          translateTextNode(record.target, language());
        }
      }
      window.__oscaTranslationBusy = false;
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  window.oscaSetLanguage = function (lang) {
    if (lang !== "en" && lang !== "tl") return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    translate(document);
  };
})();

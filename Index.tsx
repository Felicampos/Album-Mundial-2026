import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// DATA: Complete 2026 FIFA World Cup Panini sticker checklist
// ============================================================

const GROUPS = {
  A: { teams: ["MEX", "RSA", "KOR", "CZE"], name: "Grupo A" },
  B: { teams: ["CAN", "BIH", "QAT", "SUI"], name: "Grupo B" },
  C: { teams: ["BRA", "MAR", "SCO", "HAI"], name: "Grupo C" },
  D: { teams: ["USA", "PAR", "AUS", "TUR"], name: "Grupo D" },
  E: { teams: ["GER", "ECU", "CIV", "CUW"], name: "Grupo E" },
  F: { teams: ["NED", "JPN", "TUN", "SWE"], name: "Grupo F" },
  G: { teams: ["BEL", "IRN", "EGY", "NZL"], name: "Grupo G" },
  H: { teams: ["ESP", "URU", "KSA", "CPV"], name: "Grupo H" },
  I: { teams: ["FRA", "SEN", "NOR", "ALG"], name: "Grupo I" },
  J: { teams: ["ARG", "AUT", "JOR", "COD"], name: "Grupo J" },
  K: { teams: ["POR", "COL", "GHA", "PAN"], name: "Grupo K" },
  L: { teams: ["ENG", "CRO", "IRQ", "UZB"], name: "Grupo L" },
};

const TEAM_NAMES = {
  MEX: "México", RSA: "Sudáfrica", KOR: "Corea del Sur", CZE: "Chequia",
  CAN: "Canadá", BIH: "Bosnia-Herzegovina", QAT: "Qatar", SUI: "Suiza",
  BRA: "Brasil", MAR: "Marruecos", SCO: "Escocia", HAI: "Haití",
  USA: "Estados Unidos", PAR: "Paraguay", AUS: "Australia", TUR: "Türkiye",
  GER: "Alemania", ECU: "Ecuador", CIV: "Costa de Marfil", CUW: "Curazao",
  NED: "Países Bajos", JPN: "Japón", TUN: "Túnez", SWE: "Suecia",
  BEL: "Bélgica", IRN: "Irán", EGY: "Egipto", NZL: "Nueva Zelanda",
  ESP: "España", URU: "Uruguay", KSA: "Arabia Saudita", CPV: "Cabo Verde",
  FRA: "Francia", SEN: "Senegal", NOR: "Noruega", ALG: "Argelia",
  ARG: "Argentina", AUT: "Austria", JOR: "Jordania", COD: "RD Congo",
  POR: "Portugal", COL: "Colombia", GHA: "Ghana", PAN: "Panamá",
  ENG: "Inglaterra", CRO: "Croacia", IRQ: "Irak", UZB: "Uzbekistán",
};

const FLAGS = {
  MEX:"🇲🇽", RSA:"🇿🇦", KOR:"🇰🇷", CZE:"🇨🇿", CAN:"🇨🇦", BIH:"🇧🇦", QAT:"🇶🇦", SUI:"🇨🇭",
  BRA:"🇧🇷", MAR:"🇲🇦", SCO:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", HAI:"🇭🇹", USA:"🇺🇸", PAR:"🇵🇾", AUS:"🇦🇺", TUR:"🇹🇷",
  GER:"🇩🇪", ECU:"🇪🇨", CIV:"🇨🇮", CUW:"🇨🇼", NED:"🇳🇱", JPN:"🇯🇵", TUN:"🇹🇳", SWE:"🇸🇪",
  BEL:"🇧🇪", IRN:"🇮🇷", EGY:"🇪🇬", NZL:"🇳🇿", ESP:"🇪🇸", URU:"🇺🇾", KSA:"🇸🇦", CPV:"🇨🇻",
  FRA:"🇫🇷", SEN:"🇸🇳", NOR:"🇳🇴", ALG:"🇩🇿", ARG:"🇦🇷", AUT:"🇦🇹", JOR:"🇯🇴", COD:"🇨🇩",
  POR:"🇵🇹", COL:"🇨🇴", GHA:"🇬🇭", PAN:"🇵🇦", ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO:"🇭🇷", IRQ:"🇮🇶", UZB:"🇺🇿",
};

// Each team has 20 stickers: 1=Logo(FOIL), 2-12=players, 13=TeamPhoto, 14-20=players
const TEAM_PLAYERS = {
  MEX: ["Luis Malagón","Johan Vasquez","Jorge Sánchez","Cesar Montes","Jesus Gallardo","Israel Reyes","Diego Lainez","Carlos Rodriguez","Edson Alvarez","Orbelin Pineda","Marcel Ruiz","Érick Sánchez","Hirving Lozano","Santiago Giménez","Raúl Jiménez","Alexis Vega","Roberto Alvarado","Cesar Huerta"],
  RSA: ["Ronwen Williams","Sipho Chaine","Aubrey Modiba","Samukele Kabini","Mbekezeli Mbokazi","Khulumani Ndamane","Siyabonga Ngezana","Khuliso Mudau","Nkosinathi Sibisi","Teboho Mokoena","Thalente Mbatha","Bathasi Aubaas","Yaya Sithole","Sipho Mbule","Lyle Foster","Iqraam Rayners","Mohau Nkota","Oswin Appollis"],
  KOR: ["Hyeon-woo Jo","Seung-Gyu Kim","Min-jae Kim","Yu-min Cho","Young-woo Seol","Han-beom Lee","Tae-seok Lee","Myung-jae Lee","Jae-sung Lee","In-beom Hwang","Kang-in Lee","Seung-ho Paik","Jens Castrop","Dongyeong Lee","Gue-sung Cho","Heung-min Son","Hee-chan Hwang","Hyeon-Gyu Oh"],
  CZE: ["Matej Kovar","Jindrich Stanek","Ladislav Krejci","Vladimir Coufal","Jaroslav Zeleny","Tomas Holes","David Zima","Michal Sadilek","Lukas Provod","Lukas Cerv","Tomas Soucek","Pavel Sulc","Matej Vydra","Vasil Kusej","Tomas Chory","Vaclav Cerny","Adam Hlozek","Patrik Schick"],
  CAN: ["Dayne St.Clair","Alphonso Davies","Alistair Johnston","Samuel Adekugbe","Riche Larvea","Derek Cornelius","Moïse Bombito","Kamal Miller","Stephen Eustáquio","Ismaël Koné","Jonathan Osorio","Jacob Shaffelburg","Mathieu Choinière","Niko Sigur","Tajon Buchanan","Liam Millar","Cyle Larin","Jonathan David"],
  BIH: ["Nikola Vasilj","Amer Dedic","Sead Kolasinac","Tarik Muharemovic","Nihad Mujakic","Nikola Katic","Amir Hadziahmetovic","Benjamin Tahirovic","Armin Gigovic","Ivan Sunjic","Ivan Basic","Dzenis Burnic","Esmir Bajraktarevic","Amar Memic","Ermedin Demirovic","Edin Dzeko","Samed Bazdar","Haris Tabakovic"],
  QAT: ["Meshaal Barsham","Sultan Albrake","Lucas Mendes","Homam Ahmed","Boualem Khoukhi","Pedro Miguel","Tarek Salman","Mohamed Al-Mannai","Karim Boudiaf","Assim Madibo","Ahmed Fatehi","Mohammed Waad","Abdulaziz Hatem","Hassan Al-Haydos","Edmilson Junior","Akram Hassan Afif","Ahmed Al Ganehi","Almoez Ali"],
  SUI: ["Gregor Kobel","Yvon Mvogo","Manuel Akanji","Ricardo Rodriguez","Nico Elvedi","Aurèle Amenda","Silvan Widmer","Granit Xhaka","Denis Zakaria","Remo Freuler","Fabian Rieder","Ardon Jashari","Johan Manzambi","Michel Aebischer","Breel Embolo","Ruben Vargas","Dan Ndoye","Zeki Amdouni"],
  BRA: ["Alisson","Bento","Marquinhos","Éder Militão","Gabriel Magalhães","Danilo","Wesley","Lucas Paquetá","Casemiro","Bruno Guimarães","Luiz Henrique","Vinicius Júnior","Rodrygo","João Pedro","Matheus Cunha","Gabriel Martinelli","Raphinha","Estévão"],
  MAR: ["Yassine Bounou","Munir El Kajoui","Achraf Hakimi","Noussair Mazraoui","Nayef Aguerd","Roman Saiss","Jawad El Yamiq","Adam Masina","Sofyan Amrabat","Azzedine Ounahi","Eliesse Ben Seghir","Bilal El Khannouss","Ismael Saibari","Youssef En-Nesyri","Abde Ezzalzouli","Soufiane Rahimi","Brahim Diaz","Ayoub El Kaabi"],
  SCO: ["Angus Gunn","Jack Hendry","Kieran Tierney","Aaron Hickey","Andrew Robertson","Scott McKenna","John Souttar","Anthony Ralston","Grant Hanley","Scott McTominay","Billy Gilmour","Lewis Ferguson","Ryan Christie","Kenny McLean","John McGinn","Lyndon Dykes","Che Adams","Ben Doak"],
  HAI: ["Johny Placide","Carlens Arcus","Martin Expérience","Jean-Kevin Duverne","Ricardo Adé","Duke Lacroix","Garven Metusala","Hannes Delcroix","Leverton Pierre","Danley Jean Jacques","Jean-Ricner Bellegarde","Christopher Attys","Derrick Etienne Jr","Josue Casimir","Ruben Providence","Duckens Nazon","Louicius Deedson","Frantzdy Pierrot"],
  USA: ["Matt Freese","Chris Richards","Tim Ream","Mark McKenzie","Alex Freeman","Antonee Robinson","Tyler Adams","Tanner Tessmann","Weston McKennie","Christian Roldan","Timothy Weah","Diego Luna","Malik Tillman","Christian Pulisic","Brenden Aaronson","Ricardo Pepi","Haji Wright","Folarin Balogun"],
  PAR: ["Roberto Fernandez","Orlando Gill","Gustavo Gomez","Fabián Balbuena","Juan José Cáceres","Omar Alderete","Junior Alonso","Mathías Villasanti","Diego Gomez","Damián Bobadilla","Andres Cubas","Matias Galarza Fonda","Julio Enciso","Alejandro Romero Gamarra","Miguel Almirón","Ramon Sosa","Angel Romero","Antonio Sanabria"],
  AUS: ["Mathew Ryan","Joe Gauci","Harry Souttar","Alessandro Circati","Jordan Bos","Aziz Behich","Cameron Burgess","Lewis Miller","Milos Degenek","Jackson Irvine","Riley McGree","Aiden O'Neill","Connor Metcalfe","Patrick Yazbek","Craig Goodwin","Kusini Yengi","Nestory Irankunda","Mohamed Touré"],
  TUR: ["Uğurcan Çakır","Mert Müldür","Zeki Çelik","Samet Akaydın","Ferdi Kadıoğlu","Abdülkerim Bardakcı","Orkun Kökçü","Salih Özcan","Kaan Ayhan","Hakan Çalhanoğlu","Yunus Akgün","Arda Güler","Kerem Aktürkoğlu","Yusuf Sarı","Burak Yılmaz","Cenk Tosun","Serdar Dursun","Baris Alper Yilmaz"],
  GER: ["Manuel Neuer","Marc-André ter Stegen","Antonio Rüdiger","Jonathan Tah","David Raum","Benjamin Henrichs","Toni Kroos","Ilkay Gündoğan","Joshua Kimmich","Leon Goretzka","Leroy Sané","Thomas Müller","Florian Wirtz","Kai Havertz","Jamal Musiala","Serge Gnabry","Niclas Füllkrug","Deniz Undav"],
  ECU: ["Hernán Galíndez","Alexander Domínguez","Piero Hincapié","Felix Torres","William Pacho","Byron Castillo","Ángelo Preciado","Moisés Caicedo","Romario Ibarra","Jhegson Méndez","Jeremy Sarmiento","Pervis Estupiñán","Alan Minda","Kendry Páez","Michael Estrada","Enner Valencia","Kevin Rodríguez","Gonzalo Plata"],
  CIV: ["Yahia Fofana","Badra Ali Sangaré","Simon Deli","Willy Boly","Ghislain Konan","Eric Bailly","Jean-Philippe Gbamin","Seko Fofana","Franck Kessié","Ibrahim Sangaré","Serge Aurier","Maxwel Cornet","Nicolas Pépé","Wilfried Zaha","Jonathan Kodjia","Sébastien Haller","Christian Kouamé","Wilfried Gnonto"],
  CUW: ["Eloy Room","Tyronne Ebuehi","Juriën Timber","Cuco Martina","Ethan Surinach","Leandro Bacuna","Giliano Wijnaldum","Jephté Bil","Sergino Dest","Quentin Abrahamson","Denzell Dumfries","Myron Boadu","Cody Gakpo","Ryan Babel","Jordy Clasie","Riechedly Bazoer","Nigel Bertrams","Rangelo Janga"],
  NED: ["Bart Verbruggen","Mark Flekken","Virgil van Dijk","Matthijs de Ligt","Nathan Aké","Denzel Dumfries","Daley Blind","Frenkie de Jong","Tijjani Reijnders","Joey Veerman","Xavi Simons","Steven Bergwijn","Donyell Malen","Memphis Depay","Wout Weghorst","Brian Brobbey","Cody Gakpo","Arnaut Danjuma"],
  JPN: ["Shuichi Gonda","Zion Suzuki","Maya Yoshida","Ko Itakura","Takehiro Tomiyasu","Miki Yamane","Yuto Nagatomo","Wataru Endo","Hidemasa Morita","Ritsu Doan","Junya Ito","Daichi Kamada","Takumi Minamino","Sho Ito","Ayase Ueda","Kaoru Mitoma","Yukinari Sugawara","Keito Nakamura"],
  TUN: ["Aymen Dahmen","Mouez Hassen","Montassar Talbi","Dylan Bronn","Wajdi Kechrida","Mohamed Drager","Ellyes Skhiri","Hannibal Mejbri","Mohamed Ali Ben Romdhane","Wahbi Khazri","Naim Sliti","Hamza Rafia","Khazri Wahbi","Saif-Eddine Khaoui","Issam Jebali","Seifeddine Jaziri","Youssef Msakni","Anis Ben Slimane"],
  SWE: ["Robin Olsen","Karl-Johan Johnsson","Victor Nilsson Lindelöf","Isak Hien","Emil Krafth","Ludwig Augustinsson","Alexander Isak","Dejan Kulusevski","Viktor Claesson","Albin Ekdal","Emil Forsberg","Pontus Jansson","Marcus Danielson","Mattias Svanberg","Anthony Elanga","Robin Quaison","Jordan Larsson","Benjamin Nygren"],
  BEL: ["Thibaut Courtois","Senne Lammens","Timothy Castagne","Zeno Debast","Maxim De Cuyper","Brandon Mechele","Thomas Meunier","Kevin De Bruyne","Amadou Onana","Youri Tielemans","Hans Vanaken","Charles De Ketelaere","Jeremy Doku","Romelu Lukaku","Dodi Lukebakio","Leandro Trossard","Axel Witsel","Nicolas Raskin"],
  IRN: ["Alireza Beiranvand","Hossein Hosseini","Ehsan Hajsafi","Milad Mohammadi","Shoja Khalilzadeh","Ramin Rezaeian","Majid Hosseini","Sadegh Moharrami","Morteza Pouraliganji","Ali Gholizadeh","Sardar Azmoun","Mehdi Taremi","Allahyar Sayyadmanesh","Saman Ghoddos","Ali Karimi","Ahmad Noorollahi","Karim Ansarifard","Vahid Amiri"],
  EGY: ["Mohamed El-Shenawy","Ahmed El-Shenawy","Ahmed Hegazi","Omar Kamal","Mohamed Abdel-Moneim","Ahmed Fatouh","Mahmoud Alaa","Amr El-Sulaya","Tarek Hamed","Mohamed Elneny","Ahmed Sayed Zizo","Omar Marmoush","Mostafa Mohamed","Trezeguet","Mohamed Salah","Ramadan Sobhi","Marwan Attia","Hamdi Fathi"],
  NZL: ["Stefan Marinovic","Max Crocombe","Winston Reid","Michael Boxall","Liberato Cacace","Nando Pijnaker","Tim Payne","Bill Tuiloma","Joe Bell","Clayton Lewis","Moses Dyer","Chris Wood","Elijah Just","Gianni Stensness","Ryan Thomas","Matthew Garbett","Callum McCowatt","Marco Rojas"],
  ESP: ["Unai Simón","David Raya","Dani Carvajal","Alejandro Grimaldo","Pau Cubarsí","Robin Le Normand","Aymeric Laporte","Rodri","Pedri","Gavi","Fabián Ruiz","Dani Olmo","Ferran Torres","Nico Williams","Lamine Yamal","Alvaro Morata","Mikel Oyarzabal","Joselu"],
  URU: ["Sergio Rochet","Fernando Muslera","José María Giménez","Diego Godín","Martín Cáceres","Mathías Olivera","Nahitan Nández","Lucas Torreira","Federico Valverde","Rodrigo Bentancur","Facundo Pellistri","Nicolás de la Cruz","Matías Vecino","Darwin Núñez","Edinson Cavani","Luis Suárez","Maximiliano Araújo","Facundo Torres"],
  KSA: ["Mohammed Al-Owais","Nawaf Al-Aqidi","Ali Al-Bulaihi","Saud Abdulhamid","Mohammed Al-Burayk","Hassan Tambakti","Abdulelah Al-Malki","Abdulrahman Al-Aboud","Salman Al-Faraj","Mohamed Kanno","Firas Al-Buraikan","Salem Al-Dawsari","Sami Al-Najei","Abdulrahman Ghareeb","Riyadh Sharahili","Abdullah Al-Hamdan","Ali Al-Hassan","Nasser Al-Dawsari"],
  CPV: ["Josiel Correia","Vaná","Fortes","Stopira","Jamiro Monteiro","Kenny Rocha","Ryan Mendes","Steven Fortes","Garry Rodrigues","Carlos Ponck","Gilson Benchimol","Lisandro Semedo","Dyego Sousa","Deroy Duarte","Júnior Alves","Dany Fonseca","Jovane Cabral","Steven Ricard"],
  FRA: ["Mike Maignan","Alphonse Areola","Benjamin Pavard","William Saliba","Raphaël Varane","Theo Hernandez","Lucas Hernandez","Aurélien Tchouaméni","Eduardo Camavinga","Antoine Griezmann","Adrien Rabiot","Marcus Thuram","Randal Kolo Muani","Ousmane Dembélé","Kylian Mbappé","Kingsley Coman","Olivier Giroud","Ibrahima Konaté"],
  SEN: ["Edouard Mendy","Seny Dieng","Youssouf Sabaly","Abdou Diallo","Kalidou Koulibaly","Ibrahima Mbaye","Pape Abou Cissé","Nampalys Mendy","Idrissa Gueye","Cheikhou Kouyaté","Sadio Mané","Ismaïla Sarr","Boulaye Dia","Habib Diallo","Famara Diédhiou","Nicolas Jackson","Pape Matar Sarr","Lamine Camara"],
  NOR: ["Ørjan Nyland","Rune Almenning Jarstein","Leo Skiri Østigård","Andreas Hanche-Olsen","Fredrik Aursnes","Birger Meling","Martin Ødegaard","Sander Berge","Morten Thorsby","Mohamed Elyounoussi","Alexander Sørloth","Erling Haaland","Veton Berisha","Patrick Berg","Mathias Normann","Kristian Thorstvedt","Ole Selnæs","Jørgen Strand Larsen"],
  ALG: ["Rais M'Bolhi","Alexandre Oukidja","Ramy Bensebaini","Youcef Atal","Rayan Aït-Nouri","Mohamed Amine Tougai","Aïssa Mandi","Sofiane Feghouli","Adlène Guedioura","Saphir Taïder","Said Benrahma","Yacine Brahimi","Haris Belkebla","Nabil Bentaleb","Islam Slimani","Baghdad Bounedjah","Andy Delort","Riyad Mahrez"],
  ARG: ["Emiliano Martínez","Geronimo Rulli","Nahuel Molina","Gonzalo Montiel","Cristian Romero","Lisandro Martínez","Nicolás Otamendi","Marcos Acuña","Nicolás Tagliafico","Rodrigo De Paul","Guido Rodríguez","Leandro Paredes","Enzo Fernández","Alexis Mac Allister","Angel Di María","Paulo Dybala","Lautaro Martínez","Lionel Messi"],
  AUT: ["Patrick Pentz","Daniel Bachmann","Philipp Lienhart","Stefan Posch","Aleksandar Dragovic","David Alaba","Andreas Ulmer","Florian Grillitsch","Julian Baumgartlinger","Konrad Laimer","Marcel Sabitzer","Xaver Schlager","Nicolas Seiwald","Michael Gregoritsch","Christoph Baumgartner","Marko Arnautovic","Patrick Wimmer","Romano Schmid"],
  JOR: ["Yazeed Abo Laila","Abdallah Nasib","Baha' Abdelrahman","Rushan Awad","Ahmad Ibrahim","Ehab Aloussi","Yazan Naimat","Oday Dabbagh","Musa Al-Tamari","Hmoud Al-Marzouq","Ahmad Alali","Yasser Moh'd Attia","Al-Haza'a Malik","Ali Olwan","Baha Faisal","Nour Al-Rawabdeh","Mohammad Mansarah","Mohammad Abu Zema"],
  COD: ["Joël Kiassumbua","Parfait Mandanda","Arthur Masuaku","Chancel Mbemba","Marcel Tisserand","Yoane Wissa","Edo Kayembe","Paul-José M'Poku","Cédric Bakambu","Yannick Bolasie","Silas Wissa","Scholary Limbombe","Amissi Mujangi-Bia","Dieumerci Ndongala","Thethe Tresor","Hérita Ilunga","Firmin Mubele","Jordan Ikoko"],
  POR: ["Rui Patrício","José Sá","Diogo Dalot","Rúben Dias","Pepe","Nuno Mendes","João Cancelo","Rúben Neves","Vitinha","Bernardo Silva","João Félix","Bruno Fernandes","Diogo Jota","Rafael Leão","Gonçalo Ramos","Pedro Neto","Otávio","Cristiano Ronaldo"],
  COL: ["David Ospina","Camilo Vargas","Dávinson Sánchez","Yerry Mina","Stefan Medina","William Tesillo","Johan Mojica","Jefferson Lerma","Mateus Uribe","Wilmar Barrios","James Rodríguez","Cuadrado","Duván Zapata","Falcao","Luis Muriel","Miguel Borja","Rafael Santos Borré","Jhon Arias"],
  GHA: ["Lawrence Ati-Zigi","Richard Ofori","Daniel Amartey","Alexander Djiku","Gideon Mensah","Baba Rahman","Abdul-Rahman Baba","Thomas Partey","Iddrisu Baba","Mubarak Wakaso","Daniel-Kofi Kyereh","Jordan Ayew","André Ayew","Inaki Williams","Osman Bukari","Kamaldeen Sulemana","Mohammed Kudus","Callum Hudson-Odoi"],
  PAN: ["Orlando Mosquera","Luis Mejía","Harold Cummings","Michael Murillo","Fidel Escobar","Adalberto Carrasquilla","Rolando Blackburn","Anibal Godoy","Abdiel Ayarza","Álex Rodríguez","Cecilio Waterman","José Fajardo","Ismael Díaz","Édgar Barcenas","Alfredo Stephens","Rolando Escobar","Aníbal Godoy","Freddy Góndola"],
  ENG: ["Jordan Pickford","Nick Pope","Reece James","Kieran Trippier","John Stones","Harry Maguire","Luke Shaw","Declan Rice","Jude Bellingham","Phil Foden","Bukayo Saka","Marcus Rashford","Harry Kane","Jack Grealish","Raheem Sterling","Mason Mount","Trent Alexander-Arnold","Ollie Watkins"],
  CRO: ["Dominik Livaković","Ivo Grbić","Josip Šutalo","Joško Gvardiol","Dejan Lovren","Domagoj Vida","Josip Juranović","Mateo Kovačić","Luka Modrić","Marcelo Brozović","Ivan Perišić","Ante Rebić","Ivan Rakitić","Nikola Vlašić","Bruno Petković","Andrej Kramarić","Mario Pašalić","Marko Livaja"],
  IRQ: ["Jalal Hassan","Fahad Talib","Ali Adnan","Bashar Resan","Alaa Abdul Zahra","Amjad Attwan","Safaa Hadi","Osama Rashid","Aimen Hussein","Ahmed Ibrahim","Ayman Hussein","Mouhannad Abdul Raheem","Mohanad Ali","Aymen Hossam","Aziz Khawwan","Ahmed Yasin","Hammadi Ahmed","Alaa Mhawi"],
  UZB: ["Ignatiy Nesterov","Jasur Yakhshiboev","Eldor Shomurodov","Otabek Shukurov","Jamshid Iskanderov","Dostonbek Khamdamov","Abbosbek Fayzullaev","Azizbek Turgunboev","Jaloliddin Masharipov","Bobur Abdikholiqov","Shamsiddin Karimov","Khojiakbar Alijonov","Mukhammad Tursunov","Timur Juraev","Khamza Kamolov","Nasimjon Muydinov","Khurshed Bekchanov","Dilshod Vatanshoev"],
};

// World Cup History + FWC section (19 stickers: FWC1-FWC19)
const FWC_STICKERS = [
  { id: "00", name: "Logo Panini", foil: true },
  { id: "FWC1", name: "Emblema Oficial", foil: true },
  { id: "FWC2", name: "Emblema Oficial 2", foil: true },
  { id: "FWC3", name: "Mascotas Oficiales", foil: true },
  { id: "FWC4", name: "Eslogan Oficial", foil: true },
  { id: "FWC5", name: "Balón Oficial", foil: true },
  { id: "FWC6", name: "Canadá - Países y Ciudades Sede", foil: true },
  { id: "FWC7", name: "México - Países y Ciudades Sede", foil: true },
  { id: "FWC8", name: "USA - Países y Ciudades Sede", foil: true },
  { id: "FWC9", name: "Italia 1934 - Historia del Mundial", foil: true },
  { id: "FWC10", name: "Uruguay 1950 - Historia del Mundial", foil: true },
  { id: "FWC11", name: "Alemania Occ. 1954 - Historia", foil: true },
  { id: "FWC12", name: "Brasil 1962 - Historia del Mundial", foil: true },
  { id: "FWC13", name: "Alemania Occ. 1974 - Historia", foil: true },
  { id: "FWC14", name: "Argentina 1986 - Historia del Mundial", foil: true },
  { id: "FWC15", name: "Brasil 1994 - Historia del Mundial", foil: true },
  { id: "FWC16", name: "Brasil 2002 - Historia del Mundial", foil: true },
  { id: "FWC17", name: "Italia 2006 - Historia del Mundial", foil: true },
  { id: "FWC18", name: "Alemania 2014 - Historia del Mundial", foil: true },
  { id: "FWC19", name: "Argentina 2022 - Historia del Mundial", foil: true },
];

// Stadiums (16 venues)
const STADIUMS = [
  { id: "EST1", name: "Estadio Azteca - Ciudad de México", country: "México" },
  { id: "EST2", name: "Estadio BBVA - Monterrey", country: "México" },
  { id: "EST3", name: "Estadio Akron - Guadalajara", country: "México" },
  { id: "EST4", name: "AT&T Stadium - Arlington, TX", country: "USA" },
  { id: "EST5", name: "SoFi Stadium - Los Ángeles", country: "USA" },
  { id: "EST6", name: "MetLife Stadium - Nueva York/NJ", country: "USA" },
  { id: "EST7", name: "Levi's Stadium - Santa Clara", country: "USA" },
  { id: "EST8", name: "Arrowhead Stadium - Kansas City", country: "USA" },
  { id: "EST9", name: "Hard Rock Stadium - Miami", country: "USA" },
  { id: "EST10", name: "Gillette Stadium - Boston", country: "USA" },
  { id: "EST11", name: "Lincoln Financial Field - Filadelfia", country: "USA" },
  { id: "EST12", name: "Lumen Field - Seattle", country: "USA" },
  { id: "EST13", name: "NRG Stadium - Houston", country: "USA" },
  { id: "EST14", name: "BC Place - Vancouver", country: "Canadá" },
  { id: "EST15", name: "BMO Field - Toronto", country: "Canadá" },
  { id: "EST16", name: "Stade de Montréal - Montreal", country: "Canadá" },
];

// Coca-Cola stickers (12 special stickers)
const COCA_COLA_STICKERS = [
  { id: "CC1", name: "Lamine Yamal (España)" },
  { id: "CC2", name: "Lautaro Martínez (Argentina)" },
  { id: "CC3", name: "Harry Kane (Inglaterra)" },
  { id: "CC4", name: "Joshua Kimmich (Alemania)" },
  { id: "CC5", name: "Vinicius Jr. (Brasil)" },
  { id: "CC6", name: "Kylian Mbappé (Francia)" },
  { id: "CC7", name: "Erling Haaland (Noruega)" },
  { id: "CC8", name: "Lionel Messi (Argentina)" },
  { id: "CC9", name: "Cristiano Ronaldo (Portugal)" },
  { id: "CC10", name: "Jude Bellingham (Inglaterra)" },
  { id: "CC11", name: "Pedri (España)" },
  { id: "CC12", name: "Rodri (España)" },
];

// Build all team sticker IDs
function getTeamStickers(code) {
  const stickers = [];
  stickers.push({ id: `${code}1`, name: `Logo ${TEAM_NAMES[code]}`, foil: true, pos: 1 });
  const players = TEAM_PLAYERS[code] || [];
  for (let i = 0; i < 18; i++) {
    const num = i < 11 ? i + 2 : i + 3;
    stickers.push({ id: `${code}${num}`, name: players[i] || `Jugador ${num}`, foil: false, pos: num });
  }
  stickers.push({ id: `${code}13`, name: `Foto Equipo ${TEAM_NAMES[code]}`, foil: false, pos: 13 });
  return stickers.sort((a, b) => a.pos - b.pos);
}

// Build complete checklist
function buildFullChecklist() {
  const all = {};
  // FWC section
  FWC_STICKERS.forEach(s => { all[s.id] = s; });
  // Teams
  Object.keys(TEAM_NAMES).forEach(code => {
    const stickers = getTeamStickers(code);
    stickers.forEach(s => { all[s.id] = { ...s, team: code }; });
  });
  // Stadiums
  STADIUMS.forEach(s => { all[s.id] = s; });
  // Coca-Cola
  COCA_COLA_STICKERS.forEach(s => { all[s.id] = s; });
  return all;
}

const FULL_CHECKLIST = buildFullChecklist();
const TOTAL_STICKERS = Object.keys(FULL_CHECKLIST).length;

// Fixture data
const FIXTURES = [
  // Group A
  { date: "Jun 11", team1: "MEX", team2: "RSA", venue: "Estadio Azteca", group: "A" },
  { date: "Jun 15", team1: "KOR", team2: "CZE", venue: "Estadio Akron", group: "A" },
  { date: "Jun 19", team1: "MEX", team2: "KOR", venue: "Estadio Azteca", group: "A" },
  { date: "Jun 19", team1: "RSA", team2: "CZE", venue: "Estadio BBVA", group: "A" },
  { date: "Jun 24", team1: "CZE", team2: "MEX", venue: "Estadio Azteca", group: "A" },
  { date: "Jun 24", team1: "RSA", team2: "KOR", venue: "Estadio Akron", group: "A" },
  // Group B
  { date: "Jun 12", team1: "CAN", team2: "BIH", venue: "BMO Field", group: "B" },
  { date: "Jun 12", team1: "QAT", team2: "SUI", venue: "BC Place", group: "B" },
  { date: "Jun 18", team1: "CAN", team2: "QAT", venue: "BMO Field", group: "B" },
  { date: "Jun 18", team1: "SUI", team2: "BIH", venue: "Lumen Field", group: "B" },
  { date: "Jun 24", team1: "SUI", team2: "CAN", venue: "BC Place", group: "B" },
  { date: "Jun 24", team1: "BIH", team2: "QAT", venue: "Lumen Field", group: "B" },
  // Group C
  { date: "Jun 13", team1: "BRA", team2: "MAR", venue: "Hard Rock Stadium", group: "C" },
  { date: "Jun 13", team1: "SCO", team2: "HAI", venue: "Stade de Montréal", group: "C" },
  { date: "Jun 20", team1: "BRA", team2: "SCO", venue: "Hard Rock Stadium", group: "C" },
  { date: "Jun 20", team1: "MAR", team2: "HAI", venue: "Mercedes-Benz Stadium", group: "C" },
  { date: "Jun 25", team1: "BRA", team2: "HAI", venue: "Hard Rock Stadium", group: "C" },
  { date: "Jun 25", team1: "MAR", team2: "SCO", venue: "Hard Rock Stadium", group: "C" },
  // Group D
  { date: "Jun 12", team1: "USA", team2: "PAR", venue: "SoFi Stadium", group: "D" },
  { date: "Jun 12", team1: "AUS", team2: "TUR", venue: "Levi's Stadium", group: "D" },
  { date: "Jun 19", team1: "USA", team2: "AUS", venue: "SoFi Stadium", group: "D" },
  { date: "Jun 19", team1: "TUR", team2: "PAR", venue: "Levi's Stadium", group: "D" },
  { date: "Jun 25", team1: "TUR", team2: "USA", venue: "SoFi Stadium", group: "D" },
  { date: "Jun 25", team1: "PAR", team2: "AUS", venue: "Levi's Stadium", group: "D" },
  // Group E
  { date: "Jun 13", team1: "GER", team2: "ECU", venue: "MetLife Stadium", group: "E" },
  { date: "Jun 13", team1: "CUW", team2: "CIV", venue: "Lincoln Financial", group: "E" },
  { date: "Jun 20", team1: "GER", team2: "CUW", venue: "MetLife Stadium", group: "E" },
  { date: "Jun 20", team1: "ECU", team2: "CIV", venue: "Gillette Stadium", group: "E" },
  { date: "Jun 25", team1: "ECU", team2: "GER", venue: "MetLife Stadium", group: "E" },
  { date: "Jun 25", team1: "CIV", team2: "CUW", venue: "Lincoln Financial", group: "E" },
  // Group F
  { date: "Jun 14", team1: "NED", team2: "TUN", venue: "Arrowhead Stadium", group: "F" },
  { date: "Jun 14", team1: "JPN", team2: "SWE", venue: "AT&T Stadium", group: "F" },
  { date: "Jun 21", team1: "NED", team2: "JPN", venue: "Arrowhead Stadium", group: "F" },
  { date: "Jun 21", team1: "SWE", team2: "TUN", venue: "AT&T Stadium", group: "F" },
  { date: "Jun 26", team1: "SWE", team2: "NED", venue: "AT&T Stadium", group: "F" },
  { date: "Jun 26", team1: "TUN", team2: "JPN", venue: "Arrowhead Stadium", group: "F" },
  // Group G
  { date: "Jun 14", team1: "BEL", team2: "IRN", venue: "NRG Stadium", group: "G" },
  { date: "Jun 14", team1: "EGY", team2: "NZL", venue: "Lumen Field", group: "G" },
  { date: "Jun 21", team1: "BEL", team2: "EGY", venue: "NRG Stadium", group: "G" },
  { date: "Jun 21", team1: "NZL", team2: "IRN", venue: "Lumen Field", group: "G" },
  { date: "Jun 26", team1: "NZL", team2: "BEL", venue: "Lumen Field", group: "G" },
  { date: "Jun 26", team1: "IRN", team2: "EGY", venue: "NRG Stadium", group: "G" },
  // Group H
  { date: "Jun 15", team1: "ESP", team2: "URU", venue: "MetLife Stadium", group: "H" },
  { date: "Jun 15", team1: "KSA", team2: "CPV", venue: "Arrowhead Stadium", group: "H" },
  { date: "Jun 22", team1: "ESP", team2: "KSA", venue: "MetLife Stadium", group: "H" },
  { date: "Jun 22", team1: "URU", team2: "CPV", venue: "Arrowhead Stadium", group: "H" },
  { date: "Jun 27", team1: "CPV", team2: "ESP", venue: "MetLife Stadium", group: "H" },
  { date: "Jun 27", team1: "URU", team2: "KSA", venue: "Arrowhead Stadium", group: "H" },
  // Group I
  { date: "Jun 15", team1: "FRA", team2: "SEN", venue: "Gillette Stadium", group: "I" },
  { date: "Jun 15", team1: "NOR", team2: "ALG", venue: "Stade de Montréal", group: "I" },
  { date: "Jun 22", team1: "FRA", team2: "NOR", venue: "Gillette Stadium", group: "I" },
  { date: "Jun 22", team1: "ALG", team2: "SEN", venue: "Stade de Montréal", group: "I" },
  { date: "Jun 27", team1: "ALG", team2: "FRA", venue: "Gillette Stadium", group: "I" },
  { date: "Jun 27", team1: "SEN", team2: "NOR", venue: "Stade de Montréal", group: "I" },
  // Group J
  { date: "Jun 16", team1: "ARG", team2: "AUT", venue: "Hard Rock Stadium", group: "J" },
  { date: "Jun 16", team1: "JOR", team2: "COD", venue: "Mercedes-Benz Stadium", group: "J" },
  { date: "Jun 23", team1: "ARG", team2: "JOR", venue: "Hard Rock Stadium", group: "J" },
  { date: "Jun 23", team1: "COD", team2: "AUT", venue: "Mercedes-Benz Stadium", group: "J" },
  { date: "Jun 28", team1: "COD", team2: "ARG", venue: "Hard Rock Stadium", group: "J" },
  { date: "Jun 28", team1: "AUT", team2: "JOR", venue: "Mercedes-Benz Stadium", group: "J" },
  // Group K
  { date: "Jun 16", team1: "POR", team2: "COL", venue: "SoFi Stadium", group: "K" },
  { date: "Jun 16", team1: "GHA", team2: "PAN", venue: "Levi's Stadium", group: "K" },
  { date: "Jun 23", team1: "POR", team2: "GHA", venue: "SoFi Stadium", group: "K" },
  { date: "Jun 23", team1: "PAN", team2: "COL", venue: "Levi's Stadium", group: "K" },
  { date: "Jun 28", team1: "PAN", team2: "POR", venue: "SoFi Stadium", group: "K" },
  { date: "Jun 28", team1: "COL", team2: "GHA", venue: "Levi's Stadium", group: "K" },
  // Group L
  { date: "Jun 17", team1: "ENG", team2: "CRO", venue: "AT&T Stadium", group: "L" },
  { date: "Jun 17", team1: "IRQ", team2: "UZB", venue: "Lincoln Financial", group: "L" },
  { date: "Jun 24", team1: "ENG", team2: "IRQ", venue: "AT&T Stadium", group: "L" },
  { date: "Jun 24", team1: "UZB", team2: "CRO", venue: "Lincoln Financial", group: "L" },
  { date: "Jun 29", team1: "UZB", team2: "ENG", venue: "AT&T Stadium", group: "L" },
  { date: "Jun 29", team1: "CRO", team2: "IRQ", venue: "Lincoln Financial", group: "L" },
];

// ============================================================
// STORAGE HELPERS
// ============================================================

async function loadCollection() {
  try {
    const result = await window.storage.get("panini2026_collection");
    return result ? JSON.parse(result.value) : {};
  } catch { return {}; }
}

async function saveCollection(data) {
  try {
    await window.storage.set("panini2026_collection", JSON.stringify(data));
  } catch(e) { console.error("Storage error", e); }
}

async function loadRepeated() {
  try {
    const result = await window.storage.get("panini2026_repeated");
    return result ? JSON.parse(result.value) : {};
  } catch { return {}; }
}

async function saveRepeated(data) {
  try {
    await window.storage.set("panini2026_repeated", JSON.stringify(data));
  } catch(e) { console.error("Storage error", e); }
}

// ============================================================
// STYLES
// ============================================================

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg: #0a0e1a;
    --bg2: #111827;
    --bg3: #1a2235;
    --card: #1e2d42;
    --accent: #e8b84b;
    --accent2: #c8421a;
    --gold: #ffd700;
    --text: #e8eaf0;
    --muted: #8899aa;
    --have: #22c55e;
    --missing: #374151;
    --foil: linear-gradient(135deg,#ffd700,#ff9f43,#ee5a24,#ff9f43,#ffd700);
    --r: 8px;
  }
  
  body { background: var(--bg); color: var(--text); font-family: 'Rajdhani', sans-serif; min-height: 100vh; }
  
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  
  /* Header */
  .header {
    background: linear-gradient(135deg, #0d1526 0%, #1a2440 50%, #0d1526 100%);
    border-bottom: 2px solid var(--accent);
    padding: 12px 20px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
  }
  .header-title { font-family: 'Bebas Neue', cursive; font-size: 1.6rem; color: var(--accent); letter-spacing: 2px; }
  .header-sub { font-size: 0.75rem; color: var(--muted); }
  .header-stats { display: flex; gap: 16px; }
  .stat-pill {
    background: var(--bg3); border: 1px solid #2a3a55;
    padding: 4px 12px; border-radius: 20px; text-align: center;
    font-size: 0.75rem;
  }
  .stat-num { font-family: 'Bebas Neue', cursive; font-size: 1.2rem; color: var(--accent); display: block; }
  
  /* Nav tabs */
  .nav {
    background: var(--bg2); border-bottom: 1px solid #1e3050;
    display: flex; overflow-x: auto; scrollbar-width: none; gap: 2px; padding: 0 8px;
  }
  .nav::-webkit-scrollbar { display: none; }
  .nav-btn {
    padding: 10px 14px; background: none; border: none; cursor: pointer;
    color: var(--muted); font-family: 'Rajdhani', sans-serif; font-size: 0.8rem;
    font-weight: 600; white-space: nowrap; letter-spacing: 0.5px;
    border-bottom: 2px solid transparent; transition: all 0.2s;
    text-transform: uppercase;
  }
  .nav-btn:hover { color: var(--text); }
  .nav-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
  .nav-section { 
    padding: 4px 8px; color: var(--accent2); font-size: 0.65rem; 
    font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    display: flex; align-items: center; border-left: 2px solid var(--accent2);
    margin: 4px 4px;
  }
  
  /* Content */
  .content { flex: 1; padding: 16px; max-width: 1200px; margin: 0 auto; width: 100%; }
  
  /* Groups page */
  .groups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
  .group-card {
    background: var(--card); border: 1px solid #2a3a55; border-radius: var(--r);
    overflow: hidden;
  }
  .group-header {
    background: linear-gradient(135deg, var(--accent2), #8b1a00);
    padding: 8px 14px; font-family: 'Bebas Neue', cursive;
    font-size: 1.2rem; letter-spacing: 2px; display: flex; justify-content: space-between; align-items: center;
  }
  .group-team {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 14px; border-bottom: 1px solid #1a2a3a;
  }
  .group-team:last-child { border-bottom: none; }
  .team-flag { font-size: 1.4rem; }
  .team-name { font-weight: 600; font-size: 0.9rem; }
  
  /* Fixture */
  .fixture-day { margin-bottom: 16px; }
  .fixture-date { font-family: 'Bebas Neue', cursive; font-size: 1rem; color: var(--accent); 
    letter-spacing: 2px; padding: 6px 0; border-bottom: 1px solid #1e3050; margin-bottom: 8px; }
  .fixture-matches { display: flex; flex-direction: column; gap: 6px; }
  .fixture-match {
    background: var(--card); border: 1px solid #2a3a55; border-radius: 6px;
    padding: 10px 14px; display: flex; align-items: center; gap: 12px;
    font-size: 0.85rem;
  }
  .fx-group { 
    background: var(--accent2); color: white; font-family: 'Bebas Neue', cursive;
    padding: 2px 7px; border-radius: 4px; font-size: 0.75rem; min-width: 28px; text-align: center;
  }
  .fx-teams { flex: 1; display: flex; align-items: center; gap: 8px; font-weight: 600; }
  .fx-vs { color: var(--muted); font-size: 0.75rem; }
  .fx-venue { color: var(--muted); font-size: 0.75rem; margin-left: auto; }
  
  /* Team page */
  .team-page-header {
    background: var(--card); border: 1px solid #2a3a55; border-radius: var(--r);
    padding: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 16px;
  }
  .team-big-flag { font-size: 3rem; }
  .team-page-name { font-family: 'Bebas Neue', cursive; font-size: 2rem; letter-spacing: 2px; }
  .team-progress-bar {
    height: 6px; background: #1a2a3a; border-radius: 3px; flex: 1; margin-top: 6px;
    overflow: hidden;
  }
  .team-progress-fill { height: 100%; background: var(--have); border-radius: 3px; transition: width 0.3s; }
  
  .stickers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
  .sticker-card {
    background: var(--missing); border: 2px solid #2a3a55; border-radius: 6px;
    padding: 10px 8px; cursor: pointer; transition: all 0.15s; text-align: center;
    position: relative; user-select: none;
  }
  .sticker-card:hover { transform: translateY(-1px); border-color: #4a6a90; }
  .sticker-card.have { background: #0f2d1a; border-color: var(--have); }
  .sticker-card.foil { background: linear-gradient(135deg, #1a1500, #2a2000, #1a1500); border-color: var(--gold); }
  .sticker-card.foil.have { background: linear-gradient(135deg, #1a2a00, #2a3a00, #1a2a00); border-color: #4ade80; }
  .sticker-id { font-family: 'Bebas Neue', cursive; font-size: 1.1rem; color: var(--accent); }
  .sticker-name { font-size: 0.7rem; color: var(--muted); margin-top: 3px; line-height: 1.3; }
  .sticker-card.have .sticker-name { color: #86efac; }
  .foil-badge { 
    position: absolute; top: 4px; right: 4px; 
    background: linear-gradient(135deg, #ffd700, #ff9f43); 
    color: #000; font-size: 0.55rem; font-weight: 700; 
    padding: 1px 4px; border-radius: 3px; letter-spacing: 0.5px;
  }
  .check-icon { position: absolute; top: 4px; left: 4px; color: var(--have); font-size: 0.85rem; }
  
  /* Section pages (stadiums, coca-cola, FWC) */
  .section-header { 
    font-family: 'Bebas Neue', cursive; font-size: 1.5rem; color: var(--accent); 
    letter-spacing: 3px; margin-bottom: 12px; border-bottom: 1px solid #1e3050; padding-bottom: 6px;
  }
  .section-progress { 
    background: var(--card); border: 1px solid #2a3a55; border-radius: var(--r); 
    padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;
  }
  .progress-text { font-size: 0.85rem; }
  .prog-num { font-family: 'Bebas Neue', cursive; font-size: 1.4rem; color: var(--accent); }
  
  /* Search */
  .search-bar {
    background: var(--card); border: 2px solid #2a3a55; border-radius: var(--r);
    padding: 10px 16px; width: 100%; color: var(--text);
    font-family: 'Rajdhani', sans-serif; font-size: 1rem;
    margin-bottom: 16px; outline: none; transition: border-color 0.2s;
  }
  .search-bar:focus { border-color: var(--accent); }
  .search-result {
    background: var(--card); border: 1px solid #2a3a55; border-radius: 6px;
    padding: 12px 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px;
  }
  .search-result.found { border-color: var(--have); }
  .search-result.missing { border-color: var(--accent2); }
  .sr-status { 
    padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 0.8rem;
    font-family: 'Bebas Neue', cursive; letter-spacing: 1px; min-width: 80px; text-align: center;
  }
  .sr-status.found { background: #0f2d1a; color: var(--have); border: 1px solid var(--have); }
  .sr-status.missing { background: #2d0f00; color: #f97316; border: 1px solid #f97316; }
  .sr-info { flex: 1; }
  .sr-id { font-family: 'Bebas Neue', cursive; font-size: 1.1rem; color: var(--accent); }
  .sr-name { font-size: 0.8rem; color: var(--muted); }
  
  /* Repeated */
  .repeated-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
  .rep-card {
    background: var(--card); border: 1px solid #2a3a55; border-radius: 6px;
    padding: 10px 12px; display: flex; align-items: center; gap: 10px;
  }
  .rep-id { font-family: 'Bebas Neue', cursive; font-size: 1.1rem; color: var(--accent); min-width: 50px; }
  .rep-name { font-size: 0.75rem; color: var(--muted); flex: 1; line-height: 1.3; }
  .rep-controls { display: flex; align-items: center; gap: 6px; }
  .rep-btn { 
    width: 26px; height: 26px; border: 1px solid #3a5a80; border-radius: 4px;
    background: var(--bg3); color: var(--text); cursor: pointer; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center; font-weight: 700;
  }
  .rep-btn:hover { background: #2a4060; }
  .rep-count { 
    font-family: 'Bebas Neue', cursive; font-size: 1.2rem; color: var(--accent); 
    min-width: 24px; text-align: center;
  }
  .rep-input {
    width: 100%; margin-bottom: 8px; background: var(--card); border: 1px solid #2a3a55;
    border-radius: 6px; padding: 8px 12px; color: var(--text);
    font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; outline: none;
  }
  .rep-input:focus { border-color: var(--accent); }
  
  /* Empty state */
  .empty-state { text-align: center; padding: 40px; color: var(--muted); }
  
  /* Loading */
  .loading { text-align: center; padding: 40px; color: var(--muted); font-family: 'Bebas Neue', cursive; font-size: 1.5rem; letter-spacing: 3px; }
  
  /* Tabs within a section */
  .sub-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .sub-tab { 
    padding: 6px 14px; background: var(--bg3); border: 1px solid #2a3a55; border-radius: 20px;
    cursor: pointer; font-size: 0.8rem; font-weight: 600; color: var(--muted); transition: all 0.15s;
  }
  .sub-tab:hover { color: var(--text); }
  .sub-tab.active { background: var(--accent); color: #000; border-color: var(--accent); }
  
  /* Totals bar */
  .totals-bar {
    background: var(--bg2); border-top: 1px solid #1e3050; padding: 8px 16px;
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; align-items: center;
  }
  .tb-item { font-size: 0.8rem; color: var(--muted); }
  .tb-num { font-family: 'Bebas Neue', cursive; font-size: 1.1rem; color: var(--accent); }

  /* Export/Import */
  .io-btn {
    padding: 5px 12px; border-radius: 6px; cursor: pointer; font-family: 'Rajdhani', sans-serif;
    font-weight: 700; font-size: 0.78rem; letter-spacing: 0.5px; border: 1px solid; transition: all 0.15s;
  }
  .io-btn.export { background: #0f2d1a; color: var(--have); border-color: var(--have); }
  .io-btn.export:hover { background: #1a4a2a; }
  .io-btn.import { background: #1a2040; color: #60a5fa; border-color: #3b6fd4; }
  .io-btn.import:hover { background: #243060; }
  .io-btn.reset { background: #2d0f00; color: #f97316; border-color: #c2410c; }
  .io-btn.reset:hover { background: #4d1800; }
  .toast {
    position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
    background: #1e3a1e; border: 1px solid var(--have); color: var(--have);
    padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
    z-index: 999; animation: fadeInOut 2.5s forwards;
  }
  .toast.error { background: #3a1e1e; border-color: #f97316; color: #f97316; }
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
    75% { opacity: 1; }
    100% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
  }
`;

// ============================================================
// MAIN APP
// ============================================================

export default function PaniniTracker() {
  const [activeTab, setActiveTab] = useState("grupos");
  const [collection, setCollection] = useState(null);
  const [repeated, setRepeated] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [repSearchQuery, setRepSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    (async () => {
      const [col, rep] = await Promise.all([loadCollection(), loadRepeated()]);
      setCollection(col);
      setRepeated(rep);
      setLoading(false);
    })();
  }, []);

  const handleExport = () => {
    const data = { collection, repeated, exportDate: new Date().toISOString(), version: "1.0" };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `panini2026_${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Colección exportada");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.collection || !data.repeated) throw new Error("invalid");
        await saveCollection(data.collection);
        await saveRepeated(data.repeated);
        setCollection(data.collection);
        setRepeated(data.repeated);
        showToast(`✓ Importado: ${Object.keys(data.collection).length} láminas`);
      } catch { showToast("✗ Archivo inválido", true); }
    };
    reader.readAsText(file); e.target.value = "";
  };

  const handleReset = () => {
    if (!window.confirm("¿Borrar toda la colección? No se puede deshacer.")) return;
    setCollection({}); setRepeated({});
    saveCollection({}); saveRepeated({});
    showToast("Colección reiniciada");
  };

  const toggleSticker = useCallback(async (id) => {
    setCollection(prev => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      saveCollection(next);
      return next;
    });
  }, []);

  const updateRepeated = useCallback(async (id, delta) => {
    setRepeated(prev => {
      const next = { ...prev };
      const cur = next[id] || 0;
      const newVal = Math.max(0, cur + delta);
      if (newVal === 0) delete next[id];
      else next[id] = newVal;
      saveRepeated(next);
      return next;
    });
  }, []);

  if (loading || !collection || !repeated) {
    return (
      <>
        <style>{css}</style>
        <div className="loading">Cargando álbum... ⚽</div>
      </>
    );
  }

  const totalHave = Object.keys(collection).length;
  const totalMissing = TOTAL_STICKERS - totalHave;
  const totalRepeated = Object.values(repeated).reduce((a, b) => a + b, 0);

  // Nav items
  const navItems = [
    { id: "grupos", label: "⚽ Grupos & Fixture" },
    { id: "fwc", label: "🏆 Apertura & Historia" },
    ...Object.entries(GROUPS).map(([g, data]) => ({
      id: `group_${g}`,
      label: `${g}: ${data.teams.map(t => FLAGS[t]).join("")}`,
      group: g
    })),
    { id: "estadios", label: "🏟️ Estadios" },
    { id: "cocacola", label: "🥤 Coca-Cola" },
    { id: "buscador", label: "🔍 Buscador" },
    { id: "repetidas", label: "🔁 Repetidas" },
  ];

  // Render content based on tab
  const renderContent = () => {
    if (activeTab === "grupos") return <GroupsAndFixture collection={collection} />;
    if (activeTab === "fwc") return <FWCSection collection={collection} toggleSticker={toggleSticker} />;
    if (activeTab.startsWith("group_")) {
      const g = activeTab.replace("group_", "");
      return <TeamGroupPage group={g} groupData={GROUPS[g]} collection={collection} toggleSticker={toggleSticker} />;
    }
    if (activeTab === "estadios") return <StadiumsPage collection={collection} toggleSticker={toggleSticker} />;
    if (activeTab === "cocacola") return <CocaColaPage collection={collection} toggleSticker={toggleSticker} />;
    if (activeTab === "buscador") return <SearchPage collection={collection} query={searchQuery} setQuery={setSearchQuery} />;
    if (activeTab === "repetidas") return <RepeatedPage repeated={repeated} updateRepeated={updateRepeated} collection={collection} query={repSearchQuery} setQuery={setRepSearchQuery} />;
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div>
            <div className="header-title">⚽ Álbum Panini 2026</div>
            <div className="header-sub">FIFA World Cup™ · USA · México · Canadá</div>
          </div>
          <div className="header-stats">
            <div className="stat-pill"><span className="stat-num">{totalHave}</span>Tengo</div>
            <div className="stat-pill"><span className="stat-num" style={{color:"#f87171"}}>{totalMissing}</span>Faltan</div>
            <div className="stat-pill"><span className="stat-num" style={{color:"#60a5fa"}}>{totalRepeated}</span>Repetidas</div>
            <input ref={fileInputRef} type="file" accept=".json" style={{display:"none"}} onChange={handleImport} />
            <button className="io-btn export" onClick={handleExport} title="Exportar colección a JSON">⬇ Exportar</button>
            <button className="io-btn import" onClick={() => fileInputRef.current?.click()} title="Importar colección desde JSON">⬆ Importar</button>
            <button className="io-btn reset" onClick={handleReset} title="Borrar todo">✕</button>
          </div>
        </header>
        {toast && <div className={`toast ${toast.isError ? "error" : ""}`}>{toast.msg}</div>}

        <nav className="nav">
          {navItems.map((item, i) => {
            const isGroupHeader = i === 2;
            if (item.id === "estadios" || item.id === "buscador" || item.id === "repetidas") {
              return <button key={item.id} className={`nav-btn ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>{item.label}</button>;
            }
            return (
              <button key={item.id} className={`nav-btn ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
                {item.label}
              </button>
            );
          })}
        </nav>

        <main className="content">
          {renderContent()}
        </main>

        <div className="totals-bar">
          <span className="tb-item"><span className="tb-num">{TOTAL_STICKERS}</span> láminas totales</span>
          <span className="tb-item"><span className="tb-num" style={{color:"var(--have)"}}>{totalHave}</span> completadas</span>
          <span className="tb-item"><span className="tb-num" style={{color:"#f87171"}}>{totalMissing}</span> faltantes</span>
          <span className="tb-item"><span className="tb-num" style={{color:"#60a5fa"}}>{totalRepeated}</span> repetidas</span>
          <span className="tb-item"><span className="tb-num">{Math.round((totalHave/TOTAL_STICKERS)*100)}%</span> completado</span>
        </div>
      </div>
    </>
  );
}

// ============================================================
// GROUPS + FIXTURE PAGE
// ============================================================
function GroupsAndFixture({ collection }) {
  const [view, setView] = useState("groups");
  const [filterGroup, setFilterGroup] = useState("all");

  const filteredFixtures = filterGroup === "all" ? FIXTURES : FIXTURES.filter(f => f.group === filterGroup);

  // Group by date
  const byDate = {};
  filteredFixtures.forEach(f => {
    if (!byDate[f.date]) byDate[f.date] = [];
    byDate[f.date].push(f);
  });

  return (
    <div>
      <div className="sub-tabs" style={{marginBottom: 16}}>
        <div className={`sub-tab ${view === "groups" ? "active" : ""}`} onClick={() => setView("groups")}>Grupos</div>
        <div className={`sub-tab ${view === "fixture" ? "active" : ""}`} onClick={() => setView("fixture")}>Fixture Completo</div>
      </div>

      {view === "groups" && (
        <div className="groups-grid">
          {Object.entries(GROUPS).map(([letter, data]) => {
            const teamsInGroup = data.teams;
            return (
              <div className="group-card" key={letter}>
                <div className="group-header">
                  <span>GRUPO {letter}</span>
                  <span style={{fontSize:"0.75rem",opacity:0.8}}>{data.teams.length} equipos</span>
                </div>
                {teamsInGroup.map(code => {
                  const teamStickers = getTeamStickers(code);
                  const have = teamStickers.filter(s => collection[s.id]).length;
                  return (
                    <div className="group-team" key={code}>
                      <span className="team-flag">{FLAGS[code]}</span>
                      <div style={{flex:1}}>
                        <div className="team-name">{TEAM_NAMES[code]}</div>
                        <div style={{fontSize:"0.7rem",color:"var(--muted)"}}>{have}/20 láminas</div>
                      </div>
                      <div style={{fontSize:"0.75rem",color: have===20 ? "var(--have)" : "var(--muted)"}}>
                        {Math.round((have/20)*100)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {view === "fixture" && (
        <div>
          <div className="sub-tabs">
            <div className={`sub-tab ${filterGroup === "all" ? "active" : ""}`} onClick={() => setFilterGroup("all")}>Todos</div>
            {Object.keys(GROUPS).map(g => (
              <div key={g} className={`sub-tab ${filterGroup === g ? "active" : ""}`} onClick={() => setFilterGroup(g)}>Grupo {g}</div>
            ))}
          </div>
          {Object.entries(byDate).map(([date, matches]) => (
            <div className="fixture-day" key={date}>
              <div className="fixture-date">{date} · 2026</div>
              <div className="fixture-matches">
                {matches.map((m, i) => (
                  <div className="fixture-match" key={i}>
                    <span className="fx-group">G{m.group}</span>
                    <div className="fx-teams">
                      <span>{FLAGS[m.team1]} {TEAM_NAMES[m.team1]}</span>
                      <span className="fx-vs">vs</span>
                      <span>{FLAGS[m.team2]} {TEAM_NAMES[m.team2]}</span>
                    </div>
                    <span className="fx-venue">📍 {m.venue}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// FWC SECTION (History, Emblems, etc)
// ============================================================
function FWCSection({ collection, toggleSticker }) {
  const have = FWC_STICKERS.filter(s => collection[s.id]).length;
  return (
    <div>
      <div className="section-header">🏆 Apertura, Historia & Mundial</div>
      <div className="section-progress">
        <div style={{flex:1}}>
          <div className="progress-text"><span className="prog-num">{have}</span> / {FWC_STICKERS.length} láminas</div>
          <div className="team-progress-bar"><div className="team-progress-fill" style={{width:`${(have/FWC_STICKERS.length)*100}%`}} /></div>
        </div>
      </div>
      <div className="stickers-grid">
        {FWC_STICKERS.map(s => (
          <StickerCard key={s.id} sticker={s} have={!!collection[s.id]} onToggle={() => toggleSticker(s.id)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TEAM GROUP PAGE (4 teams per group)
// ============================================================
function TeamGroupPage({ group, groupData, collection, toggleSticker }) {
  const [selectedTeam, setSelectedTeam] = useState(groupData.teams[0]);

  const teamStickers = getTeamStickers(selectedTeam);
  const have = teamStickers.filter(s => collection[s.id]).length;

  return (
    <div>
      <div className="sub-tabs">
        {groupData.teams.map(code => {
          const ts = getTeamStickers(code);
          const h = ts.filter(s => collection[s.id]).length;
          return (
            <div key={code} className={`sub-tab ${selectedTeam === code ? "active" : ""}`} onClick={() => setSelectedTeam(code)}>
              {FLAGS[code]} {TEAM_NAMES[code]} ({h}/20)
            </div>
          );
        })}
      </div>

      <div className="team-page-header">
        <div className="team-big-flag">{FLAGS[selectedTeam]}</div>
        <div style={{flex:1}}>
          <div className="team-page-name">{TEAM_NAMES[selectedTeam]}</div>
          <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:2}}>Grupo {group} · {have} / 20 láminas · {Math.round((have/20)*100)}% completado</div>
          <div className="team-progress-bar"><div className="team-progress-fill" style={{width:`${(have/20)*100}%`}} /></div>
        </div>
      </div>

      <div className="stickers-grid">
        {teamStickers.map(s => (
          <StickerCard key={s.id} sticker={s} have={!!collection[s.id]} onToggle={() => toggleSticker(s.id)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// STADIUMS PAGE
// ============================================================
function StadiumsPage({ collection, toggleSticker }) {
  const have = STADIUMS.filter(s => collection[s.id]).length;
  return (
    <div>
      <div className="section-header">🏟️ Estadios</div>
      <div className="section-progress">
        <div style={{flex:1}}>
          <div className="progress-text"><span className="prog-num">{have}</span> / {STADIUMS.length} estadios</div>
          <div className="team-progress-bar"><div className="team-progress-fill" style={{width:`${(have/STADIUMS.length)*100}%`}} /></div>
        </div>
      </div>
      <div className="stickers-grid">
        {STADIUMS.map(s => (
          <StickerCard key={s.id} sticker={{...s, name: `${s.name}\n${s.country}`}} have={!!collection[s.id]} onToggle={() => toggleSticker(s.id)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COCA-COLA PAGE
// ============================================================
function CocaColaPage({ collection, toggleSticker }) {
  const have = COCA_COLA_STICKERS.filter(s => collection[s.id]).length;
  return (
    <div>
      <div className="section-header">🥤 Láminas Coca-Cola</div>
      <div style={{background:"var(--card)",border:"1px solid #2a3a55",borderRadius:"var(--r)",padding:"12px 16px",marginBottom:12,fontSize:"0.82rem",color:"var(--muted)"}}>
        Láminas exclusivas que aparecen dentro de etiquetas de botellas de Coca-Cola y Coca-Cola Zero Sugar. El álbum tiene una doble página especial para estas 12 láminas.
      </div>
      <div className="section-progress">
        <div style={{flex:1}}>
          <div className="progress-text"><span className="prog-num">{have}</span> / {COCA_COLA_STICKERS.length} láminas Coca-Cola</div>
          <div className="team-progress-bar"><div className="team-progress-fill" style={{width:`${(have/COCA_COLA_STICKERS.length)*100}%`}} /></div>
        </div>
      </div>
      <div className="stickers-grid">
        {COCA_COLA_STICKERS.map(s => (
          <StickerCard key={s.id} sticker={s} have={!!collection[s.id]} onToggle={() => toggleSticker(s.id)} special />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SEARCH PAGE
// ============================================================
function SearchPage({ collection, query, setQuery }) {
  const results = query.trim().length >= 2
    ? Object.entries(FULL_CHECKLIST)
        .filter(([id, s]) => {
          const q = query.toLowerCase();
          return id.toLowerCase().includes(q) || (s.name && s.name.toLowerCase().includes(q));
        })
        .slice(0, 50)
    : [];

  const have = results.filter(([id]) => collection[id]).length;
  const missing = results.length - have;

  return (
    <div>
      <div className="section-header">🔍 Buscador de Láminas</div>
      <input
        className="search-bar"
        placeholder="Buscar por código (ej: ARG10, MEX1, CC3) o nombre de jugador..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
      />
      {query.trim().length >= 2 && (
        <div style={{marginBottom:12,color:"var(--muted)",fontSize:"0.82rem"}}>
          {results.length} resultados · <span style={{color:"var(--have)"}}>{have} tenés</span> · <span style={{color:"#f97316"}}>{missing} te faltan</span>
        </div>
      )}
      {query.trim().length >= 2 && results.length === 0 && (
        <div className="empty-state">No se encontraron láminas para "{query}"</div>
      )}
      {results.map(([id, s]) => {
        const found = !!collection[id];
        const teamCode = s.team;
        return (
          <div className={`search-result ${found ? "found" : "missing"}`} key={id}>
            <span className={`sr-status ${found ? "found" : "missing"}`}>{found ? "✓ TENGO" : "✗ FALTA"}</span>
            <div className="sr-info">
              <div className="sr-id">{id} {teamCode && FLAGS[teamCode]}</div>
              <div className="sr-name">{s.name}{teamCode ? ` · ${TEAM_NAMES[teamCode]}` : ""}</div>
            </div>
            {s.foil && <span style={{background:"linear-gradient(135deg,#ffd700,#ff9f43)",color:"#000",fontSize:"0.65rem",fontWeight:700,padding:"2px 7px",borderRadius:4}}>FOIL</span>}
          </div>
        );
      })}
      {query.trim().length < 2 && (
        <div className="empty-state" style={{fontSize:"0.9rem"}}>
          Escribí al menos 2 caracteres para buscar<br/>
          <span style={{fontSize:"0.75rem",marginTop:8,display:"block"}}>Ejemplos: "Messi", "ARG10", "CC1", "EST5", "FWC3"</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// REPEATED PAGE
// ============================================================
function RepeatedPage({ repeated, updateRepeated, collection, query, setQuery }) {
  const repEntries = Object.entries(repeated).filter(([, v]) => v > 0);
  const filtered = query.trim().length >= 2
    ? repEntries.filter(([id]) => {
        const s = FULL_CHECKLIST[id];
        return id.toLowerCase().includes(query.toLowerCase()) || (s?.name?.toLowerCase().includes(query.toLowerCase()));
      })
    : repEntries;

  const totalRep = repEntries.reduce((a, [, v]) => a + v, 0);

  // Add repeated sticker by ID
  const handleAddRep = (id) => {
    const clean = id.trim().toUpperCase();
    if (FULL_CHECKLIST[clean]) updateRepeated(clean, 1);
  };

  const [addId, setAddId] = useState("");

  return (
    <div>
      <div className="section-header">🔁 Láminas Repetidas</div>
      <div className="section-progress">
        <div>
          <div className="progress-text"><span className="prog-num">{totalRep}</span> láminas repetidas totales · {repEntries.length} códigos diferentes</div>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input
          className="rep-input"
          style={{flex:1,marginBottom:0}}
          placeholder="Agregar repetida (ej: ARG10, MEX1, CC3)..."
          value={addId}
          onChange={e => setAddId(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { handleAddRep(addId); setAddId(""); } }}
        />
        <button
          onClick={() => { handleAddRep(addId); setAddId(""); }}
          style={{padding:"8px 16px",background:"var(--accent)",border:"none",borderRadius:6,cursor:"pointer",fontFamily:"Rajdhani",fontWeight:700,color:"#000"}}
        >
          + Agregar
        </button>
      </div>

      <input
        className="rep-input"
        placeholder="Filtrar repetidas..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {filtered.length === 0 && (
        <div className="empty-state">
          {repEntries.length === 0 ? "Aún no tenés repetidas registradas" : "No hay resultados para tu búsqueda"}
        </div>
      )}

      <div className="repeated-grid">
        {filtered.sort((a, b) => b[1] - a[1]).map(([id, count]) => {
          const s = FULL_CHECKLIST[id];
          const teamCode = s?.team;
          return (
            <div className="rep-card" key={id}>
              <div>
                <div className="rep-id">{id} {teamCode && FLAGS[teamCode]}</div>
                <div className="rep-name">{s?.name || id}{teamCode ? ` · ${TEAM_NAMES[teamCode]}` : ""}</div>
              </div>
              <div className="rep-controls" style={{marginLeft:"auto"}}>
                <button className="rep-btn" onClick={() => updateRepeated(id, -1)}>−</button>
                <span className="rep-count">{count}</span>
                <button className="rep-btn" onClick={() => updateRepeated(id, 1)}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// STICKER CARD COMPONENT
// ============================================================
function StickerCard({ sticker, have, onToggle, special }) {
  return (
    <div
      className={`sticker-card ${have ? "have" : ""} ${sticker.foil ? "foil" : ""}`}
      onClick={onToggle}
      title={sticker.name}
    >
      {have && <span className="check-icon">✓</span>}
      {sticker.foil && <span className="foil-badge">FOIL</span>}
      {special && !sticker.foil && <span className="foil-badge" style={{background:"linear-gradient(135deg,#dc143c,#ff4444)"}}>🥤</span>}
      <div className="sticker-id">{sticker.id}</div>
      <div className="sticker-name">{sticker.name}</div>
    </div>
  );
}

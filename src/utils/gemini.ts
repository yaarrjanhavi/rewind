import { GoogleGenAI } from '@google/genai';
import { HistoricalSnapshot, EventItem, MusicSnapshot, TimeCapsule, GraphConnection } from '../types';

// Precompiled detailed historical snapshots for benchmark years (to provide instant, rich experience)
const benchmarkSnapshots: Record<number, Partial<HistoricalSnapshot>> = {
  1969: {
    narrative: "1969 was a year of giant leaps and counterculture explosions. Humanity took its first steps on the Moon while half a million people gathered in muddy peace at Woodstock, redefining music and society in a single summer.",
    events: [
      { title: "Apollo 11 Moon Landing", category: "science", description: "Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon, declaring it 'one giant leap for mankind'." },
      { title: "Woodstock Music Festival", category: "pop-culture", description: "A three-day festival in upstate New York attracts over 400,000 people and becomes the defining moment of the counterculture generation." },
      { title: "Arpanet is Established", category: "science", description: "The first node-to-node communication is sent between UCLA and Stanford, laying the technical foundation for the internet." },
      { title: "Concorde First Flight", category: "science", description: "The supersonic turbojet-powered passenger airliner makes its first successful test flight in Toulouse, France." }
    ],
    music: {
      artists: ["The Beatles", "Jimi Hendrix", "Led Zeppelin", "Janis Joplin", "Sly & the Family Stone"],
      albums: [
        { title: "Abbey Road", artist: "The Beatles", releaseDate: "1969-09-26", genre: "Rock" },
        { title: "Led Zeppelin II", artist: "Led Zeppelin", releaseDate: "1969-10-22", genre: "Hard Rock" },
        { title: "Tommy", artist: "The Who", releaseDate: "1969-05-17", genre: "Rock Opera" },
        { title: "Stand!", artist: "Sly & the Family Stone", releaseDate: "1969-05-03", genre: "Funk / Soul" }
      ],
      genres: [
        { name: "Psychedelic Rock", popularity: 95 },
        { name: "Folk Rock", popularity: 80 },
        { name: "Funk / Soul", popularity: 75 },
        { name: "Classic Rock", popularity: 90 },
        { name: "Jazz Fusion", popularity: 50 }
      ],
      trends: ["Counterculture revolution", "Rock operas", "Heavy electric guitar amplification", "Festival culture explosion"],
      soundtrack: [
        { title: "Come Together", artist: "The Beatles", description: "A bluesy rock anthem opening the legendary Abbey Road album." },
        { title: "Purple Haze (Live)", artist: "Jimi Hendrix", description: "A masterclass in fuzz-wah distortion and electric guitar expression." },
        { title: "Whole Lotta Love", artist: "Led Zeppelin", description: "An iconic riff-driven track ushering in the era of heavy metal." }
      ]
    },
    capsule: {
      averageSalary: "$8,540 per year",
      popularJobs: ["Factory Assembly Worker", "Stenographer", "Keypunch Operator", "NASA Engineer"],
      fashion: ["Tie-dye shirts", "Bell-bottom jeans", "Mini skirts", "Go-go boots", "Afros and long hair"],
      technology: ["Color televisions", "Super 8 film cameras", "Rotary dial phones", "Cassette tapes (early stage)"],
      musicHabits: ["Vinyl LPs", "AM/FM radio tuning", "8-track cartridges in cars", "Hi-Fi record player systems"],
      lifestyle: ["Attending protests", "Drive-in theaters", "Bowling leagues", "Reading physical newspapers"]
    }
  },
  1977: {
    narrative: "1977 was loud, rebellious, and transformative. Punk rock exploded across urban landscapes as a loud rejection of the mainstream, while Star Wars revolutionized cinema and personal computers quietly entered the home.",
    events: [
      { title: "Release of Star Wars", category: "pop-culture", description: "George Lucas's space epic opens in theaters, breaking box office records and spawning a massive pop-culture phenomenon." },
      { title: "Launch of Voyager 1 & 2", category: "science", description: "NASA launches the twin space probes to study the outer solar system and carry the Golden Record into interstellar space." },
      { title: "Apple II Released", category: "science", description: "Apple Computer introduces the Apple II, one of the first highly successful mass-produced microcomputer products." },
      { title: "Elvis Presley Passes Away", category: "pop-culture", description: "The 'King of Rock and Roll' dies in Memphis, Tennessee, causing global mourning and marking the end of an era." }
    ],
    music: {
      artists: ["Sex Pistols", "Fleetwood Mac", "Bee Gees", "The Clash", "Pink Floyd"],
      albums: [
        { title: "Rumours", artist: "Fleetwood Mac", releaseDate: "1977-02-04", genre: "Soft Rock" },
        { title: "Never Mind the Bollocks", artist: "Sex Pistols", releaseDate: "1977-10-28", genre: "Punk Rock" },
        { title: "Saturday Night Fever OST", artist: "Bee Gees", releaseDate: "1977-11-15", genre: "Disco" },
        { title: "Animals", artist: "Pink Floyd", releaseDate: "1977-01-21", genre: "Progressive Rock" }
      ],
      genres: [
        { name: "Disco", popularity: 95 },
        { name: "Punk Rock", popularity: 88 },
        { name: "Classic Rock", popularity: 82 },
        { name: "Funk", popularity: 70 },
        { name: "New Wave", popularity: 55 }
      ],
      trends: ["Punk rebellion", "Disco fever and dance clubs", "AOR (Album Oriented Rock) dominance", "Introduction of polyphonic synthesizers"],
      soundtrack: [
        { title: "Stayin' Alive", artist: "Bee Gees", description: "The falsetto disco anthem that defined the era's dancefloor walk." },
        { title: "Anarchy in the U.K.", artist: "Sex Pistols", description: "A snarling, raw energy blast that kicked off the British punk movement." },
        { title: "Go Your Own Way", artist: "Fleetwood Mac", description: "A beautifully harmonized rock anthem driven by band heartbreak and acoustic-electric fusion." }
      ]
    },
    capsule: {
      averageSalary: "$12,800 per year",
      popularJobs: ["Typist", "Steelworker", "Travel Agent", "Analog Electronics Technician"],
      fashion: ["Leisure suits", "Platform shoes", "High-waisted trousers", "Punk safety pins", "T-shirts under blazers"],
      technology: ["Pocket calculators", "Atari 2600 home console", "VHS vs Betamax VCRs", "LED digital watches"],
      musicHabits: ["8-track tapes", "Vinyl record collecting", "FM stereo radios", "Boomboxes (early model)"],
      lifestyle: ["Roller disco skating", "Arcade cabinets (Pong)", "CB radio chatting", "Renting VHS tapes"]
    }
  },
  1989: {
    narrative: "1989 was a year that dismantled borders. The Berlin Wall crumbled down, reshaping world politics overnight, while Game Boy brought gaming to our pockets and hip-hop reached a Golden Era of political and artistic expression.",
    events: [
      { title: "Fall of the Berlin Wall", category: "politics", description: "The border between East and West Berlin is opened, paving the way for German reunification and the collapse of the Iron Curtain." },
      { title: "Nintendo Game Boy Released", category: "science", description: "Nintendo launches the 8-bit handheld video game console in Japan and North America, revolutionizing portable gaming." },
      { title: "Tiananmen Square Protests", category: "politics", description: "Student-led demonstrations in Beijing calling for democracy and freedom of speech are met with a violent military crackdown." },
      { title: "First Proposal for the World Wide Web", category: "science", description: "Tim Berners-Lee submits a proposal for an information management system, which would soon become the Web." }
    ],
    music: {
      artists: ["Public Enemy", "Madonna", "Depeche Mode", "The Cure", "N.W.A"],
      albums: [
        { title: "Like a Prayer", artist: "Madonna", releaseDate: "1989-03-21", genre: "Pop" },
        { title: "Disintegration", artist: "The Cure", releaseDate: "1989-05-02", genre: "Gothic Rock" },
        { title: "3 Feet High and Rising", artist: "De La Soul", releaseDate: "1989-03-03", genre: "Golden Era Hip-Hop" },
        { title: "Paul's Boutique", artist: "Beastie Boys", releaseDate: "1989-07-25", genre: "Hip-Hop" }
      ],
      genres: [
        { name: "Hip-Hop", popularity: 90 },
        { name: "Synth-Pop", popularity: 85 },
        { name: "Gothic / Alt Rock", popularity: 80 },
        { name: "Heavy Metal", popularity: 75 },
        { name: "House Music", popularity: 60 }
      ],
      trends: ["Golden age hip-hop sample-delia", "Alternative rock rising from underground", "Early house and rave culture", "CDs outselling vinyl records"],
      soundtrack: [
        { title: "Fight the Power", artist: "Public Enemy", description: "A politically charged hip-hop masterpiece that shook cultural foundations." },
        { title: "Lovesong", artist: "The Cure", description: "A melancholic yet deeply romantic goth-pop classic." },
        { title: "Like a Prayer", artist: "Madonna", description: "An artful, controversial pop hit combining gospel choir and rock guitars." }
      ]
    },
    capsule: {
      averageSalary: "$24,300 per year",
      popularJobs: ["Desktop Publisher", "Switchboard Operator", "Stockbroker", "Database Entry Clerk"],
      fashion: ["Neon windbreakers", "Acid-washed jeans", "Shoulder pads", "Scrunchies", "High-top sneakers"],
      technology: ["Nintendo Game Boy", "Floppy disks (3.5 inch)", "Sony Walkman CD", "Analog cell phones (bricks)"],
      musicHabits: ["Cassette mixtapes", "Portable CD players", "Watching MTV music videos", "Taping songs off FM radio"],
      lifestyle: ["Hanging out at shopping malls", "Arcade centers (Street Fighter)", "Renting VHS from Blockbuster", "Reading comic books"]
    }
  },
  2000: {
    narrative: "2000 was the dawn of a new millennium, marked by both relief and digital transformation. Having survived the Y2K bug, the world embraced the early mobile web, MP3 sharing, and the rise of cyber-pop.",
    events: [
      { title: "Survival of Y2K Bug", category: "science", description: "The turn of the millennium passes with only minor, isolated computer glitches, thanks to years of intense code preparation." },
      { title: "Launch of PlayStation 2", category: "pop-culture", description: "Sony releases the PS2 in Japan and North America, quickly becoming the best-selling video game console in history." },
      { title: "Dot-Com Bubble Bursts", category: "politics", description: "The Nasdaq Composite index peaks before collapsing, marking the end of the speculative tech investing boom." },
      { title: "International Space Station Welcomes First Crew", category: "science", description: "Expedition 1 astronauts dock with the ISS, beginning a continuous human presence in space." }
    ],
    music: {
      artists: ["Eminem", "Britney Spears", "Radiohead", "Outkast", "Linkin Park"],
      albums: [
        { title: "Kid A", artist: "Radiohead", releaseDate: "2000-10-02", genre: "Experimental Rock" },
        { title: "The Marshall Mathers LP", artist: "Eminem", releaseDate: "2000-05-23", genre: "Hip-Hop" },
        { title: "Stankonia", artist: "Outkast", releaseDate: "2000-10-31", genre: "Hip-Hop / Funk" },
        { title: "Hybrid Theory", artist: "Linkin Park", releaseDate: "2000-10-24", genre: "Nu-Metal" }
      ],
      genres: [
        { name: "Nu-Metal", popularity: 88 },
        { name: "Teen Pop", popularity: 92 },
        { name: "Hip-Hop", popularity: 90 },
        { name: "Alternative Rock", popularity: 82 },
        { name: "Trance / Electronic", popularity: 75 }
      ],
      trends: ["Digital MP3 sharing (Napster)", "Nu-Metal angsty riffs", "Maximalist music videos on MTV TRL", "Glitchy electronic rock"],
      soundtrack: [
        { title: "Ms. Jackson", artist: "Outkast", description: "A funky, apologetic hip-hop track reflecting modern relationships." },
        { title: "In the End", artist: "Linkin Park", description: "The ultimate blend of rap, rock, and angsty melodies." },
        { title: "Oops!... I Did It Again", artist: "Britney Spears", description: "A titanium-plated pop production that ruled global charts." }
      ]
    },
    capsule: {
      averageSalary: "$32,100 per year",
      popularJobs: ["Webmaster", "IT Network Admin", "Customer Support Representative", "Video Store Manager"],
      fashion: ["Frosted tips", "Cargo pants", "Low-rise jeans", "Choker necklaces", "Silver cyber-wear"],
      technology: ["Nokia 3310 phone", "MP3 Players (Napster era)", "Sony PlayStation 2", "Windows 2000 / ME PCs"],
      musicHabits: ["Burning CD-Rs", "Downloading MP3s on dial-up", "Watching MTV's TRL", "Winamp skins installation"],
      lifestyle: ["Surfing the early web (Yahoo, MSN)", "Playing snake on phone", "ICQ/AOL Instant Messenger chat", "Renting DVDs"]
    }
  }
};

// Simple procedural generator to build plausible historical profiles for other years if API is offline
export function generateProceduralSnapshot(year: number, wikiSummary: string = ''): HistoricalSnapshot {
  // Determine decade
  const decade = Math.floor(year / 10) * 10;
  
  // Interpolated Salary Formula (approximate historical averages)
  // 1900: $450, 1950: $3300, 1970: $9800, 1990: $25000, 2020: $56000
  let avgSalary = '';
  if (year < 1930) {
    avgSalary = `$${Math.round(450 + (year - 1900) * 45)} per year`;
  } else if (year < 1960) {
    avgSalary = `$${Math.round(1400 + (year - 1930) * 80)} per year`;
  } else if (year < 1980) {
    avgSalary = `$${Math.round(3800 + (year - 1960) * 450)} per year`;
  } else if (year < 2000) {
    avgSalary = `$${Math.round(12500 + (year - 1980) * 850)} per year`;
  } else {
    avgSalary = `$${Math.round(30000 + (year - 2000) * 1200)} per year`;
  }

  // Decade specific assets
  let jobs: string[] = [];
  let fashionItems: string[] = [];
  let techItems: string[] = [];
  let habits: string[] = [];
  let lifestyles: string[] = [];
  let popularArtists: string[] = [];
  let defaultAlbums: { title: string; artist: string; genre: string }[] = [];
  let genres: { name: string; popularity: number }[] = [];
  let trends: string[] = [];
  let tracks: { title: string; artist: string; description: string }[] = [];
  let events: EventItem[] = [];

  // Generate generic category events
  if (year >= 1900 && year < 1920) {
    jobs = ["Coal Miner", "Blacksmith", "Telegraph Operator", "Railway Worker"];
    fashionItems = ["Bowler hats", "Corsets", "Three-piece suits", "Pocket watches"];
    techItems = ["Gramophones", "Kinetoscopes", "Early automobiles", "Gas lamps"];
    habits = ["Listening to live brass bands", "Buying sheet music", "Winding up phonographs"];
    lifestyles = ["Saloons", "Vaudeville theater", "Writing letters by ink", "Silent film parlors"];
    popularArtists = ["Enrico Caruso", "Scott Joplin", "Billy Murray", "John Philip Sousa"];
    genres = [
      { name: "Ragtime", popularity: 90 },
      { name: "Brass Band", popularity: 80 },
      { name: "Opera / Classical", popularity: 75 },
      { name: "Early Blues", popularity: 40 }
    ];
    defaultAlbums = [
      { title: "Maple Leaf Rag", artist: "Scott Joplin", genre: "Ragtime" },
      { title: "Vesti La Giubba", artist: "Enrico Caruso", genre: "Opera" }
    ];
    trends = ["Sheet music popularity booming", "Vaudeville entertainment dominance"];
    tracks = [
      { title: "The Entertainer", artist: "Scott Joplin", description: "A bounce-filled syncopated piano rag classic." },
      { title: "Stars and Stripes Forever", artist: "John Philip Sousa", description: "A stirring, patriotic military march." }
    ];
    events = [
      { title: "Wright Brothers First Flight (1903)", category: "science", description: "Orville and Wilbur Wright achieve the first controlled powered airplane flight." },
      { title: "San Francisco Earthquake (1906)", category: "world", description: "A massive earthquake and subsequent fires destroy much of San Francisco." }
    ];
  } else if (year >= 1920 && year < 1940) {
    jobs = ["Typist", "Factory Machinist", "Jazz Musician", "Bootlegger"];
    fashionItems = ["Flapper dresses", "Fedora hats", "Zoot suits", "Oxford bags"];
    techItems = ["Vacuum-tube Radios", "Model T Fords", "Early sound cinema", "Refrigerators"];
    habits = ["Gathering around the parlor radio", "Buying 78 RPM shellac records", "Dancing the Charleston"];
    lifestyles = ["Speakeasies", "Jazz clubs", "Silent films", "Renting radio hours"];
    popularArtists = ["Louis Armstrong", "Duke Ellington", "Bessie Smith", "Robert Johnson"];
    genres = [
      { name: "Jazz / Swing", popularity: 95 },
      { name: "Delta Blues", popularity: 70 },
      { name: "Vocal Pop", popularity: 75 },
      { name: "Big Band", popularity: 85 }
    ];
    defaultAlbums = [
      { title: "West End Blues", artist: "Louis Armstrong", genre: "Jazz" },
      { title: "King of the Delta Blues Singers", artist: "Robert Johnson", genre: "Delta Blues" }
    ];
    trends = ["Jazz Age explosion", "Broadcasting boom via AM Radio", "Shellac 78 RPM record dominance"];
    tracks = [
      { title: "West End Blues", artist: "Louis Armstrong", description: "A masterwork of trumpet intro and early jazz swing." },
      { title: "Cross Road Blues", artist: "Robert Johnson", description: "The legendary delta blues acoustic guitar bottleneck classic." }
    ];
    events = [
      { title: "The Roaring Twenties", category: "pop-culture", description: "An era of economic prosperity and rapid cultural, artistic, and musical growth." },
      { title: "Wall Street Crash (1929)", category: "politics", description: "The stock market collapses, ushering in the Great Depression." }
    ];
  } else if (year >= 1940 && year < 1960) {
    jobs = ["Draftsman", "Radio Announcer", "Switchboard Girl", "Machinist"];
    fashionItems = ["Poodle skirts", "Leather jackets", "Fedora hats", "Double-breasted suits"];
    techItems = ["Transistor Radios", "Black & white TVs", "Jukeboxes", "Polaroid Land Cameras"];
    habits = ["Listening to jukeboxes in diners", "Buying Vinyl 45s", "Tuning into radio serials"];
    lifestyles = ["Soda fountains", "Drive-in diners", "Watching newsreels", "Dancing the Lindy Hop"];
    popularArtists = ["Frank Sinatra", "Elvis Presley", "Chuck Berry", "Miles Davis", "Bill Haley"];
    genres = [
      { name: "Traditional Pop", popularity: 80 },
      { name: "Big Band Swing", popularity: 70 },
      { name: "Rock & Roll", popularity: 95 },
      { name: "Cool Jazz", popularity: 75 }
    ];
    defaultAlbums = [
      { title: "In the Wee Small Hours", artist: "Frank Sinatra", genre: "Traditional Pop" },
      { title: "Elvis Presley", artist: "Elvis Presley", genre: "Rock & Roll" },
      { title: "Kind of Blue", artist: "Miles Davis", genre: "Modal Jazz" }
    ];
    trends = ["Birth of Rock & Roll", "Introduction of 33 RPM LP and 45 RPM vinyl formats", "Jukebox culture in diners"];
    tracks = [
      { title: "Johnny B. Goode", artist: "Chuck Berry", description: "The energetic electric guitar anthem that defined early rock & roll." },
      { title: "Fly Me to the Moon", artist: "Frank Sinatra", description: "A lushly orchestrated, romantic mid-century swing standard." }
    ];
    events = [
      { title: "World War II (1939-1945)", category: "world", description: "Global conflict involves the vast majority of the world's countries." },
      { title: "Discovery of DNA Structure (1953)", category: "science", description: "Watson and Crick describe the double helix structure of DNA." }
    ];
  } else if (year >= 1960 && year < 1980) {
    jobs = ["Draftsman", "Stenographer", "Aerospace Technologist", "Assembly Worker"];
    fashionItems = ["Tie-dye", "Bell-bottoms", "Mini skirts", "Chelsea boots", "Afros"];
    techItems = ["Super 8 cameras", "Color TV sets", "Stereo systems", "Pocket calculators"];
    habits = ["Buying vinyl LPs", "FM radio listening", "Recording 8-track tapes", "Car stereo tuning"];
    lifestyles = ["Music festivals", "Bowling leagues", "Protesting", "Drive-in movies"];
    popularArtists = ["The Beatles", "Led Zeppelin", "Stevie Wonder", "Jimi Hendrix", "Pink Floyd"];
    genres = [
      { name: "Psychedelic Rock", popularity: 90 },
      { name: "Folk Rock", popularity: 80 },
      { name: "Funk / Soul", popularity: 85 },
      { name: "Hard Rock", popularity: 88 },
      { name: "Disco", popularity: 75 }
    ];
    defaultAlbums = [
      { title: "Sgt. Pepper's Lonely Hearts Club Band", artist: "The Beatles", genre: "Psychedelic Rock" },
      { title: "The Dark Side of the Moon", artist: "Pink Floyd", genre: "Progressive Rock" },
      { title: "Songs in the Key of Life", artist: "Stevie Wonder", genre: "Soul / Funk" }
    ];
    trends = ["Album-oriented rock", "Synthesizers entering studios", "Stereo sound engineering", "Festival concerts"];
    tracks = [
      { title: "A Day in the Life", artist: "The Beatles", description: "A complex, orchestral psych-rock masterpiece." },
      { title: "Superstition", artist: "Stevie Wonder", description: "A clavinet-driven funk powerhouse with legendary horns." }
    ];
    events = [
      { title: "Cuban Missile Crisis (1962)", category: "politics", description: "A tense 13-day confrontation between US and USSR over nuclear missiles in Cuba." },
      { title: "Moon Landing (1969)", category: "science", description: "Apollo 11 successfully lands humans on the Moon." }
    ];
  } else if (year >= 1980 && year < 1990) {
    jobs = ["Stockbroker", "Word Processor", "Cable Installer", "Electronics Designer"];
    fashionItems = ["Shoulder pads", "Acid wash jeans", "Neon colors", "Scrunchies", "Ray-Bans"];
    techItems = ["Sony Walkman", "Nintendo NES", "IBM Personal Computer", "VCRs"];
    habits = ["Listening to Walkmans", "Recording cassette mixtapes", "Watching MTV music videos"];
    lifestyles = ["Hanging at shopping malls", "Playing arcade games", "Renting VHS from local video shops"];
    popularArtists = ["Michael Jackson", "Prince", "Madonna", "U2", "Depeche Mode"];
    genres = [
      { name: "Synth-Pop", popularity: 95 },
      { name: "Pop", popularity: 90 },
      { name: "Heavy Metal", popularity: 85 },
      { name: "New Wave", popularity: 80 },
      { name: "Early Hip-Hop", popularity: 70 }
    ];
    defaultAlbums = [
      { title: "Thriller", artist: "Michael Jackson", genre: "Pop" },
      { title: "Purple Rain", artist: "Prince", genre: "Pop Rock / Funk" },
      { title: "The Joshua Tree", artist: "U2", genre: "Rock" }
    ];
    trends = ["MTV visual age dominance", "Synthesizers & drum machines", "Cassette tapes outselling vinyl LPs"];
    tracks = [
      { title: "Billie Jean", artist: "Michael Jackson", description: "An iconic baseline pop record that broke MTV racial barriers." },
      { title: "When Doves Cry", artist: "Prince", description: "An avant-garde synth-pop hit built without a bassline." }
    ];
    events = [
      { title: "Launch of Space Shuttle Challenger (1983)", category: "science", description: "NASA's orbiter program expands space exploration flights." },
      { title: "Live Aid Concerts (1985)", category: "pop-culture", description: "Dual-venue concert raises millions for Ethiopian famine relief." }
    ];
  } else if (year >= 1990 && year < 2000) {
    jobs = ["Systems Administrator", "Web Page Designer", "Database Architect", "Video Store Assistant"];
    fashionItems = ["Flannel shirts", "Baggy jeans", "Combat boots", "Chokers", "Platform sneakers"];
    techItems = ["Dial-up Modems", "Floppy disks", "CD-ROM drives", "PlayStation 1", "Pagers"];
    habits = ["Buying CD singles", "Making mixtape cassettes", "Watching MTV", "Searching Yahoo!"];
    lifestyles = ["Cybercafes", "Coffee shops (Grunge era)", "Renting VHS movies", "Playing arcade fighting games"];
    popularArtists = ["Nirvana", "Tupac Shakur", "Spice Girls", "Radiohead", "Notorious B.I.G."];
    genres = [
      { name: "Grunge / Alt Rock", popularity: 90 },
      { name: "Hip-Hop / Rap", popularity: 95 },
      { name: "Eurodance", popularity: 75 },
      { name: "Britpop", popularity: 80 },
      { name: "R&B", popularity: 85 }
    ];
    defaultAlbums = [
      { title: "Nevermind", artist: "Nirvana", genre: "Grunge" },
      { title: "OK Computer", artist: "Radiohead", genre: "Alternative Rock" },
      { title: "All Eyez on Me", artist: "Tupac Shakur", genre: "Hip-Hop" }
    ];
    trends = ["Grunge and alternative guitar explosion", "East vs West Coast hip-hop rivalries", "CDs as the dominant media format"];
    tracks = [
      { title: "Smells Like Teen Spirit", artist: "Nirvana", description: "The grunge anthem that pushed hair-metal off charts." },
      { title: "California Love", artist: "Tupac Shakur", description: "A talkbox-laced West Coast hip-hop summer cruiser." }
    ];
    events = [
      { title: "Release of World Wide Web (1991)", category: "science", description: "CERN releases the WWW code into the public domain, igniting the internet age." },
      { title: "Collapse of Soviet Union (1991)", category: "politics", description: "USSR dissolves, ending the Cold War." }
    ];
  } else if (year >= 2000 && year < 2010) {
    jobs = ["SEO Specialist", "Flash Developer", "Broadband Technician", "Network Consultant"];
    fashionItems = ["Low-rise jeans", "Trucker hats", "Tracksuits", "Frosted tips", "Shutter shades"];
    techItems = ["iPods", "BlackBerry phones", "PlayStation 2 / Xbox 360", "Flat screen monitors"];
    habits = ["Burning custom CDs", "Downloading MP3s (Napster/LimeWire)", "Browsing MySpace"];
    lifestyles = ["Cyber chatting", "Blogging", "Texting T9 characters", "Renting DVDs by mail"];
    popularArtists = ["Eminem", "Kanye West", "Beyonce", "Coldplay", "Green Day"];
    genres = [
      { name: "Hip-Hop / Pop-Rap", popularity: 92 },
      { name: "Indie Rock", popularity: 85 },
      { name: "R&B / Pop", popularity: 90 },
      { name: "Emo / Pop-Punk", popularity: 80 },
      { name: "Dance-Pop", popularity: 75 }
    ];
    defaultAlbums = [
      { title: "The College Dropout", artist: "Kanye West", genre: "Hip-Hop" },
      { title: "Is This It", artist: "The Strokes", genre: "Indie Rock" },
      { title: "Stadia/Fever", artist: "Kylie Minogue", genre: "Dance-Pop" }
    ];
    trends = ["Digital music piracy & MP3s", "Indie rock revival", "Emo culture going mainstream", "iPod playlist culture"];
    tracks = [
      { title: "Lose Yourself", artist: "Eminem", description: "A dramatic, inspirational rap anthem driven by rock guitar riffs." },
      { title: "Seven Nation Army", artist: "The White Stripes", description: "An iconic, fuzz-pitch shifted guitar riff that became a stadium anthem." }
    ];
    events = [
      { title: "September 11 Attacks (2001)", category: "world", description: "Terrorist attacks on US targets lead to major geopolitical changes." },
      { title: "Launch of iPhone (2007)", category: "science", description: "Steve Jobs unveils Apple's smartphone, reshaping mobile technology." }
    ];
  } else {
    // 2010 to present
    jobs = ["App Developer", "Social Media Coordinator", "Cloud Architect", "AI Prompt Engineer"];
    fashionItems = ["Skinny jeans", "Sneaker culture", "Athleisure wear", "Crop tops", "Smartwatches"];
    techItems = ["Smartphones", "iPads", "Bluetooth earbuds", "Streaming sticks", "Smart home speakers"];
    habits = ["Streaming music (Spotify)", "Watching TikTok/Instagram reels", "Binge-watching shows"];
    lifestyles = ["Food delivery apps", "Ride sharing", "Remote working", "Social media scrolling"];
    popularArtists = ["Drake", "Taylor Swift", "Adelle", "The Weeknd", "Billie Eilish", "Kendrick Lamar"];
    genres = [
      { name: "Hip-Hop / Trap", popularity: 95 },
      { name: "Pop", popularity: 90 },
      { name: "EDM / Synthwave", popularity: 82 },
      { name: "Indie Folk", popularity: 70 },
      { name: "R&B / Neo-Soul", popularity: 78 }
    ];
    defaultAlbums = [
      { title: "To Pimp a Butterfly", artist: "Kendrick Lamar", genre: "Hip-Hop" },
      { title: "1989", artist: "Taylor Swift", genre: "Pop" },
      { title: "After Hours", artist: "The Weeknd", genre: "Synth-Pop / R&B" }
    ];
    trends = ["Streaming service playlist curation", "Trap beats dominating charts", "TikTok audio viral sensations", "Bedroom pop and DIY producing"];
    tracks = [
      { title: "Blinding Lights", artist: "The Weeknd", description: "An 80s-inspired synthwave pop hit that broke record charts." },
      { title: "Alright", artist: "Kendrick Lamar", description: "A jazz-laden hip-hop track that became a modern protest anthem." }
    ];
    events = [
      { title: "Curiosity Rover Lands on Mars (2012)", category: "science", description: "NASA's rover lands to explore the habitability of Mars." },
      { title: "Global COVID-19 Pandemic (2020)", category: "world", description: "Coronavirus spreads worldwide, causing lockdowns and remote work transitions." }
    ];
  }

  // Fallback narrative if not provided
  let narrative = wikiSummary;
  if (!narrative) {
    if (benchmarkSnapshots[year]?.narrative) {
      narrative = benchmarkSnapshots[year].narrative!;
    } else {
      narrative = `${year} was a year of rapid change. As the sound of ${genres[0]?.name || 'music'} echoed across stereo speakers and radios, society welcomed technological updates in ${techItems[0] || 'engineering'} and shifts in global ${events[0]?.category || 'politics'}. The air felt charged with standard vintage energy, paving the way for the future.`;
    }
  }

  // Construct EventItems list, pulling in specific year content if available
  const finalEvents = (benchmarkSnapshots[year]?.events as EventItem[]) || [
    ...events,
    { title: `Chronicles of ${year}`, category: "world", description: `Major historical archives detail this period as one of transition and development across cities, sciences, and international borders.` }
  ];

  // Merge music
  const baseMusic = benchmarkSnapshots[year]?.music as MusicSnapshot;
  const music: MusicSnapshot = baseMusic || {
    artists: popularArtists,
    albums: defaultAlbums,
    genres: genres,
    trends: trends,
    soundtrack: tracks
  };

  // Merge time capsule
  const baseCapsule = benchmarkSnapshots[year]?.capsule as TimeCapsule;
  const capsule: TimeCapsule = baseCapsule || {
    averageSalary: avgSalary,
    popularJobs: jobs,
    fashion: fashionItems,
    technology: techItems,
    musicHabits: habits,
    lifestyle: lifestyles
  };

  // Generate relationship nodes graph
  const nodes = [
    { id: 'year', label: String(year), type: 'event' as const },
    { id: 'genre-primary', label: music.genres[0]?.name || 'Primary Genre', type: 'genre' as const },
    { id: 'genre-secondary', label: music.genres[1]?.name || 'Secondary Genre', type: 'genre' as const },
    ...music.artists.slice(0, 3).map(artist => ({ id: `artist-${artist.replace(/\s+/g, '-')}`, label: artist, type: 'artist' as const })),
    ...finalEvents.slice(0, 2).map((ev, i) => ({ id: `event-${i}`, label: ev.title.slice(0, 20) + '...', type: 'event' as const }))
  ];

  const links = [
    { source: 'year', target: 'genre-primary', label: 'dominated by' },
    { source: 'year', target: 'genre-secondary', label: 'featured' },
    { source: `artist-${music.artists[0]?.replace(/\s+/g, '-')}`, target: 'genre-primary', label: 'plays' },
    { source: `artist-${music.artists[1]?.replace(/\s+/g, '-')}`, target: 'genre-primary', label: 'influenced by' },
    { source: `artist-${music.artists[2]?.replace(/\s+/g, '-')}`, target: 'genre-secondary', label: 'performs' },
    { source: 'event-0', target: 'year', label: 'happened in' },
    { source: 'event-1', target: 'year', label: 'occurred in' }
  ].filter(link => {
    // Filter out links pointing to non-existent node IDs
    const nodeIds = nodes.map(n => n.id);
    return nodeIds.includes(link.source) && nodeIds.includes(link.target);
  });

  const connections: GraphConnection = { nodes, links };

  return {
    year,
    narrative,
    events: finalEvents,
    music,
    capsule,
    connections
  };
}

export async function generateAIPortrait(year: number, wikiSummary: string): Promise<HistoricalSnapshot> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.log(`[GEMINI] No API key detected. Using procedural fallback for year ${year}.`);
    return generateProceduralSnapshot(year, wikiSummary);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a music historian and cultural researcher for the retro operating system 'Rewind'.
Generate a complete structured historical and musical snapshot for the year: ${year}.
The Wikipedia summary of that year is: "${wikiSummary}"

Return a JSON object that matches the following TypeScript structure:
{
  "narrative": "A highly engaging, cinematic paragraph explaining what life felt like in ${year}. Keep it punchy, nostalgic, and vivid.",
  "events": [
    { "title": "Main World Event", "category": "world", "description": "Short explanation" },
    { "title": "Scientific Discovery", "category": "science", "description": "Short explanation" },
    { "title": "Political Moment", "category": "politics", "description": "Short explanation" },
    { "title": "Pop Culture Milestone", "category": "pop-culture", "description": "Short explanation" }
  ],
  "music": {
    "artists": ["Top Artist 1", "Top Artist 2", "Top Artist 3", "Top Artist 4", "Top Artist 5"],
    "albums": [
      { "title": "Album 1", "artist": "Artist 1", "releaseDate": "YYYY-MM-DD", "genre": "Genre" },
      { "title": "Album 2", "artist": "Artist 2", "releaseDate": "YYYY-MM-DD", "genre": "Genre" },
      { "title": "Album 3", "artist": "Artist 3", "releaseDate": "YYYY-MM-DD", "genre": "Genre" },
      { "title": "Album 4", "artist": "Artist 4", "releaseDate": "YYYY-MM-DD", "genre": "Genre" }
    ],
    "genres": [
      { "name": "Genre 1", "popularity": 95 },
      { "name": "Genre 2", "popularity": 85 },
      { "name": "Genre 3", "popularity": 70 },
      { "name": "Genre 4", "popularity": 60 }
    ],
    "trends": [
      "Short musical trend 1",
      "Short musical trend 2",
      "Short musical trend 3"
    ],
    "soundtrack": [
      { "title": "Track 1", "artist": "Artist 1", "description": "Fun retro reason why this fits the soundtrack" },
      { "title": "Track 2", "artist": "Artist 2", "description": "Fun retro reason why this fits the soundtrack" },
      { "title": "Track 3", "artist": "Artist 3", "description": "Fun retro reason why this fits the soundtrack" }
    ]
  },
  "capsule": {
    "averageSalary": "$XX,XXX per year",
    "popularJobs": ["Job 1", "Job 2", "Job 3"],
    "fashion": ["Fashion trend 1", "Fashion trend 2", "Fashion trend 3"],
    "technology": ["Gadget 1", "Gadget 2", "Gadget 3"],
    "musicHabits": ["How they listened 1", "How they listened 2"],
    "lifestyle": ["What they did for fun 1", "What they did for fun 2"]
  }
}

Strictly return ONLY the raw JSON content inside a JSON block. Make sure the JSON is valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const contentText = response.text;
    if (!contentText) {
      throw new Error("Empty response from Gemini API");
    }

    const cleanedText = contentText.trim();
    const data = JSON.parse(cleanedText);

    // Build the connections graph nodes and links from generated content
    const eventsList: EventItem[] = data.events || [];
    const musicSnapshot: MusicSnapshot = data.music || { artists: [], albums: [], genres: [], trends: [], soundtrack: [] };
    const capsule: TimeCapsule = data.capsule || { averageSalary: '', popularJobs: [], fashion: [], technology: [], musicHabits: [], lifestyle: [] };

    const nodes = [
      { id: 'year', label: String(year), type: 'event' as const },
      { id: 'genre-primary', label: musicSnapshot.genres[0]?.name || 'Primary Genre', type: 'genre' as const },
      { id: 'genre-secondary', label: musicSnapshot.genres[1]?.name || 'Secondary Genre', type: 'genre' as const },
      ...musicSnapshot.artists.slice(0, 3).map(artist => ({ id: `artist-${artist.replace(/\s+/g, '-')}`, label: artist, type: 'artist' as const })),
      ...eventsList.slice(0, 2).map((ev, i) => ({ id: `event-${i}`, label: ev.title.slice(0, 20) + '...', type: 'event' as const }))
    ];

    const links = [
      { source: 'year', target: 'genre-primary', label: 'dominated by' },
      { source: 'year', target: 'genre-secondary', label: 'featured' },
      { source: `artist-${musicSnapshot.artists[0]?.replace(/\s+/g, '-')}`, target: 'genre-primary', label: 'plays' },
      { source: `artist-${musicSnapshot.artists[1]?.replace(/\s+/g, '-')}`, target: 'genre-primary', label: 'influenced by' },
      { source: `artist-${musicSnapshot.artists[2]?.replace(/\s+/g, '-')}`, target: 'genre-secondary', label: 'performs' },
      { source: 'event-0', target: 'year', label: 'happened in' },
      { source: 'event-1', target: 'year', label: 'occurred in' }
    ].filter(link => {
      const nodeIds = nodes.map(n => n.id);
      return nodeIds.includes(link.source) && nodeIds.includes(link.target);
    });

    const connections: GraphConnection = { nodes, links };

    return {
      year,
      narrative: data.narrative || `${year} was an incredible year.`,
      events: eventsList,
      music: musicSnapshot,
      capsule: capsule,
      connections: connections
    };
  } catch (err) {
    console.error(`Error calling Gemini API for year ${year}:`, err);
    // Fallback to procedural snapshot on failure
    return generateProceduralSnapshot(year, wikiSummary);
  }
}

export async function generateAIComparison(yearA: number, yearB: number, snapA: HistoricalSnapshot, snapB: HistoricalSnapshot): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return `Comparing ${yearA} and ${yearB} shows a massive cultural shift. In ${yearA}, the world was dominated by ${snapA.music.genres[0]?.name || 'its genres'} and technological hallmarks like ${snapA.capsule.technology[0] || 'its gadgets'}. By ${yearB}, society evolved, transitioning to ${snapB.music.genres[0]?.name || 'new styles'} and new-age tech like ${snapB.capsule.technology[0] || 'updated gadgets'}. This represents a evolution of ${Math.abs(yearA - yearB)} years in music and cultural habits.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a music and culture historian comparing two years in the 'Rewind' operating system.
Year A: ${yearA} (genres: ${snapA.music.genres.map(g => g.name).join(', ')}, tech: ${snapA.capsule.technology.join(', ')})
Year B: ${yearB} (genres: ${snapB.music.genres.map(g => g.name).join(', ')}, tech: ${snapB.capsule.technology.join(', ')})

Write a compelling, nostalgic, and detailed paragraph comparing the two years. Focus on how music evolved, how cultural lifestyle habits shifted, and how technology transformed. Keep it under 150 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text?.trim() || 'A fascinating transition in human history and music.';
  } catch (err) {
    console.error('Error calling Gemini for comparison:', err);
    return `Comparing ${yearA} and ${yearB} shows a massive cultural shift. In ${yearA}, the world was dominated by ${snapA.music.genres[0]?.name || 'its genres'} and technological hallmarks like ${snapA.capsule.technology[0] || 'its gadgets'}. By ${yearB}, society evolved, transitioning to ${snapB.music.genres[0]?.name || 'new styles'} and new-age tech like ${snapB.capsule.technology[0] || 'updated gadgets'}.`;
  }
}

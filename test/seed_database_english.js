var request = require("request-promise");
var fs = require("fs");
const host = "https://elearn-courses-backend.herokuapp.com";
const userNames = [
  "Aaran",
  "Aaren",
  "Aarez",
  "Aarman",
  "Aaron",
  "Aaron-James",
  "Aarron",
  "Aaryan",
  "Aaryn",
  "Aayan",
  "Aazaan",
  "Abaan",
  "Abbas",
  "Abdallah",
  "Abdalroof",
  "Abdihakim",
  "Abdirahman",
  "Abdisalam",
  "Abdul",
  "Abdul-Aziz",
  "Abdulbasir",
  "Arihant",
  "Aristomenis",
  "Aristotelis",
  "Arjuna",
  "Arlo",
  "Armaan",
  "Arman",
  "Armen",
  "Arnab",
  "Arnav",
  "Arnold",
  "Aron",
  "Aronas",
  "Arran",
  "Arrham",
  "Arron",
  "Arryn",
  "Arsalan",
  "Artem",
  "Arthur",
  "Artur",
  "Arturo",
  "Arun",
  "Arunas",
  "Arved",
  "Arya",
  "Aryan",
  "Aryankhan",
  "Aryian",
  "Aryn",
  "Asa",
  "Asfhan",
  "Ash",
  "Ashlee-jay",
  "Ashley",
  "Ashton",
  "Ashton-Lloyd",
  "Ashtyn",
  "Ashwin",
  "Asif",
  "Asim",
  "Aslam",
  "Asrar",
  "Ata",
  "Atal",
  "Atapattu",
  "Ateeq",
  "Athol",
  "Athon",
  "Athos-Carlos",
  "Atli",
  "Atom",
  "Attila",
  "Aulay",
  "Aun",
  "Austen",
  "Austin",
  "Avani",
  "Averon",
  "Avi",
  "Avinash",
  "Avraham",
  "Awais",
  "Awwal",
  "Axel",
  "Ayaan",
  "Ayan",
  "Aydan",
  "Ayden",
  "Aydin",
  "Aydon",
  "Ayman",
  "Ayomide",
  "Ayren",
  "Ayrton",
  "Aytug",
  "Ayub",
  "Ayyub",
  "Azaan",
  "Azedine",
  "Azeem",
  "Azim",
  "Aziz",
  "Azlan",
  "Azzam",
  "Azzedine",
  "Babatunmise",
  "Babur",
  "Bader",
  "Badr",
  "Badsha",
  "Bailee",
  "Bailey",
  "Bailie",
  "Bailley",
  "Baillie",
  "Baley",
  "Balian",
  "Banan",
  "Barath",
  "Barkley",
  "Barney",
  "Baron",
  "Barrie",
  "Barry",
  "Bartlomiej",
  "Bartosz",
  "Basher",
  "Basile",
  "Baxter",
  "Baye",
  "Bayley",
  "Beau",
  "Beinn",
  "Bekim",
  "Believe",
  "Ben",
  "Bendeguz",
  "Benedict",
  "Benjamin",
  "Benjamyn",
  "Benji",
  "Benn",
  "Bennett",
  "Benny",
  "Benoit",
  "Bentley",
  "Berkay",
  "Bernard",
  "Bertie",
  "Bevin",
  "Bezalel",
  "Bhaaldeen",
  "Bharath",
  "Bilal",
  "Bill",
  "Billy",
  "Binod",
  "Bjorn",
  "Blaike",
  "Blaine",
  "Blair",
  "Blaire",
  "Blake",
  "Blazej",
  "Blazey",
  "Blessing",
  "Blue",
  "Blyth",
  "Bo",
  "Boab",
  "Bob",
  "Bobby",
  "Bobby-Lee",
  "Bodhan",
  "Boedyn",
  "Bogdan",
  "Bohbi",
  "Bony",
  "Bowen",
  "Bowie",
  "Boyd",
  "Bracken",
  "Brad",
  "Bradan",
  "Braden",
  "Bradley",
  "Bradlie",
  "Bradly",
  "Brady",
  "Bradyn",
  "Braeden",
  "Braiden",
  "Brajan",
  "Brandan",
  "Branden",
  "Brandon",
  "Brandonlee",
  "Brandon-Lee",
  "Brandyn",
  "Brannan",
  "Brayden",
  "Braydon",
  "Braydyn",
  "Breandan",
  "Brehme",
  "Brendan",
  "Brendon",
  "Brendyn",
  "Breogan",
  "Bret",
  "Brett",
  "Briaddon",
  "Brian",
  "Brodi",
  "Brodie",
  "Brody",
  "Brogan",
  "Broghan",
  "Brooke",
  "Brooklin",
  "Brooklyn",
  "Bruce",
  "Bruin",
  "Bruno",
  "Brunon",
  "Bryan",
  "Bryce",
  "Bryden",
  "Brydon",
  "Brydon-Craig",
  "Bryn",
  "Brynmor",
  "Bryson",
  "Buddy",
  "Bully",
  "Burak",
  "Burhan",
  "Butali",
  "Butchi",
  "Byron",
  "Cabhan",
  "Cadan",
  "Cade",
  "Caden",
  "Cadon",
  "Cadyn",
  "Caedan",
  "Caedyn",
  "Cael",
  "Caelan",
  "Caelen",
  "Caethan",
  "Cahl",
  "Cahlum",
  "Cai",
  "Caidan",
  "Caiden",
  "Caiden-Paul",
  "Caidyn",
  "Caie",
  "Cailaen",
  "Cailean",
  "Caileb-John",
  "Cailin",
  "Cain",
  "Caine",
  "Cairn",
  "Cal",
  "Calan",
  "Calder",
  "Cale",
  "Calean",
  "Caleb",
  "Calen",
  "Caley",
  "Calib",
  "Calin",
  "Callahan",
  "Callan",
  "Callan-Adam",
  "Calley",
  "Callie",
  "Callin",
  "Callum",
  "Callun",
  "Callyn",
  "Calum",
  "Calum-James",
  "Calvin",
  "Cambell",
  "Camerin",
  "Cameron",
  "Campbel",
  "Campbell",
  "Camron",
  "Caolain",
  "Caolan",
  "Carl",
  "Carlo",
  "Carlos",
  "Carrich",
  "Carrick",
  "Carson",
  "Carter",
  "Carwyn",
  "Casey",
  "Casper",
  "Cassy",
  "Cathal",
  "Cator",
  "Cavan",
  "Cayden",
  "Cayden-Robert",
  "Cayden-Tiamo",
  "Ceejay",
  "Ceilan",
  "Ceiran",
  "Ceirin",
  "Ceiron",
  "Cejay",
  "Celik",
  "Cephas",
  "Cesar",
  "Cesare",
  "Chad",
  "Chaitanya",
  "Chang-Ha",
  "Charles",
  "Charley",
  "Charlie",
  "Charly",
  "Chase",
  "Che",
  "Chester",
  "Chevy",
  "Chi",
  "Chibudom",
  "Chidera",
  "Chimsom",
  "Chin",
  "Chintu",
  "Chiqal",
  "Chiron",
  "Chris",
  "Chris-Daniel",
  "Chrismedi",
  "Christian",
  "Christie",
  "Christoph",
  "Christopher",
  "Christopher-Lee",
  "Christy",
  "Chu",
  "Chukwuemeka",
  "Cian",
  "Ciann",
  "Ciar",
  "Ciaran",
  "Ciarian",
];
const randomSentences = [
  "The external scars tell only part of the story.",
  "Red is greener than purple, for sure.",
  "The secret ingredient to his wonderful life was crime.",
  "He created a pig burger out of beef.",
  "The fog was so dense even a laser decided it wasn't worth the effort.",
  "Smoky the Bear secretly started the fires.",
  "The Tsunami wave crashed against the raised houses and broke the pilings as if they were toothpicks.",
  "She was disgusted he couldn’t tell the difference between lemonade and limeade.",
  "Mothers spend months of their lives waiting on their children.",
  "I purchased a baby clown from the Russian terrorist black market.",
  "Flying fish few by the space station.",
  "Don't step on the broken glass.",
  "She moved forward only because she trusted that the ending she now was going through must be followed by a new beginning.",
  "She wore green lipstick like a fashion icon.",
  "His ultimate dream fantasy consisted of being content and sleeping eight hours in a row.",
  "The thick foliage and intertwined vines made the hike nearly impossible.",
  "The tattered work gloves speak of the many hours of hard labor he endured throughout his life.",
  "In hopes of finding out the truth, he entered the one-room library.",
  "Love is not like pizza.",
  "While on the first date he accidentally hit his head on the beam.",
  "She could hear him in the shower singing with a joy she hoped he'd retain after she delivered the news.",
  "He wondered why at 18 he was old enough to go to war, but not old enough to buy cigarettes.",
  "When I cook spaghetti, I like to boil it a few minutes past al dente so the noodles are super slippery.",
  "As the years pass by, we all know owners look more and more like their dogs.",
  "She hadn't had her cup of coffee, and that made things all the worse.",
  "The gruff old man sat in the back of the bait shop grumbling to himself as he scooped out a handful of worms.",
  "She was sad to hear that fireflies are facing extinction due to artificial light, habitat loss, and pesticides.",
  "Andy loved to sleep on a bed of nails.",
  "The hummingbird's wings blurred while it eagerly sipped the sugar water from the feeder.",
  "He wore the surgical mask in public not to keep from catching a virus, but to keep people away from him.",
  "The secret code they created made no sense, even to them.",
  "Lucifer was surprised at the amount of life at Death Valley.",
  "The lyrics of the song sounded like fingernails on a chalkboard.",
  "I'm a great listener, really good with empathy vs sympathy and all that, but I hate people.",
  "Patricia loves the sound of nails strongly pressed against the chalkboard.",
  "Most shark attacks occur about 10 feet from the beach since that's where the people are.",
  "She thought there'd be sufficient time if she hid her watch.",
  "Sixty-Four comes asking for bread.",
  "He played the game as if his life depended on it and the truth was that it did.",
  "The bullet pierced the window shattering it before missing Danny's head by mere millimeters.",
  "The trick to getting kids to eat anything is to put catchup on it.",
  "You bite up because of your lower jaw.",
  "He realized there had been several deaths on this road, but his concern rose when he saw the exact number.",
  "He didn't heed the warning and it had turned out surprisingly well.",
  "Mary plays the piano.",
  "He found the end of the rainbow and was surprised at what he found there.",
  "A dead duck doesn't fly backward.",
  "Your girlfriend bought your favorite cookie crisp cereal but forgot to get milk.",
  "Iron pyrite is the most foolish of all minerals.",
  "Dan ate the clouds like cotton candy.",
];
let randomwords = [
  "tent",
  "replace",
  "callous",
  "discover",
  "far",
  "sea",
  "belligerent",
  "deranged",
  "unwritten",
  "bounce",
  "powerful",
  "rings",
  "month",
  "cause",
  "tail",
  "trite",
  "cap",
  "numberless",
  "panoramic",
  "mint",
  "swanky",
  "protective",
  "lamentable",
  "motionless",
  "embarrassed",
  "rotten",
  "lazy",
  "fang",
  "adaptable",
  "fairies",
  "obtainable",
  "cautious",
  "general",
  "even",
  "ocean",
  "calendar",
  "beds",
  "grain",
  "distance",
  "market",
  "fork",
  "rule",
  "accept",
  "porter",
  "agonizing",
  "report",
  "flaky",
  "muscle",
  "program",
  "workable",
  "exultant",
  "decorate",
  "call",
  "supply",
  "afraid",
  "experience",
  "nauseating",
  "boorish",
  "remove",
  "long",
];

const validEmailNames = [
  "Arran",
  "Arrham",
  "Arron",
  "Arryn",
  "Arsalan",
  "Artem",
  "Arthur",
  "Artur",
  "Arturo",
  "Arun",
  "Arunas",
  "Arved",
  "Arya",
  "Aryan",
  "Aryankhan",
  "Aryian",
  "Aryn",
  "Asa",
  "Asfhan",
  "Ash",
  "Ashlee-jay",
  "Ashley",
  "Ashton",
  "Ashton-Lloyd",
  "Ashtyn",
  "Ashwin",
  "Asif",
  "Asim",
  "Aslam",
  "Asrar",
  "Ata",
  "Atal",
  "Atapattu",
  "Ateeq",
  "Athol",
  "Athon",
  "Athos-Carlos",
  "Atli",
  "Atom",
  "Attila",
  "Aulay",
  "Aun",
  "Austen",
  "Austin",
  "Avani",
  "Averon",
  "Avi",
  "Avinash",
  "Avraham",
  "Awais",
];
function getName() {
  let name = userNames[Math.floor(Math.random() * userNames.length)];
  return name;
}
function getEmailName() {
  let name =
    validEmailNames[Math.floor(Math.random() * validEmailNames.length)];
  return name;
}
function phoneGenerator() {
  let phone = "";
  for (let i = 0; i < 11; i++) {
    phone += String(Math.floor(Math.random() * 9));
  }
  return phone;
}
function generateEmail(firstName, lasName) {
  let email = `${firstName}_${lasName}_${Math.floor(
    Math.random() * 10000
  )}@gmail.com`;
  return email;
}

function getType() {
  let type = Math.random() > 0.5 ? "teacher" : "student";
  return type;
}

function generateAge() {
  return Math.floor(0 * Math.random());
}

function getGender() {
  let gender = Math.random() > 0.5 ? 1 : 2;
  return gender;
}
function getLanguage() {
  let indx = Math.random() > 0.5 ? 0 : 1;
  return "English";
}
function getRandomSentence() {
  let name =
    randomSentences[Math.floor(Math.random() * randomSentences.length)];
  return name;
}
function getRandomWord() {
  let name = randomwords[Math.floor(Math.random() * randomwords.length)];
  return name;
}
let number = 1;
function getComponent() {
  let type = ["Video", "Test", "Assignment"][Math.floor(Math.random() * 3)];
  if (type == "Video") {
    let obj = {
      number: number,
      videoID: "https://player.vimeo.com/video/48815306",
      type: "Video",
      name: "video " + getRandomWord(),
      File: null,
    };
    number++;
    return obj;
  } else if (type == "Test") {
    let obj = {
      passingGrade: 1,
      number: number,
      type: "Test",
      test: [],
      name: "test " + getRandomWord(),
    };
    for (let i = 0; i < Math.floor(Math.random() * 6) + 2; i++) {
      if (Math.random() < 0.35) {
        obj.test.push({
          Q: "true or false",
          A: ["True", "False"],
          type: "TorF",
          correctAnswer: Math.round(Math.random()),
        });
      } else if (Math.random() < 0.8) {
        let a = [];
        for (let j = 0; j < Math.round(Math.random() * 4) + 3; j++) {
          a.push(getRandomSentence());
        }
        // console.log(a);
        obj.test.push({
          Q: "Choose the Best out of the below answers.",
          A: a,
          type: "MCQ",
          correctAnswer: Math.floor(Math.random() * a.length),
        });
      } else {
        obj.test.push({
          Q: "this is essay",
          A: [],
          type: "Essay",
          correctAnswer: -1,
        });
      }
    }
    number++;
    return obj;
  } else {
    let obj = {
      passingGrade: Math.round(Math.random() * 100),
      number: number,
      name: "Assignment " + getRandomWord(),
      type: "Assignment",
    };
    number++;
    return obj;
  }
}

function getQuestionForum() {
  let obj = {
    text: getRandomSentence(),
    title: getRandomSentence(),
    tags: "",
  };
  for (let i = 0; i < 5; i++) obj.tags += getRandomWord() + ",";
  return obj;
}
let coursesIds = [];
let studentsTokens = [];
let urlNum = 1;
async function main() {
  for (let num = 0; num < 15; num++) {
    try {
      let firstName = getName();
      let lastName = getName();
      let email = generateEmail(getEmailName(), getEmailName());
      let phone = phoneGenerator();
      let age = generateAge();
      let type = getType();
      let gender = getGender();
      var options = {
        method: "POST",
        url: host + "/api/signup",
        headers: {},
        formData: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          type: type,
          password: "123",
          gender: gender,
          age: age,
        },
      };
      const token = await request(options);

      // enroll user in some random courses
      for (let userToken of studentsTokens) {
        for (let courseId of coursesIds) {
          if (true) {
            var options = {
              method: "POST",
              url: host + "/api/course/enroll?courseId=" + courseId,
              headers: {
                "x-auth-token": userToken,
              },
            };
            await request(options);
            for (let i = 0; i < 4; i++) {
              // post question and replies
              let q = getQuestionForum();
              q.courseId = courseId;
              options = {
                method: "POST",
                url: host + "/api/forum/question",
                headers: {
                  "x-auth-token": userToken,
                  "Content-Type": "application/json",
                },

                body: JSON.stringify(q),
              };
              let question = await request(options);
              question = JSON.parse(question);
              //console.log(question);
              for (let j = 0; j < 5; j++) {
                var options = {
                  method: "POST",
                  url: host + "/api/forum/question/reply",
                  headers: {
                    "x-auth-token": userToken,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    text: getRandomSentence(),
                    questionId: question.id,
                  }),
                };
                let reply = await request(options);
                reply = JSON.parse(reply);
                for (let k = 0; k < 5; k++) {
                  var options = {
                    method: "POST",
                    url: host + "/api/forum/question/reply/comment",
                    headers: {
                      "x-auth-token": userToken,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      text: getRandomSentence(),
                      replyId: reply.id,
                    }),
                  };
                  await request(options);
                }
              }
            }
          }
        }
      }
      if (type == "student") {
        studentsTokens.push(token);
      } else {
        number = 1;
        // create course by teacher
        let gender = 3;
        let language = getLanguage();
        let ageMin = generateAge();
        let age = [ageMin, ageMin + 70];
        let name = "Course " + getRandomSentence();
        let summary = getRandomSentence();
        let description = getRandomSentence();
        let prequisite = [];
        for (let id of coursesIds) {
          if (Math.random() > 0.5) prequisite.push(id);
        }
        let private = Math.random() > 0.5 ? true : false;
        let url = null;
        if (private) {
          url = `url${urlNum}`;
          urlNum++;
        }
        let date = Date.now();
        let sections = [];
        let start = 1;
        for (let i = 0; i < Math.round(Math.random() * 10) + 1; i++) {
          let numOfComp = Math.round(Math.random() * 10) + 1;
          let section = {
            name: "section " + getRandomWord(),
            start: start,
            end: start + numOfComp - 1,
            components: [],
          };
          for (let j = 0; j < numOfComp; j++) {
            section.components.push(getComponent());
          }
          start += numOfComp;
          sections.push(section);
        }

        let courseObj = {
          gender: gender,
          private: private,
          url: url,
          age: age,
          name: name,
          summary: summary,
          description: description,

          prerequisites: prequisite,
          language: language,
          date: date,

          sections: sections,
        };

        var options = {
          method: "POST",
          url: host + "/api/course/create",
          headers: {
            "x-auth-token": token,
          },
          formData: {
            json: JSON.stringify(courseObj),
          },
        };
        //console.log(courseObj);
        let res = await request(options);
        res = JSON.parse(res);
        coursesIds.push(res.id);
      }
    } catch (ex) {
      continue;
    }
  }
}
main();

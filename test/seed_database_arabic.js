var request = require("request-promise");
var fs = require("fs");
const host = "https://elearn-courses-backend.herokuapp.com";
const userNames = [
  "أبي",
  "أحمد",
  "أحنف",
  "أزهر",
  "أسامة",
  "أسد",
  "أسمر",
  "أشرف",
  "أكرم",
  "الأخضر",
  "المثنى",
  "النعمان",
  "الوليد",
  "إمام",
  "آمر",
  "أمية",
  "أمين",
  "أنصاري",
  "أنور",
  "أوس",
  "إياد",
  "إيثار",
  "أيسر",
  "أيمن",
  "إيناس",
  "إيهاب",
  "بادي",
  "باسل",
  "باشر",
  "باهر",
  "بجاد",
  "بدر",
  "بدري",
  "بدوي",
  "براء",
  "براق",
  "براك",
  "برعم",
  "برهان",
  "برهوم",
  "برئ",
  "بسام",
  "بسطام",
  "بسيم",
  "بشامة",
  "بشير",
  "بطل",
  "بكر",
  "بكري",
  "بلال",
  "بلبل",
  "بنداري",
  "بندر",
  "بهاء",
  "تامر",
  "تركي",
  "تمام",
  "تيجاني",
  "تيسير",
  "ثنيان",
  "ثواب",
  "جاسر",
  "جاسم",
  "جاهد",
  "جبير",
  "جحا",
  "جعيفر",
  "جعيل",
  "جلال",
  "جليل",
  "جمال",
  "جمعة",
  "جندل",
  "جواد",
  "جوهري",
  "حاتم",
  "حبشي",
  "حبيب",
  "حجاج",
  "حجازي",
  "حجي",
  "حداد",
  "حذيفه",
  "حسام",
  "حسان",
  "حسنين",
  "حسون",
  "حسيب",
  "حسين",
  "حفيظ",
  "حلمي",
  "حماد",
  "حمادة",
  "حمدان",
  "حمدي",
  "حمزة",
  "حمود",
  "حمودة",
  "حميدو",
  "حنبل",
  "حنظلة",
  "حنفي",
  "حيدر",
  "حيدرة",
  "خازم",
  "خالد",
  "خطاب",
  "خلدون",
  "خميس",
  "خويلد",
  "خيري",
  "داوود",
  "دريد",
  "رابح",
  "راشد",
  "ربيع",
  "رجاء",
  "رسول",
  "رشدي",
  "رضا",
  "رضوان",
  "رمضان",
  "رياض",
  "زاهد",
  "زايد",
  "زهران",
  "زياد",
  "ساري",
  "سالم",
  "سامر",
  "سامي",
  "سرحان",
  "سعد",
  "سلطان",
  "سمير",
  "سهيل",
  "شادي",
  "شكيب",
  "شهاب",
  "صابر",
  "صفوان",
  "صلاح",
  "صياح",
  "ضاحي",
  "ضرغام",
  "طارق",
  "طلال",
  "طه",
  "عادل",
  "عامر",
  "عايد",
  "عبد الإله",
  "عبد الحميد",
  "عبد الرحمن",
  "عبد الله",
  "عبد المعين",
  "عبيدة",
  "عثمان",
  "عدنان",
  "عروة",
  "عزيز",
  "علاء",
  "علي",
  "عمار",
  "غازي",
  "غسان",
  "غياث",
  "فادي",
  "فاروق",
  "فراس",
  "فهد",
  "فواز",
  "قتادة",
  "قتيبة",
  "قحطان",
  "قصي",
  "قيس",
  "كايد",
  "كمال",
  "كنعان",
  "لقمان",
  "لؤي",
  "ليث",
  "ماجد",
  "مازن",
  "مأمون",
  "محمد",
  "محمد نور",
  "مرهف",
  "مسعود",
  "مشاري",
  "مشعل",
  "مصطفى",
  "مصعب",
  "مطلق",
  "معاذ",
  "معاوية",
  "معتصم",
  "معز",
  "ممدوح",
  "مناف",
  "مهند",
  "مؤيد",
  "ناصر",
  "نايف",
  "نديم",
  "نذير",
  "نزار",
  "نعمان",
  "نواف",
  "نوفل",
  "هاني",
  "هزاع",
  "هشام",
  "هلال",
  "هواش",
  "هيثم",
  "وائل",
  "وسام",
  "وضاح",
  "وليد",
  "ياسر",
  "يامن",
];
const randomSentences = [
  "٤ قصيدة عبد الرحيم أحمد الصغير عن اللغة العربية",
  "من أغرب المُدْهِشَات أن تنبت تلك اللغة القومية وتصل إلى درجة الكمال وسط الصحارى عند أمة من الرُّحل، تلك اللغة التي فاقت أخواتها بكثرة مفرداتها ودقة معانيها، وحسب نظام مبانيها، ولم يُعْرَف لها في كل أطوار حياتها طفولة ولا شيخوخة، ولا نكاد نعلم من شأنها إلا فتوحاتها وانتصاراتها التي لا تُبَارى، ولا نعرف شبيهاً بهذه اللغة التي ظهرت للباحثين كاملة من غير تدرج وبقيت حافظة لكيانها من كل شائبة.",
  "وإذا استثنينا الصين فلا يوجد شعب آخر يحق له الفخر بوفرة كتب علوم لغته غير العرب.",
  "بلغت العربية بفضل القرآن من الاتساع مدىً لا تكاد تعرفه أي لغة أخرى من لغات الدنيا.",
  "العبارة العربية كالعود، إذا نقرت على أحد أوتاره رنت لديك جميع الأوتار وخفقت، ثم تُحَرَّك اللغة في أعماق النفس من وراء حدود المعنى المباشر مَوْكباً من العواطف والصور.",
  "اللغة العربية هي التي أدخلت في الغرب طريقة التعبير العلمي، والعربية من أنقى اللغات، فقد تفردت في طرق التعبير العلمي والفني.",
  "اللغة العربية خير اللغات والألسنة والإقبال على تفهمها من الديانة، ولو لم يكن للإحاطة بخصائصها والوقوف على مجاريها وتصاريفها والتبحّر في جلائلها وصغائرها إلا قوة اليقين في معرفة الإعجاز القرآني، وزيادة البصيرة في اثبات النبوة الذي هو عمدة الأمر كله لكفى بهما فضلاً يحسن أثره ويطيب في الدارين ثمره.",
  "إنّ اللغة العربية نشعر وكأن لا يوجد لها عمراً محدداً، فلا يوجد لها بداية ولا يوجد لها نهاية في حياتنا.",
  "اللغة العربية من أغنى وأرقى لغات العالم، فإنها تحتوي على شعر، رثاء، غزل، أدب، علوم.",
  "إن الرجل الذي يمتلك اللغة العربية ولا يستطيع أن يتقنها، فهو رجل رجولته ناقصة قبل أن تكون ثقافته ناقصة.",
  "كيف لنا أن لا نحب اللغة العربية، فالقرآن مكتوب باللغة العربية، والأنبياء يتحدثون باللغة العربية، والملائكة وأهل الجنة ينطقون العربية أيضاً.",
  "مستودع شعوري هائل يحمل خصائص الأمة وتصوراتها وعقيدتها وتاريخها، ويبقى تعلم اللغات الأخرى حاسة إضافية ضرورية للمسلم المعاصر، مع الحذر أن تلغي حواسه الأصلية أو تكون بديلاً عنها.",
  "سعة هذه اللغة في أسمائها، وأفعالها، وحروفها، وجولاتها في الاشتقاق، ومأخوذاتها البديعية في استعاراتها وغرائب تصرفاتها في انتصاراتها ولفظ كنايتها.",
  "إذا جن ليلي هام قلبي بذكركم أنوح كما ناح الحمام المطوق.",
  "إن الذي ملأ اللغات محاسن جعل الجمال وسره في الضاد.",
  "تعلموا العربية، فإنها تثبت العقل، وتزيد في المروءة.",
  "فاللغة بها جاءت شريعتنا فإذا بطلت اللغة بطلت الشرعية والأحكام، والإعراب أيضاً به تصلح المعاني وتفهم فإذا بطل الإعراب بطلت المعاني، وإذا بطلت المعاني بطل الشرع أيضاً وما يبدو عليه أمر المعاملات كلها من المخاطبات والأقوال.",
  "ليست العربية لأحدكم من أب ولا أم، وإنما هي من اللسان فمن تكلم بالعربية فهو عربي.",
  "من أحب الله تعالى أحب رسوله محمداً صلى الله عليه وسلم أحب العرب، ومن أحب العرب أحب العربية التي نزل بها أفضل الكتب على أفضل العرب والعجم، ومن أحب العربية عني بها وثابر عليها، وصرف همته إليها.",
  "وسعت كاتب الله لفظاً وغاية، وما ضقت من أي به وعظات فكيف أضيف اليوم عن وصف آلة وتنسيق أسماء لمخترعات أنا البحر في أحشائه الدر كامن فهل سألوا الغواص عن صدفاتي.",
  "واللسان العربي شعار الإسلام وأهله، واللغات من أعظم شعائر الأمم التي مر بها يتميزن.",
  "اللغة العربية لا تضيق بالتكرار، بخلاف لغات أخرى يتحول فيها التكرار بتلقائية محتومة إلى سخف مضحك.",
  "إن للعربية ليناً ومرونةً يمكنانها من التكيف وفقاً لمقتضيات العصر.",
  "إنما القرآن جنسية لغوية تجمع أطراف النسبة إلى العربية، فلا يزال أهله مستعربين به، متميزين بهذه الجنسية حقيقةً أو حكماً.",
  "معلومٌ أن تعلُّمَ العربية وتعليم العربية فرضٌ على الكفاية، وإن اللسان العربي شعار الإسلام وأهله، واللغات من أعظم شعائر الأمم التي بها يتميزون، وإن اللغة العربية من الدين ومعرفتها فرضٌ واجبٌ فإنّ فهم الكتاب والسنة فرضٌ ولا يُفهمُ إلا باللغة العربية، وما لا يتمُّ الواجب إلا به فهو واجب.",
  "ما جَهلَ الناسُ، ولا اختلفوا إلا لتركهم لسان العرب، وميلهم إلى لسان أرسطو طاليس وقال أيضاً: لا يعلم من إيضاح جمل عِلْمِ الكتاب أحدُ، جَهِلَ سعة لسان العرب، وكثرة وجوهه، وجماع معانيه وتفوقها ومن عَلِمَها، انتفت عنه الشُّبَه التي دخلت على جهل لسانها.",
  "كيف يستطيع الإنسان أن يُقاوم جمال هذه اللغة ومنطقها السليم، وسحرها الفريد فجيران العرب أنفسهم في البلدان التي فتحوها سقطوا صَرْعَى سحر تلك اللغة.",
  "التفاف الحبل السري حول رقبة الجنين - فيديو",
];
let randomwords = [
  "آباء",
  "آباءكم",
  "آباءنا",
  "آباءهم",
  "آباؤكم",
  "آباؤنا",
  "آباؤهم",
  "آبائك",
  "آبائكم",
  "آبائنا",
  "آبائهم",
  "آبائهن",
  "آبائي",
  "آتاك",
  "آتاكم",
  "آتانا",
  "آتاني",
  "آتاه",
  "آتاها",
  "آتاهم",
  "آتاهما",
  "آتت",
  "آتنا",
  "آتهم",
  "آتوا",
  "آتوني",
  "آتوه",
  "آتي",
  "آتية",
  "آتيت",
  "آتيتك",
  "آتيتكم",
  "آتيتم",
  "آتيتموهن",
  "آتيتنا",
  "آتيتني",
  "آتيتهن",
  "آتيك",
  "آتيكم",
  "آتينا",
  "آتيناك",
  "آتيناكم",
  "آتيناه",
  "آتيناها",
  "آتيناهم",
  "آتيه",
  "آتيهم",
  "آثار",
  "آثارهم",
  "آثارهما",
  "آثرك",
  "آثم",
  "آثما",
  "آخذ",
  "آخذين",
  "آخر",
  "آخران",
  "آخره",
  "آخرون",
  "آخرين",
  "آدم",
  "آذان",
  "آذاننا",
  "آذانهم",
  "آذن",
  "آذناك",
  "آذنتكم",
  "آذوا",
  "آذيتمونا",
  "آزر",
  "آسفونا",
  "آسن",
  "آسى",
  "آل",
  "آلآن",
  "آلاء",
  "آلاف",
  "آلذكرين",
  "آلله",
  "آلهة",
  "آلهتكم",
  "آلهتنا",
  "آلهتهم",
  "آلهتي",
  "آمره",
  "آمن",
  "آمنا",
  "آمنة",
  "آمنت",
  "آمنتم",
  "آمنكم",
  "آمنوا",
  "آمنون",
  "آمنين",
  "آمين",
  "آن",
  "آناء",
  "آنس",
  "آنست",
  "آنستم",
  "آنفا",
  "آنية",
  "آووا",
  "آوى",
  "آوي",
  "آيات",
  "آياتك",
  "آياتنا",
  "آياته",
  "آياتها",
  "آياتي",
  "آية",
  "آيتك",
  "آيتين",
  "أآلهتنا",
  "أأتخذ",
  "أأرباب",
  "أأسجد",
  "أأسلمتم",
  "أأشفقتم",
  "أأشكر",
  "أأعجمي",
  "أأقررتم",
  "أألد",
  "أألقي",
  "أأمنتم",
  "أأنت",
  "أأنتم",
  "أأنذرتهم",
  "أأنزل",
  "أؤنبئكم",
  "أإذا",
  "أإله",
  "أإنا",
  "أإنك",
  "أئذا",
  "أئفكا",
  "أئمة",
  "أئن",
  "أئنا",
  "أئنكم",
  "أبا",
  "أبابيل",
  "أباكم",
  "أبالله",
  "أبانا",
  "أباه",
  "أباهم",
  "أبت",
  "أبتغي",
  "أبحر",
  "أبدا",
  "أبدله",
  "أبرئ",
  "أبرح",
  "أبرموا",
  "أبسلوا",
  "أبشر",
  "أبشرا",
  "أبشرتموني",
  "أبصار",
  "أبصاركم",
  "أبصارنا",
  "أبصارها",
  "أبصارهم",
  "أبصارهن",
  "أبصر",
  "أبصرنا",
  "أبعث",
  "أبغي",
  "أبغيكم",
  "أبق",
  "أبقى",
  "أبكارا",
  "أبكم",
  "أبلغ",
  "أبلغتكم",
  "أبلغكم",
  "أبلغه",
  "أبلغوا",
  "أبناء",
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
  return Math.floor(70 * Math.random());
}

function getGender() {
  let gender = Math.random() > 0.5 ? 1 : 2;
  return gender;
}
function getLanguage() {
  let indx = Math.random() > 0.5 ? 0 : 1;
  return "Arabic";
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
      name: "فيديو " + getRandomWord(),
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
      name: "اختبار " + getRandomWord(),
    };
    for (let i = 0; i < Math.floor(Math.random() * 6) + 2; i++) {
      if (Math.random() > 0.5) {
        obj.test.push({
          Q: "كيف حالك ؟ ",
          A: ["True", "False"],
          type: "TorF",
          correctAnswer: Math.round(Math.random()),
        });
      } else {
        let a = [];
        for (let j = 0; j < Math.round(Math.random() * 4) + 3; j++) {
          a.push(getRandomSentence());
        }
        // console.log(a);
        obj.test.push({
          Q: "اختر افضل اجابه",
          A: a,
          type: "MCQ",
          correctAnswer: Math.floor(Math.random() * a.length),
        });
      }
    }
    number++;
    return obj;
  } else {
    let obj = {
      passingGrade: Math.round(Math.random() * 100),
      number: number,
      name: "واجب " + getRandomWord(),
      type: "Assignment",
    };
    number++;
    return obj;
  }
}
let coursesIds = [];
let studentsTokens = [];
let urlNum = 300;
async function main() {
  for (let num = 0; num < 100; num++) {
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
      if (type == "student") {
        studentsTokens.push(token);
        // enroll user in some random courses
      } else {
        // create course by teacher
        let gender = Math.floor(3 * Math.random()) + 1;
        let language = getLanguage();
        let ageMin = generateAge();
        let age = [ageMin, ageMin + 20];
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

      for (let userToken of studentsTokens) {
        for (let courseId of coursesIds) {
          if (Math.random() > 0.5) {
            var options = {
              method: "POST",
              url: host + "/api/course/enroll?courseId=" + courseId,
              headers: {
                "x-auth-token": userToken,
              },
            };
            await request(options);
          }
        }
      }
    } catch (ex) {
      continue;
    }
  }
}

main();

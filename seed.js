import mongoose from 'mongoose';
import { Lesson } from './src/models/Lesson.js';
import config from './src/config.js';

mongoose.connect(config.MONGODB_URI);

const englishLessons = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  if (day % 2 !== 0) {
    return {
      day,
      language: 'english',
      title: `Lesson ${day}: English Spelling Rules (PDF)`,
      description: `Study the supplementary PDF material for Day ${day} to master spelling rules and vocabulary.`,
      videoUrl: '',
      duration: 10,
      vocabulary: [],
      grammar: {
        concept: `Spelling Pattern ${day}`,
        explanation: `Focus on Day ${day} spelling patterns, root words, prefixes, and suffixes.`,
        examples: []
      },
      speakingTasks: [],
      quiz: []
    };
  } else {
    const spellingQuestions = [
      [
        { question: 'Choose the correct spelling:', options: ['Receive', 'Recieve', 'Receve', 'Recive'], correctAnswer: 0, explanation: 'Remember "i before e except after c".' },
        { question: 'Select the correct spelling:', options: ['Believe', 'Beleive', 'Belive', 'Beleev'], correctAnswer: 0, explanation: 'In "believe", i comes before e.' },
        { question: 'Which word is spelled correctly?', options: ['Separate', 'Seperate', 'Seperat', 'Separret'], correctAnswer: 0, explanation: 'The word is "separate" with an "a" in the middle.' }
      ],
      [
        { question: 'Identify the correct spelling:', options: ['Definitely', 'Definately', 'Definetely', 'Definatly'], correctAnswer: 0, explanation: 'It comes from "finite", so it has "definite" + "ly".' },
        { question: 'Choose the correct spelling:', options: ['Until', 'Untill', 'Untile', 'Untyl'], correctAnswer: 0, explanation: '"Until" ends with a single "l".' },
        { question: 'Select the correct spelling:', options: ['Calendar', 'Calender', 'Calandar', 'Calander'], correctAnswer: 0, explanation: 'The correct spelling is "calendar".' }
      ]
    ];
    const qIndex = Math.floor(day / 2) % spellingQuestions.length;
    const quizQuestions = day === 2 ? [
      { question: 'Please write your full ________ on the registration form.', options: ['Naam', 'Name', 'Naym', 'Naim'], correctAnswer: 1, explanation: "'Name' is the correct English spelling. 'Naam' is Bengali/Hindi pronunciation." },
      { question: 'We must manage our study ________ properly.', options: ['Taim', 'Tyme', 'Time', 'Timme'], correctAnswer: 2, explanation: "'Time' is the correct spelling for duration or period." },
      { question: 'We need a solid action ________ for this project.', options: ['Plane', 'Plan', 'Plann', 'Plen'], correctAnswer: 1, explanation: "'Plan' means a scheme or method of acting, whereas 'Plane' is an airplane or flat surface." },
      { question: 'The total production ________ is very low.', options: ['Cost', 'Coste', 'Caust', 'Coast'], correctAnswer: 0, explanation: "'Cost' is the correct spelling for price or expense." },
      { question: 'Every new business involves some financial ________.', options: ['Risc', 'Risk', 'Riske', 'Risck'], correctAnswer: 1, explanation: "'Risk' is the correct spelling for danger or hazard." },
      { question: 'The organization approved a new growth ________.', options: ['Fand', 'Funde', 'Fund', 'Phund'], correctAnswer: 2, explanation: "'Fund' is the correct spelling for a sum of money saved or made available." },
      { question: 'Keep your study ________ clean and organized.', options: ['Desk', 'Deske', 'Dask', 'Desck'], correctAnswer: 0, explanation: "'Desk' is the correct spelling for a reading or writing table." },
      { question: 'I read an English ________ every morning.', options: ['Boke', 'Bookk', 'Book', 'Buke'], correctAnswer: 2, explanation: "'Book' is the correct spelling for a written or printed work." },
      { question: 'Smart ________ always produces the best results.', options: ['Wrok', 'Work', 'Wark', 'Worke'], correctAnswer: 1, explanation: "'Work' is the correct spelling for activity involving work/effort." },
      { question: 'We must ________ each other in difficult situations.', options: ['Halp', 'Helpp', 'Hlep', 'Help'], correctAnswer: 3, explanation: "'Help' is the correct spelling for assist or support." }
    ] : day === 4 ? [
      { question: 'Please pay the monthly electricity ________ on time.', options: ['Bil', 'Bill', 'Bile', 'Bll'], correctAnswer: 1, explanation: "'Bill' is the correct spelling for a statement of charges." },
      { question: 'He studied hard to ________ the final examination.', options: ['Pas', 'Pase', 'Pass', 'Paas'], correctAnswer: 2, explanation: "'Pass' is the correct spelling for succeeding in an exam." },
      { question: 'I will ________ you after the meeting ends.', options: ['Call', 'Cal', 'Caul', 'Cale'], correctAnswer: 0, explanation: "'Call' is the correct spelling for contact by phone or summon." },
      { question: 'The company suffered a heavy financial ________ this quarter.', options: ['Los', 'Lose', 'Loss', 'Loos'], correctAnswer: 2, explanation: "'Loss' is the correct spelling for deficit or failure to keep." },
      { question: 'Our office ________ are very professional and cooperative.', options: ['Staf', 'Staff', 'Staffe', 'Steff'], correctAnswer: 1, explanation: "'Staff' is the correct spelling for a group of employees." },
      { question: 'Join the English spelling ________ at 8 PM sharp.', options: ['Clas', 'Classe', 'Class', 'Claas'], correctAnswer: 2, explanation: "'Class' is the correct spelling for a course of instruction." },
      { question: 'They ________ high-quality organic goods.', options: ['Sel', 'Sell', 'Selle', 'Cel'], correctAnswer: 1, explanation: "'Sell' is the correct spelling for exchange for money." },
      { question: 'Always ________ the exact truth to your team.', options: ['Tel', 'Tell', 'Telle', 'Teal'], correctAnswer: 1, explanation: "'Tell' is the correct spelling for speak or communicate." },
      { question: 'Do not let your focus and attention ________.', options: ['Fal', 'Fall', 'Fawl', 'Fale'], correctAnswer: 1, explanation: "'Fall' is the correct spelling for drop or decrease." },
      { question: 'The meeting room was ________ of executives.', options: ['Ful', 'Fule', 'Full', 'Fool'], correctAnswer: 2, explanation: "'Full' is the correct spelling for containing all that can be held." }
    ] : day === 6 ? [
      { question: 'I ________ the exact answer to this question.', options: ['Now', 'Know', 'Kno', 'Knaw'], correctAnswer: 1, explanation: "'Know' is the correct spelling for having information." },
      { question: 'He injured his right ________ while playing football.', options: ['Nee', 'Knee', 'Knea', 'Kne'], correctAnswer: 1, explanation: "'Knee' is the correct spelling for the joint between the thigh and the lower leg." },
      { question: 'Keep the sharp kitchen ________ in a safe place.', options: ['Nife', 'Knife', 'Knif', 'Knaif'], correctAnswer: 1, explanation: "'Knife' is the correct spelling for the cutting tool." },
      { question: 'Tie a tight ________ at the end of the rope.', options: ['Not', 'Knott', 'Knot', 'Note'], correctAnswer: 2, explanation: "'Knot' is the correct spelling for a fastening made by tying a piece of string or rope." },
      { question: 'Please ________ on the door before entering the room.', options: ['Nock', 'Knock', 'Knok', 'Nok'], correctAnswer: 1, explanation: "'Knock' is the correct spelling for striking a surface to attract attention." },
      { question: 'Please ________ your name clearly on the official document.', options: ['Right', 'Write', 'Rite', 'Writte'], correctAnswer: 1, explanation: "'Write' is the correct spelling for marking letters/words on paper." },
      { question: 'This calculation gives a completely ________ result.', options: ['Rong', 'Wrong', 'Wraung', 'Wroang'], correctAnswer: 1, explanation: "'Wrong' is the correct spelling for incorrect." },
      { question: 'He is wearing a brand-new ________ watch.', options: ['Rist', 'Wrisst', 'Wrist', 'Wryst'], correctAnswer: 2, explanation: "'Wrist' is the correct spelling for the joint connecting the hand with the forearm." },
      { question: 'Make sure to ________ the gift box with colored paper.', options: ['Rap', 'Wrap', 'Wrapp', 'Rappe'], correctAnswer: 1, explanation: "'Wrap' is the correct spelling for cover or enclose in paper." },
      { question: 'Do not forget to ________ the contract below.', options: ['Sine', 'Syne', 'Sign', 'Cign'], correctAnswer: 2, explanation: "'Sign' is the correct spelling for writing your name to authorize something." }
    ] : day === 8 ? [
      { question: 'We will finalize the audit report by next ________.', options: ['Weak', 'Week', 'Weke', 'Weake'], correctAnswer: 1, explanation: "'Week' is the correct spelling for a period of seven days." },
      { question: 'Our project ________ achieved the monthly performance target.', options: ['Teem', 'Team', 'Teme', 'Tiam'], correctAnswer: 1, explanation: "'Team' is the correct spelling for a group of players or workers." },
      { question: 'We closed a profitable new business ________ with the client.', options: ['Deel', 'Deal', 'Dele', 'Daal'], correctAnswer: 1, explanation: "'Deal' is the correct spelling for a business agreement or transaction." },
      { question: 'The board members will ________ tomorrow morning.', options: ['Meat', 'Meete', 'Meet', 'Mite'], correctAnswer: 2, explanation: "'Meet' is the correct spelling for coming together or assembling." },
      { question: 'Please ________ the invoice figures before making payment.', options: ['Chek', 'Check', 'Cheque', 'Ckheck'], correctAnswer: 1, explanation: "'Check' is the correct spelling for examining or verifying." },
      { question: 'I ________ we should approve this financial proposal.', options: ['Thinck', 'Think', 'Thinc', 'Thynk'], correctAnswer: 1, explanation: "'Think' is the correct spelling for having a belief or opinion." },
      { question: '________ report requires immediate management approval?', options: ['Witch', 'Which', 'Wchich', 'Whitch'], correctAnswer: 1, explanation: "'Which' is the correct spelling to ask for a choice among alternatives." },
      { question: 'Always maintain accurate physical ________ records.', options: ['Cashe', 'Cask', 'Cash', 'Cashh'], correctAnswer: 2, explanation: "'Cash' is the correct spelling for physical money or currency." },
      { question: '________ does the general meeting officially begin?', options: ['Wen', 'When', 'Whan', 'Whean'], correctAnswer: 1, explanation: "'When' is the correct spelling to ask at what time." },
      { question: 'The company agreed to ________ its technical resources.', options: ['Share', 'Shair', 'Shar', 'Shaer'], correctAnswer: 0, explanation: "'Share' is the correct spelling for dividing or distributing portion." }
    ] : day === 10 ? [
      { question: 'Please fill out the official registration ________ carefully.', options: ['From', 'Form', 'Fourm', 'Frome'], correctAnswer: 1, explanation: "'Form' is the correct spelling for a document to be filled in." },
      { question: 'He joined an accounting and auditing ________ last month.', options: ['Farm', 'Ferm', 'Firm', 'Phirm'], correctAnswer: 2, explanation: "'Firm' is the correct spelling for a business or company." },
      { question: 'Now it is your ________ to present the financial slides.', options: ['Tern', 'Turn', 'Tyrn', 'Tturn'], correctAnswer: 1, explanation: "'Turn' is the correct spelling for an opportunity to do something." },
      { question: 'Always ________ the key points in the contract ledger.', options: ['Marc', 'Mark', 'Marke', 'Maark'], correctAnswer: 1, explanation: "'Mark' is the correct spelling for write or write a sign." },
      { question: 'Please ________ the physical cash balance before store closing.', options: ['Cownt', 'Count', 'Cowntt', 'Caunt'], correctAnswer: 1, explanation: "'Count' is the correct spelling for determine the total number." },
      { question: 'Highlight each critical ________ in the audit report.', options: ['Poynt', 'Point', 'Poinnt', 'Poyint'], correctAnswer: 1, explanation: "'Point' is the correct spelling for an item of information or argument." },
      { question: 'The board wants to ________ revenue rapidly this quarter.', options: ['Grow', 'Grou', 'Growe', 'Groe'], correctAnswer: 0, explanation: "'Grow' is the correct spelling for increase in size or quantity." },
      { question: 'We plan to ________ five qualified tax associates next month.', options: ['Emploi', 'Employ', 'Employe', 'Emplay'], correctAnswer: 1, explanation: "'Employ' is the correct spelling for hiring or using services." },
      { question: 'All manufacturing production costs must come ________ soon.', options: ['Doun', 'Downe', 'Down', 'Dawn'], correctAnswer: 2, explanation: "'Down' is the correct spelling for lower in position or value." },
      { question: 'Make sure you take a ________ and legally compliant decision.', options: ['Sound', 'Sownd', 'Saund', 'Sounde'], correctAnswer: 0, explanation: "'Sound' is the correct spelling for logical, healthy, or secure." }
    ] : day === 12 ? [
      { question: 'What is the current market ________ of this product.', options: ['Prise', 'Price', 'Pryce', 'Prizze'], correctAnswer: 1, explanation: "'Price' is the correct spelling for amount of money expected." },
      { question: 'Always leave enough ________ for official signatures.', options: ['Space', 'Spase', 'Spas', 'Spaice'], correctAnswer: 0, explanation: "'Space' is the correct spelling for empty area." },
      { question: 'Turn to ________ number ten in the employee handbook.', options: ['Paj', 'Page', 'Pag', 'Paije'], correctAnswer: 1, explanation: "'Page' is the correct spelling for one side of a sheet of paper." },
      { question: 'They manage a very ________ audit client base.', options: ['Larj', 'Largee', 'Large', 'Larrge'], correctAnswer: 2, explanation: "'Large' is the correct spelling for big size or quantity." },
      { question: 'We received a 10% special cash ________ on the bulk invoice.', options: ['Discoumt', 'Discownt', 'Discount', 'Disckount'], correctAnswer: 2, explanation: "'Discount' is the correct spelling for deduction from the price." },
      { question: 'The merchant issued a full ________ for the damaged stock.', options: ['Refund', 'Refunde', 'Refand', 'Reffund'], correctAnswer: 0, explanation: "'Refund' is the correct spelling for paying back money." },
      { question: 'The internal auditor will ________ the trial balance tomorrow.', options: ['Prepair', 'Prepare', 'Prepere', 'Praepare'], correctAnswer: 1, explanation: "'Prepare' is the correct spelling for make ready." },
      { question: 'Always avoid any form of ________ commercial practice.', options: ['Unfaire', 'Unfair', 'Unfere', 'Unfayre'], correctAnswer: 1, explanation: "'Unfair' is the correct spelling for not equitable or honest." },
      { question: 'The client asked us to ________ all major investment risks.', options: ['Disclose', 'Discloze', 'Discloas', 'Disclosee'], correctAnswer: 0, explanation: "'Disclose' is the correct spelling for reveal or make known." },
      { question: 'The manager was ________ to attend the financial review.', options: ['Unabell', 'Unabel', 'Unable', 'Unayble'], correctAnswer: 2, explanation: "'Unable' is the correct spelling for lacking necessary power or skill." }
    ] : day === 14 ? [
      { question: 'The auditor provided very ________ advice on tax compliance.', options: ['Helpfull', 'Helpful', 'Helppful', 'Helpfullly'], correctAnswer: 1, explanation: "'Helpful' is the correct spelling for giving or ready to give help." },
      { question: 'Download your monthly bank ________ for reconciliation.', options: ['Statment', 'Statement', 'Statemint', 'State-ment'], correctAnswer: 1, explanation: "'Statement' is the correct spelling for a document containing financial details." },
      { question: 'We processed the vendor ________ via online transfer.', options: ['Payement', 'Payment', 'Paymint', 'Paymant'], correctAnswer: 1, explanation: "'Payment' is the correct spelling for the action of paying." },
      { question: 'Always maintain total ________ and transparency in audits.', options: ['Fairnes', 'Fairness', 'Fayrness', 'Fairniss'], correctAnswer: 1, explanation: "'Fairness' is the correct spelling for impartial and just treatment." },
      { question: 'Management made a prompt strategic ________ on the budget.', options: ['Decition', 'Decission', 'Decision', 'Desision'], correctAnswer: 2, explanation: "'Decision' is the correct spelling for choice or resolution." },
      { question: 'We must take immediate legal ________ against the fraud.', options: ['Actshon', 'Action', 'Acsion', 'Actione'], correctAnswer: 1, explanation: "'Action' is the correct spelling for process of doing something." },
      { question: 'Explore every available financing ________ before closing.', options: ['Optshon', 'Opsion', 'Option', 'Optionn'], correctAnswer: 2, explanation: "'Option' is the correct spelling for a thing that is or may be chosen." },
      { question: 'Please check the compliance ________ in the annual report.', options: ['Secsion', 'Section', 'Secktion', 'Sectshon'], correctAnswer: 1, explanation: "'Section' is the correct spelling for part, area, or division." },
      { question: 'The team successfully completed its audit ________ on time.', options: ['Mision', 'Mishtion', 'Mission', 'Misson'], correctAnswer: 2, explanation: "'Mission' is the correct spelling for an important assignment." },
      { question: 'He shared a clear corporate ________ for future expansion.', options: ['Vition', 'Vision', 'Visyon', 'Vizion'], correctAnswer: 1, explanation: "'Vision' is the correct spelling for the ability to think about the future with wisdom." }
    ] : day === 16 ? [
      { question: 'The company managed to pay off its long-term bank ________.', options: ['Det', 'Debt', 'Debte', 'Dept'], correctAnswer: 1, explanation: "'Debt' is the correct spelling for something owed." },
      { question: 'Always collect the payment ________ after completing the purchase.', options: ['Resit', 'Receipt', 'Reciept', 'Receit'], correctAnswer: 1, explanation: "'Receipt' is the correct spelling for a written acknowledgment of payment." },
      { question: 'Clear any sort of ________ with the lead auditor before signing.', options: ['Dout', 'Dowt', 'Doubt', 'Doubte'], correctAnswer: 2, explanation: "'Doubt' is the correct spelling for uncertainty or lack of conviction." },
      { question: 'Please ________ carefully to the instructions given in the briefing.', options: ['Lisen', 'Listen', 'Liston', 'Lissin'], correctAnswer: 1, explanation: "'Listen' is the correct spelling for giving attention to sound." },
      { question: 'We must submit the finalized audit file before the ________.', options: ['Dead line', 'Dedline', 'Deadline', 'Dead-line'], correctAnswer: 2, explanation: "'Deadline' is the correct spelling for the latest time by which something must be completed." },
      { question: 'Client ________ on the new financial software was overwhelmingly positive.', options: ['Feed back', 'Feedback', 'Feed-back', 'Feede-back'], correctAnswer: 1, explanation: "'Feedback' is the correct spelling for information about reactions to a product." },
      { question: 'Ensure the secure customer ________ is backed up on the cloud daily.', options: ['Database', 'Data base', 'Data-base', 'Databaise'], correctAnswer: 0, explanation: "'Database' is the correct spelling for a structured set of data." },
      { question: 'Managing regular ________ is essential for small business liquidity.', options: ['Cash flow', 'Cashflow', 'Cash-flow', 'Casheflow'], correctAnswer: 1, explanation: "'Cashflow' is the correct spelling for the movement of money in and out of a business." },
      { question: 'Build a solid professional ________ to explore better business partnerships.', options: ['Net work', 'Network', 'Net-work', 'Netwrok'], correctAnswer: 1, explanation: "'Network' is the correct spelling for a group of interconnected people or things." },
      { question: 'The board requested a brief financial ________ of the upcoming budget.', options: ['Over vew', 'Over-view', 'Overview', 'Overveiw'], correctAnswer: 2, explanation: "'Overview' is the correct spelling for a general review or summary." }
    ] : day === 18 ? [
      { question: 'The company reported a record net ________ this financial year.', options: ['Profet', 'Profit', 'Proffit', 'Prophit'], correctAnswer: 1, explanation: "'Profit' is the correct spelling for financial gain." },
      { question: 'Cash in hand and inventory are classified as current ________.', options: ['Asett', 'Aset', 'Asset', 'Assett'], correctAnswer: 2, explanation: "'Asset' is the correct spelling for a useful or valuable quality, person, or thing." },
      { question: 'Check the warehouse closing ________ before finalizing accounts.', options: ['Stoc', 'Stock', 'Stok', 'Stoak'], correctAnswer: 1, explanation: "'Stock' is the correct spelling for goods or merchandise kept on the premises." },
      { question: 'We need to determine the fair market ________ of the machinery.', options: ['Valu', 'Valew', 'Value', 'Vallue'], correctAnswer: 2, explanation: "'Value' is the correct spelling for the regard that something is held to deserve." },
      { question: 'We need to raise equity ________ to expand operations.', options: ['Capitel', 'Capital', 'Capitall', 'Capytal'], correctAnswer: 1, explanation: "'Capital' is the correct spelling for wealth in the form of money or other assets." },
      { question: 'Download the updated general ________ for ledger auditing.', options: ['Lejer', 'Leger', 'Ledger', 'Ledjer'], correctAnswer: 2, explanation: "'Ledger' is the correct spelling for a book or other collection of financial accounts." },
      { question: 'The annual company ________ crossed our initial budget projection.', options: ['Revenew', 'Revenu', 'Revenue', 'Revnue'], correctAnswer: 2, explanation: "'Revenue' is the correct spelling for income, especially when of a company or organization." },
      { question: 'Always control non-essential operational ________.', options: ['Expence', 'Expense', 'Expens', 'Expanse'], correctAnswer: 1, explanation: "'Expense' is the correct spelling for the cost required for something." },
      { question: 'Please send the official tax ________ to the procurement team.', options: ['Invoise', 'Invoys', 'Invoice', 'Invoicee'], correctAnswer: 2, explanation: "'Invoice' is the correct spelling for a list of goods sent or services provided, with a statement of the sum due." },
      { question: 'The marketing team prepared a strict quarterly ________.', options: ['Buget', 'Budjet', 'Budget', 'Budgett'], correctAnswer: 2, explanation: "'Budget' is the correct spelling for an estimate of income and expenditure for a set period." }
    ] : day === 20 ? [
      { question: 'The auditor requested a formal ________ from management.', options: ['Conferm', 'Confirm', 'Confirme', 'Cunfirm'], correctAnswer: 1, explanation: "'Confirm' is the correct spelling for establishing the truth or correctness." },
      { question: 'We need to ________ the whole procurement workflow.', options: ['Revise', 'Revize', 'Revaise', 'Revice'], correctAnswer: 0, explanation: "'Revise' is the correct spelling for re-examining and improving." },
      { question: 'Management will ________ the final restructuring proposal.', options: ['Acept', 'Accept', 'Axcept', 'Acsept'], correctAnswer: 1, explanation: "'Accept' is the correct spelling for consenting to receive." },
      { question: 'The finance manager gave verbal ________ for the payment.', options: ['Concent', 'Consent', 'Consente', 'Consant'], correctAnswer: 1, explanation: "'Consent' is the correct spelling for permission for something to happen." },
      { question: 'Please ________ the internal control weaknesses clearly.', options: ['Explane', 'Explain', 'Explayn', 'Explaine'], correctAnswer: 1, explanation: "'Explain' is the correct spelling for making something clear." },
      { question: 'The board will ________ the financial viability of the merger.', options: ['Discus', 'Discuss', 'Discusse', 'Discuse'], correctAnswer: 1, explanation: "'Discuss' is the correct spelling for talking about something to reach a decision." },
      { question: 'Students must critically ________ the investment proposal.', options: ['Evalute', 'Evaluate', 'Evaluaite', 'Evaluatee'], correctAnswer: 1, explanation: "'Evaluate' is the correct spelling for assessing or forming an idea of amount or value." },
      { question: '________ the current year ratios with last year\'s figures.', options: ['Compare', 'Compair', 'Compere', 'Comparee'], correctAnswer: 0, explanation: "'Compare' is the correct spelling for estimating, measuring, or noting the similarity or dissimilarity." },
      { question: 'The external audit team will ________ the variance ledger.', options: ['Analize', 'Analyse', 'Analise', 'Analyz'], correctAnswer: 1, explanation: "'Analyse' is the correct spelling (UK standard, common in ACCA) for examining methodically." },
      { question: 'The consultant will ________ a cost reduction strategy.', options: ['Reccomend', 'Recomended', 'Recommend', 'Recommende'], correctAnswer: 2, explanation: "'Recommend' is the correct spelling for advising or suggesting." }
    ] : spellingQuestions[qIndex];
    return {
      day,
      language: 'english',
      title: `Lesson ${day}: Spelling Practice Quiz`,
      description: `Test your spelling knowledge with the Day ${day} Review Quiz.`,
      videoUrl: '',
      duration: 10,
      vocabulary: [],
      grammar: {
        concept: `Spelling Check ${day}`,
        explanation: `Test spelling recall and identify common spelling mistakes.`,
        examples: []
      },
      speakingTasks: [],
      quiz: quizQuestions
    };
  }
});

const arabicLessons = [
  {
    "day": 1,
    "language": "arabic",
    "title": "Lesson 1: Leadership Words",
    "description": "Learn four useful Arabic leadership words with simple English support.",
    "videoUrl": "https://example.com/arabic-lesson1.mp4",
    "duration": 15,
    "vocabulary": [
      {
        "word": "Leadership",
        "translation": "Qiyadah",
        "pronunciation": "",
        "example": "Use it when talking about leading a team or project."
      },
      {
        "word": "Integrity",
        "translation": "Nazahah",
        "pronunciation": "",
        "example": "Use it when describing someone trustworthy."
      },
      {
        "word": "Influence",
        "translation": "Taathir",
        "pronunciation": "",
        "example": "Use it when a leader inspires others to act."
      },
      {
        "word": "Responsibility",
        "translation": "Masuliyyah",
        "pronunciation": "",
        "example": "Use it when talking about commitment and ownership."
      }
    ],
    "grammar": {
      "concept": "Arabic Day 1",
      "explanation": "Arabic Day 1 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 2,
    "language": "arabic",
    "title": "Lesson 2: Speaking With Impact",
    "description": "Practice simple Arabic-linked words for speaking, delivery, and persuasion.",
    "videoUrl": "https://example.com/arabic-lesson2.mp4",
    "duration": 15,
    "vocabulary": [
      {
        "word": "Eloquence",
        "translation": "Balaghah",
        "pronunciation": "",
        "example": "Use it when speech sounds graceful and convincing."
      },
      {
        "word": "Persuasion",
        "translation": "Iqna",
        "pronunciation": "",
        "example": "Use it when presenting an argument or proposal."
      },
      {
        "word": "Delivery",
        "translation": "Ilqa",
        "pronunciation": "",
        "example": "Use it when practicing speeches or presentations."
      }
    ],
    "grammar": {
      "concept": "Arabic Day 2",
      "explanation": "Arabic Day 2 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "“هٰذَا” (Hadha) শব্দের সঠিক বাংলা অর্থ কোনটি?",
        "options": [
          "সে / তিনি",
          "এটি / এই",
          "তারা",
          "তুমি"
        ],
        "correctAnswer": 1,
        "explanation": "“هٰذَا” (Hadha) শব্দের অর্থ হলো “এটি” বা “এই”।"
      },
      {
        "question": "“একটি বাড়ি” এর সঠিক আরবি প্রতিশব্দ কোনটি?",
        "options": [
          "مَسْجِدٌ (Masjidun)",
          "بَابٌ (Baabun)",
          "كِتَابٌ (Kitaabun)",
          "بَيْتٌ (Baytun)"
        ],
        "correctAnswer": 3,
        "explanation": "“بَيْتٌ” (Baytun) অর্থ হলো একটি বাড়ি।"
      },
      {
        "question": "“এটি একটি মসজিদ” এর সঠিক আরবি অনুবাদ কী হবে?",
        "options": [
          "هٰذَا بَيْتٌ (Hadha baytun)",
          "هٰذَا مَسْجِدٌ (Hadha masjidun)",
          "هٰذَا بَابٌ (Hadha baabun)",
          "مَا هٰذَا؟ (Ma hadha?)"
        ],
        "correctAnswer": 1,
        "explanation": "“هٰذَا َمْسِجٌد” (Hadha masjidun) অর্থ হলো “এটি একটি মসজিদ।”"
      },
      {
        "question": "“مَا هٰذَا؟” (Ma hadha?) প্রশ্নটির সঠিক অর্থ কী?",
        "options": [
          "এটি কী?",
          "তুমি কে?",
          "কেমন আছো?",
          "তোমার নাম কী?"
        ],
        "correctAnswer": 0,
        "explanation": "“مَا” (Ma) অর্থ কী এবং “هٰذَا” (Hadha) অর্থ এটি। অর্থাৎ “مَا هٰذَا؟” অর্থ “এটি কী?”।"
      },
      {
        "question": "“এটি একটি চাবি” - এর সঠিক আরবি অনুবাদ কোনটি?",
        "options": [
          "هٰذَا قَلَمٌ",
          "هٰذَا كِتَابٌ",
          "هٰذَا مِفْتَاحٌ",
          "هٰذَا بَابٌ"
        ],
        "correctAnswer": 2,
        "explanation": "“مِفْتَاحٌ” (Miftaahun) অর্থ চাবি। তাই “هٰذَا مِفْتَاحٌ” অর্থ “এটি একটি চাবি।”"
      },
      {
        "question": "কেউ যদি প্রশ্ন করে “مَا اسْمُكَ؟” (Maa ismuka?), তবে এর উত্তর সাধারণত কীভাবে শুরু করতে হবে?",
        "options": [
          "بِخَيْرٍ (Bi-khayrin)",
          "كَيْفَ (Kayfa)",
          "اِسْمِي... (Ismii...)",
          "هٰذَا... (Hadha...)"
        ],
        "correctAnswer": 2,
        "explanation": "“مَا اسْمُكَ؟” মানে “তোমার নাম কী?”। এর উত্তরে নিজের নাম বলতে “اِسْمِي...” (আমার নাম...) ব্যবহার করতে হয়।"
      },
      {
        "question": "“كَيْفَ حَالُكَ؟” (Kayfa haaluka?) বাক্যটি দ্বারা কী বোঝানো হয়?",
        "options": [
          "তোমার নাম কী?",
          "তুমি কোথা থেকে এসেছ?",
          "এটি কি একটি বাড়ি?",
          "তুমি কেমন আছো?"
        ],
        "correctAnswer": 3,
        "explanation": "“كَيْفَ حَالُكَ؟” অর্থ হলো “তুমি কেমন আছো?”।"
      },
      {
        "question": "“كَيْفَ حَالُكَ؟” (তুমি কেমন আছো?) প্রশ্নের জবাবে সাধারণত কী বলা হয়?",
        "options": [
          "اِسْمِي خَالِدٌ",
          "بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ",
          "هٰذَا بَيْتٌ",
          "نَعَمْ، هٰذَا مَسْجِدٌ"
        ],
        "correctAnswer": 1,
        "explanation": "কুশল জিজ্ঞাসার জবাবে বলতে হয় “بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ” (ভালো আছি, আলহামদুলিল্লাহ)।"
      },
      {
        "question": "ছবিতে একটি কলম দেখিয়ে যদি প্রশ্ন করা হয় “مَا هٰذَا؟” (এটি কী?), তবে সঠিক উত্তর কোনটি হবে?",
        "options": [
          "هٰذَا كِتَابٌ",
          "هٰذَا قَلَمٌ",
          "هٰذَا بَابٌ",
          "هٰذَا بَيْتٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“قَلَمٌ” (Qalamun) অর্থ হলো কলম। তাই সঠিক উত্তর “هٰذَا قَلَمٌ” (এটি একটি কলম)।"
      },
      {
        "question": "“أَهٰذَا بَيْتٌ؟” (A-hadha baytun?) এর অর্থ কী এবং এর সঠিক উত্তর নিচের কোনটি?",
        "options": [
          "এটি কি একটি মসজিদ? - نَعَمْ، هٰذَا مَسْجِدٌ",
          "এটি কি একটি বাড়ি? - نَعَمْ، هٰذَا بَيْتٌ",
          "এটি কি একটি দরজা? - هٰذَا بَابٌ",
          "এটি কি একটি বই? - هٰذَا كِتَابٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“أَهٰذَا بَيْتٌ؟” অর্থ “এটি কি একটি বাড়ি?” এবং এর উত্তর হলো “نَعَمْ، هٰذَا بَيْتٌ” (হ্যাঁ, এটি একটি বাড়ি)।"
      }
    ]
  },
  {
    "day": 3,
    "language": "arabic",
    "title": "Lesson 3: Arabic Reading Practice (PDF 02)",
    "description": "Continue your Arabic learning with this Day 3 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson3.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 3",
      "explanation": "Arabic Day 3 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 4,
    "language": "arabic",
    "title": "Lesson 4: MCQ Quiz Practice",
    "description": "Practice Arabic greetings and leadership vocabulary.",
    "videoUrl": "https://example.com/arabic-lesson4.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 4",
      "explanation": "Arabic Day 4 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরবী ভাষায় “কে?” (মানুষের ক্ষেত্রে) জিজ্ঞাসার জন্য সঠিক শব্দ কোনটি?",
        "options": [
          "مَا (Maa)",
          "مَنْ (Man)",
          "أَيْنَ (Ayna)",
          "مِنْ (Min)"
        ],
        "correctAnswer": 1,
        "explanation": "আরবী ভাষায় মানুষের পরিচয় জানতে “مَنْ” (Man) ব্যবহার করা হয়।"
      },
      {
        "question": "“ذٰلِكَ” (Dhaalika) শব্দটির সঠিক বাংলা অর্থ কোনটি?",
        "options": [
          "এটি / এই (কাছের)",
          "সে / তিনি (অনুপস্থিত)",
          "ওইটি / ওই (দূরের)",
          "তুমি (উপস্থিত)"
        ],
        "correctAnswer": 2,
        "explanation": "“ذٰلِكَ” (Dhaalika) অর্থ হলো “ওইটি” বা “ওই”, যা দূরের কোনো পুরুষবাচক বস্তুকে নির্দেশ করতে ব্যবহৃত হয়।"
      },
      {
        "question": "“ইনি একজন ডাক্তার।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "هٰذَا مُدَرِّسٌ",
          "هٰذَا طَبِيبٌ",
          "هٰذَا تَاجِرٌ",
          "هٰذَا إِمَامٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“طَبِيبٌ” (Tabiibun) অর্থ ডাক্তার। তাই সঠিক বাক্যটি হলো “هٰذَا طَبِيبٌ”।"
      },
      {
        "question": "“مَا ذٰلِكَ؟” (Maa dhaalika?) প্রশ্নটির সঠিক বাংলা অর্থ কী?",
        "options": [
          "ইনি কে?",
          "এটি কী?",
          "ওইটি কী?",
          "তুমি কে?"
        ],
        "correctAnswer": 2,
        "explanation": "“مَا” অর্থ কী এবং “ذٰلِكَ” অর্থ ওইটি। তাই “مَا ذٰلِكَ؟” অর্থ “ওইটি কী?”।"
      },
      {
        "question": "দূরে একটি তারা (Star - نَجْمٌ) দেখিয়ে যদি প্রশ্ন করা হয় “مَا ذٰلِكَ؟” (ওইটি কী?), তবে সঠিক উত্তর কোনটি হবে?",
        "options": [
          "ذٰلِكَ بَيْتٌ",
          "ذٰلِكَ نَجْمٌ",
          "هٰذَا نَجْمٌ",
          "ذٰلِكَ مَسْجِدٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“نَجْمٌ” (Najmun) অর্থ তারা। দূরের জিনিস বোঝাতে “ذٰلِكَ” ব্যবহার করা হয়েছে। তাই সঠিক উত্তর “ذٰلِكَ نَجْمٌ” (ওইটি একটি তারা)।"
      },
      {
        "question": "“مِنْ أَيْنَ أَنْتَ؟” (Min ayna anta?) বাক্যটি দ্বারা কী জানতে চাওয়া হয়?",
        "options": [
          "তোমার নাম কী?",
          "তুমি কেমন আছো?",
          "তুমি কোথা থেকে এসেছ?",
          "তোমার পেশা কী?"
        ],
        "correctAnswer": 2,
        "explanation": "“مِنْ أَيْنَ أَنْتَ؟” অর্থ হলো “তুমি কোথা থেকে এসেছ?”।"
      },
      {
        "question": "“আমি পাকিস্তান থেকে এসেছি।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "أَنَا بَاكِسْتَانِيٌّ",
          "أَنَا مِنْ بَاكِسْتَانَ",
          "أَنَا مِنْ تُرْكِيَا",
          "أَنَا تُرْكِيٌّ"
        ],
        "correctAnswer": 1,
        "explanation": "“أَنَا مِنْ بَاكِسْتَانَ” (Anaa min Baakistaan) অর্থ “আমি পাকিস্তান থেকে এসেছি।”"
      },
      {
        "question": "“َهْل أَنْتَ بَاكِسْتَانِيٌّ؟” (তুমি কি একজন পাকিস্তানি?) এর জবাবে হ্যাঁ-সূচক উত্তরটি কী হবে?",
        "options": [
          "لاَ، أَنَا تُرْكِيٌّ",
          "نَعَمْ، أَنَا بَاكِسْتَانِيٌّ",
          "نَعَمْ، أَنَا مِنْ بَاكِسْتَانَ",
          "اِسْمِي شَرِيفٌ"
        ],
        "correctAnswer": 1,
        "explanation": "জাতীয়তাবাচক প্রশ্ন “َهْل أَنْتَ بَاكِسْتَانِيٌّ؟” এর হ্যাঁ-সূচক জবাব হলো “نَعَمْ، أَنَا بَاكِسْتَانِيٌّ” (হ্যাঁ, আমি পাকিস্তানি)।"
      },
      {
        "question": "“আমি তুর্কি (Turkiyyun)।” এর সঠিক আরবী বাক্য কোনটি?",
        "options": [
          "أَنَا تُرْكِيٌّ",
          "أَنَا مِنْ تُرْكِيَا",
          "أَنَا بَاكِسْتَانِيٌّ",
          "أَنَا مِنْ بَاكِسْتَانَ"
        ],
        "correctAnswer": 0,
        "explanation": "“أَنَا تُرْكِيٌّ” (Anaa Turkiyyun) অর্থ “আমি তুর্কি।” (জাতীয়তা নির্দেশক)।"
      },
      {
        "question": "একজন শিক্ষককে দেখিয়ে যদি প্রশ্ন করা হয় “َمْن هٰذَا؟” (ইনি কে?), তবে সঠিক আরবী উত্তর কোনটি?",
        "options": [
          "هٰذَا تَاجِرٌ",
          "هٰذَا طَبِيبٌ",
          "هٰذَا مُدَرِّسٌ",
          "هٰذَا إِمَامٌ"
        ],
        "correctAnswer": 2,
        "explanation": "“مُدَرِّسٌ” (Mudarrisun) অর্থ শিক্ষক। তাই সঠিক উত্তর হলো “هٰذَا مُدَرِّسٌ” (ইনি একজন শিক্ষক)।"
      }
    ]
  },
  {
    "day": 5,
    "language": "arabic",
    "title": "Lesson 5: Arabic Reading Practice (PDF 03)",
    "description": "Strengthen your Arabic skills with this Day 5 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson5.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 5",
      "explanation": "Arabic Day 5 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 6,
    "language": "arabic",
    "title": "Lesson 6: MCQ Quiz Practice",
    "description": "Practice Arabic leadership terms and meanings.",
    "videoUrl": "https://example.com/arabic-lesson6.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 6",
      "explanation": "Arabic Day 6 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরবী শব্দে “ال” (Al-) যুক্ত হলে শব্দটির কী পরিবর্তন হয়?",
        "options": [
          "শব্দটি অনির্দিষ্ট (Indefinite) হয়ে যায়",
          "শব্দটি নির্দিষ্ট (Definite) হয়ে যায় এবং তানউইন উঠে যায়",
          "শব্দটির অর্থ পরিবর্তন হয় না",
          "শব্দটির শেষে দুই জবর যুক্ত হয়"
        ],
        "correctAnswer": 1,
        "explanation": "আরবী শব্দে “ال” (Al-) যুক্ত হলে শব্দটি নির্দিষ্ট (Definite) হয় এবং এর তানউইন উঠে গিয়ে এক হরকত বিশিষ্ট হয়।"
      },
      {
        "question": "“بَيْتٌ” (Baytun) শব্দটিকে নির্দিষ্ট (Definite) করতে চাইলে সঠিক রূপ কোনটি হবে?",
        "options": [
          "اَلْبَيْتٌ (Al-baytun)",
          "بَيْتُ اَلْ (Baytu al)",
          "اَلْبَيْتُ (Al-baytu)",
          "بَيْتُোনٌ (Baytuunun)"
        ],
        "correctAnswer": 2,
        "explanation": "“بَيْتٌ” (Baytun) এর নির্দিষ্ট রূপ হলো “اَلْبَيْتُ” (Al-baytu)।"
      },
      {
        "question": "আরবী ভাষায় “ভাঙা” (Broken) এর প্রতিশব্দ কোনটি?",
        "options": [
          "مَفْتُوحٌ (Maftuuhun)",
          "مَكْسُورٌ (Maksuurun)",
          "جَالِسٌ (Jaalisun)",
          "وَاقِفٌ (Waaqifun)"
        ],
        "correctAnswer": 1,
        "explanation": "আরবী ভাষায় “ভাঙা” বা Broken এর প্রতিশব্দ হলো “مَكْسُورٌ” (Maksuurun)।"
      },
      {
        "question": "“দরজাটি খোলা।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "اَلْبَابُ مَكْسُورٌ",
          "اَلْبَابُ مَفْتُوحٌ",
          "اَلْبَابُ جَالِسٌ",
          "هٰذَا بَابٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“اَلْبَابُ مَفْتُوحٌ” (Al-baabu maftuuhun) অর্থ “দরজাটি খোলা।”"
      },
      {
        "question": "“اَلْمُدَرِّسُ وَاقِفٌ” (Al-mudarrisu waaqifun) বাক্যটির সঠিক বাংলা অর্থ কী?",
        "options": [
          "শিক্ষকটি বসে আছেন।",
          "ছাত্রটি দাঁড়িয়ে আছে।",
          "শিক্ষকটি দাঁড়িয়ে আছেন।",
          "প্রকৌশলীটি কাজ করছেন।"
        ],
        "correctAnswer": 2,
        "explanation": "“اَلْمُدَرِّسُ وَاقِفٌ” অর্থ “শিক্ষকটি দাঁড়িয়ে আছেন।”"
      },
      {
        "question": "“ইনি আমার ভাই, উনি একজন শিক্ষক।” এর আরবী অনুবাদ কোনটি?",
        "options": [
          "هٰذَا صَدِيقِي، هُوَ مُهَنْدِسٌ",
          "هٰذَا أَخِي، هُوَ مُدَرِّسٌ",
          "هٰذَا أَخِي، هُوَ طَبِيبٌ",
          "هٰذَا مُدَرِّسٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“هٰذَا أَخِي، هُوَ مُدَرِّسٌ” (Hadha akhii, huwa mudarrisun) অর্থ “ইনি আমার ভাই, উনি একজন শিক্ষক।”"
      },
      {
        "question": "“مُهَنْدِسٌ” (Muhandisun) শব্দটির সঠিক বাংলা অর্থ কী?",
        "options": [
          "ব্যবসায়ী",
          "শিক্ষক",
          "ডাক্তার",
          "প্রকৌশলী"
        ],
        "correctAnswer": 3,
        "explanation": "“مُهَنْدِسٌ” (Muhandisun) শব্দের অর্থ হলো প্রকৌশলী (Engineer)।"
      },
      {
        "question": "“ইনি আমার বন্ধু, উনি একজন প্রকৌশলী।” - এর আরবী অনুবাদ কোনটি?",
        "options": [
          "هٰذَا صَدِيقِي، هُوَ مُهَنْدِسٌ",
          "هٰذَا أَخِي, هُوَ مُدَرِّسٌ",
          "هٰذَا طَبِيبٌ",
          "هٰذَا صَدِيقِي، هُوَ تَاجِرٌ"
        ],
        "correctAnswer": 0,
        "explanation": "“هٰذَا صَدِيقِي، هُوَ مُهَنْدِسٌ” (Hadha sadiiqii, huwa muhandisun) অর্থ “ইনি আমার বন্ধু, উনি একজন প্রকৌশলী।”"
      },
      {
        "question": "বিদায় জানানোর জন্য আরবী কথোপকথনে সাধারণত কোন বাক্যটি ব্যবহার করা হয়?",
        "options": [
          "أَهْلًا وَسَهْلًا (Ahlan wa sahlan)",
          "كَيْفَ حَالُكَ (Kayfa haaluka)",
          "مَعَ السَّلَامَةِ (Ma'as-salaamah)",
          "مَا اسْمُكَ (Maa ismuka)"
        ],
        "correctAnswer": 2,
        "explanation": "আরবীতে বিদায় নেওয়ার সময় “مَعَ السَّلَامَةِ” (সালামের সাথে থাকুন / বিদায়) বলা হয়।"
      },
      {
        "question": "“ছেলেটি বসা।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "اَلْوَلَدُ وَاقِفٌ",
          "اَلْوَلَدُ جَالِسٌ",
          "هٰذَا وَلَدٌ",
          "اَلْوَلَدُ مَكْسُورٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“اَلْوَلَدُ جَالِسٌ” (Al-waladu jaalisun) অর্থ “ছেলেটি বসা।”"
      }
    ]
  },
  {
    "day": 7,
    "language": "arabic",
    "title": "Lesson 7: Arabic Reading Practice (PDF 04)",
    "description": "Build on your progress with this Day 7 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson7.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 7",
      "explanation": "Arabic Day 7 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 8,
    "language": "arabic",
    "title": "Lesson 8: MCQ Quiz Practice",
    "description": "Practice Arabic public speaking and rhetoric vocabulary.",
    "videoUrl": "https://example.com/arabic-lesson8.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 8",
      "explanation": "Arabic Day 8 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরবী ভাষায় “فِي” (Fii) এবং “عَلَى” (Alaa) শব্দ দুটিকে কী বলা হয়?",
        "options": [
          "সর্বনাম (Pronouns)",
          "হারফে জার / অব্যয় (Prepositions)",
          "ইশারা / নির্দেশক (Pointers)",
          "বিশেষণ (Adjectives)"
        ],
        "correctAnswer": 1,
        "explanation": "“فِي” (মধ্যে) এবং “عَلَى” (উপরে) শব্দ দুটি হলো হারফে জার (Prepositions)।"
      },
      {
        "question": "হারফে জার (যেমন: فِي) এর পরের বিশেষ্যটির (Noun) শেষ হরকতে কী বসে?",
        "options": [
          "পেশ / Dammah",
          "জবর / Fathah",
          "জের / Kasrah",
          "সাকিন / Sukun"
        ],
        "correctAnswer": 2,
        "explanation": "হারফে জার এর পরের বিশেষ্যটি মাজরুর হয় এবং এর শেষ অক্ষরে জের বা Kasrah বসে।"
      },
      {
        "question": "“টেবিলের ওপরে” এর সঠিক আরবী রূপ কোনটি?",
        "options": [
          "عَلَى الْمَكْتَبُ (‘Alaa al-maktabu)",
          "عَلَى الْمَكْتَبِ (‘Alaa al-maktabi)",
          "فِي الْمَكْتَبِ (Fii al-maktabi)",
          "عَلَى الْمَكْتَبَ (‘Alaa al-maktaba)"
        ],
        "correctAnswer": 1,
        "explanation": "“عَلَى” হারফে জারের পরে “الْمَكْتَبِ” এর শেষে জের হয়ে সঠিক রূপ হবে “عَلَى الْمَكْتَبِ”।"
      },
      {
        "question": "পুরুষবাচক নামের পরিবর্তে “সে/তিনি” বোঝাতে কোন আরবী সর্বনাম (Pronoun) ব্যবহৃত হয়?",
        "options": [
          "هِيَ (Hiya)",
          "أَنْتَ (Anta)",
          "هُوَ (Huwa)",
          "أَنَا (Anaa)"
        ],
        "correctAnswer": 2,
        "explanation": "পুরুষবাচক নামের পরিবর্তে “সে/তিনি” বোঝাতে “هُوَ” (Huwa) এবং স্ত্রীবাচকের ক্ষেত্রে “هِيَ” (Hiya) ব্যবহার করা হয়।"
      },
      {
        "question": "“আমিনা রান্নাঘরে আছে।” - এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "آمِنَةُ فِي الْغُرْفَةِ",
          "آمِنَةُ عَلَى الْمَكْتَبِ",
          "آمِنَةُ فِي الْمَطْبَخِ",
          "هُوَ فِي الْمَطْبَخِ"
        ],
        "correctAnswer": 2,
        "explanation": "“آمِنَةُ فِي الْمَطْبَخِ” (Aaminatu fii al-matbakhi) অর্থ “আমিনা রান্নাঘরে আছে।”"
      },
      {
        "question": "আরবী ভাষায় “মা” এবং “বাবา” এর প্রতিশব্দ জুটি কোনটি?",
        "options": [
          "جَدٌّ - جَدَّةٌ",
          "وَالِدٌ - وَالِدَةٌ",
          "أَخٌ - أُخْتٌ",
          "صَدِيقٌ - صَدِيقَةٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“وَالِدٌ” অর্থ বাবা এবং “وَالِدَةٌ” অর্থ মা।"
      },
      {
        "question": "“শাজাতুন” (شَجَرَةٌ) শব্দের সঠিক বাংলা অর্থ কী?",
        "options": [
          "পরিবার",
          "কক্ষ",
          "ঘর",
          "গাছ / বংশলতিকা"
        ],
        "correctAnswer": 3,
        "explanation": "“شَجَرَةٌ” (Shajaratun) শব্দের অর্থ হলো গাছ বা বংশলতিকা।"
      },
      {
        "question": "আরবী যুক্ত সর্বনাম “ـهُ” (-hu) এর সঠিক বাংলা অর্থ কী?",
        "options": [
          "আমার (my)",
          "তোমার (your)",
          "তাঁর / তার (his)",
          "আমাদের (our)"
        ],
        "correctAnswer": 2,
        "explanation": "যুক্ত সর্বনাম “ـهُ” (-hu) মালিকানা অর্থে “তার/তাঁর” (his) প্রকাশ করে।"
      },
      {
        "question": "“ইনি তাঁর দাদা আবদুল মুত্তালিব।” বাক্যটির সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "هٰذَا وَالِدُهُ عَبْدُ اللَّهِ",
          "هٰذَا جَدُّهُ عَبْدُ الْمُطَّلِبِ",
          "هٰذِهِ وَالِدَتُهُ آمِنَةُ",
          "هٰذَا أَخِي"
        ],
        "correctAnswer": 1,
        "explanation": "“جَدُّهُ” মানে তার দাদা। তাই বাক্যটির সঠিক আরবী হলো “هٰذَا جَدُّهُ عَبْدُ الْمُطَّلِبِ”।"
      },
      {
        "question": "“آمِنَةُ فِي الْمَطْبَخِ” (আমিনা রান্নাঘরে) - এই বাক্যে আমিনার নাম পুনরায় না লিখে “সে রান্নাঘরে” বলতে চাইলে সঠিক আরবী বাক্য কী হবে?",
        "options": [
          "هُوَ فِي الْمَطْبَخِ (Huwa fii al-matbakhi)",
          "هِيَ فِي الْمَطْبَخِ (Hiya fii al-matbakhi)",
          "أَنَا فِي الْمَطْبَخِ",
          "هٰذِهِ فِي الْمَطْبَخِ"
        ],
        "correctAnswer": 1,
        "explanation": "আমিনা স্ত্রীবাচক হওয়ায় তার ক্ষেত্রে সর্বনাম “هِيَ” (Hiya) ব্যবহার করে সঠিক বাক্য হবে “هِيَ فِي الْمَطْبَخِ”।"
      }
    ]
  },
  {
    "day": 9,
    "language": "arabic",
    "title": "Lesson 9: Arabic Reading Practice (PDF 05)",
    "description": "Keep improving with this Day 9 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson9.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 9",
      "explanation": "Arabic Day 9 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 10,
    "language": "arabic",
    "title": "Lesson 10: MCQ Quiz Practice",
    "description": "Practice public speaking and core leadership vocabulary.",
    "videoUrl": "https://example.com/arabic-lesson10.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 10",
      "explanation": "Arabic Day 10 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরবী ব্যাকরণে “মালিকানা গঠন” (Possession) কে কী বলা হয়?",
        "options": [
          "হারফে জার ও মাজরুর",
          "মুদাফ ও মুদাফ ইলাইহি (Mudaf & Mudaf Ilayh)",
          "ইশারা ও বাদাল",
          "মুক্তাদা ও খাবার"
        ],
        "correctAnswer": 1,
        "explanation": "আরবী ব্যাকরণে মালিকানা বা সম্বন্ধবাচক গঠনকে “মুদাফ ও মুদাফ ইলাইহি” বলা হয়।"
      },
      {
        "question": "মুদাফ (Mudaf - প্রথম শব্দ) এর ক্ষেত্রে নিচের কোন নিয়মটি প্রযোজ্য?",
        "options": [
          "শব্দের শুরুতে ال বসে এবং শেষে জের হয়",
          "শব্দের শুরুতে ال বসে না এবং শেষে তানউইন হয় না",
          "শব্দটি সবসময় স্ত্রীবাচক হয়",
          "শব্দের শেষে তানউইন বসে"
        ],
        "correctAnswer": 1,
        "explanation": "মুদাফ বা সম্বন্ধযুক্ত প্রথম শব্দের শুরুতে কখনো ال বসে না এবং এর শেষে তানউইনও হয় না।"
      },
      {
        "question": "“মুহাম্মদের বই” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "اَلْكِتَابُ مُحَمَّدٍ",
          "كِتَابُ مُحَمَّدٍ (Kitaabu Muhammadin)",
          "كِتَابٌ مُحَمَّدٌ",
          "كِتَابُ مُحَمَّদٌ"
        ],
        "correctAnswer": 1,
        "explanation": "প্রথম শব্দ মুদাফ হওয়ায় তানউইন ও ال ছাড়া “كِتَابُ” এবং দ্বিতীয় শব্দ মুদাফ ইলাইহি হওয়ায় জেরযুক্ত “مُحَمَّدٍ” হয়ে সঠিক রূপ হবে “كِتَابُ مُحَمَّدٍ”।"
      },
      {
        "question": "“Baytullaahi” (بَيْتُ اللَّهِ) শব্দগুচ্ছের সঠিক বাংলা অর্থ কী?",
        "options": [
          "আল্লাহর রাসুল",
          "আল্লাহর ঘর",
          "আল্লাহর ক্ষমা",
          "আল্লাহর সৃষ্টি"
        ],
        "correctAnswer": 1,
        "explanation": "“بَيْتُ اللَّهِ” (Baytullaahi) অর্থ আল্লাহর ঘর।"
      },
      {
        "question": "“বন্ধ” (Closed) এর আরবী প্রতিশব্দ কোনটি?",
        "options": [
          "مَفْتُوحٌ (Maftuuhun)",
          "مُغْلَقٌ (Mughlaqun)",
          "مَكْسُورٌ (Maksuurun)",
          "جَالِسٌ (Jaalisun)"
        ],
        "correctAnswer": 1,
        "explanation": "“বন্ধ” বা Closed এর আরবী প্রতিশব্দ হলো “مُغْلَقٌ” (Mughlaqun)।"
      },
      {
        "question": "আরবী ব্যাকরণে মামা ও খালা এর সঠিক প্রতিশব্দ কোনটি?",
        "options": [
          "عَمٌّ - عَمَّةٌ",
          "خَالٌ - خَالَةٌ",
          "أَبٌ - أُمٌّ",
          "اِبْنٌ - بِنْتٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“خَالٌ” অর্থ মামা এবং “خَالَةٌ” অর্থ খালা।"
      },
      {
        "question": "“ইনি আমার মা সাঈদা, উনি একজন ডাক্তার।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "هٰذَا وَالِدِي عَدْنَانُ, هُوَ مُهَنْدِسٌ",
          "هٰذِهِ وَالِدَتِي سَعِيدَةُ، هِيَ طَبِيبَةٌ",
          "هٰذِهِ وَالِدَتِي سَعِيدَةُ, هِيَ مُদَرِّسَةٌ",
          "هٰذِهِ خَالَتِي"
        ],
        "correctAnswer": 1,
        "explanation": "মা স্ত্রীবাচক হওয়ায় “هٰذِهِ وَالِدَتِي سَعِيدَةُ” এবং পেসার ক্ষেত্রে “ِهيَ طَبِيبَةٌ” ব্যবহার করে সঠিক বাক্য হবে “هٰذِهِ وَالِدَتِي سَعِيدَةُ، هِيَ طَبِيبَةٌ”।"
      },
      {
        "question": "“তোমার ছেলে” (পুরুষ শ্রোতার ক্ষেত্রে) এর আরবী প্রতিশব্দ কোনটি?",
        "options": [
          "اِبْنِي (Ibnii)",
          "اِبْنُكَ (Ibnuka)",
          "اِبْنُهُ (Ibnuhu)",
          "بِنْتُكَ (Bintuka)"
        ],
        "correctAnswer": 1,
        "explanation": "পুরুষ শ্রোতার ক্ষেত্রে “তোমার ছেলে” হবে “اِبْنُكَ” (Ibnuka)।"
      },
      {
        "question": "“বইটি টেবিলের নিচে আছে।” এর সঠিক আরবী অনুবাদ কোনটি? (নিচে = تَحْتَ)",
        "options": [
          "اَلْكِتَابُ عَلَى الْمَكْتَبِ",
          "اَلْكِتَابُ تَحْتَ الْمَكْتَبِ",
          "اَلْكِتَابُ فِي الْمَسْجِدِ",
          "اَلْكِتَابُ هُنَاك"
        ],
        "correctAnswer": 1,
        "explanation": "“তহতা” (تَحْتَ) অর্থ নিচে। সঠিক বাক্যটি হলো “اَلْكِتَابُ تَحْتَ الْمَكْتَبِ”।"
      },
      {
        "question": "“রজুলুন সালিহুন” (رَجُلٌ صَالِحٌ) শব্দগুচ্ছের সঠিক বাংলা অর্থ কী?",
        "options": [
          "একজন বড় ব্যবসায়ী",
          "একজন নেককার মানুষ",
          "একজন সৎ শিক্ষক",
          "একজন দক্ষ প্রকৌশলী"
        ],
        "correctAnswer": 1,
        "explanation": "“رَجُلٌ صَالِحٌ” (Rajulun saalihun) অর্থ একজন নেককার বা ভালো মানুষ।"
      }
    ]
  },
  {
    "day": 11,
    "language": "arabic",
    "title": "Lesson 11: Arabic Reading Practice (PDF 06)",
    "description": "Expand your learning with this Day 11 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson11.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 11",
      "explanation": "Arabic Day 11 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 12,
    "language": "arabic",
    "title": "Lesson 12: MCQ Quiz Practice",
    "description": "Review integrity and influence terms in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson12.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 12",
      "explanation": "Arabic Day 12 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরবী ব্যাকরণে সাধারণত স্ত্রীবাচক শব্দের শেষে কোন চিহ্নটি থাকে?",
        "options": [
          "আলিফ তানউইন (ًا)",
          "গোল তা (ة)",
          "লম্বা তা (ত)",
          "ইয়া (ي)"
        ],
        "correctAnswer": 1,
        "explanation": "সাধারণত স্ত্রীবাচক বিশেষ্য বা গুণের শেষে গোল তা (ة) বা Taa Marbutah থাকে।"
      },
      {
        "question": "আরবী ব্যাকরণে শরীরের কোন অঙ্গগুলো সাধারণত স্ত্রীবাচক (Feminine) হিসেবে বিবেচিত হয়?",
        "options": [
          "যে অঙ্গগুলো একটি মাত্র থাকে (যেমন: নাক, মুখ)",
          "যে অঙ্গগুলো জোড়ায় জোড়ায় থাকে (যেমন: চোখ, কান, হাত, পা)",
          "হাড়ের সাথে যুক্ত অঙ্গসমূহ",
          "সবগুলোই পুরুষবাচক শব্দ"
        ],
        "correctAnswer": 1,
        "explanation": "জোড়ায় জোড়ায় বা Paired body parts (চোখ, কান, হাত, পা ইত্যাদি) ব্যাকরণগতভাবে সবসময় স্ত্রীবাচক ধরা হয়।"
      },
      {
        "question": "“এটি একটি ঘড়ি।” এর সঠিক আরবী অনুবাদ কোনটি? (ঘড়ি = سَاعَةٌ)",
        "options": [
          "هٰذَا سَاعَةٌ",
          "هٰذِهِ سَاعَةٌ (Haadhihi saa'atun)",
          "ذٰلِكَ سَاعَةٌ",
          "هٰذِهِ مِكْوَاةٌ"
        ],
        "correctAnswer": 1,
        "explanation": "ঘড়ি (سَاعَةٌ) স্ত্রীবাচক হওয়ায় সঠিক ইশারা হবে “هٰذِهِ”। অর্থাৎ “هٰذِهِ سَاعَةٌ”।"
      },
      {
        "question": "নিচের কোন শব্দটি শেষে গোল তা (ة) না থাকা সত্ত্বেও ব্যাকরণগতভাবে স্ত্রীবাচক (Feminine) शब्द?",
        "options": [
          "بَيْتٌ (Baytun)",
          "طَبِيبٌ (Tabiibun)",
          "قِدْرٌ (Qidrun)",
          "قَلَمٌ (Qalamun)"
        ],
        "correctAnswer": 2,
        "explanation": "“قِدْرٌ” (Qidrun - পাতিল) শব্দটি কোনো গোল তা ছাড়া ব্যবহৃত হলেও এটি একটি ব্যতিক্রমী স্ত্রীবাচক শব্দ।"
      },
      {
        "question": "কোনো মেয়েকে “তোমার নাম কী?” জিজ্ঞাসা করার সঠিক আরবী বাক্য কোনটি?",
        "options": [
          "مَا اسْمُكَ؟ (Maa ismuka?)",
          "مَا اسْمُكِ؟ (Maa ismuki?)",
          "مَا اسْمِي؟",
          "كَيْفَ حَالُكِ؟"
        ],
        "correctAnswer": 1,
        "explanation": "মেয়ে বা স্ত্রীবাচকের ক্ষেত্রে কাচরাহযুক্ত “مَا اسْمُكِ؟” (Maa ismuki?) ব্যবহার করা হয়।"
      },
      {
        "question": "“চামচ” এবং “ইস্ত্রি” এর সঠিক আরবী প্রতিশব্দ যুগল কোনটি?",
        "options": [
          "قِدْرٌ - سَيَّارَةٌ",
          "مِلْعَقَةٌ - مِكْوَاةٌ",
          "سَاعَةٌ - مِلْعَقَةٌ",
          "يَدٌ - رِجْلٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“مِلْعَقَةٌ” অর্থ চামচ এবং “مِكْوَاةٌ” অর্থ ইস্ত্রি (Iron)।"
      },
      {
        "question": "“هٰذَا أَنْفٌ” (এটি একটি নাক) এবং “هٰذِهِ أُذُنٌ” (এটি একটি কান) - এর মাধ্যমে ব্যাকরণের কোন নিয়মটি প্রকাশিত হয়?",
        "options": [
          "নাক পুরুষবাচক কারণ এটি একটি, কান স্ত্রীবাচক কারণ এটি জোড়ায় থাকে",
          "উভয় শব্দই ব্যাকরণগতভাবে পুরুষবাচক",
          "নাক স্ত্রীবাচক এবং কান পুরুষবাচক",
          "উভয় শব্দই ব্যাকরণগতভাবে স্ত্রীবাচক"
        ],
        "correctAnswer": 0,
        "explanation": "শরীরের একক অঙ্গগুলো (যেমন নাক - أَنْفٌ) পুরুষবাচক এবং জোড় অঙ্গগুলো (যেমন কান - أُذُنٌ) ব্যাকরণগতভাবে স্ত্রীবাচক।"
      },
      {
        "question": "কোনো নারীকে “তুমি কেমন আছো?” জিজ্ঞাসা করার সঠিক আরবী বাক্য কোনটি?",
        "options": [
          "كَيْفَ حَالُكَ؟ (Kayfa haaluka?)",
          "كَيْفَ حَالُكِ؟ (Kayfa haaluki?)",
          "كَيْفَ حَالُهُ?",
          "مَا اسْمُكِ؟"
        ],
        "correctAnswer": 1,
        "explanation": "নারী বা স্ত্রীবাচকের ক্ষেত্রে কাচরাহযুক্ত “كَيْفَ حَالُكِ؟” (Kayfa haaluki?) বলা হয়।"
      },
      {
        "question": "“আর তুমি কেমন আছো?” (কোনো মেয়েকে জিজ্ঞাসা করতে) এর সঠিক আরবী বাক্য কোনটি?",
        "options": [
          "وَكَيْفَ حَالُكَ أَنْتَ؟",
          "وَكَيْفَ حَالُكِ أَنْتِ؟",
          "كَيْفَ حَالُكِ؟",
          "وَكَيْفَ حَالُهُ؟"
        ],
        "correctAnswer": 1,
        "explanation": "স্ত্রীবাচক সর্বনাম “أَنْتِ” ব্যবহার করে সঠিক বাক্য হবে “وَكَيْفَ حَالُكِ أَنْتِ？”।"
      },
      {
        "question": "“খাদিজার গাড়ি” এর সঠিক আরবী রূপ কোনটি হবে? (গাড়ি = سَيَّارَةٌ)",
        "options": [
          "سَيَّارَةُ خَدِيجَةِ",
          "سَيَّارَةُ خَدِيجَةُ",
          "سَيَّارَةٌ خَدِيجَةَ",
          "اَلسَّيَّارَةُ خَدِيجَةُ"
        ],
        "correctAnswer": 0,
        "explanation": "মুদাফ ও মুদাফ ইলাইহি নিয়মে প্রথম শব্দে তানউইন ছাড়া পেশ এবং দ্বিতীয় শব্দের শেষে জের হয়ে সঠিক রূপ হবে “سَيَّارَةُ خَدِيجَةِ” (খাদিজার জন্য কাচরাহ)।"
      }
    ]
  },
  {
    "day": 13,
    "language": "arabic",
    "title": "Lesson 13: Arabic Reading Practice (PDF 07)",
    "description": "Deepen your Arabic practice with this Day 13 learning resource.",
    "videoUrl": "https://example.com/arabic-lesson13.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 13",
      "explanation": "Arabic Day 13 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 14,
    "language": "arabic",
    "title": "Lesson 14: MCQ Quiz Practice",
    "description": "Practice Arabic responsibility and eloquence terms.",
    "videoUrl": "https://example.com/arabic-lesson14.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 14",
      "explanation": "Arabic Day 14 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "দূরের কোনো স্ত্রীবাচক শব্দকে নির্দেশ করতে কোন আরবী শব্দ ব্যবহার করা হয়?",
        "options": [
          "ذٰلِكَ (Dhaalika)",
          "تِلْكَ (Tilka)",
          "هٰذِهِ (Haadhihi)",
          "هٰذَا (Haadhaa)"
        ],
        "correctAnswer": 1,
        "explanation": "দূরের স্ত্রীবাচক শব্দ নির্দেশ করতে “تِلْكَ” (Tilka) এবং পুরুষবাচক হলে “ذٰلِكَ” (Dhaalika) ব্যবহৃত হয়।"
      },
      {
        "question": "“ওইটি একটি ডিম।” এর সঠিক আরবী অনুবাদ কোনটি? (ডিম = بَيْضَةٌ)",
        "options": [
          "ذٰلِكَ بَيْضَةٌ",
          "تِلْكَ بَيْضَةٌ (Tilka baydatun)",
          "هٰذِهِ بَيْضَةٌ",
          "تِلْكَ بَطَّةٌ"
        ],
        "correctAnswer": 1,
        "explanation": "ডিম (بَيْضَةٌ) স্ত্রীবাচক হওয়ায় দূরের নির্দেশক “تِلْكَ” হয়ে সঠিক রূপ হবে “تِلْكَ بَيْضَةٌ”।"
      },
      {
        "question": "আরবী ব্যাকরণে “বাদাল” (Al-Badal) এর নিয়ম অনুযায়ী “هٰذَا الرَّجُلُ” (Haadhaa ar-rajulu) এর সঠিক বাংলা অর্থ কী?",
        "options": [
          "এটি একজন লোক।",
          "এই লোকটি",
          "সে একজন লোক।",
          "ওই লোকটি"
        ],
        "correctAnswer": 1,
        "explanation": "ইশারা বা নির্দেশক শব্দের পর সরাসরি ال-যুক্ত বিশেষ্য এলে সেটি পূর্ণ বাক্য না হয়ে “এই লোকটি” জাতীয় নির্দিষ্ট বাক্যাংশ প্রকাশ করে।"
      },
      {
        "question": "“এই লোকটি একজন ব্যবসায়ী।” বাক্যটির সঠিক আরবী রূপ কোনটি?",
        "options": [
          "هٰذَا الرَّجُلُ تَاجِرٌ",
          "هٰذَا رَجُلٌ تَاجِرٌ",
          "هٰذَا الرَّجُلُ مُدَرِّসٌ",
          "ذٰلِكَ الرَّজُلُ طَبِيبٌ"
        ],
        "correctAnswer": 0,
        "explanation": "“هٰذَا الرَّجُلُ” (এই লোকটি) + “تَاجِرٌ” (ব্যবসায়ী)। সঠিক বাক্যটি হলো “هٰذَا الرَّجُلُ تَاجِرٌ”।"
      },
      {
        "question": "“আমি দয়া করে একটি ফ্ল্যাট চাই।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "لَدَيْنَا شَقَّةٌ جَمِيلَةٌ",
          "أُرِيدُ شَقَّةً مِنْ فَضْلِكَ",
          "فِي أَيِّ حَيٍّ الشَّقَّةُ؟",
          "أَيْنَ الْبَيْتُ؟"
        ],
        "correctAnswer": 1,
        "explanation": "“أُرِيدُ” (আমি চাই) + “شَقَّةً” (একটি ফ্ল্যাট) + “مِنْ فَضْلِكَ” (অনুগ্রহ করে)।"
      },
      {
        "question": "“আমাদের একটি সুন্দর ফ্ল্যাট আছে।” বাক্যটির সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "أُرِيدُ شَقَّةً جَمِيلَةً",
          "لَدَيْنَا شَقَّةٌ جَمِيلَةٌ",
          "اَلشَّقَّةُ فِي حَيِّ الْمَطَارِ",
          "تِلْكَ الشَّقَّةُ قَرِيبَةٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“لَدَيْنَا” (আমাদের আছে) + “شَقَّةٌ جَمِيلَةٌ” (একটি সুন্দর ফ্ল্যাট)।"
      },
      {
        "question": "“ফ্ল্যাটটি বিমানবন্দর এলাকায়।” এর সঠিক আরবী অনুবাদ কোনটি? (বিমানবন্দর এলাকা = حَيِّ الْمَطَارِ)",
        "options": [
          "اَلشَّقَّةُ فِي حَيِّ الْمَطَارِ",
          "اَلشَّقَّةُ فِي الْفَصْلِ",
          "اَلشَّقَّةُ فِي الْبَيْتِ",
          "اَلشَّقَّةُ بَعِيدَةٌ"
        ],
        "correctAnswer": 0,
        "explanation": "“اَلشَّقَّةُ فِي حَيِّ الْمَطَارِ” (Ash-shaqqatu fii hayyil-mataari) অর্থ “ফ্ল্যাটটি বিমানবন্দর এলাকায়।”"
      },
      {
        "question": "“Qariibun” (قَرِيبٌ) এবং “Ba'iidun” (بَعِيدٌ) শব্দ দুটির বাংলা অর্থ যথাক্রমে কী?",
        "options": [
          "ভাঙা ও খোলা",
          "কাছে ও দূরে",
          "ছোট ও বড়",
          "ভালো ও খারাপ"
        ],
        "correctAnswer": 1,
        "explanation": "“قَرِيبٌ” অর্থ কাছে এবং “بَعِيدٌ” অর্থ দূরে।"
      },
      {
        "question": "“হাঁস” এবং “মুরগি” এর সঠিক আরবী শব্দ যুগল কোনটি?",
        "options": [
          "بَيْضَةٌ - دَجَاجَةٌ",
          "بَطَّةٌ - دَجَاجَةٌ",
          "شَقَّةٌ - حَيٌّ",
          "رَقْمٌ - بَطَّةٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“بَطَّةٌ” (Battatun) অর্থ হাঁস এবং “دَجَاجَةٌ” (Dajaajatun) অর্থ মুরগি।"
      },
      {
        "question": "“ওই ফ্ল্যাটটি কাছে।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "ذٰلِكَ الْبَيْتُ بَعِيدٌ",
          "تِلْكَ الشَّقَّةُ قَرِيبَةٌ",
          "هٰذِهِ الشَّقَّةُ قَرِيبَةٌ",
          "تِلْكَ الشَّقَّةُ بَعِيدَةٌ"
        ],
        "correctAnswer": 1,
        "explanation": "ফ্ল্যাট (شَقَّةٌ) স্ত্রীবাচক এবং দূরের হওয়ায় “تِلْكَ الشَّقَّةُ قَرِيبَةٌ” সঠিক আরবী বাক্য।"
      }
    ]
  },
  {
    "day": 15,
    "language": "arabic",
    "title": "Lesson 15: Arabic Reading Practice (PDF 08)",
    "description": "Continue building confidence with this Day 15 Arabic learning resource.",
    "videoUrl": "https://example.com/arabic-lesson15.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 15",
      "explanation": "Arabic Day 15 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 16,
    "language": "arabic",
    "title": "Lesson 16: MCQ Quiz Practice",
    "description": "Practice Arabic speech delivery and persuasion.",
    "videoUrl": "https://example.com/arabic-lesson16.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 16",
      "explanation": "Arabic Day 16 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "প্ররোচনা বা Persuasion বোঝাতে কোন আরবি শব্দটি সঠিক?",
        "options": [
          "Qiyadah",
          "Iqna",
          "Ilqa",
          "Nazahah"
        ],
        "correctAnswer": 1,
        "explanation": "প্ররোচনা বোঝাতে Iqna (إقناع) সঠিক।"
      },
      {
        "question": "বক্তৃতা উপস্থাপন বা Delivery বোঝাতে নিচের কোনটি সঠিক?",
        "options": [
          "Ilqa",
          "Balaghah",
          "Taathir",
          "Masuliyyah"
        ],
        "correctAnswer": 0,
        "explanation": "উপস্থাপন বোঝাতে Ilqa (إلقاء) সঠিক।"
      }
    ]
  },
  {
    "day": 17,
    "language": "arabic",
    "title": "Lesson 17: Arabic Reading Practice (PDF 09)",
    "description": "Advance your Arabic learning with this Day 17 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson17.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 17",
      "explanation": "Arabic Day 17 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 18,
    "language": "arabic",
    "title": "Lesson 18: MCQ Quiz Practice",
    "description": "Review common Arabic greetings and expressions.",
    "videoUrl": "https://example.com/arabic-lesson18.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 18",
      "explanation": "Arabic Day 18 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরби ভাষায় কুশল জিজ্ঞেস করতে নিচের কোন বাক্যটি সঠিক?",
        "options": [
          "মিন আইনা আন্তা?",
          "কাইফা হালুকা?",
          "মা ইসমুকা?",
          "আহলান ওয়া সাহলান"
        ],
        "correctAnswer": 1,
        "explanation": "কুশল বা কেমন আছো তা জিজ্ঞাসা করতে “কাইফা হালুকা?” ব্যবহৃত হয়।"
      },
      {
        "question": "পুরুষবাচক সম্বোধনে \"কেমন আছো?\" জিজ্ঞেস করতে কোনটি সঠিক?",
        "options": [
          "কাইফা হালুকা?",
          "কাইফা হালুকি?",
          "মা ইসমুকা?",
          "আনা মিনাল মাগরিব"
        ],
        "correctAnswer": 0,
        "explanation": "পুরুষের ক্ষেত্রে “কাইফা হালুকা?” ব্যবহার করা হয়।"
      }
    ]
  },
  {
    "day": 19,
    "language": "arabic",
    "title": "Lesson 19: Arabic Reading Practice (PDF 10)",
    "description": "Keep progressing with this Day 19 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson19.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 19",
      "explanation": "Arabic Day 19 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 20,
    "language": "arabic",
    "title": "Lesson 20: MCQ Quiz Practice",
    "description": "Review female greetings and answers in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson20.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 20",
      "explanation": "Arabic Day 20 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "নারীবাচক সম্বোধনে \"কেমন আছো?\" জিজ্ঞেস করতে কোনটি সঠিক?",
        "options": [
          "কাইফা হালুকা?",
          "কাইফা হালুকি?",
          "মা ইসমুকা?",
          "আনা বাংলাদেশিয়্যাতুন"
        ],
        "correctAnswer": 1,
        "explanation": "নারীদের ক্ষেত্রে “কাইফা হালুকি?” সঠিক বাক্য।"
      },
      {
        "question": "কেউ জিজ্ঞেস করল 'কাইফা হালুকা?', সঠিক উত্তর কী হবে?",
        "options": [
          "ইসমি আহমাদ",
          "আনা মিনাল উরদুন",
          "বিখাইরিন, আলহামদুলিল্লাহ",
          "আনা তালিবুন"
        ],
        "correctAnswer": 2,
        "explanation": "কেমন আছো প্রশ্নের উত্তর সাধারণত “বিখাইরিন, আলহামদুলিল্লাহ” (ভালো আছি, আলহামদুলিল্লাহ) হয়।"
      }
    ]
  },
  {
    "day": 21,
    "language": "arabic",
    "title": "Lesson 21: Arabic Reading Practice (PDF 11)",
    "description": "Reinforce your progress with this Day 21 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson21.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 21",
      "explanation": "Arabic Day 21 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 22,
    "language": "arabic",
    "title": "Lesson 22: MCQ Quiz Practice",
    "description": "Practice introducing names in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson22.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 22",
      "explanation": "Arabic Day 22 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "কারও নাম জিজ্ঞাসা করতে কোন বাক্যটি ব্যবহার করা হয়?",
        "options": [
          "মিন আইনা আন্তা?",
          "মা ইসমুকা?",
          "কাইফা হালুকা?",
          "আহলান ওয়া সাহলান"
        ],
        "correctAnswer": 1,
        "explanation": "কারও নাম জানতে চাইলে “মা ইসমুকা?” (আপনার নাম কী?) বলা হয়।"
      },
      {
        "question": "Educator জিজ্ঞেস করলেন 'মা ইসমুকা?', সঠিক উত্তর কোনটি?",
        "options": [
          "ইসমি আহমাদ",
          "আনা বিখাইরিন",
          "আনা মিনাল উরদুন",
          "আনা তালিবুন"
        ],
        "correctAnswer": 0,
        "explanation": "নামের উত্তরে “ইসমি [নাম]” (আমার নাম [নাম]) বলা হয়।"
      }
    ]
  },
  {
    "day": 23,
    "language": "arabic",
    "title": "Lesson 23: Arabic Reading Practice (PDF 12)",
    "description": "Broaden your Arabic knowledge with this Day 23 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson23.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 23",
      "explanation": "Arabic Day 23 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 24,
    "language": "arabic",
    "title": "Lesson 24: MCQ Quiz Practice",
    "description": "Practice identifying countries and origins in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson24.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 24",
      "explanation": "Arabic Day 24 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আপনি কোথা থেকে এসেছেন তা জানতে কোন প্রশ্নটি করা হয়?",
        "options": [
          "মা ইসমুকা?",
          "মিন আইনা আন্তা?",
          "কাইফা হালুকা?",
          "আহলান ওয়া সাহলান"
        ],
        "correctAnswer": 1,
        "explanation": "কোথা থেকে এসেছেন তা জানতে “মিন আইনা আন্তা?” (তুমি কোথা থেকে এসেছ?) ব্যবহৃত হয়।"
      },
      {
        "question": "কেউ জিজ্ঞেস করল 'মিন আইনা আন্তা?', সঠিক উত্তর কোনটি?",
        "options": [
          "আনা মিসর",
          "আনা মিন মিসর",
          "আনা মিসরিউন",
          "জিনসিয়াতি মিসর"
        ],
        "correctAnswer": 1,
        "explanation": "“আনা মিন মিসর” এর অর্থ “আমি মিশর থেকে এসেছি।”"
      }
    ]
  },
  {
    "day": 25,
    "language": "arabic",
    "title": "Lesson 25: Arabic Reading Practice (PDF 13)",
    "description": "Develop your Arabic skills further with this Day 25 learning resource.",
    "videoUrl": "https://example.com/arabic-lesson25.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 25",
      "explanation": "Arabic Day 25 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 26,
    "language": "arabic",
    "title": "Lesson 26: MCQ Quiz Practice",
    "description": "Practice nationalities in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson26.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 26",
      "explanation": "Arabic Day 26 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "জাতীয়তা জানতে পুরুষবাচক সম্বোধনে কোনটি সঠিক?",
        "options": [
          "মিন আইনা আন্তা?",
          "মা জিনসিয়্যাতুকা আন্তা?",
          "কাইফা হালুকা?",
          "মা ইসমুকা?"
        ],
        "correctAnswer": 1,
        "explanation": "জাতীয়তা জানতে পুরুষ সম্বোধনে “মা জিনসিয়্যাতুকা আন্তা?” ব্যবহৃত হয়।"
      },
      {
        "question": "কোনো ছাত্রী বাংলাদেশি হলে তার সঠিক জাতীয়তা প্রকাশ কোনটি?",
        "options": [
          "আনা বাংলাদেশ",
          "আনা মিন বাংলাদেশিয়্যাহ",
          "আনা বাংলাদেশিয়্যাতুন",
          "আনা বাংলাদেশিয়্যুন"
        ],
        "correctAnswer": 2,
        "explanation": "ছাত্রী (স্ত্রীলিঙ্গ) এর জাতীয়তা প্রকাশে “আনা বাংলাদেশিয়্যাতুন” সঠিক বাক্য।"
      }
    ]
  }
];
;
;
;
;
;

async function seedLessons() {
  try {
    // Clear existing lessons
    await Lesson.deleteMany({});

    // Seed English lessons
    await Lesson.insertMany(englishLessons);
    console.log('✅ English lessons seeded');

    // Seed Arabic lessons
    await Lesson.insertMany(arabicLessons);
    console.log('✅ Arabic lessons seeded');

    mongoose.connection.close();
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    mongoose.connection.close();
  }
}

seedLessons();

export const HTML_COURSE_LESSONS = [
  { id: "01", title: "HTML basics & environment setup", focus: "What HTML does, editor setup, and the basic shape of a web page", practice: "Create an index.html file and add a page title and one heading." },
  { id: "02", title: "Paragraphs & text formatting", focus: "Paragraphs and common text emphasis elements", practice: "Write a short introduction with two paragraphs and one emphasized phrase." },
  { id: "03", title: "Heading tags: h1 to h6", focus: "A clear heading hierarchy from the main page heading to smaller sections", practice: "Outline a page using one h1 and a sensible sequence of h2 and h3 headings." },
  { id: "04", title: "Images, links & line breaks", focus: "Links with a and images with img, including useful alternative text", practice: "Add one working link and one image with descriptive alt text." },
  { id: "05", title: "Forms, block/inline elements, div & span", focus: "Basic form controls and how block and inline elements differ", practice: "Build a small form with a label and input; use div and span only where useful." },
  { id: "06", title: "Ordered & unordered lists", focus: "ul, ol, and li for grouped items and ordered steps", practice: "Make a list of three interests and a numbered list of three steps." },
  { id: "07", title: "Boilerplate, Live Server & portfolio project", focus: "The standard HTML document setup, running it locally, and bringing the ideas together", practice: "Start a simple portfolio page and open it in the browser with Live Server." },
];

export const HTML_COURSE_CONTEXT = HTML_COURSE_LESSONS
  .map((lesson) => `Class ${lesson.id}: ${lesson.title}. Focus: ${lesson.focus}. Practice: ${lesson.practice}`)
  .join("\n");

const HTML_EXPLANATIONS = [
  {
    match: /\b(what is html|what does html|html do|html stand for|html mean|markup language)\b|html.*\b(ki|kake|keno|kaj)\b/i,
    english: "HTML is the markup used to describe the structure and meaning of a web page. It tells the browser what is a heading, paragraph, link, image, list, or form. CSS controls visual styling; JavaScript adds behavior.\n\nA tiny page looks like this:\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head><title>My page</title></head>\n  <body><h1>Hello!</h1><p>I made a page.</p></body>\n</html>\n```\n\nTry class 01: create `index.html`, add one heading and one paragraph, then open it in your browser.",
    bengali: "HTML দিয়ে ওয়েবপেজের গঠন ও অর্থ বোঝানো হয়। যেমন—কোনটা heading, paragraph, link, image, list বা form। CSS দিয়ে চেহারা সাজানো হয়; JavaScript দিয়ে কাজ করানো হয়।\n\nছোট একটি উদাহরণ:\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head><title>My page</title></head>\n  <body><h1>Hello!</h1><p>I made a page.</p></body>\n</html>\n```\n\nএখন class 01-এর মতো `index.html` বানিয়ে একটি heading ও paragraph যোগ করে browser-এ খোলো।",
  },
  {
    match: /\b(tag|element|attribute)\b/i,
    english: "A tag is the markup you write, such as `<p>` or `</p>`. An element is the whole piece: opening tag, content, and usually a closing tag—`<p>Hello</p>`. An attribute adds information inside the opening tag, for example `href` in `<a href=\"https://example.com\">Visit</a>`.\n\nTry spotting the tag, element, and attribute in one link from your page.",
    bengali: "Tag হলো markup-এর অংশ—যেমন `<p>` বা `</p>`। Element বলতে opening tag, ভেতরের লেখা, এবং সাধারণত closing tag—সব মিলিয়ে বোঝায়: `<p>Hello</p>`। Attribute opening tag-এ বাড়তি তথ্য দেয়; যেমন link-এর `href`।\n\nনিজের একটি link-এ tag, element আর attribute আলাদা করে দেখো।",
  },
  {
    match: /\b(heading|h1|h2|h3|h4|h5|h6)\b/i,
    english: "Use headings to show the outline of a page: `<h1>` for the main page heading, then `<h2>` for main sections and `<h3>` for a subsection inside one of those sections. Choose a level for meaning and order, not just for its default size. Usually a page has one clear `<h1>`.\n\nTry class 03: outline a page with one h1 and two h2 sections.",
    bengali: "Heading দিয়ে page-এর বিষয়গুলোর ক্রম বোঝানো হয়: মূল শিরোনামের জন্য `<h1>`, বড় section-এর জন্য `<h2>`, আর তার ভেতরের subsection-এর জন্য `<h3>`। শুধু লেখা বড় দেখানোর জন্য heading বেছে নিও না—কোন বিষয় কতটা গুরুত্বপূর্ণ তা দেখে ক্রম ঠিক করো। সাধারণত একটি page-এ একটি স্পষ্ট `<h1>` থাকে।\n\nClass 03-এর practice: একটি h1 এবং দুটি h2 দিয়ে page-এর outline বানাও।",
  },
  {
    match: /\b(paragraph|<p>|bold|italic|strong|emphasis|formatting)\b/i,
    english: "Use `<p>` for a paragraph. Use `<strong>` when the text is important and `<em>` when you want to emphasize it; these elements also carry meaning for assistive technology. For example: `<p>Please read the <strong>instructions</strong> <em>carefully</em>.</p>`. Class 02 practises paragraphs and text formatting.",
    bengali: "Paragraph-এর জন্য `<p>` ব্যবহার করো। কোনো লেখা গুরুত্বপূর্ণ বোঝাতে `<strong>`, আর জোর দিয়ে পড়ার মতো হলে `<em>` ব্যবহার করা যায়—এগুলো screen reader-ও অর্থ বুঝতে সাহায্য করে। যেমন: `<p><strong>নির্দেশনা</strong> <em>ভালো করে</em> পড়ো।</p>`। Class 02-তে paragraph ও text formatting আছে।",
  },
  {
    match: /\b(link|anchor|href|image|img|alt text|line break|<br>)\b/i,
    english: "A link uses `<a>` and an `href` destination; an image uses `<img>` with a `src` and useful `alt` text.\n```html\n<a href=\"about.html\">About me</a>\n<img src=\"profile.jpg\" alt=\"Me at the beach\">\n```\nUse `<br>` only when a line break is part of the content, not to create page spacing. This is class 04.",
    bengali: "Link বানাতে `<a>` ও তার `href` destination লাগে। Image-এর জন্য `<img>`, `src`, এবং ছবির অর্থ বোঝায় এমন `alt` text দাও।\n```html\n<a href=\"about.html\">আমার সম্পর্কে</a>\n<img src=\"profile.jpg\" alt=\"সমুদ্রসৈকতে আমার ছবি\">\n```\n`<br>` শুধু লেখার স্বাভাবিক line break-এর জন্য; page-এ ফাঁকা জায়গা বানাতে নয়। এগুলো class 04-এর বিষয়।",
  },
  {
    match: /\b(form|input|label|button|div|span|block|inline)\b/i,
    english: "A `<form>` groups controls that collect information; pair an `<input>` with a `<label>` so people know what to enter. `<div>` is a generic block container; `<span>` is a generic inline container. Use a more meaningful element when one fits, and use div/span when you only need a wrapper. This is covered in class 05.",
    bengali: "`<form>` দিয়ে তথ্য নেওয়ার control-গুলো একসঙ্গে রাখা হয়। কী লিখতে হবে বোঝাতে `<input>`-এর সঙ্গে `<label>` জুড়ে দাও। `<div>` সাধারণত block container, আর `<span>` inline container। অর্থপূর্ণ কোনো element মানালে সেটি আগে বেছে নাও; শুধু wrapper দরকার হলে div/span ব্যবহার করো। Class 05-তে এগুলো শেখানো হয়।",
  },
  {
    match: /\b(list|ul|ol|li|ordered|unordered)\b/i,
    english: "Use `<ul>` for a list where order does not matter and `<ol>` when the steps must stay in order. Each item goes in `<li>`.\n```html\n<ul><li>Read</li><li>Practise</li></ul>\n<ol><li>Open the editor</li><li>Save the file</li></ol>\n```\nClass 06 practises both list types.",
    bengali: "ক্রম জরুরি না হলে `<ul>` ব্যবহার করো; ধাপের ক্রম জরুরি হলে `<ol>`। প্রতিটি item থাকে `<li>`-এর মধ্যে।\n```html\n<ul><li>পড়ো</li><li>অনুশীলন করো</li></ul>\n<ol><li>editor খোলো</li><li>file save করো</li></ol>\n```\nClass 06-তে এই দুই ধরনের list আছে।",
  },
  {
    match: /\b(run|open|browser|live server|boilerplate|doctype|start|setup|editor)\b/i,
    english: "Create a file named `index.html` in your editor and save it. Add `<!doctype html>`, the `<html>`, `<head>`, and `<body>` structure, then open the file in a browser. Live Server can refresh the browser when you save changes. Class 01 starts with setup; class 07 brings the document boilerplate and portfolio project together.",
    bengali: "Editor-এ `index.html` নামে file বানিয়ে save করো। `<!doctype html>`, `<html>`, `<head>`, আর `<body>` structure যোগ করে file-টি browser-এ খোলো। Live Server চালু থাকলে save করার পর browser-এ পরিবর্তন দেখা সহজ হয়। Class 01 setup দিয়ে শুরু; class 07-তে boilerplate ও portfolio project একসঙ্গে করা হয়।",
  },
];

export function answerHtmlCourseQuestion(question, language = "english") {
  const selected = HTML_EXPLANATIONS.find((item) => item.match.test(question));
  if (selected) return language === "bengali" ? selected.bengali : selected.english;

  const lessonMatch = question.match(/\b(?:class|lesson|video)\s*0?([1-7])\b|ক্লাস\s*0?([1-7])/i);
  if (lessonMatch) {
    const lesson = HTML_COURSE_LESSONS[Number(lessonMatch[1] || lessonMatch[2]) - 1];
    return language === "bengali"
      ? `Class ${lesson.id}: ${lesson.title}\nএই ক্লাসে: ${lesson.focus}\nনিজে চেষ্টা করো: ${lesson.practice}\n\nভিডিও দেখে code editor-এ কাজটি করে দেখো। কোথায় আটকে গেলে সেই অংশটা লিখে জিজ্ঞেস করো।`
      : `Class ${lesson.id}: ${lesson.title}\nIn this class: ${lesson.focus}.\nTry it yourself: ${lesson.practice}\n\nFollow the video in your editor. If you get stuck, tell me which step or code is confusing.`;
  }

  return language === "bengali"
    ? `আমি Lugaish-এর Web Development course-এর ৭টি HTML class ধরে সাহায্য করতে পারি: setup, paragraph ও text, headings, links ও images, forms/div/span, lists, এবং portfolio project। তোমার প্রশ্নটা একটু নির্দিষ্ট করে বলো—যেমন “h1 আর h2-এর পার্থক্য কী?”`
    : `I can help with the seven HTML classes in Lugaish’s Web Development course: setup, paragraphs and text, headings, links and images, forms/div/span, lists, and the portfolio project. Ask about one part—for example, “What is the difference between h1 and h2?”`;
}

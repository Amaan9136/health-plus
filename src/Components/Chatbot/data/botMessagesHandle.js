// USE BELOW STATEMENT AFTER UPDATING ANY ARRAY OR ERROR
// localStorage.clear();

const userMessage = [
  /* 01 */["hi", "hey", "hello", "hlo", "hi there", "hey there"],
  /* 02 */["how are you", "how r u", "hw r u", "how are you doing", "how's it going", "how's life"],
  /* 03 */["what are you doing", "what is going on", "what is up", "wud", "what's up", "what's happening", "ok"],
  /* 04 */["how old are you"],
  /* 05 */["bye", "good bye", "take care", "enough"],
  /* 06 */["feedback", "contact", "report", "opinion", "rating", "thanks", "happy", "good", "fun", "wonderful", "fantastic", "cool", "very good", "awesome", "nice", "excellent"],
  /* 07 */["bad", "help", "bored", "tired", "not good", "feeling down", "feeling low", "i am sad", "sad"],
  /* Cancel */["cancel", "stop"],
  // More questions can be added here
];

const botReply = [
  /* 01 */["Hello! 😊", "Hi! 👋", "Hey! 👍", "Hi there! 👋"],
  /* 02 */["Fine... how are you? 😄", "Pretty well, how are you? 😊", "Fantastic, how are you? 🌟"],
  /* 03 */["Getting better. There? 😄", "Somewhat okay! 😅", "Yeah fine!🏡"],
  /* 04 */["I am always young. 👶"],
  /* 05 */["Goodbye! 👋", "Farewell! 😊", "Please take care! 🌼"],
  /* 06 */["Thanks! Try giving feedback on WhatsApp: <a style='color:blue;' href='https://wa.me/7353346164'>7353346164</a> 💬"],
  /* 07 */[
    "I'm really sorry to hear that you're feeling this way. It's important to talk to someone you trust about your feelings. ❤️",
    "You don't have to go through this alone. Reach out to friends, family, or a mental health professional for support. 🤗",
    "I'm here to listen and chat with you, but I'm not a replacement for professional help. Please consider seeking help from a therapist or counselor. 🙏",
    "Remember that it's okay to not be okay sometimes. Your feelings are valid, and there are people who care about you. 💕",
    "If you'd like, we can chat about your feelings and experiences. Sharing can sometimes help lighten the burden. 📢",
    "Depression can be a tough journey, but there is hope and help available. You're not alone in this. 🌟",
    "Is there anything specific you'd like to talk about or any questions you have? 😊",
    "I'm here to provide a listening ear. Feel free to share as much or as little as you're comfortable with. 🤗"
  ],
  /* Cancel */["Please catch me up for further assistance! 👍",
    'Feel free to update me for additional help! 🔄', 'Keep me in the loop for more assistance! 📡',
    'Let me know if you need anything else! 🛎️', 'If you have more questions, feel free to ask! 💬'],

  // More responses can be added here
];


// Ensure the number of responses in botReply matches the number of message groups in userMessage
if (botReply.length !== userMessage.length) {
  console.log("userMessage", userMessage.length)
  console.log("botReply", botReply.length);
  throw new Error("The number of message groups in botReply must match the number of message groups in userMessage.\nTRY CLEARING LOCAL STORAGE!");
}

const alternative = [
  /* 1 */ "Can you ask something else. ❓",
  /* 2 */ "Can you provide more context or ask a different question? 🧐",
  /* 3 */ "I didn't quite catch that. Could you please rephrase your question? 🤔",
  /* 4 */ "Hmm, that's a bit confusing. Could you try asking in a different way? 🤨",
  /* 5 */ "Could you try asking in a different way? 🤨",
  /* 6 */ "I'm here to help, but I need a clearer question to provide a meaningful answer. 🤷‍♂️",
  // More alternatives can be added here
];


function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const short = len1 < len2 ? len1 : len2;
  const long = len1 > len2 ? len1 : len2;
  let matchCount = 0;

  for (let i = 0; i < short; i++) {
    if (str1[i] === str2[i]) {
      matchCount++;
    }
  }
  const similarity = matchCount / long;
  return similarity;
}

function cleanInput(input) {
  return input
    .replace(/[^\w\s'"]/gi, "")
    .replace(/ a |i feel |whats|please /g, " ")
    .replace(/ please/g, "")
    .trim();
}

function isCommonWord(word) {
  const commonWords = [
    'why', 'who', 'how', 'what', 'please', 'a', 'an', 'the', 'is', 'are', 'am', 'I',
    'you', 'he', 'she', 'we', 'they', 'it', 'and', 'but', 'or', 'not', 'in', 'on',
    'your', 'my', 'their', 'his', 'her', 'its', 'our', 'with', 'without', 'at', 'by',
  ];
  return commonWords.includes(word.toLowerCase());
}

function findCategoryIndex(word) {
  return botReply.findIndex(category => category.includes(word));
}

function getRandomResponseFromCategory(categoryIndex) {
  const responses = botReply[categoryIndex];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

export function getRandomAlternativeResponse(alternativeArray = []) {
  if (alternativeArray.length > 0) {
    return alternativeArray[Math.floor(Math.random() * alternativeArray.length)];
  } else {
    return alternative[Math.floor(Math.random() * alternative.length)];
  }
}


// Use a Map for faster lookup of user messages
let userMessagesMap = new Map();
const storedUserMessagesMap = localStorage.getItem('userMessagesMap');
if (storedUserMessagesMap) {
  userMessagesMap = new Map(JSON.parse(storedUserMessagesMap));
} else {
  userMessage.forEach((messages, index) => {
    messages.forEach(message => {
      userMessagesMap.set(message.toLowerCase(), index);
    });
  });
  localStorage.setItem('userMessagesMap', JSON.stringify([...userMessagesMap]));
}

function findDirectMatch(text) {
  if (userMessagesMap.has(text)) {
    return getRandomResponseFromCategory(userMessagesMap.get(text));
  }
  return null;
}

export function findResponse(input) {
  let text = cleanInput(input);

  // Check for direct matches using the optimized function
  const directMatch = findDirectMatch(text);
  if (directMatch) {
    return directMatch;
  }

  //check each word
  const words = text.split(' ');
  for (const word of words) {
    if (isCommonWord(word)) {
      continue;
    }
    const categoryIndex = findCategoryIndex(word);
    if (categoryIndex !== -1) {
      return getRandomResponseFromCategory(categoryIndex);
    }
  }

  //check similarity
  const SIMILARITY_THRESHOLD = 0.6;
  for (let i = 0; i < userMessage.length; i++) {
    const messageGroup = userMessage[i];
    for (const message of messageGroup) {
      const similarityScore = calculateSimilarity(text, message);
      if (similarityScore >= SIMILARITY_THRESHOLD) {
        return getRandomResponseFromCategory(i);
      }
    }
  }

  return getRandomAlternativeResponse();
}

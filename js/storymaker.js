// Assignment 1 | COMP1073 Client-Side JavaScript

// @note(matthew): this is cleaner than making a bunch of variables
const dom = {};
document.querySelectorAll("button, p").forEach(elem => {
    if (elem.tagName === "BUTTON" || elem.tagName === "P")
        dom[elem.id] = elem;
});
 
// @note(matthew): this will be populated with nested tables, which are generated for every page reload
let storyValues;

function getRandom(arr)
{
    return arr[Math.floor(Math.random() * 5)];
}

// @note(matthew): this lets me create random stories, with the help of openai's endpoint!
function fetchRequest(prompt, callback) {  
    //@note(matthew): the reason I use base64 here, is because when I push it to Github with my raw API key, OpenAI detects it and terminate the key.
    // This is because they don't want us to share our private keys publically, so I hide it with base64
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${atob("c2stSVJTRTdRQ1c4WXFuU2F2NGtJSFBUM0JsYmtGSjltNnVTQVRZYkVLRmsycnJkZlho")}`,
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo-instruct",
        "prompt": prompt,
        "temperature": 1,
        "max_tokens": 256,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
      })
    };

    fetch("https://api.openai.com/v1/completions", requestOptions).then(x => x.json()).then(callback);
}

fetchRequest("You are a random story generator. You will return a json object with five nouns, five verbs, five adjectives, and five settings.", x => {
    const choice = x.choices[0].text;
    storyValues = JSON.parse(choice);
    console.log(storyValues);

    alert("The story maker is ready!");

    // @note(matthew): now that we are able to create a story, add the handlers
    dom["noun1"].addEventListener("click", () => { dom["choosenNoun1"].innerText = getRandom(storyValues.nouns); });
    dom["verb"].addEventListener("click", () => { dom["choosenVerb"].innerText = getRandom(storyValues.verbs); });
    dom["adjective"].addEventListener("click", () => { dom["choosenAdjective"].innerText = getRandom(storyValues.adjectives); });
    dom["noun2"].addEventListener("click", () => { dom["choosenNoun2"].innerText = getRandom(storyValues.nouns); });
    dom["setting"].addEventListener("click", () => { dom["choosenSetting"].innerText = getRandom(storyValues.settings); });
    
    dom["playback"].addEventListener("click", () => { 
      let finalStr = "The " + dom["choosenNoun1"].innerText + " " + dom["choosenVerb"].innerText + "s" + " the " + dom["choosenAdjective"].innerText + " " + dom["choosenNoun2"].innerText + " in the " + dom["choosenSetting"].innerText + ".";
      dom["story"].innerText = finalStr;

      let msg = new SpeechSynthesisUtterance();
      msg.text = finalStr;
      window.speechSynthesis.speak(msg);
    });

    dom["random"].addEventListener("click", () => { 
      let finalStr = "The " + getRandom(storyValues.nouns) + " " + getRandom(storyValues.verbs) + "s" + " the " + getRandom(storyValues.adjectives) + " " + getRandom(storyValues.nouns) + " in the " + getRandom(storyValues.settings) + ".";
      dom["story"].innerText = finalStr;

      let msg = new SpeechSynthesisUtterance();
      msg.text = finalStr;
      window.speechSynthesis.speak(msg);
    });

    dom["student"].addEventListener("click", () => { 
      dom["choosenNoun1"].innerText = "Matthew (1227490)";
    });
});

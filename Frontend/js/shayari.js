const baseUrl =  "https://shayari-generator-backend.onrender.com";
const defaultUrl = `${baseUrl}/api`;
const shayariUrl = `${defaultUrl}/shayari`

const generateBtn = document.getElementById("generateBtn");
const keywordInput = document.getElementById("keyword");
const shayariOutput = document.getElementById("shayariOutput");

generateBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (keyword === "") {
    return (shayariOutput.innerHTML = "");
  }

  const promptBody = {
    prompt: keyword,
  };
  generateBtn.innerHTML = `<div class="spinner"></div>`;
  requestDataFromServer(promptBody);
});

const requestDataFromServer = async (promptBody) => {
  try {
    const response = await fetch(shayariUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptBody),
    });

    const data = await response.json();

    if (response.ok) {
      generateBtn.textContent = "Generate Shayari";
      const shayari = data.content;

      // Clear previous output
      shayariOutput.innerHTML = "";

      // Type out the shayari letter by letter
      let i = 0;
      const typingEffect = setInterval(() => {
        shayariOutput.innerHTML += shayari.charAt(i);
        i++;
        if (i > shayari.length) {
          clearInterval(typingEffect);
        }
      }, 20);
    } else {
      shayariOutput.innerHTML = `<p>Error: ${data.error}</p>`;
    }
  } catch (error) {
    shayariOutput.innerHTML = `<p>Error: Something went wrong</p>`;
  }
};
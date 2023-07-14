const baseUrl = "https://shayari-generator-backend.onrender.com";
const defaultUrl = `${baseUrl}/api`;
const shayariUrl = `${defaultUrl}/shayari`;

const generateBtn = document.getElementById("generateBtn");
const keywordInput = document.getElementById("keyword");
const shayariOutput = document.getElementById("shayariOutput");
const loaderText = document.querySelector(".loaderText");

generateBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (keyword === "") {
    return (shayariOutput.innerHTML = "");
  }

  const promptBody = {
    prompt: keyword,
  };
  generateBtn.innerHTML = `<div class="spinner"></div>`;
  loaderText.style.display = "block";
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
      loaderText.style.display = "none";
      const shayari = data.content;

      // Clear previous output
      shayariOutput.innerHTML = "";

      // Display the shayari response with typewriter effect
      const shayariArray = shayari.split("");
      let i = 0;
      const typingEffect = setInterval(() => {
        shayariOutput.innerHTML += shayariArray[i];
        i++;
        if (i === shayariArray.length) {
          clearInterval(typingEffect);
        }
      }, 50);
    } else {
      shayariOutput.innerHTML = `<p>Error: ${data.error}</p>`;
    }
  } catch (error) {
    shayariOutput.innerHTML = `<p>Error: Something went wrong</p>`;
  }
};

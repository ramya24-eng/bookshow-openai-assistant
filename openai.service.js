const fs = require("fs");
const path = require('path');

// Using an absolute path, or correctly resolving relative paths
const filePath = path.join(__dirname, 'knowledge.docx');
const createAssistant = async (openai) => {
  // Assistant file path
  const assistantFilePath = "assistant.json";
  // check if file exists
  if (!fs.existsSync(assistantFilePath)) {
    // Create a file
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    });
    // Create a vector store including our file
    let vectorStore = await openai.beta.vectorStores.create({
      name: "Chat Demo",
      file_ids: [file.id],
    });
    // Create assistant
    const assistant = await openai.beta.assistants.create({
      name: "Chat Demo",
      instructions: `The assistant, Shanly Personal Assistant, has been programmed to help customers on booking show with less prices among others theatres and help to find other data likes hsow timing , availe seats , seat type and it's prices. A document has been provided with information on Shanly Personal Assistant and training info.`,
      tools: [{ type: "file_search" }],
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      model: "gpt-4o",
    });
    // Write assistant to file
    fs.writeFileSync(assistantFilePath, JSON.stringify(assistant));
    return assistant;
  } else {
    // Read assistant from file
    const assistant = JSON.parse(fs.readFileSync(assistantFilePath));
    return assistant;
  }
};
module.exports = { createAssistant };

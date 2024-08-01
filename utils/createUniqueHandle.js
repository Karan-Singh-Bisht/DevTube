const channelModel = require("../models/channelModel");

//Used to create new username or handle
async function createUniqueHandle(baseHandle) {
  let handle = baseHandle;
  if (!(await channelModel.findOne({ handle }))) return handle;
  while (await channelModel.findOne({ handle })) {
    const candidateHandles = Array.from(
      { length: 10 },
      () =>
        `${baseHandle}${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`
    );
    const existingHandles = await channelModel.find(
      {
        handle: { $in: candidateHandles },
      },
      "handle"
    );
    const existingSet = new Set(existingHandles.map((doc) => doc.handle));
    handle = candidateHandles.find((candidate) => !existingSet.has(candidate));
  }
  return handle;
}

module.exports = createUniqueHandle;

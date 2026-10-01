const getMessages = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: [],
  });
};

const addMessage = async (req, res) => {
  return res.status(201).json({
    success: true,
    data: { message: 'Message created successfully.' },
  });
};

module.exports = {
  getMessages,
  addMessage,
};

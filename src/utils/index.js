const createFileUrl = (req, filename) => {
  try {
    return `${req.protocol}://${req.get('host')}/assets/userFiles/${filename}`;
  } catch (error) {
    throw new Error(error.message);
  }
};

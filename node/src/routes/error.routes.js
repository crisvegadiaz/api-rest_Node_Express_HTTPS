const errorGet = (_, res) => {
  try {
    res.status(400).json({ error: "Route error" });
  } catch (error) {
    console.error("Route errorGet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default errorGet;

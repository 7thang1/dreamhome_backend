const corsOptions = {
  origin: process.env.FRONTEND_URL, // Replace with your frontend domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: false, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Respond with 204 (No Content) for preflight requests
};

module.exports = corsOptions;

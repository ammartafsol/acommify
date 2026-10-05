const environment = process.env.NODE_ENV || "production";
const config = {
  environment: environment,
  // apiBaseUrl: "https://3pmq3hk5-3080.inc1.devtunnels.ms", //local
  // apiBaseUrl: "https://acommify-backend-dg-92d15d66f2c3.herokuapp.com", //production
  // apiBaseUrl: "https://api.acommify.com", //production
  apiBaseUrl: "https://v2w2xmx9-3080.asse.devtunnels.ms", //local
  awsBaseUrl: "https://acommify-bucket.s3.eu-north-1.amazonaws.com",
  siteKey: "",
};

export default config;

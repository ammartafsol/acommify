const environment = process.env.NODE_ENV || "production";
const config = {
  environment: environment,
  // apiBaseUrl: "https://3pmq3hk5-3080.inc1.devtunnels.ms", //local
  // apiBaseUrl: "https://api.acommify.com", //production
  apiBaseUrl: "https://acommify-backend-dd-871df76912e4.herokuapp.com", //dev
  awsBaseUrl: "https://acommify-bucket.s3.eu-north-1.amazonaws.com",
  siteKey: "",
};

export default config;

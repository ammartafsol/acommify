const environment = process.env.NODE_ENV || "production";
const config = {
  environment: environment,
  // apiBaseUrl: "https://3pmq3hk5-3080.inc1.devtunnels.ms", //local
  // apiBaseUrl: "https://api.acommify.com", //production
  // NEXT_PUBLIC_API_BASE_URL (e.g. in .env.local) overrides for local development
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://acommify-backend-dd-871df76912e4.herokuapp.com", //dev
  awsBaseUrl: "https://acommify-bucket.s3.eu-north-1.amazonaws.com",
  siteKey: "",
};

export default config;

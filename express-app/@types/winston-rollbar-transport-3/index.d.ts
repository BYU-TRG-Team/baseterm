/// <reference types="node" />

declare module "winston-transport-rollbar-3" {
  import TransportStream from "winston-transport";

  interface WinstonRollbarTransportOptions {
    rollbarConfig: {
      accessToken: string;
    },
    level: "error" | "warn"
  }

  class WinstonRollbarTransport extends TransportStream  {
    constructor(
      options: WinstonRollbarTransportOptions
    )
  }

  export default WinstonRollbarTransport;
}

declare module "nodemailer-sendgrid-transport" {
  import SMTPTransport from "nodemailer/lib/smtp-transport";

  function transporter(
    options: {
      auth: {
        api_key: string
      }
    }
  ): SMTPTransport 

  export default transporter
}
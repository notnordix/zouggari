declare module "nodemailer" {
  export interface SendMailOptions {
    from?: string
    to?: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    subject?: string
    text?: string
    html?: string
    headers?: { [key: string]: string }
    attachments?: {
      filename?: string
      content?: string | Buffer
      path?: string
      contentType?: string
      encoding?: string
      cid?: string
    }[]
  }

  export interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<any>
  }

  export function createTransport(options: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }): Transporter
}

export const emailVerificationHtml = (verificationCode) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
          background-color: #f4f7fa;
          padding: 20px;
          margin: 0;
        }

        .container {
          max-width: 560px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px 30px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e8eb;
        }

        h2 {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 10px;
        }

        p {
          color: #4b5563;
          font-size: 15px;
          line-height: 1.6;
        }

        .code {
          display: inline-block;
          font-size: 22px;
          font-weight: 600;
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          letter-spacing: 4px;
          margin: 24px 0;
        }

        .footer {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 40px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .container {
            padding: 30px 20px;
          }

          .code {
            font-size: 20px;
            padding: 10px 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Verify Your Email</h2>
        <p>Hi there,</p>
        <p>Thanks for signing up! Use the code below to verify your email address:</p>
        <div class="code">${verificationCode}</div>
        <p>This step helps us confirm it's really you. The code is valid for a short time only.</p>
        <p>If you didn’t initiate this request, feel free to ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} License Companion. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

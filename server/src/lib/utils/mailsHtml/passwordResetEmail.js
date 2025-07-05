export const passwordResetHtml = (resetCode) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset</title>
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
          background: linear-gradient(135deg, #6366f1, #3b82f6);
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
        <h2>Reset Your Password</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Use the code below to continue:</p>
        <div class="code">${resetCode}</div>
        <p>This code is valid for the next 10 minutes.</p>
        <p>If you didn’t request a password reset, feel free to ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} License Companion. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

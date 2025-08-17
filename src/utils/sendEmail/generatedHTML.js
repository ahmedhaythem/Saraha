export const template=(code,name,subject)=>`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation Email</title>
  <style>
    body {
      background-color: #f4f4f7;
      font-family: 'Segoe UI', sans-serif;
      padding: 0;
      margin: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }

    .email-header {
      background-color: #2a9d8f;
      color: white;
      padding: 20px;
      text-align: center;
    }

    .email-body {
      padding: 30px;
      color: #333;
    }

    .email-body h2 {
      margin-top: 0;
    }

    .confirmation-code {
      background-color: #f0f0f0;
      font-size: 20px;
      font-weight: bold;
      padding: 12px;
      text-align: center;
      border-radius: 6px;
      margin: 20px 0;
      letter-spacing: 2px;
      color: #2a9d8f;
    }

    .email-footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }

    @media (max-width: 600px) {
      .email-body, .email-footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${subject}</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${name},</h2>
      <p>Thank you for signing up. Please use the confirmation code below to verify your email address:</p>
      <div class="confirmation-code">${code}</div>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="email-footer">
      &copy; 2025 Your Company Name. All rights reserved.
    </div>
  </div>
</body>
</html>
`
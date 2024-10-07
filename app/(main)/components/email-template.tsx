import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <h1
      style={{
        color: "#333",
        borderBottom: "1px solid #ccc",
        paddingBottom: "10px",
      }}
    >
      New Contact Form Submission
    </h1>
    <p style={{ fontSize: "16px", color: "#666" }}>
      You have received a new message from your contact form:
    </p>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tr>
        <td
          style={{
            padding: "10px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
          }}
        >
          Name:
        </td>
        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
          {name}
        </td>
      </tr>
      <tr>
        <td
          style={{
            padding: "10px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
          }}
        >
          Email:
        </td>
        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
          {email}
        </td>
      </tr>
      <tr>
        <td
          style={{
            padding: "10px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
          }}
        >
          Subject:
        </td>
        <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
          {subject}
        </td>
      </tr>
    </table>
    <h2 style={{ color: "#333", marginTop: "20px" }}>Message:</h2>
    <p
      style={{
        fontSize: "16px",
        lineHeight: "1.5",
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "5px",
      }}
    >
      {message}
    </p>
    <p
      style={{
        fontSize: "14px",
        color: "#999",
        marginTop: "20px",
        textAlign: "center",
      }}
    >
      This email was sent from your website&apos;s contact form.
    </p>
  </div>
);

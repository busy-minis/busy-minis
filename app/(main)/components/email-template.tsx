// components/EmailTemplate.tsx

interface EmailTemplateProps {
  firstName: string;
  message: string; // Add this line
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  firstName,
  message,
}) => {
  return (
    <div>
      <p>Hi {firstName},</p>
      <p>{message}</p>
    </div>
  );
};

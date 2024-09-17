// app/reset-password/page.tsx

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the PasswordForm component
const PasswordForm = dynamic(() => import("./PasswordForm"), {
  suspense: true,
});

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading password form...</div>}>
      <PasswordForm />
    </Suspense>
  );
}

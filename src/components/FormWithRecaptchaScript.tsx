'use client';

import { useEffect, useState } from 'react';
import { inputFields } from '@/constants/constants';

const FormWithRecaptcha = () => {
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    // Inject the reCAPTCHA v3 script manually
    const scriptId = 'recaptcha-script';
    if (document.getElementById(scriptId)) {
      setRecaptchaReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaReady(true);

    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaReady || !(window as any).grecaptcha) {
      console.error('reCAPTCHA is not ready');
      return;
    }

    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha
        .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' })
        .then(async (token: string) => {
          console.log('reCAPTCHA token:', token);

          const response = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (data.success) {
            console.log('Recaptcha verified successfully:', data.score);
            // Proceed with form submission logic
          } else {
            console.error('Recaptcha verification failed:', data.error);
            // Handle error
          }
        });
    });
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen gap-4">
      <form onSubmit={handleSubmit} className="max-w-[500px] w-full mx-auto">
        <div className="w-full flex flex-col gap-4">
          {inputFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-4 w-full">
              <label htmlFor={field.id}>{field.label}</label>
              <input
                className="w-full p-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={field.id}
                type={field.type}
                required={field.required}
                name={field.id}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-royal-blue hover:bg-dodger-blue text-white py-3! mt-10 px-6 rounded-lg font-semibold transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormWithRecaptcha;

'use client';

import { FormProps } from '@/app/types/types';
import { inputFields } from '@/constants/constants';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function TurnstileWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormProps>({
    name: "",
    email: "",
    password: ""
  });

  // Load Turnstile script once on mount and render widget immediately when ready
  useEffect(() => {
    if (document.getElementById('turnstile-script')) {
      // Script already loaded — try rendering immediately
      if ((window as any).turnstile && widgetRef.current && !rendered) {
        (window as any).turnstile.render(widgetRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          theme: 'light',
          callback: (token: string) => {
            setToken(token);
            console.log('Turnstile token:', token);
          },
          'error-callback': () => {
            console.error('Error with Turnstile');
            toast.error("Turnstile error. Please try again.");
          },
        });
        setRendered(true);
      }
      return;
    }

    // Load the script and render the widget when ready
    const script = document.createElement('script');
    script.id = 'turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).turnstile && widgetRef.current && !rendered) {
        (window as any).turnstile.render(widgetRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          theme: 'light',
          callback: (token: string) => {
            setToken(token);
            console.log('Turnstile token:', token);
          },
          'error-callback': () => {
            console.error('Error with Turnstile');
            toast.error("Turnstile error. Please try again.");
          },
        });
        setRendered(true);
      }
    };
    document.body.appendChild(script);

  }, [rendered]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please complete the verification before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token }), // include token in payload
      });

      if (!response.ok) {
        toast.error("Error del servidor");
        return;
      }

      const data = await response.json();
      if (data?.success === true) {
        setFormData({ name: "", email: "", password: "" });
        setToken(null);
        setRendered(false);
        if (widgetRef.current) widgetRef.current.innerHTML = ""; // Clear widget for next use
        toast.success("Enviado con éxito");
      } else {
        toast.error("Algo salió mal");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar el formulario.");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen gap-4 ">
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
                value={(formData as any)[field.id] ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mt-4">
          <div ref={widgetRef} className="my-2!" />
          <button
            type="submit"
            className="cursor-pointer w-full bg-royal-blue hover:bg-dodger-blue text-white py-3! mt-10 px-6 rounded-lg font-semibold transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

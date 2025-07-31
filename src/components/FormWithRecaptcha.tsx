'use client'

import { inputFields } from "@/constants/constants";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const FormWithRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!executeRecaptcha) {
      console.error("Recaptcha not ready");
      return;
    }

    const token = await executeRecaptcha("form_submit");
    console.log("Recaptcha token:", token);

    const response = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
    const data = await response.json();

    if (data.success) {
      console.log("Recaptcha verified successfully:", data.score);
      // Proceed with form submission or other actions
    } else {
      console.error("Recaptcha verification failed:", data.error);
      // Handle the failure case
    }
  }

  return (
    <div className="flex justify-center items-center flex-col min-h-screen gap-4 ">
      <form onSubmit={handleSubmit} className="max-w-[500px] w-full mx-auto">
        <div className="w-full flex flex-col gap-4">
          {inputFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-4 w-full">
              <label htmlFor={field.id}>
                {field.label}
              </label>
              <input className="w-full p-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={field.id}
                type={field.type}
                required={field.required}
                name={field.id}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="cursor-pointer w-full bg-royal-blue hover:bg-dodger-blue text-white py-3! mt-10! px-6 rounded-lg font-semibold transition-colors duration-300">
          Submit
        </button>
      </form>
    </div>
  )
}

export default FormWithRecaptcha